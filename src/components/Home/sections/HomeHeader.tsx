import { motion } from 'framer-motion';

import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

const HomeHeader = () => {
  return (
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
  );
};

export default HomeHeader;
