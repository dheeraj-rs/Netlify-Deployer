"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, Hammer } from 'lucide-react';
import { DeploymentStatus as DeployStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import tokenStorage from '@/lib/token-storage';
import { getDeploymentStatus, triggerSiteBuild, directDeploy } from '@/lib/netlify-api';

interface DeploymentStatusProps {
  deployment: DeployStatus;
  onStatusChange?: (deployment: DeployStatus) => void;
}

export function DeploymentStatus({ deployment, onStatusChange }: DeploymentStatusProps) {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(deployment.status);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isTriggeringBuild, setIsTriggeringBuild] = useState(false);
  const [isDirectDeploying, setIsDirectDeploying] = useState(false);
  const maxRetries = 3;
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let statusCheckInterval: NodeJS.Timeout;
    let checkCount = 0;
    let autoRecoveryAttempted = false;
    const maxChecks = 10;
    const stuckThreshold = 3; // Number of consecutive checks with no progress

    // Simulate gradual progress to improve user experience
    const simulateProgress = () => {
      if (currentStatus === 'queued' || currentStatus === 'building') {
        setProgress(prev => {
          // Gradually increase progress
          if (prev < 90) {
            return prev + (Math.random() * 5);
          }
          return prev;
        });
      }
    };

    // Auto-recovery function for stuck deployments
    const attemptAutoRecovery = async () => {
      if (autoRecoveryAttempted || !deployment.siteId) return;
      
      autoRecoveryAttempted = true;
      
      const token = tokenStorage.getToken();
      if (!token) return;
      
      console.log("Deployment appears stuck. Attempting auto-recovery...");
      
      try {
        toast({
          title: "Auto-recovery in progress",
          description: "Deploying directly to get your site live...",
        });
        
        // Try direct deployment as a last resort
        const deployResponse = await directDeploy(
          deployment.siteId, 
          deployment.siteName, 
          token
        );
        
        if (deployResponse) {
          setCurrentStatus('ready');
          setProgress(100);
          setDeploymentUrl(deployResponse.deploy_ssl_url || deployResponse.deploy_url);
          
          if (onStatusChange) {
            onStatusChange({
              ...deployment,
              status: 'ready',
              url: deployResponse.deploy_ssl_url || deployResponse.deploy_url
            });
          }
          
          toast({
            title: "Auto-recovery successful",
            description: "Your site has been deployed successfully!",
          });
        }
      } catch (error) {
        console.error("Auto-recovery failed:", error);
        toast({
          title: "Auto-recovery failed",
          description: "Please try manual recovery options",
          variant: "destructive",
        });
      }
    };

    const checkDeploymentStatus = async () => {
      checkCount++;
      const token = tokenStorage.getToken();
      
      // If we're missing deployment data but have been checking for a while,
      // attempt auto-recovery
      if (!token || !deployment.siteId || !deployment.deployId) {
        console.log("Missing token or Netlify deployment data", { 
          hasToken: !!token,
          siteId: deployment.siteId,
          deployId: deployment.deployId
        });
         
        if (checkCount > stuckThreshold) {
          attemptAutoRecovery();
        }
        return;
      }

      try {
        setIsLoading(true);
        console.log("Checking deployment status for:", {
          siteId: deployment.siteId,
          deployId: deployment.deployId,
          attempt: checkCount
        });
        
        const status = await getDeploymentStatus(deployment.siteId, deployment.deployId, token);
        console.log("Netlify deployment status:", status);
        setIsLoading(false);
        
        if (status.state === 'ready') {
          setCurrentStatus('ready');
          setProgress(100);
          setDeploymentUrl(status.deploy_ssl_url || status.deploy_url);
          
          if (onStatusChange) {
            onStatusChange({
              ...deployment,
              status: 'ready',
              url: status.deploy_ssl_url || status.deploy_url
            });
          }

          clearInterval(interval);
          clearInterval(progressInterval);
          
          toast({
            title: "Deployment successful",
            description: "Your site is now live!",
            variant: "default",
          });
        } else if (status.state === 'error') {
          setCurrentStatus('error');
          clearInterval(interval);
          clearInterval(progressInterval);
          
          toast({
            title: "Deployment failed",
            description: status.error_message || "An error occurred during deployment",
            variant: "destructive",
          });
          
          if (onStatusChange) {
            onStatusChange({
              ...deployment,
              status: 'error',
              error: status.error_message
            });
          }
        } else {
          // Update progress based on deployment state
          const newProgress = status.state === 'building' ? 75 : 25;
          setProgress(newProgress);
          const newStatus = status.state === 'building' ? 'building' : 'queued';
          setCurrentStatus(newStatus);
          
          if (onStatusChange) {
            onStatusChange({
              ...deployment,
              status: newStatus
            });
          }
        }

        // If we've checked too many times with no status change, attempt auto-recovery
        if (checkCount >= stuckThreshold && (status.state === 'uploading' || status.state === 'processing' || status.state === 'preparing')) {
          attemptAutoRecovery();
        }

      } catch (error) {
        console.error('Error checking deployment status:', error);
        setIsLoading(false);
        
        // If we can't check the status after multiple attempts, try auto-recovery
        if (checkCount >= stuckThreshold) {
          attemptAutoRecovery();
        }
      }
    };

    if (currentStatus === 'queued' || currentStatus === 'building') {
      // Start progress simulation
      progressInterval = setInterval(simulateProgress, 1000);
      
      // Check status every 8 seconds
      interval = setInterval(checkDeploymentStatus, 8000);
      checkDeploymentStatus();
      
      // Set up a delayed check for stuck deployments
      const stuckTimeout = setTimeout(() => {
        if (progress <= 30 && (currentStatus === 'queued' || currentStatus === 'building')) {
          // If still at low progress after delay, auto-recover
          attemptAutoRecovery();
        }
      }, 30000); // 30 seconds
      
      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
        clearTimeout(stuckTimeout);
      };
    }

    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [currentStatus, deployment, onStatusChange, toast, progress]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setCurrentStatus(deployment.status);
      toast({
        title: "Retrying deployment status check",
        description: `Attempt ${retryCount + 1} of ${maxRetries}`,
      });
    } else {
      toast({
        title: "Maximum retry attempts reached",
        description: "Please try again later or check your Netlify dashboard",
        variant: "destructive",
      });
    }
  };

  const handleTriggerBuild = async () => {
    if (!deployment.siteId) {
      toast({
        title: "Cannot trigger build",
        description: "Missing site ID. Please try deploying again.",
        variant: "destructive"
      });
      return;
    }

    const token = tokenStorage.getToken();
    if (!token) {
      toast({
        title: "Cannot trigger build",
        description: "Missing Netlify token. Please check your settings.",
        variant: "destructive"
      });
      return;
    }

    setIsTriggeringBuild(true);
    try {
      const success = await triggerSiteBuild(deployment.siteId, token);
      if (success) {
        toast({
          title: "Build triggered",
          description: "Manual build has been triggered. This may take a few minutes.",
        });
        // Reset status to queued to start checking again
        if (currentStatus === 'error') {
          setCurrentStatus('queued');
          if (onStatusChange) {
            onStatusChange({
              ...deployment,
              status: 'queued'
            });
          }
        }
      } else {
        throw new Error("Failed to trigger build");
      }
    } catch (error) {
      toast({
        title: "Build trigger failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTriggeringBuild(false);
    }
  };

  const handleDirectDeploy = async () => {
    if (!deployment.siteId) {
      toast({
        title: "Cannot perform direct deploy",
        description: "Missing site ID. Please try deploying again.",
        variant: "destructive"
      });
      return;
    }

    const token = tokenStorage.getToken();
    if (!token) {
      toast({
        title: "Cannot perform direct deploy",
        description: "Missing Netlify token. Please check your settings.",
        variant: "destructive"
      });
      return;
    }

    setIsDirectDeploying(true);
    try {
      toast({
        title: "Starting direct deployment",
        description: "Creating a basic deployment to get your site live...",
      });

      const deployResponse = await directDeploy(
        deployment.siteId, 
        deployment.siteName, 
        token
      );

      if (deployResponse) {
        toast({
          title: "Direct deployment successful",
          description: "A basic version of your site has been deployed!",
        });

        setCurrentStatus('ready');
        setProgress(100);
        setDeploymentUrl(deployResponse.deploy_ssl_url || deployResponse.deploy_url);
        
        if (onStatusChange) {
          onStatusChange({
            ...deployment,
            status: 'ready',
            url: deployResponse.deploy_ssl_url || deployResponse.deploy_url
          });
        }
      } else {
        throw new Error("Failed to create direct deployment");
      }
    } catch (error) {
      toast({
        title: "Direct deployment failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDirectDeploying(false);
    }
  };

  return (
    <div className="rounded-lg border border-border p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <StatusIcon status={currentStatus} />
          <div>
            <h3 className="text-lg font-medium">
              {getStatusTitle(currentStatus)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription(currentStatus, deployment.siteName)}
            </p>
          </div>
        </div>
        
        {(currentStatus === 'queued' || currentStatus === 'building') && (
          <div className="space-y-2">
            <Progress value={progress} className={isLoading ? "animate-pulse" : ""} />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{isLoading ? "Checking status..." : "Deployment in progress"}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
        
        {currentStatus === 'ready' && deploymentUrl && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Your site is live at:</p>
            <div className="flex items-center space-x-2">
              <code className="bg-muted px-2 py-1 rounded text-sm flex-1 truncate">
                {deploymentUrl}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(deploymentUrl, '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                Visit
              </Button>
            </div>
          </div>
        )}
        
        {currentStatus === 'error' && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              {deployment.error || "An unknown error occurred during deployment."}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {retryCount < maxRetries && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  {isLoading ? "Checking..." : "Retry status check"}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerBuild}
                disabled={isTriggeringBuild || !deployment.siteId}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isTriggeringBuild ? "Triggering..." : "Trigger manual build"}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleDirectDeploy}
                disabled={isDirectDeploying || !deployment.siteId}
              >
                <Hammer className="w-4 h-4 mr-2" />
                {isDirectDeploying ? "Deploying..." : "Force direct deploy"}
              </Button>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
              <p className="font-medium mb-1">Deployment Troubleshooting:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Try "Retry status check" first to see if deployment has completed</li>
                <li>Use "Trigger manual build" to restart the build process</li>
                <li>As a last resort, use "Force direct deploy" to create a basic deployment</li>
              </ol>
            </div>
          </div>
        )}
        
        {currentStatus === 'queued' && progress <= 30 && progress > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
            <p className="font-medium">Deployment Tips:</p>
            <p>If deployment seems stuck at 25%, you may need to use the manual options once it times out.</p>
          </div>
        )}
        
        {(currentStatus === 'ready' || currentStatus === 'error') && deployment.siteId && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerBuild}
                disabled={isTriggeringBuild}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isTriggeringBuild ? "Triggering..." : "Trigger manual build"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDirectDeploy}
                disabled={isDirectDeploying}
                className="flex-1"
              >
                <Hammer className="w-4 h-4 mr-2" />
                {isDirectDeploying ? "Deploying..." : "Force direct deploy"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: DeployStatus['status'] }) {
  switch (status) {
    case 'ready':
      return <CheckCircle className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />;
    case 'error':
      return <XCircle className="w-6 h-6 text-destructive animate-in zoom-in duration-300" />;
    case 'queued':
    case 'building':
    default:
      return <Clock className="w-6 h-6 text-orange-500 animate-pulse" />;
  }
}

function getStatusTitle(status: DeployStatus['status']): string {
  switch (status) {
    case 'queued':
      return 'Deployment queued';
    case 'building':
      return 'Building your site';
    case 'ready':
      return 'Deployment successful';
    case 'error':
      return 'Deployment failed';
    default:
      return 'Processing deployment';
  }
}

function getStatusDescription(status: DeployStatus['status'], siteName: string): string {
  switch (status) {
    case 'queued':
      return 'Your deployment is in the queue and will start soon...';
    case 'building':
      return 'Building and optimizing your site...';
    case 'ready':
      return `Your site ${siteName}.netlify.app is now live!`;
    case 'error':
      return 'There was a problem with your deployment.';
    default:
      return 'Processing your deployment...';
  }
}