import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLogin, useGoogleLogin } from '@/hooks/useUserQuery';
import { userApi } from '@/lib/api';
import { LocationStateWithInvite } from '@/types/api';
import { logger } from '@/lib/logger';
import { trackConversion } from '@/lib/analytics';
import SEO from '@/components/seo/SEO';

import { getRedirectDestination } from './AuthenticatedRedirect';
import { GoogleSignInButton } from './GoogleSignInButton';
import { CompleteProfileModal } from './CompleteProfileModal';
import {
  autoAcceptPendingInvites,
  shouldPromptGoogleProfile,
} from './postLoginHelpers';

const SignIn = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [googleUserId, setGoogleUserId] = useState<number | null>(null);
  const [pendingRedirectPath, setPendingRedirectPath] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();

  // Handle invite signup redirect and flow invitations
  useEffect(() => {
    const state = location.state as LocationStateWithInvite | null;
    if (state?.fromInviteSignup) {
      setEmail(state.email || '');
      setSuccessMessage(t('auth.accountCreatedCanSignIn'));
    }

    // Handle flow invitation context
    if (state?.flowInvite) {
      setSuccessMessage(
        t('auth.signingInToJoin', {
          flowName: state.flowInvite.flowName,
          tenantName: state.flowInvite.tenantName,
        })
      );
    }

    // Handle existing user redirect from sign-up
    if (state?.message) {
      setSuccessMessage(state.message);
      setEmail(state.email || '');
    }
  }, [location.state, t]);

  const handlePostLogin = async () => {
    try {
      const userData = await userApi.getCurrentUser();
      await autoAcceptPendingInvites(userData);
      return userData;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });

      const userData = await handlePostLogin();
      const redirectPath = userData
        ? getRedirectDestination(userData)
        : '/dashboard';
      navigate(redirectPath);
    } catch (error: any) {
      if (error?.status === 401) {
        setError(t('auth.invalidCredentials'));
      } else if (error?.status === 403) {
        setError(
          error?.data?.detail ||
            t('auth.accountDisabledOrUnconfirmed') ||
            t('auth.loginFailed')
        );
      } else if (error instanceof Error) {
        setError(error.message || t('auth.loginFailed'));
      } else {
        setError(t('auth.loginFailed'));
      }
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setError('');

    try {
      await googleLoginMutation.mutateAsync(idToken);

      const userData = await userApi.getCurrentUser();
      await autoAcceptPendingInvites(userData);

      trackConversion('sign_up_complete', undefined, 'EUR');

      if (shouldPromptGoogleProfile(userData)) {
        setGoogleUserId(userData.id);
        setPendingRedirectPath(getRedirectDestination(userData));
        setShowCompleteProfile(true);
      } else {
        const redirectPath = getRedirectDestination(userData);
        navigate(redirectPath);
      }
    } catch (error: any) {
      logger.error('Google login failed', error);
      if (error?.data?.detail) {
        setError(error.data.detail);
      } else {
        setError(t('auth.googleSignInError'));
      }
    }
  };

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleCompleteProfileClose = () => {
    setShowCompleteProfile(false);
    navigate(pendingRedirectPath || '/dashboard');
  };

  const isLoading = loginMutation.isPending || googleLoginMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SEO
        title="Sign In"
        description="Sign in to your Status At account to manage workflows, track statuses, and collaborate with your team."
        url="https://statusat.com/sign-in"
        noindex={true}
      />
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle>{t('auth.signInTitle')}</CardTitle>
          <CardDescription>{t('auth.signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label="Sign in form"
          >
            {error && (
              <div
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-200"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
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
                onChange={e => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>

            <Button
              type="submit"
              className="bg-gradient-brand-subtle w-full text-white hover:opacity-90"
              disabled={isLoading}
              aria-label={
                loginMutation.isPending
                  ? t('auth.signingIn')
                  : t('auth.signInButton')
              }
            >
              {loginMutation.isPending
                ? t('auth.signingIn')
                : t('auth.signInButton')}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('auth.orContinueWith')}
                </span>
              </div>
            </div>

            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              disabled={isLoading}
            />

            <div className="space-y-2 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                {t('auth.forgotPassword')}
              </Link>
              <div className="text-sm text-muted-foreground">
                {t('auth.dontHaveAccount')}{' '}
                <Link
                  to="/sign-up"
                  className="font-medium text-accent hover:underline"
                >
                  {t('auth.signUp')}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {googleUserId && (
        <CompleteProfileModal
          isOpen={showCompleteProfile}
          onClose={handleCompleteProfileClose}
          userId={googleUserId}
        />
      )}
    </div>
  );
};

export default SignIn;
