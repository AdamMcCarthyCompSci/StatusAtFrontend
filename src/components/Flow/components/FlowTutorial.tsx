import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FlowTutorialProps {
  isVisible: boolean;
  connectionCount: number;
  onClose: () => void;
}

export const FlowTutorial: React.FC<FlowTutorialProps> = ({
  isVisible,
  connectionCount,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Flow Builder Tutorial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Creating Connections:</strong> Drag from the blue circle on the right of a node to the blue circle on the left of another node.</p>
            <p><strong>Deleting Connections:</strong> Click on any connection line to delete it.</p>
            <p><strong>Renaming Nodes:</strong> Double-click on a node to edit its name.</p>
            <p><strong>Moving Nodes:</strong> Click and drag nodes to reposition them.</p>
            <p><strong>Canvas Navigation:</strong> Click and drag empty space to pan, scroll to zoom.</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Current connections: {connectionCount}
          </div>
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
