import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountBilling = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('help.backToHelp')}
          </Link>
        </Button>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {t('help.accountBilling.title')}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.accountBilling.description')}
          </p>
        </div>

        {/* Section 1: Subscription Plans */}
        <Card id="plans">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.accountBilling.plans')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.accountBilling.plansIntro')}
            </p>

            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.accountBilling.freeTrial')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.accountBilling.freeTrialExplanation')}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.accountBilling.managingSubscription')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.accountBilling.managingSubscriptionExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountBilling;
