import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLogin } from '@/hooks/useUserQuery';
import { userApi, messageApi } from '@/lib/api';
import { LocationStateWithInvite } from '@/types/api';
import { logger } from '@/lib/logger';

import { getRedirectDestination } from './AuthenticatedRedirect';

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

        // Auto-accept pending invite messages for flows user is already enrolled in
        // This handles the case where a user signs up via email invite and is auto-enrolled,
        // but still has a pending invite message in their inbox
        try {
          const messages = await messageApi.getMessages({
            requires_action: true,
            page: 1,
            page_size: 50,
          });

          // Find all flow_invite messages
          const flowInviteMessages = messages.results.filter(
            msg =>
              msg.message_type === 'flow_invite' && msg.action_accepted === null
          );

          // For each flow invite, check if user is already enrolled in that flow
          if (flowInviteMessages.length > 0 && userData.enrollments) {
            for (const inviteMsg of flowInviteMessages) {
              // Check if user has an enrollment for this flow
              const alreadyEnrolled = userData.enrollments.some(
                enrollment => enrollment.flow_name === inviteMsg.flow_name
              );

              if (alreadyEnrolled) {
                logger.info(
                  `Auto-accepting pending invite for ${inviteMsg.flow_name} (user already enrolled)`
                );
                await messageApi.takeMessageAction(inviteMsg.uuid, {
                  action: 'accept',
                });
              }
            }
          }
        } catch (messageError) {
          // Don't fail login if message cleanup fails
          logger.error(
            'Failed to auto-accept pending invite messages:',
            messageError
          );
        }

        const redirectPath = getRedirectDestination(userData);
        navigate(redirectPath);
      } catch {
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle as="h1">{t('auth.signInTitle')}</CardTitle>
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
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

            <div className="space-y-2 text-center">
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
