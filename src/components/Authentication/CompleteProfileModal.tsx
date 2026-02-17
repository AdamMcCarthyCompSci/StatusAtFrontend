import { useState } from 'react';
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from 'react-international-phone';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUpdateUser } from '@/hooks/useUserMutation';
import { logger } from '@/lib/logger';
import 'react-international-phone/style.css';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function CompleteProfileModal({
  isOpen,
  onClose,
  userId,
}: CompleteProfileModalProps) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('us');
  const updateUser = useUpdateUser();

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!phone || phone.length <= 1 || !phoneCountry) {
      onClose();
      return;
    }

    const country = defaultCountries.find(c => c[1] === phoneCountry);
    if (!country) {
      onClose();
      return;
    }

    const parsed = parseCountry(country);
    const dialCode = `+${parsed.dialCode}`;
    const nationalNumber = phone
      .replace(dialCode, '')
      .replace(/[\s\-()]/g, '')
      .trim();

    if (!nationalNumber) {
      onClose();
      return;
    }

    try {
      await updateUser.mutateAsync({
        userId,
        userData: {
          whatsapp_country_code: dialCode,
          whatsapp_phone_number: nationalNumber,
        },
      });
    } catch (err) {
      logger.error('Failed to save phone number', err);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          {t('auth.completeProfileTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('auth.completeProfileDescription')}
        </p>

        <div className="mt-4 space-y-2">
          <Label htmlFor="google-phone">{t('auth.whatsappNumber')}</Label>
          <PhoneInput
            defaultCountry="us"
            value={phone}
            onChange={(value, meta) => {
              setPhone(value);
              if (meta?.country) {
                setPhoneCountry(meta.country.iso2);
              }
            }}
            className="phone-input-custom"
          />
          <p className="text-xs text-muted-foreground">
            {t('auth.whatsappHelper')}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={updateUser.isPending}
          >
            {t('auth.skipForNow')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateUser.isPending}
            className="bg-gradient-brand-subtle text-white hover:opacity-90"
          >
            {updateUser.isPending ? t('auth.saving') : t('auth.savePhone')}
          </Button>
        </div>
      </div>
    </div>
  );
}
