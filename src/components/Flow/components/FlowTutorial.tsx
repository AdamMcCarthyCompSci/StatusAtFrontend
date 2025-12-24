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
              on the right of a step to the blue circle on the left of another
              step.
            </li>
            <li>
              <strong>Deleting Connections:</strong> Click on any connection
              line to delete it.
            </li>
            <li>
              <strong>Editing Steps:</strong> Click on a step to open the
              properties modal where you can edit its name and description.
            </li>
            <li>
              <strong>Moving Steps:</strong> Click and drag steps to reposition
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
