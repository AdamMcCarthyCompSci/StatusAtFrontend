export default {
  // Basic
  title: 'Flows',
  flow: 'Flow',
  create: 'Create Flow',
  edit: 'Edit Flow',
  delete: 'Delete Flow',
  name: 'Flow Name',
  description: 'Description',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',

  // Dashboard Card
  manageFlows: 'Manage Flows',
  manageFlowsDescription: 'Create and manage status flows for {{tenant}}',

  // Management
  backToDashboard: 'Back to Dashboard',
  flowManagement: 'Flow Management',
  manageWorkflows: 'Manage your status tracking workflows',
  managingFor: 'Managing flows for {{tenant}}',
  noOrgSelected: 'No Organization Selected',
  selectOrgMessage:
    'Please select an organization from the menu to manage flows.',
  selectOrgPrompt:
    'Please select an organization from the dashboard to manage flows',
  searchFlows: 'Search flows...',
  perPage: '{{count}} per page',
  loadingFlows: 'Loading flows...',
  failedToLoad: 'Failed to load flows. Please try again.',
  errorLoadingFlows: 'Error loading flows',
  flowsCount: 'Flows ({{count}})',
  noFlowsFound: 'No Flows Found',
  notCreatedYet: "You haven't created any flows yet.",
  noMatchingFlows: "No flows match '{{search}}'. Try adjusting your search.",
  tryDifferentSearch: 'Try different search terms or create a new flow',
  showingPagination: 'Showing {{start}} to {{end}} of {{total}} flows',
  showing: 'Showing',
  of: 'of',
  createdDate: 'Created: {{date}}',
  invite: 'Invite',

  // Invite Modal
  inviteToFlow: 'Invite to Flow',
  inviteOthersTo: 'Invite others to enroll in {{flowName}}',
  emailInvite: 'Email Invite',
  qrCode: 'QR Code',
  emailAddress: 'Email Address',
  enterEmailAddress: 'Enter email address',
  sendInvite: 'Send Invite',
  sending: 'Sending...',
  qrCodeInvitation: 'QR Code Invitation',
  shareQrOrUrl:
    'Share this QR code or URL to invite others to join {{flowName}}',
  mobileTip: "Mobile Tip: Use your phone's camera app or a QR scanner app.",
  printQrCode: 'Print QR Code',
  copyUrl: 'Copy URL',
  joinFlow: 'Join {{flowName}}',
  scanQrCode: 'Scan QR Code',
  scanQrCodeDesc: 'Scan this QR code to enroll in the flow',
  scanQrToJoin: 'Scan this QR code to join the flow',
  mobileTipPrint: "Mobile Tip: Use your phone's camera app.",
  close: 'Close',

  // Errors
  planLimitReached:
    'Your plan has reached its limit. Please upgrade to invite more users.',
  errorOccurred: 'An error occurred. Please try again.',

  // Confirmation Dialogs
  deleteFlowTitle: "Delete '{{flowName}}'?",
  deleteFlowMessage:
    'This flow and all its associated data will be permanently deleted. This action cannot be undone.',
  deleteFlowButton: 'Delete Flow',

  // Alerts
  maxNodesReached: 'Maximum Nodes Reached',
  maxNodesMessage:
    "You've reached the maximum limit of {{max}} nodes per flow...",
  understood: 'Understood',

  // Builder
  flowBuilder: 'Flow Builder',
  addStep: 'Add Step',
  deleteStep: 'Delete Step',
  addNode: 'Add Node',
  deleteNode: 'Delete Node',
  connectSteps: 'Connect Steps',
  newStep: 'New Step',
  back: 'Back',
  backToFlows: 'Back to Flows',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  resetView: 'Reset View',
  fitToView: 'Fit to View',
  moreOptions: 'More options',
  organizing: 'Organizing...',
  organize: 'Organize',
  organizeFlow: 'Organize Flow',
  minimapOn: 'Minimap On',
  minimapOff: 'Minimap Off',
  minimap: 'Minimap',
  hideMinimap: 'Hide minimap',
  showMinimap: 'Show minimap',
  liveMode: 'Live Mode',
  offlineMode: 'Offline Mode',
  live: 'Live',
  offline: 'Offline',
  realtimeEnabled: 'Real-time collaboration enabled',
  enableRealtime: 'Enable real-time collaboration',
  unknownFlow: 'Unknown Flow',
  deleteStepTitle: 'Delete Step',
  deleteStepMessage:
    "Are you sure you want to delete '{{stepName}}'? This step and all its connections will be permanently removed...",
  cannotCreateConnection: 'Cannot Create Connection',
  wouldCreateLoop:
    "Creating a connection from '{{from}}' to '{{to}}' would create a loop...",
  cannotCreateMultipleStarts: 'Cannot Create Multiple Start Points',
  wouldCreateMultipleStarts:
    'This connection would create multiple starting points in your flow...',
  deleteTransition: 'Delete Transition',
  deleteTransitionMessage:
    "Are you sure you want to delete the transition from '{{from}}' to '{{to}}'?...",
  deleteTransitionButton: 'Delete Transition',
  organizeFlowMessage:
    'This will automatically arrange your flow steps in a clean tree layout...',
  organizeFlowButton: 'Organize Flow',
  nodeProperties: 'Properties',
  nodeName: 'Name',
  nodeNamePlaceholder: 'Enter name',
  nodeDescription: 'Description',
  nodeDescriptionPlaceholder: 'Describe what happens at this step...',

  // Create Dialog
  createNewFlow: 'Create New Flow',
  createFlowFor: 'Create a new status flow for {{tenant}}',
  flowNameLabel: 'Flow Name',
  flowNamePlaceholder: 'e.g., Order Processing, Support Ticket',
  flowNameHelper: 'Choose a descriptive name for your status flow',
  flowNameRequired: 'Flow name is required',
  failedToCreate: 'Failed to create flow',
  failedToCreateFlow: 'Failed to create flow',
  creating: 'Creating...',
  createButton: 'Create Flow',
  createFlow: 'Create Flow',
  flowDescPlaceholder: 'Describe the purpose of this flow...',
  cancel: 'Cancel',

  // Empty States
  noFlows: 'No flows yet',
  createFirst: 'Create your first flow to get started',

  // Status Tracking
  loadingStatusTracking: 'Loading status tracking...',
  enrollmentNotFound: 'Enrollment not found.',

  // Node Selector
  goToNode: 'Go to Node',
  searchNodes: 'Search nodes...',
  unnamedStep: 'Unnamed Step',
  noNodesFound: 'No nodes found',
  noNodesAvailable: 'No nodes available',
  nodesCount: '{{filtered}} of {{total}} nodes',
  nodesMatching: '{{filtered}} of {{total}} nodes matching "{{search}}"',

  // Document Fields
  documentFields: 'Document Fields',
  addDocumentField: 'Add Field',
  fieldName: 'Field Name',
  fieldNamePlaceholder: 'e.g., Proof of ID',
  uploadedBy: 'Uploaded By',
  customer: 'Customer',
  admin: 'Admin',
  isRequired: 'Required field',
  fieldDescription: 'Description',
  fieldDescriptionPlaceholder: 'Instructions for this document...',
  noDocumentFields: 'No document fields configured for this step.',
  uploadedByAdmin: 'Admin Upload',
  uploadedByCustomer: 'Customer Upload',
  deleteDocumentFieldTitle: 'Delete Document Field',
  deleteDocumentFieldMessage:
    'Are you sure you want to delete "{{fieldName}}"? This action cannot be undone.',
  maxDocumentFieldsReached:
    'Maximum of {{max}} document fields per step reached',
};
