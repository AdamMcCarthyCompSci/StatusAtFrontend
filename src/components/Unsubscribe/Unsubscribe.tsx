import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MailX, Loader2, CheckCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { userApi } from '@/lib/api';
import { logger } from '@/lib/logger';

const Unsubscribe = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [onlyMarketing, setOnlyMarketing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUnsubscribe = async () => {
    if (!token) {
      setError(t('unsubscribe.noTokenError'));
      return;
    }

    setIsUnsubscribing(true);
    setError(null);

    try {
      await userApi.unsubscribe(token, onlyMarketing);
      logger.info('Successfully unsubscribed', { onlyMarketing });
      setIsUnsubscribed(true);
    } catch (err: any) {
      logger.error('Failed to unsubscribe:', err);
      setError(
        err?.data?.detail ||
          err?.data?.error ||
          t('unsubscribe.unsubscribeError')
      );
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Invalid/missing token
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="lg" showText={true} />
            <CardTitle className="text-destructive">
              {t('unsubscribe.invalidToken')}
            </CardTitle>
            <CardDescription>
              {t('unsubscribe.invalidTokenDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-center">
              <MailX className="mx-auto mb-2 h-12 w-12 text-destructive" />
              <p className="text-sm text-destructive">
                {t('unsubscribe.noTokenError')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Successfully unsubscribed
  if (isUnsubscribed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="lg" showText={true} />
            <CardTitle className="text-green-600">
              {t('unsubscribe.successTitle')}
            </CardTitle>
            <CardDescription>
              {onlyMarketing
                ? t('unsubscribe.successDescriptionMarketing')
                : t('unsubscribe.successDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950/20">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
              <p className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
                {t('unsubscribe.confirmed')}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {onlyMarketing
                  ? t('unsubscribe.noMoreMarketingEmails')
                  : t('unsubscribe.noMoreEmails')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmation screen
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo size="lg" showText={true} />
          <CardTitle>{t('unsubscribe.confirmTitle')}</CardTitle>
          <CardDescription>
            {t('unsubscribe.confirmDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border bg-muted/50 p-6">
            <Mail className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />

            {/* Checkbox for marketing only */}
            <div className="mb-4 flex items-start space-x-3">
              <Checkbox
                id="only-marketing"
                checked={onlyMarketing}
                onCheckedChange={checked => setOnlyMarketing(checked === true)}
              />
              <div className="flex-1">
                <Label
                  htmlFor="only-marketing"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('unsubscribe.onlyMarketingLabel')}
                </Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('unsubscribe.onlyMarketingHelper')}
                </p>
              </div>
            </div>

            <div className="rounded-md border-t pt-4">
              <p className="mb-2 text-sm font-medium">
                {t('unsubscribe.whatHappens')}
              </p>
              <p className="text-sm text-muted-foreground">
                {onlyMarketing
                  ? t('unsubscribe.whatHappensMarketing')
                  : t('unsubscribe.whatHappensAll')}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
            className="w-full"
            variant="destructive"
          >
            {isUnsubscribing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('unsubscribe.unsubscribing')}
              </>
            ) : (
              <>
                <MailX className="mr-2 h-4 w-4" />
                {t('unsubscribe.confirmButton')}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {t('unsubscribe.canResubscribe')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
