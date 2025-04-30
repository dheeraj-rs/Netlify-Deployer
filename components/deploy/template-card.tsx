"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="relative group flex flex-col rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={template.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHovering ? "scale-105" : "scale-100"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          {template.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-black/70 text-white text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col flex-grow p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <Badge variant="outline">{template.category}</Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 flex-grow">{template.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <Button variant="ghost" size="sm" className="gap-1">
            <span>Preview</span>
            <ExternalLink size={14} />
          </Button>
          
          <Button 
            variant="netlify" 
            size="sm" 
            onClick={() => onSelect(template)}
            className="gap-1"
          >
            <span>Select</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}