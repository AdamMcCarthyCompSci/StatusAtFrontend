import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t('help.faq.q1'),
      answer: t('help.faq.a1'),
    },
    {
      question: t('help.faq.q2'),
      answer: t('help.faq.a2'),
    },
    {
      question: t('help.faq.q3'),
      answer: t('help.faq.a3'),
    },
    {
      question: t('help.faq.q4'),
      answer: t('help.faq.a4'),
    },
    {
      question: t('help.faq.q5'),
      answer: t('help.faq.a5'),
    },
    {
      question: t('help.faq.q6'),
      answer: t('help.faq.a6'),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link to="/help">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('help.backToHelp')}
          </Link>
        </Button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold sm:text-4xl">
              {t('help.faq.title')}
            </h1>
          </div>
          <p className="text-base text-muted-foreground sm:text-lg">
            {t('help.faq.description')}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardHeader>
                <CardTitle className="flex items-start justify-between text-lg">
                  <span className="flex-1">{faq.question}</span>
                  <HelpCircle
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </CardTitle>
              </CardHeader>
              {openIndex === index && (
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle>{t('help.faq.stillNeedHelp')}</CardTitle>
            <CardDescription>
              {t('help.faq.stillNeedHelpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a href={`mailto:${t('help.supportEmail')}`}>
                {t('help.contactSupport')}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
