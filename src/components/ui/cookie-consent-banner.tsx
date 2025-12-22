import { useEffect, useState } from 'react';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import { useTranslation } from 'react-i18next';

import { grantConsent, denyConsent } from '@/lib/analytics';

const COOKIE_NAME = 'statusat_cookie_consent';

/**
 * Cookie Consent Banner Component
 * GDPR-compliant cookie consent banner
 */
export const CookieConsentBanner = () => {
  const { t } = useTranslation();
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = getCookieConsentValue(COOKIE_NAME);

    if (consent === 'true') {
      // User already accepted - grant consent immediately
      grantConsent();
    } else if (consent === 'false') {
      // User previously declined - deny consent
      denyConsent();
    }

    // Always show banner on first visit (library handles hiding if already consented)
    setShouldShowBanner(true);
  }, []);

  const handleAccept = () => {
    // Grant consent when user accepts
    grantConsent();
  };

  const handleDecline = () => {
    // Deny consent when user declines
    denyConsent();
  };

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      cookieName={COOKIE_NAME}
      expires={365}
      overlay={false}
      onAccept={handleAccept}
      onDecline={handleDecline}
      enableDeclineButton
      flipButtons
      buttonText={t('cookies.accept')}
      declineButtonText={t('cookies.decline')}
      containerClasses="cookie-consent-container"
      buttonClasses="cookie-consent-button cookie-consent-accept"
      declineButtonClasses="cookie-consent-button cookie-consent-decline"
      contentClasses="cookie-consent-content"
      style={{
        background: 'hsl(var(--background))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '1rem',
        alignItems: 'center',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      }}
      buttonStyle={{
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        fontSize: '14px',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: 'hsl(var(--foreground))',
        fontSize: '14px',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        border: '1px solid hsl(var(--border))',
        cursor: 'pointer',
      }}
      contentStyle={{
        flex: '1 1 auto',
        margin: '0 1rem',
        color: 'hsl(var(--foreground))',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      <span className="text-sm">
        {t('cookies.message')}{' '}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t('cookies.learnMore')}
        </a>
      </span>
    </CookieConsent>
  );
};
