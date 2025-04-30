"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Shield, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { verifyNetlifyToken } from '@/lib/netlify-api';
import tokenStorage from '@/lib/token-storage';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  token: z.string().min(1, { message: "Personal Access Token is required" }),
});

export function TokenForm() {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsVerifying(true);
    
    try {
      const isValid = await verifyNetlifyToken(values.token);
      
      if (isValid) {
        tokenStorage.saveToken(values.token);
        
        toast({
          title: "Token saved",
          description: "Your Netlify Personal Access Token has been saved",
        });
        
        router.push('/deploy');
      } else {
        form.setError('token', { 
          type: 'manual', 
          message: 'Invalid token. Please check and try again.' 
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Failed to verify token",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Connect to Netlify</h1>
          <p className="text-muted-foreground mt-2">
            To deploy sites directly to Netlify, you'll need to provide a Personal Access Token
          </p>
        </div>
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Securely stored</AlertTitle>
          <AlertDescription>
            Your token will be stored securely in your browser and only used for deploying to Netlify.
          </AlertDescription>
        </Alert>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">How to get your Netlify Personal Access Token:</h3>
              <ol className="ml-6 list-decimal space-y-2 text-sm">
                <li>Go to your Netlify account <a href="https://app.netlify.com/user/applications" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">User settings</a></li>
                <li>Navigate to "Applications" and scroll to "Personal access tokens"</li>
                <li>Click "New access token" and provide a description (e.g., "One-click deploy")</li>
                <li>Copy the generated token and paste it below</li>
              </ol>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Netlify Personal Access Token</FormLabel>
                  <FormControl>
                    <div className="flex items-center relative">
                      <Key className="absolute left-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field} 
                        type="password" 
                        className="pl-9"
                        placeholder="Enter your Netlify Personal Access Token" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This token will be stored in your browser's local storage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                variant="netlify" 
                size="lg" 
                disabled={isVerifying}
                className="min-w-[150px]"
              >
                {isVerifying ? 'Verifying...' : 'Connect Netlify Account'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}