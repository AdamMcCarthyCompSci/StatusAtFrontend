export default {
  title: 'Kunden',
  enrollments: 'Einschreibungen',
  currentStep: 'Aktueller Schritt',
  flow: 'Flow',
  status: 'Status',
  noCustomers: 'Noch keine Kunden',
  history: 'Verlauf',
  moveToStep: 'Zu Schritt verschieben',

  // Dashboard Card
  manageCustomers: 'Kunden verwalten',
  manageCustomersDescription:
    'Kundeneinschreibungen für {{tenant}} anzeigen und verwalten',
  heroDescription:
    'Verfolgen und verwalten Sie den Fortschritt Ihrer Kunden durch Workflows',
  viewAllCustomers: 'Alle Kunden anzeigen',

  // Enrollment History
  backToCustomerManagement: 'Zurück zur Kundenverwaltung',
  historyFor: 'Verlauf für {{name}} in {{tenant}}',
  viewFlow: 'Flow anzeigen',
  customerInfo: 'Kundeninformationen',
  enrolled: 'Eingeschrieben',
  customerIdentifier: 'Kundenkennung',
  customerIdentifierHelper:
    'Fügen Sie eine benutzerdefinierte Kennung hinzu, um diesen Kunden zu verfolgen (z.B. Auftragsnummer, Referenz-ID)',
  enterIdentifier: 'Kennung eingeben...',
  saving: 'Wird gespeichert...',
  identifierUpdated: 'Kennung erfolgreich aktualisiert!',
  failedToUpdateIdentifier:
    'Fehler beim Aktualisieren der Kennung. Bitte versuchen Sie es erneut.',
  manageCustomer: 'Kunde verwalten',
  manageCustomerDescription:
    'Kunden zu einem anderen Schritt verschieben oder aus dem Flow entfernen',
  moveCustomer: 'Kunde verschieben',
  moveForward: 'Vorwärts bewegen',
  moveBack: 'Zurück bewegen',
  advanceToNextStep: 'Zum nächsten Schritt vordringen',
  revertToPreviousStep: 'Zum vorherigen Schritt zurückkehren',
  noAvailableTransitions: 'Keine verfügbaren Übergänge vom aktuellen Schritt.',
  removeCustomer: 'Kunde entfernen',
  removeCustomerDescription:
    'Diesen Kunden dauerhaft aus dem Flow entfernen. Diese Aktion kann nicht rückgängig gemacht werden.',
  removeCustomerButton: 'Kunde entfernen',
  moveCustomerBack: 'Kunde zurückbewegen',
  moveCustomerBackDescription:
    '{{name}} zurück zu "{{step}}" verschieben? Dies wird ihren Fortschritt im Flow rückgängig machen.',
  moveCustomerForward: 'Kunde vorwärtsbewegen',
  moveCustomerForwardDescription:
    '{{name}} zu "{{step}}" verschieben? Dies wird ihren Fortschritt im Flow voranbringen.',
  removeCustomerTitle: '{{name}} entfernen?',
  removeCustomerMessage:
    'Dies wird {{name}} dauerhaft aus dem Flow entfernen. Sie verlieren den Zugriff auf das Status-Tracking.',
  stepHistory: 'Schrittverlauf',
  showingHistoryEntries:
    'Zeige {{start}}-{{end}} von {{count}} Verlaufseinträgen',
  loadingHistory: 'Verlauf wird geladen...',
  errorLoadingHistory: 'Fehler beim Laden des Verlaufs',
  noHistoryEntries: 'Keine Verlaufseinträge gefunden',
  changedBy: 'Geändert von {{name}}',
  deletedStep: '(gelöschter Schritt)',
  show: 'Anzeigen',
  loadingEnrollmentDetails: 'Lade Einschreibungsdetails...',

  // Customer Management Page
  manageEnrollments: 'Kundeneinschreibungen und Status-Tracking verwalten',
  pleaseSelectOrg:
    'Bitte wählen Sie eine Organisation aus der Seitenleiste, um Kunden zu verwalten.',
  managingFor: 'Kunden verwalten für {{tenant}}',
  filters: 'Filter',
  filtersDescription:
    'Kunden nach Name, E-Mail, Kennung, Flow oder aktuellem Schritt filtern',
  searchCustomer: 'Kunde suchen',
  searchPlaceholder: 'Name oder E-Mail...',
  searchById: 'Nach ID suchen',
  identifierPlaceholder: 'Kennung...',
  allFlows: 'Alle Flows',
  allSteps: 'Alle Schritte',
  allStatuses: 'Alle Status',
  activeOnly: 'Nur aktive',
  inactiveOnly: 'Nur inaktive',
  perPage: '{{count}} pro Seite',
  activeFilters: 'Aktive Filter',
  searchLabel: 'Suchen',
  idLabel: 'ID',
  flowLabel: 'Flow',
  stepLabel: 'Schritt',
  statusLabel: 'Status',
  active: 'Aktiv',
  inactive: 'Inaktiv',
  clearAll: 'Alle löschen',
  loadingCustomers: 'Lade Kunden...',
  loadError: 'Fehler beim Laden der Kunden. Bitte versuchen Sie es erneut.',
  customersCount: 'Kunden ({{count}})',
  inviteCustomer: 'Kunde einladen',
  customer: 'Kunde',
  showing: 'Zeige {{from}} bis {{to}} von {{total}} Kunden',
  noCustomersFound: 'Keine Kunden gefunden',
  noMatchingFilters:
    'Keine Kunden entsprechen den aktuellen Filtern. Versuchen Sie, Ihre Suchkriterien anzupassen.',
  noEnrollments: 'Es sind noch keine Kunden in Flows eingeschrieben.',
  customerLimitReached:
    'Ihre Organisation hat das Kundenlimit für den aktuellen Plan erreicht. Bitte führen Sie ein Upgrade durch, um mehr Kunden einzuladen.',
  inviteError:
    'Fehler beim Senden der Einladung. Bitte versuchen Sie es erneut.',
  customerEmail: 'Kunden-E-Mail',
  emailPlaceholder: 'kunde@beispiel.de',
  selectFlow: 'Wählen Sie einen Flow...',
  customerWillBeEnrolled: 'Kunde wird in "{{flowName}}" eingeschrieben',
  sendInvitation: 'Einladung senden',
  emailInvite: 'E-Mail-Einladung',
  qrCode: 'QR-Code',
  flowPreSelected: 'Der Flow ist für diese Einladung vorausgewählt',
  scanToJoin: 'Scannen Sie diesen QR-Code, um {{flowName}} beizutreten',
  inviteLink: 'Einladungslink',
  copyLink: 'Link kopieren',
  downloadQR: 'QR herunterladen',
  selectFlowToGenerateQR:
    'Wählen Sie einen Flow, um einen QR-Code zu generieren',
};
