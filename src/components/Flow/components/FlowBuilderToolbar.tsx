import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Plus, ZoomIn, ZoomOut, Move, Maximize2, MapPin, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FlowStep } from '../types';

interface FlowBuilderToolbarProps {
  flowName: string;
  steps: FlowStep[];
  selectedNodeId: string | null;
  enableRealtime: boolean;
  onCreateNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
  onJumpToNode: (step: FlowStep) => void;
  onToggleRealtime: (enabled: boolean) => void;
}

export const FlowBuilderToolbar: React.FC<FlowBuilderToolbarProps> = ({
  flowName,
  steps,
  selectedNodeId,
  enableRealtime,
  onCreateNode,
  onDeleteNode,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  onJumpToNode,
  onToggleRealtime,
}) => {
  return (
    <div className="border-b bg-background flex-shrink-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
          
          <div className="flex items-center gap-4">
            {/* Canvas Controls */}
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
              
              {/* Node Navigation */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Go to Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {steps.map(step => (
                    <DropdownMenuItem key={step.id} onClick={() => onJumpToNode(step)}>
                      {step.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Real-time Collaboration Toggle */}
              <Button 
                variant={enableRealtime ? "default" : "outline"} 
                onClick={() => onToggleRealtime(!enableRealtime)}
                title={enableRealtime ? "Real-time collaboration enabled" : "Enable real-time collaboration"}
              >
                <Users className="h-4 w-4 mr-2" />
                {enableRealtime ? "Live" : "Offline"}
              </Button>

              {/* Node Creation */}
              <Button onClick={onCreateNode}>
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              
              {/* Node Deletion */}
              {selectedNodeId && (
                <Button variant="destructive" onClick={onDeleteNode}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
