export default {
  // Main Help Page
  title: 'Help & Documentation',
  subtitle:
    'Learn how to use StatusAt to manage your workflows and track customer progress',
  documentation: 'Documentation',
  documentationDescription: 'Learn how to use all features',
  viewDocumentation: 'View Documentation',
  backToHelp: 'Back to Help',
  needMoreHelp: 'Need More Help?',
  needMoreHelpDescription:
    "If you can't find what you're looking for, or have bug reports or feature requests, our support team is here to help.",
  contactSupport: 'Contact Support',
  supportEmail: 'hello@statusat.com',

  // Getting Started
  gettingStarted: {
    title: 'Getting Started',
    description: 'Learn the fundamentals of how StatusAt works',
    creatingOrganization: 'Creating Your First Organization',
    buildingWorkflow: 'Building Your First Workflow',
    invitingMembers: 'Inviting Team Members',
    enrollingCustomer: 'Enrolling Your First Customer',

    // Creating Organization
    organizationIntro:
      "An organization is the foundation of your StatusAt workspace. It's where you manage workflows, team members, and customers.",
    whatIsOrganization: 'What is an Organization?',
    organizationExplanation:
      'An organization represents your business or department. Each organization has its own workflows, team members, branding, and customer enrollments. You can belong to multiple organizations with different roles.',
    organizationRoles: 'Organization Roles',
    ownerRole: 'OWNER',
    ownerDescription:
      'Full control over the organization, including billing, settings, and team management',
    staffRole: 'STAFF',
    staffDescription:
      'Can create and manage workflows, documents, and team members',
    memberRole: 'MEMBER',
    memberDescription:
      'Can view and move customers through workflows, but cannot create workflows or manage team members',

    // Building Workflow
    workflowIntro:
      'Workflows (also called "Flows") are the heart of StatusAt. They define the steps your customers go through.',
    whatIsFlow: 'What is a Flow?',
    flowExplanation:
      'A flow is a visual representation of your business process. Each step represents a stage in your workflow, and customers move through these steps as their status progresses.',
    flowComponents: 'Flow Components',
    stepsLabel: 'Steps',
    stepsDescription:
      'Individual stages in your workflow (e.g., "Application Submitted", "Under Review", "Approved")',
    connectionsLabel: 'Connections',
    connectionsDescription:
      'Links between steps that define the path customers can take through your workflow',
    documentsLabel: 'Document Fields',
    documentsDescription:
      'Specific documents required at each step (e.g., passport, proof of address)',

    // Inviting Members
    membersIntro:
      'Collaborate with your team by inviting members to your organization.',
    teamCollaboration: 'Team Collaboration',
    collaborationExplanation:
      'Invite team members by email and assign them appropriate roles. STAFF members can create workflows and manage team members, while MEMBERs can track and move customers through workflows.',

    // Enrolling Customer
    enrollmentIntro:
      'Once your workflow is ready, you can start enrolling customers to track their progress.',
    whatIsEnrollment: 'What is an Enrollment?',
    enrollmentExplanation:
      "An enrollment connects a customer to a specific workflow. Each enrollment tracks the customer's current step, documents, and history as they progress through your process.",
    enrollmentMethods: 'Enrollment Methods',
    emailInviteLabel: 'Email Invite',
    emailInviteDescription:
      'Send an email invitation with a unique link for the customer to enroll',
    qrCodeLabel: 'QR Code',
    qrCodeDescription:
      'Generate a QR code that customers can scan to enroll instantly',
  },

  // Feature Guides
  featureGuides: {
    title: 'Feature Guides',
    description: 'In-depth guides for each major feature',
    flowBuilder: 'Flow Builder',
    customerManagement: 'Customer Management',
    documentHandling: 'Document Handling',
    statusTracking: 'Status Tracking (Customer View)',
    teamCollaboration: 'Team Collaboration & Roles',

    // Flow Builder
    flowBuilderIntro:
      'The Flow Builder is a visual canvas where you design your workflows by creating and connecting steps.',
    visualDesign: 'Visual Workflow Design',
    visualDesignExplanation:
      'Drag and drop steps on the canvas to create your workflow. To connect steps and create transitions, click and drag from the small circles on the edges of one step to another step. Click on a step to edit its name and description in the modal.',
    flowFeatures: 'Key Features',
    dragDropLabel: 'Drag & Drop Interface',
    dragDropDescription: 'Intuitive step-based editor for designing workflows',
    autoLayoutLabel: 'Auto-Organize',
    autoLayoutDescription:
      'Automatically arrange your workflow for optimal layout',
    documentFieldsLabel: 'Document Configuration',
    documentFieldsDescription:
      'Define which documents are required at each step',
    minimapLabel: 'Minimap Navigation',
    minimapDescription: 'Overview map for navigating large workflows',

    // Customer Management
    customerManagementIntro:
      'Track and manage all customers enrolled in your workflows from one central location.',
    enrollmentTracking: 'Enrollment Tracking',
    enrollmentTrackingExplanation:
      'View all customer enrollments, their current steps, and their status. Search and filter by name, email, identifier, flow, step, status, etc.',
    customerFeatures: 'Customer Management Features',
    searchFilterLabel: 'Search & Filter',
    searchFilterDescription:
      'Find customers by name, email, identifier, flow, step, or status',
    stepMovementLabel: 'Step Movement',
    stepMovementDescription:
      'Move customers forward or backward through workflow steps',
    notesLabel: 'Internal & External Notes',
    notesDescription:
      'Add private team notes or public customer-visible messages',

    // Document Handling
    documentHandlingIntro:
      'StatusAt allows you to define document requirements for each step and manage customer uploads.',
    documentSteps: 'Documents Per Step',
    documentStepsExplanation:
      'Configure which documents are required at each workflow step. Customers can upload documents through their status tracking page.',
    documentWorkflow: 'Document Workflow',
    documentWorkflowExplanation:
      'When a customer reaches a step requiring documents, they receive notifications and can upload files directly. You can view, download, and verify documents from the customer management interface.',

    // Status Tracking
    statusTrackingIntro:
      'Customers get a branded, public-facing page where they can track their progress in real-time.',
    publicPages: 'Public Status Pages',
    publicPagesExplanation:
      "Each customer gets access to your organization's status tracking page where they can view their current status, upload documents, and see their progress through the workflow.",
    realTimeUpdates: 'Real-Time Updates',
    realTimeUpdatesExplanation:
      'When you move a customer to a new step, their status page updates immediately. They also receive notifications via email and WhatsApp (if configured).',

    // Team Collaboration
    teamCollaborationIntro:
      'Work with your team using role-based permissions and multi-tenant access.',
    rolesPermissions: 'Roles & Permissions',
    rolesPermissionsExplanation:
      'Control what team members can do based on their role. OWNERs have full access including billing and settings, STAFF can create and manage workflows and team members, and MEMBERs can view and move customers through workflows.',
    multiTenant: 'Multi-Tenant System',
    multiTenantExplanation:
      'Users can belong to multiple organizations with different roles in each. Switch between organizations using the sidebar menu.',
  },

  // For Customers
  forCustomers: {
    title: 'For Customers',
    description:
      'Help your customers understand how to use their status tracking page',
    trackingStatus: 'Tracking Your Status',
    uploadingDocuments: 'Uploading Documents',
    notifications: 'Understanding Notifications',

    // Tracking Status
    trackingStatusIntro:
      'After enrolling in a workflow, customers receive a unique link to track their progress.',
    accessingStatus: 'Accessing Your Status',
    accessingStatusExplanation:
      'Use the link sent to your email or scan the QR code to access your personal status page. No account registration is required.',
    statusFeatures: 'What You Can See',
    currentStepLabel: 'Current Step',
    currentStepDescription:
      'Your current position in the workflow, including any documents required at this step',
    progressLabel: 'Progress Indicator',
    progressDescription:
      'Visual timeline showing your journey through the process',
    historyLabel: 'Activity History',
    historyDescription:
      'Complete log of all status changes, updates, and document upload history',

    // Uploading Documents
    uploadingDocumentsIntro:
      'Some workflow steps may require you to upload documents.',
    documentRequests: 'Document Requests',
    documentRequestsExplanation:
      "When documents are needed, you'll see a clear list of required files on your status page. Upload each document using the file picker.",
    uploadProcess: 'Upload Process',
    uploadProcessExplanation:
      "Simply click the upload button for each required document, select your file, and submit. You'll receive confirmation once your documents are received.",

    // Notifications
    notificationsIntro:
      'Stay informed about status changes and document requests through automated notifications.',
    notificationTypes: 'Notification Channels',
    emailLabel: 'Email Notifications',
    emailDescription: 'Receive updates via email whenever your status changes',
    whatsappLabel: 'WhatsApp Notifications',
    whatsappDescription:
      'Get instant WhatsApp messages for important updates (if configured)',
    stayingInformed: 'Staying Informed',
    stayingInformedExplanation:
      "You'll automatically receive notifications when you move to a new step, when documents are required, or when the organization adds important notes.",
  },

  // FAQ
  faq: {
    title: 'Frequently Asked Questions',
    description: 'Quick answers to common questions',
    common: 'Common Questions',

    // Questions and Answers
    q1: "Can customers see each other's information?",
    a1: 'No. Each customer enrollment is completely private. Customers can only see their own status and documents.',

    q2: "How do I change my organization's branding?",
    a2: 'Owners and Staff members can customize branding from Organization Settings. You can upload logos, change colors, and customize the look of customer-facing pages.',

    q3: 'Can I move a customer backward in the workflow?',
    a3: 'Yes. You can move customers both forward and backward through steps as needed. All movements are tracked in the enrollment history.',

    q4: 'What file types are supported for document uploads?',
    a4: 'StatusAt supports common file types including PDF, images (JPG, PNG), and Office documents (DOC, DOCX, XLS, XLSX).',

    q5: 'How do notifications work?',
    a5: 'Customers receive email notifications automatically when their status changes. WhatsApp notifications require additional configuration in your organization settings.',

    q6: 'What are the different user roles?',
    a6: 'OWNERs have full control including billing and settings. STAFF can create and manage workflows, documents, and team members. MEMBERs can view and move customers through workflows.',

    stillNeedHelp: 'Still Need Help?',
    stillNeedHelpDescription:
      "If you didn't find the answer you were looking for, reach out to our support team.",
  },
};
