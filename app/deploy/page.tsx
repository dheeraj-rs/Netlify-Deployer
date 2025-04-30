"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Grid2X2, List, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

import { TemplateCard } from '@/components/deploy/template-card';
import { DeployForm } from '@/components/deploy/deploy-form';
import { DeploymentStatus } from '@/components/deploy/deployment-status';
import { DeploymentHistory } from '@/components/deploy/deployment-history';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Template, DeploymentStatus as DeployStatus } from '@/lib/types';
import { templates, getAllCategories, getAllTags } from '@/lib/templates-data';
import tokenStorage from '@/lib/token-storage';
import deploymentStore from '@/lib/deployment-store';
import { useToast } from '@/hooks/use-toast';

enum DeployStep {
  SELECT_TEMPLATE,
  CONFIGURE_DEPLOYMENT,
  DEPLOYMENT_STATUS
}

export default function DeployPage() {
  const [step, setStep] = useState<DeployStep>(DeployStep.SELECT_TEMPLATE);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeDeployment, setActiveDeployment] = useState<DeployStatus | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<DeployStatus[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  const { toast } = useToast();
  
  // Check if token exists
  useEffect(() => {
    const hasToken = tokenStorage.hasToken();
    if (!hasToken) {
      toast({
        title: "Netlify Token Required",
        description: "Please add your Netlify Personal Access Token to continue",
      });
      
      router.push('/deploy/token');
    }
    
    // Load deployment history
    setDeploymentHistory(deploymentStore.getAllDeployments());
  }, [router, toast]);
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setStep(DeployStep.CONFIGURE_DEPLOYMENT);
  };
  
  const handleBack = () => {
    setSelectedTemplate(null);
    setStep(DeployStep.SELECT_TEMPLATE);
  };
  
  const handleDeploy = async (templateId: string, siteName: string, netlifyData?: {
    siteId: string;
    deployId: string;
    url?: string;
  }): Promise<void> => {
    try {
      // Create a new deployment object with Netlify data if available
      const newDeployment: DeployStatus = {
        id: uuidv4(),
        status: 'queued',
        createdAt: new Date().toISOString(),
        siteName,
        templateId,
        // Add Netlify data if available
        ...(netlifyData && {
          siteId: netlifyData.siteId,
          deployId: netlifyData.deployId,
          url: netlifyData.url
        })
      };
      
      // Log for debugging
      console.log("Creating deployment with data:", newDeployment);
      
      // Add to store and update state
      deploymentStore.addDeployment(newDeployment);
      setActiveDeployment(newDeployment);
      setDeploymentHistory(deploymentStore.getAllDeployments());
      
      // Move to status step
      setStep(DeployStep.DEPLOYMENT_STATUS);
      
      // Show a toast
      toast({
        title: "Deployment initiated",
        description: `Deploying ${siteName} to Netlify...`
      });
    } catch (error) {
      console.error('Error starting deployment:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const handleDeploymentStatusChange = (updatedDeployment: DeployStatus) => {
    // Update in store
    deploymentStore.updateDeployment(updatedDeployment.id, updatedDeployment);
    
    // Update active deployment
    setActiveDeployment(updatedDeployment);
    
    // Refresh history
    setDeploymentHistory(deploymentStore.getAllDeployments());
  };
  
  return (
    <div className="container mx-auto py-4">
      {step === DeployStep.SELECT_TEMPLATE && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Templates</h1>
              <p className="text-muted-foreground mt-1">
                Select a template to deploy to Netlify
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              
              <div className="border rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="px-2"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="px-2"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="templates" className="w-full">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="history">Deployment History</TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="mt-6">
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <DeploymentHistory deployments={deploymentHistory} />
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {step === DeployStep.CONFIGURE_DEPLOYMENT && selectedTemplate && (
        <DeployForm
          template={selectedTemplate}
          onBack={handleBack}
          onDeploy={handleDeploy}
        />
      )}
      
      {step === DeployStep.DEPLOYMENT_STATUS && activeDeployment && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              Back to templates
            </Button>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold">Deployment Status</h2>
            <p className="text-muted-foreground mt-1">
              Tracking the status of your Netlify deployment
            </p>
          </div>
          
          <DeploymentStatus 
            deployment={activeDeployment}
            onStatusChange={handleDeploymentStatusChange}
          />
        </div>
      )}
    </div>
  );
}