import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, CheckCircle, type LucideIcon } from 'lucide-react';
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

export interface VerticalConfig {
  // Translation namespace (e.g., 'law', 'visa')
  namespace: string;

  // SEO configuration
  seo: {
    title: string;
    description: string;
    keywords: string;
    url: string;
  };

  // Analytics tracking identifiers
  analytics: {
    heroEvent: string;
    ctaEvent: string;
    pageLabel: string;
  };

  // Schema.org structured data
  schema: {
    name: string;
    description: string;
    featureList: string[];
  };

  // Feature icons (maps to translation keys)
  features: Array<{
    icon: LucideIcon;
    gradient: string;
  }>;

  // Client benefit icons (maps to translation keys)
  benefits: Array<{
    icon: LucideIcon;
  }>;

  // Optional sections
  showUseCases?: boolean;
  useCases?: string[];
}

interface VerticalLandingPageProps {
  config: VerticalConfig;
}

const VerticalLandingPage = ({ config }: VerticalLandingPageProps) => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [benefitsRef, benefitsInView] = useInView({
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

  const ns = config.namespace;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title={config.seo.title}
        description={config.seo.description}
        keywords={config.seo.keywords}
        url={config.seo.url}
        type="website"
        hreflang={true}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: config.schema.name,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description: config.schema.description,
            url: config.seo.url,
            offers: {
              '@type': 'Offer',
              price: '49',
              priceCurrency: 'EUR',
              priceValidUntil: '2026-12-31',
              availability: 'https://schema.org/InStock',
              url: 'https://statusat.com/sign-up',
              description: t(`${ns}.hero.trialInfo`),
            },
            provider: {
              '@type': 'Organization',
              name: 'Status At',
              url: 'https://statusat.com',
              logo: 'https://statusat.com/favicon/web-app-manifest-512x512-v3.png',
              description:
                'Professional workflow management and status tracking platform',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@statusat.com',
                contactType: 'Customer Support',
                availableLanguage: ['en', 'de', 'pt', 'es', 'fr'],
              },
            },
            featureList: config.schema.featureList,
            screenshot:
              'https://statusat.com/favicon/web-app-manifest-512x512-v3.png',
          })}
        </script>
      </Helmet>

      <div className="flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container relative z-10 mx-auto px-4 py-6"
        >
          <div className="flex items-center justify-between">
            <RouterLink to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Logo size="lg" showText={true} />
              </motion.div>
            </RouterLink>
            {!user && (
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            )}
          </div>
        </motion.div>

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden py-8 lg:py-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000"></div>

          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              className="mx-auto max-w-5xl space-y-6 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate={heroInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">
                    {t(`${ns}.hero.couponText`)}{' '}
                    <span className="font-mono font-bold">
                      {t(`${ns}.hero.couponCode`)}
                    </span>{' '}
                    {t(`${ns}.hero.couponOffer`)}
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  {t(`${ns}.hero.title`)}
                  <br />
                  <span className="text-gradient-brand">
                    {t(`${ns}.hero.titleHighlight`)}
                  </span>
                </h1>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {t(`${ns}.hero.subtitle`)}
                </p>
              </motion.div>

              {/* Loom video embed */}
              <motion.div variants={fadeInUp} className="mx-auto max-w-2xl">
                <div
                  className="relative overflow-hidden rounded-2xl shadow-2xl"
                  style={{ paddingBottom: '56.25%', height: 0 }}
                >
                  <iframe
                    src="https://www.loom.com/embed/c23c747b5ed841bba5dfca26c68d20b3"
                    allowFullScreen
                    className="absolute left-0 top-0 h-full w-full border-0"
                  ></iframe>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="space-y-6">
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-brand-subtle px-10 py-7 text-lg text-white shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl"
                        onClick={() => {
                          trackSignUpStart(config.analytics.heroEvent);
                          trackClick(
                            `Start Free Trial - ${config.analytics.pageLabel} Hero`,
                            'cta'
                          );
                        }}
                      >
                        <RouterLink to="/sign-up">
                          {t(`${ns}.hero.startTrial`)}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </RouterLink>
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(`${ns}.hero.trialInfo`)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                {t(`${ns}.problem.title`)}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {t(`${ns}.problem.description`)}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: t(`${ns}.problem.painPoints.calls`),
                  },
                  {
                    label: t(`${ns}.problem.painPoints.time`),
                  },
                  {
                    label: t(`${ns}.problem.painPoints.automate`),
                  },
                ].map((item, index) => (
                  <Card key={index} className="p-6">
                    <div className="text-base font-semibold text-muted-foreground">
                      {item.label}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="relative overflow-hidden py-20 lg:py-32"
        >
          <div className="container relative mx-auto px-4">
            <motion.div
              className="mx-auto max-w-6xl"
              variants={staggerContainer}
              initial="hidden"
              animate={featuresInView ? 'visible' : 'hidden'}
            >
              <motion.div
                variants={fadeInUp}
                className="mb-12 space-y-4 text-center"
              >
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                  {t(`${ns}.features.title`)}{' '}
                  <span className="text-gradient-brand">
                    {t(`${ns}.features.titleHighlight`)}
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t(`${ns}.features.subtitle`)}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2"
                variants={staggerContainer}
              >
                {config.features.map((feature, index) => {
                  const featureKeys = [
                    'customWorkflows',
                    'documentManagement',
                    'branding',
                    'tracking',
                    'teamAlignment',
                  ];
                  const key = featureKeys[index] || `feature${index}`;

                  return (
                    <motion.div key={index} variants={scaleIn}>
                      <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-8 shadow-md transition-all duration-300 hover:shadow-xl">
                        <div
                          className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold">
                          {t(`${ns}.features.${key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`${ns}.features.${key}.description`)}
                        </p>
                        <CheckCircle className="absolute right-4 top-4 h-6 w-6 text-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Client Benefits Section */}
        <section ref={benefitsRef} className="bg-slate-950 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-6xl"
              variants={staggerContainer}
              initial="hidden"
              animate={benefitsInView ? 'visible' : 'hidden'}
            >
              <motion.div
                variants={fadeInUp}
                className="mb-16 space-y-4 text-center"
              >
                <h2 className="text-5xl font-bold text-white md:text-6xl">
                  {t(`${ns}.clientBenefits.title`)}
                </h2>
                <p className="text-xl text-slate-300">
                  {t(`${ns}.clientBenefits.subtitle`)}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
              >
                {config.benefits.map((benefit, index) => {
                  const benefitKeys = [
                    'alwaysKnow',
                    'updates',
                    'whatsapp',
                    'history',
                    'signUp',
                    'checkStatus',
                    'checkProgress',
                    'secure',
                  ];
                  const key = benefitKeys[index] || `benefit${index}`;

                  return (
                    <motion.div key={index} variants={scaleIn}>
                      <div className="h-full rounded-2xl bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-brand-subtle mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl">
                          <benefit.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-white">
                          {t(`${ns}.clientBenefits.${key}.title`)}
                        </h3>
                        <p className="text-slate-400">
                          {t(`${ns}.clientBenefits.${key}.description`)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section (Optional) */}
        {config.showUseCases && config.useCases && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-12 text-center text-4xl font-bold md:text-5xl">
                  {t(`${ns}.useCases.title`)}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {config.useCases.map((useCase, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span className="font-semibold">
                          {t(`${ns}.useCases.cases.${useCase}`)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-brand py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                {t(`${ns}.cta.title`)}
              </h2>
              <p className="mb-12 text-xl text-white/90">
                {t(`${ns}.cta.subtitle`)}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white px-10 py-7 text-lg shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
                  style={{ color: 'hsl(var(--brand-primary))' }}
                  onClick={() => {
                    trackSignUpStart(config.analytics.ctaEvent);
                    trackClick(
                      `Start Free Trial - ${config.analytics.pageLabel} CTA`,
                      'cta'
                    );
                  }}
                >
                  <RouterLink to="/sign-up">
                    {t(`${ns}.cta.startTrial`)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </RouterLink>
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-white/80">
                {t(`${ns}.cta.pricing`)}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
                <RouterLink
                  to="/pricing"
                  className="underline transition-colors hover:text-white"
                  onClick={() =>
                    trackClick(
                      `Pricing Link - ${config.analytics.pageLabel} CTA`,
                      'navigation'
                    )
                  }
                >
                  {t('common.viewPricing')}
                </RouterLink>
                <span className="text-white/50">•</span>
                <RouterLink
                  to="/how-it-works"
                  className="underline transition-colors hover:text-white"
                  onClick={() =>
                    trackClick(
                      `How It Works Link - ${config.analytics.pageLabel} CTA`,
                      'navigation'
                    )
                  }
                >
                  {t('common.howItWorks')}
                </RouterLink>
                <span className="text-white/50">•</span>
                <RouterLink
                  to="/demo"
                  className="underline transition-colors hover:text-white"
                  onClick={() =>
                    trackClick(
                      `Book Demo Link - ${config.analytics.pageLabel} CTA`,
                      'navigation'
                    )
                  }
                >
                  {t('common.bookDemo')}
                </RouterLink>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default VerticalLandingPage;
