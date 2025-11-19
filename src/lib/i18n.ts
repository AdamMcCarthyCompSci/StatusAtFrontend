import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        actions: 'Actions',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        close: 'Close',
        status: 'Status',
      },

      // Navigation
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        flows: 'Flows',
        members: 'Members',
        customers: 'Customers',
        inbox: 'Inbox',
        account: 'Account Settings',
        organization: 'Organization Settings',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
      },

      // Authentication
      auth: {
        // Sign In
        signIn: 'Sign In',
        signInTitle: 'Sign In',
        signInDescription: 'Enter your credentials to access your account',
        signInButton: 'Sign In',
        signingIn: 'Signing in...',

        // Sign Up
        signUp: 'Sign Up',
        signUpTitle: 'Create Account',
        signUpDescription: 'Sign up for a new account to get started',
        signUpButton: 'Sign Up',
        signingUp: 'Signing up...',
        creatingAccount: 'Creating account...',

        // Form Fields
        email: 'Email',
        emailAddress: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
        fullName: 'Full Name',

        // Placeholders
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordPlaceholder: 'Confirm your password',
        namePlaceholder: 'Enter your full name',

        // Messages & Validation
        fillAllFields: 'Please fill in all fields',
        loginFailed: 'Login failed',
        accountCreated: 'Account created successfully!',
        accountCreatedCanSignIn:
          'Account created successfully! You can now sign in with your new account.',
        checkEmail: 'Please check your email to confirm your account',
        invalidCredentials: 'Invalid email or password',
        emailInUse: 'Email already in use',
        weakPassword: 'Password is too weak',
        passwordMismatch: 'Passwords do not match',
        passwordMinLength: 'Password must be at least 8 characters long',
        pleaseLogin: 'Please log in to view your dashboard.',

        // Links
        forgotPassword: 'Forgot your password?',
        resetPassword: 'Reset Password',
        dontHaveAccount: "Don't have an account?",
        alreadyHaveAccount: 'Already have an account?',
        signOut: 'Sign Out',

        // Forgot Password
        forgotPasswordTitle: 'Reset Password',
        forgotPasswordDescription:
          "Enter your email address and we'll send you a link to reset your password",
        sendResetLink: 'Send Reset Link',
        sending: 'Sending...',
        emailSent: 'Email Sent!',
        checkInbox: 'Check your inbox for password reset instructions',
        resetLinkSentTo: "We've sent a password reset link to",
        didntReceiveEmail:
          "Didn't receive the email? Check your spam folder or try again.",
        tryAgain: 'Try Again',
        backToSignIn: 'Back to Sign In',
        rememberPassword: 'Remember your password? Sign in',
        needNewAccount: 'Need a new account?',
        failedToSendReset: 'Failed to send reset email',
        enterEmailAddress: 'Please enter your email address',

        // Email Confirmation
        checkYourEmail: 'Check Your Email',
        confirmYourEmail: 'Confirm Your Email',
        sendingConfirmation: "We're sending a confirmation email to {{email}}",
        enterEmailForConfirmation:
          "Enter your email address and we'll send you a new confirmation link",
        failedToResendConfirmation: 'Failed to resend confirmation email',
        confirmationEmailSent: 'Confirmation Email Sent!',
        checkInboxForConfirmation: 'Check your inbox for the confirmation link',
        sentNewConfirmationTo: "We've sent a new confirmation email to",
        clickConfirmationLink:
          'Please check your email and click the confirmation link to activate your account.',
        sendAnotherEmail: 'Send Another Email',
        sendConfirmationEmail: 'Send Confirmation Email',
        alreadyConfirmed: 'Already confirmed? Sign in',

        // Email Confirmation Status
        confirmingEmail: 'Confirming Email...',
        emailConfirmed: 'Email Confirmed!',
        confirmationFailed: 'Confirmation Failed',
        pleaseWaitConfirming:
          'Please wait while we confirm your email address.',
        emailConfirmedSuccess:
          'Your email has been successfully confirmed. You can now sign in to your account.',
        unableToConfirm: 'We were unable to confirm your email address.',
        confirmationLinkInvalid:
          'Failed to confirm email. The link may be invalid or expired.',
        noConfirmationToken: 'No confirmation token provided.',
        redirectingToSignIn: 'Redirecting to sign in page in 3 seconds...',
        continueToSignIn: 'Continue to Sign In',
        goToSignIn: 'Go to Sign In',
        signUpAgain: 'Sign Up Again',

        // Invite Context
        invitedToEnroll: "You've been invited to enroll in {{flowName}}",
        signingInToJoin:
          "You're signing in to join {{flowName}} at {{tenantName}}",
        emailLockedFromInvite: 'Email locked from invite',

        // WhatsApp
        whatsappNumber: 'WhatsApp Phone Number (Optional)',
        whatsappHelper:
          'Optional - Add your WhatsApp number to receive notifications',

        // Opt-ins
        agreeToReceiveUpdates:
          'I agree to receive updates/emails from this app',

        // Validation
        validatingInvite: 'Validating invite...',
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back, {{name}}!',
        organizations: 'Organizations',
        createOrganization: 'Create Organization',
        noOrganizations: 'No organizations yet',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',

        // Management Mode
        managementMode: 'Management Mode',
        managingAs: 'Managing {{tenant}} as {{role}}',
        leaving: 'Leaving...',
        leaveOrganization: 'Leave Organization',
        managementTools: 'Management Tools',

        // Organization Creation
        createFirstOrg: 'Create Your First Organization',
        getStarted:
          'Get started by creating an organization to manage flows and teams',

        // Organization Cards
        yourOrganizations: 'Your Organizations',
        allOrganizations: 'All',
        activeFlows: 'Active Flows',
        recent: 'Recent',
        moreFlows: '+{{count}} more',
        viewOrganization: 'View Organization',

        // Empty States
        noAccess: "You don't have access to any organizations yet",
        contactAdmin:
          'Contact an administrator to get invited to an organization',

        // Subscription Warnings
        completeSubscription: 'Complete Your Subscription',
        subscriptionCancelled: 'Subscription Cancelled',
        subscribeToStart:
          'Subscribe to start using StatusAtFront and unlock all management features.',
        subscriptionCancelledDescription:
          'Your subscription has been cancelled. Reactivate to continue managing flows, members, and customers.',

        // Selection Warnings
        selectOrganization: 'Select Organization to Manage',
        selectOrganizationDescription:
          'Choose an organization from the hamburger menu to access management features like flows, members, and settings.',

        // Dividers
        managementVsEnrollment: 'Management vs Enrollment',
      },

      // Flows
      flows: {
        // Basic
        title: 'Flows',
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
        searchFlows: 'Search flows...',
        perPage: '{{count}} per page',
        loadingFlows: 'Loading flows...',
        failedToLoad: 'Failed to load flows. Please try again.',
        flowsCount: 'Flows ({{count}})',
        noFlowsFound: 'No Flows Found',
        notCreatedYet: "You haven't created any flows yet.",
        noMatchingFlows:
          "No flows match '{{search}}'. Try adjusting your search.",
        showingPagination: 'Showing {{start}} to {{end}} of {{total}} flows',
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
        qrCodeInvitation: 'QR Code Invitation',
        shareQrOrUrl:
          'Share this QR code or URL to invite others to join {{flowName}}',
        mobileTip:
          "Mobile Tip: Use your phone's camera app or a QR scanner app.",
        printQrCode: 'Print QR Code',
        copyUrl: 'Copy URL',
        joinFlow: 'Join {{flowName}}',
        scanQrToJoin: 'Scan this QR code to join the flow',
        mobileTipPrint: "Mobile Tip: Use your phone's camera app.",

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
      },

      // Members
      members: {
        title: 'Members',
        invite: 'Invite Member',
        role: 'Role',
        owner: 'Owner',
        staff: 'Staff',
        member: 'Member',
        email: 'Email',
        status: 'Status',
        joined: 'Joined',
        pending: 'Pending',
        noMembers: 'No members yet',
        inviteFirst: 'Invite your first member to collaborate',

        // Dashboard Card
        manageMembers: 'Manage Members',
        manageMembersDescription:
          'Invite and manage team members for {{tenant}}',

        // Member Management Page
        memberManagement: 'Member Management',
        manageTeamMembers: 'Manage team members and their roles',
        managingMembersFor: 'Managing members for {{tenant}}',
        pleaseSelectOrg:
          'Please select an organization from the menu to manage members.',
        searchMembers: 'Search members...',
        loadingMembers: 'Loading members...',
        loadError: 'Failed to load members. Please try again.',
        membersCount: 'Members ({{count}})',
        inviteMember: 'Invite Member',
        emailAddress: 'Email Address',
        enterEmailAddress: 'Enter email address',
        sending: 'Sending...',
        sendInvite: 'Send Invite',
        you: 'You',
        promote: 'Promote',
        demote: 'Demote',
        remove: 'Remove',
        showingMembers: 'Showing {{from}} to {{to}} of {{total}} members',
        noMembersFound: 'No Members Found',
        noMatchingSearch:
          'No members match "{{search}}". Try adjusting your search.',
        noMembersForOrg: 'No members found for this organization.',
        promoteTitle: 'Promote {{member}}?',
        promoteDescription:
          'This will promote {{member}} from {{currentRole}} to {{newRole}}.',
        promoteConfirm: 'Promote to {{role}}',
        demoteTitle: 'Demote {{member}}?',
        demoteDescription:
          'This will demote {{member}} from {{currentRole}} to {{newRole}}.',
        demoteConfirm: 'Demote to {{role}}',
        removeTitle: 'Remove {{member}}?',
        removeDescription:
          'This will permanently remove {{member}} from the organization. They will lose all access immediately.',
        removeMember: 'Remove Member',
        membershipLimitReached:
          'Your plan has reached its membership limit. Please upgrade to add more members.',
        inviteErrorGeneric: 'An error occurred. Please try again.',
      },

      // Customers
      customers: {
        title: 'Customers',
        enrollments: 'Enrollments',
        currentStep: 'Current Step',
        flow: 'Flow',
        status: 'Status',
        noCustomers: 'No customers yet',
        history: 'History',
        moveToStep: 'Move to Step',

        // Dashboard Card
        manageCustomers: 'Manage Customers',
        manageCustomersDescription:
          'View and manage customer enrollments for {{tenant}}',

        // Enrollment History
        backToCustomerManagement: 'Back to Customer Management',
        historyFor: 'History for {{name}} in {{tenant}}',
        viewFlow: 'View Flow',
        customerInfo: 'Customer Info',
        enrolled: 'Enrolled',
        customerIdentifier: 'Customer Identifier',
        customerIdentifierHelper:
          'Add a custom identifier to help track this customer (e.g., order number, reference ID)',
        enterIdentifier: 'Enter identifier...',
        saving: 'Saving...',
        identifierUpdated: 'Identifier updated successfully!',
        failedToUpdateIdentifier:
          'Failed to update identifier. Please try again.',
        manageCustomer: 'Manage Customer',
        manageCustomerDescription:
          'Move customer to a different step or remove them from the flow',
        moveCustomer: 'Move Customer',
        moveForward: 'Move Forward',
        moveBack: 'Move Back',
        advanceToNextStep: 'Advance to next step',
        revertToPreviousStep: 'Revert to previous step',
        noAvailableTransitions:
          'No available transitions from the current step.',
        removeCustomer: 'Remove Customer',
        removeCustomerDescription:
          'Permanently remove this customer from the flow. This action cannot be undone.',
        removeCustomerButton: 'Remove Customer',
        moveCustomerBack: 'Move Customer Back',
        moveCustomerBackDescription:
          'Move {{name}} back to "{{step}}"? This will revert their progress in the flow.',
        moveCustomerForward: 'Move Customer Forward',
        moveCustomerForwardDescription:
          'Move {{name}} to "{{step}}"? This will advance their progress in the flow.',
        removeCustomerTitle: 'Remove {{name}}?',
        removeCustomerMessage:
          'This will permanently remove {{name}} from the flow. They will lose access to status tracking.',
        stepHistory: 'Step History',
        showingHistoryEntries:
          'Showing {{start}}-{{end}} of {{count}} history entries',
        loadingHistory: 'Loading history...',
        errorLoadingHistory: 'Error loading history',
        noHistoryEntries: 'No history entries found',
        changedBy: 'Changed by {{name}}',
        deletedStep: '(deleted step)',
        show: 'Show',
        loadingEnrollmentDetails: 'Loading enrollment details...',

        // Customer Management Page
        manageEnrollments: 'Manage customer enrollments and status tracking',
        pleaseSelectOrg:
          'Please select an organization from the sidebar to manage customers.',
        managingFor: 'Managing customers for {{tenant}}',
        filters: 'Filters',
        filtersDescription:
          'Filter customers by name, email, identifier, flow, or current step',
        searchCustomer: 'Search Customer',
        searchPlaceholder: 'Name or email...',
        searchById: 'Search by ID',
        identifierPlaceholder: 'Identifier...',
        allFlows: 'All flows',
        allSteps: 'All steps',
        allStatuses: 'All statuses',
        activeOnly: 'Active only',
        inactiveOnly: 'Inactive only',
        perPage: '{{count}} per page',
        activeFilters: 'Active filters',
        searchLabel: 'Search',
        idLabel: 'ID',
        flowLabel: 'Flow',
        stepLabel: 'Step',
        statusLabel: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        clearAll: 'Clear all',
        loadingCustomers: 'Loading customers...',
        loadError: 'Failed to load customers. Please try again.',
        customersCount: 'Customers ({{count}})',
        inviteCustomer: 'Invite Customer',
        customer: 'Customer',
        showing: 'Showing {{from}} to {{to}} of {{total}} customers',
        noCustomersFound: 'No Customers Found',
        noMatchingFilters:
          'No customers match the current filters. Try adjusting your search criteria.',
        noEnrollments: 'No customers are enrolled in any flows yet.',
        customerLimitReached:
          'Your organization has reached its customer limit for the current plan. Please upgrade to invite more customers.',
        inviteError: 'Failed to send invitation. Please try again.',
        customerEmail: 'Customer Email',
        emailPlaceholder: 'customer@example.com',
        selectFlow: 'Select a flow...',
        customerWillBeEnrolled: 'Customer will be enrolled in "{{flowName}}"',
        sendInvitation: 'Send Invitation',
      },

      // Inbox
      inbox: {
        title: 'Inbox',
        messages: 'Messages',
        notifications: 'Notifications',
        unread: 'Unread',
        unreadMessages: 'unread messages',
        markAsRead: 'Mark as Read',
        markAllAsRead: 'Mark All as Read',
        noMessages: 'No messages',
        emptyInbox: 'Your inbox is empty',
        statusUpdate: 'Status Update',
        teamInvite: 'Team Invite',
        flowInvite: 'Flow Invite',
        membershipUpdate: 'Membership Update',
        new: 'New',
        actionRequired: 'Action Required',
        from: 'From',
        team: 'Team',
        flow: 'Flow',
        accept: 'Accept',
        reject: 'Reject',
        accepted: 'Accepted',
        rejected: 'Rejected',
        actionAlreadyTaken: 'This action has already been taken',
        actionAlreadyTakenTitle: 'Action Already Taken',
        loadingMessages: 'Loading messages...',
        failedToLoad: 'Failed to load messages',
        loadErrorMessage:
          'There was an error loading your messages. Please try again.',
        manageNotifications: 'Manage your notifications and messages',
        filterDescription: 'Filter messages',
        messageType: 'Message Type',
        allTypes: 'All Types',
        statusUpdates: 'Status Updates',
        teamInvites: 'Team Invites',
        flowInvites: 'Flow Invites',
        membershipUpdates: 'Membership Updates',
        readStatus: 'Read Status',
        allMessages: 'All Messages',
        read: 'Read',
        noAction: 'No Action',
        perPage: 'Per page',
        marking: 'Marking...',
        totalMessages: '{{count}} total messages',
        noMessagesFound: 'No messages found',
        tryAdjustingFilters: 'Try adjusting your filters to see more messages.',
        noMessagesAtThisTime: 'You have no messages at this time.',
        showingMessages: 'Showing {{from}} to {{to}} of {{total}} messages',
      },

      // Errors
      errors: {
        somethingWentWrong: 'Something went wrong',
        tryAgain: 'Try Again',
        pageNotFound: '404 - Page Not Found',
        goHome: 'Go Home',
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        serverError: 'Server Error',
        networkError: 'Network Error',
        loadingError: 'Failed to load data',
        errorLoadingEnrollment: 'Error Loading Enrollment',
        failedToLoadEnrollment: 'Failed to load enrollment details',
      },

      // Settings
      settings: {
        account: 'Account Settings',
        organization: 'Organization Settings',
        profile: 'Profile',
        security: 'Security',
        notifications: 'Notifications',
        billing: 'Billing',
        theme: 'Theme',
        language: 'Language',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        autoMode: 'Auto Mode',

        // Dashboard Cards
        accountSettings: 'Account Settings',
        organizationSettings: 'Organization Settings',
        customizeBranding:
          'Customize branding, themes, and organization details',
        manageOrganization: 'Manage Organization',
        managePreferences: 'Manage your account settings and preferences',
        manageProfile: 'Manage your profile, password, and preferences',
        manageAccount: 'Manage Account',
      },

      // Account Settings Page
      account: {
        pleaseSignIn: 'Please sign in to access account settings.',
        managePreferences: 'Manage your account preferences and settings',
        profileInfo: 'Profile Information',
        profileDescription:
          'Update your personal information and contact details',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        emailAddress: 'Email Address',
        emailPlaceholder: 'Enter your email address',
        whatsappPhone: 'WhatsApp Phone Number',
        whatsappHelper: 'Used for WhatsApp notifications',
        marketingComms: 'Marketing Communications',
        marketingHelper: 'Receive updates about new features and improvements',
        saveProfile: 'Save Profile',
        appearance: 'Appearance',
        appearanceDescription: 'Customize how the application looks and feels',
        theme: 'Theme',
        selectTheme: 'Select theme',
        light: 'Light',
        dark: 'Dark',
        themeHelper: 'Choose your preferred color scheme',
        accountManagement: 'Account Management',
        accountManagementDescription: 'Manage your account security and data',
        deleteAccount: 'Delete Account',
        deleteAccountDescription:
          'Permanently delete your account and all associated data.',
        soleOwnerWarning:
          'Warning: You are the sole owner of {{count}} organization(s). Deleting your account will also delete these organizations.',
        deleting: 'Deleting...',
        deleteAccountWarning:
          'This will permanently delete your account and all associated data. This action cannot be undone.',
        deleteAccountWithOrgs:
          'Deleting your account will also delete the following organizations where you are the sole owner:\n\n{{orgs}}\n\nThis action cannot be undone.',
      },

      // Create Organization Page
      organization: {
        nameRequired: 'Organization name is required',
        failedToCreate: 'Failed to create organization',
        createOrganization: 'Create Organization',
        setupDescription:
          'Set up a new organization to manage your teams and workflows',
        organizationDetails: 'Organization Details',
        chooseUniqueName: 'Choose a unique name for your organization',
        organizationNameRequired: 'Organization Name *',
        namePlaceholder: 'Enter organization name (e.g., Acme Corp)',
        nameHelper:
          'This name will be visible to your team members and customers',
        creating: 'Creating...',
        whatHappensNext: 'What happens next?',
        becomeOwner:
          "You'll automatically become the owner of the organization",
        inviteMembers: 'You can invite team members to collaborate',
        createFlows: 'Start creating flows to track status updates',
        subscribeToPlan: 'Subscribe to a plan to unlock full features',
      },

      // Notification Preferences
      notifications: {
        title: 'Notification Preferences',
        description: 'Manage how you receive notifications',
        loadingPreferences: 'Loading preferences...',
        failedToLoad: 'Failed to load notification preferences.',
        tryRefreshing: 'Please try refreshing the page.',
        chooseHowNotified:
          'Choose how you want to be notified about important updates',
        emailNotifications: 'Email Notifications',
        enableEmailNotifications: 'Enable Email Notifications',
        masterToggleEmail:
          'Master toggle - controls all email notification settings below',
        statusUpdates: 'Status Updates',
        statusUpdatesDescription: 'Get notified when flow status changes',
        invitations: 'Invitations',
        invitationsDescription: 'Get notified about team and flow invitations',
        whatsappNotifications: 'WhatsApp Notifications',
        addWhatsAppNumber:
          'Please add a WhatsApp phone number in your profile settings to enable WhatsApp notifications.',
        enableWhatsAppNotifications: 'Enable WhatsApp Notifications',
        masterToggleWhatsApp:
          'Master toggle - controls all WhatsApp notification settings below',
        savePreferences: 'Save Preferences',
        savedSuccessfully: 'Notification preferences saved successfully!',
        failedToSave: 'Failed to save preferences. Please try again.',
      },

      // Subscription
      subscription: {
        free: 'Free',
        starter: 'Starter',
        professional: 'Professional',
        enterprise: 'Enterprise',
        upgrade: 'Upgrade',
        downgrade: 'Downgrade',
        manage: 'Manage Subscription',
        billingPortal: 'Billing Portal',
        currentSubscription: 'Current Subscription',
        manageBilling: 'Manage Billing',
        startFreeTrial: 'Start Your 7-Day Free Trial',
        freeTrialDescription:
          'Try any plan risk-free with full access to all features. No credit card charged until after 7 days. Cancel anytime.',
        planName: {
          adminMode: 'Admin Mode',
          pendingSetup: 'Pending Setup',
          cancelled: 'Cancelled',
          starter: 'Starter',
          professional: 'Professional',
          enterprise: 'Enterprise',
        },
        perMonth: 'per month',
        unlimited: 'unlimited',
        notActive: 'not active',
        inactive: 'inactive',
        features: 'Features',
        limitations: 'Limitations',
        currentPlan: 'Current Plan',
        upgradeToPlan: 'Upgrade to {{plan}}',
        downgradeToPlan: 'Downgrade to {{plan}}',
        switchToPlan: 'Switch to {{plan}}',
        confirmPlanUpgrade: 'Confirm Plan Upgrade',
        confirmPlanDowngrade: 'Confirm Plan Downgrade',
        upgradeDescription:
          "You're about to upgrade from {{current}} to {{new}}. Your subscription will be updated immediately with prorated billing. You'll be charged for the difference based on your billing cycle.",
        downgradeDescription:
          "You're about to downgrade from {{current}} to {{new}}. Your subscription will be updated immediately with prorated billing. You'll receive a credit for the unused time on your current plan, which will be applied to your next billing cycle.",
        confirmUpgrade: 'Confirm Upgrade',
        confirmDowngrade: 'Confirm Downgrade',
        ownerOnly:
          'Only organization owners can manage subscriptions. Contact your organization owner to upgrade.',
        loadingSubscription: 'Loading subscription information...',
        billingInfo: 'Billing Information',
        freeTrialIncluded: 'All new subscriptions include a 7-day free trial',
        chargedAfterTrial: "You'll only be charged after the trial period ends",
        billedMonthly:
          'Subscriptions are billed monthly and can be cancelled anytime',
        planChangesImmediate:
          'Plan changes take effect immediately with prorated billing',
        securePayments: 'All payments are processed securely through Stripe',
      },

      // Tenant/Organization Pages
      tenant: {
        organizationNotFound: 'Organization Not Found',
        orgNotFoundMessage: 'The organization "{{name}}" could not be found.',
        backToHome: 'Back to Home',
        loading: 'Loading...',
        contact: 'Contact',
        noActiveFlows: 'No Active Flows',
        noActiveFlowsMessage: "You don't have any active flows in {{tenant}}.",
        askAdminToEnroll:
          'Ask your administrator to enroll you in a flow, or scan a QR code invitation.',
        welcomeTo: 'Welcome to {{tenant}}',
        signInToView:
          'Sign in to view your flow progress and manage your enrollments.',
        home: 'Home',
        currentStep: 'Current Step',
        started: 'Started',
        updated: 'Updated',
        atStepToday: 'At step: Today',
        atStepOneDay: 'At step: 1 day',
        atStepDays: 'At step: {{days}} days',
        referenceId: 'Reference ID',
        nextSteps: 'Next Steps',
        noUpcomingSteps: 'No upcoming steps',
        noHistoryYet: 'No history yet',
        showingRecent: 'Showing {{count}} most recent',
      },

      // Invite Landing
      invite: {
        youreInvited: "You're Invited!",
        joinFlowAt: 'Join {{flow}} at {{tenant}}',
        invitationSent: 'Invitation Sent!',
        invitationSentTo: "We've sent an invitation to {{email}}",
        checkYourEmail: 'Check Your Email',
        receiveInvitation:
          "You'll receive an email invitation to join {{flow}} at {{tenant}}",
        clickToAddInbox: 'Click below to add this invitation to your inbox',
        enterEmailToReceive:
          'Enter your email address to receive an invitation to join this flow',
        signedInAs: 'Signed in as',
        addToMyInbox: 'Add to My Inbox',
        addingToInbox: 'Adding to Inbox...',
        sendMeInvitation: 'Send Me an Invitation',
        sendingInvitation: 'Sending Invitation...',
        inviteAlreadyExists:
          'An invitation already exists. Redirecting to your inbox...',
        inviteAlreadySentEmail:
          'An invitation has already been sent to this email address. Please check your email or try again later.',
        orgLimitReached:
          'Your organization has reached its limit. Please contact your administrator.',
        failedToSendInvitation: 'Failed to send invitation. Please try again.',
        enterEmailAddress: 'Please enter your email address',
      },

      // Settings - Extended
      'settings.organization': {
        noOrgSelected: 'No organization selected',
        manageSubscriptionDesc:
          "Manage your organization's subscription and billing settings",
        resourceUsage: 'Resource Usage',
        trackResourceConsumption:
          "Track your organization's resource consumption",
        activeCases: 'Active Cases',
        unlimitedActiveCases: 'Unlimited active cases on your plan',
        activeCasesLimitReached:
          'Budget reached! Cannot activate new cases or invite new customers.',
        remainingActiveCases: '{{count}} remaining active cases',
        teamMembers: 'Team Members',
        unlimitedTeamMembers: 'Unlimited team members on your plan',
        teamMembersLimitReached:
          'Budget reached! Cannot invite new team members.',
        remainingTeamMembers: '{{count}} remaining team member(s)',
        usageThisMonth: 'Usage This Month',
        statusUpdates: 'Status Updates',
        overageAlert: 'Overage Alert',
        overageMessage:
          "You've used {{count}} extra status updates. Additional cost: €{{cost}} (€0.05 per update)",
        overageCostInfo:
          'If you exceed your limit, additional updates cost €0.05 each',
        billingPeriodStarted: 'Billing period started',
        organizationInfo: 'Organization Information',
        basicInfo: 'Basic information about your organization',
        organizationName: 'Organization Name',
        organizationNamePlaceholder: 'Enter organization name',
        organizationNameHelper:
          'This name will appear on your public organization page',
        organizationDescription: 'Organization Description',
        organizationDescriptionPlaceholder:
          'Describe your organization, its mission, and what visitors can expect...',
        organizationDescriptionHelper:
          'This description will appear on your public organization page',
        contactPhone: 'Contact Phone',
        contactPhoneHelper: 'Phone number for contact inquiries',
        contactEmail: 'Contact Email',
        contactEmailHelper: 'Email address for contact inquiries',
        saveOrgInfo: 'Save Organization Information',
        themeColors: 'Theme Colors',
        customizeColors:
          "Customize the colors used on your organization's public page",
        primaryColor: 'Primary Color (Background)',
        accentColor: 'Accent Color (Badges & Highlights)',
        textColor: 'Text Color',
        livePreview: 'Live Preview',
        previewDescription: 'Preview of how colors appear on your page',
        saveThemeColors: 'Save Theme Colors',
        organizationLogo: 'Organization Logo',
        uploadLogoDescription:
          "Upload a logo to display on your organization's public page",
        logoFile: 'Logo File',
        logoFileHelper:
          'Upload an image file (PNG, JPG, GIF). Maximum size: 5MB. Recommended: 200x200px or larger.',
        logoPreview: 'Logo Preview',
        noLogo: 'No logo',
        logoSuccess: 'Logo {{action}} successfully!',
        uploaded: 'uploaded',
        deleted: 'deleted',
        uploading: 'Uploading...',
        uploadLogo: 'Upload Logo',
        deleting: 'Deleting...',
        deleteLogo: 'Delete Logo',
        previewAndTest: 'Preview & Test',
        seeHowPageLooks: 'See how your organization page looks to visitors',
        viewPublicPage: 'View Public Page',
        dangerZone: 'Danger Zone',
        irreversibleActions: 'Irreversible actions for this organization',
        leaveOrganization: 'Leave Organization',
        leaveOrganizationOwnerWarning:
          'As an owner, leaving may delete the organization if you are the sole owner.',
        leaveOrganizationWarning:
          'You will lose access to all data and cannot rejoin without a new invitation.',
        leaving: 'Leaving...',
      },
    },
  },
  es: {
    translation: {
      // Common
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        actions: 'Acciones',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        submit: 'Enviar',
        close: 'Cerrar',
        status: 'Estado',
      },

      // Navigation
      nav: {
        home: 'Inicio',
        dashboard: 'Panel',
        flows: 'Flujos',
        members: 'Miembros',
        customers: 'Clientes',
        inbox: 'Bandeja',
        account: 'Configuración de Cuenta',
        organization: 'Configuración de Organización',
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
      },

      // Authentication
      auth: {
        // Sign In
        signIn: 'Iniciar Sesión',
        signInTitle: 'Iniciar Sesión',
        signInDescription: 'Ingresa tus credenciales para acceder a tu cuenta',
        signInButton: 'Iniciar Sesión',
        signingIn: 'Iniciando sesión...',

        // Sign Up
        signUp: 'Registrarse',
        signUpTitle: 'Crear Cuenta',
        signUpDescription: 'Regístrate para una nueva cuenta para comenzar',
        signUpButton: 'Registrarse',
        signingUp: 'Registrándose...',
        creatingAccount: 'Creando cuenta...',

        // Form Fields
        email: 'Correo Electrónico',
        emailAddress: 'Dirección de Correo Electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        name: 'Nombre',
        fullName: 'Nombre Completo',

        // Placeholders
        emailPlaceholder: 'Ingresa tu correo',
        passwordPlaceholder: 'Ingresa tu contraseña',
        confirmPasswordPlaceholder: 'Confirma tu contraseña',
        namePlaceholder: 'Ingresa tu nombre completo',

        // Messages & Validation
        fillAllFields: 'Por favor completa todos los campos',
        loginFailed: 'Error al iniciar sesión',
        accountCreated: '¡Cuenta creada exitosamente!',
        accountCreatedCanSignIn:
          '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión con tu nueva cuenta.',
        checkEmail: 'Por favor revisa tu correo para confirmar tu cuenta',
        invalidCredentials: 'Correo o contraseña inválidos',
        emailInUse: 'El correo ya está en uso',
        weakPassword: 'La contraseña es muy débil',
        passwordMismatch: 'Las contraseñas no coinciden',
        passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
        pleaseLogin: 'Por favor inicia sesión para ver tu panel.',

        // Links
        forgotPassword: '¿Olvidaste tu contraseña?',
        resetPassword: 'Restablecer Contraseña',
        dontHaveAccount: '¿No tienes una cuenta?',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        signOut: 'Cerrar Sesión',

        // Forgot Password
        forgotPasswordTitle: 'Restablecer Contraseña',
        forgotPasswordDescription:
          'Ingresa tu dirección de correo y te enviaremos un enlace para restablecer tu contraseña',
        sendResetLink: 'Enviar Enlace de Restablecimiento',
        sending: 'Enviando...',
        emailSent: '¡Correo Enviado!',
        checkInbox:
          'Revisa tu bandeja de entrada para las instrucciones de restablecimiento de contraseña',
        resetLinkSentTo:
          'Hemos enviado un enlace de restablecimiento de contraseña a',
        didntReceiveEmail:
          '¿No recibiste el correo? Revisa tu carpeta de spam o intenta de nuevo.',
        tryAgain: 'Intentar de Nuevo',
        backToSignIn: 'Volver a Iniciar Sesión',
        rememberPassword: '¿Recuerdas tu contraseña? Inicia sesión',
        needNewAccount: '¿Necesitas una cuenta nueva?',
        failedToSendReset: 'Error al enviar el correo de restablecimiento',
        enterEmailAddress: 'Por favor ingresa tu dirección de correo',

        // Email Confirmation
        checkYourEmail: 'Revisa tu Correo',
        confirmYourEmail: 'Confirma tu Correo',
        sendingConfirmation:
          'Estamos enviando un correo de confirmación a {{email}}',
        enterEmailForConfirmation:
          'Ingresa tu dirección de correo y te enviaremos un nuevo enlace de confirmación',
        failedToResendConfirmation:
          'Error al reenviar el correo de confirmación',
        confirmationEmailSent: '¡Correo de Confirmación Enviado!',
        checkInboxForConfirmation:
          'Revisa tu bandeja de entrada para el enlace de confirmación',
        sentNewConfirmationTo:
          'Hemos enviado un nuevo correo de confirmación a',
        clickConfirmationLink:
          'Por favor revisa tu correo y haz clic en el enlace de confirmación para activar tu cuenta.',
        sendAnotherEmail: 'Enviar Otro Correo',
        sendConfirmationEmail: 'Enviar Correo de Confirmación',
        alreadyConfirmed: '¿Ya confirmaste? Inicia sesión',

        // Email Confirmation Status
        confirmingEmail: 'Confirmando Correo...',
        emailConfirmed: '¡Correo Confirmado!',
        confirmationFailed: 'Confirmación Fallida',
        pleaseWaitConfirming:
          'Por favor espera mientras confirmamos tu dirección de correo.',
        emailConfirmedSuccess:
          'Tu correo ha sido confirmado exitosamente. Ahora puedes iniciar sesión en tu cuenta.',
        unableToConfirm: 'No pudimos confirmar tu dirección de correo.',
        confirmationLinkInvalid:
          'Error al confirmar el correo. El enlace puede ser inválido o haber expirado.',
        noConfirmationToken: 'No se proporcionó token de confirmación.',
        redirectingToSignIn:
          'Redirigiendo a la página de inicio de sesión en 3 segundos...',
        continueToSignIn: 'Continuar a Iniciar Sesión',
        goToSignIn: 'Ir a Iniciar Sesión',
        signUpAgain: 'Registrarse de Nuevo',

        // Invite Context
        invitedToEnroll: 'Has sido invitado a inscribirte en {{flowName}}',
        signingInToJoin:
          'Estás iniciando sesión para unirte a {{flowName}} en {{tenantName}}',
        emailLockedFromInvite: 'Correo bloqueado por invitación',

        // WhatsApp
        whatsappNumber: 'Número de WhatsApp (Opcional)',
        whatsappHelper:
          'Opcional - Agrega tu número de WhatsApp para recibir notificaciones',

        // Opt-ins
        agreeToReceiveUpdates:
          'Acepto recibir actualizaciones/correos de esta aplicación',

        // Validation
        validatingInvite: 'Validando invitación...',
      },

      // Dashboard
      dashboard: {
        title: 'Panel',
        welcome: '¡Bienvenido de nuevo, {{name}}!',
        organizations: 'Organizaciones',
        createOrganization: 'Crear Organización',
        noOrganizations: 'Aún no hay organizaciones',
        recentActivity: 'Actividad Reciente',
        quickActions: 'Acciones Rápidas',

        // Management Mode
        managementMode: 'Modo de Gestión',
        managingAs: 'Gestionando {{tenant}} como {{role}}',
        leaving: 'Saliendo...',
        leaveOrganization: 'Salir de la Organización',
        managementTools: 'Herramientas de Gestión',

        // Organization Creation
        createFirstOrg: 'Crea Tu Primera Organización',
        getStarted:
          'Comienza creando una organización para gestionar flujos y equipos',

        // Organization Cards
        yourOrganizations: 'Tus Organizaciones',
        allOrganizations: 'Todas',
        activeFlows: 'Flujos Activos',
        recent: 'Reciente',
        moreFlows: '+{{count}} más',
        viewOrganization: 'Ver Organización',

        // Empty States
        noAccess: 'Aún no tienes acceso a ninguna organización',
        contactAdmin:
          'Contacta a un administrador para ser invitado a una organización',

        // Subscription Warnings
        completeSubscription: 'Completa Tu Suscripción',
        subscriptionCancelled: 'Suscripción Cancelada',
        subscribeToStart:
          'Suscríbete para comenzar a usar StatusAtFront y desbloquear todas las funciones de gestión.',
        subscriptionCancelledDescription:
          'Tu suscripción ha sido cancelada. Reactiva para continuar gestionando flujos, miembros y clientes.',

        // Selection Warnings
        selectOrganization: 'Selecciona Organización para Gestionar',
        selectOrganizationDescription:
          'Elige una organización del menú hamburguesa para acceder a funciones de gestión como flujos, miembros y configuraciones.',

        // Dividers
        managementVsEnrollment: 'Gestión vs Inscripción',
      },

      // Additional Spanish translations...
      flows: {
        // Basic
        title: 'Flujos',
        create: 'Crear Flujo',
        edit: 'Editar Flujo',
        delete: 'Eliminar Flujo',
        name: 'Nombre del Flujo',
        description: 'Descripción',
        status: 'Estado',
        active: 'Activo',
        inactive: 'Inactivo',
        draft: 'Borrador',
        noFlows: 'Aún no hay flujos',
        createFirst: 'Crea tu primer flujo para comenzar',
        flowBuilder: 'Constructor de Flujos',
        addStep: 'Agregar Paso',
        deleteStep: 'Eliminar Paso',
        addNode: 'Agregar Nodo',
        deleteNode: 'Eliminar Nodo',
        connectSteps: 'Conectar Pasos',
        back: 'Atrás',
        backToFlows: 'Volver a Flujos',
        zoomIn: 'Acercar',
        zoomOut: 'Alejar',
        resetView: 'Restablecer Vista',
        fitToView: 'Ajustar a Vista',
        moreOptions: 'Más opciones',
        organizing: 'Organizando...',
        organize: 'Organizar',
        organizeFlow: 'Organizar Flujo',
        minimapOn: 'Minimapa Activado',
        minimapOff: 'Minimapa Desactivado',
        minimap: 'Minimapa',
        hideMinimap: 'Ocultar minimapa',
        showMinimap: 'Mostrar minimapa',
        liveMode: 'Modo En Vivo',
        offlineMode: 'Modo Desconectado',
        live: 'En Vivo',
        offline: 'Desconectado',
        realtimeEnabled: 'Colaboración en tiempo real activada',
        enableRealtime: 'Activar colaboración en tiempo real',
        unknownFlow: 'Flujo Desconocido',

        // Dashboard Card
        manageFlows: 'Gestionar Flujos',
        manageFlowsDescription:
          'Crea y gestiona flujos de estado para {{tenant}}',

        // Management
        backToDashboard: 'Volver al Panel',
        flowManagement: 'Gestión de Flujos',
        manageWorkflows: 'Gestiona tus flujos de seguimiento de estado',
        managingFor: 'Gestionando flujos para {{tenant}}',
        noOrgSelected: 'Ninguna Organización Seleccionada',
        selectOrgPrompt:
          'Por favor selecciona una organización desde el panel para gestionar flujos',
        searchFlows: 'Buscar flujos...',
        loadingFlows: 'Cargando flujos...',
        errorLoadingFlows: 'Error al cargar los flujos',
        noFlowsFound: 'No se encontraron flujos',
        noFlowsMatchSearch:
          'No se encontraron flujos que coincidan con tu búsqueda',
        tryDifferentSearch:
          'Intenta diferentes términos de búsqueda o crea un nuevo flujo',
        flowsCount: '{{count}} flujo',
        flowsCount_other: '{{count}} flujos',
        showing: 'Mostrando',
        of: 'de',

        // Actions
        viewFlow: 'Ver Flujo',
        editFlow: 'Editar Flujo',
        inviteToFlow: 'Invitar al Flujo',
        deleteFlow: 'Eliminar Flujo',
        actions: 'Acciones',

        // Invite Modal
        inviteOthersTo: 'Invita a otros a inscribirse en {{flowName}}',
        emailInvite: 'Invitación por Correo',
        qrCode: 'Código QR',
        copyUrl: 'Copiar URL',
        inviteViaEmail: 'Invitar vía Correo',
        inviteByEmailDesc:
          'Envía un enlace de invitación directamente a su correo',
        sendInvite: 'Enviar Invitación',
        sending: 'Enviando...',
        inviteSentSuccess: '¡Invitación enviada exitosamente!',
        inviteSentTo: 'Invitación enviada a {{email}}',
        failedToSendInvite:
          'Error al enviar la invitación. Por favor intenta de nuevo.',
        scanQrCode: 'Escanear Código QR',
        scanQrCodeDesc: 'Escanea este código QR para inscribirte en el flujo',
        copyInviteUrl: 'Copiar URL de Invitación',
        copyInviteUrlDesc: 'Copia y comparte este enlace de invitación',
        copyLink: 'Copiar Enlace',
        linkCopied: '¡Enlace copiado!',
        linkCopiedToClipboard:
          'El enlace de invitación ha sido copiado al portapapeles',
        failedToCopyLink:
          'Error al copiar el enlace. Por favor cópialo manualmente.',
        enterEmailAddress: 'Ingresa una dirección de correo',
        close: 'Cerrar',

        // Delete Confirmation
        deleteFlowTitle: 'Eliminar Flujo',
        deleteFlowMessage:
          '¿Estás seguro de que deseas eliminar el flujo "{{flowName}}"? Esta acción no se puede deshacer.',
        confirmDelete: 'Sí, eliminar',
        deleting: 'Eliminando...',
        flowDeleted: 'Flujo eliminado exitosamente',
        failedToDeleteFlow: 'Error al eliminar el flujo',

        // Builder
        newStep: 'Nuevo Paso',
        stepName: 'Nombre del Paso',
        stepDescription: 'Descripción del Paso',
        saveChanges: 'Guardar Cambios',
        saving: 'Guardando...',
        changesSaved: 'Cambios guardados exitosamente',
        failedToSaveChanges: 'Error al guardar los cambios',
        deleteStepTitle: 'Eliminar Paso',
        deleteStepMessage:
          '¿Estás seguro de que deseas eliminar "{{stepName}}"? Esto eliminará todas las conexiones a este paso.',
        stepDeleted: 'Paso eliminado exitosamente',
        failedToDeleteStep: 'Error al eliminar el paso',

        // Create Flow Dialog
        createNewFlow: 'Crear Nuevo Flujo',
        createFlowFor: 'Crear un nuevo flujo de estado para {{tenant}}',
        flowNameLabel: 'Nombre del Flujo',
        flowNamePlaceholder: 'Ej: Incorporación de Clientes',
        flowDescLabel: 'Descripción',
        flowDescPlaceholder: 'Describe el propósito de este flujo...',
        createFlow: 'Crear Flujo',
        creating: 'Creando...',
        flowCreated: 'Flujo creado exitosamente',
        failedToCreateFlow: 'Error al crear el flujo',
        cancel: 'Cancelar',

        // Status Tracking
        loadingStatusTracking: 'Cargando seguimiento de estado...',
        enrollmentNotFound: 'Inscripción no encontrada.',
      },

      members: {
        title: 'Miembros',
        invite: 'Invitar Miembro',
        role: 'Rol',
        owner: 'Propietario',
        staff: 'Personal',
        member: 'Miembro',
        email: 'Correo',
        status: 'Estado',
        joined: 'Unido',
        pending: 'Pendiente',
        noMembers: 'Aún no hay miembros',
        inviteFirst: 'Invita a tu primer miembro para colaborar',

        // Dashboard Card
        manageMembers: 'Gestionar Miembros',
        manageMembersDescription:
          'Invita y gestiona miembros del equipo para {{tenant}}',

        // Member Management Page
        memberManagement: 'Gestión de Miembros',
        manageTeamMembers: 'Gestiona los miembros del equipo y sus roles',
        managingMembersFor: 'Gestionando miembros para {{tenant}}',
        pleaseSelectOrg:
          'Por favor seleccione una organización del menú para gestionar miembros.',
        searchMembers: 'Buscar miembros...',
        loadingMembers: 'Cargando miembros...',
        loadError: 'Error al cargar miembros. Por favor, intente de nuevo.',
        membersCount: 'Miembros ({{count}})',
        inviteMember: 'Invitar Miembro',
        emailAddress: 'Dirección de Correo Electrónico',
        enterEmailAddress: 'Ingrese la dirección de correo electrónico',
        sending: 'Enviando...',
        sendInvite: 'Enviar Invitación',
        you: 'Tú',
        promote: 'Promover',
        demote: 'Degradar',
        remove: 'Eliminar',
        showingMembers: 'Mostrando {{from}} a {{to}} de {{total}} miembros',
        noMembersFound: 'No Se Encontraron Miembros',
        noMatchingSearch:
          'Ningún miembro coincide con "{{search}}". Intente ajustar su búsqueda.',
        noMembersForOrg: 'No se encontraron miembros para esta organización.',
        promoteTitle: '¿Promover a {{member}}?',
        promoteDescription:
          'Esto promoverá a {{member}} de {{currentRole}} a {{newRole}}.',
        promoteConfirm: 'Promover a {{role}}',
        demoteTitle: '¿Degradar a {{member}}?',
        demoteDescription:
          'Esto degradará a {{member}} de {{currentRole}} a {{newRole}}.',
        demoteConfirm: 'Degradar a {{role}}',
        removeTitle: '¿Eliminar a {{member}}?',
        removeDescription:
          'Esto eliminará permanentemente a {{member}} de la organización. Perderán todo acceso inmediatamente.',
        removeMember: 'Eliminar Miembro',
        membershipLimitReached:
          'Su plan ha alcanzado el límite de miembros. Por favor actualice para agregar más miembros.',
        inviteErrorGeneric: 'Ocurrió un error. Por favor, intente de nuevo.',
      },

      customers: {
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
        inviteError:
          'Error al enviar la invitación. Por favor, intente de nuevo.',
        customerEmail: 'Correo Electrónico del Cliente',
        emailPlaceholder: 'cliente@ejemplo.com',
        selectFlow: 'Seleccionar un flujo...',
        customerWillBeEnrolled: 'El cliente será inscrito en "{{flowName}}"',
        sendInvitation: 'Enviar Invitación',
      },

      inbox: {
        title: 'Bandeja',
        messages: 'Mensajes',
        notifications: 'Notificaciones',
        unread: 'No leídos',
        unreadMessages: 'mensajes no leídos',
        markAsRead: 'Marcar como Leído',
        markAllAsRead: 'Marcar Todos como Leídos',
        noMessages: 'No hay mensajes',
        emptyInbox: 'Tu bandeja está vacía',
        statusUpdate: 'Actualización de Estado',
        teamInvite: 'Invitación de Equipo',
        flowInvite: 'Invitación de Flujo',
        membershipUpdate: 'Actualización de Membresía',
        new: 'Nuevo',
        actionRequired: 'Acción Requerida',
        from: 'De',
        team: 'Equipo',
        flow: 'Flujo',
        accept: 'Aceptar',
        reject: 'Rechazar',
        accepted: 'Aceptado',
        rejected: 'Rechazado',
        actionAlreadyTaken: 'Esta acción ya ha sido tomada',
        actionAlreadyTakenTitle: 'Acción Ya Tomada',
        loadingMessages: 'Cargando mensajes...',
        failedToLoad: 'Error al cargar mensajes',
        loadErrorMessage:
          'Hubo un error al cargar tus mensajes. Por favor, inténtalo de nuevo.',
        manageNotifications: 'Gestiona tus notificaciones y mensajes',
        filterDescription: 'Filtrar mensajes',
        messageType: 'Tipo de Mensaje',
        allTypes: 'Todos los Tipos',
        statusUpdates: 'Actualizaciones de Estado',
        teamInvites: 'Invitaciones de Equipo',
        flowInvites: 'Invitaciones de Flujo',
        membershipUpdates: 'Actualizaciones de Membresía',
        readStatus: 'Estado de Lectura',
        allMessages: 'Todos los Mensajes',
        read: 'Leído',
        noAction: 'Sin Acción',
        perPage: 'Por página',
        marking: 'Marcando...',
        totalMessages: '{{count}} mensajes totales',
        noMessagesFound: 'No se encontraron mensajes',
        tryAdjustingFilters:
          'Intenta ajustar tus filtros para ver más mensajes.',
        noMessagesAtThisTime: 'No tienes mensajes en este momento.',
        showingMessages: 'Mostrando {{from}} a {{to}} de {{total}} mensajes',
      },

      errors: {
        somethingWentWrong: 'Algo salió mal',
        tryAgain: 'Intentar de Nuevo',
        pageNotFound: '404 - Página No Encontrada',
        goHome: 'Ir al Inicio',
        unauthorized: 'No Autorizado',
        forbidden: 'Prohibido',
        serverError: 'Error del Servidor',
        networkError: 'Error de Red',
        loadingError: 'Error al cargar datos',
        errorLoadingEnrollment: 'Error al Cargar la Inscripción',
        failedToLoadEnrollment:
          'Error al cargar los detalles de la inscripción',
      },

      settings: {
        account: 'Configuración de Cuenta',
        organization: 'Configuración de Organización',
        profile: 'Perfil',
        security: 'Seguridad',
        notifications: 'Notificaciones',
        billing: 'Facturación',
        theme: 'Tema',
        language: 'Idioma',
        darkMode: 'Modo Oscuro',
        lightMode: 'Modo Claro',
        autoMode: 'Modo Automático',

        // Dashboard Cards
        accountSettings: 'Configuración de Cuenta',
        organizationSettings: 'Configuración de Organización',
        customizeBranding:
          'Personaliza la marca, temas y detalles de la organización',
        manageOrganization: 'Gestionar Organización',
        managePreferences:
          'Gestiona la configuración y preferencias de tu cuenta',
        manageProfile: 'Gestiona tu perfil, contraseña y preferencias',
        manageAccount: 'Gestionar Cuenta',
      },

      account: {
        pleaseSignIn:
          'Por favor, inicia sesión para acceder a la configuración de cuenta.',
        managePreferences:
          'Gestiona la configuración y preferencias de tu cuenta',
        profileInfo: 'Información del Perfil',
        profileDescription:
          'Actualiza tu información personal y datos de contacto',
        fullName: 'Nombre Completo',
        fullNamePlaceholder: 'Ingresa tu nombre completo',
        emailAddress: 'Dirección de Correo Electrónico',
        emailPlaceholder: 'Ingresa tu dirección de correo electrónico',
        whatsappPhone: 'Número de Teléfono de WhatsApp',
        whatsappHelper: 'Usado para notificaciones de WhatsApp',
        marketingComms: 'Comunicaciones de Marketing',
        marketingHelper:
          'Recibe actualizaciones sobre nuevas características y mejoras',
        saveProfile: 'Guardar Perfil',
        appearance: 'Apariencia',
        appearanceDescription: 'Personaliza cómo se ve y siente la aplicación',
        theme: 'Tema',
        selectTheme: 'Seleccionar tema',
        light: 'Claro',
        dark: 'Oscuro',
        themeHelper: 'Elige tu esquema de color preferido',
        accountManagement: 'Gestión de Cuenta',
        accountManagementDescription:
          'Gestiona la seguridad y datos de tu cuenta',
        deleteAccount: 'Eliminar Cuenta',
        deleteAccountDescription:
          'Eliminar permanentemente tu cuenta y todos los datos asociados.',
        soleOwnerWarning:
          'Advertencia: Eres el único propietario de {{count}} organización(es). Eliminar tu cuenta también eliminará estas organizaciones.',
        deleting: 'Eliminando...',
        deleteAccountWarning:
          'Esto eliminará permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.',
        deleteAccountWithOrgs:
          'Eliminar tu cuenta también eliminará las siguientes organizaciones donde eres el único propietario:\n\n{{orgs}}\n\nEsta acción no se puede deshacer.',
      },

      organization: {
        nameRequired: 'El nombre de la organización es requerido',
        failedToCreate: 'Error al crear la organización',
        createOrganization: 'Crear Organización',
        setupDescription:
          'Configure una nueva organización para gestionar sus equipos y flujos de trabajo',
        organizationDetails: 'Detalles de la Organización',
        chooseUniqueName: 'Elija un nombre único para su organización',
        organizationNameRequired: 'Nombre de Organización *',
        namePlaceholder:
          'Ingrese el nombre de la organización (ej., Acme Corp)',
        nameHelper:
          'Este nombre será visible para los miembros de su equipo y clientes',
        creating: 'Creando...',
        whatHappensNext: '¿Qué sucede después?',
        becomeOwner:
          'Te convertirás automáticamente en el propietario de la organización',
        inviteMembers: 'Puedes invitar a miembros del equipo para colaborar',
        createFlows:
          'Comienza a crear flujos para rastrear actualizaciones de estado',
        subscribeToPlan:
          'Suscríbete a un plan para desbloquear todas las funciones',
      },

      notifications: {
        title: 'Preferencias de Notificación',
        description: 'Gestiona cómo recibes notificaciones',
        loadingPreferences: 'Cargando preferencias...',
        failedToLoad: 'Error al cargar las preferencias de notificación.',
        tryRefreshing: 'Por favor, intenta actualizar la página.',
        chooseHowNotified:
          'Elige cómo deseas ser notificado sobre actualizaciones importantes',
        emailNotifications: 'Notificaciones por Correo Electrónico',
        enableEmailNotifications:
          'Activar Notificaciones por Correo Electrónico',
        masterToggleEmail:
          'Control maestro - controla todas las configuraciones de notificación por correo electrónico a continuación',
        statusUpdates: 'Actualizaciones de Estado',
        statusUpdatesDescription:
          'Recibe notificaciones cuando cambie el estado del flujo',
        invitations: 'Invitaciones',
        invitationsDescription:
          'Recibe notificaciones sobre invitaciones de equipo y flujo',
        whatsappNotifications: 'Notificaciones de WhatsApp',
        addWhatsAppNumber:
          'Por favor, agrega un número de teléfono de WhatsApp en la configuración de tu perfil para habilitar las notificaciones de WhatsApp.',
        enableWhatsAppNotifications: 'Activar Notificaciones de WhatsApp',
        masterToggleWhatsApp:
          'Control maestro - controla todas las configuraciones de notificación de WhatsApp a continuación',
        savePreferences: 'Guardar Preferencias',
        savedSuccessfully:
          '¡Preferencias de notificación guardadas exitosamente!',
        failedToSave:
          'Error al guardar las preferencias. Por favor, intenta de nuevo.',
      },

      subscription: {
        free: 'Gratis',
        starter: 'Inicial',
        professional: 'Profesional',
        enterprise: 'Empresarial',
        upgrade: 'Actualizar',
        downgrade: 'Reducir',
        manage: 'Administrar Suscripción',
        billingPortal: 'Portal de Facturación',
        currentSubscription: 'Suscripción Actual',
        manageBilling: 'Gestionar Facturación',
        startFreeTrial: 'Comienza tu Prueba Gratuita de 7 Días',
        freeTrialDescription:
          'Prueba cualquier plan sin riesgo con acceso completo a todas las funciones. No se cargará ninguna tarjeta de crédito hasta después de 7 días. Cancela en cualquier momento.',
        planName: {
          adminMode: 'Modo Administrador',
          pendingSetup: 'Configuración Pendiente',
          cancelled: 'Cancelado',
          starter: 'Inicial',
          professional: 'Profesional',
          enterprise: 'Empresarial',
        },
        perMonth: 'por mes',
        unlimited: 'ilimitado',
        notActive: 'no activo',
        inactive: 'inactivo',
        features: 'Características',
        limitations: 'Limitaciones',
        currentPlan: 'Plan Actual',
        upgradeToPlan: 'Actualizar a {{plan}}',
        downgradeToPlan: 'Reducir a {{plan}}',
        switchToPlan: 'Cambiar a {{plan}}',
        confirmPlanUpgrade: 'Confirmar Actualización del Plan',
        confirmPlanDowngrade: 'Confirmar Reducción del Plan',
        upgradeDescription:
          'Estás a punto de actualizar de {{current}} a {{new}}. Tu suscripción se actualizará inmediatamente con facturación prorrateada. Se te cobrará la diferencia según tu ciclo de facturación.',
        downgradeDescription:
          'Estás a punto de reducir de {{current}} a {{new}}. Tu suscripción se actualizará inmediatamente con facturación prorrateada. Recibirás un crédito por el tiempo no utilizado de tu plan actual, que se aplicará a tu próximo ciclo de facturación.',
        confirmUpgrade: 'Confirmar Actualización',
        confirmDowngrade: 'Confirmar Reducción',
        ownerOnly:
          'Solo los propietarios de la organización pueden gestionar suscripciones. Contacta al propietario de tu organización para actualizar.',
        loadingSubscription: 'Cargando información de suscripción...',
        billingInfo: 'Información de Facturación',
        freeTrialIncluded:
          'Todas las nuevas suscripciones incluyen una prueba gratuita de 7 días',
        chargedAfterTrial:
          'Solo se te cobrará después de que finalice el período de prueba',
        billedMonthly:
          'Las suscripciones se facturan mensualmente y se pueden cancelar en cualquier momento',
        planChangesImmediate:
          'Los cambios de plan tienen efecto inmediato con facturación prorrateada',
        securePayments:
          'Todos los pagos se procesan de forma segura a través de Stripe',
      },

      // Tenant/Organization Pages
      tenant: {
        organizationNotFound: 'Organización No Encontrada',
        orgNotFoundMessage: 'La organización "{{name}}" no se pudo encontrar.',
        backToHome: 'Volver al Inicio',
        loading: 'Cargando...',
        contact: 'Contacto',
        noActiveFlows: 'Sin Flujos Activos',
        noActiveFlowsMessage: 'No tienes flujos activos en {{tenant}}.',
        askAdminToEnroll:
          'Pide a tu administrador que te inscriba en un flujo, o escanea una invitación con código QR.',
        welcomeTo: 'Bienvenido a {{tenant}}',
        signInToView:
          'Inicia sesión para ver tu progreso de flujo y gestionar tus inscripciones.',
        home: 'Inicio',
        currentStep: 'Paso Actual',
        started: 'Iniciado',
        updated: 'Actualizado',
        atStepToday: 'En el paso: Hoy',
        atStepOneDay: 'En el paso: 1 día',
        atStepDays: 'En el paso: {{days}} días',
        referenceId: 'ID de Referencia',
        nextSteps: 'Próximos Pasos',
        noUpcomingSteps: 'Sin próximos pasos',
        noHistoryYet: 'Sin historial aún',
        showingRecent: 'Mostrando {{count}} más recientes',
      },

      // Invite Landing
      invite: {
        youreInvited: '¡Estás Invitado!',
        joinFlowAt: 'Únete a {{flow}} en {{tenant}}',
        invitationSent: '¡Invitación Enviada!',
        invitationSentTo: 'Hemos enviado una invitación a {{email}}',
        checkYourEmail: 'Revisa tu Correo',
        receiveInvitation:
          'Recibirás una invitación por correo para unirte a {{flow}} en {{tenant}}',
        clickToAddInbox:
          'Haz clic abajo para agregar esta invitación a tu bandeja de entrada',
        enterEmailToReceive:
          'Ingresa tu dirección de correo para recibir una invitación para unirte a este flujo',
        signedInAs: 'Conectado como',
        addToMyInbox: 'Agregar a Mi Bandeja',
        addingToInbox: 'Agregando a la Bandeja...',
        sendMeInvitation: 'Enviarme una Invitación',
        sendingInvitation: 'Enviando Invitación...',
        inviteAlreadyExists:
          'Ya existe una invitación. Redirigiendo a tu bandeja de entrada...',
        inviteAlreadySentEmail:
          'Ya se ha enviado una invitación a esta dirección de correo. Por favor revisa tu correo o intenta de nuevo más tarde.',
        orgLimitReached:
          'Tu organización ha alcanzado su límite. Por favor contacta a tu administrador.',
        failedToSendInvitation:
          'Error al enviar la invitación. Por favor intenta de nuevo.',
        enterEmailAddress: 'Por favor ingresa tu dirección de correo',
      },

      // Settings - Extended
      'settings.organization': {
        noOrgSelected: 'Ninguna organización seleccionada',
        manageSubscriptionDesc:
          'Administrar la suscripción y configuración de facturación de tu organización',
        resourceUsage: 'Uso de Recursos',
        trackResourceConsumption:
          'Rastrea el consumo de recursos de tu organización',
        activeCases: 'Casos Activos',
        unlimitedActiveCases: 'Casos activos ilimitados en tu plan',
        activeCasesLimitReached:
          '¡Límite alcanzado! No se pueden activar nuevos casos o invitar nuevos clientes.',
        remainingActiveCases: '{{count}} casos activos restantes',
        teamMembers: 'Miembros del Equipo',
        unlimitedTeamMembers: 'Miembros del equipo ilimitados en tu plan',
        teamMembersLimitReached:
          '¡Límite alcanzado! No se pueden invitar nuevos miembros del equipo.',
        remainingTeamMembers: '{{count}} miembro(s) del equipo restante(s)',
        usageThisMonth: 'Uso Este Mes',
        statusUpdates: 'Actualizaciones de Estado',
        overageAlert: 'Alerta de Exceso',
        overageMessage:
          'Has usado {{count}} actualizaciones de estado adicionales. Costo adicional: €{{cost}} (€0.05 por actualización)',
        overageCostInfo:
          'Si excedes tu límite, las actualizaciones adicionales cuestan €0.05 cada una',
        billingPeriodStarted: 'Período de facturación iniciado',
        organizationInfo: 'Información de la Organización',
        basicInfo: 'Información básica sobre tu organización',
        organizationName: 'Nombre de la Organización',
        organizationNamePlaceholder: 'Ingresa el nombre de la organización',
        organizationNameHelper:
          'Este nombre aparecerá en la página pública de tu organización',
        organizationDescription: 'Descripción de la Organización',
        organizationDescriptionPlaceholder:
          'Describe tu organización, su misión y qué pueden esperar los visitantes...',
        organizationDescriptionHelper:
          'Esta descripción aparecerá en la página pública de tu organización',
        contactPhone: 'Teléfono de Contacto',
        contactPhoneHelper: 'Número de teléfono para consultas de contacto',
        contactEmail: 'Correo de Contacto',
        contactEmailHelper: 'Dirección de correo para consultas de contacto',
        saveOrgInfo: 'Guardar Información de la Organización',
        themeColors: 'Colores del Tema',
        customizeColors:
          'Personaliza los colores utilizados en la página pública de tu organización',
        primaryColor: 'Color Primario (Fondo)',
        accentColor: 'Color de Acento (Insignias y Resaltados)',
        textColor: 'Color de Texto',
        livePreview: 'Vista Previa en Vivo',
        previewDescription:
          'Vista previa de cómo aparecen los colores en tu página',
        saveThemeColors: 'Guardar Colores del Tema',
        organizationLogo: 'Logo de la Organización',
        uploadLogoDescription:
          'Sube un logo para mostrar en la página pública de tu organización',
        logoFile: 'Archivo de Logo',
        logoFileHelper:
          'Sube un archivo de imagen (PNG, JPG, GIF). Tamaño máximo: 5MB. Recomendado: 200x200px o mayor.',
        logoPreview: 'Vista Previa del Logo',
        noLogo: 'Sin logo',
        logoSuccess: '¡Logo {{action}} exitosamente!',
        uploaded: 'subido',
        deleted: 'eliminado',
        uploading: 'Subiendo...',
        uploadLogo: 'Subir Logo',
        deleting: 'Eliminando...',
        deleteLogo: 'Eliminar Logo',
        previewAndTest: 'Vista Previa y Prueba',
        seeHowPageLooks:
          'Ve cómo se ve la página de tu organización para los visitantes',
        viewPublicPage: 'Ver Página Pública',
        dangerZone: 'Zona de Peligro',
        irreversibleActions: 'Acciones irreversibles para esta organización',
        leaveOrganization: 'Dejar Organización',
        leaveOrganizationOwnerWarning:
          'Como propietario, salir puede eliminar la organización si eres el único propietario.',
        leaveOrganizationWarning:
          'Perderás acceso a todos los datos y no podrás volver a unirte sin una nueva invitación.',
        leaving: 'Saliendo...',
      },
    },
  },
  pt: {
    translation: {
      // Common
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Salvar',
        delete: 'Excluir',
        edit: 'Editar',
        create: 'Criar',
        search: 'Pesquisar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        actions: 'Ações',
        back: 'Voltar',
        next: 'Próximo',
        previous: 'Anterior',
        submit: 'Enviar',
        close: 'Fechar',
        status: 'Estado',
      },

      // Navigation
      nav: {
        home: 'Início',
        dashboard: 'Painel',
        flows: 'Fluxos',
        members: 'Membros',
        customers: 'Clientes',
        inbox: 'Caixa de Entrada',
        account: 'Configurações da Conta',
        organization: 'Configurações da Organização',
        signIn: 'Entrar',
        signUp: 'Cadastrar',
        signOut: 'Sair',
      },

      // Authentication
      auth: {
        // Sign In
        signIn: 'Entrar',
        signInTitle: 'Entrar',
        signInDescription: 'Digite suas credenciais para acessar sua conta',
        signInButton: 'Entrar',
        signingIn: 'Entrando...',

        // Sign Up
        signUp: 'Cadastrar',
        signUpTitle: 'Criar Conta',
        signUpDescription: 'Cadastre-se para uma nova conta para começar',
        signUpButton: 'Cadastrar',
        signingUp: 'Cadastrando...',
        creatingAccount: 'Criando conta...',

        // Form Fields
        email: 'E-mail',
        emailAddress: 'Endereço de E-mail',
        password: 'Senha',
        confirmPassword: 'Confirmar Senha',
        name: 'Nome',
        fullName: 'Nome Completo',

        // Placeholders
        emailPlaceholder: 'Digite seu e-mail',
        passwordPlaceholder: 'Digite sua senha',
        confirmPasswordPlaceholder: 'Confirme sua senha',
        namePlaceholder: 'Digite seu nome completo',

        // Messages & Validation
        fillAllFields: 'Por favor, preencha todos os campos',
        loginFailed: 'Falha ao entrar',
        accountCreated: 'Conta criada com sucesso!',
        accountCreatedCanSignIn:
          'Conta criada com sucesso! Agora você pode entrar com sua nova conta.',
        checkEmail: 'Por favor, verifique seu e-mail para confirmar sua conta',
        invalidCredentials: 'E-mail ou senha inválidos',
        emailInUse: 'E-mail já está em uso',
        weakPassword: 'A senha é muito fraca',
        passwordMismatch: 'As senhas não coincidem',
        passwordMinLength: 'A senha deve ter pelo menos 8 caracteres',
        pleaseLogin: 'Por favor, faça login para ver seu painel.',

        // Links
        forgotPassword: 'Esqueceu a senha?',
        resetPassword: 'Redefinir Senha',
        dontHaveAccount: 'Não tem uma conta?',
        alreadyHaveAccount: 'Já tem uma conta?',
        signOut: 'Sair',

        // Forgot Password
        forgotPasswordTitle: 'Redefinir Senha',
        forgotPasswordDescription:
          'Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha',
        sendResetLink: 'Enviar Link de Redefinição',
        sending: 'Enviando...',
        emailSent: 'E-mail Enviado!',
        checkInbox:
          'Verifique sua caixa de entrada para instruções de redefinição de senha',
        resetLinkSentTo: 'Enviamos um link de redefinição de senha para',
        didntReceiveEmail:
          'Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.',
        tryAgain: 'Tentar Novamente',
        backToSignIn: 'Voltar para Entrar',
        rememberPassword: 'Lembra sua senha? Entre',
        needNewAccount: 'Precisa de uma conta nova?',
        failedToSendReset: 'Falha ao enviar e-mail de redefinição',
        enterEmailAddress: 'Por favor, digite seu endereço de e-mail',

        // Email Confirmation
        checkYourEmail: 'Verifique seu E-mail',
        confirmYourEmail: 'Confirme seu E-mail',
        sendingConfirmation:
          'Estamos enviando um e-mail de confirmação para {{email}}',
        enterEmailForConfirmation:
          'Digite seu endereço de e-mail e enviaremos um novo link de confirmação',
        failedToResendConfirmation: 'Falha ao reenviar e-mail de confirmação',
        confirmationEmailSent: 'E-mail de Confirmação Enviado!',
        checkInboxForConfirmation:
          'Verifique sua caixa de entrada para o link de confirmação',
        sentNewConfirmationTo: 'Enviamos um novo e-mail de confirmação para',
        clickConfirmationLink:
          'Por favor, verifique seu e-mail e clique no link de confirmação para ativar sua conta.',
        sendAnotherEmail: 'Enviar Outro E-mail',
        sendConfirmationEmail: 'Enviar E-mail de Confirmação',
        alreadyConfirmed: 'Já confirmou? Entre',

        // Email Confirmation Status
        confirmingEmail: 'Confirmando E-mail...',
        emailConfirmed: 'E-mail Confirmado!',
        confirmationFailed: 'Confirmação Falhou',
        pleaseWaitConfirming:
          'Por favor, aguarde enquanto confirmamos seu endereço de e-mail.',
        emailConfirmedSuccess:
          'Seu e-mail foi confirmado com sucesso. Agora você pode entrar em sua conta.',
        unableToConfirm: 'Não foi possível confirmar seu endereço de e-mail.',
        confirmationLinkInvalid:
          'Falha ao confirmar e-mail. O link pode ser inválido ou ter expirado.',
        noConfirmationToken: 'Nenhum token de confirmação fornecido.',
        redirectingToSignIn:
          'Redirecionando para a página de login em 3 segundos...',
        continueToSignIn: 'Continuar para Entrar',
        goToSignIn: 'Ir para Entrar',
        signUpAgain: 'Cadastrar Novamente',

        // Invite Context
        invitedToEnroll: 'Você foi convidado a se inscrever em {{flowName}}',
        signingInToJoin:
          'Você está entrando para participar de {{flowName}} em {{tenantName}}',
        emailLockedFromInvite: 'E-mail bloqueado por convite',

        // WhatsApp
        whatsappNumber: 'Número do WhatsApp (Opcional)',
        whatsappHelper:
          'Opcional - Adicione seu número do WhatsApp para receber notificações',

        // Opt-ins
        agreeToReceiveUpdates:
          'Aceito receber atualizações/e-mails deste aplicativo',

        // Validation
        validatingInvite: 'Validando convite...',
      },

      // Dashboard
      dashboard: {
        title: 'Painel',
        welcome: 'Bem-vindo de volta, {{name}}!',
        organizations: 'Organizações',
        createOrganization: 'Criar Organização',
        noOrganizations: 'Ainda não há organizações',
        recentActivity: 'Atividade Recente',
        quickActions: 'Ações Rápidas',

        // Management Mode
        managementMode: 'Modo de Gestão',
        managingAs: 'Gerenciando {{tenant}} como {{role}}',
        leaving: 'Saindo...',
        leaveOrganization: 'Sair da Organização',
        managementTools: 'Ferramentas de Gestão',

        // Organization Creation
        createFirstOrg: 'Crie Sua Primeira Organização',
        getStarted:
          'Comece criando uma organização para gerenciar fluxos e equipes',

        // Organization Cards
        yourOrganizations: 'Suas Organizações',
        allOrganizations: 'Todas',
        activeFlows: 'Fluxos Ativos',
        recent: 'Recente',
        moreFlows: '+{{count}} mais',
        viewOrganization: 'Ver Organização',

        // Empty States
        noAccess: 'Você ainda não tem acesso a nenhuma organização',
        contactAdmin:
          'Entre em contato com um administrador para ser convidado para uma organização',

        // Subscription Warnings
        completeSubscription: 'Complete Sua Assinatura',
        subscriptionCancelled: 'Assinatura Cancelada',
        subscribeToStart:
          'Assine para começar a usar o StatusAtFront e desbloquear todos os recursos de gerenciamento.',
        subscriptionCancelledDescription:
          'Sua assinatura foi cancelada. Reative para continuar gerenciando fluxos, membros e clientes.',

        // Selection Warnings
        selectOrganization: 'Selecione Organização para Gerenciar',
        selectOrganizationDescription:
          'Escolha uma organização no menu hambúrguer para acessar recursos de gerenciamento como fluxos, membros e configurações.',

        // Dividers
        managementVsEnrollment: 'Gerenciamento vs Inscrição',
      },

      flows: {
        // Basic
        title: 'Fluxos',
        create: 'Criar Fluxo',
        edit: 'Editar Fluxo',
        delete: 'Excluir Fluxo',
        name: 'Nome do Fluxo',
        description: 'Descrição',
        status: 'Status',
        active: 'Ativo',
        inactive: 'Inativo',
        draft: 'Rascunho',
        noFlows: 'Ainda não há fluxos',
        createFirst: 'Crie seu primeiro fluxo para começar',
        flowBuilder: 'Construtor de Fluxos',
        addStep: 'Adicionar Etapa',
        deleteStep: 'Excluir Etapa',
        addNode: 'Adicionar Nó',
        deleteNode: 'Excluir Nó',
        connectSteps: 'Conectar Etapas',
        back: 'Voltar',
        backToFlows: 'Voltar aos Fluxos',
        zoomIn: 'Aumentar Zoom',
        zoomOut: 'Diminuir Zoom',
        resetView: 'Redefinir Visualização',
        fitToView: 'Ajustar à Visualização',
        moreOptions: 'Mais opções',
        organizing: 'Organizando...',
        organize: 'Organizar',
        organizeFlow: 'Organizar Fluxo',
        minimapOn: 'Minimapa Ativado',
        minimapOff: 'Minimapa Desativado',
        minimap: 'Minimapa',
        hideMinimap: 'Ocultar minimapa',
        showMinimap: 'Mostrar minimapa',
        liveMode: 'Modo Ao Vivo',
        offlineMode: 'Modo Offline',
        live: 'Ao Vivo',
        offline: 'Offline',
        realtimeEnabled: 'Colaboração em tempo real ativada',
        enableRealtime: 'Ativar colaboração em tempo real',
        unknownFlow: 'Fluxo Desconhecido',

        // Dashboard Card
        manageFlows: 'Gerenciar Fluxos',
        manageFlowsDescription:
          'Crie e gerencie fluxos de status para {{tenant}}',

        // Management
        backToDashboard: 'Voltar ao Painel',
        flowManagement: 'Gestão de Fluxos',
        manageWorkflows: 'Gerencie seus fluxos de rastreamento de status',
        managingFor: 'Gerenciando fluxos para {{tenant}}',
        noOrgSelected: 'Nenhuma Organização Selecionada',
        selectOrgPrompt:
          'Por favor, selecione uma organização no painel para gerenciar fluxos',
        searchFlows: 'Buscar fluxos...',
        loadingFlows: 'Carregando fluxos...',
        errorLoadingFlows: 'Erro ao carregar os fluxos',
        noFlowsFound: 'Nenhum fluxo encontrado',
        noFlowsMatchSearch: 'Nenhum fluxo corresponde à sua busca',
        tryDifferentSearch:
          'Tente diferentes termos de busca ou crie um novo fluxo',
        flowsCount: '{{count}} fluxo',
        flowsCount_other: '{{count}} fluxos',
        showing: 'Mostrando',
        of: 'de',

        // Actions
        viewFlow: 'Ver Fluxo',
        editFlow: 'Editar Fluxo',
        inviteToFlow: 'Convidar para o Fluxo',
        deleteFlow: 'Excluir Fluxo',
        actions: 'Ações',

        // Invite Modal
        inviteOthersTo: 'Convide outros para se inscrever em {{flowName}}',
        emailInvite: 'Convite por E-mail',
        qrCode: 'Código QR',
        copyUrl: 'Copiar URL',
        inviteViaEmail: 'Convidar via E-mail',
        inviteByEmailDesc: 'Envie um link de convite diretamente para o e-mail',
        sendInvite: 'Enviar Convite',
        sending: 'Enviando...',
        inviteSentSuccess: 'Convite enviado com sucesso!',
        inviteSentTo: 'Convite enviado para {{email}}',
        failedToSendInvite:
          'Falha ao enviar o convite. Por favor, tente novamente.',
        scanQrCode: 'Escanear Código QR',
        scanQrCodeDesc: 'Escaneie este código QR para se inscrever no fluxo',
        copyInviteUrl: 'Copiar URL de Convite',
        copyInviteUrlDesc: 'Copie e compartilhe este link de convite',
        copyLink: 'Copiar Link',
        linkCopied: 'Link copiado!',
        linkCopiedToClipboard:
          'O link de convite foi copiado para a área de transferência',
        failedToCopyLink:
          'Falha ao copiar o link. Por favor, copie-o manualmente.',
        enterEmailAddress: 'Digite um endereço de e-mail',
        close: 'Fechar',

        // Delete Confirmation
        deleteFlowTitle: 'Excluir Fluxo',
        deleteFlowMessage:
          'Tem certeza de que deseja excluir o fluxo "{{flowName}}"? Esta ação não pode ser desfeita.',
        confirmDelete: 'Sim, excluir',
        deleting: 'Excluindo...',
        flowDeleted: 'Fluxo excluído com sucesso',
        failedToDeleteFlow: 'Falha ao excluir o fluxo',

        // Builder
        newStep: 'Nova Etapa',
        stepName: 'Nome da Etapa',
        stepDescription: 'Descrição da Etapa',
        saveChanges: 'Salvar Alterações',
        saving: 'Salvando...',
        changesSaved: 'Alterações salvas com sucesso',
        failedToSaveChanges: 'Falha ao salvar as alterações',
        deleteStepTitle: 'Excluir Etapa',
        deleteStepMessage:
          'Tem certeza de que deseja excluir "{{stepName}}"? Isso removerá todas as conexões com esta etapa.',
        stepDeleted: 'Etapa excluída com sucesso',
        failedToDeleteStep: 'Falha ao excluir a etapa',

        // Create Flow Dialog
        createNewFlow: 'Criar Novo Fluxo',
        createFlowFor: 'Criar um novo fluxo de status para {{tenant}}',
        flowNameLabel: 'Nome do Fluxo',
        flowNamePlaceholder: 'Ex: Integração de Clientes',
        flowDescLabel: 'Descrição',
        flowDescPlaceholder: 'Descreva o propósito deste fluxo...',
        createFlow: 'Criar Fluxo',
        creating: 'Criando...',
        flowCreated: 'Fluxo criado com sucesso',
        failedToCreateFlow: 'Falha ao criar o fluxo',
        cancel: 'Cancelar',

        // Status Tracking
        loadingStatusTracking: 'Carregando rastreamento de status...',
        enrollmentNotFound: 'Inscrição não encontrada.',
      },

      members: {
        title: 'Membros',
        invite: 'Convidar Membro',
        role: 'Função',
        owner: 'Proprietário',
        staff: 'Equipe',
        member: 'Membro',
        email: 'E-mail',
        status: 'Status',
        joined: 'Entrou',
        pending: 'Pendente',
        noMembers: 'Ainda não há membros',
        inviteFirst: 'Convide seu primeiro membro para colaborar',

        // Dashboard Card
        manageMembers: 'Gerenciar Membros',
        manageMembersDescription:
          'Convide e gerencie membros da equipe para {{tenant}}',

        // Member Management Page
        memberManagement: 'Gerenciamento de Membros',
        manageTeamMembers: 'Gerenciar membros da equipe e seus papéis',
        managingMembersFor: 'Gerenciando membros para {{tenant}}',
        pleaseSelectOrg:
          'Por favor, selecione uma organização do menu para gerenciar membros.',
        searchMembers: 'Pesquisar membros...',
        loadingMembers: 'Carregando membros...',
        loadError: 'Falha ao carregar membros. Por favor, tente novamente.',
        membersCount: 'Membros ({{count}})',
        inviteMember: 'Convidar Membro',
        emailAddress: 'Endereço de E-mail',
        enterEmailAddress: 'Digite o endereço de e-mail',
        sending: 'Enviando...',
        sendInvite: 'Enviar Convite',
        you: 'Você',
        promote: 'Promover',
        demote: 'Rebaixar',
        remove: 'Remover',
        showingMembers: 'Mostrando {{from}} a {{to}} de {{total}} membros',
        noMembersFound: 'Nenhum Membro Encontrado',
        noMatchingSearch:
          'Nenhum membro corresponde a "{{search}}". Tente ajustar sua pesquisa.',
        noMembersForOrg: 'Nenhum membro encontrado para esta organização.',
        promoteTitle: 'Promover {{member}}?',
        promoteDescription:
          'Isso promoverá {{member}} de {{currentRole}} para {{newRole}}.',
        promoteConfirm: 'Promover para {{role}}',
        demoteTitle: 'Rebaixar {{member}}?',
        demoteDescription:
          'Isso rebaixará {{member}} de {{currentRole}} para {{newRole}}.',
        demoteConfirm: 'Rebaixar para {{role}}',
        removeTitle: 'Remover {{member}}?',
        removeDescription:
          'Isso removerá permanentemente {{member}} da organização. Eles perderão todo acesso imediatamente.',
        removeMember: 'Remover Membro',
        membershipLimitReached:
          'Seu plano atingiu o limite de membros. Por favor, faça upgrade para adicionar mais membros.',
        inviteErrorGeneric: 'Ocorreu um erro. Por favor, tente novamente.',
      },

      customers: {
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
      },

      inbox: {
        title: 'Caixa de Entrada',
        messages: 'Mensagens',
        notifications: 'Notificações',
        unread: 'Não lidas',
        unreadMessages: 'mensagens não lidas',
        markAsRead: 'Marcar como Lida',
        markAllAsRead: 'Marcar Todas como Lidas',
        noMessages: 'Sem mensagens',
        emptyInbox: 'Sua caixa de entrada está vazia',
        statusUpdate: 'Atualização de Status',
        teamInvite: 'Convite de Equipe',
        flowInvite: 'Convite de Fluxo',
        membershipUpdate: 'Atualização de Associação',
        new: 'Nova',
        actionRequired: 'Ação Necessária',
        from: 'De',
        team: 'Equipe',
        flow: 'Fluxo',
        accept: 'Aceitar',
        reject: 'Rejeitar',
        accepted: 'Aceito',
        rejected: 'Rejeitado',
        actionAlreadyTaken: 'Esta ação já foi tomada',
        actionAlreadyTakenTitle: 'Ação Já Tomada',
        loadingMessages: 'Carregando mensagens...',
        failedToLoad: 'Falha ao carregar mensagens',
        loadErrorMessage:
          'Houve um erro ao carregar suas mensagens. Por favor, tente novamente.',
        manageNotifications: 'Gerencie suas notificações e mensagens',
        filterDescription: 'Filtrar mensagens',
        messageType: 'Tipo de Mensagem',
        allTypes: 'Todos os Tipos',
        statusUpdates: 'Atualizações de Status',
        teamInvites: 'Convites de Equipe',
        flowInvites: 'Convites de Fluxo',
        membershipUpdates: 'Atualizações de Associação',
        readStatus: 'Status de Leitura',
        allMessages: 'Todas as Mensagens',
        read: 'Lida',
        noAction: 'Sem Ação',
        perPage: 'Por página',
        marking: 'Marcando...',
        totalMessages: '{{count}} mensagens totais',
        noMessagesFound: 'Nenhuma mensagem encontrada',
        tryAdjustingFilters:
          'Tente ajustar seus filtros para ver mais mensagens.',
        noMessagesAtThisTime: 'Você não tem mensagens no momento.',
        showingMessages: 'Mostrando {{from}} a {{to}} de {{total}} mensagens',
      },

      errors: {
        somethingWentWrong: 'Algo deu errado',
        tryAgain: 'Tentar Novamente',
        pageNotFound: '404 - Página Não Encontrada',
        goHome: 'Ir para Início',
        unauthorized: 'Não Autorizado',
        forbidden: 'Proibido',
        serverError: 'Erro do Servidor',
        networkError: 'Erro de Rede',
        loadingError: 'Falha ao carregar dados',
        errorLoadingEnrollment: 'Erro ao Carregar Inscrição',
        failedToLoadEnrollment: 'Falha ao carregar detalhes da inscrição',
      },

      settings: {
        account: 'Configurações da Conta',
        organization: 'Configurações da Organização',
        profile: 'Perfil',
        security: 'Segurança',
        notifications: 'Notificações',
        billing: 'Faturamento',
        theme: 'Tema',
        language: 'Idioma',
        darkMode: 'Modo Escuro',
        lightMode: 'Modo Claro',
        autoMode: 'Modo Automático',

        // Dashboard Cards
        accountSettings: 'Configurações da Conta',
        organizationSettings: 'Configurações da Organização',
        customizeBranding:
          'Personalize a marca, temas e detalhes da organização',
        manageOrganization: 'Gerenciar Organização',
        managePreferences:
          'Gerencie as configurações e preferências da sua conta',
        manageProfile: 'Gerencie seu perfil, senha e preferências',
        manageAccount: 'Gerenciar Conta',
      },

      account: {
        pleaseSignIn:
          'Por favor, faça login para acessar as configurações da conta.',
        managePreferences:
          'Gerencie as configurações e preferências da sua conta',
        profileInfo: 'Informações do Perfil',
        profileDescription:
          'Atualize suas informações pessoais e dados de contato',
        fullName: 'Nome Completo',
        fullNamePlaceholder: 'Digite seu nome completo',
        emailAddress: 'Endereço de E-mail',
        emailPlaceholder: 'Digite seu endereço de e-mail',
        whatsappPhone: 'Número de Telefone do WhatsApp',
        whatsappHelper: 'Usado para notificações do WhatsApp',
        marketingComms: 'Comunicações de Marketing',
        marketingHelper: 'Receba atualizações sobre novos recursos e melhorias',
        saveProfile: 'Salvar Perfil',
        appearance: 'Aparência',
        appearanceDescription:
          'Personalize como o aplicativo parece e funciona',
        theme: 'Tema',
        selectTheme: 'Selecionar tema',
        light: 'Claro',
        dark: 'Escuro',
        themeHelper: 'Escolha seu esquema de cores preferido',
        accountManagement: 'Gerenciamento de Conta',
        accountManagementDescription:
          'Gerencie a segurança e os dados da sua conta',
        deleteAccount: 'Excluir Conta',
        deleteAccountDescription:
          'Excluir permanentemente sua conta e todos os dados associados.',
        soleOwnerWarning:
          'Aviso: Você é o único proprietário de {{count}} organização(ões). Excluir sua conta também excluirá essas organizações.',
        deleting: 'Excluindo...',
        deleteAccountWarning:
          'Isso excluirá permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.',
        deleteAccountWithOrgs:
          'Excluir sua conta também excluirá as seguintes organizações onde você é o único proprietário:\n\n{{orgs}}\n\nEsta ação não pode ser desfeita.',
      },

      organization: {
        nameRequired: 'O nome da organização é obrigatório',
        failedToCreate: 'Falha ao criar organização',
        createOrganization: 'Criar Organização',
        setupDescription:
          'Configure uma nova organização para gerenciar suas equipes e fluxos de trabalho',
        organizationDetails: 'Detalhes da Organização',
        chooseUniqueName: 'Escolha um nome único para sua organização',
        organizationNameRequired: 'Nome da Organização *',
        namePlaceholder: 'Digite o nome da organização (ex., Acme Corp)',
        nameHelper:
          'Este nome será visível para os membros da sua equipe e clientes',
        creating: 'Criando...',
        whatHappensNext: 'O que acontece a seguir?',
        becomeOwner:
          'Você se tornará automaticamente o proprietário da organização',
        inviteMembers: 'Você pode convidar membros da equipe para colaborar',
        createFlows:
          'Comece a criar fluxos para rastrear atualizações de status',
        subscribeToPlan: 'Assine um plano para desbloquear todos os recursos',
      },

      notifications: {
        title: 'Preferências de Notificação',
        description: 'Gerencie como você recebe notificações',
        loadingPreferences: 'Carregando preferências...',
        failedToLoad: 'Falha ao carregar preferências de notificação.',
        tryRefreshing: 'Por favor, tente atualizar a página.',
        chooseHowNotified:
          'Escolha como deseja ser notificado sobre atualizações importantes',
        emailNotifications: 'Notificações por E-mail',
        enableEmailNotifications: 'Ativar Notificações por E-mail',
        masterToggleEmail:
          'Controle mestre - controla todas as configurações de notificação por e-mail abaixo',
        statusUpdates: 'Atualizações de Status',
        statusUpdatesDescription:
          'Seja notificado quando o status do fluxo mudar',
        invitations: 'Convites',
        invitationsDescription:
          'Seja notificado sobre convites de equipe e fluxo',
        whatsappNotifications: 'Notificações do WhatsApp',
        addWhatsAppNumber:
          'Por favor, adicione um número de telefone do WhatsApp nas configurações do seu perfil para ativar as notificações do WhatsApp.',
        enableWhatsAppNotifications: 'Ativar Notificações do WhatsApp',
        masterToggleWhatsApp:
          'Controle mestre - controla todas as configurações de notificação do WhatsApp abaixo',
        savePreferences: 'Salvar Preferências',
        savedSuccessfully: 'Preferências de notificação salvas com sucesso!',
        failedToSave:
          'Falha ao salvar preferências. Por favor, tente novamente.',
      },

      subscription: {
        free: 'Grátis',
        starter: 'Inicial',
        professional: 'Profissional',
        enterprise: 'Empresarial',
        upgrade: 'Atualizar',
        downgrade: 'Rebaixar',
        manage: 'Gerenciar Assinatura',
        billingPortal: 'Portal de Faturamento',
        currentSubscription: 'Assinatura Atual',
        manageBilling: 'Gerenciar Faturamento',
        startFreeTrial: 'Comece sua Avaliação Gratuita de 7 Dias',
        freeTrialDescription:
          'Experimente qualquer plano sem risco com acesso completo a todos os recursos. Nenhum cartão de crédito será cobrado até depois de 7 dias. Cancele a qualquer momento.',
        planName: {
          adminMode: 'Modo Administrador',
          pendingSetup: 'Configuração Pendente',
          cancelled: 'Cancelado',
          starter: 'Inicial',
          professional: 'Profissional',
          enterprise: 'Empresarial',
        },
        perMonth: 'por mês',
        unlimited: 'ilimitado',
        notActive: 'não ativo',
        inactive: 'inativo',
        features: 'Recursos',
        limitations: 'Limitações',
        currentPlan: 'Plano Atual',
        upgradeToPlan: 'Atualizar para {{plan}}',
        downgradeToPlan: 'Rebaixar para {{plan}}',
        switchToPlan: 'Mudar para {{plan}}',
        confirmPlanUpgrade: 'Confirmar Atualização do Plano',
        confirmPlanDowngrade: 'Confirmar Rebaixamento do Plano',
        upgradeDescription:
          'Você está prestes a atualizar de {{current}} para {{new}}. Sua assinatura será atualizada imediatamente com cobrança proporcional. Você será cobrado pela diferença com base no seu ciclo de cobrança.',
        downgradeDescription:
          'Você está prestes a rebaixar de {{current}} para {{new}}. Sua assinatura será atualizada imediatamente com cobrança proporcional. Você receberá um crédito pelo tempo não utilizado do seu plano atual, que será aplicado ao seu próximo ciclo de cobrança.',
        confirmUpgrade: 'Confirmar Atualização',
        confirmDowngrade: 'Confirmar Rebaixamento',
        ownerOnly:
          'Apenas proprietários da organização podem gerenciar assinaturas. Entre em contato com o proprietário da sua organização para atualizar.',
        loadingSubscription: 'Carregando informações da assinatura...',
        billingInfo: 'Informações de Faturamento',
        freeTrialIncluded:
          'Todas as novas assinaturas incluem uma avaliação gratuita de 7 dias',
        chargedAfterTrial:
          'Você só será cobrado após o término do período de avaliação',
        billedMonthly:
          'As assinaturas são cobradas mensalmente e podem ser canceladas a qualquer momento',
        planChangesImmediate:
          'As alterações de plano entram em vigor imediatamente com cobrança proporcional',
        securePayments:
          'Todos os pagamentos são processados com segurança através do Stripe',
      },

      // Tenant/Organization Pages
      tenant: {
        organizationNotFound: 'Organização Não Encontrada',
        orgNotFoundMessage: 'A organização "{{name}}" não pôde ser encontrada.',
        backToHome: 'Voltar ao Início',
        loading: 'Carregando...',
        contact: 'Contato',
        noActiveFlows: 'Sem Fluxos Ativos',
        noActiveFlowsMessage: 'Você não tem fluxos ativos em {{tenant}}.',
        askAdminToEnroll:
          'Peça ao seu administrador para inscrevê-lo em um fluxo, ou escaneie um convite com código QR.',
        welcomeTo: 'Bem-vindo à {{tenant}}',
        signInToView:
          'Faça login para visualizar seu progresso do fluxo e gerenciar suas inscrições.',
        home: 'Início',
        currentStep: 'Etapa Atual',
        started: 'Iniciado',
        updated: 'Atualizado',
        atStepToday: 'Na etapa: Hoje',
        atStepOneDay: 'Na etapa: 1 dia',
        atStepDays: 'Na etapa: {{days}} dias',
        referenceId: 'ID de Referência',
        nextSteps: 'Próximas Etapas',
        noUpcomingSteps: 'Sem próximas etapas',
        noHistoryYet: 'Sem histórico ainda',
        showingRecent: 'Mostrando {{count}} mais recentes',
      },

      // Invite Landing
      invite: {
        youreInvited: 'Você Está Convidado!',
        joinFlowAt: 'Junte-se a {{flow}} em {{tenant}}',
        invitationSent: 'Convite Enviado!',
        invitationSentTo: 'Enviamos um convite para {{email}}',
        checkYourEmail: 'Verifique seu E-mail',
        receiveInvitation:
          'Você receberá um convite por e-mail para participar de {{flow}} em {{tenant}}',
        clickToAddInbox:
          'Clique abaixo para adicionar este convite à sua caixa de entrada',
        enterEmailToReceive:
          'Digite seu endereço de e-mail para receber um convite para participar deste fluxo',
        signedInAs: 'Conectado como',
        addToMyInbox: 'Adicionar à Minha Caixa de Entrada',
        addingToInbox: 'Adicionando à Caixa de Entrada...',
        sendMeInvitation: 'Enviar-me um Convite',
        sendingInvitation: 'Enviando Convite...',
        inviteAlreadyExists:
          'Um convite já existe. Redirecionando para sua caixa de entrada...',
        inviteAlreadySentEmail:
          'Um convite já foi enviado para este endereço de e-mail. Por favor, verifique seu e-mail ou tente novamente mais tarde.',
        orgLimitReached:
          'Sua organização atingiu seu limite. Por favor, entre em contato com seu administrador.',
        failedToSendInvitation:
          'Falha ao enviar o convite. Por favor, tente novamente.',
        enterEmailAddress: 'Por favor, digite seu endereço de e-mail',
      },

      // Settings - Extended
      'settings.organization': {
        noOrgSelected: 'Nenhuma organização selecionada',
        manageSubscriptionDesc:
          'Gerenciar a assinatura e configurações de faturamento da sua organização',
        resourceUsage: 'Uso de Recursos',
        trackResourceConsumption:
          'Acompanhe o consumo de recursos da sua organização',
        activeCases: 'Casos Ativos',
        unlimitedActiveCases: 'Casos ativos ilimitados no seu plano',
        activeCasesLimitReached:
          'Limite atingido! Não é possível ativar novos casos ou convidar novos clientes.',
        remainingActiveCases: '{{count}} casos ativos restantes',
        teamMembers: 'Membros da Equipe',
        unlimitedTeamMembers: 'Membros da equipe ilimitados no seu plano',
        teamMembersLimitReached:
          'Limite atingido! Não é possível convidar novos membros da equipe.',
        remainingTeamMembers: '{{count}} membro(s) da equipe restante(s)',
        usageThisMonth: 'Uso Este Mês',
        statusUpdates: 'Atualizações de Status',
        overageAlert: 'Alerta de Excesso',
        overageMessage:
          'Você usou {{count}} atualizações de status extras. Custo adicional: €{{cost}} (€0.05 por atualização)',
        overageCostInfo:
          'Se você exceder seu limite, atualizações adicionais custam €0.05 cada',
        billingPeriodStarted: 'Período de faturamento iniciado',
        organizationInfo: 'Informações da Organização',
        basicInfo: 'Informações básicas sobre sua organização',
        organizationName: 'Nome da Organização',
        organizationNamePlaceholder: 'Digite o nome da organização',
        organizationNameHelper:
          'Este nome aparecerá na página pública da sua organização',
        organizationDescription: 'Descrição da Organização',
        organizationDescriptionPlaceholder:
          'Descreva sua organização, sua missão e o que os visitantes podem esperar...',
        organizationDescriptionHelper:
          'Esta descrição aparecerá na página pública da sua organização',
        contactPhone: 'Telefone de Contato',
        contactPhoneHelper: 'Número de telefone para consultas de contato',
        contactEmail: 'E-mail de Contato',
        contactEmailHelper: 'Endereço de e-mail para consultas de contato',
        saveOrgInfo: 'Salvar Informações da Organização',
        themeColors: 'Cores do Tema',
        customizeColors:
          'Personalize as cores usadas na página pública da sua organização',
        primaryColor: 'Cor Primária (Fundo)',
        accentColor: 'Cor de Destaque (Emblemas e Destaques)',
        textColor: 'Cor do Texto',
        livePreview: 'Visualização ao Vivo',
        previewDescription:
          'Visualização de como as cores aparecem na sua página',
        saveThemeColors: 'Salvar Cores do Tema',
        organizationLogo: 'Logo da Organização',
        uploadLogoDescription:
          'Faça upload de um logo para exibir na página pública da sua organização',
        logoFile: 'Arquivo de Logo',
        logoFileHelper:
          'Faça upload de um arquivo de imagem (PNG, JPG, GIF). Tamanho máximo: 5MB. Recomendado: 200x200px ou maior.',
        logoPreview: 'Visualização do Logo',
        noLogo: 'Sem logo',
        logoSuccess: 'Logo {{action}} com sucesso!',
        uploaded: 'enviado',
        deleted: 'excluído',
        uploading: 'Enviando...',
        uploadLogo: 'Enviar Logo',
        deleting: 'Excluindo...',
        deleteLogo: 'Excluir Logo',
        previewAndTest: 'Visualizar e Testar',
        seeHowPageLooks:
          'Veja como a página da sua organização aparece para os visitantes',
        viewPublicPage: 'Ver Página Pública',
        dangerZone: 'Zona de Perigo',
        irreversibleActions: 'Ações irreversíveis para esta organização',
        leaveOrganization: 'Sair da Organização',
        leaveOrganizationOwnerWarning:
          'Como proprietário, sair pode excluir a organização se você for o único proprietário.',
        leaveOrganizationWarning:
          'Você perderá o acesso a todos os dados e não poderá voltar a participar sem um novo convite.',
        leaving: 'Saindo...',
      },
    },
  },
  de: {
    translation: {
      // Common
      common: {
        loading: 'Lädt...',
        error: 'Fehler',
        success: 'Erfolg',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        create: 'Erstellen',
        search: 'Suchen',
        filter: 'Filtern',
        sort: 'Sortieren',
        actions: 'Aktionen',
        back: 'Zurück',
        next: 'Weiter',
        previous: 'Zurück',
        submit: 'Absenden',
        close: 'Schließen',
        status: 'Status',
      },

      // Navigation
      nav: {
        home: 'Startseite',
        dashboard: 'Dashboard',
        flows: 'Flows',
        members: 'Mitglieder',
        customers: 'Kunden',
        inbox: 'Posteingang',
        account: 'Kontoeinstellungen',
        organization: 'Organisationseinstellungen',
        signIn: 'Anmelden',
        signUp: 'Registrieren',
        signOut: 'Abmelden',
      },

      // Authentication
      auth: {
        // Sign In
        signIn: 'Anmelden',
        signInTitle: 'Anmelden',
        signInDescription:
          'Geben Sie Ihre Anmeldedaten ein, um auf Ihr Konto zuzugreifen',
        signInButton: 'Anmelden',
        signingIn: 'Wird angemeldet...',

        // Sign Up
        signUp: 'Registrieren',
        signUpTitle: 'Konto erstellen',
        signUpDescription:
          'Registrieren Sie sich für ein neues Konto, um loszulegen',
        signUpButton: 'Registrieren',
        signingUp: 'Wird registriert...',
        creatingAccount: 'Konto wird erstellt...',

        // Form Fields
        email: 'E-Mail',
        emailAddress: 'E-Mail-Adresse',
        password: 'Passwort',
        confirmPassword: 'Passwort bestätigen',
        name: 'Name',
        fullName: 'Vollständiger Name',

        // Placeholders
        emailPlaceholder: 'Geben Sie Ihre E-Mail ein',
        passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
        confirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
        namePlaceholder: 'Geben Sie Ihren vollständigen Namen ein',

        // Messages & Validation
        fillAllFields: 'Bitte füllen Sie alle Felder aus',
        loginFailed: 'Anmeldung fehlgeschlagen',
        accountCreated: 'Konto erfolgreich erstellt!',
        accountCreatedCanSignIn:
          'Konto erfolgreich erstellt! Sie können sich jetzt mit Ihrem neuen Konto anmelden.',
        checkEmail:
          'Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu bestätigen',
        invalidCredentials: 'Ungültige E-Mail oder Passwort',
        emailInUse: 'E-Mail wird bereits verwendet',
        weakPassword: 'Passwort ist zu schwach',
        passwordMismatch: 'Passwörter stimmen nicht überein',
        passwordMinLength: 'Passwort muss mindestens 8 Zeichen lang sein',
        pleaseLogin: 'Bitte melden Sie sich an, um Ihr Dashboard anzuzeigen.',

        // Links
        forgotPassword: 'Passwort vergessen?',
        resetPassword: 'Passwort zurücksetzen',
        dontHaveAccount: 'Sie haben noch kein Konto?',
        alreadyHaveAccount: 'Sie haben bereits ein Konto?',
        signOut: 'Abmelden',

        // Forgot Password
        forgotPasswordTitle: 'Passwort zurücksetzen',
        forgotPasswordDescription:
          'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts',
        sendResetLink: 'Zurücksetzungslink senden',
        sending: 'Wird gesendet...',
        emailSent: 'E-Mail gesendet!',
        checkInbox:
          'Überprüfen Sie Ihren Posteingang für Anweisungen zum Zurücksetzen des Passworts',
        resetLinkSentTo:
          'Wir haben einen Passwort-Zurücksetzungslink gesendet an',
        didntReceiveEmail:
          'Haben Sie die E-Mail nicht erhalten? Überprüfen Sie Ihren Spam-Ordner oder versuchen Sie es erneut.',
        tryAgain: 'Erneut versuchen',
        backToSignIn: 'Zurück zur Anmeldung',
        rememberPassword: 'Erinnern Sie sich an Ihr Passwort? Anmelden',
        needNewAccount: 'Benötigen Sie ein neues Konto?',
        failedToSendReset: 'Fehler beim Senden der Zurücksetzungs-E-Mail',
        enterEmailAddress: 'Bitte geben Sie Ihre E-Mail-Adresse ein',

        // Email Confirmation
        checkYourEmail: 'Überprüfen Sie Ihre E-Mail',
        confirmYourEmail: 'Bestätigen Sie Ihre E-Mail',
        sendingConfirmation: 'Wir senden eine Bestätigungs-E-Mail an {{email}}',
        enterEmailForConfirmation:
          'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen neuen Bestätigungslink',
        failedToResendConfirmation:
          'Fehler beim erneuten Senden der Bestätigungs-E-Mail',
        confirmationEmailSent: 'Bestätigungs-E-Mail gesendet!',
        checkInboxForConfirmation:
          'Überprüfen Sie Ihren Posteingang für den Bestätigungslink',
        sentNewConfirmationTo:
          'Wir haben eine neue Bestätigungs-E-Mail gesendet an',
        clickConfirmationLink:
          'Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren.',
        sendAnotherEmail: 'Eine weitere E-Mail senden',
        sendConfirmationEmail: 'Bestätigungs-E-Mail senden',
        alreadyConfirmed: 'Bereits bestätigt? Anmelden',

        // Email Confirmation Status
        confirmingEmail: 'E-Mail wird bestätigt...',
        emailConfirmed: 'E-Mail bestätigt!',
        confirmationFailed: 'Bestätigung fehlgeschlagen',
        pleaseWaitConfirming:
          'Bitte warten Sie, während wir Ihre E-Mail-Adresse bestätigen.',
        emailConfirmedSuccess:
          'Ihre E-Mail wurde erfolgreich bestätigt. Sie können sich jetzt bei Ihrem Konto anmelden.',
        unableToConfirm: 'Wir konnten Ihre E-Mail-Adresse nicht bestätigen.',
        confirmationLinkInvalid:
          'Fehler beim Bestätigen der E-Mail. Der Link ist möglicherweise ungültig oder abgelaufen.',
        noConfirmationToken: 'Kein Bestätigungstoken bereitgestellt.',
        redirectingToSignIn: 'Weiterleitung zur Anmeldeseite in 3 Sekunden...',
        continueToSignIn: 'Weiter zur Anmeldung',
        goToSignIn: 'Zur Anmeldung',
        signUpAgain: 'Erneut registrieren',

        // Invite Context
        invitedToEnroll:
          'Sie wurden eingeladen, sich in {{flowName}} einzuschreiben',
        signingInToJoin:
          'Sie melden sich an, um {{flowName}} bei {{tenantName}} beizutreten',
        emailLockedFromInvite: 'E-Mail aus Einladung gesperrt',

        // WhatsApp
        whatsappNumber: 'WhatsApp-Telefonnummer (Optional)',
        whatsappHelper:
          'Optional - Fügen Sie Ihre WhatsApp-Nummer hinzu, um Benachrichtigungen zu erhalten',

        // Opt-ins
        agreeToReceiveUpdates:
          'Ich stimme zu, Updates/E-Mails von dieser App zu erhalten',

        // Validation
        validatingInvite: 'Einladung wird validiert...',
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        welcome: 'Willkommen zurück, {{name}}!',
        organizations: 'Organisationen',
        createOrganization: 'Organisation erstellen',
        noOrganizations: 'Noch keine Organisationen',
        recentActivity: 'Kürzliche Aktivität',
        quickActions: 'Schnellaktionen',

        // Management Mode
        managementMode: 'Verwaltungsmodus',
        managingAs: 'Verwalte {{tenant}} als {{role}}',
        leaving: 'Wird verlassen...',
        leaveOrganization: 'Organisation verlassen',
        managementTools: 'Verwaltungstools',

        // Organization Creation
        createFirstOrg: 'Erstellen Sie Ihre erste Organisation',
        getStarted:
          'Legen Sie los, indem Sie eine Organisation erstellen, um Flows und Teams zu verwalten',

        // Organization Cards
        yourOrganizations: 'Ihre Organisationen',
        allOrganizations: 'Alle',
        activeFlows: 'Aktive Flows',
        recent: 'Kürzlich',
        moreFlows: '+{{count}} weitere',
        viewOrganization: 'Organisation anzeigen',

        // Empty States
        noAccess: 'Sie haben noch keinen Zugriff auf Organisationen',
        contactAdmin:
          'Kontaktieren Sie einen Administrator, um zu einer Organisation eingeladen zu werden',

        // Subscription Warnings
        completeSubscription: 'Vervollständigen Sie Ihr Abonnement',
        subscriptionCancelled: 'Abonnement Gekündigt',
        subscribeToStart:
          'Abonnieren Sie, um StatusAtFront zu nutzen und alle Verwaltungsfunktionen freizuschalten.',
        subscriptionCancelledDescription:
          'Ihr Abonnement wurde gekündigt. Reaktivieren Sie es, um Flows, Mitglieder und Kunden weiter zu verwalten.',

        // Selection Warnings
        selectOrganization: 'Organisation zum Verwalten Auswählen',
        selectOrganizationDescription:
          'Wählen Sie eine Organisation aus dem Hamburger-Menü, um auf Verwaltungsfunktionen wie Flows, Mitglieder und Einstellungen zuzugreifen.',

        // Dividers
        managementVsEnrollment: 'Verwaltung vs Einschreibung',
      },

      // Flows
      flows: {
        // Basic
        title: 'Flows',
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
        manageFlowsDescription:
          'Status-Flows für {{tenant}} erstellen und verwalten',

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
        failedToLoad:
          'Fehler beim Laden der Flows. Bitte versuchen Sie es erneut.',
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
        inviteOthersTo:
          'Laden Sie andere ein, sich in {{flowName}} einzuschreiben',
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
        mobileTipPrint:
          'Mobiler Tipp: Verwenden Sie die Kamera-App Ihres Telefons.',

        // Errors
        planLimitReached:
          'Ihr Plan hat sein Limit erreicht. Bitte upgraden Sie, um weitere Benutzer einzuladen.',
        errorOccurred:
          'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',

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
        flowNameHelper:
          'Wählen Sie einen beschreibenden Namen für Ihren Status-Flow',
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
      },

      // Members
      members: {
        title: 'Mitglieder',
        invite: 'Mitglied einladen',
        role: 'Rolle',
        owner: 'Eigentümer',
        staff: 'Personal',
        member: 'Mitglied',
        email: 'E-Mail',
        status: 'Status',
        joined: 'Beigetreten',
        pending: 'Ausstehend',
        noMembers: 'Noch keine Mitglieder',
        inviteFirst: 'Laden Sie Ihr erstes Mitglied zur Zusammenarbeit ein',

        // Dashboard Card
        manageMembers: 'Mitglieder verwalten',
        manageMembersDescription:
          'Teammitglieder für {{tenant}} einladen und verwalten',

        // Member Management Page
        memberManagement: 'Mitgliederverwaltung',
        manageTeamMembers: 'Teammitglieder und ihre Rollen verwalten',
        managingMembersFor: 'Mitglieder verwalten für {{tenant}}',
        pleaseSelectOrg:
          'Bitte wählen Sie eine Organisation aus dem Menü, um Mitglieder zu verwalten.',
        searchMembers: 'Mitglieder suchen...',
        loadingMembers: 'Lade Mitglieder...',
        loadError:
          'Fehler beim Laden der Mitglieder. Bitte versuchen Sie es erneut.',
        membersCount: 'Mitglieder ({{count}})',
        inviteMember: 'Mitglied einladen',
        emailAddress: 'E-Mail-Adresse',
        enterEmailAddress: 'E-Mail-Adresse eingeben',
        sending: 'Sende...',
        sendInvite: 'Einladung senden',
        you: 'Sie',
        promote: 'Befördern',
        demote: 'Degradieren',
        remove: 'Entfernen',
        showingMembers: 'Zeige {{from}} bis {{to}} von {{total}} Mitgliedern',
        noMembersFound: 'Keine Mitglieder gefunden',
        noMatchingSearch:
          'Keine Mitglieder entsprechen "{{search}}". Versuchen Sie, Ihre Suche anzupassen.',
        noMembersForOrg: 'Keine Mitglieder für diese Organisation gefunden.',
        promoteTitle: '{{member}} befördern?',
        promoteDescription:
          'Dies befördert {{member}} von {{currentRole}} zu {{newRole}}.',
        promoteConfirm: 'Befördern zu {{role}}',
        demoteTitle: '{{member}} degradieren?',
        demoteDescription:
          'Dies degradiert {{member}} von {{currentRole}} zu {{newRole}}.',
        demoteConfirm: 'Degradieren zu {{role}}',
        removeTitle: '{{member}} entfernen?',
        removeDescription:
          'Dies entfernt {{member}} dauerhaft aus der Organisation. Sie verlieren sofort den gesamten Zugriff.',
        removeMember: 'Mitglied entfernen',
        membershipLimitReached:
          'Ihr Plan hat das Mitgliederlimit erreicht. Bitte führen Sie ein Upgrade durch, um weitere Mitglieder hinzuzufügen.',
        inviteErrorGeneric:
          'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      },

      // Customers
      customers: {
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
        noAvailableTransitions:
          'Keine verfügbaren Übergänge vom aktuellen Schritt.',
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
        manageEnrollments:
          'Kundeneinschreibungen und Status-Tracking verwalten',
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
        loadError:
          'Fehler beim Laden der Kunden. Bitte versuchen Sie es erneut.',
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
      },

      // Inbox
      inbox: {
        title: 'Posteingang',
        messages: 'Nachrichten',
        notifications: 'Benachrichtigungen',
        unread: 'Ungelesen',
        unreadMessages: 'ungelesene Nachrichten',
        markAsRead: 'Als gelesen markieren',
        markAllAsRead: 'Alle als gelesen markieren',
        noMessages: 'Keine Nachrichten',
        emptyInbox: 'Ihr Posteingang ist leer',
        statusUpdate: 'Statusaktualisierung',
        teamInvite: 'Team-Einladung',
        flowInvite: 'Flow-Einladung',
        membershipUpdate: 'Mitgliedschaftsaktualisierung',
        new: 'Neu',
        actionRequired: 'Aktion erforderlich',
        from: 'Von',
        team: 'Team',
        flow: 'Flow',
        accept: 'Akzeptieren',
        reject: 'Ablehnen',
        accepted: 'Akzeptiert',
        rejected: 'Abgelehnt',
        actionAlreadyTaken: 'Diese Aktion wurde bereits durchgeführt',
        actionAlreadyTakenTitle: 'Aktion bereits durchgeführt',
        loadingMessages: 'Nachrichten werden geladen...',
        failedToLoad: 'Fehler beim Laden der Nachrichten',
        loadErrorMessage:
          'Beim Laden Ihrer Nachrichten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        manageNotifications:
          'Verwalten Sie Ihre Benachrichtigungen und Nachrichten',
        filterDescription: 'Nachrichten filtern',
        messageType: 'Nachrichtentyp',
        allTypes: 'Alle Typen',
        statusUpdates: 'Statusaktualisierungen',
        teamInvites: 'Team-Einladungen',
        flowInvites: 'Flow-Einladungen',
        membershipUpdates: 'Mitgliedschaftsaktualisierungen',
        readStatus: 'Lesestatus',
        allMessages: 'Alle Nachrichten',
        read: 'Gelesen',
        noAction: 'Keine Aktion',
        perPage: 'Pro Seite',
        marking: 'Markiere...',
        totalMessages: '{{count}} Nachrichten insgesamt',
        noMessagesFound: 'Keine Nachrichten gefunden',
        tryAdjustingFilters:
          'Versuchen Sie, Ihre Filter anzupassen, um mehr Nachrichten zu sehen.',
        noMessagesAtThisTime: 'Sie haben derzeit keine Nachrichten.',
        showingMessages: 'Zeige {{from}} bis {{to}} von {{total}} Nachrichten',
      },

      // Errors
      errors: {
        somethingWentWrong: 'Etwas ist schief gelaufen',
        tryAgain: 'Erneut versuchen',
        pageNotFound: '404 - Seite nicht gefunden',
        goHome: 'Zur Startseite',
        unauthorized: 'Nicht autorisiert',
        forbidden: 'Verboten',
        serverError: 'Serverfehler',
        networkError: 'Netzwerkfehler',
        loadingError: 'Fehler beim Laden der Daten',
        errorLoadingEnrollment: 'Fehler beim Laden der Einschreibung',
        failedToLoadEnrollment: 'Fehler beim Laden der Einschreibungsdetails',
      },

      // Settings
      settings: {
        account: 'Kontoeinstellungen',
        organization: 'Organisationseinstellungen',
        profile: 'Profil',
        security: 'Sicherheit',
        notifications: 'Benachrichtigungen',
        billing: 'Abrechnung',
        theme: 'Thema',
        language: 'Sprache',
        darkMode: 'Dunkler Modus',
        lightMode: 'Heller Modus',
        autoMode: 'Automatischer Modus',

        // Dashboard Cards
        accountSettings: 'Kontoeinstellungen',
        organizationSettings: 'Organisationseinstellungen',
        customizeBranding: 'Branding, Themen und Organisationsdetails anpassen',
        manageOrganization: 'Organisation verwalten',
        managePreferences:
          'Verwalten Sie Ihre Kontoeinstellungen und -präferenzen',
        manageProfile: 'Verwalten Sie Ihr Profil, Passwort und Präferenzen',
        manageAccount: 'Konto verwalten',
      },

      account: {
        pleaseSignIn:
          'Bitte melden Sie sich an, um auf die Kontoeinstellungen zuzugreifen.',
        managePreferences:
          'Verwalten Sie Ihre Kontoeinstellungen und -präferenzen',
        profileInfo: 'Profilinformationen',
        profileDescription:
          'Aktualisieren Sie Ihre persönlichen Informationen und Kontaktdaten',
        fullName: 'Vollständiger Name',
        fullNamePlaceholder: 'Geben Sie Ihren vollständigen Namen ein',
        emailAddress: 'E-Mail-Adresse',
        emailPlaceholder: 'Geben Sie Ihre E-Mail-Adresse ein',
        whatsappPhone: 'WhatsApp-Telefonnummer',
        whatsappHelper: 'Wird für WhatsApp-Benachrichtigungen verwendet',
        marketingComms: 'Marketing-Kommunikation',
        marketingHelper:
          'Erhalten Sie Updates über neue Funktionen und Verbesserungen',
        saveProfile: 'Profil speichern',
        appearance: 'Erscheinungsbild',
        appearanceDescription:
          'Passen Sie an, wie die Anwendung aussieht und sich anfühlt',
        theme: 'Thema',
        selectTheme: 'Thema auswählen',
        light: 'Hell',
        dark: 'Dunkel',
        themeHelper: 'Wählen Sie Ihr bevorzugtes Farbschema',
        accountManagement: 'Kontoverwaltung',
        accountManagementDescription:
          'Verwalten Sie die Sicherheit und Daten Ihres Kontos',
        deleteAccount: 'Konto löschen',
        deleteAccountDescription:
          'Löschen Sie dauerhaft Ihr Konto und alle zugehörigen Daten.',
        soleOwnerWarning:
          'Warnung: Sie sind der alleinige Eigentümer von {{count}} Organisation(en). Das Löschen Ihres Kontos löscht auch diese Organisationen.',
        deleting: 'Wird gelöscht...',
        deleteAccountWarning:
          'Dies wird Ihr Konto und alle zugehörigen Daten dauerhaft löschen. Diese Aktion kann nicht rückgängig gemacht werden.',
        deleteAccountWithOrgs:
          'Das Löschen Ihres Kontos löscht auch die folgenden Organisationen, bei denen Sie der alleinige Eigentümer sind:\n\n{{orgs}}\n\nDiese Aktion kann nicht rückgängig gemacht werden.',
      },

      organization: {
        nameRequired: 'Organisationsname ist erforderlich',
        failedToCreate: 'Fehler beim Erstellen der Organisation',
        createOrganization: 'Organisation erstellen',
        setupDescription:
          'Richten Sie eine neue Organisation ein, um Ihre Teams und Workflows zu verwalten',
        organizationDetails: 'Organisationsdetails',
        chooseUniqueName:
          'Wählen Sie einen eindeutigen Namen für Ihre Organisation',
        organizationNameRequired: 'Organisationsname *',
        namePlaceholder:
          'Geben Sie den Organisationsnamen ein (z.B. Acme Corp)',
        nameHelper:
          'Dieser Name ist für Ihre Teammitglieder und Kunden sichtbar',
        creating: 'Wird erstellt...',
        whatHappensNext: 'Was passiert als Nächstes?',
        becomeOwner: 'Sie werden automatisch Eigentümer der Organisation',
        inviteMembers: 'Sie können Teammitglieder zur Zusammenarbeit einladen',
        createFlows:
          'Beginnen Sie mit dem Erstellen von Flows, um Statusaktualisierungen zu verfolgen',
        subscribeToPlan:
          'Abonnieren Sie einen Plan, um alle Funktionen freizuschalten',
      },

      notifications: {
        title: 'Benachrichtigungseinstellungen',
        description: 'Verwalten Sie, wie Sie Benachrichtigungen erhalten',
        loadingPreferences: 'Einstellungen werden geladen...',
        failedToLoad: 'Fehler beim Laden der Benachrichtigungseinstellungen.',
        tryRefreshing: 'Bitte versuchen Sie, die Seite zu aktualisieren.',
        chooseHowNotified:
          'Wählen Sie, wie Sie über wichtige Updates benachrichtigt werden möchten',
        emailNotifications: 'E-Mail-Benachrichtigungen',
        enableEmailNotifications: 'E-Mail-Benachrichtigungen aktivieren',
        masterToggleEmail:
          'Hauptschalter - steuert alle E-Mail-Benachrichtigungseinstellungen unten',
        statusUpdates: 'Statusaktualisierungen',
        statusUpdatesDescription:
          'Benachrichtigt werden, wenn sich der Flow-Status ändert',
        invitations: 'Einladungen',
        invitationsDescription:
          'Benachrichtigt werden über Team- und Flow-Einladungen',
        whatsappNotifications: 'WhatsApp-Benachrichtigungen',
        addWhatsAppNumber:
          'Bitte fügen Sie eine WhatsApp-Telefonnummer in Ihren Profileinstellungen hinzu, um WhatsApp-Benachrichtigungen zu aktivieren.',
        enableWhatsAppNotifications: 'WhatsApp-Benachrichtigungen aktivieren',
        masterToggleWhatsApp:
          'Hauptschalter - steuert alle WhatsApp-Benachrichtigungseinstellungen unten',
        savePreferences: 'Einstellungen speichern',
        savedSuccessfully:
          'Benachrichtigungseinstellungen erfolgreich gespeichert!',
        failedToSave:
          'Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.',
      },

      // Subscription
      subscription: {
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
      },

      // Tenant/Organization Pages
      tenant: {
        organizationNotFound: 'Organisation nicht gefunden',
        orgNotFoundMessage:
          'Die Organisation "{{name}}" konnte nicht gefunden werden.',
        backToHome: 'Zurück zur Startseite',
        loading: 'Lädt...',
        contact: 'Kontakt',
        noActiveFlows: 'Keine aktiven Flows',
        noActiveFlowsMessage: 'Sie haben keine aktiven Flows in {{tenant}}.',
        askAdminToEnroll:
          'Bitten Sie Ihren Administrator, Sie in einen Flow einzuschreiben, oder scannen Sie eine QR-Code-Einladung.',
        welcomeTo: 'Willkommen bei {{tenant}}',
        signInToView:
          'Melden Sie sich an, um Ihren Flow-Fortschritt anzuzeigen und Ihre Einschreibungen zu verwalten.',
        home: 'Startseite',
        currentStep: 'Aktueller Schritt',
        started: 'Gestartet',
        updated: 'Aktualisiert',
        atStepToday: 'Beim Schritt: Heute',
        atStepOneDay: 'Beim Schritt: 1 Tag',
        atStepDays: 'Beim Schritt: {{days}} Tage',
        referenceId: 'Referenz-ID',
        nextSteps: 'Nächste Schritte',
        noUpcomingSteps: 'Keine bevorstehenden Schritte',
        noHistoryYet: 'Noch kein Verlauf',
        showingRecent: 'Zeige {{count}} neueste',
      },

      // Invite Landing
      invite: {
        youreInvited: 'Sie sind eingeladen!',
        joinFlowAt: '{{flow}} bei {{tenant}} beitreten',
        invitationSent: 'Einladung gesendet!',
        invitationSentTo: 'Wir haben eine Einladung an {{email}} gesendet',
        checkYourEmail: 'Überprüfen Sie Ihre E-Mail',
        receiveInvitation:
          'Sie erhalten eine E-Mail-Einladung, um {{flow}} bei {{tenant}} beizutreten',
        clickToAddInbox:
          'Klicken Sie unten, um diese Einladung zu Ihrem Posteingang hinzuzufügen',
        enterEmailToReceive:
          'Geben Sie Ihre E-Mail-Adresse ein, um eine Einladung für diesen Flow zu erhalten',
        signedInAs: 'Angemeldet als',
        addToMyInbox: 'Zu meinem Posteingang hinzufügen',
        addingToInbox: 'Wird zum Posteingang hinzugefügt...',
        sendMeInvitation: 'Senden Sie mir eine Einladung',
        sendingInvitation: 'Einladung wird gesendet...',
        inviteAlreadyExists:
          'Eine Einladung existiert bereits. Weiterleitung zu Ihrem Posteingang...',
        inviteAlreadySentEmail:
          'Eine Einladung wurde bereits an diese E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihre E-Mail oder versuchen Sie es später erneut.',
        orgLimitReached:
          'Ihre Organisation hat ihr Limit erreicht. Bitte kontaktieren Sie Ihren Administrator.',
        failedToSendInvitation:
          'Fehler beim Senden der Einladung. Bitte versuchen Sie es erneut.',
        enterEmailAddress: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
      },

      // Settings - Extended
      'settings.organization': {
        noOrgSelected: 'Keine Organisation ausgewählt',
        manageSubscriptionDesc:
          'Abonnement- und Abrechnungseinstellungen Ihrer Organisation verwalten',
        resourceUsage: 'Ressourcennutzung',
        trackResourceConsumption:
          'Verfolgen Sie den Ressourcenverbrauch Ihrer Organisation',
        activeCases: 'Aktive Fälle',
        unlimitedActiveCases: 'Unbegrenzte aktive Fälle in Ihrem Plan',
        activeCasesLimitReached:
          'Limit erreicht! Keine neuen Fälle aktivieren oder neue Kunden einladen möglich.',
        remainingActiveCases: '{{count}} verbleibende aktive Fälle',
        teamMembers: 'Teammitglieder',
        unlimitedTeamMembers: 'Unbegrenzte Teammitglieder in Ihrem Plan',
        teamMembersLimitReached:
          'Limit erreicht! Keine neuen Teammitglieder einladen möglich.',
        remainingTeamMembers: '{{count}} verbleibende(s) Teammitglied(er)',
        usageThisMonth: 'Nutzung diesen Monat',
        statusUpdates: 'Status-Updates',
        overageAlert: 'Überschreitungswarnung',
        overageMessage:
          'Sie haben {{count}} zusätzliche Status-Updates verwendet. Zusätzliche Kosten: €{{cost}} (€0.05 pro Update)',
        overageCostInfo:
          'Bei Überschreitung Ihres Limits kosten zusätzliche Updates jeweils €0.05',
        billingPeriodStarted: 'Abrechnungszeitraum begonnen',
        organizationInfo: 'Organisationsinformationen',
        basicInfo: 'Grundlegende Informationen über Ihre Organisation',
        organizationName: 'Organisationsname',
        organizationNamePlaceholder: 'Organisationsnamen eingeben',
        organizationNameHelper:
          'Dieser Name wird auf Ihrer öffentlichen Organisationsseite angezeigt',
        organizationDescription: 'Organisationsbeschreibung',
        organizationDescriptionPlaceholder:
          'Beschreiben Sie Ihre Organisation, ihre Mission und was Besucher erwarten können...',
        organizationDescriptionHelper:
          'Diese Beschreibung wird auf Ihrer öffentlichen Organisationsseite angezeigt',
        contactPhone: 'Kontakttelefon',
        contactPhoneHelper: 'Telefonnummer für Kontaktanfragen',
        contactEmail: 'Kontakt-E-Mail',
        contactEmailHelper: 'E-Mail-Adresse für Kontaktanfragen',
        saveOrgInfo: 'Organisationsinformationen speichern',
        themeColors: 'Themenfarben',
        customizeColors:
          'Passen Sie die Farben auf der öffentlichen Seite Ihrer Organisation an',
        primaryColor: 'Primärfarbe (Hintergrund)',
        accentColor: 'Akzentfarbe (Abzeichen & Hervorhebungen)',
        textColor: 'Textfarbe',
        livePreview: 'Live-Vorschau',
        previewDescription: 'Vorschau, wie Farben auf Ihrer Seite erscheinen',
        saveThemeColors: 'Themenfarben speichern',
        organizationLogo: 'Organisationslogo',
        uploadLogoDescription:
          'Laden Sie ein Logo hoch, das auf der öffentlichen Seite Ihrer Organisation angezeigt wird',
        logoFile: 'Logo-Datei',
        logoFileHelper:
          'Laden Sie eine Bilddatei hoch (PNG, JPG, GIF). Maximale Größe: 5MB. Empfohlen: 200x200px oder größer.',
        logoPreview: 'Logo-Vorschau',
        noLogo: 'Kein Logo',
        logoSuccess: 'Logo {{action}} erfolgreich!',
        uploaded: 'hochgeladen',
        deleted: 'gelöscht',
        uploading: 'Wird hochgeladen...',
        uploadLogo: 'Logo hochladen',
        deleting: 'Wird gelöscht...',
        deleteLogo: 'Logo löschen',
        previewAndTest: 'Vorschau & Test',
        seeHowPageLooks:
          'Sehen Sie, wie Ihre Organisationsseite für Besucher aussieht',
        viewPublicPage: 'Öffentliche Seite anzeigen',
        dangerZone: 'Gefahrenzone',
        irreversibleActions: 'Unwiderrufliche Aktionen für diese Organisation',
        leaveOrganization: 'Organisation verlassen',
        leaveOrganizationOwnerWarning:
          'Als Eigentümer kann das Verlassen die Organisation löschen, wenn Sie der einzige Eigentümer sind.',
        leaveOrganizationWarning:
          'Sie verlieren den Zugriff auf alle Daten und können nicht ohne neue Einladung wieder beitreten.',
        leaving: 'Verlässt...',
      },
    },
  },
  fr: {
    translation: {
      // Common
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        create: 'Créer',
        search: 'Rechercher',
        filter: 'Filtrer',
        sort: 'Trier',
        actions: 'Actions',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        close: 'Fermer',
        status: 'Statut',
      },

      // Navigation
      nav: {
        home: 'Accueil',
        dashboard: 'Tableau de Bord',
        flows: 'Flux',
        members: 'Membres',
        customers: 'Clients',
        inbox: 'Boîte de Réception',
        account: 'Paramètres du Compte',
        organization: "Paramètres de l'Organisation",
        signIn: 'Se Connecter',
        signUp: "S'Inscrire",
        signOut: 'Se Déconnecter',
      },

      // Authentication
      auth: {
        // Sign In
        signIn: 'Se Connecter',
        signInTitle: 'Se Connecter',
        signInDescription:
          'Entrez vos identifiants pour accéder à votre compte',
        signInButton: 'Se Connecter',
        signingIn: 'Connexion...',

        // Sign Up
        signUp: "S'Inscrire",
        signUpTitle: 'Créer un Compte',
        signUpDescription:
          'Inscrivez-vous pour un nouveau compte pour commencer',
        signUpButton: "S'Inscrire",
        signingUp: 'Inscription...',
        creatingAccount: 'Création du compte...',

        // Form Fields
        email: 'E-mail',
        emailAddress: 'Adresse E-mail',
        password: 'Mot de Passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        name: 'Nom',
        fullName: 'Nom Complet',

        // Placeholders
        emailPlaceholder: 'Entrez votre e-mail',
        passwordPlaceholder: 'Entrez votre mot de passe',
        confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
        namePlaceholder: 'Entrez votre nom complet',

        // Messages & Validation
        fillAllFields: 'Veuillez remplir tous les champs',
        loginFailed: 'Échec de la connexion',
        accountCreated: 'Compte créé avec succès!',
        accountCreatedCanSignIn:
          'Compte créé avec succès! Vous pouvez maintenant vous connecter avec votre nouveau compte.',
        checkEmail:
          'Veuillez vérifier votre e-mail pour confirmer votre compte',
        invalidCredentials: 'E-mail ou mot de passe invalide',
        emailInUse: 'E-mail déjà utilisé',
        weakPassword: 'Le mot de passe est trop faible',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordMinLength:
          'Le mot de passe doit contenir au moins 8 caractères',
        pleaseLogin: 'Veuillez vous connecter pour voir votre tableau de bord.',

        // Links
        forgotPassword: 'Mot de passe oublié?',
        resetPassword: 'Réinitialiser le Mot de Passe',
        dontHaveAccount: "Vous n'avez pas de compte?",
        alreadyHaveAccount: 'Vous avez déjà un compte?',
        signOut: 'Se Déconnecter',

        // Forgot Password
        forgotPasswordTitle: 'Réinitialiser le Mot de Passe',
        forgotPasswordDescription:
          'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe',
        sendResetLink: 'Envoyer le Lien de Réinitialisation',
        sending: 'Envoi...',
        emailSent: 'E-mail Envoyé!',
        checkInbox:
          'Vérifiez votre boîte de réception pour les instructions de réinitialisation du mot de passe',
        resetLinkSentTo:
          'Nous avons envoyé un lien de réinitialisation du mot de passe à',
        didntReceiveEmail:
          "Vous n'avez pas reçu l'e-mail? Vérifiez votre dossier spam ou réessayez.",
        tryAgain: 'Réessayer',
        backToSignIn: 'Retour à la Connexion',
        rememberPassword:
          'Vous vous souvenez de votre mot de passe? Connectez-vous',
        needNewAccount: "Besoin d'un nouveau compte?",
        failedToSendReset: "Échec de l'envoi de l'e-mail de réinitialisation",
        enterEmailAddress: 'Veuillez entrer votre adresse e-mail',

        // Email Confirmation
        checkYourEmail: 'Vérifiez Votre E-mail',
        confirmYourEmail: 'Confirmez Votre E-mail',
        sendingConfirmation:
          'Nous envoyons un e-mail de confirmation à {{email}}',
        enterEmailForConfirmation:
          'Entrez votre adresse e-mail et nous vous enverrons un nouveau lien de confirmation',
        failedToResendConfirmation:
          "Échec du renvoi de l'e-mail de confirmation",
        confirmationEmailSent: 'E-mail de Confirmation Envoyé!',
        checkInboxForConfirmation:
          'Vérifiez votre boîte de réception pour le lien de confirmation',
        sentNewConfirmationTo:
          'Nous avons envoyé un nouvel e-mail de confirmation à',
        clickConfirmationLink:
          'Veuillez vérifier votre e-mail et cliquer sur le lien de confirmation pour activer votre compte.',
        sendAnotherEmail: 'Envoyer un Autre E-mail',
        sendConfirmationEmail: "Envoyer l'E-mail de Confirmation",
        alreadyConfirmed: 'Déjà confirmé? Connectez-vous',

        // Email Confirmation Status
        confirmingEmail: "Confirmation de l'E-mail...",
        emailConfirmed: 'E-mail Confirmé!',
        confirmationFailed: 'Échec de la Confirmation',
        pleaseWaitConfirming:
          'Veuillez patienter pendant que nous confirmons votre adresse e-mail.',
        emailConfirmedSuccess:
          'Votre e-mail a été confirmé avec succès. Vous pouvez maintenant vous connecter à votre compte.',
        unableToConfirm: "Nous n'avons pas pu confirmer votre adresse e-mail.",
        confirmationLinkInvalid:
          "Échec de la confirmation de l'e-mail. Le lien peut être invalide ou avoir expiré.",
        noConfirmationToken: 'Aucun jeton de confirmation fourni.',
        redirectingToSignIn:
          'Redirection vers la page de connexion dans 3 secondes...',
        continueToSignIn: 'Continuer vers la Connexion',
        goToSignIn: 'Aller à la Connexion',
        signUpAgain: "S'Inscrire à Nouveau",

        // Invite Context
        invitedToEnroll: 'Vous avez été invité à vous inscrire à {{flowName}}',
        signingInToJoin:
          'Vous vous connectez pour rejoindre {{flowName}} chez {{tenantName}}',
        emailLockedFromInvite: 'E-mail verrouillé par invitation',

        // WhatsApp
        whatsappNumber: 'Numéro WhatsApp (Facultatif)',
        whatsappHelper:
          'Facultatif - Ajoutez votre numéro WhatsApp pour recevoir des notifications',

        // Opt-ins
        agreeToReceiveUpdates:
          "J'accepte de recevoir des mises à jour/e-mails de cette application",

        // Validation
        validatingInvite: "Validation de l'invitation...",
      },

      // Dashboard
      dashboard: {
        title: 'Tableau de Bord',
        welcome: 'Bienvenue, {{name}}!',
        organizations: 'Organisations',
        createOrganization: 'Créer une Organisation',
        noOrganizations: "Pas encore d'organisations",
        recentActivity: 'Activité Récente',
        quickActions: 'Actions Rapides',

        // Management Mode
        managementMode: 'Mode de Gestion',
        managingAs: 'Gestion de {{tenant}} en tant que {{role}}',
        leaving: 'Sortie...',
        leaveOrganization: "Quitter l'Organisation",
        managementTools: 'Outils de Gestion',

        // Organization Creation
        createFirstOrg: 'Créez Votre Première Organisation',
        getStarted:
          'Commencez par créer une organisation pour gérer les flux et les équipes',

        // Organization Cards
        yourOrganizations: 'Vos Organisations',
        allOrganizations: 'Toutes',
        activeFlows: 'Flux Actifs',
        recent: 'Récent',
        moreFlows: '+{{count}} de plus',
        viewOrganization: "Voir l'Organisation",

        // Empty States
        noAccess: "Vous n'avez pas encore accès à une organisation",
        contactAdmin:
          'Contactez un administrateur pour être invité à une organisation',

        // Subscription Warnings
        completeSubscription: 'Complétez Votre Abonnement',
        subscriptionCancelled: 'Abonnement Annulé',
        subscribeToStart:
          'Abonnez-vous pour commencer à utiliser StatusAtFront et débloquer toutes les fonctionnalités de gestion.',
        subscriptionCancelledDescription:
          'Votre abonnement a été annulé. Réactivez-le pour continuer à gérer les flux, les membres et les clients.',

        // Selection Warnings
        selectOrganization: 'Sélectionner une Organisation à Gérer',
        selectOrganizationDescription:
          'Choisissez une organisation dans le menu hamburger pour accéder aux fonctionnalités de gestion telles que les flux, les membres et les paramètres.',

        // Dividers
        managementVsEnrollment: 'Gestion vs Inscription',
      },

      flows: {
        // Basic
        title: 'Flux',
        create: 'Créer un Flux',
        edit: 'Modifier le Flux',
        delete: 'Supprimer le Flux',
        name: 'Nom du Flux',
        description: 'Description',
        status: 'Statut',
        active: 'Actif',
        inactive: 'Inactif',
        draft: 'Brouillon',
        noFlows: 'Pas encore de flux',
        createFirst: 'Créez votre premier flux pour commencer',
        flowBuilder: 'Constructeur de Flux',
        addStep: 'Ajouter une Étape',
        deleteStep: "Supprimer l'Étape",
        addNode: 'Ajouter un Nœud',
        deleteNode: 'Supprimer le Nœud',
        connectSteps: 'Connecter les Étapes',
        back: 'Retour',
        backToFlows: 'Retour aux Flux',
        zoomIn: 'Zoomer',
        zoomOut: 'Dézoomer',
        resetView: 'Réinitialiser la Vue',
        fitToView: 'Ajuster à la Vue',
        moreOptions: "Plus d'options",
        organizing: 'Organisation...',
        organize: 'Organiser',
        organizeFlow: 'Organiser le Flux',
        minimapOn: 'Minimap Activée',
        minimapOff: 'Minimap Désactivée',
        minimap: 'Minimap',
        hideMinimap: 'Masquer la minimap',
        showMinimap: 'Afficher la minimap',
        liveMode: 'Mode en Direct',
        offlineMode: 'Mode Hors Ligne',
        live: 'En Direct',
        offline: 'Hors Ligne',
        realtimeEnabled: 'Collaboration en temps réel activée',
        enableRealtime: 'Activer la collaboration en temps réel',
        unknownFlow: 'Flux Inconnu',

        // Dashboard Card
        manageFlows: 'Gérer les Flux',
        manageFlowsDescription:
          'Créez et gérez les flux de statut pour {{tenant}}',

        // Management
        backToDashboard: 'Retour au Tableau de Bord',
        flowManagement: 'Gestion des Flux',
        manageWorkflows: 'Gérez vos flux de suivi de statut',
        managingFor: 'Gestion des flux pour {{tenant}}',
        noOrgSelected: 'Aucune Organisation Sélectionnée',
        selectOrgPrompt:
          'Veuillez sélectionner une organisation depuis le tableau de bord pour gérer les flux',
        searchFlows: 'Rechercher des flux...',
        loadingFlows: 'Chargement des flux...',
        errorLoadingFlows: 'Erreur lors du chargement des flux',
        noFlowsFound: 'Aucun flux trouvé',
        noFlowsMatchSearch: 'Aucun flux ne correspond à votre recherche',
        tryDifferentSearch:
          'Essayez différents termes de recherche ou créez un nouveau flux',
        flowsCount: '{{count}} flux',
        flowsCount_other: '{{count}} flux',
        showing: 'Affichage',
        of: 'de',

        // Actions
        viewFlow: 'Voir le Flux',
        editFlow: 'Modifier le Flux',
        inviteToFlow: 'Inviter au Flux',
        deleteFlow: 'Supprimer le Flux',
        actions: 'Actions',

        // Invite Modal
        inviteOthersTo:
          "Invitez d'autres personnes à s'inscrire à {{flowName}}",
        emailInvite: 'Invitation par E-mail',
        qrCode: 'Code QR',
        copyUrl: "Copier l'URL",
        inviteViaEmail: 'Inviter par E-mail',
        inviteByEmailDesc:
          "Envoyez un lien d'invitation directement à leur e-mail",
        sendInvite: "Envoyer l'Invitation",
        sending: 'Envoi...',
        inviteSentSuccess: 'Invitation envoyée avec succès !',
        inviteSentTo: 'Invitation envoyée à {{email}}',
        failedToSendInvite:
          "Échec de l'envoi de l'invitation. Veuillez réessayer.",
        scanQrCode: 'Scanner le Code QR',
        scanQrCodeDesc: 'Scannez ce code QR pour vous inscrire au flux',
        copyInviteUrl: "Copier l'URL d'Invitation",
        copyInviteUrlDesc: "Copiez et partagez ce lien d'invitation",
        copyLink: 'Copier le Lien',
        linkCopied: 'Lien copié !',
        linkCopiedToClipboard:
          "Le lien d'invitation a été copié dans le presse-papiers",
        failedToCopyLink:
          'Échec de la copie du lien. Veuillez le copier manuellement.',
        enterEmailAddress: 'Entrez une adresse e-mail',
        close: 'Fermer',

        // Delete Confirmation
        deleteFlowTitle: 'Supprimer le Flux',
        deleteFlowMessage:
          'Êtes-vous sûr de vouloir supprimer le flux "{{flowName}}" ? Cette action ne peut pas être annulée.',
        confirmDelete: 'Oui, supprimer',
        deleting: 'Suppression...',
        flowDeleted: 'Flux supprimé avec succès',
        failedToDeleteFlow: 'Échec de la suppression du flux',

        // Builder
        newStep: 'Nouvelle Étape',
        stepName: "Nom de l'Étape",
        stepDescription: "Description de l'Étape",
        saveChanges: 'Enregistrer les Modifications',
        saving: 'Enregistrement...',
        changesSaved: 'Modifications enregistrées avec succès',
        failedToSaveChanges: "Échec de l'enregistrement des modifications",
        deleteStepTitle: "Supprimer l'Étape",
        deleteStepMessage:
          'Êtes-vous sûr de vouloir supprimer "{{stepName}}" ? Cela supprimera toutes les connexions à cette étape.',
        stepDeleted: 'Étape supprimée avec succès',
        failedToDeleteStep: "Échec de la suppression de l'étape",

        // Create Flow Dialog
        createNewFlow: 'Créer un Nouveau Flux',
        createFlowFor: 'Créer un nouveau flux de statut pour {{tenant}}',
        flowNameLabel: 'Nom du Flux',
        flowNamePlaceholder: 'Ex : Intégration Client',
        flowDescLabel: 'Description',
        flowDescPlaceholder: 'Décrivez le but de ce flux...',
        createFlow: 'Créer le Flux',
        creating: 'Création...',
        flowCreated: 'Flux créé avec succès',
        failedToCreateFlow: 'Échec de la création du flux',
        cancel: 'Annuler',

        // Status Tracking
        loadingStatusTracking: 'Chargement du suivi de statut...',
        enrollmentNotFound: 'Inscription introuvable.',
      },

      members: {
        title: 'Membres',
        invite: 'Inviter un Membre',
        role: 'Rôle',
        owner: 'Propriétaire',
        staff: 'Personnel',
        member: 'Membre',
        email: 'E-mail',
        status: 'Statut',
        joined: 'Rejoint',
        pending: 'En Attente',
        noMembers: 'Pas encore de membres',
        inviteFirst: 'Invitez votre premier membre pour collaborer',

        // Dashboard Card
        manageMembers: 'Gérer les Membres',
        manageMembersDescription:
          "Invitez et gérez les membres de l'équipe pour {{tenant}}",

        // Member Management Page
        memberManagement: 'Gestion des Membres',
        manageTeamMembers: "Gérer les membres de l'équipe et leurs rôles",
        managingMembersFor: 'Gestion des membres pour {{tenant}}',
        pleaseSelectOrg:
          'Veuillez sélectionner une organisation dans le menu pour gérer les membres.',
        searchMembers: 'Rechercher des membres...',
        loadingMembers: 'Chargement des membres...',
        loadError: 'Échec du chargement des membres. Veuillez réessayer.',
        membersCount: 'Membres ({{count}})',
        inviteMember: 'Inviter un Membre',
        emailAddress: 'Adresse E-mail',
        enterEmailAddress: "Entrez l'adresse e-mail",
        sending: 'Envoi...',
        sendInvite: "Envoyer l'Invitation",
        you: 'Vous',
        promote: 'Promouvoir',
        demote: 'Rétrograder',
        remove: 'Retirer',
        showingMembers: 'Affichage de {{from}} à {{to}} sur {{total}} membres',
        noMembersFound: 'Aucun Membre Trouvé',
        noMatchingSearch:
          'Aucun membre ne correspond à "{{search}}". Essayez d\'ajuster votre recherche.',
        noMembersForOrg: 'Aucun membre trouvé pour cette organisation.',
        promoteTitle: 'Promouvoir {{member}} ?',
        promoteDescription:
          'Cela promouvra {{member}} de {{currentRole}} à {{newRole}}.',
        promoteConfirm: 'Promouvoir à {{role}}',
        demoteTitle: 'Rétrograder {{member}} ?',
        demoteDescription:
          'Cela rétrogradra {{member}} de {{currentRole}} à {{newRole}}.',
        demoteConfirm: 'Rétrograder à {{role}}',
        removeTitle: 'Retirer {{member}} ?',
        removeDescription:
          "Cela retirera définitivement {{member}} de l'organisation. Ils perdront tout accès immédiatement.",
        removeMember: 'Retirer le Membre',
        membershipLimitReached:
          'Votre plan a atteint la limite de membres. Veuillez mettre à niveau pour ajouter plus de membres.',
        inviteErrorGeneric: "Une erreur s'est produite. Veuillez réessayer.",
      },

      customers: {
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
        manageEnrollments:
          'Gérer les inscriptions clients et le suivi du statut',
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
      },

      inbox: {
        title: 'Boîte de Réception',
        messages: 'Messages',
        notifications: 'Notifications',
        unread: 'Non lus',
        unreadMessages: 'messages non lus',
        markAsRead: 'Marquer comme Lu',
        markAllAsRead: 'Tout Marquer comme Lu',
        noMessages: 'Aucun message',
        emptyInbox: 'Votre boîte de réception est vide',
        statusUpdate: 'Mise à jour du statut',
        teamInvite: "Invitation d'équipe",
        flowInvite: 'Invitation de flux',
        membershipUpdate: "Mise à jour de l'adhésion",
        new: 'Nouveau',
        actionRequired: 'Action requise',
        from: 'De',
        team: 'Équipe',
        flow: 'Flux',
        accept: 'Accepter',
        reject: 'Rejeter',
        accepted: 'Accepté',
        rejected: 'Rejeté',
        actionAlreadyTaken: 'Cette action a déjà été effectuée',
        actionAlreadyTakenTitle: 'Action déjà effectuée',
        loadingMessages: 'Chargement des messages...',
        failedToLoad: 'Échec du chargement des messages',
        loadErrorMessage:
          "Une erreur s'est produite lors du chargement de vos messages. Veuillez réessayer.",
        manageNotifications: 'Gérez vos notifications et messages',
        filterDescription: 'Filtrer les messages',
        messageType: 'Type de message',
        allTypes: 'Tous les types',
        statusUpdates: 'Mises à jour de statut',
        teamInvites: "Invitations d'équipe",
        flowInvites: 'Invitations de flux',
        membershipUpdates: "Mises à jour d'adhésion",
        readStatus: 'Statut de lecture',
        allMessages: 'Tous les messages',
        read: 'Lu',
        noAction: 'Aucune action',
        perPage: 'Par page',
        marking: 'Marquage...',
        totalMessages: '{{count}} messages au total',
        noMessagesFound: 'Aucun message trouvé',
        tryAdjustingFilters:
          "Essayez d'ajuster vos filtres pour voir plus de messages.",
        noMessagesAtThisTime: "Vous n'avez aucun message pour le moment.",
        showingMessages:
          'Affichage de {{from}} à {{to}} sur {{total}} messages',
      },

      errors: {
        somethingWentWrong: "Quelque chose s'est mal passé",
        tryAgain: 'Réessayer',
        pageNotFound: '404 - Page Non Trouvée',
        goHome: "Aller à l'Accueil",
        unauthorized: 'Non Autorisé',
        forbidden: 'Interdit',
        serverError: 'Erreur du Serveur',
        networkError: 'Erreur Réseau',
        loadingError: 'Échec du chargement des données',
        errorLoadingEnrollment: "Erreur de Chargement de l'Inscription",
        failedToLoadEnrollment:
          "Échec du chargement des détails de l'inscription",
      },

      settings: {
        account: 'Paramètres du Compte',
        organization: "Paramètres de l'Organisation",
        profile: 'Profil',
        security: 'Sécurité',
        notifications: 'Notifications',
        billing: 'Facturation',
        theme: 'Thème',
        language: 'Langue',
        darkMode: 'Mode Sombre',
        lightMode: 'Mode Clair',
        autoMode: 'Mode Automatique',

        // Dashboard Cards
        accountSettings: 'Paramètres du Compte',
        organizationSettings: "Paramètres de l'Organisation",
        customizeBranding:
          "Personnalisez la marque, les thèmes et les détails de l'organisation",
        manageOrganization: "Gérer l'Organisation",
        managePreferences:
          'Gérez les paramètres et préférences de votre compte',
        manageProfile: 'Gérez votre profil, mot de passe et préférences',
        manageAccount: 'Gérer le Compte',
      },

      account: {
        pleaseSignIn:
          'Veuillez vous connecter pour accéder aux paramètres du compte.',
        managePreferences:
          'Gérez les paramètres et préférences de votre compte',
        profileInfo: 'Informations du Profil',
        profileDescription:
          'Mettez à jour vos informations personnelles et coordonnées',
        fullName: 'Nom Complet',
        fullNamePlaceholder: 'Entrez votre nom complet',
        emailAddress: 'Adresse E-mail',
        emailPlaceholder: 'Entrez votre adresse e-mail',
        whatsappPhone: 'Numéro de Téléphone WhatsApp',
        whatsappHelper: 'Utilisé pour les notifications WhatsApp',
        marketingComms: 'Communications Marketing',
        marketingHelper:
          'Recevez des mises à jour sur les nouvelles fonctionnalités et améliorations',
        saveProfile: 'Enregistrer le Profil',
        appearance: 'Apparence',
        appearanceDescription: "Personnalisez l'apparence de l'application",
        theme: 'Thème',
        selectTheme: 'Sélectionner un thème',
        light: 'Clair',
        dark: 'Sombre',
        themeHelper: 'Choisissez votre schéma de couleurs préféré',
        accountManagement: 'Gestion du Compte',
        accountManagementDescription:
          'Gérez la sécurité et les données de votre compte',
        deleteAccount: 'Supprimer le Compte',
        deleteAccountDescription:
          'Supprimer définitivement votre compte et toutes les données associées.',
        soleOwnerWarning:
          'Attention : Vous êtes le seul propriétaire de {{count}} organisation(s). La suppression de votre compte supprimera également ces organisations.',
        deleting: 'Suppression...',
        deleteAccountWarning:
          'Cela supprimera définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.',
        deleteAccountWithOrgs:
          'La suppression de votre compte supprimera également les organisations suivantes dont vous êtes le seul propriétaire :\n\n{{orgs}}\n\nCette action ne peut pas être annulée.',
      },

      organization: {
        nameRequired: "Le nom de l'organisation est requis",
        failedToCreate: "Échec de la création de l'organisation",
        createOrganization: 'Créer une Organisation',
        setupDescription:
          'Configurez une nouvelle organisation pour gérer vos équipes et flux de travail',
        organizationDetails: "Détails de l'Organisation",
        chooseUniqueName: 'Choisissez un nom unique pour votre organisation',
        organizationNameRequired: "Nom de l'Organisation *",
        namePlaceholder: "Entrez le nom de l'organisation (ex., Acme Corp)",
        nameHelper:
          'Ce nom sera visible pour les membres de votre équipe et vos clients',
        creating: 'Création...',
        whatHappensNext: 'Que se passe-t-il ensuite ?',
        becomeOwner:
          "Vous deviendrez automatiquement propriétaire de l'organisation",
        inviteMembers:
          "Vous pouvez inviter des membres de l'équipe à collaborer",
        createFlows:
          'Commencez à créer des flux pour suivre les mises à jour de statut',
        subscribeToPlan:
          'Abonnez-vous à un plan pour débloquer toutes les fonctionnalités',
      },

      notifications: {
        title: 'Préférences de Notification',
        description: 'Gérez comment vous recevez les notifications',
        loadingPreferences: 'Chargement des préférences...',
        failedToLoad: 'Échec du chargement des préférences de notification.',
        tryRefreshing: "Veuillez essayer d'actualiser la page.",
        chooseHowNotified:
          'Choisissez comment vous souhaitez être notifié des mises à jour importantes',
        emailNotifications: 'Notifications par E-mail',
        enableEmailNotifications: 'Activer les Notifications par E-mail',
        masterToggleEmail:
          'Bouton principal - contrôle tous les paramètres de notification par e-mail ci-dessous',
        statusUpdates: 'Mises à jour de statut',
        statusUpdatesDescription:
          'Être notifié lorsque le statut du flux change',
        invitations: 'Invitations',
        invitationsDescription:
          "Être notifié des invitations d'équipe et de flux",
        whatsappNotifications: 'Notifications WhatsApp',
        addWhatsAppNumber:
          'Veuillez ajouter un numéro de téléphone WhatsApp dans les paramètres de votre profil pour activer les notifications WhatsApp.',
        enableWhatsAppNotifications: 'Activer les Notifications WhatsApp',
        masterToggleWhatsApp:
          'Bouton principal - contrôle tous les paramètres de notification WhatsApp ci-dessous',
        savePreferences: 'Enregistrer les Préférences',
        savedSuccessfully:
          'Préférences de notification enregistrées avec succès!',
        failedToSave:
          "Échec de l'enregistrement des préférences. Veuillez réessayer.",
      },

      subscription: {
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
      },

      // Tenant/Organization Pages
      tenant: {
        organizationNotFound: 'Organisation Non Trouvée',
        orgNotFoundMessage:
          'L\'organisation "{{name}}" n\'a pas pu être trouvée.',
        backToHome: "Retour à l'Accueil",
        loading: 'Chargement...',
        contact: 'Contact',
        noActiveFlows: 'Aucun Flux Actif',
        noActiveFlowsMessage: "Vous n'avez aucun flux actif dans {{tenant}}.",
        askAdminToEnroll:
          'Demandez à votre administrateur de vous inscrire dans un flux, ou scannez une invitation par code QR.',
        welcomeTo: 'Bienvenue chez {{tenant}}',
        signInToView:
          'Connectez-vous pour voir votre progression de flux et gérer vos inscriptions.',
        home: 'Accueil',
        currentStep: 'Étape Actuelle',
        started: 'Commencé',
        updated: 'Mis à jour',
        atStepToday: "À l'étape : Aujourd'hui",
        atStepOneDay: "À l'étape : 1 jour",
        atStepDays: "À l'étape : {{days}} jours",
        referenceId: 'ID de Référence',
        nextSteps: 'Prochaines Étapes',
        noUpcomingSteps: 'Aucune étape à venir',
        noHistoryYet: "Pas encore d'historique",
        showingRecent: 'Affichage des {{count}} plus récents',
      },

      // Invite Landing
      invite: {
        youreInvited: 'Vous Êtes Invité !',
        joinFlowAt: 'Rejoindre {{flow}} chez {{tenant}}',
        invitationSent: 'Invitation Envoyée !',
        invitationSentTo: 'Nous avons envoyé une invitation à {{email}}',
        checkYourEmail: 'Vérifiez Votre E-mail',
        receiveInvitation:
          'Vous recevrez une invitation par e-mail pour rejoindre {{flow}} chez {{tenant}}',
        clickToAddInbox:
          'Cliquez ci-dessous pour ajouter cette invitation à votre boîte de réception',
        enterEmailToReceive:
          'Entrez votre adresse e-mail pour recevoir une invitation à rejoindre ce flux',
        signedInAs: 'Connecté en tant que',
        addToMyInbox: 'Ajouter à Ma Boîte de Réception',
        addingToInbox: 'Ajout à la Boîte de Réception...',
        sendMeInvitation: "M'Envoyer une Invitation",
        sendingInvitation: "Envoi de l'Invitation...",
        inviteAlreadyExists:
          'Une invitation existe déjà. Redirection vers votre boîte de réception...',
        inviteAlreadySentEmail:
          'Une invitation a déjà été envoyée à cette adresse e-mail. Veuillez vérifier votre e-mail ou réessayer plus tard.',
        orgLimitReached:
          'Votre organisation a atteint sa limite. Veuillez contacter votre administrateur.',
        failedToSendInvitation:
          "Échec de l'envoi de l'invitation. Veuillez réessayer.",
        enterEmailAddress: 'Veuillez entrer votre adresse e-mail',
      },

      // Settings - Extended
      'settings.organization': {
        noOrgSelected: 'Aucune organisation sélectionnée',
        manageSubscriptionDesc:
          "Gérer l'abonnement et les paramètres de facturation de votre organisation",
        resourceUsage: 'Utilisation des Ressources',
        trackResourceConsumption:
          'Suivez la consommation des ressources de votre organisation',
        activeCases: 'Cas Actifs',
        unlimitedActiveCases: 'Cas actifs illimités dans votre plan',
        activeCasesLimitReached:
          "Limite atteinte ! Impossible d'activer de nouveaux cas ou d'inviter de nouveaux clients.",
        remainingActiveCases: '{{count}} cas actifs restants',
        teamMembers: "Membres de l'Équipe",
        unlimitedTeamMembers: "Membres de l'équipe illimités dans votre plan",
        teamMembersLimitReached:
          "Limite atteinte ! Impossible d'inviter de nouveaux membres de l'équipe.",
        remainingTeamMembers: "{{count}} membre(s) de l'équipe restant(s)",
        usageThisMonth: 'Utilisation Ce Mois',
        statusUpdates: 'Mises à Jour de Statut',
        overageAlert: 'Alerte de Dépassement',
        overageMessage:
          'Vous avez utilisé {{count}} mises à jour de statut supplémentaires. Coût supplémentaire : €{{cost}} (€0.05 par mise à jour)',
        overageCostInfo:
          'Si vous dépassez votre limite, les mises à jour supplémentaires coûtent €0.05 chacune',
        billingPeriodStarted: 'Période de facturation commencée',
        organizationInfo: "Informations sur l'Organisation",
        basicInfo: 'Informations de base sur votre organisation',
        organizationName: "Nom de l'Organisation",
        organizationNamePlaceholder: "Entrez le nom de l'organisation",
        organizationNameHelper:
          'Ce nom apparaîtra sur la page publique de votre organisation',
        organizationDescription: "Description de l'Organisation",
        organizationDescriptionPlaceholder:
          'Décrivez votre organisation, sa mission et ce que les visiteurs peuvent attendre...',
        organizationDescriptionHelper:
          'Cette description apparaîtra sur la page publique de votre organisation',
        contactPhone: 'Téléphone de Contact',
        contactPhoneHelper: 'Numéro de téléphone pour les demandes de contact',
        contactEmail: 'E-mail de Contact',
        contactEmailHelper: 'Adresse e-mail pour les demandes de contact',
        saveOrgInfo: "Enregistrer les Informations de l'Organisation",
        themeColors: 'Couleurs du Thème',
        customizeColors:
          'Personnalisez les couleurs utilisées sur la page publique de votre organisation',
        primaryColor: 'Couleur Primaire (Fond)',
        accentColor: "Couleur d'Accentuation (Badges et Surbrillances)",
        textColor: 'Couleur du Texte',
        livePreview: 'Aperçu en Direct',
        previewDescription: "Aperçu de l'apparence des couleurs sur votre page",
        saveThemeColors: 'Enregistrer les Couleurs du Thème',
        organizationLogo: "Logo de l'Organisation",
        uploadLogoDescription:
          'Téléchargez un logo à afficher sur la page publique de votre organisation',
        logoFile: 'Fichier du Logo',
        logoFileHelper:
          'Téléchargez un fichier image (PNG, JPG, GIF). Taille maximale : 5MB. Recommandé : 200x200px ou plus.',
        logoPreview: 'Aperçu du Logo',
        noLogo: 'Pas de logo',
        logoSuccess: 'Logo {{action}} avec succès !',
        uploaded: 'téléchargé',
        deleted: 'supprimé',
        uploading: 'Téléchargement...',
        uploadLogo: 'Télécharger le Logo',
        deleting: 'Suppression...',
        deleteLogo: 'Supprimer le Logo',
        previewAndTest: 'Aperçu et Test',
        seeHowPageLooks:
          'Voyez à quoi ressemble la page de votre organisation pour les visiteurs',
        viewPublicPage: 'Voir la Page Publique',
        dangerZone: 'Zone de Danger',
        irreversibleActions: 'Actions irréversibles pour cette organisation',
        leaveOrganization: "Quitter l'Organisation",
        leaveOrganizationOwnerWarning:
          "En tant que propriétaire, quitter peut supprimer l'organisation si vous êtes le seul propriétaire.",
        leaveOrganizationWarning:
          "Vous perdrez l'accès à toutes les données et ne pourrez pas rejoindre sans nouvelle invitation.",
        leaving: 'En cours de départ...',
      },
    },
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Default language

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language in localStorage
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false, // We handle loading states ourselves
    },
  });

export default i18n;
