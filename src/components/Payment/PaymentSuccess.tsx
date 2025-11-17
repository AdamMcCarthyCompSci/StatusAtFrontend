import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTenantStore } from '@/stores/useTenantStore';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
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
          <p>Processing payment...</p>
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
                <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                <CardDescription>
                  Your subscription has been activated successfully.
                </CardDescription>
              </>
            )}
            
            {paymentStatus === 'canceled' && (
              <>
                <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-yellow-600">Payment Canceled</CardTitle>
                <CardDescription>
                  Your payment was canceled. No charges have been made.
                </CardDescription>
              </>
            )}
            
            {paymentStatus === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
                <CardDescription>
                  There was an error processing your payment.
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {paymentStatus === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription is now active! You can start using all the premium features immediately.
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus === 'canceled' && (
              <Alert>
                <AlertDescription>
                  You can try again anytime or contact support if you need assistance.
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={handleReturnToDashboard} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              
              {(paymentStatus === 'canceled' || paymentStatus === 'error') && (
                <Button variant="outline" onClick={handleRetryPayment} className="w-full">
                  Try Again
                </Button>
              )}
            </div>

            {/* Additional Information */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>
                Need help? Contact our support team at{' '}
                <a href="mailto:support@statusat.com" className="text-primary hover:underline">
                  support@statusat.com
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
