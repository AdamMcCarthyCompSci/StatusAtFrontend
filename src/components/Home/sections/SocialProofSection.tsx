import { useState, useEffect, useCallback } from 'react';
import {
  Scale,
  Plane,
  Wrench,
  Landmark,
  Stethoscope,
  GraduationCap,
  Building2,
  Shield,
  Building,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

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

const QUOTE_COUNT = 4;
const ROTATE_INTERVAL = 6000;

const badgeColors = [
  'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300',
  'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300',
  'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300',
  'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300',
  'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/40 dark:border-sky-800 dark:text-sky-300',
  'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-300',
  'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300',
  'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300',
  'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300',
  'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300',
];

const SocialProofSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeQuote, setActiveQuote] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextQuote = useCallback(() => {
    setActiveQuote(prev => (prev + 1) % QUOTE_COUNT);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextQuote, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextQuote]);

  const industries = [
    { icon: Scale, label: t('home.socialProof.industries.law') },
    { icon: Plane, label: t('home.socialProof.industries.immigration') },
    { icon: Wrench, label: t('home.socialProof.industries.autoRepair') },
    { icon: Landmark, label: t('home.socialProof.industries.finance') },
    { icon: Stethoscope, label: t('home.socialProof.industries.healthcare') },
    { icon: GraduationCap, label: t('home.socialProof.industries.education') },
    { icon: Building2, label: t('home.socialProof.industries.realEstate') },
    { icon: Shield, label: t('home.socialProof.industries.insurance') },
    { icon: Building, label: t('home.socialProof.industries.government') },
    { icon: Briefcase, label: t('home.socialProof.industries.consulting') },
  ];

  const quotes = Array.from({ length: QUOTE_COUNT }, (_, i) => ({
    text: t(`home.socialProof.quotes.${i}.text`),
    attribution: t(`home.socialProof.quotes.${i}.attribution`),
  }));

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-muted/30 py-16 lg:py-20"
    >
      <FloatingBlobs side="both" count={12} />
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mx-auto max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeInUp} className="space-y-8 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              {t('home.socialProof.title')}
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${badgeColors[index]}`}
                >
                  <industry.icon className="h-4 w-4" />
                  {industry.label}
                </motion.div>
              ))}
            </div>

            {/* Testimonial carousel */}
            <div
              className="relative mx-auto min-h-[120px] max-w-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuote}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl italic leading-relaxed text-muted-foreground md:text-2xl">
                    &ldquo;{quotes[activeQuote].text}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {quotes[activeQuote].attribution}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: QUOTE_COUNT }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveQuote(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeQuote
                      ? 'w-6 bg-accent'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
