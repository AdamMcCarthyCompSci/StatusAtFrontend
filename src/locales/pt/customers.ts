export default {
  title: 'Clientes',
  enrollments: 'Inscrições',
  currentStep: 'Etapa Atual',
  flow: 'Fluxo',
  status: 'Status',
  noCustomers: 'Ainda não há clientes',
  history: 'Histórico',
  moveToStep: 'Mover para Etapa',

  // Dashboard Card
  manageCustomers: 'Gerenciar Clientes',
  manageCustomersDescription:
    'Visualize e gerencie inscrições de clientes para {{tenant}}',
  heroDescription:
    'Acompanhe e gerencie o progresso dos seus clientes através dos fluxos de trabalho',
  viewAllCustomers: 'Ver Todos os Clientes',

  // Enrollment History
  backToCustomerManagement: 'Voltar à Gestão de Clientes',
  historyFor: 'Histórico de {{name}} em {{tenant}}',
  viewFlow: 'Ver Fluxo',
  customerInfo: 'Informações do Cliente',
  enrolled: 'Inscrito',
  customerIdentifier: 'Identificador do Cliente',
  customerIdentifierHelper:
    'Adicione um identificador personalizado para rastrear este cliente (ex. número do pedido, ID de referência)',
  enterIdentifier: 'Inserir identificador...',
  saving: 'Salvando...',
  identifierUpdated: 'Identificador atualizado com sucesso!',
  failedToUpdateIdentifier:
    'Falha ao atualizar o identificador. Por favor, tente novamente.',
  manageCustomer: 'Gerenciar Cliente',
  manageCustomerDescription:
    'Mover cliente para uma etapa diferente ou removê-lo do fluxo',
  moveCustomer: 'Mover Cliente',
  moveForward: 'Mover para Frente',
  moveBack: 'Mover para Trás',
  advanceToNextStep: 'Avançar para a próxima etapa',
  revertToPreviousStep: 'Reverter para a etapa anterior',
  noAvailableTransitions: 'Sem transições disponíveis da etapa atual.',
  removeCustomer: 'Remover Cliente',
  removeCustomerDescription:
    'Remover permanentemente este cliente do fluxo. Esta ação não pode ser desfeita.',
  removeCustomerButton: 'Remover Cliente',
  moveCustomerBack: 'Mover Cliente para Trás',
  moveCustomerBackDescription:
    'Mover {{name}} de volta para "{{step}}"? Isso reverterá seu progresso no fluxo.',
  moveCustomerForward: 'Mover Cliente para Frente',
  moveCustomerForwardDescription:
    'Mover {{name}} para "{{step}}"? Isso avançará seu progresso no fluxo.',
  removeCustomerTitle: 'Remover {{name}}?',
  removeCustomerMessage:
    'Isso removerá permanentemente {{name}} do fluxo. Eles perderão o acesso ao rastreamento de status.',
  stepHistory: 'Histórico de Etapas',
  showingHistoryEntries:
    'Mostrando {{start}}-{{end}} de {{count}} entradas de histórico',
  loadingHistory: 'Carregando histórico...',
  errorLoadingHistory: 'Erro ao carregar o histórico',
  noHistoryEntries: 'Nenhuma entrada de histórico encontrada',
  changedBy: 'Alterado por {{name}}',
  deletedStep: '(etapa excluída)',
  show: 'Mostrar',
  loadingEnrollmentDetails: 'Carregando detalhes da inscrição...',

  // Customer Management Page
  manageEnrollments:
    'Gerenciar inscrições de clientes e rastreamento de status',
  pleaseSelectOrg:
    'Por favor, selecione uma organização na barra lateral para gerenciar clientes.',
  managingFor: 'Gerenciando clientes para {{tenant}}',
  filters: 'Filtros',
  filtersDescription:
    'Filtrar clientes por nome, e-mail, identificador, fluxo ou etapa atual',
  searchCustomer: 'Pesquisar Cliente',
  searchPlaceholder: 'Nome ou e-mail...',
  searchById: 'Pesquisar por ID',
  identifierPlaceholder: 'Identificador...',
  allFlows: 'Todos os fluxos',
  allSteps: 'Todas as etapas',
  allStatuses: 'Todos os status',
  activeOnly: 'Apenas ativos',
  inactiveOnly: 'Apenas inativos',
  allDocuments: 'Todos',
  documentsReady: 'Documentos Prontos',
  documentsReadyYes: 'Sim',
  documentsReadyNo: 'Não',
  perPage: '{{count}} por página',
  activeFilters: 'Filtros ativos',
  searchLabel: 'Pesquisar',
  idLabel: 'ID',
  flowLabel: 'Fluxo',
  stepLabel: 'Etapa',
  statusLabel: 'Status',
  active: 'Ativo',
  inactive: 'Inativo',
  clearAll: 'Limpar tudo',
  loadingCustomers: 'Carregando clientes...',
  loadError: 'Falha ao carregar clientes. Por favor, tente novamente.',
  customersCount: 'Clientes ({{count}})',
  inviteCustomer: 'Convidar Cliente',
  customer: 'Cliente',
  showing: 'Mostrando {{from}} a {{to}} de {{total}} clientes',
  noCustomersFound: 'Nenhum Cliente Encontrado',
  noMatchingFilters:
    'Nenhum cliente corresponde aos filtros atuais. Tente ajustar seus critérios de pesquisa.',
  noEnrollments: 'Ainda não há clientes inscritos em nenhum fluxo.',
  customerLimitReached:
    'Sua organização atingiu o limite de clientes para o plano atual. Por favor, faça upgrade para convidar mais clientes.',
  inviteError: 'Falha ao enviar o convite. Por favor, tente novamente.',
  customerEmail: 'E-mail do Cliente',
  emailPlaceholder: 'cliente@exemplo.com',
  selectFlow: 'Selecione um fluxo...',
  customerWillBeEnrolled: 'O cliente será inscrito em "{{flowName}}"',
  sendInvitation: 'Enviar Convite',
  sending: 'Enviando...',
  emailInvite: 'Convite por E-mail',
  qrCode: 'Código QR',
  flowPreSelected: 'O fluxo está pré-selecionado para este convite',
  scanToJoin: 'Escaneie este código QR para participar de {{flowName}}',
  inviteLink: 'Link de Convite',
  copyLink: 'Copiar Link',
  downloadQR: 'Baixar QR',
  selectFlowToGenerateQR: 'Selecione um fluxo para gerar um código QR',

  // Documents
  documents: {
    title: 'Documentos',
    description: 'Carregar e visualizar documentos para esta inscrição',
    upload: 'Carregar',
    download: 'Baixar',
    currentStepTitle: 'Documentos para {{step}}',
    otherStepsTitle: 'Documentos de Outras Etapas',
    noFieldsConfigured:
      'Nenhum campo de documento configurado para a etapa atual',
    noDocumentsUploaded: 'Nenhum documento carregado ainda',
    fileTooLarge: 'O tamanho do arquivo não pode exceder 10MB',
    invalidFileType:
      'Tipo de arquivo inválido. Tipos permitidos: pdf, jpg, jpeg, png, doc, docx',
    uploadFailed: 'Falha ao carregar o documento',
    maxDocumentsReached: 'Máximo de {{max}} documentos por campo atingido',
    clickOrDragToUpload: 'Clique para carregar ou arraste e solte',
    dropToUpload: 'Solte o arquivo para carregar',
    deleteDocumentTitle: 'Excluir Documento',
    deleteDocumentMessage:
      'Tem certeza de que deseja excluir "{{filename}}"? Esta ação não pode ser desfeita.',
    allRequiredDocumentsUploaded: 'Todos os Documentos Necessários Carregados',
    allRequiredDocumentsUploadedMessage:
      'Todos os documentos necessários foram carregados. Um administrador revisará seu envio e atualizará seu status.',
    missingRequiredDocuments: 'Documentos Necessários Pendentes',
    missingRequiredDocumentsMessage:
      'Por favor, carregue os seguintes documentos necessários para continuar:',
    optionalDocument: 'Opcional',
    requiredDocument: 'Obrigatório',
  },
};
