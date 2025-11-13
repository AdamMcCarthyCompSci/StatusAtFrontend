import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResendConfirmation } from '@/hooks/useUserQuery';

const ConfirmEmail = () => {
  const { t } = useTranslation();
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
        onError: (error: any) => setError(error.message || t('auth.failedToResendConfirmation')),
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
      await resendConfirmationMutation.mutateAsync(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t('auth.failedToResendConfirmation'));
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
            <CardTitle className="text-green-600">{t('auth.confirmationEmailSent')}</CardTitle>
            <CardDescription>
              {t('auth.checkInboxForConfirmation')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t('auth.sentNewConfirmationTo')} <strong>{email}</strong>.
                  {t('auth.clickConfirmationLink')}
                </p>
              </div>

              <div className="text-center space-y-2">
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
                <Link to="/sign-in" className="text-sm text-primary hover:underline">
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>
            {fromSignup ? t('auth.checkYourEmail') : t('auth.confirmYourEmail')}
          </CardTitle>
          <CardDescription>
            {fromSignup
              ? t('auth.sendingConfirmation', { email })
              : t('auth.enterEmailForConfirmation')
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
              <Label htmlFor="email">{t('auth.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={resendConfirmationMutation.isPending}
            >
              {resendConfirmationMutation.isPending ? t('auth.sending') : t('auth.sendConfirmationEmail')}
            </Button>

            <div className="text-center space-y-2">
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
