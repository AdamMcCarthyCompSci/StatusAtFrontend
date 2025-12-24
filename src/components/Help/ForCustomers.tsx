import { ArrowLeft, Eye, Upload, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ForCustomers = () => {
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
            {t('help.forCustomers.title')}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.forCustomers.description')}
          </p>
        </div>

        {/* Section 1: Tracking Your Status */}
        <Card id="tracking-status">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.forCustomers.trackingStatus')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.forCustomers.trackingStatusIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.accessingStatus')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.forCustomers.accessingStatusExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.statusFeatures')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.forCustomers.currentStepLabel')}:
                  </span>
                  {t('help.forCustomers.currentStepDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.forCustomers.progressLabel')}:
                  </span>
                  {t('help.forCustomers.progressDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.forCustomers.historyLabel')}:
                  </span>
                  {t('help.forCustomers.historyDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Uploading Documents */}
        <Card id="uploading-documents">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.forCustomers.uploadingDocuments')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.forCustomers.uploadingDocumentsIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.documentRequests')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.forCustomers.documentRequestsExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.uploadProcess')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.forCustomers.uploadProcessExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Understanding Notifications */}
        <Card id="notifications">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.forCustomers.notifications')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.forCustomers.notificationsIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.notificationTypes')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.forCustomers.emailLabel')}:
                  </span>
                  {t('help.forCustomers.emailDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.forCustomers.whatsappLabel')}:
                  </span>
                  {t('help.forCustomers.whatsappDescription')}
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.forCustomers.stayingInformed')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.forCustomers.stayingInformedExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForCustomers;
