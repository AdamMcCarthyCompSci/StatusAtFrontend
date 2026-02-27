import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { trackClick, trackSignUpStart } from '@/lib/analytics';

import StatusCardWrapper from '../card3d/StatusCardWrapper';
import FloatingWorkflows from '../FloatingWorkflows';

interface HeroSectionProps {
  user: { name?: string; email: string } | null | undefined;
  isLoading: boolean;
}

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

const HeroSection = ({ user, isLoading }: HeroSectionProps) => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="relative overflow-hidden py-20 lg:py-32">
      {/* Stick figures — bottom-left corner of section */}
      <img
        src="/stick-figures.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-[2%] z-0 h-[1500px] w-[1500px] object-contain object-left-bottom sm:h-[1600px] sm:w-[1600px] md:h-[1800px] md:w-[1800px] lg:-bottom-[850px] lg:-left-12 lg:top-auto lg:h-[1400px] lg:w-[1400px] xl:-bottom-[1100px] xl:-left-16 xl:h-[1800px] xl:w-[1800px] 2xl:-bottom-[1450px] 2xl:-left-20 2xl:h-[2400px] 2xl:w-[2400px]"
      />

      {/* Stick figure — right side, reaching over */}
      <img
        src="/stick-figure-right.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[50px] -right-2 z-0 h-[180px] w-[180px] object-contain object-right-bottom sm:-bottom-[80px] sm:h-[250px] sm:w-[250px] md:-bottom-[120px] md:h-[350px] md:w-[350px] lg:-bottom-[200px] lg:right-8 lg:h-[500px] lg:w-[500px] xl:-bottom-[280px] xl:right-4 xl:h-[650px] xl:w-[650px] 2xl:-bottom-[350px] 2xl:right-0 2xl:h-[800px] 2xl:w-[800px]"
      />

      {/* Animated Workflow Shapes Background */}
      <FloatingWorkflows />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative">
            {/* Left column: Copy + CTAs */}
            <motion.div
              className="relative z-20 space-y-8 text-center lg:max-w-[50%] lg:text-left"
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {t('home.hero.title1')}
                  <br />
                  <span className="relative mt-8 inline-flex w-[90%] items-start justify-center sm:mt-10 sm:w-full md:mt-12 lg:-ml-[2.5%] lg:mt-14 lg:w-[105%] xl:-ml-[15%] xl:w-[110%] 2xl:-ml-[25%]">
                    {/* Speech bubble SVG — sized to container */}
                    <img
                      src="/speech-bubble.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-auto w-full"
                      style={{
                        filter:
                          'drop-shadow(0 6px 20px rgba(79, 70, 229, 0.35))',
                      }}
                    />
                    {/* Text centered in the bubble body (top ~60%, above the tail) */}
                    <span
                      className="absolute inset-x-0 top-[8%] flex h-[55%] items-center justify-center pl-[12%] text-center text-white"
                      style={{ fontSize: '0.6em' }}
                    >
                      {t('home.hero.title2')}
                    </span>
                  </span>
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <div className="inline-block rounded-2xl bg-background/70 px-6 py-5 shadow-sm ring-1 ring-border/30 backdrop-blur-md lg:-ml-4">
                  <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {t('home.hero.subtitle')}
                  </p>

                  <div className="mt-6">
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-14 w-64 rounded-lg bg-muted"></div>
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
                          className="inline-block"
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
                      <div className="space-y-4">
                        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
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
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right column: 3D Card — absolutely positioned, breaks out of container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10 mt-12 flex justify-center lg:absolute lg:-right-16 lg:top-[25%] lg:mt-0 lg:w-[55%] lg:-translate-y-1/2"
            >
              <StatusCardWrapper />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
