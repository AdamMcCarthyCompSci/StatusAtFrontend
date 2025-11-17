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
        accountCreatedCanSignIn: 'Account created successfully! You can now sign in with your new account.',
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
        forgotPasswordDescription: "Enter your email address and we'll send you a link to reset your password",
        sendResetLink: 'Send Reset Link',
        sending: 'Sending...',
        emailSent: 'Email Sent!',
        checkInbox: 'Check your inbox for password reset instructions',
        resetLinkSentTo: "We've sent a password reset link to",
        didntReceiveEmail: "Didn't receive the email? Check your spam folder or try again.",
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
        enterEmailForConfirmation: "Enter your email address and we'll send you a new confirmation link",
        failedToResendConfirmation: 'Failed to resend confirmation email',
        confirmationEmailSent: 'Confirmation Email Sent!',
        checkInboxForConfirmation: 'Check your inbox for the confirmation link',
        sentNewConfirmationTo: "We've sent a new confirmation email to",
        clickConfirmationLink: 'Please check your email and click the confirmation link to activate your account.',
        sendAnotherEmail: 'Send Another Email',
        sendConfirmationEmail: 'Send Confirmation Email',
        alreadyConfirmed: 'Already confirmed? Sign in',

        // Email Confirmation Status
        confirmingEmail: 'Confirming Email...',
        emailConfirmed: 'Email Confirmed!',
        confirmationFailed: 'Confirmation Failed',
        pleaseWaitConfirming: 'Please wait while we confirm your email address.',
        emailConfirmedSuccess: 'Your email has been successfully confirmed. You can now sign in to your account.',
        unableToConfirm: 'We were unable to confirm your email address.',
        confirmationLinkInvalid: 'Failed to confirm email. The link may be invalid or expired.',
        noConfirmationToken: 'No confirmation token provided.',
        redirectingToSignIn: 'Redirecting to sign in page in 3 seconds...',
        continueToSignIn: 'Continue to Sign In',
        goToSignIn: 'Go to Sign In',
        signUpAgain: 'Sign Up Again',

        // Invite Context
        invitedToEnroll: "You've been invited to enroll in {{flowName}}",
        signingInToJoin: "You're signing in to join {{flowName}} at {{tenantName}}",
        emailLockedFromInvite: 'Email locked from invite',

        // WhatsApp
        whatsappNumber: 'WhatsApp Phone Number (Optional)',
        whatsappHelper: 'Optional - Add your WhatsApp number to receive notifications',

        // Opt-ins
        agreeToReceiveUpdates: 'I agree to receive updates/emails from this app',

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
        getStarted: 'Get started by creating an organization to manage flows and teams',

        // Organization Cards
        yourOrganizations: 'Your Organizations',
        allOrganizations: 'All',
        activeFlows: 'Active Flows',
        recent: 'Recent',
        moreFlows: '+{{count}} more',
        viewOrganization: 'View Organization',

        // Empty States
        noAccess: "You don't have access to any organizations yet",
        contactAdmin: 'Contact an administrator to get invited to an organization',
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
        selectOrgMessage: 'Please select an organization from the menu to manage flows.',
        searchFlows: 'Search flows...',
        perPage: '{{count}} per page',
        loadingFlows: 'Loading flows...',
        failedToLoad: 'Failed to load flows. Please try again.',
        flowsCount: 'Flows ({{count}})',
        noFlowsFound: 'No Flows Found',
        notCreatedYet: "You haven't created any flows yet.",
        noMatchingFlows: "No flows match '{{search}}'. Try adjusting your search.",
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
        shareQrOrUrl: 'Share this QR code or URL to invite others to join {{flowName}}',
        mobileTip: "Mobile Tip: Use your phone's camera app or a QR scanner app.",
        printQrCode: 'Print QR Code',
        copyUrl: 'Copy URL',
        joinFlow: 'Join {{flowName}}',
        scanQrToJoin: 'Scan this QR code to join the flow',
        mobileTipPrint: "Mobile Tip: Use your phone's camera app.",

        // Errors
        planLimitReached: 'Your plan has reached its limit. Please upgrade to invite more users.',
        errorOccurred: 'An error occurred. Please try again.',

        // Confirmation Dialogs
        deleteFlowTitle: "Delete '{{flowName}}'?",
        deleteFlowMessage: 'This flow and all its associated data will be permanently deleted. This action cannot be undone.',
        deleteFlowButton: 'Delete Flow',

        // Alerts
        maxNodesReached: 'Maximum Nodes Reached',
        maxNodesMessage: "You've reached the maximum limit of {{max}} nodes per flow...",
        understood: 'Understood',

        // Builder
        flowBuilder: 'Flow Builder',
        addStep: 'Add Step',
        deleteStep: 'Delete Step',
        connectSteps: 'Connect Steps',
        newStep: 'New Step',
        deleteStepTitle: 'Delete Step',
        deleteStepMessage: "Are you sure you want to delete '{{stepName}}'? This step and all its connections will be permanently removed...",
        cannotCreateConnection: 'Cannot Create Connection',
        wouldCreateLoop: "Creating a connection from '{{from}}' to '{{to}}' would create a loop...",
        cannotCreateMultipleStarts: 'Cannot Create Multiple Start Points',
        wouldCreateMultipleStarts: "This connection would create multiple starting points in your flow...",
        deleteTransition: 'Delete Transition',
        deleteTransitionMessage: "Are you sure you want to delete the transition from '{{from}}' to '{{to}}'?...",
        deleteTransitionButton: 'Delete Transition',
        organizeFlow: 'Organize Flow',
        organizeFlowMessage: 'This will automatically arrange your flow steps in a clean tree layout...',
        organizeFlowButton: 'Organize Flow',

        // Create Dialog
        createNewFlow: 'Create New Flow',
        createFlowFor: 'Create a new status flow for {{tenant}}',
        flowNameLabel: 'Flow Name',
        flowNamePlaceholder: 'e.g., Order Processing, Support Ticket',
        flowNameHelper: 'Choose a descriptive name for your status flow',
        flowNameRequired: 'Flow name is required',
        failedToCreate: 'Failed to create flow',
        creating: 'Creating...',
        createButton: 'Create Flow',

        // Empty States
        noFlows: 'No flows yet',
        createFirst: 'Create your first flow to get started',
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
        manageMembersDescription: 'Invite and manage team members for {{tenant}}',
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
        manageCustomersDescription: 'View and manage customer enrollments for {{tenant}}',
      },

      // Inbox
      inbox: {
        title: 'Inbox',
        messages: 'Messages',
        notifications: 'Notifications',
        unread: 'Unread',
        markAsRead: 'Mark as Read',
        markAllAsRead: 'Mark All as Read',
        noMessages: 'No messages',
        emptyInbox: 'Your inbox is empty',
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
        customizeBranding: 'Customize branding, themes, and organization details',
        manageOrganization: 'Manage Organization',
        managePreferences: 'Manage your account settings and preferences',
        manageProfile: 'Manage your profile, password, and preferences',
        manageAccount: 'Manage Account',
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
        accountCreatedCanSignIn: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión con tu nueva cuenta.',
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
        forgotPasswordDescription: 'Ingresa tu dirección de correo y te enviaremos un enlace para restablecer tu contraseña',
        sendResetLink: 'Enviar Enlace de Restablecimiento',
        sending: 'Enviando...',
        emailSent: '¡Correo Enviado!',
        checkInbox: 'Revisa tu bandeja de entrada para las instrucciones de restablecimiento de contraseña',
        resetLinkSentTo: 'Hemos enviado un enlace de restablecimiento de contraseña a',
        didntReceiveEmail: '¿No recibiste el correo? Revisa tu carpeta de spam o intenta de nuevo.',
        tryAgain: 'Intentar de Nuevo',
        backToSignIn: 'Volver a Iniciar Sesión',
        rememberPassword: '¿Recuerdas tu contraseña? Inicia sesión',
        needNewAccount: '¿Necesitas una cuenta nueva?',
        failedToSendReset: 'Error al enviar el correo de restablecimiento',
        enterEmailAddress: 'Por favor ingresa tu dirección de correo',

        // Email Confirmation
        checkYourEmail: 'Revisa tu Correo',
        confirmYourEmail: 'Confirma tu Correo',
        sendingConfirmation: 'Estamos enviando un correo de confirmación a {{email}}',
        enterEmailForConfirmation: 'Ingresa tu dirección de correo y te enviaremos un nuevo enlace de confirmación',
        failedToResendConfirmation: 'Error al reenviar el correo de confirmación',
        confirmationEmailSent: '¡Correo de Confirmación Enviado!',
        checkInboxForConfirmation: 'Revisa tu bandeja de entrada para el enlace de confirmación',
        sentNewConfirmationTo: 'Hemos enviado un nuevo correo de confirmación a',
        clickConfirmationLink: 'Por favor revisa tu correo y haz clic en el enlace de confirmación para activar tu cuenta.',
        sendAnotherEmail: 'Enviar Otro Correo',
        sendConfirmationEmail: 'Enviar Correo de Confirmación',
        alreadyConfirmed: '¿Ya confirmaste? Inicia sesión',

        // Email Confirmation Status
        confirmingEmail: 'Confirmando Correo...',
        emailConfirmed: '¡Correo Confirmado!',
        confirmationFailed: 'Confirmación Fallida',
        pleaseWaitConfirming: 'Por favor espera mientras confirmamos tu dirección de correo.',
        emailConfirmedSuccess: 'Tu correo ha sido confirmado exitosamente. Ahora puedes iniciar sesión en tu cuenta.',
        unableToConfirm: 'No pudimos confirmar tu dirección de correo.',
        confirmationLinkInvalid: 'Error al confirmar el correo. El enlace puede ser inválido o haber expirado.',
        noConfirmationToken: 'No se proporcionó token de confirmación.',
        redirectingToSignIn: 'Redirigiendo a la página de inicio de sesión en 3 segundos...',
        continueToSignIn: 'Continuar a Iniciar Sesión',
        goToSignIn: 'Ir a Iniciar Sesión',
        signUpAgain: 'Registrarse de Nuevo',

        // Invite Context
        invitedToEnroll: 'Has sido invitado a inscribirte en {{flowName}}',
        signingInToJoin: 'Estás iniciando sesión para unirte a {{flowName}} en {{tenantName}}',
        emailLockedFromInvite: 'Correo bloqueado por invitación',

        // WhatsApp
        whatsappNumber: 'Número de WhatsApp (Opcional)',
        whatsappHelper: 'Opcional - Agrega tu número de WhatsApp para recibir notificaciones',

        // Opt-ins
        agreeToReceiveUpdates: 'Acepto recibir actualizaciones/correos de esta aplicación',

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
        getStarted: 'Comienza creando una organización para gestionar flujos y equipos',

        // Organization Cards
        yourOrganizations: 'Tus Organizaciones',
        allOrganizations: 'Todas',
        activeFlows: 'Flujos Activos',
        recent: 'Reciente',
        moreFlows: '+{{count}} más',
        viewOrganization: 'Ver Organización',

        // Empty States
        noAccess: 'Aún no tienes acceso a ninguna organización',
        contactAdmin: 'Contacta a un administrador para ser invitado a una organización',
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
        connectSteps: 'Conectar Pasos',

        // Dashboard Card
        manageFlows: 'Gestionar Flujos',
        manageFlowsDescription: 'Crea y gestiona flujos de estado para {{tenant}}',

        // Management
        backToDashboard: 'Volver al Panel',
        flowManagement: 'Gestión de Flujos',
        manageWorkflows: 'Gestiona tus flujos de seguimiento de estado',
        managingFor: 'Gestionando flujos para {{tenant}}',
        noOrgSelected: 'Ninguna Organización Seleccionada',
        selectOrgPrompt: 'Por favor selecciona una organización desde el panel para gestionar flujos',
        searchFlows: 'Buscar flujos...',
        loadingFlows: 'Cargando flujos...',
        errorLoadingFlows: 'Error al cargar los flujos',
        noFlowsFound: 'No se encontraron flujos',
        noFlowsMatchSearch: 'No se encontraron flujos que coincidan con tu búsqueda',
        tryDifferentSearch: 'Intenta diferentes términos de búsqueda o crea un nuevo flujo',
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
        inviteByEmailDesc: 'Envía un enlace de invitación directamente a su correo',
        sendInvite: 'Enviar Invitación',
        sending: 'Enviando...',
        inviteSentSuccess: '¡Invitación enviada exitosamente!',
        inviteSentTo: 'Invitación enviada a {{email}}',
        failedToSendInvite: 'Error al enviar la invitación. Por favor intenta de nuevo.',
        scanQrCode: 'Escanear Código QR',
        scanQrCodeDesc: 'Escanea este código QR para inscribirte en el flujo',
        copyInviteUrl: 'Copiar URL de Invitación',
        copyInviteUrlDesc: 'Copia y comparte este enlace de invitación',
        copyLink: 'Copiar Enlace',
        linkCopied: '¡Enlace copiado!',
        linkCopiedToClipboard: 'El enlace de invitación ha sido copiado al portapapeles',
        failedToCopyLink: 'Error al copiar el enlace. Por favor cópialo manualmente.',
        enterEmailAddress: 'Ingresa una dirección de correo',
        close: 'Cerrar',

        // Delete Confirmation
        deleteFlowTitle: 'Eliminar Flujo',
        deleteFlowMessage: '¿Estás seguro de que deseas eliminar el flujo "{{flowName}}"? Esta acción no se puede deshacer.',
        cancel: 'Cancelar',
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
        deleteStepMessage: '¿Estás seguro de que deseas eliminar "{{stepName}}"? Esto eliminará todas las conexiones a este paso.',
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
        manageMembersDescription: 'Invita y gestiona miembros del equipo para {{tenant}}',
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
        manageCustomersDescription: 'Ver y gestionar inscripciones de clientes para {{tenant}}',
      },

      inbox: {
        title: 'Bandeja',
        messages: 'Mensajes',
        notifications: 'Notificaciones',
        unread: 'No leídos',
        markAsRead: 'Marcar como Leído',
        markAllAsRead: 'Marcar Todos como Leídos',
        noMessages: 'No hay mensajes',
        emptyInbox: 'Tu bandeja está vacía',
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
        customizeBranding: 'Personaliza la marca, temas y detalles de la organización',
        manageOrganization: 'Gestionar Organización',
        managePreferences: 'Gestiona la configuración y preferencias de tu cuenta',
        manageProfile: 'Gestiona tu perfil, contraseña y preferencias',
        manageAccount: 'Gestionar Cuenta',
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
        accountCreatedCanSignIn: 'Conta criada com sucesso! Agora você pode entrar com sua nova conta.',
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
        forgotPasswordDescription: 'Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha',
        sendResetLink: 'Enviar Link de Redefinição',
        sending: 'Enviando...',
        emailSent: 'E-mail Enviado!',
        checkInbox: 'Verifique sua caixa de entrada para instruções de redefinição de senha',
        resetLinkSentTo: 'Enviamos um link de redefinição de senha para',
        didntReceiveEmail: 'Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.',
        tryAgain: 'Tentar Novamente',
        backToSignIn: 'Voltar para Entrar',
        rememberPassword: 'Lembra sua senha? Entre',
        needNewAccount: 'Precisa de uma conta nova?',
        failedToSendReset: 'Falha ao enviar e-mail de redefinição',
        enterEmailAddress: 'Por favor, digite seu endereço de e-mail',

        // Email Confirmation
        checkYourEmail: 'Verifique seu E-mail',
        confirmYourEmail: 'Confirme seu E-mail',
        sendingConfirmation: 'Estamos enviando um e-mail de confirmação para {{email}}',
        enterEmailForConfirmation: 'Digite seu endereço de e-mail e enviaremos um novo link de confirmação',
        failedToResendConfirmation: 'Falha ao reenviar e-mail de confirmação',
        confirmationEmailSent: 'E-mail de Confirmação Enviado!',
        checkInboxForConfirmation: 'Verifique sua caixa de entrada para o link de confirmação',
        sentNewConfirmationTo: 'Enviamos um novo e-mail de confirmação para',
        clickConfirmationLink: 'Por favor, verifique seu e-mail e clique no link de confirmação para ativar sua conta.',
        sendAnotherEmail: 'Enviar Outro E-mail',
        sendConfirmationEmail: 'Enviar E-mail de Confirmação',
        alreadyConfirmed: 'Já confirmou? Entre',

        // Email Confirmation Status
        confirmingEmail: 'Confirmando E-mail...',
        emailConfirmed: 'E-mail Confirmado!',
        confirmationFailed: 'Confirmação Falhou',
        pleaseWaitConfirming: 'Por favor, aguarde enquanto confirmamos seu endereço de e-mail.',
        emailConfirmedSuccess: 'Seu e-mail foi confirmado com sucesso. Agora você pode entrar em sua conta.',
        unableToConfirm: 'Não foi possível confirmar seu endereço de e-mail.',
        confirmationLinkInvalid: 'Falha ao confirmar e-mail. O link pode ser inválido ou ter expirado.',
        noConfirmationToken: 'Nenhum token de confirmação fornecido.',
        redirectingToSignIn: 'Redirecionando para a página de login em 3 segundos...',
        continueToSignIn: 'Continuar para Entrar',
        goToSignIn: 'Ir para Entrar',
        signUpAgain: 'Cadastrar Novamente',

        // Invite Context
        invitedToEnroll: 'Você foi convidado a se inscrever em {{flowName}}',
        signingInToJoin: 'Você está entrando para participar de {{flowName}} em {{tenantName}}',
        emailLockedFromInvite: 'E-mail bloqueado por convite',

        // WhatsApp
        whatsappNumber: 'Número do WhatsApp (Opcional)',
        whatsappHelper: 'Opcional - Adicione seu número do WhatsApp para receber notificações',

        // Opt-ins
        agreeToReceiveUpdates: 'Aceito receber atualizações/e-mails deste aplicativo',

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
        getStarted: 'Comece criando uma organização para gerenciar fluxos e equipes',

        // Organization Cards
        yourOrganizations: 'Suas Organizações',
        allOrganizations: 'Todas',
        activeFlows: 'Fluxos Ativos',
        recent: 'Recente',
        moreFlows: '+{{count}} mais',
        viewOrganization: 'Ver Organização',

        // Empty States
        noAccess: 'Você ainda não tem acesso a nenhuma organização',
        contactAdmin: 'Entre em contato com um administrador para ser convidado para uma organização',
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
        connectSteps: 'Conectar Etapas',

        // Dashboard Card
        manageFlows: 'Gerenciar Fluxos',
        manageFlowsDescription: 'Crie e gerencie fluxos de status para {{tenant}}',

        // Management
        backToDashboard: 'Voltar ao Painel',
        flowManagement: 'Gestão de Fluxos',
        manageWorkflows: 'Gerencie seus fluxos de rastreamento de status',
        managingFor: 'Gerenciando fluxos para {{tenant}}',
        noOrgSelected: 'Nenhuma Organização Selecionada',
        selectOrgPrompt: 'Por favor, selecione uma organização no painel para gerenciar fluxos',
        searchFlows: 'Buscar fluxos...',
        loadingFlows: 'Carregando fluxos...',
        errorLoadingFlows: 'Erro ao carregar os fluxos',
        noFlowsFound: 'Nenhum fluxo encontrado',
        noFlowsMatchSearch: 'Nenhum fluxo corresponde à sua busca',
        tryDifferentSearch: 'Tente diferentes termos de busca ou crie um novo fluxo',
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
        failedToSendInvite: 'Falha ao enviar o convite. Por favor, tente novamente.',
        scanQrCode: 'Escanear Código QR',
        scanQrCodeDesc: 'Escaneie este código QR para se inscrever no fluxo',
        copyInviteUrl: 'Copiar URL de Convite',
        copyInviteUrlDesc: 'Copie e compartilhe este link de convite',
        copyLink: 'Copiar Link',
        linkCopied: 'Link copiado!',
        linkCopiedToClipboard: 'O link de convite foi copiado para a área de transferência',
        failedToCopyLink: 'Falha ao copiar o link. Por favor, copie-o manualmente.',
        enterEmailAddress: 'Digite um endereço de e-mail',
        close: 'Fechar',

        // Delete Confirmation
        deleteFlowTitle: 'Excluir Fluxo',
        deleteFlowMessage: 'Tem certeza de que deseja excluir o fluxo "{{flowName}}"? Esta ação não pode ser desfeita.',
        cancel: 'Cancelar',
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
        deleteStepMessage: 'Tem certeza de que deseja excluir "{{stepName}}"? Isso removerá todas as conexões com esta etapa.',
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
        manageMembersDescription: 'Convide e gerencie membros da equipe para {{tenant}}',
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
        manageCustomersDescription: 'Visualize e gerencie inscrições de clientes para {{tenant}}',
      },

      inbox: {
        title: 'Caixa de Entrada',
        messages: 'Mensagens',
        notifications: 'Notificações',
        unread: 'Não lidas',
        markAsRead: 'Marcar como Lida',
        markAllAsRead: 'Marcar Todas como Lidas',
        noMessages: 'Sem mensagens',
        emptyInbox: 'Sua caixa de entrada está vazia',
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
        customizeBranding: 'Personalize a marca, temas e detalhes da organização',
        manageOrganization: 'Gerenciar Organização',
        managePreferences: 'Gerencie as configurações e preferências da sua conta',
        manageProfile: 'Gerencie seu perfil, senha e preferências',
        manageAccount: 'Gerenciar Conta',
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
        signInDescription: 'Entrez vos identifiants pour accéder à votre compte',
        signInButton: 'Se Connecter',
        signingIn: 'Connexion...',

        // Sign Up
        signUp: "S'Inscrire",
        signUpTitle: 'Créer un Compte',
        signUpDescription: 'Inscrivez-vous pour un nouveau compte pour commencer',
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
        accountCreatedCanSignIn: 'Compte créé avec succès! Vous pouvez maintenant vous connecter avec votre nouveau compte.',
        checkEmail: 'Veuillez vérifier votre e-mail pour confirmer votre compte',
        invalidCredentials: 'E-mail ou mot de passe invalide',
        emailInUse: 'E-mail déjà utilisé',
        weakPassword: 'Le mot de passe est trop faible',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
        pleaseLogin: 'Veuillez vous connecter pour voir votre tableau de bord.',

        // Links
        forgotPassword: 'Mot de passe oublié?',
        resetPassword: 'Réinitialiser le Mot de Passe',
        dontHaveAccount: "Vous n'avez pas de compte?",
        alreadyHaveAccount: 'Vous avez déjà un compte?',
        signOut: 'Se Déconnecter',

        // Forgot Password
        forgotPasswordTitle: 'Réinitialiser le Mot de Passe',
        forgotPasswordDescription: 'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe',
        sendResetLink: 'Envoyer le Lien de Réinitialisation',
        sending: 'Envoi...',
        emailSent: 'E-mail Envoyé!',
        checkInbox: 'Vérifiez votre boîte de réception pour les instructions de réinitialisation du mot de passe',
        resetLinkSentTo: 'Nous avons envoyé un lien de réinitialisation du mot de passe à',
        didntReceiveEmail: "Vous n'avez pas reçu l'e-mail? Vérifiez votre dossier spam ou réessayez.",
        tryAgain: 'Réessayer',
        backToSignIn: 'Retour à la Connexion',
        rememberPassword: 'Vous vous souvenez de votre mot de passe? Connectez-vous',
        needNewAccount: 'Besoin d\'un nouveau compte?',
        failedToSendReset: 'Échec de l\'envoi de l\'e-mail de réinitialisation',
        enterEmailAddress: 'Veuillez entrer votre adresse e-mail',

        // Email Confirmation
        checkYourEmail: 'Vérifiez Votre E-mail',
        confirmYourEmail: 'Confirmez Votre E-mail',
        sendingConfirmation: 'Nous envoyons un e-mail de confirmation à {{email}}',
        enterEmailForConfirmation: 'Entrez votre adresse e-mail et nous vous enverrons un nouveau lien de confirmation',
        failedToResendConfirmation: 'Échec du renvoi de l\'e-mail de confirmation',
        confirmationEmailSent: 'E-mail de Confirmation Envoyé!',
        checkInboxForConfirmation: 'Vérifiez votre boîte de réception pour le lien de confirmation',
        sentNewConfirmationTo: 'Nous avons envoyé un nouvel e-mail de confirmation à',
        clickConfirmationLink: 'Veuillez vérifier votre e-mail et cliquer sur le lien de confirmation pour activer votre compte.',
        sendAnotherEmail: 'Envoyer un Autre E-mail',
        sendConfirmationEmail: 'Envoyer l\'E-mail de Confirmation',
        alreadyConfirmed: 'Déjà confirmé? Connectez-vous',

        // Email Confirmation Status
        confirmingEmail: 'Confirmation de l\'E-mail...',
        emailConfirmed: 'E-mail Confirmé!',
        confirmationFailed: 'Échec de la Confirmation',
        pleaseWaitConfirming: 'Veuillez patienter pendant que nous confirmons votre adresse e-mail.',
        emailConfirmedSuccess: 'Votre e-mail a été confirmé avec succès. Vous pouvez maintenant vous connecter à votre compte.',
        unableToConfirm: 'Nous n\'avons pas pu confirmer votre adresse e-mail.',
        confirmationLinkInvalid: 'Échec de la confirmation de l\'e-mail. Le lien peut être invalide ou avoir expiré.',
        noConfirmationToken: 'Aucun jeton de confirmation fourni.',
        redirectingToSignIn: 'Redirection vers la page de connexion dans 3 secondes...',
        continueToSignIn: 'Continuer vers la Connexion',
        goToSignIn: 'Aller à la Connexion',
        signUpAgain: 'S\'Inscrire à Nouveau',

        // Invite Context
        invitedToEnroll: 'Vous avez été invité à vous inscrire à {{flowName}}',
        signingInToJoin: 'Vous vous connectez pour rejoindre {{flowName}} chez {{tenantName}}',
        emailLockedFromInvite: 'E-mail verrouillé par invitation',

        // WhatsApp
        whatsappNumber: 'Numéro WhatsApp (Facultatif)',
        whatsappHelper: 'Facultatif - Ajoutez votre numéro WhatsApp pour recevoir des notifications',

        // Opt-ins
        agreeToReceiveUpdates: 'J\'accepte de recevoir des mises à jour/e-mails de cette application',

        // Validation
        validatingInvite: 'Validation de l\'invitation...',
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
        getStarted: 'Commencez par créer une organisation pour gérer les flux et les équipes',

        // Organization Cards
        yourOrganizations: 'Vos Organisations',
        allOrganizations: 'Toutes',
        activeFlows: 'Flux Actifs',
        recent: 'Récent',
        moreFlows: '+{{count}} de plus',
        viewOrganization: "Voir l'Organisation",

        // Empty States
        noAccess: "Vous n'avez pas encore accès à une organisation",
        contactAdmin: 'Contactez un administrateur pour être invité à une organisation',
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
        noFlows: "Pas encore de flux",
        createFirst: 'Créez votre premier flux pour commencer',
        flowBuilder: 'Constructeur de Flux',
        addStep: 'Ajouter une Étape',
        deleteStep: "Supprimer l'Étape",
        connectSteps: 'Connecter les Étapes',

        // Dashboard Card
        manageFlows: 'Gérer les Flux',
        manageFlowsDescription: 'Créez et gérez les flux de statut pour {{tenant}}',

        // Management
        backToDashboard: 'Retour au Tableau de Bord',
        flowManagement: 'Gestion des Flux',
        manageWorkflows: 'Gérez vos flux de suivi de statut',
        managingFor: 'Gestion des flux pour {{tenant}}',
        noOrgSelected: 'Aucune Organisation Sélectionnée',
        selectOrgPrompt: 'Veuillez sélectionner une organisation depuis le tableau de bord pour gérer les flux',
        searchFlows: 'Rechercher des flux...',
        loadingFlows: 'Chargement des flux...',
        errorLoadingFlows: 'Erreur lors du chargement des flux',
        noFlowsFound: 'Aucun flux trouvé',
        noFlowsMatchSearch: 'Aucun flux ne correspond à votre recherche',
        tryDifferentSearch: 'Essayez différents termes de recherche ou créez un nouveau flux',
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
        inviteOthersTo: "Invitez d'autres personnes à s'inscrire à {{flowName}}",
        emailInvite: 'Invitation par E-mail',
        qrCode: 'Code QR',
        copyUrl: "Copier l'URL",
        inviteViaEmail: 'Inviter par E-mail',
        inviteByEmailDesc: "Envoyez un lien d'invitation directement à leur e-mail",
        sendInvite: "Envoyer l'Invitation",
        sending: 'Envoi...',
        inviteSentSuccess: 'Invitation envoyée avec succès !',
        inviteSentTo: 'Invitation envoyée à {{email}}',
        failedToSendInvite: "Échec de l'envoi de l'invitation. Veuillez réessayer.",
        scanQrCode: 'Scanner le Code QR',
        scanQrCodeDesc: 'Scannez ce code QR pour vous inscrire au flux',
        copyInviteUrl: "Copier l'URL d'Invitation",
        copyInviteUrlDesc: "Copiez et partagez ce lien d'invitation",
        copyLink: 'Copier le Lien',
        linkCopied: 'Lien copié !',
        linkCopiedToClipboard: "Le lien d'invitation a été copié dans le presse-papiers",
        failedToCopyLink: 'Échec de la copie du lien. Veuillez le copier manuellement.',
        enterEmailAddress: 'Entrez une adresse e-mail',
        close: 'Fermer',

        // Delete Confirmation
        deleteFlowTitle: 'Supprimer le Flux',
        deleteFlowMessage: 'Êtes-vous sûr de vouloir supprimer le flux "{{flowName}}" ? Cette action ne peut pas être annulée.',
        cancel: 'Annuler',
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
        deleteStepMessage: 'Êtes-vous sûr de vouloir supprimer "{{stepName}}" ? Cela supprimera toutes les connexions à cette étape.',
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
        manageMembersDescription: "Invitez et gérez les membres de l'équipe pour {{tenant}}",
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
        manageCustomersDescription: 'Visualisez et gérez les inscriptions des clients pour {{tenant}}',
      },

      inbox: {
        title: 'Boîte de Réception',
        messages: 'Messages',
        notifications: 'Notifications',
        unread: 'Non lus',
        markAsRead: 'Marquer comme Lu',
        markAllAsRead: 'Tout Marquer comme Lu',
        noMessages: 'Aucun message',
        emptyInbox: 'Votre boîte de réception est vide',
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
        customizeBranding: "Personnalisez la marque, les thèmes et les détails de l'organisation",
        manageOrganization: "Gérer l'Organisation",
        managePreferences: 'Gérez les paramètres et préférences de votre compte',
        manageProfile: 'Gérez votre profil, mot de passe et préférences',
        manageAccount: 'Gérer le Compte',
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
