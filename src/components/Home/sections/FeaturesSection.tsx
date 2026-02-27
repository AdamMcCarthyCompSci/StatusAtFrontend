import { Workflow, Zap, Bell, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import FloatingWorkflows from '../FloatingWorkflows';

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

const brandGradients = [
  'bg-gradient-brand-subtle', // primary → blue
  'bg-gradient-brand-purple', // blue → purple
  'bg-gradient-brand-subtle',
  'bg-gradient-brand-purple',
];

const FeaturesSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      icon: Workflow,
      title: t('home.features.designWorkflows.title'),
      description: t('home.features.designWorkflows.description'),
    },
    {
      icon: Zap,
      title: t('home.features.saveTime.title'),
      description: t('home.features.saveTime.description'),
    },
    {
      icon: Bell,
      title: t('home.customerFeatures.updatesComeTo.title'),
      description: t('home.customerFeatures.updatesComeTo.description'),
    },
    {
      icon: FileText,
      title: t('home.features.documentManagement.title'),
      description: t('home.features.documentManagement.description'),
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated Workflow Shapes Background */}
      <FloatingWorkflows />

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
            className="grid gap-6 md:grid-cols-2"
            variants={staggerContainer}
          >
            {features.map((feature, index) => {
              const gradient = brandGradients[index];
              return (
                <motion.div key={index} variants={scaleIn}>
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-accent/30">
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${gradient}`}
                    />
                    <div className="flex items-start gap-6">
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ${gradient} shadow-lg`}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
