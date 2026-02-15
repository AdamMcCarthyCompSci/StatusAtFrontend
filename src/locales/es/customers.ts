export default {
  title: 'Clientes',
  enrollments: 'Inscripciones',
  currentStep: 'Paso Actual',
  flow: 'Flujo',
  status: 'Estado',
  noCustomers: 'Aún no hay clientes',
  history: 'Historial',
  moveToStep: 'Mover a Paso',

  // Dashboard Card
  manageCustomers: 'Gestionar Clientes',
  manageCustomersDescription:
    'Ver y gestionar inscripciones de clientes para {{tenant}}',
  heroDescription:
    'Rastrea y gestiona el progreso de tus clientes a través de flujos de trabajo',
  viewAllCustomers: 'Ver Todos los Clientes',

  // Enrollment History
  backToCustomerManagement: 'Volver a Gestión de Clientes',
  historyFor: 'Historial de {{name}} en {{tenant}}',
  viewFlow: 'Ver Flujo',
  customerInfo: 'Información del Cliente',
  enrolled: 'Inscrito',
  customerIdentifier: 'Identificador del Cliente',
  customerIdentifierHelper:
    'Agregue un identificador personalizado para rastrear este cliente (ej. número de orden, ID de referencia)',
  enterIdentifier: 'Ingresar identificador...',
  saving: 'Guardando...',
  identifierUpdated: '¡Identificador actualizado exitosamente!',
  failedToUpdateIdentifier:
    'Error al actualizar el identificador. Por favor intenta de nuevo.',
  manageCustomer: 'Gestionar Cliente',
  manageCustomerDescription:
    'Mover cliente a un paso diferente o eliminarlo del flujo',
  moveCustomer: 'Mover Cliente',
  moveForward: 'Mover Adelante',
  moveBack: 'Mover Atrás',
  advanceToNextStep: 'Avanzar al siguiente paso',
  revertToPreviousStep: 'Revertir al paso anterior',
  noAvailableTransitions:
    'No hay transiciones disponibles desde el paso actual.',
  removeCustomer: 'Eliminar Cliente',
  removeCustomerDescription:
    'Eliminar permanentemente este cliente del flujo. Esta acción no se puede deshacer.',
  removeCustomerButton: 'Eliminar Cliente',
  moveCustomerBack: 'Mover Cliente Atrás',
  moveCustomerBackDescription:
    '¿Mover {{name}} de vuelta a "{{step}}"? Esto revertirá su progreso en el flujo.',
  moveCustomerForward: 'Mover Cliente Adelante',
  moveCustomerForwardDescription:
    '¿Mover {{name}} a "{{step}}"? Esto avanzará su progreso en el flujo.',
  removeCustomerTitle: '¿Eliminar {{name}}?',
  removeCustomerMessage:
    'Esto eliminará permanentemente a {{name}} del flujo. Perderán el acceso al seguimiento de estado.',
  stepHistory: 'Historial de Pasos',
  showingHistoryEntries:
    'Mostrando {{start}}-{{end}} de {{count}} entradas de historial',
  loadingHistory: 'Cargando historial...',
  errorLoadingHistory: 'Error al cargar el historial',
  noHistoryEntries: 'No se encontraron entradas de historial',
  changedBy: 'Cambiado por {{name}}',
  deletedStep: '(paso eliminado)',
  show: 'Mostrar',
  loadingEnrollmentDetails: 'Cargando detalles de inscripción...',

  // Customer Management Page
  manageEnrollments:
    'Gestionar inscripciones de clientes y seguimiento de estado',
  pleaseSelectOrg:
    'Por favor seleccione una organización de la barra lateral para gestionar clientes.',
  managingFor: 'Gestionando clientes para {{tenant}}',
  filters: 'Filtros',
  filtersDescription:
    'Filtrar clientes por nombre, correo electrónico, identificador, flujo o paso actual',
  searchCustomer: 'Buscar Cliente',
  searchPlaceholder: 'Nombre o correo electrónico...',
  searchById: 'Buscar por ID',
  identifierPlaceholder: 'Identificador...',
  allFlows: 'Todos los flujos',
  allSteps: 'Todos los pasos',
  allStatuses: 'Todos los estados',
  activeOnly: 'Solo activos',
  inactiveOnly: 'Solo inactivos',
  allDocuments: 'Todos',
  documentsReady: 'Documentos Listos',
  documentsReadyYes: 'Sí',
  documentsReadyNo: 'No',
  perPage: '{{count}} por página',
  activeFilters: 'Filtros activos',
  searchLabel: 'Buscar',
  idLabel: 'ID',
  flowLabel: 'Flujo',
  stepLabel: 'Paso',
  statusLabel: 'Estado',
  active: 'Activo',
  inactive: 'Inactivo',
  clearAll: 'Limpiar todo',
  loadingCustomers: 'Cargando clientes...',
  loadError: 'Error al cargar clientes. Por favor, intente de nuevo.',
  customersCount: 'Clientes ({{count}})',
  inviteCustomer: 'Invitar Cliente',
  customer: 'Cliente',
  showing: 'Mostrando {{from}} a {{to}} de {{total}} clientes',
  noCustomersFound: 'No Se Encontraron Clientes',
  noMatchingFilters:
    'Ningún cliente coincide con los filtros actuales. Intente ajustar sus criterios de búsqueda.',
  noEnrollments: 'Aún no hay clientes inscritos en ningún flujo.',
  customerLimitReached:
    'Su organización ha alcanzado el límite de clientes para el plan actual. Por favor actualice para invitar más clientes.',
  customerLimitReachedTitle: 'Límite de clientes alcanzado',
  customerLimitReachedDescription:
    'Su plan permite hasta {{limit}} clientes activos. Mejore su plan para invitar más clientes.',
  inviteError: 'Error al enviar la invitación. Por favor, intente de nuevo.',
  customerEmail: 'Correo Electrónico del Cliente',
  emailPlaceholder: 'cliente@ejemplo.com',
  selectFlow: 'Seleccionar un flujo...',
  customerWillBeEnrolled: 'El cliente será inscrito en "{{flowName}}"',
  sendInvitation: 'Enviar Invitación',
  sending: 'Enviando...',
  emailInvite: 'Invitación por Correo',
  qrCode: 'Código QR',
  flowPreSelected: 'El flujo está preseleccionado para esta invitación',
  scanToJoin: 'Escanea este código QR para unirte a {{flowName}}',
  inviteLink: 'Enlace de Invitación',
  copyLink: 'Copiar Enlace',
  downloadQR: 'Descargar QR',
  selectFlowToGenerateQR: 'Selecciona un flujo para generar un código QR',

  updateLimitReached: 'Límite mensual de actualizaciones alcanzado',
  updateLimitReachedDescription:
    'Has utilizado las {{limit}} actualizaciones de estado incluidas en tu plan gratuito este mes. Actualiza tu plan para seguir moviendo clientes.',
  upgradePlan: 'Mejorar Plan',

  // Documents
  documents: {
    title: 'Documentos',
    description: 'Cargar y ver documentos para esta inscripción',
    upload: 'Cargar',
    download: 'Descargar',
    currentStepTitle: 'Documentos para {{step}}',
    otherStepsTitle: 'Documentos de Otros Pasos',
    noFieldsConfigured:
      'No hay campos de documento configurados para el paso actual',
    noDocumentsUploaded: 'No se han cargado documentos todavía',
    fileTooLarge: 'El tamaño del archivo no puede exceder 10MB',
    invalidFileType:
      'Tipo de archivo no válido. Tipos permitidos: pdf, jpg, jpeg, png, doc, docx',
    uploadFailed: 'Error al cargar el documento',
    maxDocumentsReached: 'Máximo de {{max}} documentos por campo alcanzado',
    clickOrDragToUpload: 'Haga clic para cargar o arrastre y suelte',
    dropToUpload: 'Suelte el archivo para cargar',
    deleteDocumentTitle: 'Eliminar Documento',
    deleteDocumentMessage:
      '¿Está seguro de que desea eliminar "{{filename}}"? Esta acción no se puede deshacer.',
    allRequiredDocumentsUploaded: 'Todos los Documentos Requeridos Cargados',
    allRequiredDocumentsUploadedMessage:
      'Todos los documentos requeridos han sido cargados. Un administrador revisará su envío y actualizará su estado.',
    missingRequiredDocuments: 'Documentos Requeridos Necesarios',
    missingRequiredDocumentsMessage:
      'Por favor, cargue los siguientes documentos requeridos para continuar:',
    optionalDocument: 'Opcional',
    requiredDocument: 'Requerido',
  },
};
