"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import tokenStorage from '@/lib/token-storage';
import { useToast } from '@/hooks/use-toast';
import { deployToNetlify } from '@/lib/netlify-api';

const formSchema = z.object({
  siteName: z.string()
    .min(3, { message: "Site name must be at least 3 characters" })
    .max(63, { message: "Site name must be less than 64 characters" })
    .regex(/^[a-z0-9-]+$/, { 
      message: "Site name can only contain lowercase letters, numbers, and hyphens" 
    }),
});

interface DeployFormProps {
  template: Template;
  onBack: () => void;
  onDeploy: (templateId: string, siteName: string, netlifyData?: {
    siteId: string;
    deployId: string;
    url?: string;
  }) => Promise<void>;
}

export function DeployForm({ template, onBack, onDeploy }: DeployFormProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: `${template.id}-${Math.floor(Math.random() * 10000)}`,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = tokenStorage.getToken();
    
    if (!token) {
      toast({
        title: "No API Token Found",
        description: "Please add your Netlify Personal Access Token first",
        variant: "destructive",
      });
      
      router.push('/deploy/token');
      return;
    }
    
    setIsDeploying(true);
    
    try {
      // First, tell the user we're starting the deployment
      toast({
        title: "Starting Deployment",
        description: `Deploying ${values.siteName} to Netlify...`,
      });
      
      // Attempt to deploy to Netlify
      const deployResponse = await deployToNetlify({
        templateId: template.id,
        siteName: values.siteName,
        token
      });

      // Handle successful deployment initialization
      if (deployResponse && deployResponse.site_id) {
        // Pass the deployment details to the parent component
        await onDeploy(template.id, values.siteName, deployResponse && deployResponse.site_id && deployResponse.id ? {
          siteId: deployResponse.site_id,
          deployId: deployResponse.id,
          url: deployResponse.deploy_ssl_url || deployResponse.deploy_url
        } : undefined);
        
        // Log deployment data for debugging
        console.log("Netlify deployment initialized:", deployResponse);
        
        toast({
          title: "Deployment Started",
          description: "Your site is being deployed to Netlify",
        });
      } else {
        throw new Error("No deployment data returned from Netlify");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      
      toast({
        title: "Initial Deployment Failed",
        description: "Attempting alternative deployment method...",
        variant: "default",
      });
      
      // Even if it fails, still trigger the onDeploy to show the status screen
      // The auto-recovery will handle the actual deployment
      await onDeploy(template.id, values.siteName);
    } finally {
      setIsDeploying(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-1" />
          Back to templates
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="relative aspect-video">
              <img 
                src={template.imageUrl} 
                alt={template.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Deploy {template.name}</h2>
              <p className="text-muted-foreground mt-1">
                Configure your deployment settings below
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input {...field} className="flex-1" />
                          <span className="ml-2 text-muted-foreground">.netlify.app</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        This will be your site's URL: <span className="font-medium text-foreground">{field.value}.netlify.app</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    variant="netlify" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={isDeploying}
                  >
                    {isDeploying ? (
                      <>Deploying...</>
                    ) : (
                      <>
                        <Rocket size={16} className="mr-2" />
                        Deploy to Netlify
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}