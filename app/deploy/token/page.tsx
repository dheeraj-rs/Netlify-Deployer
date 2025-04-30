"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TokenForm } from '@/components/deploy/token-form';
import { Button } from '@/components/ui/button';
import tokenStorage from '@/lib/token-storage';

export default function TokenPage() {
  const router = useRouter();
  
  // Redirect to deploy page if token already exists
  useEffect(() => {
    const hasToken = tokenStorage.hasToken();
    if (hasToken) {
      router.push('/deploy');
    }
  }, [router]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/deploy')}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back to Deployments</span>
        </Button>
      </div>
      
      <TokenForm />
    </div>
  );
}