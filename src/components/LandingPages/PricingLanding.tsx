import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
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

const PricingLanding = () => {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();

  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [pricingRef, pricingInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [faqRef, faqInView] = useInView({
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
    trackClick('pricing_cta_click');
    trackSignUpStart('pricing_page');
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title={t('pricing.seo.title')}
        description={t('pricing.seo.description')}
        keywords={t('pricing.seo.keywords')}
        url="https://www.statusat.com/pricing"
        type="website"
        hreflang={true}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'StatusAt - Status Tracking Software',
            description: t('pricing.seo.description'),
            url: 'https://www.statusat.com/pricing',
            offers: [
              {
                '@type': 'Offer',
                name: 'Starter Plan',
                price: '49',
                priceCurrency: 'EUR',
                priceValidUntil: '2026-12-31',
                availability: 'https://schema.org/InStock',
                url: 'https://www.statusat.com/pricing',
              },
              {
                '@type': 'Offer',
                name: 'Professional Plan',
                price: '99',
                priceCurrency: 'EUR',
                priceValidUntil: '2026-12-31',
                availability: 'https://schema.org/InStock',
                url: 'https://www.statusat.com/pricing',
              },
              {
                '@type': 'Offer',
                name: 'Enterprise Plan',
                price: '199',
                priceCurrency: 'EUR',
                priceValidUntil: '2026-12-31',
                availability: 'https://schema.org/InStock',
                url: 'https://www.statusat.com/pricing',
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
              {t('pricing.hero.title')}{' '}
              <span className="text-gradient-brand">
                {t('pricing.hero.titleHighlight')}
              </span>{' '}
              {t('pricing.hero.title2')}
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              {t('pricing.hero.subtitle')}
            </p>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              {t('pricing.hero.trialInfo')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section ref={pricingRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={pricingInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3"
          >
            {/* Starter Plan */}
            <motion.div variants={scaleIn}>
              <Card className="relative flex h-full flex-col overflow-hidden p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold">
                    {t('pricing.plans.starter.name')}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      {t('pricing.plans.starter.price')}
                    </span>
                    <span className="text-muted-foreground">
                      {t('pricing.plans.starter.period')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.plans.starter.description')}
                  </p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {(
                    t('pricing.plans.starter.features', {
                      returnObjects: true,
                    }) as string[]
                  ).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant="outline"
                  onClick={handleCTAClick}
                >
                  <RouterLink to="/sign-up">
                    {t('pricing.plans.starter.cta')}
                  </RouterLink>
                </Button>
              </Card>
            </motion.div>

            {/* Professional Plan - Most Popular */}
            <motion.div variants={scaleIn}>
              <Card className="relative flex h-full flex-col overflow-hidden border-primary bg-gradient-to-b from-primary/5 to-background p-8 shadow-xl transition-all duration-300 hover:scale-105">
                <div className="bg-gradient-brand-subtle absolute right-0 top-0 rounded-bl-lg px-4 py-1 text-sm font-medium text-white">
                  {t('pricing.plans.professional.popular')}
                </div>
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold">
                    {t('pricing.plans.professional.name')}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      {t('pricing.plans.professional.price')}
                    </span>
                    <span className="text-muted-foreground">
                      {t('pricing.plans.professional.period')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.plans.professional.description')}
                  </p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {(
                    t('pricing.plans.professional.features', {
                      returnObjects: true,
                    }) as string[]
                  ).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="bg-gradient-brand-subtle w-full hover:opacity-90"
                  onClick={handleCTAClick}
                >
                  <RouterLink to="/sign-up">
                    {t('pricing.plans.professional.cta')}
                  </RouterLink>
                </Button>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={scaleIn}>
              <Card className="relative flex h-full flex-col overflow-hidden p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold">
                    {t('pricing.plans.enterprise.name')}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">
                      {t('pricing.plans.enterprise.price')}
                    </span>
                    <span className="text-muted-foreground">
                      {t('pricing.plans.enterprise.period')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('pricing.plans.enterprise.description')}
                  </p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {(
                    t('pricing.plans.enterprise.features', {
                      returnObjects: true,
                    }) as string[]
                  ).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant="outline"
                  onClick={handleCTAClick}
                >
                  <RouterLink to="/sign-up">
                    {t('pricing.plans.enterprise.cta')}
                  </RouterLink>
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={faqInView ? 'visible' : 'hidden'}
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {t('pricing.faq.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('pricing.faq.subtitle')}
              </p>
            </div>
            <motion.div variants={staggerContainer} className="space-y-6">
              {(
                t('pricing.faq.questions', {
                  returnObjects: true,
                }) as Array<{ q: string; a: string }>
              ).map((item, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="p-6">
                    <h3 className="mb-3 text-lg font-semibold">{item.q}</h3>
                    <p className="text-muted-foreground">{item.a}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
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
              {t('pricing.cta.title')}
            </h2>
            <p className="mb-8 text-lg text-white/90">
              {t('pricing.cta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleCTAClick}
              >
                <RouterLink to="/sign-up">
                  {t('pricing.cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </RouterLink>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/80">
              {t('pricing.cta.noCredit')}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingLanding;
