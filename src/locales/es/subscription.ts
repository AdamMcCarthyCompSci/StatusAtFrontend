export default {
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

  // Subscription Plan Details
  plans: {
    FREE: {
      name: 'Modo Administrador',
      price: '€0',
      period: 'ilimitado',
      description:
        'Acceso completo para pruebas y administración (no es una prueba)',
      features: {
        unlimitedUpdates: 'Actualizaciones de estado ilimitadas',
        unlimitedCases: 'Casos activos ilimitados',
        unlimitedManagers: 'Gerentes ilimitados',
        allFeaturesEnabled: 'Todas las funciones habilitadas',
        internalUse: 'Solo para uso interno',
      },
    },
    CREATED: {
      name: 'Configuración Pendiente',
      price: '€0',
      period: 'no activo',
      description: 'Organización creada pero aún no configurada',
      features: {
        noUpdates: 'No hay actualizaciones de estado disponibles',
        setupRequired: 'Se requiere configuración',
      },
      limitations: {
        cannotSendUpdates: 'No se pueden enviar actualizaciones de estado',
        mustSelectPlan: 'Debe seleccionar un plan de suscripción',
      },
    },
    CANCELLED: {
      name: 'Cancelado',
      price: '€0',
      period: 'inactivo',
      description: 'La suscripción ha sido cancelada',
      features: {
        noUpdates: 'No hay actualizaciones de estado disponibles',
        readOnlyAccess: 'Acceso de solo lectura a datos históricos',
      },
      limitations: {
        cannotSendUpdates: 'No se pueden enviar actualizaciones de estado',
        cannotCreateCases: 'No se pueden crear nuevos casos',
        reactivationRequired: 'Se requiere reactivación',
      },
    },
    STARTER: {
      name: 'Inicial',
      price: '€49',
      period: 'por mes',
      description:
        'Ideal para profesionales independientes y pequeñas empresas que están comenzando',
      features: {
        activeCases: '25 casos activos',
        statusUpdates: '100 actualizaciones de estado/mes',
        managers: '1 gerente',
        subdomain: 'statusat.com/EMPRESA',
        noBranding: 'Sin marca personalizada',
        priorityEmail: 'Email Prioritario (24h)',
      },
      limitations: {
        limitedCases: 'Solo 25 casos activos',
        limitedUpdates: 'Solo 100 actualizaciones de estado/mes',
        limitedManagers: 'Solo 1 gerente',
        noCustomBranding: 'Sin marca personalizada',
        limitedToSubdomain: 'Limitado a subdominio',
      },
    },
    PROFESSIONAL: {
      name: 'Profesional',
      price: '€99',
      period: 'por mes',
      description:
        'Ideal para empresas de servicios en crecimiento con múltiples miembros del equipo',
      features: {
        activeCases: '100 casos activos',
        statusUpdates: '500 actualizaciones de estado/mes',
        managers: '5 gerentes',
        subdomain: 'statusat.com/EMPRESA',
        uploadLogo: 'Subir logo',
        priorityEmail: 'Email prioritario (24h)',
      },
      limitations: {
        limitedCases: 'Solo 100 casos activos',
        limitedUpdates: 'Solo 500 actualizaciones de estado/mes',
        limitedManagers: 'Solo 5 gerentes',
        limitedToSubdomain: 'Limitado a subdominio',
        noCustomColors: 'Sin colores personalizados',
        noDedicatedManager: 'Sin gerente dedicado',
      },
    },
    ENTERPRISE: {
      name: 'Empresarial',
      price: '€199',
      period: 'por mes',
      description:
        'Ideal para empresas más grandes y organizaciones con necesidades específicas',
      features: {
        unlimitedCases: 'Casos activos ilimitados',
        statusUpdates: '2000 actualizaciones de estado/mes',
        unlimitedManagers: 'Gerentes ilimitados',
        customSubdomain: 'EMPRESA.statusat.com',
        brandColors: 'Colores de marca y subir logo',
        dedicatedSupport: 'Soporte dedicado',
      },
    },
  },
};
