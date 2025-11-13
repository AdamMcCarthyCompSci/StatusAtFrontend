import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCcw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      logger.info('SW Registered:', r);
    },
    onRegisterError(error) {
      logger.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      setShowPrompt(true);
      // Auto-hide offline ready message after 5 seconds
      const timer = setTimeout(() => {
        setShowPrompt(false);
        setOfflineReady(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {offlineReady ? 'App ready for offline use' : 'Update available'}
              </CardTitle>
              <CardDescription className="mt-1">
                {offlineReady
                  ? 'The app is now cached and ready to work offline.'
                  : 'A new version of the app is available. Update now for the latest features and improvements.'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={close}
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {needRefresh && (
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button onClick={handleUpdate} className="flex-1" size="sm">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Update Now
              </Button>
              <Button onClick={close} variant="outline" size="sm">
                Later
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
