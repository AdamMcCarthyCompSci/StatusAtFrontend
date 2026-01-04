import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  MessageCircle,
  Zap,
  Shield,
  CheckCircle,
  Mail,
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

const DemoLanding = () => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [whyDemoRef, whyDemoInView] = useInView({
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
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const handleCTAClick = () => {
    trackClick('demo_cta_click');
    trackSignUpStart('demo_page');
  };

  const whyDemoIcons = [Eye, MessageCircle, Zap, Shield];

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title={t('demo.seo.title')}
        description={t('demo.seo.description')}
        keywords={t('demo.seo.keywords')}
        url="https://statusat.com/demo"
        type="website"
        hreflang={true}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'StatusAt Product Demo',
            description: t('demo.seo.description'),
            provider: {
              '@type': 'Organization',
              name: 'StatusAt',
              url: 'https://statusat.com',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
              description: 'Free 30-minute personalized demo',
            },
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
              {t('demo.hero.title')}{' '}
              <span className="text-gradient-brand">
                {t('demo.hero.titleHighlight')}
              </span>{' '}
              {t('demo.hero.title2')}
            </h1>
            <p className="mb-4 text-xl text-muted-foreground">
              {t('demo.hero.subtitle')}
            </p>
            <p className="text-base text-muted-foreground">
              {t('demo.hero.subtext')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Book a Demo */}
      <section ref={whyDemoRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={whyDemoInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('demo.whyDemo.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('demo.whyDemo.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={whyDemoInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
          >
            {['reason1', 'reason2', 'reason3', 'reason4'].map(
              (reasonKey, index) => {
                const ReasonIcon = whyDemoIcons[index];
                const reason = t(`demo.whyDemo.${reasonKey}`, {
                  returnObjects: true,
                }) as {
                  title: string;
                  description: string;
                };

                return (
                  <motion.div key={reasonKey} variants={scaleIn}>
                    <Card className="h-full p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="bg-gradient-brand-subtle mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white">
                        <ReasonIcon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {reason.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              }
            )}
          </motion.div>
        </div>
      </section>

      {/* Demo Agenda */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('demo.agenda.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('demo.agenda.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl space-y-6"
          >
            {['item1', 'item2', 'item3', 'item4'].map(itemKey => {
              const item = t(`demo.agenda.${itemKey}`, {
                returnObjects: true,
              }) as {
                duration: string;
                title: string;
                description: string;
              };

              return (
                <motion.div key={itemKey} variants={scaleIn}>
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-brand-subtle flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
                        {item.duration}
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Calendly Embed / Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {t('demo.form.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('demo.form.subtitle')}
              </p>
            </div>

            {/* Booking Embed */}
            <Card className="overflow-hidden p-0">
              <iframe
                src={t('demo.form.calendlyEmbed')}
                style={{ width: '100%', minHeight: '700px', border: 'none' }}
                title="Book a Demo"
              ></iframe>
            </Card>

            {/* Alternative Contact */}
            <div className="mt-12">
              <h3 className="mb-6 text-center text-xl font-semibold">
                {t('demo.form.alternativeContact.title')}
              </h3>
              <div className="flex flex-col items-center justify-center gap-4">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a href={`mailto:${t('demo.form.alternativeContact.email')}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    {t('demo.form.alternativeContact.emailLabel')}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits List */}
      <section ref={benefitsRef} className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={benefitsInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t('demo.benefits.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('demo.benefits.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={benefitsInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2"
          >
            {[
              'benefit1',
              'benefit2',
              'benefit3',
              'benefit4',
              'benefit5',
              'benefit6',
              'benefit7',
              'benefit8',
            ].map(benefitKey => {
              const benefit = t(`demo.benefits.${benefitKey}`);
              return (
                <motion.div
                  key={benefitKey}
                  variants={scaleIn}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-brand relative overflow-hidden py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t('demo.cta.title')}
            </h2>
            <p className="mb-8 text-lg text-white/90">
              {t('demo.cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-white/90"
                onClick={handleCTAClick}
              >
                <RouterLink
                  to="/sign-up"
                  className="text-black dark:text-black"
                >
                  {t('demo.cta.primaryButton')}
                  <ArrowRight className="ml-2 h-5 w-5 text-black dark:text-black" />
                </RouterLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
              >
                <RouterLink to="/how-it-works">
                  {t('demo.cta.secondaryButton')}
                </RouterLink>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/80">{t('demo.cta.note')}</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DemoLanding;
