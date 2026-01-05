import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useConfirmEmail } from '@/hooks/useUserQuery';
import { trackEvent } from '@/lib/analytics';

const EmailConfirmation = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  const confirmEmailMutation = useConfirmEmail();

  useEffect(() => {
    if (token) {
      confirmEmailMutation.mutate(token, {
        onSuccess: data => {
          setStatus('success');
          setMessage(data.message || t('auth.accountCreated'));

          // Track successful email confirmation
          trackEvent('email_confirmed');

          // Redirect to sign in after 3 seconds
          setTimeout(() => navigate('/sign-in'), 3000);
        },
        onError: (error: any) => {
          setStatus('error');
          const errorMessage =
            error.data?.detail ||
            error.data?.message ||
            error.message ||
            t('auth.confirmationLinkInvalid');
          setMessage(errorMessage);
        },
      });
    } else {
      setStatus('error');
      setMessage(t('auth.noConfirmationToken'));
    }
  }, [token, navigate, t]);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-destructive" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return t('auth.confirmingEmail');
      case 'success':
        return t('auth.emailConfirmed');
      case 'error':
        return t('auth.confirmationFailed');
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return t('auth.pleaseWaitConfirming');
      case 'success':
        return t('auth.emailConfirmedSuccess');
      case 'error':
        return t('auth.unableToConfirm');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">{renderIcon()}</div>
          <CardTitle
            className={
              status === 'success'
                ? 'text-green-600'
                : status === 'error'
                  ? 'text-destructive'
                  : 'text-primary'
            }
          >
            {getTitle()}
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {message && (
              <div
                className={`rounded-md border p-4 ${
                  status === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200'
                    : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-200'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="space-y-2 text-center">
              {status === 'success' && (
                <p className="text-sm text-muted-foreground">
                  {t('auth.redirectingToSignIn')}
                </p>
              )}

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/sign-in">
                    {status === 'success'
                      ? t('auth.continueToSignIn')
                      : t('auth.goToSignIn')}
                  </Link>
                </Button>

                {status === 'error' && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/sign-up">{t('auth.signUpAgain')}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
