import { ArrowLeft, Building2, Package, UserPlus, Users } from 'lucide-react';
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

const GettingStarted = () => {
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
            {t('help.gettingStarted.title')}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.gettingStarted.description')}
          </p>
        </div>

        {/* Section 1: Creating Your First Organization */}
        <Card id="creating-organization">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.creatingOrganization')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.gettingStarted.organizationIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.whatIsOrganization')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.gettingStarted.organizationExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.organizationRoles')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.ownerRole')}:
                  </span>
                  {t('help.gettingStarted.ownerDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.staffRole')}:
                  </span>
                  {t('help.gettingStarted.staffDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.memberRole')}:
                  </span>
                  {t('help.gettingStarted.memberDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Building Your First Workflow */}
        <Card id="building-workflow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.buildingWorkflow')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.gettingStarted.workflowIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.whatIsFlow')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.gettingStarted.flowExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.flowComponents')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.stepsLabel')}:
                  </span>
                  {t('help.gettingStarted.stepsDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.connectionsLabel')}:
                  </span>
                  {t('help.gettingStarted.connectionsDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.documentsLabel')}:
                  </span>
                  {t('help.gettingStarted.documentsDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Inviting Team Members */}
        <Card id="inviting-members">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.invitingMembers')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.gettingStarted.membersIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.teamCollaboration')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.gettingStarted.collaborationExplanation')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Enrolling Your First Customer */}
        <Card id="enrolling-customer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.enrollingCustomer')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('help.gettingStarted.enrollmentIntro')}
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.whatIsEnrollment')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('help.gettingStarted.enrollmentExplanation')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('help.gettingStarted.enrollmentMethods')}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.emailInviteLabel')}:
                  </span>
                  {t('help.gettingStarted.emailInviteDescription')}
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">
                    {t('help.gettingStarted.qrCodeLabel')}:
                  </span>
                  {t('help.gettingStarted.qrCodeDescription')}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GettingStarted;
