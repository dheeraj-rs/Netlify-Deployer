"use client";

import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { DeploymentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface DeploymentHistoryProps {
  deployments: DeploymentStatus[];
}

export function DeploymentHistory({ deployments }: DeploymentHistoryProps) {
  if (deployments.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No deployment history yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Deployments</h2>
      
      <div className="space-y-3">
        {deployments.map((deployment) => (
          <div 
            key={deployment.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={deployment.status} />
              
              <div>
                <div className="font-medium">{deployment.siteName}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(deployment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            {deployment.url && deployment.status === 'ready' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(deployment.url, '_blank')}
              >
                <ExternalLink size={14} className="mr-2" />
                Visit
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: DeploymentStatus['status'] }) {
  switch (status) {
    case 'ready':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-destructive" />;
    case 'queued':
    case 'building':
    default:
      return <Clock className="w-5 h-5 text-orange-500" />;
  }
}