import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

interface FlowErrorStateProps {
  error: unknown;
}

export const FlowErrorState: React.FC<FlowErrorStateProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to Load Flow</h1>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : 'An error occurred while loading the flow.'}
        </p>
        <Button asChild>
          <Link to="/flows">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flows
          </Link>
        </Button>
      </div>
    </div>
  );
};
