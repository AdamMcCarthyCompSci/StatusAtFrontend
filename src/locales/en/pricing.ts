export default {
  // SEO
  seo: {
    title: 'Pricing - Simple, Transparent Plans | StatusAt',
    description:
      'Choose the perfect plan for your business. Three transparent pricing tiers starting at €49/month with 7-day free trial. No hidden fees, cancel anytime.',
    keywords:
      'pricing, plans, subscription, cost, status tracking pricing, affordable workflow software',
  },

  // Hero Section
  hero: {
    title: 'Simple,',
    titleHighlight: 'transparent',
    title2: 'pricing',
    subtitle: "Choose the plan that's right for your business",
    trialInfo:
      'Free plan available • 7-day free trial on paid plans • Cancel anytime',
  },

  // Pricing Plans
  plans: {
    free: {
      name: 'Free',
      price: '€0',
      period: 'forever',
      description:
        'Get started with the basics — upgrade anytime for full features',
      features: [
        '25 active cases',
        '100 status updates/month',
        '1 manager',
        'Custom status flows',
        'QR code enrollment',
        'Mobile responsive portal',
      ],
      limitations: [
        'No document uploading',
        'No email notifications',
        'No WhatsApp notifications',
        'No custom branding',
      ],
      cta: 'Start for Free',
    },
    starter: {
      name: 'Starter',
      price: '€49',
      period: '/month',
      description:
        'Ideal for solo practitioners and small firms just getting started',
      features: [
        '25 active cases',
        '100 status updates/month',
        '1 manager',
        'No branding',
        'Priority Email (24h)',
        'Email & WhatsApp notifications',
        'Custom status flows',
        'Document management',
        'QR code enrollment',
        'Mobile responsive portal',
      ],
      cta: 'Start 7-Day Trial',
    },
    professional: {
      name: 'Professional',
      price: '€99',
      period: '/month',
      description:
        'Ideal for growing service businesses with multiple team members',
      features: [
        '100 active cases',
        '500 status updates/month',
        '5 managers',
        'Upload logo',
        'Priority email (24h)',
        'Email & WhatsApp notifications',
        'Custom status flows',
        'Document management',
        'QR code enrollment',
        'Mobile responsive portal',
        'Multi-user access',
      ],
      popular: 'Most Popular',
      cta: 'Start 7-Day Trial',
    },
    enterprise: {
      name: 'Enterprise',
      price: '€199',
      period: '/month',
      description:
        'Ideal for larger firms and organizations with specific needs',
      features: [
        'Unlimited active cases',
        '2000 status updates/month',
        'Unlimited managers',
        'Brand colours and upload logo',
        'Dedicated support',
        'Email & WhatsApp notifications',
        'Custom status flows',
        'Document management',
        'QR code enrollment',
        'Mobile responsive portal',
        'Multi-user access',
        'Priority feature requests',
      ],
      cta: 'Start 7-Day Trial',
    },
  },

  // Feature Comparison Table
  comparison: {
    title: 'Compare all features',
    subtitle: 'See exactly what you get with each plan',
    categories: {
      core: 'Core Features',
      branding: 'Branding & Customization',
      communication: 'Communication',
      support: 'Support',
      advanced: 'Advanced Features',
    },
    features: {
      activeCases: 'Active Cases',
      statusUpdates: 'Status Updates per Month',
      managers: 'Team Managers',
      customFlows: 'Custom Status Flows',
      documentManagement: 'Document Management',
      qrEnrollment: 'QR Code Enrollment',
      mobilePortal: 'Mobile Responsive Portal',
      uploadLogo: 'Upload Logo',
      brandColors: 'Custom Brand Colors',
      emailNotifications: 'Email Notifications',
      whatsappNotifications: 'WhatsApp Notifications',
      multiUserAccess: 'Multi-user Access',
      priorityEmail: 'Priority Email Support',
      dedicatedSupport: 'Dedicated Support',
      priorityFeatures: 'Priority Feature Requests',
    },
    values: {
      unlimited: 'Unlimited',
      included: 'Included',
      notIncluded: 'Not included',
    },
  },

  // FAQ Section
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our pricing',
    questions: [
      {
        q: 'How does the 7-day free trial work?',
        a: "Start using StatusAt immediately with full access to all features in your chosen plan. Add your payment details to start, but you won't be charged until after 7 days. Cancel anytime during the trial at no cost.",
      },
      {
        q: 'Can I change plans later?',
        a: "Absolutely! You can upgrade or downgrade your plan anytime. When upgrading, you'll get immediate access to new features and be charged a prorated amount. When downgraging, changes take effect at your next billing cycle.",
      },
      {
        q: 'Is there a contract or commitment?',
        a: 'No contracts, no commitments. All plans are billed monthly and you can cancel anytime.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. All payments are processed securely through Stripe.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'If you cancel within the first 7 days, you can request a full refund. After that, you can cancel anytime but no refund will be issued for unused time.',
      },
      {
        q: 'Can I get a discount for annual billing?',
        a: 'We currently offer monthly billing only. However, we occasionally run promotions - check our landing pages for coupon codes like VISA10 or LAW10 for 10% off!',
      },
      {
        q: 'What about data privacy and security?',
        a: 'Your data security is our priority. All data is encrypted in transit and at rest. We are GDPR compliant and never sell your data. You own your data and can delete it anytime.',
      },
    ],
  },

  // CTA Section
  cta: {
    title: 'Ready to get started?',
    subtitle:
      'Join hundreds of businesses using StatusAt to keep their customers informed',
    button: 'Start Your Free Trial',
    noCredit: '7-day free trial • Cancel anytime',
  },
};
