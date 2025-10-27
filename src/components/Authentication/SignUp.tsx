import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignup } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { inviteApi } from '@/lib/api';
import { InviteValidationResponse } from '@/types/message';
import { PhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('us');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inviteData, setInviteData] = useState<InviteValidationResponse | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isValidatingInvite, setIsValidatingInvite] = useState(false);
  const navigate = useNavigate();
  const signUpMutation = useSignup();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // Validate invite token on component mount
  useEffect(() => {
    const token = searchParams.get('invite');

    // Handle traditional invite token
    if (token) {
      setInviteToken(token);
      setIsValidatingInvite(true);

      inviteApi.validateInviteToken(token)
        .then((response) => {
          // Check if user already exists and should be redirected
          if (response.should_redirect_to_inbox) {
            if (isAuthenticated) {
              // Already logged in, go directly to inbox
              navigate('/inbox');
            } else {
              // Not logged in, redirect to sign-in with message
              navigate('/sign-in', {
                state: {
                  email: response.email,
                  message: 'You already have an account. Please sign in to accept the invitation.'
                }
              });
            }
            return;
          }

          if (response.valid && response.invite) {
            setInviteData(response);
            // Pre-fill email from invite
            setEmail(response.email || response.invite.email || '');
            setError('');
          } else {
            setError(response.error || 'Invalid invite token');
            setInviteData(null);
          }
        })
        .catch((error) => {
          console.error('Failed to validate invite:', error);
          setError(error?.data?.error || 'Failed to validate invite token');
          setInviteData(null);
        })
        .finally(() => {
          setIsValidatingInvite(false);
        });
    }
  }, [searchParams, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    try {
      // Parse phone number to extract country code and number
      let phoneData = {};
      if (phone && phone.length > 1 && phoneCountry) {
        // Use the selected country to get the correct dial code
        const country = defaultCountries.find(c => c[1] === phoneCountry);
        if (country) {
          const parsed = parseCountry(country);
          const dialCode = `+${parsed.dialCode}`;
          // Remove the dial code and any formatting characters to get just the national number
          const nationalNumber = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '').trim();
          
          if (nationalNumber) { // Only send if there's actually a number
            phoneData = {
              whatsapp_country_code: dialCode, // e.g., "+49"
              whatsapp_phone_number: nationalNumber, // e.g., "16093162276"
            };
          }
        }
      }

      const signupData = { 
        name, 
        email, 
        password, 
        marketing_consent: marketingConsent,
        ...phoneData,
        ...(inviteToken && { invite_token: inviteToken })  // This processes the invite!
      };
      
      await signUpMutation.mutateAsync(signupData);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMarketingConsent(false);
      setPhone('');
      
      if (inviteData?.valid) {
        // For invite-based registration, skip email confirmation
        if (inviteData.invite_type === 'flow_enrollment') {
          setSuccess(`Account created successfully! You've been enrolled in ${inviteData.flow_name} at ${inviteData.tenant_name}. You can now sign in.`);
        } else {
          setSuccess(`Account created successfully! You've been added to ${inviteData.tenant_name}. You can now sign in.`);
        }
        // Redirect directly to sign-in page
        setTimeout(() => {
          navigate('/sign-in', { state: { email, fromInviteSignup: true } });
        }, 2000);
      } else {
        // For regular registration, require email confirmation
        setSuccess('Account created successfully! Please check your email to confirm your account, then sign in.');
        // Redirect to confirm email page with email in state
        navigate('/confirm-email', { state: { email, fromSignup: true } });
      }
    } catch (error: any) {
      setError(error?.data?.detail || error.message || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <CardTitle>{t('auth.signUpTitle')}</CardTitle>
          <CardDescription>
            {inviteData?.valid ? (
              inviteData.invite_type === 'flow_enrollment' ? (
                <>{ t('auth.invitedToEnroll', { flowName: inviteData.flow_name }) } at {inviteData.tenant_name}</>
              ) : (
                <>You've been invited to join <strong>{inviteData.tenant_name}</strong> as a {inviteData.role}</>
              )
            ) : (
              t('auth.signUpDescription')
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidatingInvite ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">{t('auth.validatingInvite')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-800 dark:text-green-200 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                  {success}
                </div>
              )}
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={inviteData?.valid}
                className={inviteData?.valid ? 'bg-muted cursor-not-allowed' : ''}
              />
              {inviteData?.valid && (
                <p className="text-xs text-muted-foreground">
                  {t('auth.emailLockedFromInvite')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                {t('auth.passwordMinLength')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.whatsappNumber')}</Label>
              <PhoneInput
                defaultCountry="us"
                value={phone}
                onChange={(phone, meta) => {
                  setPhone(phone);
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing-consent"
                checked={marketingConsent}
                onCheckedChange={(checked) => setMarketingConsent(checked === true)}
              />
              <Label htmlFor="marketing-consent" className="text-sm">
                {t('auth.agreeToReceiveUpdates')}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? t('auth.creatingAccount') : t('auth.signUpButton')}
            </Button>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/sign-in" className="text-primary hover:underline">
                  {t('auth.signIn')}
                </Link>
              </div>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
