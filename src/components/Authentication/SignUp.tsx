import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignup } from '@/hooks/useUserQuery';
import { inviteApi } from '@/lib/api';
import { InviteValidationResponse } from '@/types/message';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inviteData, setInviteData] = useState<InviteValidationResponse | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isValidatingInvite, setIsValidatingInvite] = useState(false);
  const navigate = useNavigate();
  const signUpMutation = useSignup();
  const [searchParams] = useSearchParams();

  // Validate invite token on component mount
  useEffect(() => {
    const token = searchParams.get('invite');
    if (token) {
      setInviteToken(token);
      setIsValidatingInvite(true);
      
      inviteApi.validateInviteToken(token)
        .then((response) => {
          if (response.valid && response.invite) {
            setInviteData(response);
            // Pre-fill email from invite
            setEmail(response.email || response.invite.email || '');
            setError('');
          } else {
            setError(response.error || 'Invalid invite token');
            setInviteData(null);
          }
        })
        .catch((error) => {
          console.error('Failed to validate invite:', error);
          setError(error?.data?.error || 'Failed to validate invite token');
          setInviteData(null);
        })
        .finally(() => {
          setIsValidatingInvite(false);
        });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const signupData = { 
        name, 
        email, 
        password, 
        marketing_consent: marketingConsent,
        ...(inviteToken && { invite_token: inviteToken })  // This processes the invite!
      };
      
      await signUpMutation.mutateAsync(signupData);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMarketingConsent(false);
      
      if (inviteData?.valid) {
        // For invite-based registration, skip email confirmation
        if (inviteData.invite_type === 'flow_enrollment') {
          setSuccess(`Account created successfully! You've been enrolled in ${inviteData.flow_name} at ${inviteData.tenant_name}. You can now sign in.`);
        } else {
          setSuccess(`Account created successfully! You've been added to ${inviteData.tenant_name}. You can now sign in.`);
        }
        // Redirect directly to sign-in page
        setTimeout(() => {
          navigate('/sign-in', { state: { email, fromInviteSignup: true } });
        }, 2000);
      } else {
        // For regular registration, require email confirmation
        setSuccess('Account created successfully! Please check your email to confirm your account, then sign in.');
        // Redirect to confirm email page with email in state
        navigate('/confirm-email', { state: { email, fromSignup: true } });
      }
    } catch (error: any) {
      setError(error?.data?.detail || error.message || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            {inviteData?.valid ? (
              inviteData.invite_type === 'flow_enrollment' ? (
                <>You've been invited to enroll in <strong>{inviteData.flow_name}</strong> at {inviteData.tenant_name}</>
              ) : (
                <>You've been invited to join <strong>{inviteData.tenant_name}</strong> as a {inviteData.role}</>
              )
            ) : (
              'Sign up for a new account to get started'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidatingInvite ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Validating invite...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md">
                  {success}
                </div>
              )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={inviteData?.valid}
                className={inviteData?.valid ? 'bg-muted cursor-not-allowed' : ''}
              />
              {inviteData?.valid && (
                <p className="text-xs text-muted-foreground">
                  Email locked from invite
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing-consent"
                checked={marketingConsent}
                onCheckedChange={setMarketingConsent}
              />
              <Label htmlFor="marketing-consent" className="text-sm">
                I agree to receive updates/emails from this app
              </Label>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
