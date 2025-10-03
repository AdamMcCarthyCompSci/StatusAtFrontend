import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MapPin, Search, X } from 'lucide-react';
import { FlowStep } from '../types';

interface NodeSelectorProps {
  steps: FlowStep[];
  onJumpToNode: (step: FlowStep) => void;
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  steps,
  onJumpToNode,
  variant = 'desktop',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter steps based on search term
  const filteredSteps = useMemo(() => {
    if (!searchTerm.trim()) return steps;
    
    return steps.filter(step =>
      step.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [steps, searchTerm]);

  // Reset selected index when filtered steps change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredSteps]);

  const handleNodeSelect = (step: FlowStep) => {
    onJumpToNode(step);
    setIsOpen(false);
    setSearchTerm(''); // Clear search after selection
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm(''); // Clear search when closing
      setSelectedIndex(0);
    }
    // Remove aggressive auto-focus - let users focus manually if needed
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSteps.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredSteps.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredSteps[selectedIndex]) {
          handleNodeSelect(filteredSteps[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={className}
          title={variant === 'mobile' ? 'Go to Node' : undefined}
        >
          <MapPin className="h-4 w-4" />
          {variant === 'desktop' && (
            <>
              <span className="ml-2">Go to Node</span>
            </>
          )}
          {variant === 'mobile' && (
            <span className="sr-only">Go to Node</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={variant === 'mobile' ? 'end' : 'start'} 
        className="w-64"
        sideOffset={5}
      >
        {/* Search Input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-8 pr-8 h-8"
              onClick={() => searchInputRef.current?.focus()} // Only focus when user clicks in search area
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Node List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredSteps.length > 0 ? (
            filteredSteps.map((step, index) => (
              <DropdownMenuItem
                key={step.id}
                onClick={() => handleNodeSelect(step)}
                className={`cursor-pointer px-3 py-2 ${
                  index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{step.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
              {searchTerm ? 'No nodes found' : 'No nodes available'}
            </div>
          )}
        </div>

        {/* Footer with count */}
        {steps.length > 0 && (
          <div className="px-3 py-2 border-t text-xs text-muted-foreground text-center">
            {filteredSteps.length} of {steps.length} nodes
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
