import {
  BookOpen,
  Rocket,
  Users,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
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

const Help = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'getting-started',
      title: t('help.gettingStarted.title'),
      description: t('help.gettingStarted.description'),
      icon: Rocket,
      items: [
        {
          title: t('help.gettingStarted.creatingOrganization'),
          path: '/help/getting-started#creating-organization',
        },
        {
          title: t('help.gettingStarted.buildingWorkflow'),
          path: '/help/getting-started#building-workflow',
        },
        {
          title: t('help.gettingStarted.invitingMembers'),
          path: '/help/getting-started#inviting-members',
        },
        {
          title: t('help.gettingStarted.enrollingCustomer'),
          path: '/help/getting-started#enrolling-customer',
        },
      ],
    },
    {
      id: 'feature-guides',
      title: t('help.featureGuides.title'),
      description: t('help.featureGuides.description'),
      icon: BookOpen,
      items: [
        {
          title: t('help.featureGuides.flowBuilder'),
          path: '/help/feature-guides#flow-builder',
        },
        {
          title: t('help.featureGuides.customerManagement'),
          path: '/help/feature-guides#customer-management',
        },
        {
          title: t('help.featureGuides.documentHandling'),
          path: '/help/feature-guides#document-handling',
        },
        {
          title: t('help.featureGuides.statusTracking'),
          path: '/help/feature-guides#status-tracking',
        },
        {
          title: t('help.featureGuides.teamCollaboration'),
          path: '/help/feature-guides#team-collaboration',
        },
      ],
    },
    {
      id: 'for-customers',
      title: t('help.forCustomers.title'),
      description: t('help.forCustomers.description'),
      icon: Users,
      items: [
        {
          title: t('help.forCustomers.trackingStatus'),
          path: '/help/for-customers#tracking-status',
        },
        {
          title: t('help.forCustomers.uploadingDocuments'),
          path: '/help/for-customers#uploading-documents',
        },
        {
          title: t('help.forCustomers.notifications'),
          path: '/help/for-customers#notifications',
        },
      ],
    },
    {
      id: 'faq',
      title: t('help.faq.title'),
      description: t('help.faq.description'),
      icon: HelpCircle,
      items: [
        {
          title: t('help.faq.common'),
          path: '/help/faq',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold sm:text-4xl">
              {t('help.title')}
            </h1>
          </div>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.subtitle')}
          </p>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map(section => {
            const IconComponent = section.icon;
            return (
              <Card
                key={section.id}
                className="group flex flex-col transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Help Section */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {t('help.needMoreHelp')}
            </CardTitle>
            <CardDescription>
              {t('help.needMoreHelpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href={`mailto:${t('help.supportEmail')}`}>
                {t('help.contactSupport')}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
