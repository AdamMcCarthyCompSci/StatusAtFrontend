import {
  Scale,
  FileText,
  Palette,
  BarChart3,
  Eye,
  Bell,
  History,
  QrCode,
  Smartphone,
  Shield,
  Workflow,
  Users,
  MessageCircle,
} from 'lucide-react';

import type { VerticalConfig } from './VerticalLandingPage';

export const lawServicesConfig: VerticalConfig = {
  namespace: 'law',

  seo: {
    title: 'Legal Case Status Tracking Software | Keep Clients Informed',
    description:
      'Professional case tracking platform for law firms and legal services. Automate client updates via WhatsApp, manage case documents, and track legal proceedings. 10% off with code LAW10. Start your 7-day free trial.',
    keywords:
      'legal case management, law firm software, case tracking, legal status updates, client portal for lawyers, legal case management software',
    url: 'https://statusat.com/law-services',
  },

  analytics: {
    heroEvent: 'law_services_hero',
    ctaEvent: 'law_services_cta',
    pageLabel: 'Law',
  },

  schema: {
    name: 'Status At - Legal Case Tracking',
    description:
      'Professional case tracking platform for law firms and legal services. Automate client updates and manage legal cases efficiently.',
    featureList: [
      'Custom legal case workflows',
      'Document management',
      'Automated client notifications',
      'Case tracking & updates',
      'Team collaboration',
      'Brand customization',
      'Secure client portal',
    ],
  },

  features: [
    {
      icon: Workflow,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Palette,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-500',
    },
  ],

  benefits: [
    { icon: Eye },
    { icon: Bell },
    { icon: History },
    { icon: QrCode },
    { icon: Smartphone },
    { icon: Shield },
  ],

  showUseCases: true,
  useCases: [
    'personalInjury',
    'familyLaw',
    'immigration',
    'criminalDefense',
    'contracts',
    'realEstate',
    'estatePlanning',
    'businessLitigation',
    'employment',
  ],
};

export const visaServicesConfig: VerticalConfig = {
  namespace: 'visa',

  seo: {
    title: 'Visa & Passport Status Tracking Software | Keep Clients Updated',
    description:
      'Professional visa tracking platform for immigration consultants and travel agencies. Automate client updates via WhatsApp, manage documents, and track visa applications. 10% off with code VISA10. Start your 7-day free trial.',
    keywords:
      'visa tracking software, passport tracking, immigration case management, visa application tracking, travel agency software, visa consultant software',
    url: 'https://statusat.com/visa-services',
  },

  analytics: {
    heroEvent: 'visa_services_hero',
    ctaEvent: 'visa_services_cta',
    pageLabel: 'Visa',
  },

  schema: {
    name: 'Status At - Visa & Passport Tracking',
    description:
      'Professional visa tracking platform for immigration consultants and travel agencies. Automate client updates and manage visa applications efficiently.',
    featureList: [
      'Custom visa tracking workflows',
      'Document management',
      'WhatsApp integration',
      'Automated client updates',
      'Team collaboration',
      'Brand customization',
    ],
  },

  features: [
    {
      icon: Workflow,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Palette,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
    },
  ],

  benefits: [
    { icon: Eye },
    { icon: MessageCircle },
    { icon: History },
    { icon: QrCode },
    { icon: Smartphone },
    { icon: Shield },
  ],

  showUseCases: false,
};
