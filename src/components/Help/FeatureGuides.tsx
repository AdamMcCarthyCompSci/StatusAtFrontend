import {
  ArrowLeft,
  Package,
  Users,
  FileText,
  Eye,
  UserCog,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeatureGuides = () => {
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
            {t('help.featureGuides.title')}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.featureGuides.description')}
          </p>
        </div>

        {/* Section 1: Flow Builder Deep Dive */}
        <Card id="flow-builder">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.featureGuides.flowBuilder')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.featureGuides.flowBuilderIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.visualDesign')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.visualDesignExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.flowFeatures')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.dragDropLabel')}:
                  </span>
                  {t('help.featureGuides.dragDropDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.autoLayoutLabel')}:
                  </span>
                  {t('help.featureGuides.autoLayoutDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.documentFieldsLabel')}:
                  </span>
                  {t('help.featureGuides.documentFieldsDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.minimapLabel')}:
                  </span>
                  {t('help.featureGuides.minimapDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Customer Management */}
        <Card id="customer-management">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.featureGuides.customerManagement')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.featureGuides.customerManagementIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.enrollmentTracking')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.enrollmentTrackingExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.customerFeatures')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.searchFilterLabel')}:
                  </span>
                  {t('help.featureGuides.searchFilterDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.stepMovementLabel')}:
                  </span>
                  {t('help.featureGuides.stepMovementDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.featureGuides.notesLabel')}:
                  </span>
                  {t('help.featureGuides.notesDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Document Handling */}
        <Card id="document-handling">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.featureGuides.documentHandling')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.featureGuides.documentHandlingIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.documentSteps')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.documentStepsExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.documentWorkflow')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.documentWorkflowExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Status Tracking (Customer View) */}
        <Card id="status-tracking">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.featureGuides.statusTracking')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.featureGuides.statusTrackingIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.publicPages')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.publicPagesExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.realTimeUpdates')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.realTimeUpdatesExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Team Collaboration & Roles */}
        <Card id="team-collaboration">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.featureGuides.teamCollaboration')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.featureGuides.teamCollaborationIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.rolesPermissions')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.rolesPermissionsExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.featureGuides.multiTenant')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.featureGuides.multiTenantExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureGuides;
