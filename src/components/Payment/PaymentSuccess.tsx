import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTenantStore } from '@/stores/useTenantStore';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedTenant } = useTenantStore();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'canceled' | 'error' | null>(null);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>{t('payment.processingPayment')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            {paymentStatus === 'success' && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
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
                <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
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
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
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
                <ArrowLeft className="h-4 w-4 mr-2" />
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
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
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
