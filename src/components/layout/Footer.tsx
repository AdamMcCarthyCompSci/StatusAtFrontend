import { Link as RouterLink } from 'react-router-dom';
import { Mail, Heart, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand and Description */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              StatusAt
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {t('common.footer.tagline')}
            </p>
          </div>

          {/* Contact Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-foreground hover:text-foreground" asChild>
              <a href="mailto:hello@statusat.com" aria-label="Email us">
                <Mail className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-foreground hover:text-foreground" asChild>
              <a href="https://instagram.com/statusatofficial" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <p>
                {t('common.footer.copyright', { year: new Date().getFullYear() })}
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <RouterLink to="/privacy">
                    {t('common.footer.privacy')}
                  </RouterLink>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <RouterLink to="/terms">{t('common.footer.terms')}</RouterLink>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>{t('common.footer.madeWith')}</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>{t('common.footer.forSmallBusinesses')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
