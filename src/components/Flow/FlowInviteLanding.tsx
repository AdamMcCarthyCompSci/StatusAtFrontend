import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Loader2, Inbox } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

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
import { enrollmentApi, messageApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { useAuthStore } from '@/stores/useAuthStore';
import { userKeys } from '@/hooks/useUserQuery';
import { messageKeys } from '@/hooks/useMessageQuery';

const FlowInviteLanding = () => {
  const { t } = useTranslation();
  const { tenantName, flowName } = useParams<{
    tenantName: string;
    flowName: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoEnrolling, setIsAutoEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-enroll signed-in users
  useEffect(() => {
    const autoEnroll = async () => {
      if (!user?.id || !user?.email || isAutoEnrolling || success || error)
        return;

      setIsAutoEnrolling(true);
      setIsLoading(true);

      try {
        logger.info('Auto-enrolling signed-in user:', user.email);

        // Step 1: Check for pending inbox message for this flow
        logger.info('Checking for pending inbox messages...');
        const messages = await messageApi.getMessages({
          requires_action: true,
          page: 1,
          page_size: 50,
        });

        // Find a pending invitation for this specific flow
        const inviteMessage = messages.results.find(
          msg =>
            msg.message_type === 'flow_invite' &&
            msg.action_accepted === null &&
            msg.flow_name?.toLowerCase() === flowName?.toLowerCase()
        );

        if (inviteMessage) {
          // Step 2a: Accept the pending inbox message (this will auto-enroll them)
          logger.info(
            'Found pending invite message, accepting it:',
            inviteMessage.uuid
          );
          await messageApi.takeMessageAction(inviteMessage.uuid, {
            action: 'accept',
          });

          // Invalidate message cache
          queryClient.invalidateQueries({
            queryKey: messageKeys.user(user.id.toString()),
          });
        } else {
          // Step 2b: No pending message, create public enrollment
          // This uses public API endpoint that doesn't require tenant membership
          logger.info('No pending invite found, creating public enrollment...');

          await enrollmentApi.createPublicEnrollment(
            tenantName || '',
            flowName || '',
            user.email
          );

          logger.info('Successfully created public enrollment');

          // Check if this created an inbox message, and accept it immediately
          const messagesAfter = await messageApi.getMessages({
            requires_action: true,
            page: 1,
            page_size: 50,
          });

          const newInviteMessage = messagesAfter.results.find(
            msg =>
              msg.message_type === 'flow_invite' &&
              msg.action_accepted === null &&
              msg.flow_name?.toLowerCase() === flowName?.toLowerCase()
          );

          if (newInviteMessage) {
            logger.info(
              'Auto-accepting newly created invite message:',
              newInviteMessage.uuid
            );
            await messageApi.takeMessageAction(newInviteMessage.uuid, {
              action: 'accept',
            });
          }
        }

        // Step 3: Invalidate caches to refresh user data
        queryClient.invalidateQueries({ queryKey: userKeys.current() });

        // Step 4: Redirect to tenant page
        logger.info('Redirecting to tenant page');
        navigate(`/${tenantName}`);
      } catch (err: any) {
        logger.error('Auto-enrollment failed:', err);

        // Handle specific error cases
        if (
          err?.data?.error?.includes('already enrolled') ||
          err?.data?.detail?.includes('already enrolled') ||
          err?.data?.non_field_errors?.[0]?.includes(
            'must make a unique set'
          ) ||
          err?.data?.error_code === 'VALIDATION' ||
          err?.response?.data?.detail?.includes('already exists')
        ) {
          // User is already enrolled, just redirect
          logger.info('User already enrolled, redirecting to tenant page');
          queryClient.invalidateQueries({ queryKey: userKeys.current() });
          navigate(`/${tenantName}`);
        } else {
          setError(
            err?.data?.detail ||
              err?.data?.error ||
              t('invite.failedToAcceptInvitation')
          );
          setIsAutoEnrolling(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id && user?.email) {
      autoEnroll();
    }
  }, [
    user,
    tenantName,
    flowName,
    navigate,
    queryClient,
    t,
    isAutoEnrolling,
    success,
    error,
  ]);

  // Auto-fill email if user is signed in (for fallback display)
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

  // Show loading/error state for signed-in users (auto-enrollment happens automatically)
  // This prevents the form from showing and users from clicking "Add to Inbox" multiple times
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="lg" showText={true} />
            <CardTitle>
              {error ? t('common.error') : t('invite.enrollingYou')}
            </CardTitle>
            <CardDescription>
              {error
                ? t('invite.enrollmentFailed')
                : t('invite.joiningFlow', {
                    flow: flowName,
                    tenant: tenantName,
                  })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!error ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t('invite.pleaseWait')}
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
                <Button
                  onClick={() => navigate(`/${tenantName}`)}
                  className="w-full"
                >
                  {t('tenant.backToHome')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
