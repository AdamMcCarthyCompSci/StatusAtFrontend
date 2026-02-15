import React from 'react';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Menu,
  Eye,
  EyeOff,
} from 'lucide-react';
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
    identifier?: string;
  };
  showMinimap: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
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
  onFitToView,
  onJumpToNode,
  onToggleMinimap,
}) => {
  return (
    <>
      {/* Mobile Layout (xl:hidden) */}
      <div className="sticky top-16 z-20 flex flex-shrink-0 items-center justify-between border-b bg-background p-4 xl:hidden">
        {/* Left side - Back button and title */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold">{flowName}</h1>
            {currentStep && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Current:
                  </span>
                  <Badge
                    variant="secondary"
                    className="max-w-[150px] truncate text-xs"
                    title={currentStep.name}
                  >
                    {currentStep.name}
                  </Badge>
                </div>
                {enrollmentData?.identifier && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">ID:</span>
                    <span className="text-xs font-medium">
                      {enrollmentData.identifier}
                    </span>
                  </div>
                )}
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
                <ZoomIn className="mr-2 h-4 w-4" />
                Zoom In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onZoomOut}>
                <ZoomOut className="mr-2 h-4 w-4" />
                Zoom Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFitToView}>
                <Maximize2 className="mr-2 h-4 w-4" />
                Fit to View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleMinimap(!showMinimap)}>
                {showMinimap ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {showMinimap ? 'Hide Minimap' : 'Show Minimap'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Layout (hidden xl:block) */}
      <div className="sticky top-16 z-20 hidden flex-shrink-0 border-b bg-background xl:block">
        <div className="px-6 py-4">
          {/* Top Row - Title and Status */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{flowName}</h1>
                {enrollmentData && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Status Tracking in {enrollmentData.tenant_name}
                    </p>
                    {enrollmentData.identifier && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          ID: {enrollmentData.identifier}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Current Step Status */}
            {currentStep && (
              <div className="text-right">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current Step:
                  </span>
                  <Badge
                    variant="secondary"
                    className="max-w-[200px] truncate"
                    title={currentStep.name}
                  >
                    {currentStep.name}
                  </Badge>
                </div>
                {enrollmentData && (
                  <div className="text-xs text-muted-foreground">
                    Started:{' '}
                    {new Date(enrollmentData.created_at).toLocaleDateString()}
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
                <ZoomIn className="mr-2 h-4 w-4" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" onClick={onZoomOut}>
                <ZoomOut className="mr-2 h-4 w-4" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" onClick={onFitToView}>
                <Maximize2 className="mr-2 h-4 w-4" />
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
                {showMinimap ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {showMinimap ? 'Minimap On' : 'Minimap Off'}
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
