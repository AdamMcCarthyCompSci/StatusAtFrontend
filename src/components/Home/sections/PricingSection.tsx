import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trackClick, trackSignUpStart } from '@/lib/analytics';

import FloatingBlobs from '../FloatingBlobs';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const PricingSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const getRows = (key: string): { text: string; included: boolean }[] => {
    const rows = t(key, { returnObjects: true });
    if (Array.isArray(rows)) {
      return rows.filter(
        (r): r is { text: string; included: boolean } =>
          typeof r === 'object' && r !== null && 'text' in r && 'included' in r
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
      description: t('home.pricing.plans.professional.description'),
      rows: getRows('home.pricing.plans.professional.rows'),
      popular: true,
      isFree: false,
    },
    {
      name: t('home.pricing.plans.enterprise.name'),
      price: t('home.pricing.plans.enterprise.price'),
      period: t('home.pricing.perMonth'),
      description: t('home.pricing.plans.enterprise.description'),
      rows: getRows('home.pricing.plans.enterprise.rows'),
      popular: false,
      isFree: false,
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-20 lg:py-32">
      <FloatingBlobs side="both" count={16} />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mx-auto max-w-6xl"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={fadeInUp}
            className="mb-16 space-y-4 text-center"
          >
            <h2 className="text-4xl font-bold md:text-5xl">
              {t('home.pricing.title1')}{' '}
              <span className="text-primary">{t('home.pricing.title2')}</span>{' '}
              {t('home.pricing.title3')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('home.pricing.subtitle')}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => (
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
                    <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
