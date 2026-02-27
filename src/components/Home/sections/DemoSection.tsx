import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import InteractiveDemo from '../InteractiveDemo';
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

const DemoSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-muted/30 py-20 lg:py-32"
    >
      <FloatingBlobs side="both" count={14} />
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
              {t('home.demo.title1')}{' '}
              <span className="text-primary">{t('home.demo.title2')}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              {t('home.demo.subtitle')}
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <InteractiveDemo autoStart={inView} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
