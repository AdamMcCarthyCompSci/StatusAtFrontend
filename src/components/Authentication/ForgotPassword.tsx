import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useForgotPassword } from '@/hooks/useUserQuery';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError(t('auth.enterEmailAddress'));
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync(email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t('auth.failedToSendReset'));
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <Logo size="lg" showText={true} />
            </div>
            <CardTitle className="text-green-600 dark:text-green-500">
              {t('auth.emailSent')}
            </CardTitle>
            <CardDescription>{t('auth.checkInbox')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t('auth.resetLinkSentTo')} <strong>{email}</strong>.
                  {t('auth.checkEmail')}
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
                  {t('auth.tryAgain')}
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-accent hover:underline"
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
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
          <CardDescription>
            {t('auth.forgotPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive-foreground">
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
              className="bg-gradient-brand-subtle w-full text-white hover:opacity-90"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending
                ? t('auth.sending')
                : t('auth.sendResetLink')}
            </Button>

            <div className="space-y-2 text-center">
              <Link
                to="/sign-in"
                className="text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                {t('auth.rememberPassword')}
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
    </div>
  );
};

export default ForgotPassword;
