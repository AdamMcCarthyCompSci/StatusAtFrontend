import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Scale,
  Bell,
  Users,
  Clock,
  FileText,
  MessageCircle,
  Smartphone,
  Shield,
  Zap,
  Tag,
  Briefcase,
  Workflow,
  Palette,
  Eye,
  History,
  QrCode,
  BarChart3,
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

const LawServicesLanding = () => {
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

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title="Legal Case Status Tracking Software | Keep Clients Informed"
        description="Professional case tracking platform for law firms and legal services. Automate client updates via WhatsApp, manage case documents, and track legal proceedings. 10% off with code LAW10. Start your 7-day free trial."
        keywords="legal case management, law firm software, case tracking, legal status updates, client portal for lawyers, legal case management software"
        url="https://www.statusat.com/law-services"
        type="website"
        hreflang={true}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Status At - Legal Case Tracking',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description:
              'Professional case tracking platform for law firms and legal services. Automate client updates and manage legal cases efficiently.',
            url: 'https://www.statusat.com/law-services',
            offers: {
              '@type': 'Offer',
              price: '49',
              priceCurrency: 'EUR',
              priceValidUntil: '2026-12-31',
              availability: 'https://schema.org/InStock',
              url: 'https://www.statusat.com/sign-up',
              description:
                '7-day free trial, then starting from €49/month. Use code LAW10 for 10% off.',
            },
            provider: {
              '@type': 'Organization',
              name: 'Status At',
              url: 'https://www.statusat.com',
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
            featureList: [
              'Custom legal case workflows',
              'Document management',
              'Automated client notifications',
              'Case tracking & updates',
              'Team collaboration',
              'Brand customization',
              'Secure client portal',
            ],
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Logo size="lg" showText={true} />
            </motion.div>
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
                  <Tag className="h-5 w-5" />
                  <span className="font-semibold">
                    {t('law.hero.couponText')}{' '}
                    <span className="font-mono font-bold">
                      {t('law.hero.couponCode')}
                    </span>{' '}
                    {t('law.hero.couponOffer')}
                  </span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                  {t('law.hero.title')}
                  <br />
                  <span className="text-gradient-brand">
                    {t('law.hero.titleHighlight')}
                  </span>
                </h1>
                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {t('law.hero.subtitle')}
                </p>
              </motion.div>

              {/* Loom video embed */}
              <motion.div variants={fadeInUp} className="mx-auto max-w-2xl">
                <div
                  className="relative overflow-hidden rounded-2xl shadow-2xl"
                  style={{ paddingBottom: '56.25%', height: 0 }}
                >
                  <iframe
                    src="https://www.loom.com/embed/51556921cee04e5c85b284fbb179d58c"
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
                          trackSignUpStart('law_services_hero');
                          trackClick('Start Free Trial - Law Hero', 'cta');
                        }}
                      >
                        <RouterLink to="/sign-up">
                          {t('law.hero.startTrial')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </RouterLink>
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('law.hero.trialInfo')}
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
                {t('law.problem.title')}
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {t('law.problem.description')}
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: t('law.problem.painPoints.calls'),
                  },
                  {
                    label: t('law.problem.painPoints.time'),
                  },
                  {
                    label: t('law.problem.painPoints.automate'),
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
                  {t('law.features.title')}{' '}
                  <span className="text-gradient-brand">
                    {t('law.features.titleHighlight')}
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t('law.features.subtitle')}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2"
                variants={staggerContainer}
              >
                {[
                  {
                    icon: Workflow,
                    title: t('law.features.customWorkflows.title'),
                    description: t('law.features.customWorkflows.description'),
                    gradient: 'from-indigo-500 to-purple-500',
                  },
                  {
                    icon: FileText,
                    title: t('law.features.documentManagement.title'),
                    description: t(
                      'law.features.documentManagement.description'
                    ),
                    gradient: 'from-orange-500 to-red-500',
                  },
                  {
                    icon: Palette,
                    title: t('law.features.branding.title'),
                    description: t('law.features.branding.description'),
                    gradient: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: BarChart3,
                    title: t('law.features.tracking.title'),
                    description: t('law.features.tracking.description'),
                    gradient: 'from-green-500 to-emerald-500',
                  },
                ].map((feature, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-8 shadow-md transition-all duration-300 hover:shadow-xl">
                      <div
                        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                      <CheckCircle className="absolute right-4 top-4 h-6 w-6 text-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </motion.div>
                ))}
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
                  {t('law.clientBenefits.title')}
                </h2>
                <p className="text-xl text-slate-300">
                  {t('law.clientBenefits.subtitle')}
                </p>
              </motion.div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
              >
                {[
                  {
                    icon: Eye,
                    title: t('law.clientBenefits.alwaysKnow.title'),
                    description: t('law.clientBenefits.alwaysKnow.description'),
                  },
                  {
                    icon: Bell,
                    title: t('law.clientBenefits.updates.title'),
                    description: t('law.clientBenefits.updates.description'),
                  },
                  {
                    icon: History,
                    title: t('law.clientBenefits.history.title'),
                    description: t('law.clientBenefits.history.description'),
                  },
                  {
                    icon: QrCode,
                    title: t('law.clientBenefits.signUp.title'),
                    description: t('law.clientBenefits.signUp.description'),
                  },
                  {
                    icon: Smartphone,
                    title: t('law.clientBenefits.checkStatus.title'),
                    description: t(
                      'law.clientBenefits.checkStatus.description'
                    ),
                  },
                  {
                    icon: Shield,
                    title: t('law.clientBenefits.secure.title'),
                    description: t('law.clientBenefits.secure.description'),
                  },
                ].map((benefit, index) => (
                  <motion.div key={index} variants={scaleIn}>
                    <div className="h-full rounded-2xl bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="bg-gradient-brand-subtle mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl">
                        <benefit.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-12 text-center text-4xl font-bold md:text-5xl">
                {t('law.useCases.title')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  t('law.useCases.cases.personalInjury'),
                  t('law.useCases.cases.familyLaw'),
                  t('law.useCases.cases.immigration'),
                  t('law.useCases.cases.criminalDefense'),
                  t('law.useCases.cases.contracts'),
                  t('law.useCases.cases.realEstate'),
                  t('law.useCases.cases.estatePlanning'),
                  t('law.useCases.cases.businessLitigation'),
                  t('law.useCases.cases.employment'),
                ].map((useCase, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary" />
                      <span className="font-semibold">{useCase}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-brand py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                {t('law.cta.title')}
              </h2>
              <p className="mb-12 text-xl text-white/90">
                {t('law.cta.subtitle')}
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
                    trackSignUpStart('law_services_cta');
                    trackClick('Start Free Trial - Law CTA', 'cta');
                  }}
                >
                  <RouterLink to="/sign-up">
                    {t('law.cta.startTrial')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </RouterLink>
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-white/80">
                {t('law.cta.pricing')}
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LawServicesLanding;
