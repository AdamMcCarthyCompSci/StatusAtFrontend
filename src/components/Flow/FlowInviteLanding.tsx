import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { enrollmentApi } from '@/lib/api';
import { logger } from '@/lib/logger';

interface FlowInviteLandingProps {}

const FlowInviteLanding = ({}: FlowInviteLandingProps) => {
  const { tenantName, flowName } = useParams<{ tenantName: string; flowName: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await enrollmentApi.createPublicEnrollment(tenantName || '', flowName || '', email.trim());
      setSuccess(true);
    } catch (err: any) {
      logger.error('Failed to send invitation:', err);
      
      // Handle specific error cases
      if (err?.data?.error?.includes('A pending invite already exists')) {
        setError('An invitation has already been sent to this email address. Please check your email or try again later.');
      } else {
        setError(err?.data?.detail || err?.data?.error || 'Failed to send invitation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="lg" showText={true} />
            <CardTitle className="text-green-600">Invitation Sent!</CardTitle>
            <CardDescription>
              We've sent an invitation to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive an email invitation to join <strong>{flowName}</strong> at <strong>{tenantName}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo size="lg" showText={true} />
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            Join <strong>{flowName}</strong> at <strong>{tenantName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">{flowName}</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email address to receive an invitation to join this flow
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email.trim()}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending Invitation...' : 'Send Me an Invitation'}
            </Button>
          </form>

          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowInviteLanding;
