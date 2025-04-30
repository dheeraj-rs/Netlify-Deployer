import Link from 'next/link';
import { ArrowRightIcon, RocketIcon, CodeIcon, ServerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RocketIcon className="h-6 w-6" />
            <span className="font-bold text-lg">Netlify Deployer</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/deploy" className="text-sm font-medium hover:text-primary transition-colors">
              Deploy
            </Link>
            <Link href="/deploy/token" className="text-sm font-medium hover:text-primary transition-colors">
              API Token
            </Link>
            <Button asChild variant="netlify">
              <Link href="/deploy">
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Deploy to Netlify with a <span className="text-[#00AD9F]">single click</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Streamline your deployment workflow with our one-click Netlify deployment solution.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button asChild size="lg" variant="netlify">
                    <Link href="/deploy">
                      Start Deploying
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/deploy/token">
                      Setup API Token
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="rounded-xl overflow-hidden shadow-2xl border">
                  <img 
                    src="https://images.pexels.com/photos/4974912/pexels-photo-4974912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Deployment Dashboard" 
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white dark:bg-card rounded-full p-3 shadow-lg border transform rotate-12 transition-transform hover:rotate-0">
                  <RocketIcon className="h-6 w-6 text-[#00AD9F]" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-muted/50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our one-click deployment solution simplifies the process of deploying your static sites and web applications to Netlify.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<CodeIcon className="h-10 w-10 text-[#00AD9F]" />}
                title="Choose a Template"
                description="Select from our pre-configured templates to get started quickly"
              />
              <FeatureCard 
                icon={<ServerIcon className="h-10 w-10 text-[#00AD9F]" />}
                title="Configure Deployment"
                description="Customize your site name and deployment settings"
              />
              <FeatureCard 
                icon={<RocketIcon className="h-10 w-10 text-[#00AD9F]" />}
                title="Deploy Instantly"
                description="Watch your site go live with just a single click"
              />
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <img 
                  src="https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Deployment Process" 
                  className="rounded-xl shadow-lg border"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold">Ready to Deploy?</h2>
                <p className="text-muted-foreground">
                  Get started with our one-click deployment solution today. No more manual deployments or complex configurations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Authenticate with your Netlify Personal Access Token</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Select a template from our collection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Configure your deployment with a few simple options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full p-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Deploy with a single click and track the progress</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg" variant="netlify">
                    <Link href="/deploy">
                      Start Deploying
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <RocketIcon className="h-5 w-5" />
              <span className="font-semibold">Netlify Deployer</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Netlify Deployer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}