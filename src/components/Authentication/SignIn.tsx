import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '@/hooks/useUserQuery';
import { userApi } from '@/lib/api';
import { getRedirectDestination } from './AuthenticatedRedirect';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  // Handle invite signup redirect and flow invitations
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromInviteSignup) {
      setEmail(state.email || '');
      setSuccessMessage('Account created successfully! You can now sign in with your new account.');
    }
    
    // Handle flow invitation context
    if (state?.flowInvite) {
      setSuccessMessage(`You're signing in to join ${state.flowInvite.flowName} at ${state.flowInvite.tenantName}`);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      
      // After successful login, we need to wait for the user data to be fetched
      // The login mutation will invalidate the user query, so we can use the current user hook
      // We'll use a small delay to ensure the user data is available
      setTimeout(async () => {
        try {
          // Fetch fresh user data to determine redirect destination
          const userData = await userApi.getCurrentUser();
          const redirectPath = getRedirectDestination(userData);
          navigate(redirectPath);
        } catch (error) {
          console.error('Failed to fetch user data for redirect:', error);
          // Fallback to dashboard
          navigate('/dashboard');
        }
      }, 100); // Small delay to ensure tokens are set
      
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md">
                {successMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
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

export default SignIn;
