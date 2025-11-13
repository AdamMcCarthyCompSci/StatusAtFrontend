import React from 'react';
import { ArrowLeft, Plus, ZoomIn, ZoomOut, Move, Maximize2, Trash2, Users, Menu, Eye, Sparkles } from 'lucide-react';
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
  onJumpToNode: (step: FlowStep) => void;
  onToggleRealtime: (enabled: boolean) => void;
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
    <div className="border-b bg-background flex-shrink-0">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex xl:hidden items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/flows">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">Back</span>
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
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
                <DropdownMenuItem onClick={onOrganizeFlow} disabled={isOrganizing}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isOrganizing ? 'Organizing...' : 'Organize Flow'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleMinimap(!showMinimap)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showMinimap ? "Minimap On" : "Minimap Off"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleRealtime(!enableRealtime)}>
                  <Users className="h-4 w-4 mr-2" />
                  {enableRealtime ? "Live Mode" : "Offline Mode"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden xl:block">
          {/* Top Row - Title and Navigation */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/flows">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Flows
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold text-foreground">
                Flow Builder: {flowName}
              </h1>
            </div>
            
            {/* Primary Actions - Top Right */}
            <div className="flex items-center gap-2">
              <Button onClick={onCreateNode}>
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              
              {selectedNodeId && (
                <Button variant="destructive" onClick={onDeleteNode}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row - Controls */}
          <div className="flex items-center justify-between">
            {/* Left Side - Canvas Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onZoomOut}>
                <ZoomOut className="h-4 w-4 mr-2" />
                Zoom Out
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onZoomIn}>
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom In
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onResetView}>
                <Move className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onFitToView}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Fit to View
              </Button>
              
              <div className="h-6 w-px bg-border mx-2" />
              
              <Button variant="outline" size="sm" onClick={onOrganizeFlow} disabled={isOrganizing}>
                <Sparkles className="h-4 w-4 mr-2" />
                {isOrganizing ? 'Organizing...' : 'Organize'}
              </Button>
            </div>
            
            {/* Right Side - View and Navigation Controls */}
            <div className="flex items-center gap-2">
              {/* View Controls */}
              <Button 
                variant={showMinimap ? "default" : "outline"} 
                size="sm"
                onClick={() => onToggleMinimap(!showMinimap)}
                title={showMinimap ? "Hide minimap" : "Show minimap"}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showMinimap ? "Minimap On" : "Minimap Off"}
              </Button>
              
              {/* Real-time Collaboration Toggle */}
              <Button 
                variant={enableRealtime ? "default" : "outline"} 
                size="sm"
                onClick={() => onToggleRealtime(!enableRealtime)}
                title={enableRealtime ? "Real-time collaboration enabled" : "Enable real-time collaboration"}
              >
                <Users className="h-4 w-4 mr-2" />
                {enableRealtime ? "Live Mode" : "Offline Mode"}
              </Button>

              {/* Node Navigation */}
              <NodeSelector
                steps={steps}
                onJumpToNode={onJumpToNode}
                variant="desktop"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
