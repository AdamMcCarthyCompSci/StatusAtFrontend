export default {
  title: 'Clients',
  enrollments: 'Inscriptions',
  currentStep: 'Étape Actuelle',
  flow: 'Flux',
  status: 'Statut',
  noCustomers: 'Pas encore de clients',
  history: 'Historique',
  moveToStep: "Déplacer vers l'Étape",

  // Dashboard Card
  manageCustomers: 'Gérer les Clients',
  manageCustomersDescription:
    'Visualisez et gérez les inscriptions des clients pour {{tenant}}',
  heroDescription:
    'Suivez et gérez la progression de vos clients à travers les flux de travail',
  viewAllCustomers: 'Voir Tous les Clients',

  // Enrollment History
  backToCustomerManagement: 'Retour à la Gestion des Clients',
  historyFor: 'Historique pour {{name}} dans {{tenant}}',
  viewFlow: 'Voir le Flux',
  customerInfo: 'Informations Client',
  enrolled: 'Inscrit',
  customerIdentifier: 'Identifiant Client',
  customerIdentifierHelper:
    'Ajoutez un identifiant personnalisé pour suivre ce client (ex : numéro de commande, ID de référence)',
  enterIdentifier: 'Entrer un identifiant...',
  saving: 'Enregistrement...',
  identifierUpdated: 'Identifiant mis à jour avec succès !',
  failedToUpdateIdentifier:
    "Échec de la mise à jour de l'identifiant. Veuillez réessayer.",
  manageCustomer: 'Gérer le Client',
  manageCustomerDescription:
    'Déplacer le client vers une étape différente ou le retirer du flux',
  moveCustomer: 'Déplacer le Client',
  moveForward: 'Avancer',
  moveBack: 'Reculer',
  advanceToNextStep: "Avancer à l'étape suivante",
  revertToPreviousStep: "Revenir à l'étape précédente",
  noAvailableTransitions:
    "Aucune transition disponible depuis l'étape actuelle.",
  removeCustomer: 'Retirer le Client',
  removeCustomerDescription:
    'Retirer définitivement ce client du flux. Cette action ne peut pas être annulée.',
  removeCustomerButton: 'Retirer le Client',
  moveCustomerBack: 'Reculer le Client',
  moveCustomerBackDescription:
    'Déplacer {{name}} vers "{{step}}" ? Cela annulera leur progression dans le flux.',
  moveCustomerForward: 'Avancer le Client',
  moveCustomerForwardDescription:
    'Déplacer {{name}} vers "{{step}}" ? Cela fera progresser leur avancement dans le flux.',
  removeCustomerTitle: 'Retirer {{name}} ?',
  removeCustomerMessage:
    "Cela retirera définitivement {{name}} du flux. Ils perdront l'accès au suivi de statut.",
  stepHistory: 'Historique des Étapes',
  showingHistoryEntries:
    "Affichage de {{start}}-{{end}} sur {{count}} entrées d'historique",
  loadingHistory: "Chargement de l'historique...",
  errorLoadingHistory: "Erreur lors du chargement de l'historique",
  noHistoryEntries: "Aucune entrée d'historique trouvée",
  changedBy: 'Modifié par {{name}}',
  deletedStep: '(étape supprimée)',
  show: 'Afficher',
  loadingEnrollmentDetails: "Chargement des détails d'inscription...",

  // Customer Management Page
  manageEnrollments: 'Gérer les inscriptions clients et le suivi du statut',
  pleaseSelectOrg:
    'Veuillez sélectionner une organisation dans la barre latérale pour gérer les clients.',
  managingFor: 'Gestion des clients pour {{tenant}}',
  filters: 'Filtres',
  filtersDescription:
    'Filtrer les clients par nom, e-mail, identifiant, flux ou étape actuelle',
  searchCustomer: 'Rechercher un Client',
  searchPlaceholder: 'Nom ou e-mail...',
  searchById: 'Rechercher par ID',
  identifierPlaceholder: 'Identifiant...',
  allFlows: 'Tous les flux',
  allSteps: 'Toutes les étapes',
  allStatuses: 'Tous les statuts',
  activeOnly: 'Actifs uniquement',
  inactiveOnly: 'Inactifs uniquement',
  perPage: '{{count}} par page',
  activeFilters: 'Filtres actifs',
  searchLabel: 'Rechercher',
  idLabel: 'ID',
  flowLabel: 'Flux',
  stepLabel: 'Étape',
  statusLabel: 'Statut',
  active: 'Actif',
  inactive: 'Inactif',
  clearAll: 'Tout effacer',
  loadingCustomers: 'Chargement des clients...',
  loadError: 'Échec du chargement des clients. Veuillez réessayer.',
  customersCount: 'Clients ({{count}})',
  inviteCustomer: 'Inviter un Client',
  customer: 'Client',
  showing: 'Affichage de {{from}} à {{to}} sur {{total}} clients',
  noCustomersFound: 'Aucun Client Trouvé',
  noMatchingFilters:
    "Aucun client ne correspond aux filtres actuels. Essayez d'ajuster vos critères de recherche.",
  noEnrollments: "Aucun client n'est encore inscrit à un flux.",
  customerLimitReached:
    'Votre organisation a atteint la limite de clients pour le plan actuel. Veuillez mettre à niveau pour inviter plus de clients.',
  inviteError: "Échec de l'envoi de l'invitation. Veuillez réessayer.",
  customerEmail: 'E-mail du Client',
  emailPlaceholder: 'client@exemple.fr',
  selectFlow: 'Sélectionner un flux...',
  customerWillBeEnrolled: 'Le client sera inscrit dans "{{flowName}}"',
  sendInvitation: "Envoyer l'Invitation",
  sending: 'Envoi...',
  emailInvite: 'Invitation par E-mail',
  qrCode: 'Code QR',
  flowPreSelected: 'Le flux est présélectionné pour cette invitation',
  scanToJoin: 'Scannez ce code QR pour rejoindre {{flowName}}',
  inviteLink: "Lien d'Invitation",
  copyLink: 'Copier le Lien',
  downloadQR: 'Télécharger le QR',
  selectFlowToGenerateQR: 'Sélectionnez un flux pour générer un code QR',

  // Documents
  documents: {
    title: 'Documents',
    description: 'Télécharger et afficher les documents pour cette inscription',
    upload: 'Télécharger',
    download: 'Télécharger',
    currentStepTitle: 'Documents pour {{step}}',
    otherStepsTitle: "Documents d'Autres Étapes",
    noFieldsConfigured:
      "Aucun champ de document configuré pour l'étape actuelle",
    noDocumentsUploaded: 'Aucun document téléchargé',
    fileTooLarge: 'La taille du fichier ne peut pas dépasser 10 Mo',
    invalidFileType:
      'Type de fichier non valide. Types autorisés: pdf, jpg, jpeg, png, doc, docx',
    uploadFailed: 'Échec du téléchargement du document',
    maxDocumentsReached: 'Maximum de {{max}} documents par champ atteint',
    clickOrDragToUpload: 'Cliquez pour télécharger ou glissez-déposez',
    dropToUpload: 'Déposez le fichier pour télécharger',
    deleteDocumentTitle: 'Supprimer le Document',
    deleteDocumentMessage:
      'Êtes-vous sûr de vouloir supprimer "{{filename}}"? Cette action ne peut pas être annulée.',
    allRequiredDocumentsUploaded: 'Tous les Documents Requis Téléchargés',
    allRequiredDocumentsUploadedMessage:
      'Tous les documents requis ont été téléchargés. Un administrateur examinera votre soumission et mettra à jour votre statut.',
    missingRequiredDocuments: 'Documents Requis Nécessaires',
    missingRequiredDocumentsMessage:
      'Veuillez télécharger les documents requis suivants pour continuer:',
    optionalDocument: 'Optionnel',
    requiredDocument: 'Requis',
  },
};
