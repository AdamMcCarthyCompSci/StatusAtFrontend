import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTenantStore } from '@/stores/useTenantStore';
import { userKeys } from '@/hooks/useUserQuery';
import { tenantKeys } from '@/hooks/useTenantQuery';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedTenant } = useTenantStore();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    'success' | 'canceled' | 'error' | null
  >(null);

  useEffect(() => {
    // Check URL parameters to determine payment status
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');
    const error = searchParams.get('error');

    if (canceled === 'true') {
      setPaymentStatus('canceled');
    } else if (error) {
      setPaymentStatus('error');
    } else if (sessionId) {
      setPaymentStatus('success');
    } else {
      setPaymentStatus('error');
    }

    setIsLoading(false);
  }, [searchParams]);

  // Invalidate queries when payment is successful to refresh subscription status
  useEffect(() => {
    if (paymentStatus === 'success') {
      // Invalidate user query to fetch updated subscription/membership data
      queryClient.invalidateQueries({ queryKey: userKeys.current() });

      // Invalidate tenant queries to fetch updated tenant tier information
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    }
  }, [paymentStatus, queryClient]);

  const handleReturnToDashboard = () => {
    if (selectedTenant) {
      navigate(`/tenant/${selectedTenant}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRetryPayment = () => {
    navigate('/subscription');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin" />
          <p>{t('payment.processingPayment')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            {paymentStatus === 'success' && (
              <>
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl text-green-600">
                  {t('payment.success.title')}
                </CardTitle>
                <CardDescription>
                  {t('payment.success.description')}
                </CardDescription>
              </>
            )}

            {paymentStatus === 'canceled' && (
              <>
                <XCircle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
                <CardTitle className="text-2xl text-yellow-600">
                  {t('payment.canceled.title')}
                </CardTitle>
                <CardDescription>
                  {t('payment.canceled.description')}
                </CardDescription>
              </>
            )}

            {paymentStatus === 'error' && (
              <>
                <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                <CardTitle className="text-2xl text-red-600">
                  {t('payment.error.title')}
                </CardTitle>
                <CardDescription>
                  {t('payment.error.description')}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {paymentStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('payment.success.message')}
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === 'canceled' && (
              <Alert>
                <AlertDescription>
                  {t('payment.canceled.message')}
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('payment.error.message')}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={handleReturnToDashboard} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('payment.returnToDashboard')}
              </Button>

              {(paymentStatus === 'canceled' || paymentStatus === 'error') && (
                <Button
                  variant="outline"
                  onClick={handleRetryPayment}
                  className="w-full"
                >
                  {t('payment.tryAgain')}
                </Button>
              )}
            </div>

            {/* Additional Information */}
            <div className="border-t pt-4 text-center text-sm text-muted-foreground">
              <p>
                {t('payment.needHelp')}{' '}
                <a
                  href={`mailto:${t('payment.supportEmail')}`}
                  className="text-primary hover:underline"
                >
                  {t('payment.supportEmail')}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
