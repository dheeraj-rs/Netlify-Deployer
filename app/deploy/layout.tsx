"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FileText, Key, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import tokenStorage from '@/lib/token-storage';

export default function DeployLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    setHasToken(tokenStorage.hasToken());
  }, [pathname]);
  
  const navItems = [
    { 
      href: '/deploy', 
      label: 'Templates', 
      icon: FileText,
      active: pathname === '/deploy'
    },
    { 
      href: '/deploy/token', 
      label: 'API Token', 
      icon: Key,
      active: pathname === '/deploy/token' 
    },
  ];
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-bold">Netlify Deployer</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                  item.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {hasToken ? (
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Connected
              </div>
            ) : (
              <div className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                Not Connected
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}