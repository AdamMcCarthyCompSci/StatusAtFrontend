export default {
  // SEO
  seo: {
    title: 'Tarifs - Plans simples et transparents | StatusAt',
    description:
      'Choisissez le plan parfait pour votre entreprise. Trois niveaux de tarification transparents à partir de €49/mois avec essai gratuit de 7 jours. Sans frais cachés, annulez à tout moment.',
    keywords:
      'tarifs, plans, abonnement, coût, tarifs de suivi de statut, logiciel de flux de travail abordable',
  },

  // Hero Section
  hero: {
    title: 'Tarifs',
    titleHighlight: 'simples et transparents',
    title2: '',
    subtitle: 'Choisissez le plan adapté à votre entreprise',
    trialInfo:
      'Essai gratuit de 7 jours • Annulez à tout moment • Démarrez en quelques minutes',
  },

  // Pricing Plans
  plans: {
    starter: {
      name: 'Starter',
      price: '€49',
      period: '/mois',
      description:
        'Idéal pour les praticiens indépendants et les petites entreprises qui débutent',
      features: [
        '25 dossiers actifs',
        '100 mises à jour de statut/mois',
        '1 gestionnaire',
        'Sans image de marque',
        'Email prioritaire (24h)',
        'Notifications par email et WhatsApp',
        'Flux de statut personnalisés',
        'Gestion des documents',
        'Inscription par code QR',
        'Portail responsive mobile',
      ],
      cta: "Démarrer l'essai de 7 jours",
    },
    professional: {
      name: 'Professional',
      price: '€99',
      period: '/mois',
      description:
        "Idéal pour les entreprises de services en croissance avec plusieurs membres d'équipe",
      features: [
        '100 dossiers actifs',
        '500 mises à jour de statut/mois',
        '5 gestionnaires',
        'Télécharger le logo',
        'Email prioritaire (24h)',
        'Notifications par email et WhatsApp',
        'Flux de statut personnalisés',
        'Gestion des documents',
        'Inscription par code QR',
        'Portail responsive mobile',
        'Accès multi-utilisateurs',
      ],
      popular: 'Le plus populaire',
      cta: "Démarrer l'essai de 7 jours",
    },
    enterprise: {
      name: 'Enterprise',
      price: '€199',
      period: '/mois',
      description:
        'Idéal pour les grandes entreprises et organisations avec des besoins spécifiques',
      features: [
        'Dossiers actifs illimités',
        '2000 mises à jour de statut/mois',
        'Gestionnaires illimités',
        'Couleurs de marque et télécharger le logo',
        'Support dédié',
        'Notifications par email et WhatsApp',
        'Flux de statut personnalisés',
        'Gestion des documents',
        'Inscription par code QR',
        'Portail responsive mobile',
        'Accès multi-utilisateurs',
        'Demandes de fonctionnalités prioritaires',
      ],
      cta: "Démarrer l'essai de 7 jours",
    },
  },

  // Feature Comparison Table
  comparison: {
    title: 'Comparer toutes les fonctionnalités',
    subtitle: 'Voyez exactement ce que vous obtenez avec chaque plan',
    categories: {
      core: 'Fonctionnalités principales',
      branding: 'Image de marque et personnalisation',
      communication: 'Communication',
      support: 'Support',
      advanced: 'Fonctionnalités avancées',
    },
    features: {
      activeCases: 'Dossiers actifs',
      statusUpdates: 'Mises à jour de statut par mois',
      managers: "Gestionnaires d'équipe",
      customFlows: 'Flux de statut personnalisés',
      documentManagement: 'Gestion des documents',
      qrEnrollment: 'Inscription par code QR',
      mobilePortal: 'Portail responsive mobile',
      uploadLogo: 'Télécharger le logo',
      brandColors: 'Couleurs de marque personnalisées',
      emailNotifications: 'Notifications par email',
      whatsappNotifications: 'Notifications WhatsApp',
      multiUserAccess: 'Accès multi-utilisateurs',
      priorityEmail: 'Support email prioritaire',
      dedicatedSupport: 'Support dédié',
      priorityFeatures: 'Demandes de fonctionnalités prioritaires',
    },
    values: {
      unlimited: 'Illimité',
      included: 'Inclus',
      notIncluded: 'Non inclus',
    },
  },

  // FAQ Section
  faq: {
    title: 'Questions fréquemment posées',
    subtitle: 'Tout ce que vous devez savoir sur nos tarifs',
    questions: [
      {
        q: "Comment fonctionne l'essai gratuit de 7 jours ?",
        a: "Commencez à utiliser StatusAt immédiatement avec un accès complet à toutes les fonctionnalités de votre plan choisi. Ajoutez vos détails de paiement pour commencer, mais vous ne serez facturé qu'après 7 jours. Annulez à tout moment pendant l'essai sans frais.",
      },
      {
        q: 'Puis-je changer de plan plus tard ?',
        a: 'Absolument ! Vous pouvez mettre à niveau ou réduire votre plan à tout moment. Lors de la mise à niveau, vous obtiendrez un accès immédiat aux nouvelles fonctionnalités et serez facturé au prorata. Lors de la réduction, les changements prennent effet à votre prochain cycle de facturation.',
      },
      {
        q: 'Y a-t-il un contrat ou un engagement ?',
        a: 'Aucun contrat, aucun engagement. Tous les plans sont facturés mensuellement et vous pouvez annuler à tout moment.',
      },
      {
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons toutes les principales cartes de crédit (Visa, Mastercard, American Express) et cartes de débit. Tous les paiements sont traités en toute sécurité via Stripe.',
      },
      {
        q: 'Offrez-vous des remboursements ?',
        a: 'Si vous annulez dans les 7 premiers jours, vous pouvez demander un remboursement complet. Après cela, vous pouvez annuler à tout moment mais aucun remboursement ne sera émis pour le temps non utilisé.',
      },
      {
        q: 'Puis-je obtenir une réduction pour une facturation annuelle ?',
        a: 'Nous proposons actuellement uniquement la facturation mensuelle. Cependant, nous organisons occasionnellement des promotions - consultez nos pages de destination pour des codes promo comme VISA10 ou LAW10 pour 10% de réduction !',
      },
      {
        q: "Qu'en est-il de la confidentialité et de la sécurité des données ?",
        a: 'La sécurité de vos données est notre priorité. Toutes les données sont chiffrées en transit et au repos. Nous sommes conformes au RGPD et ne vendons jamais vos données. Vous possédez vos données et pouvez les supprimer à tout moment.',
      },
    ],
  },

  // CTA Section
  cta: {
    title: 'Prêt à commencer ?',
    subtitle:
      "Rejoignez des centaines d'entreprises utilisant StatusAt pour tenir leurs clients informés",
    button: 'Démarrez votre essai gratuit',
    noCredit: 'Essai gratuit de 7 jours • Annulez à tout moment',
  },
};
