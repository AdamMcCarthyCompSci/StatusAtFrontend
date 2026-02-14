import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  CheckCircle,
  Workflow,
  Bell,
  FileText,
  XCircle,
  Scale,
  Plane,
  Wrench,
  Landmark,
  Stethoscope,
  GraduationCap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useCurrentUser } from '@/hooks/useUserQuery';
import SEO from '@/components/seo/SEO';
import { trackClick, trackSignUpStart } from '@/lib/analytics';

import Footer from '../layout/Footer';
import InteractiveDemo from './InteractiveDemo';
import FloatingWorkflows from './FloatingWorkflows';

const HomeShell = () => {
  const { t } = useTranslation();
  const { data: user, isLoading } = useCurrentUser();
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [demoRef, demoInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [socialProofRef, socialProofInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [pricingRef, pricingInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Animation variants
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

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title="Case Tracking & Client Updates Platform"
        description="Track case progress and keep clients informed automatically. Built for law firms, visa agencies, repair shops, and service businesses. Custom workflows, WhatsApp & email notifications. Free plan available."
        keywords="case tracking, client status updates, case management, workflow automation, visa tracking, legal case management, WhatsApp notifications, client portal"
        url="https://statusat.com"
        type="website"
        hreflang={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Status At',
          url: 'https://statusat.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://statusat.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Status At Professional Plan',
              description:
                'Ideal for growing service businesses with multiple team members. 100 active cases, 500 status updates/month, 5 managers.',
              image:
                'https://statusat.com/favicon/web-app-manifest-512x512-v3.png',
              brand: {
                '@type': 'Brand',
                name: 'Status At',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
              review: [
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Sarah Johnson',
                  },
                  datePublished: '2025-11-15',
                  reviewBody:
                    'Status At has transformed how we communicate with clients. The workflow automation saves us hours every week, and customers love the real-time updates.',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5',
                  },
                },
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Michael Chen',
                  },
                  datePublished: '2025-10-22',
                  reviewBody:
                    'Great platform for tracking customer statuses. WhatsApp integration works flawlessly and the interface is intuitive.',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5',
                  },
                },
              ],
              offers: {
                '@type': 'Offer',
                url: 'https://statusat.com/sign-up',
                priceCurrency: 'EUR',
                price: '99.00',
                priceValidUntil: '2026-12-31',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'Status At',
                },
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Status At',
              applicationCategory: 'BusinessApplication',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free Customer Account',
                  price: '0',
                  priceCurrency: 'EUR',
                  description: 'Free status tracking for customers',
                },
                {
                  '@type': 'Offer',
                  name: 'Free Plan',
                  price: '0',
                  priceCurrency: 'EUR',
                  description:
                    'Free forever plan with 25 active cases, 100 status updates/month, and custom status flows',
                },
                {
                  '@type': 'AggregateOffer',
                  name: 'Business Plans',
                  lowPrice: '49.00',
                  highPrice: '199.00',
                  priceCurrency: 'EUR',
                  offerCount: '3',
                  description:
                    'Paid plans for business owners to manage workflows',
                },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
            },
          ])}
        </script>
      </Helmet>
      <div className="flex-1">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container relative z-10 mx-auto px-4 py-6"
        >
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Logo size="lg" showText={true} />
            </motion.div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </motion.div>

        {/* Hero Section with Gradient Background */}
        <section
          ref={heroRef}
          className="relative overflow-hidden py-20 lg:py-32"
        >
          {/* Animated Workflow Shapes Background */}
          <FloatingWorkflows />

          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              className="mx-auto max-w-5xl space-y-8 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate={heroInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                  {t('home.hero.title1')}
                  <br />
                  <span className="text-gradient-brand">
                    {t('home.hero.title2')}
                  </span>
                </h1>
                <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
                  {t('home.hero.subtitle')}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="mx-auto h-14 w-64 rounded-lg bg-muted"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <p className="text-xl text-foreground">
                      {t('home.hero.welcomeBack', {
                        name: user.name || user.email,
                      })}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-brand-subtle px-10 py-7 text-lg text-white shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl"
                      >
                        <RouterLink to="/dashboard">
                          {t('home.hero.goToDashboard')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </RouterLink>
                      </Button>
                    </motion.div>
                  </div>
                ) : (
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
                            trackSignUpStart('home_hero');
                            trackClick('Start for Free - Home Hero', 'cta');
                          }}
                        >
                          <RouterLink to="/sign-up">
                            {t('home.hero.startTrial')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </RouterLink>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="border-2 px-10 py-7 text-lg transition-all duration-300 hover:bg-muted/50 hover:text-foreground"
                        >
                          <RouterLink to="/sign-in">
                            {t('home.hero.signIn')}
                          </RouterLink>
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('home.hero.trialInfo')}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section ref={demoRef} className="bg-muted/30 py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-6xl"
              variants={staggerContainer}
              initial="hidden"
              animate={demoInView ? 'visible' : 'hidden'}
            >
              <motion.div
                variants={fadeInUp}
                className="mb-16 space-y-4 text-center"
              >
                <h2 className="text-4xl font-bold md:text-5xl">
                  {t('home.demo.title1')}{' '}
                  <span className="text-primary">{t('home.demo.title2')}</span>
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                  {t('home.demo.subtitle')}
                </p>
              </motion.div>

              <motion.div variants={scaleIn}>
                <InteractiveDemo autoStart={demoInView} />
              </motion.div>
            </motion.div>
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
                  {t('home.features.title1')}{' '}
                  <span className="text-gradient-brand">
                    {t('home.features.title2')}
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t('home.features.subtitle')}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-4 md:grid-cols-2"
                variants={staggerContainer}
              >
                {[
                  {
                    icon: Workflow,
                    title: t('home.features.designWorkflows.title'),
                    description: t('home.features.designWorkflows.description'),
                    gradient: 'from-blue-500 to-cyan-500',
                    shortDesc: t('home.features.designWorkflows.shortDesc'),
                  },
                  {
                    icon: Zap,
                    title: t('home.features.saveTime.title'),
                    description: t('home.features.saveTime.description'),
                    gradient: 'from-purple-500 to-pink-500',
                    shortDesc: t('home.features.saveTime.shortDesc'),
                  },
                  {
                    icon: Bell,
                    title: t('home.customerFeatures.updatesComeTo.title'),
                    description: t(
                      'home.customerFeatures.updatesComeTo.description'
                    ),
                    gradient: 'from-green-500 to-emerald-500',
                  },
                  {
                    icon: FileText,
                    title: t('home.features.documentManagement.title'),
                    description: t(
                      'home.features.documentManagement.description'
                    ),
                    gradient: 'from-yellow-500 to-orange-500',
                    shortDesc: t('home.features.documentManagement.shortDesc'),
                  },
                ].map((feature, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-8 shadow-md transition-all duration-300 hover:shadow-xl">
                      <div
                        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${feature.gradient}`}
                      ></div>
                      <div className="flex items-start gap-6">
                        <div
                          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-2xl font-bold">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section ref={socialProofRef} className="bg-muted/30 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-4xl"
              variants={staggerContainer}
              initial="hidden"
              animate={socialProofInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="space-y-8 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                  {t('home.socialProof.title')}
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    {
                      icon: Scale,
                      label: t('home.socialProof.industries.law'),
                    },
                    {
                      icon: Plane,
                      label: t('home.socialProof.industries.immigration'),
                    },
                    {
                      icon: Wrench,
                      label: t('home.socialProof.industries.autoRepair'),
                    },
                    {
                      icon: Landmark,
                      label: t('home.socialProof.industries.finance'),
                    },
                    {
                      icon: Stethoscope,
                      label: t('home.socialProof.industries.healthcare'),
                    },
                    {
                      icon: GraduationCap,
                      label: t('home.socialProof.industries.education'),
                    },
                  ].map((industry, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                    >
                      <industry.icon className="h-4 w-4 text-muted-foreground" />
                      {industry.label}
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  variants={fadeInUp}
                  className="mx-auto max-w-2xl text-lg italic text-muted-foreground"
                >
                  "{t('home.socialProof.quote')}"
                </motion.p>
                <motion.p
                  variants={fadeInUp}
                  className="text-sm font-medium text-foreground"
                >
                  {t('home.socialProof.attribution')}
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto max-w-6xl"
              variants={staggerContainer}
              initial="hidden"
              animate={pricingInView ? 'visible' : 'hidden'}
            >
              <motion.div
                variants={fadeInUp}
                className="mb-16 space-y-4 text-center"
              >
                <h2 className="text-4xl font-bold md:text-5xl">
                  {t('home.pricing.title1')}{' '}
                  <span className="text-primary">
                    {t('home.pricing.title2')}
                  </span>{' '}
                  {t('home.pricing.title3')}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t('home.pricing.subtitle')}
                </p>
              </motion.div>

              <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-4">
                {(() => {
                  const getRows = (
                    key: string
                  ): { text: string; included: boolean }[] => {
                    const rows = t(key, { returnObjects: true });
                    if (Array.isArray(rows)) {
                      return rows.filter(
                        (r): r is { text: string; included: boolean } =>
                          typeof r === 'object' &&
                          r !== null &&
                          'text' in r &&
                          'included' in r
                      );
                    }
                    return [];
                  };

                  const plans = [
                    {
                      name: t('home.pricing.plans.free.name'),
                      price: t('home.pricing.plans.free.price'),
                      period: '',
                      description: t('home.pricing.plans.free.description'),
                      rows: getRows('home.pricing.plans.free.rows'),
                      popular: false,
                      isFree: true,
                    },
                    {
                      name: t('home.pricing.plans.starter.name'),
                      price: t('home.pricing.plans.starter.price'),
                      period: t('home.pricing.perMonth'),
                      description: t('home.pricing.plans.starter.description'),
                      rows: getRows('home.pricing.plans.starter.rows'),
                      popular: false,
                      isFree: false,
                    },
                    {
                      name: t('home.pricing.plans.professional.name'),
                      price: t('home.pricing.plans.professional.price'),
                      period: t('home.pricing.perMonth'),
                      description: t(
                        'home.pricing.plans.professional.description'
                      ),
                      rows: getRows('home.pricing.plans.professional.rows'),
                      popular: true,
                      isFree: false,
                    },
                    {
                      name: t('home.pricing.plans.enterprise.name'),
                      price: t('home.pricing.plans.enterprise.price'),
                      period: t('home.pricing.perMonth'),
                      description: t(
                        'home.pricing.plans.enterprise.description'
                      ),
                      rows: getRows('home.pricing.plans.enterprise.rows'),
                      popular: false,
                      isFree: false,
                    },
                  ];

                  return plans.map((plan, index) => (
                    <motion.div key={index} variants={scaleIn}>
                      <Card
                        className={`relative flex h-full flex-col overflow-hidden p-8 transition-all duration-300 hover:scale-105 ${
                          plan.popular
                            ? 'border-primary bg-gradient-to-b from-primary/5 to-background shadow-xl'
                            : 'border-border hover:shadow-lg'
                        }`}
                      >
                        {plan.popular && (
                          <div className="bg-gradient-brand-subtle absolute right-0 top-0 rounded-bl-lg px-4 py-1 text-sm font-medium text-white">
                            {t('home.pricing.mostPopular')}
                          </div>
                        )}
                        <div className="mb-8 text-center">
                          <h3 className="mb-2 text-2xl font-bold">
                            {plan.name}
                          </h3>
                          <div className="mb-2">
                            <span className="text-4xl font-bold">
                              {plan.price}
                            </span>
                            {plan.period && (
                              <span className="text-muted-foreground">
                                {plan.period}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                        <ul className="mb-8 flex-1 space-y-3">
                          {plan.rows.map((row, rowIndex) => (
                            <li key={rowIndex} className="flex items-center">
                              {row.included ? (
                                <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                              ) : (
                                <XCircle className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              )}
                              <span
                                className={
                                  row.included ? '' : 'text-muted-foreground'
                                }
                              >
                                {row.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          asChild
                          className={`w-full ${
                            plan.popular
                              ? 'bg-gradient-brand-subtle text-white hover:opacity-90'
                              : ''
                          }`}
                          variant={plan.popular ? 'default' : 'outline'}
                          onClick={() => {
                            trackSignUpStart(
                              `home_pricing_${plan.name.toLowerCase()}`
                            );
                            trackClick(
                              plan.isFree
                                ? 'Start for Free - Free Plan'
                                : `Start Trial - ${plan.name} Plan`,
                              'pricing'
                            );
                          }}
                        >
                          <RouterLink to="/sign-up">
                            {plan.isFree
                              ? t('home.pricing.startFree')
                              : t('home.pricing.startTrial')}
                          </RouterLink>
                        </Button>
                      </Card>
                    </motion.div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomeShell;
