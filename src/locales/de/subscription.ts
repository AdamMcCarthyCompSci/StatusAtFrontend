export default {
  free: 'Kostenlos',
  starter: 'Starter',
  professional: 'Professionell',
  enterprise: 'Enterprise',
  upgrade: 'Upgrade',
  downgrade: 'Downgrade',
  manage: 'Abonnement verwalten',
  billingPortal: 'Abrechnungsportal',
  currentSubscription: 'Aktuelles Abonnement',
  manageBilling: 'Abrechnung verwalten',
  startFreeTrial: 'Starten Sie Ihre 7-tägige kostenlose Testversion',
  freeTrialDescription:
    'Testen Sie jeden Plan risikofrei mit vollem Zugriff auf alle Funktionen. Keine Kreditkarte wird vor Ablauf der 7 Tage belastet. Jederzeit kündbar.',
  planName: {
    adminMode: 'Adminmodus',
    pendingSetup: 'Einrichtung ausstehend',
    cancelled: 'Gekündigt',
    starter: 'Starter',
    professional: 'Professionell',
    enterprise: 'Enterprise',
  },
  perMonth: 'pro Monat',
  unlimited: 'unbegrenzt',
  notActive: 'nicht aktiv',
  inactive: 'inaktiv',
  features: 'Funktionen',
  limitations: 'Einschränkungen',
  currentPlan: 'Aktueller Plan',
  upgradeToplan: 'Upgrade auf {{plan}}',
  downgradeToPlan: 'Downgrade auf {{plan}}',
  switchToPlan: 'Zu {{plan}} wechseln',
  confirmPlanUpgrade: 'Plan-Upgrade bestätigen',
  confirmPlanDowngrade: 'Plan-Downgrade bestätigen',
  upgradeDescription:
    'Sie sind dabei, von {{current}} auf {{new}} upzugraden. Ihr Abonnement wird sofort mit anteiliger Abrechnung aktualisiert. Sie werden für die Differenz basierend auf Ihrem Abrechnungszyklus belastet.',
  downgradeDescription:
    'Sie sind dabei, von {{current}} auf {{new}} downzugraden. Ihr Abonnement wird sofort mit anteiliger Abrechnung aktualisiert. Sie erhalten eine Gutschrift für die ungenutzte Zeit Ihres aktuellen Plans, die auf Ihren nächsten Abrechnungszyklus angewendet wird.',
  confirmUpgrade: 'Upgrade bestätigen',
  confirmDowngrade: 'Downgrade bestätigen',
  ownerOnly:
    'Nur Organisationsbesitzer können Abonnements verwalten. Kontaktieren Sie Ihren Organisationsbesitzer für ein Upgrade.',
  loadingSubscription: 'Abonnementinformationen werden geladen...',
  billingInfo: 'Abrechnungsinformationen',
  freeTrialIncluded:
    'Alle neuen Abonnements beinhalten eine 7-tägige kostenlose Testversion',
  chargedAfterTrial: 'Sie werden erst nach Ablauf der Testphase belastet',
  billedMonthly:
    'Abonnements werden monatlich abgerechnet und können jederzeit gekündigt werden',
  planChangesImmediate:
    'Planänderungen werden sofort mit anteiliger Abrechnung wirksam',
  securePayments: 'Alle Zahlungen werden sicher über Stripe verarbeitet',

  // Subscription Plan Details
  plans: {
    FREE: {
      name: 'Admin-Modus',
      price: '€0',
      period: 'unbegrenzt',
      description: 'Vollzugriff für Tests und Verwaltung (keine Testversion)',
      features: {
        unlimitedUpdates: 'Unbegrenzte Status-Updates',
        unlimitedCases: 'Unbegrenzte aktive Fälle',
        unlimitedManagers: 'Unbegrenzte Manager',
        allFeaturesEnabled: 'Alle Funktionen aktiviert',
        internalUse: 'Nur für interne Nutzung',
      },
    },
    CREATED: {
      name: 'Einrichtung ausstehend',
      price: '€0',
      period: 'nicht aktiv',
      description: 'Organisation erstellt, aber noch nicht konfiguriert',
      features: {
        noUpdates: 'Keine Status-Updates verfügbar',
        setupRequired: 'Einrichtung erforderlich',
      },
      limitations: {
        cannotSendUpdates: 'Kann keine Status-Updates senden',
        mustSelectPlan: 'Muss einen Abonnementplan auswählen',
      },
    },
    CANCELLED: {
      name: 'Gekündigt',
      price: '€0',
      period: 'inaktiv',
      description: 'Abonnement wurde gekündigt',
      features: {
        noUpdates: 'Keine Status-Updates verfügbar',
        readOnlyAccess: 'Nur-Lese-Zugriff auf historische Daten',
      },
      limitations: {
        cannotSendUpdates: 'Kann keine Status-Updates senden',
        cannotCreateCases: 'Kann keine neuen Fälle erstellen',
        reactivationRequired: 'Reaktivierung erforderlich',
      },
    },
    STARTER: {
      name: 'Starter',
      price: '€49',
      period: 'pro Monat',
      description:
        'Ideal für Einzelpraktiker und kleine Firmen, die gerade erst anfangen',
      features: {
        activeCases: '25 aktive Fälle',
        statusUpdates: '100 Status-Updates/Monat',
        managers: '1 Manager',
        noBranding: 'Kein Branding',
        priorityEmail: 'Prioritäts-E-Mail (24h)',
      },
      limitations: {
        limitedCases: 'Nur 25 aktive Fälle',
        limitedUpdates: 'Nur 100 Status-Updates/Monat',
        limitedManagers: 'Nur 1 Manager',
        noCustomBranding: 'Kein benutzerdefiniertes Branding',
      },
    },
    PROFESSIONAL: {
      name: 'Professional',
      price: '€99',
      period: 'pro Monat',
      description:
        'Ideal für wachsende Dienstleistungsunternehmen mit mehreren Teammitgliedern',
      features: {
        activeCases: '100 aktive Fälle',
        statusUpdates: '500 Status-Updates/Monat',
        managers: '5 Manager',
        uploadLogo: 'Logo hochladen',
        priorityEmail: 'Prioritäts-E-Mail (24h)',
      },
      limitations: {
        limitedCases: 'Nur 100 aktive Fälle',
        limitedUpdates: 'Nur 500 Status-Updates/Monat',
        limitedManagers: 'Nur 5 Manager',
        noCustomColors: 'Keine benutzerdefinierten Farben',
        noDedicatedManager: 'Kein dedizierter Manager',
      },
    },
    ENTERPRISE: {
      name: 'Enterprise',
      price: '€199',
      period: 'pro Monat',
      description:
        'Ideal für größere Firmen und Organisationen mit spezifischen Bedürfnissen',
      features: {
        unlimitedCases: 'Unbegrenzte aktive Fälle',
        statusUpdates: '2000 Status-Updates/Monat',
        unlimitedManagers: 'Unbegrenzte Manager',
        brandColors: 'Markenfarben und Logo hochladen',
        dedicatedSupport: 'Dedizierter Support',
      },
    },
  },
};
