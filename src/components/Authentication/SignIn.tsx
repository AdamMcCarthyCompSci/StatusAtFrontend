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
import { LocationStateWithInvite } from '@/types/api';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();

  // Handle invite signup redirect and flow invitations
  useEffect(() => {
    const state = location.state as LocationStateWithInvite | null;
    if (state?.fromInviteSignup) {
      setEmail(state.email || '');
      setSuccessMessage(t('auth.accountCreatedCanSignIn'));
    }

    // Handle flow invitation context
    if (state?.flowInvite) {
      setSuccessMessage(t('auth.signingInToJoin', {
        flowName: state.flowInvite.flowName,
        tenantName: state.flowInvite.tenantName
      }));
    }

    // Handle existing user redirect from sign-up
    if (state?.message) {
      setSuccessMessage(state.message);
      setEmail(state.email || '');
    }
  }, [location.state, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    try {
      // Login mutation sets tokens and invalidates user query
      await loginMutation.mutateAsync({ email, password });

      // Fetch fresh user data to determine redirect destination
      // Tokens are guaranteed to be set by the mutation at this point
      try {
        const userData = await userApi.getCurrentUser();
        const redirectPath = getRedirectDestination(userData);
        navigate(redirectPath);
      } catch (fetchError) {
        // If user fetch fails, fallback to dashboard
        // This shouldn't happen after successful login, but handle it gracefully
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle login errors
      if (error instanceof Error) {
        setError(error.message || t('auth.loginFailed'));
      } else {
        setError(t('auth.loginFailed'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle as="h1">{t('auth.signInTitle')}</CardTitle>
          <CardDescription>
            {t('auth.signInDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
            {error && (
              <div
                className="p-3 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md"
                role="status"
                aria-live="polite"
              >
                {successMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              aria-label={loginMutation.isPending ? t('auth.signingIn') : t('auth.signInButton')}
            >
              {loginMutation.isPending ? t('auth.signingIn') : t('auth.signInButton')}
            </Button>

            <div className="text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t('auth.forgotPassword')}
              </Link>
              <div className="text-sm text-muted-foreground">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/sign-up" className="text-primary hover:underline">
                  {t('auth.signUp')}
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
