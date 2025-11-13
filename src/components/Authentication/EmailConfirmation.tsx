import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfirmEmail } from '@/hooks/useUserQuery';

const EmailConfirmation = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const confirmEmailMutation = useConfirmEmail();

  useEffect(() => {
    if (token) {
      confirmEmailMutation.mutate(token, {
        onSuccess: (data) => {
          setStatus('success');
          setMessage(data.message || t('auth.accountCreated'));
          // Redirect to sign in after 3 seconds
          setTimeout(() => navigate('/sign-in'), 3000);
        },
        onError: (error: any) => {
          setStatus('error');
          setMessage(error.message || t('auth.confirmationLinkInvalid'));
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {renderIcon()}
          </div>
          <CardTitle className={
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-destructive' : 
            'text-primary'
          }>
            {getTitle()}
          </CardTitle>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {message && (
              <div className={`p-4 rounded-md border ${
                status === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}
            
            <div className="text-center space-y-2">
              {status === 'success' && (
                <p className="text-sm text-muted-foreground">
                  {t('auth.redirectingToSignIn')}
                </p>
              )}

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/sign-in">
                    {status === 'success' ? t('auth.continueToSignIn') : t('auth.goToSignIn')}
                  </Link>
                </Button>

                {status === 'error' && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/sign-up">
                      {t('auth.signUpAgain')}
                    </Link>
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
