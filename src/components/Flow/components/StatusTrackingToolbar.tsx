import React from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Move, Maximize2, Menu, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { FlowStep } from '../types';
import { NodeSelector } from './NodeSelector';

interface StatusTrackingToolbarProps {
  flowName: string;
  steps: FlowStep[];
  currentStep?: FlowStep;
  enrollmentData?: {
    current_step_name: string;
    created_at: string;
    tenant_name: string;
  };
  showMinimap: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
  onJumpToNode: (step: FlowStep) => void;
  onToggleMinimap: (show: boolean) => void;
}

export const StatusTrackingToolbar: React.FC<StatusTrackingToolbarProps> = ({
  flowName,
  steps,
  currentStep,
  enrollmentData,
  showMinimap,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  onJumpToNode,
  onToggleMinimap,
}) => {
  return (
    <>
      {/* Mobile Layout (xl:hidden) */}
      <div className="flex xl:hidden items-center justify-between p-4 bg-background border-b sticky top-16 z-20 flex-shrink-0">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold truncate">{flowName}</h1>
            {currentStep && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">Current:</span>
                <Badge variant="secondary" className="text-xs">{currentStep.name}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Mobile menu */}
        <div className="flex items-center gap-1">
          {/* Node Navigation - Mobile */}
          {steps.length > 0 && (
            <NodeSelector
              steps={steps}
              onJumpToNode={onJumpToNode}
              variant="mobile"
              className="px-2"
            />
          )}
          
          {/* Mobile menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onResetView}>
                <Move className="h-4 w-4 mr-2" />
                Reset View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFitToView}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Fit to View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleMinimap(!showMinimap)}>
                {showMinimap ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showMinimap ? "Hide Minimap" : "Show Minimap"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout (hidden xl:block) */}
      <div className="hidden xl:block bg-background border-b sticky top-16 z-20 flex-shrink-0">
        <div className="px-6 py-4">
          {/* Top Row - Title and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{flowName}</h1>
                {enrollmentData && (
                  <p className="text-sm text-muted-foreground">
                    Status Tracking in {enrollmentData.tenant_name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Current Step Status */}
            {currentStep && (
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">Current Step:</span>
                  <Badge variant="secondary">{currentStep.name}</Badge>
                </div>
                {enrollmentData && (
                  <div className="text-xs text-muted-foreground">
                    Started: {new Date(enrollmentData.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row - Controls */}
          <div className="flex items-center justify-between">
            {/* Left side - Canvas controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" onClick={onResetView}>
                <Move className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm" onClick={onFitToView}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Fit to View
              </Button>
            </div>

            {/* Right side - View controls and navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onToggleMinimap(!showMinimap)}
              >
                {showMinimap ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showMinimap ? "Minimap On" : "Minimap Off"}
              </Button>

              {/* Node Navigation - Desktop */}
              {steps.length > 0 && (
                <NodeSelector
                  steps={steps}
                  onJumpToNode={onJumpToNode}
                  variant="desktop"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
