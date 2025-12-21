import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Users,
  Zap,
  Clock,
  CheckCircle,
  Globe,
  MessageCircle,
  Headphones,
  Workflow,
  Palette,
  Eye,
  Bell,
  History,
  QrCode,
  Smartphone,
  Shield,
  FileText,
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

import Footer from '../layout/Footer';
import InteractiveDemo from './InteractiveDemo';

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
  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [demoRef, demoInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [pricingRef, pricingInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [customerRef, customerInView] = useInView({
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
        title="Status Tracking Platform - Free for Customers"
        description="Free status tracking for customers. Business owners can manage workflows, track customer statuses, and automate updates. Plans from €49/month. 7-day free trial."
        keywords="free status tracker, customer status tracking, workflow management, business automation, customer tracking platform, WhatsApp status updates"
        url="https://www.statusat.com"
        type="website"
        hreflang={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Status At',
          url: 'https://www.statusat.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.statusat.com/search?q={search_term_string}',
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
                url: 'https://www.statusat.com/sign-up',
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
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"></div>
          <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl delay-1000"></div>

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

        {/* Stats Section */}
        <section ref={statsRef} className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              animate={statsInView ? 'visible' : 'hidden'}
            >
              {[
                {
                  number: t('home.stats.whatsapp'),
                  label: t('home.stats.whatsappLabel'),
                  icon: MessageCircle,
                },
                {
                  number: t('home.stats.support247'),
                  label: t('home.stats.supportLabel'),
                  icon: Headphones,
                },
                {
                  number: t('home.stats.custom'),
                  label: t('home.stats.customLabel'),
                  icon: Workflow,
                },
                {
                  number: t('home.stats.sameDay'),
                  label: t('home.stats.sameDayLabel'),
                  icon: Clock,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="space-y-2 text-center"
                >
                  <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <div className="text-3xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
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
                <InteractiveDemo />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section
          ref={featuresRef}
          className="relative overflow-hidden py-20 lg:py-32"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
          <div className="absolute left-1/3 top-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000"></div>

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
                    icon: BarChart3,
                    title: t('home.features.trackBusiness.title'),
                    description: t('home.features.trackBusiness.description'),
                    gradient: 'from-blue-500 to-cyan-500',
                    shortDesc: t('home.features.trackBusiness.shortDesc'),
                  },
                  {
                    icon: Users,
                    title: t('home.features.teamAligned.title'),
                    description: t('home.features.teamAligned.description'),
                    gradient: 'from-purple-500 to-pink-500',
                    shortDesc: t('home.features.teamAligned.shortDesc'),
                  },
                  {
                    icon: Zap,
                    title: t('home.features.saveTime.title'),
                    description: t('home.features.saveTime.description'),
                    gradient: 'from-yellow-500 to-orange-500',
                    shortDesc: t('home.features.saveTime.shortDesc'),
                  },
                  {
                    icon: Workflow,
                    title: t('home.features.designWorkflows.title'),
                    description: t('home.features.designWorkflows.description'),
                    gradient: 'from-green-500 to-emerald-500',
                    shortDesc: t('home.features.designWorkflows.shortDesc'),
                  },
                  {
                    icon: Palette,
                    title: t('home.features.professionalImage.title'),
                    description: t(
                      'home.features.professionalImage.description'
                    ),
                    gradient: 'from-indigo-500 to-blue-500',
                    shortDesc: t('home.features.professionalImage.shortDesc'),
                  },
                  {
                    icon: FileText,
                    title: t('home.features.documentManagement.title'),
                    description: t(
                      'home.features.documentManagement.description'
                    ),
                    gradient: 'from-red-500 to-pink-500',
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
                          <p className="mb-2 text-sm font-medium text-primary">
                            {feature.shortDesc}
                          </p>
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

        {/* Decorative Divider - Only visible in light mode */}
        <div className="relative h-48 overflow-hidden dark:hidden">
          {/* Main gradient from white to dark with blue tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-background from-0% via-slate-700/10 via-slate-800/30 via-20% via-50% to-slate-950 to-100%"></div>
          {/* Blue tint that gets stronger towards bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% via-blue-950/20 via-70% to-blue-950/50 to-100%"></div>
        </div>

        {/* Customer Perspective Section - Dark Theme */}
        <section
          ref={customerRef}
          className="relative overflow-hidden bg-slate-950 py-20 lg:py-32"
        >
          {/* Dark Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-slate-950 to-purple-950/50"></div>
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600/20 blur-3xl delay-1000"></div>

          <div className="container relative mx-auto px-4">
            <motion.div
              className="mx-auto max-w-7xl"
              variants={staggerContainer}
              initial="hidden"
              animate={customerInView ? 'visible' : 'hidden'}
            >
              <motion.div
                variants={fadeInUp}
                className="mb-16 space-y-8 text-center"
              >
                <h2 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
                  {t('home.customerFeatures.title1')}
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {t('home.customerFeatures.title2')}
                  </span>
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-slate-300 md:text-2xl">
                  {t('home.customerFeatures.subtitle')}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
              >
                {[
                  {
                    icon: Eye,
                    title: t('home.customerFeatures.alwaysKnow.title'),
                    description: t(
                      'home.customerFeatures.alwaysKnow.description'
                    ),
                    gradient: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: Bell,
                    title: t('home.customerFeatures.updatesComeTo.title'),
                    description: t(
                      'home.customerFeatures.updatesComeTo.description'
                    ),
                    gradient: 'from-purple-500 to-pink-500',
                  },
                  {
                    icon: History,
                    title: t('home.customerFeatures.completeHistory.title'),
                    description: t(
                      'home.customerFeatures.completeHistory.description'
                    ),
                    gradient: 'from-yellow-500 to-orange-500',
                  },
                  {
                    icon: QrCode,
                    title: t('home.customerFeatures.signUpSeconds.title'),
                    description: t(
                      'home.customerFeatures.signUpSeconds.description'
                    ),
                    gradient: 'from-green-500 to-emerald-500',
                  },
                  {
                    icon: Smartphone,
                    title: t('home.customerFeatures.checkProgress.title'),
                    description: t(
                      'home.customerFeatures.checkProgress.description'
                    ),
                    gradient: 'from-indigo-500 to-blue-500',
                  },
                  {
                    icon: Shield,
                    title: t('home.customerFeatures.reliableService.title'),
                    description: t(
                      'home.customerFeatures.reliableService.description'
                    ),
                    gradient: 'from-red-500 to-pink-500',
                  },
                ].map((feature, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg shadow-black/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/50">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                      ></div>
                      <div className="relative">
                        <div
                          className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                        >
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
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

              <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {(() => {
                  const getFeatures = (key: string): string[] => {
                    const features = t(key, { returnObjects: true });
                    if (Array.isArray(features)) {
                      return features.filter(
                        (f): f is string => typeof f === 'string'
                      );
                    }
                    return [];
                  };

                  return [
                    {
                      name: t('home.pricing.plans.starter.name'),
                      price: t('home.pricing.plans.starter.price'),
                      period: t('home.pricing.perMonth'),
                      description: t('home.pricing.plans.starter.description'),
                      features: getFeatures(
                        'home.pricing.plans.starter.features'
                      ),
                      popular: false,
                    },
                    {
                      name: t('home.pricing.plans.professional.name'),
                      price: t('home.pricing.plans.professional.price'),
                      period: t('home.pricing.perMonth'),
                      description: t(
                        'home.pricing.plans.professional.description'
                      ),
                      features: getFeatures(
                        'home.pricing.plans.professional.features'
                      ),
                      popular: true,
                    },
                    {
                      name: t('home.pricing.plans.enterprise.name'),
                      price: t('home.pricing.plans.enterprise.price'),
                      period: t('home.pricing.perMonth'),
                      description: t(
                        'home.pricing.plans.enterprise.description'
                      ),
                      features: getFeatures(
                        'home.pricing.plans.enterprise.features'
                      ),
                      popular: false,
                    },
                  ];
                })().map((plan, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <Card
                      className={`relative h-full overflow-hidden p-8 transition-all duration-300 hover:scale-105 ${
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
                        <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                        <div className="mb-2">
                          <span className="text-4xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            {plan.period}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                      <ul className="mb-8 space-y-3">
                        {plan.features.map((feature, featureIndex) => {
                          const isDomain =
                            feature.includes('.com') ||
                            feature.includes('statusat.com');
                          return (
                            <li
                              key={featureIndex}
                              className="flex items-center"
                            >
                              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                              {isDomain ? (
                                <span className="rounded border bg-muted/50 px-2 py-1 font-mono text-sm">
                                  {feature}
                                </span>
                              ) : (
                                <span>{feature}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      <Button
                        asChild
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-brand-subtle text-white hover:opacity-90'
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        <RouterLink to="/sign-up">
                          {t('home.pricing.startTrial')}
                        </RouterLink>
                      </Button>
                    </Card>
                  </motion.div>
                ))}
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
