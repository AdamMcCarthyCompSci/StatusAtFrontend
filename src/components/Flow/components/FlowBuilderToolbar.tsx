import React from 'react';
import {
  ArrowLeft,
  Plus,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Trash2,
  Users,
  Menu,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { FlowStep } from '../types';
import { NodeSelector } from './NodeSelector';

interface FlowBuilderToolbarProps {
  flowName: string;
  steps: FlowStep[];
  selectedNodeId: string | null;
  enableRealtime: boolean;
  showMinimap: boolean;
  onCreateNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
  // eslint-disable-next-line no-unused-vars
  onJumpToNode: (step: FlowStep) => void;
  // eslint-disable-next-line no-unused-vars
  onToggleRealtime: (enabled: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onToggleMinimap: (show: boolean) => void;
  onOrganizeFlow: () => void;
  isOrganizing?: boolean;
}

export const FlowBuilderToolbar: React.FC<FlowBuilderToolbarProps> = ({
  flowName,
  steps,
  selectedNodeId,
  enableRealtime,
  showMinimap,
  onCreateNode,
  onDeleteNode,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  onJumpToNode,
  onToggleRealtime,
  onToggleMinimap,
  onOrganizeFlow,
  isOrganizing = false,
}) => {
  return (
    <div className="flex-shrink-0 border-b bg-background">
      <div className="px-2 py-2 sm:px-4 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between xl:hidden">
          {/* Left side - Back button and title */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/flows">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Back</span>
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-foreground sm:text-lg">
                {flowName}
              </h1>
            </div>
          </div>

          {/* Right side - Mobile menu */}
          <div className="flex items-center gap-1">
            {/* Primary actions always visible */}
            <Button size="sm" onClick={onCreateNode}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Node</span>
            </Button>

            {selectedNodeId && (
              <Button variant="destructive" size="sm" onClick={onDeleteNode}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Node</span>
              </Button>
            )}

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
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">More options</span>
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
                <DropdownMenuItem onClick={onResetView}>
                  <Move className="mr-2 h-4 w-4" />
                  Reset View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFitToView}>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Fit to View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onOrganizeFlow}
                  disabled={isOrganizing}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isOrganizing ? 'Organizing...' : 'Organize Flow'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleMinimap(!showMinimap)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {showMinimap ? 'Minimap On' : 'Minimap Off'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleRealtime(!enableRealtime)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {enableRealtime ? 'Live Mode' : 'Offline Mode'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden xl:block">
          {/* Two Row Grid Layout */}
          <div className="grid w-full grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1">
            {/* Left Column - Back button (row 1) and Flow name (row 2) */}
            <div className="col-start-1 row-start-1 flex items-center">
              <Button variant="outline" size="sm" asChild className="h-8">
                <Link to="/flows">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Flows
                </Link>
              </Button>
            </div>
            <div className="col-start-1 row-start-2 flex items-center">
              <h1 className="whitespace-nowrap text-lg font-semibold text-foreground">
                {flowName}
              </h1>
            </div>

            {/* Middle Column - View and Navigation Controls (spans both rows) */}
            <div className="col-start-2 row-span-2 flex items-center justify-start gap-2">
              <div className="mr-1 h-16 w-px bg-border" />
              {/* Zoom Controls - Stacked */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-8"
                >
                  <ZoomIn className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">Zoom In</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-8"
                >
                  <ZoomOut className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">Zoom Out</span>
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetView}
                  className="h-8"
                >
                  <Move className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">Reset View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFitToView}
                  className="h-8"
                >
                  <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">Fit to View</span>
                </Button>
              </div>

              <div className="mx-1 h-16 w-px bg-border" />

              {/* Node Navigation */}
              <NodeSelector
                steps={steps}
                onJumpToNode={onJumpToNode}
                variant="desktop"
              />
            </div>

            {/* Right Column - Action Controls (spans both rows) */}
            <div className="col-start-3 row-span-2 flex items-center gap-2">
              {selectedNodeId && (
                <Button variant="destructive" onClick={onDeleteNode} size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Node
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={onOrganizeFlow}
                disabled={isOrganizing}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isOrganizing ? 'Organizing...' : 'Organize'}
              </Button>

              <Button
                variant={showMinimap ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleMinimap(!showMinimap)}
                title={showMinimap ? 'Hide minimap' : 'Show minimap'}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showMinimap ? 'Minimap' : 'Minimap'}
              </Button>

              <Button
                variant={enableRealtime ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleRealtime(!enableRealtime)}
                title={
                  enableRealtime
                    ? 'Real-time collaboration enabled'
                    : 'Enable real-time collaboration'
                }
              >
                <Users className="mr-2 h-4 w-4" />
                {enableRealtime ? 'Live' : 'Offline'}
              </Button>

              <div className="mx-1 h-16 w-px bg-border" />

              {/* Add Node - Spans both rows */}
              <Button
                onClick={onCreateNode}
                className="flex h-16 min-w-[140px] flex-col items-center justify-center gap-1 px-6 py-3"
              >
                <Plus className="h-6 w-6" />
                <span className="text-base font-semibold">Add Node</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
