import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  Edit3,
  Bell,
  Smartphone,
  Clock,
  Workflow,
  QrCode,
  Palette,
  FileText,
  Users,
  History,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import SEO from '@/components/seo/SEO';
import { useCurrentUser } from '@/hooks/useUserQuery';
import { trackClick, trackSignUpStart } from '@/lib/analytics';

import Footer from '../layout/Footer';

const HowItWorksLanding = () => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [stepsRef, stepsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const handleCTAClick = () => {
    trackClick('how_it_works_cta_click');
    trackSignUpStart('how_it_works_page');
  };

  const stepIcons = [Edit3, Bell, Smartphone, Clock];
  const featureIcons: Record<string, any> = {
    customFlows: Workflow,
    qrEnrollment: QrCode,
    brandedPortals: Palette,
    documentManagement: FileText,
    teamCollaboration: Users,
    trackYourBusiness: TrendingUp,
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title={t('howItWorks.seo.title')}
        description={t('howItWorks.seo.description')}
        keywords={t('howItWorks.seo.keywords')}
        url="https://statusat.com/how-it-works"
        type="website"
        hreflang={true}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How StatusAt Works - Customer Status Tracking',
            description: t('howItWorks.seo.description'),
            step: [
              {
                '@type': 'HowToStep',
                name: 'Update Customer Status',
                text: 'Update your customer status with a single click from your dashboard',
              },
              {
                '@type': 'HowToStep',
                name: 'Automatic Notifications',
                text: 'Customers receive instant WhatsApp and email notifications',
              },
              {
                '@type': 'HowToStep',
                name: 'Customer Checks Portal',
                text: 'Customers view their branded progress portal and timeline',
              },
              {
                '@type': 'HowToStep',
                name: 'Save Time',
                text: 'Reduce support inquiries by 70% and save hours every week',
              },
            ],
          })}
        </script>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
          <RouterLink to="/home" className="flex-shrink-0">
            <Logo size="sm" showText={false} className="sm:hidden" />
            <Logo size="md" showText={true} className="hidden sm:flex" />
          </RouterLink>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <div className="hidden sm:flex">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            {user ? (
              <Button
                asChild
                variant="default"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <RouterLink to="/dashboard">{t('common.dashboard')}</RouterLink>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <RouterLink to="/sign-in">{t('common.signIn')}</RouterLink>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <RouterLink to="/sign-up" onClick={handleCTAClick}>
                    <span className="hidden sm:inline">
                      {t('common.getStarted')}
                    </span>
                    <span className="sm:hidden">Start</span>
                  </RouterLink>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pb-12 pt-24 md:pb-20 md:pt-32"
      >
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              {t('howItWorks.hero.title')}{' '}
              <span className="text-gradient-brand">
                {t('howItWorks.hero.titleHighlight')}
              </span>{' '}
              {t('howItWorks.hero.title2')}
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              {t('howItWorks.hero.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('howItWorks.hero.trialInfo')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section ref={stepsRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={stepsInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('howItWorks.steps.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('howItWorks.steps.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={stepsInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mx-auto grid max-w-5xl gap-12 md:gap-16"
          >
            {['step1', 'step2', 'step3', 'step4'].map((stepKey, index) => {
              const StepIcon = stepIcons[index];
              const step = t(`howItWorks.steps.${stepKey}`, {
                returnObjects: true,
              }) as {
                number: string;
                title: string;
                description: string;
                details: string[];
                example: string;
              };

              return (
                <motion.div
                  key={stepKey}
                  variants={scaleIn}
                  className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8"
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-brand-subtle flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{step.number}</div>
                        <StepIcon className="mx-auto mt-1 h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                    <p className="mb-4 text-lg text-muted-foreground">
                      {step.description}
                    </p>
                    <ul className="mb-4 space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Card className="border-primary/20 bg-muted/50 p-4">
                      <p className="text-sm italic text-muted-foreground">
                        {step.example}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features in Action */}
      <section ref={featuresRef} className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('howItWorks.featuresInAction.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('howItWorks.featuresInAction.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              'customFlows',
              'qrEnrollment',
              'brandedPortals',
              'documentManagement',
              'teamCollaboration',
              'trackYourBusiness',
            ].map(featureKey => {
              const FeatureIcon = featureIcons[featureKey];
              const feature = t(`howItWorks.featuresInAction.${featureKey}`, {
                returnObjects: true,
              }) as {
                title: string;
                description: string;
              };

              return (
                <motion.div key={featureKey} variants={scaleIn}>
                  <Card className="h-full p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="bg-gradient-brand-subtle mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white">
                      <FeatureIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3"
          >
            {['mobileFriendly', 'notifications', 'customFlows'].map(statKey => {
              const stat = t(`howItWorks.stats.${statKey}`, {
                returnObjects: true,
              }) as {
                value: string;
                label: string;
              };

              return (
                <motion.div
                  key={statKey}
                  variants={scaleIn}
                  className="text-center"
                >
                  <div className="text-gradient-brand mb-2 text-4xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-brand relative overflow-hidden py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t('howItWorks.cta.title')}
            </h2>
            <p className="mb-8 text-lg text-white/90">
              {t('howItWorks.cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white !text-black hover:bg-white/90"
                onClick={handleCTAClick}
              >
                <RouterLink to="/sign-up">
                  {t('howItWorks.cta.primaryButton')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </RouterLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
              >
                <RouterLink to="/demo">
                  {t('howItWorks.cta.secondaryButton')}
                </RouterLink>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              {(
                t('howItWorks.cta.features', {
                  returnObjects: true,
                }) as string[]
              ).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorksLanding;
