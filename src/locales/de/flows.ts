export default {
  // Basic
  title: 'Flows',
  flow: 'Flow',
  create: 'Flow erstellen',
  edit: 'Flow bearbeiten',
  delete: 'Flow löschen',
  name: 'Flow-Name',
  description: 'Beschreibung',
  status: 'Status',
  active: 'Aktiv',
  inactive: 'Inaktiv',
  draft: 'Entwurf',

  // Dashboard Card
  manageFlows: 'Flows verwalten',
  manageFlowsDescription: 'Status-Flows für {{tenant}} erstellen und verwalten',

  // Management
  backToDashboard: 'Zurück zum Dashboard',
  flowManagement: 'Flow-Verwaltung',
  manageWorkflows: 'Verwalten Sie Ihre Status-Tracking-Workflows',
  managingFor: 'Flows verwalten für {{tenant}}',
  noOrgSelected: 'Keine Organisation ausgewählt',
  selectOrgMessage:
    'Bitte wählen Sie eine Organisation aus dem Menü aus, um Flows zu verwalten.',
  searchFlows: 'Flows suchen...',
  perPage: '{{count}} pro Seite',
  loadingFlows: 'Flows werden geladen...',
  failedToLoad: 'Fehler beim Laden der Flows. Bitte versuchen Sie es erneut.',
  flowsCount: 'Flows ({{count}})',
  noFlowsFound: 'Keine Flows gefunden',
  notCreatedYet: 'Sie haben noch keine Flows erstellt.',
  noMatchingFlows:
    'Keine Flows entsprechen "{{search}}". Versuchen Sie, Ihre Suche anzupassen.',
  showingPagination: 'Zeige {{start}} bis {{end}} von {{total}} Flows',
  createdDate: 'Erstellt: {{date}}',
  invite: 'Einladen',

  // Invite Modal
  inviteToFlow: 'Zum Flow einladen',
  inviteOthersTo: 'Laden Sie andere ein, sich in {{flowName}} einzuschreiben',
  emailInvite: 'E-Mail-Einladung',
  qrCode: 'QR-Code',
  emailAddress: 'E-Mail-Adresse',
  enterEmailAddress: 'E-Mail-Adresse eingeben',
  sendInvite: 'Einladung senden',
  qrCodeInvitation: 'QR-Code-Einladung',
  shareQrOrUrl:
    'Teilen Sie diesen QR-Code oder URL, um andere zu {{flowName}} einzuladen',
  mobileTip:
    'Mobiler Tipp: Verwenden Sie die Kamera-App Ihres Telefons oder eine QR-Scanner-App.',
  printQrCode: 'QR-Code drucken',
  copyUrl: 'URL kopieren',
  joinFlow: '{{flowName}} beitreten',
  scanQrToJoin: 'Scannen Sie diesen QR-Code, um dem Flow beizutreten',
  mobileTipPrint: 'Mobiler Tipp: Verwenden Sie die Kamera-App Ihres Telefons.',

  // Errors
  planLimitReached:
    'Ihr Plan hat sein Limit erreicht. Bitte upgraden Sie, um weitere Benutzer einzuladen.',
  errorOccurred: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',

  // Confirmation Dialogs
  deleteFlowTitle: '"{{flowName}}" löschen?',
  deleteFlowMessage:
    'Dieser Flow und alle zugehörigen Daten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
  deleteFlowButton: 'Flow löschen',

  // Alerts
  maxNodesReached: 'Maximale Knotenanzahl erreicht',
  maxNodesMessage:
    'Sie haben die maximale Anzahl von {{max}} Knoten pro Flow erreicht...',
  understood: 'Verstanden',

  // Builder
  flowBuilder: 'Flow-Builder',
  addStep: 'Schritt hinzufügen',
  deleteStep: 'Schritt löschen',
  addNode: 'Knoten hinzufügen',
  deleteNode: 'Knoten löschen',
  connectSteps: 'Schritte verbinden',
  newStep: 'Neuer Schritt',
  back: 'Zurück',
  backToFlows: 'Zurück zu Flows',
  zoomIn: 'Vergrößern',
  zoomOut: 'Verkleinern',
  resetView: 'Ansicht zurücksetzen',
  fitToView: 'An Ansicht anpassen',
  moreOptions: 'Weitere Optionen',
  organizing: 'Wird organisiert...',
  organize: 'Organisieren',
  minimapOn: 'Minimap Ein',
  minimapOff: 'Minimap Aus',
  minimap: 'Minimap',
  hideMinimap: 'Minimap ausblenden',
  showMinimap: 'Minimap anzeigen',
  liveMode: 'Live-Modus',
  offlineMode: 'Offline-Modus',
  live: 'Live',
  offline: 'Offline',
  realtimeEnabled: 'Echtzeit-Zusammenarbeit aktiviert',
  enableRealtime: 'Echtzeit-Zusammenarbeit aktivieren',
  unknownFlow: 'Unbekannter Flow',
  deleteStepTitle: 'Schritt löschen',
  deleteStepMessage:
    'Sind Sie sicher, dass Sie "{{stepName}}" löschen möchten? Dieser Schritt und alle seine Verbindungen werden dauerhaft entfernt...',
  cannotCreateConnection: 'Verbindung kann nicht erstellt werden',
  wouldCreateLoop:
    'Eine Verbindung von "{{from}}" nach "{{to}}" würde eine Schleife erstellen...',
  cannotCreateMultipleStarts:
    'Mehrere Startpunkte können nicht erstellt werden',
  wouldCreateMultipleStarts:
    'Diese Verbindung würde mehrere Startpunkte in Ihrem Flow erstellen...',
  deleteTransition: 'Übergang löschen',
  deleteTransitionMessage:
    'Sind Sie sicher, dass Sie den Übergang von "{{from}}" nach "{{to}}" löschen möchten?...',
  deleteTransitionButton: 'Übergang löschen',
  organizeFlow: 'Flow organisieren',
  organizeFlowMessage:
    'Dies wird Ihre Flow-Schritte automatisch in einem sauberen Baumlayout anordnen...',
  organizeFlowButton: 'Flow organisieren',

  // Create Dialog
  createNewFlow: 'Neuen Flow erstellen',
  createFlowFor: 'Erstellen Sie einen neuen Status-Flow für {{tenant}}',
  flowNameLabel: 'Flow-Name',
  flowNamePlaceholder: 'z.B. Auftragsabwicklung, Support-Ticket',
  flowNameHelper: 'Wählen Sie einen beschreibenden Namen für Ihren Status-Flow',
  flowNameRequired: 'Flow-Name ist erforderlich',
  failedToCreate: 'Fehler beim Erstellen des Flows',
  failedToCreateFlow: 'Fehler beim Erstellen des Flows',
  creating: 'Wird erstellt...',
  createButton: 'Flow erstellen',
  createFlow: 'Flow erstellen',
  flowDescPlaceholder: 'Beschreiben Sie den Zweck dieses Flows...',
  cancel: 'Abbrechen',

  // Empty States
  noFlows: 'Noch keine Flows',
  createFirst: 'Erstellen Sie Ihren ersten Flow, um loszulegen',

  // Status Tracking
  loadingStatusTracking: 'Lade Status-Tracking...',
  enrollmentNotFound: 'Einschreibung nicht gefunden.',
};
