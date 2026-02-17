import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getGoogleClientId } from '@/config/env';
import { useGoogleIdentityServices } from '@/hooks/useGoogleIdentityServices';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (error: string) => void;
  text?: 'signin_with' | 'signup_with';
  disabled?: boolean;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'signin_with',
  disabled = false,
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const { isLoaded, error: gisError } = useGoogleIdentityServices();
  const buttonRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  // Store callbacks in refs so the GIS callback always uses the latest version
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const clientId = getGoogleClientId();
    if (!isLoaded || !buttonRef.current || !clientId || initializedRef.current)
      return;

    try {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            onSuccessRef.current(response.credential);
          } else {
            onErrorRef.current(t('auth.googleSignInError'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google?.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text,
        shape: 'rectangular',
        width: buttonRef.current.offsetWidth || 400,
      });

      initializedRef.current = true;
    } catch {
      onErrorRef.current(t('auth.googleSignInError'));
    }
  }, [isLoaded, text, t]);

  if (!getGoogleClientId()) return null;
  if (gisError) return null;

  return (
    <div
      ref={buttonRef}
      className={`flex justify-center ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    />
  );
}
