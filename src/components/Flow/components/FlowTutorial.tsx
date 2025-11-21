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
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Flow Builder Tutorial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="ml-4 list-outside list-disc space-y-2 text-sm">
            <li>
              <strong>Creating Connections:</strong> Drag from the blue circle
              on the right of a node to the blue circle on the left of another
              node.
            </li>
            <li>
              <strong>Deleting Connections:</strong> Click on any connection
              line to delete it.
            </li>
            <li>
              <strong>Renaming Nodes:</strong> Double-click on a node to edit
              its name.
            </li>
            <li>
              <strong>Moving Nodes:</strong> Click and drag nodes to reposition
              them.
            </li>
            <li>
              <strong>Canvas Navigation:</strong> Click and drag empty space to
              pan, scroll to zoom.
            </li>
          </ul>
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
