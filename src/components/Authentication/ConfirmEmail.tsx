import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useResendConfirmation } from '@/hooks/useUserQuery';

const ConfirmEmail = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const fromSignup = location.state?.fromSignup || false;

  const [email, setEmail] = useState(emailFromState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const resendConfirmationMutation = useResendConfirmation();

  // Auto-send confirmation if coming from signup
  useEffect(() => {
    if (fromSignup && email) {
      resendConfirmationMutation.mutate(email, {
        onSuccess: message => {
          setSuccess(true);
          // API returns: "Confirmation email sent to your inbox"
          setSuccessMessage(message);
        },
        onError: (error: any) => {
          // API returns plain string errors like:
          // - "An account does not exist with that email address" (404)
          // - "Your email has already been confirmed" (400)
          // - "You already have an active confirmation email in your inbox" (400)
          // - "Failed to send confirmation email. Please try again later." (500)
          setError(error.message);
        },
      });
    }
  }, [fromSignup, email, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('auth.enterEmailAddress'));
      return;
    }

    try {
      const message = await resendConfirmationMutation.mutateAsync(email);
      setSuccess(true);
      setSuccessMessage(message);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Mail className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-green-600">
              {t('auth.confirmationEmailSent')}
            </CardTitle>
            <CardDescription>
              {t('auth.checkInboxForConfirmation')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
                <p className="mt-2 text-sm text-green-800 dark:text-green-200">
                  {t('auth.sentNewConfirmationTo')} <strong>{email}</strong>.
                  {t('auth.clickConfirmationLink')}
                </p>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('auth.didntReceiveEmail')}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                >
                  {t('auth.sendAnotherEmail')}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/sign-in"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.backToSignIn')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>
            {fromSignup ? t('auth.checkYourEmail') : t('auth.confirmYourEmail')}
          </CardTitle>
          <CardDescription>
            {fromSignup
              ? t('auth.sendingConfirmation', { email })
              : t('auth.enterEmailForConfirmation')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resendConfirmationMutation.isPending}
            >
              {resendConfirmationMutation.isPending
                ? t('auth.sending')
                : t('auth.sendConfirmationEmail')}
            </Button>

            <div className="space-y-2 text-center">
              <Link
                to="/sign-in"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t('auth.alreadyConfirmed')}
              </Link>
              <div className="text-sm text-muted-foreground">
                {t('auth.needNewAccount')}{' '}
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

export default ConfirmEmail;
