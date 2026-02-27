import { Helmet } from 'react-helmet-async';

import { useCurrentUser } from '@/hooks/useUserQuery';
import SEO from '@/components/seo/SEO';

import Footer from '../layout/Footer';
import HomeHeader from './sections/HomeHeader';
import HeroSection from './sections/HeroSection';
import DemoSection from './sections/DemoSection';
import FeaturesSection from './sections/FeaturesSection';
import SocialProofSection from './sections/SocialProofSection';
import PricingSection from './sections/PricingSection';

const HomeShell = () => {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      <SEO
        title="Case Tracking & Client Updates Platform"
        description="Track case progress and keep clients informed automatically. Built for law firms, visa agencies, repair shops, and service businesses. Custom workflows, WhatsApp & email notifications. Free plan available."
        keywords="case tracking, client status updates, case management, workflow automation, visa tracking, legal case management, WhatsApp notifications, client portal"
        url="https://statusat.com"
        type="website"
        hreflang={true}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Status At',
          url: 'https://statusat.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://statusat.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Status At Professional Plan',
              description:
                'Ideal for growing service businesses with multiple team members. 100 active cases, 500 status updates/month, 5 managers.',
              image:
                'https://statusat.com/favicon/web-app-manifest-512x512-v3.png',
              brand: {
                '@type': 'Brand',
                name: 'Status At',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
              review: [
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Sarah Johnson',
                  },
                  datePublished: '2025-11-15',
                  reviewBody:
                    'Status At has transformed how we communicate with clients. The workflow automation saves us hours every week, and customers love the real-time updates.',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5',
                  },
                },
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Michael Chen',
                  },
                  datePublished: '2025-10-22',
                  reviewBody:
                    'Great platform for tracking customer statuses. WhatsApp integration works flawlessly and the interface is intuitive.',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5',
                  },
                },
              ],
              offers: {
                '@type': 'Offer',
                url: 'https://statusat.com/sign-up',
                priceCurrency: 'EUR',
                price: '99.00',
                priceValidUntil: '2026-12-31',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'Status At',
                },
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Status At',
              applicationCategory: 'BusinessApplication',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free Customer Account',
                  price: '0',
                  priceCurrency: 'EUR',
                  description: 'Free status tracking for customers',
                },
                {
                  '@type': 'Offer',
                  name: 'Free Plan',
                  price: '0',
                  priceCurrency: 'EUR',
                  description:
                    'Free forever plan with 25 active cases, 100 status updates/month, and custom status flows',
                },
                {
                  '@type': 'AggregateOffer',
                  name: 'Business Plans',
                  lowPrice: '49.00',
                  highPrice: '199.00',
                  priceCurrency: 'EUR',
                  offerCount: '3',
                  description:
                    'Paid plans for business owners to manage workflows',
                },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
            },
          ])}
        </script>
      </Helmet>

      <div className="flex-1">
        <HomeHeader />
        <HeroSection user={user} isLoading={isLoading} />
        <DemoSection />
        <FeaturesSection />
        <SocialProofSection />
        <PricingSection />
      </div>

      <Footer />
    </div>
  );
};

export default HomeShell;
