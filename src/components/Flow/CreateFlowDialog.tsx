import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFlow } from '@/hooks/useFlowQuery';
import { Plus, Loader2 } from 'lucide-react';

interface CreateFlowDialogProps {
  tenantUuid: string;
  tenantName: string;
  onSuccess?: () => void;
}

const CreateFlowDialog = ({ tenantUuid, tenantName, onSuccess }: CreateFlowDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [error, setError] = useState('');
  
  const createFlowMutation = useCreateFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!flowName.trim()) {
      setError('Flow name is required');
      return;
    }

    try {
      await createFlowMutation.mutateAsync({
        tenantUuid,
        flowData: { name: flowName.trim() }
      });
      
      // Reset form and close dialog
      setFlowName('');
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || 'Failed to create flow');
    }
  };

  const handleCancel = () => {
    setFlowName('');
    setError('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Create New Flow
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Flow</CardTitle>
          <CardDescription>
            Create a new status flow for {tenantName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="flowName">Flow Name</Label>
              <Input
                id="flowName"
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="e.g., Order Processing, Support Ticket"
                required
                disabled={createFlowMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                Choose a descriptive name for your status flow
              </p>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createFlowMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createFlowMutation.isPending || !flowName.trim()}
                className="flex-1"
              >
                {createFlowMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flow
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFlowDialog;
