export default {
  free: 'Gratuit',
  starter: 'Débutant',
  professional: 'Professionnel',
  enterprise: 'Entreprise',
  upgrade: 'Mettre à Niveau',
  downgrade: 'Rétrograder',
  manage: "Gérer l'Abonnement",
  billingPortal: 'Portail de Facturation',
  currentSubscription: 'Abonnement Actuel',
  manageBilling: 'Gérer la Facturation',
  startFreeTrial: 'Commencez Votre Essai Gratuit de 7 Jours',
  freeTrialDescription:
    "Essayez n'importe quel plan sans risque avec un accès complet à toutes les fonctionnalités. Aucune carte de crédit ne sera débitée avant 7 jours. Annulez à tout moment.",
  planName: {
    adminMode: 'Mode Admin',
    pendingSetup: 'Configuration en Attente',
    cancelled: 'Annulé',
    starter: 'Débutant',
    professional: 'Professionnel',
    enterprise: 'Entreprise',
  },
  perMonth: 'par mois',
  unlimited: 'illimité',
  notActive: 'non actif',
  inactive: 'inactif',
  features: 'Fonctionnalités',
  limitations: 'Limitations',
  currentPlan: 'Plan Actuel',
  upgradeToPlan: 'Mettre à niveau vers {{plan}}',
  downgradeToPlan: 'Rétrograder vers {{plan}}',
  switchToPlan: 'Passer à {{plan}}',
  confirmPlanUpgrade: 'Confirmer la Mise à Niveau du Plan',
  confirmPlanDowngrade: 'Confirmer la Rétrogradation du Plan',
  upgradeDescription:
    'Vous êtes sur le point de passer de {{current}} à {{new}}. Votre abonnement sera mis à jour immédiatement avec une facturation au prorata. Vous serez facturé pour la différence en fonction de votre cycle de facturation.',
  downgradeDescription:
    'Vous êtes sur le point de rétrograder de {{current}} à {{new}}. Votre abonnement sera mis à jour immédiatement avec une facturation au prorata. Vous recevrez un crédit pour le temps non utilisé sur votre plan actuel, qui sera appliqué à votre prochain cycle de facturation.',
  confirmUpgrade: 'Confirmer la Mise à Niveau',
  confirmDowngrade: 'Confirmer la Rétrogradation',
  ownerOnly:
    "Seuls les propriétaires d'organisation peuvent gérer les abonnements. Contactez le propriétaire de votre organisation pour mettre à niveau.",
  loadingSubscription: "Chargement des informations d'abonnement...",
  billingInfo: 'Informations de Facturation',
  freeTrialIncluded:
    'Tous les nouveaux abonnements incluent un essai gratuit de 7 jours',
  chargedAfterTrial:
    "Vous ne serez facturé qu'après la fin de la période d'essai",
  billedMonthly:
    'Les abonnements sont facturés mensuellement et peuvent être annulés à tout moment',
  planChangesImmediate:
    'Les changements de plan prennent effet immédiatement avec une facturation au prorata',
  securePayments:
    'Tous les paiements sont traités en toute sécurité via Stripe',

  // Subscription Plan Details
  plans: {
    FREE: {
      name: 'Mode Admin',
      price: '€0',
      period: 'illimité',
      description:
        'Accès complet pour les tests et l\'administration (pas un essai)',
      features: {
        unlimitedUpdates: 'Mises à jour de statut illimitées',
        unlimitedCases: 'Cas actifs illimités',
        unlimitedManagers: 'Gestionnaires illimités',
        allFeaturesEnabled: 'Toutes les fonctionnalités activées',
        internalUse: 'Pour usage interne uniquement',
      },
    },
    CREATED: {
      name: 'Configuration en Attente',
      price: '€0',
      period: 'non actif',
      description: 'Organisation créée mais pas encore configurée',
      features: {
        noUpdates: 'Aucune mise à jour de statut disponible',
        setupRequired: 'Configuration requise',
      },
      limitations: {
        cannotSendUpdates: 'Impossible d\'envoyer des mises à jour de statut',
        mustSelectPlan: 'Doit sélectionner un plan d\'abonnement',
      },
    },
    CANCELLED: {
      name: 'Annulé',
      price: '€0',
      period: 'inactif',
      description: 'L\'abonnement a été annulé',
      features: {
        noUpdates: 'Aucune mise à jour de statut disponible',
        readOnlyAccess: 'Accès en lecture seule aux données historiques',
      },
      limitations: {
        cannotSendUpdates: 'Impossible d\'envoyer des mises à jour de statut',
        cannotCreateCases: 'Impossible de créer de nouveaux cas',
        reactivationRequired: 'Réactivation requise',
      },
    },
    STARTER: {
      name: 'Débutant',
      price: '€49',
      period: 'par mois',
      description:
        'Idéal pour les professionnels indépendants et les petites entreprises qui débutent',
      features: {
        activeCases: '25 cas actifs',
        statusUpdates: '100 mises à jour de statut/mois',
        managers: '1 gestionnaire',
        subdomain: 'statusat.com/ENTREPRISE',
        noBranding: 'Pas de marque personnalisée',
        priorityEmail: 'Email Prioritaire (24h)',
      },
      limitations: {
        limitedCases: 'Seulement 25 cas actifs',
        limitedUpdates: 'Seulement 100 mises à jour de statut/mois',
        limitedManagers: 'Seulement 1 gestionnaire',
        noCustomBranding: 'Pas de marque personnalisée',
        limitedToSubdomain: 'Limité au sous-domaine',
      },
    },
    PROFESSIONAL: {
      name: 'Professionnel',
      price: '€99',
      period: 'par mois',
      description:
        'Idéal pour les entreprises de services en croissance avec plusieurs membres d\'équipe',
      features: {
        activeCases: '100 cas actifs',
        statusUpdates: '500 mises à jour de statut/mois',
        managers: '5 gestionnaires',
        subdomain: 'statusat.com/ENTREPRISE',
        uploadLogo: 'Télécharger le logo',
        priorityEmail: 'Email prioritaire (24h)',
      },
      limitations: {
        limitedCases: 'Seulement 100 cas actifs',
        limitedUpdates: 'Seulement 500 mises à jour de statut/mois',
        limitedManagers: 'Seulement 5 gestionnaires',
        limitedToSubdomain: 'Limité au sous-domaine',
        noCustomColors: 'Pas de couleurs personnalisées',
        noDedicatedManager: 'Pas de gestionnaire dédié',
      },
    },
    ENTERPRISE: {
      name: 'Entreprise',
      price: '€199',
      period: 'par mois',
      description:
        'Idéal pour les grandes entreprises et organisations avec des besoins spécifiques',
      features: {
        unlimitedCases: 'Cas actifs illimités',
        statusUpdates: '2000 mises à jour de statut/mois',
        unlimitedManagers: 'Gestionnaires illimités',
        customSubdomain: 'ENTREPRISE.statusat.com',
        brandColors: 'Couleurs de marque et télécharger le logo',
        dedicatedSupport: 'Support dédié',
      },
    },
  },
};
