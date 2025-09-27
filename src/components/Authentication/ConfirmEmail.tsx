import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResendConfirmation } from '@/hooks/useUserQuery';
import { Mail } from 'lucide-react';

const ConfirmEmail = () => {
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const fromSignup = location.state?.fromSignup || false;
  
  const [email, setEmail] = useState(emailFromState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const resendConfirmationMutation = useResendConfirmation();

  // Auto-send confirmation if coming from signup
  useEffect(() => {
    if (fromSignup && email) {
      resendConfirmationMutation.mutate(email, {
        onSuccess: () => setSuccess(true),
        onError: (error: any) => setError(error.message || 'Failed to send confirmation email'),
      });
    }
  }, [fromSignup, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      await resendConfirmationMutation.mutateAsync(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to resend confirmation email');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-green-600">Confirmation Email Sent!</CardTitle>
            <CardDescription>
              Check your inbox for the confirmation link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  We've sent a new confirmation email to <strong>{email}</strong>.
                  Please check your email and click the confirmation link to activate your account.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                >
                  Send Another Email
                </Button>
              </div>
              
              <div className="text-center">
                <Link to="/sign-in" className="text-sm text-primary hover:underline">
                  Back to Sign In
                </Link>
              </div>
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
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>
            {fromSignup ? 'Check Your Email' : 'Confirm Your Email'}
          </CardTitle>
          <CardDescription>
            {fromSignup 
              ? `We're sending a confirmation email to ${email}`
              : 'Enter your email address and we\'ll send you a new confirmation link'
            }
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={resendConfirmationMutation.isPending}
            >
              {resendConfirmationMutation.isPending ? 'Sending...' : 'Send Confirmation Email'}
            </Button>
            
            <div className="text-center space-y-2">
              <Link 
                to="/sign-in" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Already confirmed? Sign in
              </Link>
              <div className="text-sm text-muted-foreground">
                Need a new account?{' '}
                <Link to="/sign-up" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
