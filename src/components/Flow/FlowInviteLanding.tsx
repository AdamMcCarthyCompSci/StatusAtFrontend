import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Inbox } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { enrollmentApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/useAuthStore';

const FlowInviteLanding = () => {
  const { t } = useTranslation();
  const { tenantName, flowName } = useParams<{
    tenantName: string;
    flowName: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-fill email if user is signed in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError(t('invite.enterEmailAddress'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the public enrollment endpoint for everyone
      // Backend will handle creating inbox message for signed-in users or sending email
      await enrollmentApi.createPublicEnrollment(
        tenantName || '',
        flowName || '',
        email.trim()
      );

      // If user is signed in, redirect to inbox instead of showing email success
      if (user) {
        navigate('/inbox');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      logger.error('Failed to send invitation:', err);

      // Handle specific error cases
      if (
        err?.data?.error?.includes('A pending invite already exists') ||
        err?.response?.data?.detail?.includes('already exists')
      ) {
        if (user) {
          setError(t('invite.inviteAlreadyExists'));
          setTimeout(() => navigate('/inbox'), 2000);
        } else {
          setError(t('invite.inviteAlreadySentEmail'));
        }
      } else if (err?.response?.status === 403) {
        setError(err?.response?.data?.detail || t('invite.orgLimitReached'));
      } else {
        setError(
          err?.data?.detail ||
            err?.data?.error ||
            t('invite.failedToSendInvitation')
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="lg" showText={true} />
            <CardTitle className="text-green-600">
              {t('invite.invitationSent')}
            </CardTitle>
            <CardDescription>
              {t('invite.invitationSentTo', { email })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="py-4 text-center">
              <div className="mb-4 text-6xl">📧</div>
              <h3 className="mb-2 text-lg font-semibold">
                {t('invite.checkYourEmail')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('invite.receiveInvitation', {
                  flow: flowName,
                  tenant: tenantName,
                })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/')} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')} to {t('tenant.home')}
              </Button>
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
          <Logo size="lg" showText={true} />
          <CardTitle>{t('invite.youreInvited')}</CardTitle>
          <CardDescription>
            {t('invite.joinFlowAt', { flow: flowName, tenant: tenantName })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="py-4 text-center">
            <div className="mb-4 text-6xl">🎯</div>
            <h3 className="mb-2 text-lg font-semibold">{flowName}</h3>
            <p className="text-sm text-muted-foreground">
              {user
                ? t('invite.clickToAddInbox')
                : t('invite.enterEmailToReceive')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            )}

            {user && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Inbox className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">
                      {t('invite.signedInAs')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                {error && (
                  <p className="mt-3 text-sm text-destructive">{error}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email.trim()}
            >
              {user ? (
                <>
                  <Inbox className="mr-2 h-4 w-4" />
                  {isLoading
                    ? t('invite.addingToInbox')
                    : t('invite.addToMyInbox')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {isLoading
                    ? t('invite.sendingInvitation')
                    : t('invite.sendMeInvitation')}
                </>
              )}
            </Button>
          </form>

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')} to {t('tenant.home')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowInviteLanding;
