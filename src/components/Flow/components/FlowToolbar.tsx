import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ZoomIn, ZoomOut, RotateCcw, Maximize, Trash2 } from 'lucide-react';
import { FlowStep } from '../types';

interface FlowToolbarProps {
  flowName: string;
  steps: FlowStep[];
  selectedNodeId: string | null;
  onCreateNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
  onJumpToNode: (nodeId: string) => void;
}

export const FlowToolbar: React.FC<FlowToolbarProps> = ({
  flowName,
  steps,
  selectedNodeId,
  onCreateNode,
  onDeleteNode,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  onJumpToNode,
}) => {
  return (
    <div className="fixed top-16 left-4 right-4 bg-background/90 backdrop-blur border rounded-lg p-4 shadow-lg z-20 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          Flow Builder: {flowName}
        </h1>
        
        <div className="flex items-center gap-2">
          <Button onClick={onCreateNode} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </Button>
          
          {selectedNodeId && (
            <Button onClick={onDeleteNode} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Node
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Select onValueChange={onJumpToNode}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Jump to node..." />
          </SelectTrigger>
          <SelectContent>
            {steps.map((step) => (
              <SelectItem key={step.id} value={step.id}>
                {step.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1 border rounded-md">
          <Button onClick={onZoomOut} variant="ghost" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={onZoomIn} variant="ghost" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={onResetView} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={onFitToView} variant="ghost" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
