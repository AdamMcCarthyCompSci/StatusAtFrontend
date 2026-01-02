export default {
  // SEO
  seo: {
    title: 'Preise - Einfache, transparente Tarife | StatusAt',
    description:
      'Wählen Sie den perfekten Tarif für Ihr Unternehmen. Drei transparente Preisstufen ab €49/Monat mit 7-tägiger kostenloser Testversion. Keine versteckten Gebühren, jederzeit kündbar.',
    keywords:
      'Preise, Tarife, Abonnement, Kosten, Status-Tracking-Preise, erschwingliche Workflow-Software',
  },

  // Hero Section
  hero: {
    title: 'Einfache,',
    titleHighlight: 'transparente',
    title2: 'Preise',
    subtitle: 'Wählen Sie den richtigen Tarif für Ihr Unternehmen',
    trialInfo:
      '7 Tage kostenlos testen • Jederzeit kündbar • In Minuten starten',
  },

  // Pricing Plans
  plans: {
    starter: {
      name: 'Starter',
      price: '€49',
      period: '/Monat',
      description:
        'Ideal für Einzelunternehmer und kleine Firmen, die gerade erst anfangen',
      features: [
        '25 aktive Fälle',
        '100 Statusaktualisierungen/Monat',
        '1 Manager',
        'Kein Branding',
        'Prioritäts-E-Mail (24h)',
        'E-Mail & WhatsApp-Benachrichtigungen',
        'Benutzerdefinierte Statusabläufe',
        'Dokumentenverwaltung',
        'QR-Code-Registrierung',
        'Mobile-responsives Portal',
      ],
      cta: '7-Tage-Test starten',
    },
    professional: {
      name: 'Professional',
      price: '€99',
      period: '/Monat',
      description:
        'Ideal für wachsende Dienstleistungsunternehmen mit mehreren Teammitgliedern',
      features: [
        '100 aktive Fälle',
        '500 Statusaktualisierungen/Monat',
        '5 Manager',
        'Logo hochladen',
        'Prioritäts-E-Mail (24h)',
        'E-Mail & WhatsApp-Benachrichtigungen',
        'Benutzerdefinierte Statusabläufe',
        'Dokumentenverwaltung',
        'QR-Code-Registrierung',
        'Mobile-responsives Portal',
        'Mehrbenutzer-Zugriff',
      ],
      popular: 'Beliebteste',
      cta: '7-Tage-Test starten',
    },
    enterprise: {
      name: 'Enterprise',
      price: '€199',
      period: '/Monat',
      description:
        'Ideal für größere Firmen und Organisationen mit spezifischen Anforderungen',
      features: [
        'Unbegrenzte aktive Fälle',
        '2000 Statusaktualisierungen/Monat',
        'Unbegrenzte Manager',
        'Markenfarben und Logo hochladen',
        'Dedizierter Support',
        'E-Mail & WhatsApp-Benachrichtigungen',
        'Benutzerdefinierte Statusabläufe',
        'Dokumentenverwaltung',
        'QR-Code-Registrierung',
        'Mobile-responsives Portal',
        'Mehrbenutzer-Zugriff',
        'Prioritäre Feature-Anfragen',
      ],
      cta: '7-Tage-Test starten',
    },
  },

  // Feature Comparison Table
  comparison: {
    title: 'Alle Funktionen vergleichen',
    subtitle: 'Sehen Sie genau, was Sie mit jedem Tarif erhalten',
    categories: {
      core: 'Kernfunktionen',
      branding: 'Branding & Anpassung',
      communication: 'Kommunikation',
      support: 'Support',
      advanced: 'Erweiterte Funktionen',
    },
    features: {
      activeCases: 'Aktive Fälle',
      statusUpdates: 'Statusaktualisierungen pro Monat',
      managers: 'Team-Manager',
      customFlows: 'Benutzerdefinierte Statusabläufe',
      documentManagement: 'Dokumentenverwaltung',
      qrEnrollment: 'QR-Code-Registrierung',
      mobilePortal: 'Mobile-responsives Portal',
      uploadLogo: 'Logo hochladen',
      brandColors: 'Benutzerdefinierte Markenfarben',
      emailNotifications: 'E-Mail-Benachrichtigungen',
      whatsappNotifications: 'WhatsApp-Benachrichtigungen',
      multiUserAccess: 'Mehrbenutzer-Zugriff',
      priorityEmail: 'Prioritäts-E-Mail-Support',
      dedicatedSupport: 'Dedizierter Support',
      priorityFeatures: 'Prioritäre Feature-Anfragen',
    },
    values: {
      unlimited: 'Unbegrenzt',
      included: 'Enthalten',
      notIncluded: 'Nicht enthalten',
    },
  },

  // FAQ Section
  faq: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über unsere Preise wissen müssen',
    questions: [
      {
        q: 'Wie funktioniert die 7-tägige kostenlose Testversion?',
        a: 'Beginnen Sie sofort mit StatusAt mit vollem Zugriff auf alle Funktionen Ihres gewählten Tarifs. Fügen Sie Ihre Zahlungsdetails hinzu, um zu starten, aber Sie werden erst nach 7 Tagen belastet. Kündigen Sie jederzeit während der Testphase kostenlos.',
      },
      {
        q: 'Kann ich den Tarif später ändern?',
        a: 'Auf jeden Fall! Sie können Ihren Tarif jederzeit upgraden oder downgraden. Beim Upgrade erhalten Sie sofortigen Zugriff auf neue Funktionen und zahlen einen anteiligen Betrag. Beim Downgrade treten die Änderungen zu Ihrem nächsten Abrechnungszyklus in Kraft.',
      },
      {
        q: 'Gibt es einen Vertrag oder eine Verpflichtung?',
        a: 'Keine Verträge, keine Verpflichtungen. Alle Tarife werden monatlich abgerechnet und Sie können jederzeit kündigen.',
      },
      {
        q: 'Welche Zahlungsmethoden akzeptieren Sie?',
        a: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express) und Debitkarten. Alle Zahlungen werden sicher über Stripe verarbeitet.',
      },
      {
        q: 'Bieten Sie Rückerstattungen an?',
        a: 'Wenn Sie innerhalb der ersten 7 Tage kündigen, können Sie eine vollständige Rückerstattung beantragen. Danach können Sie jederzeit kündigen, aber es wird keine Rückerstattung für nicht genutzte Zeit erstattet.',
      },
      {
        q: 'Kann ich einen Rabatt für jährliche Abrechnung erhalten?',
        a: 'Wir bieten derzeit nur monatliche Abrechnung an. Wir führen jedoch gelegentlich Werbeaktionen durch - schauen Sie auf unseren Landing Pages nach Gutscheincodes wie VISA10 oder LAW10 für 10% Rabatt!',
      },
      {
        q: 'Was ist mit Datenschutz und Sicherheit?',
        a: 'Ihre Datensicherheit ist unsere Priorität. Alle Daten werden während der Übertragung und im Ruhezustand verschlüsselt. Wir sind DSGVO-konform und verkaufen niemals Ihre Daten. Sie besitzen Ihre Daten und können sie jederzeit löschen.',
      },
    ],
  },

  // CTA Section
  cta: {
    title: 'Bereit loszulegen?',
    subtitle:
      'Schließen Sie sich Hunderten von Unternehmen an, die StatusAt nutzen, um ihre Kunden informiert zu halten',
    button: 'Starten Sie Ihre kostenlose Testversion',
    noCredit: '7 Tage kostenlos testen • Jederzeit kündbar',
  },
};
