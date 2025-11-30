import React, { useState, useMemo, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

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
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter steps based on search term
  const filteredSteps = useMemo(() => {
    if (!searchTerm.trim()) return steps;

    return steps.filter(step =>
      step?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [steps, searchTerm]);

  const handleNodeSelect = (step: FlowStep) => {
    onJumpToNode(step);
    setIsOpen(false);
    setSearchTerm(''); // Clear search after selection
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm(''); // Clear search when closing
    }
  };

  // Handle button click to prevent focus issues
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Completely disable all keyboard navigation - let keys pass through to parent
    e.stopPropagation();

    // Only handle Escape to close
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    // Don't auto-focus after clearing - let user decide
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${variant === 'desktop' ? 'h-8' : ''} ${className}`}
          title={variant === 'mobile' ? t('flows.goToNode') : undefined}
          onClick={handleButtonClick}
        >
          <MapPin
            className={variant === 'desktop' ? 'mr-1.5 h-3.5 w-3.5' : 'h-4 w-4'}
          />
          {variant === 'desktop' && (
            <>
              <span className="text-xs">{t('flows.goToNode')}</span>
            </>
          )}
          {variant === 'mobile' && (
            <span className="sr-only">{t('flows.goToNode')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === 'mobile' ? 'end' : 'start'}
        className="w-64"
        sideOffset={5}
        onCloseAutoFocus={e => e.preventDefault()} // Prevent stealing focus when closing
        onEscapeKeyDown={e => {
          e.preventDefault();
          setIsOpen(false);
        }}
        onKeyDown={e => {
          // Completely block all keyboard navigation in dropdown
          e.stopPropagation();
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        {/* Search Input */}
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder={t('flows.searchNodes')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 pl-8 pr-8"
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
            filteredSteps.map(step => (
              <DropdownMenuItem
                key={step.id}
                onClick={() => handleNodeSelect(step)}
                className="cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                onSelect={e => e.preventDefault()} // Prevent default focus behavior
                onKeyDown={e => e.stopPropagation()} // Block all keyboard events
              >
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {step.name || t('flows.unnamedStep')}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-2 text-center text-sm text-muted-foreground">
              {searchTerm
                ? t('flows.noNodesFound')
                : t('flows.noNodesAvailable')}
            </div>
          )}
        </div>

        {/* Footer with count */}
        {steps.length > 0 && (
          <div className="border-t px-3 py-2 text-center text-xs text-muted-foreground">
            {searchTerm
              ? t('flows.nodesMatching', {
                  filtered: filteredSteps.length,
                  total: steps.length,
                  search: searchTerm,
                })
              : t('flows.nodesCount', {
                  filtered: filteredSteps.length,
                  total: steps.length,
                })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
