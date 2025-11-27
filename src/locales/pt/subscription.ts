export default {
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

  // Subscription Plan Details
  plans: {
    FREE: {
      name: 'Modo Administrador',
      price: '€0',
      period: 'ilimitado',
      description:
        'Acesso completo para testes e administração (não é uma avaliação)',
      features: {
        unlimitedUpdates: 'Atualizações de status ilimitadas',
        unlimitedCases: 'Casos ativos ilimitados',
        unlimitedManagers: 'Gerentes ilimitados',
        allFeaturesEnabled: 'Todos os recursos habilitados',
        internalUse: 'Apenas para uso interno',
      },
    },
    CREATED: {
      name: 'Configuração Pendente',
      price: '€0',
      period: 'não ativo',
      description: 'Organização criada mas ainda não configurada',
      features: {
        noUpdates: 'Nenhuma atualização de status disponível',
        setupRequired: 'Configuração necessária',
      },
      limitations: {
        cannotSendUpdates: 'Não é possível enviar atualizações de status',
        mustSelectPlan: 'Deve selecionar um plano de assinatura',
      },
    },
    CANCELLED: {
      name: 'Cancelado',
      price: '€0',
      period: 'inativo',
      description: 'A assinatura foi cancelada',
      features: {
        noUpdates: 'Nenhuma atualização de status disponível',
        readOnlyAccess: 'Acesso somente leitura a dados históricos',
      },
      limitations: {
        cannotSendUpdates: 'Não é possível enviar atualizações de status',
        cannotCreateCases: 'Não é possível criar novos casos',
        reactivationRequired: 'Reativação necessária',
      },
    },
    STARTER: {
      name: 'Inicial',
      price: '€49',
      period: 'por mês',
      description:
        'Ideal para profissionais independentes e pequenas empresas começando',
      features: {
        activeCases: '25 casos ativos',
        statusUpdates: '100 atualizações de status/mês',
        managers: '1 gerente',
        subdomain: 'statusat.com/EMPRESA',
        noBranding: 'Sem marca personalizada',
        priorityEmail: 'Email Prioritário (24h)',
      },
      limitations: {
        limitedCases: 'Apenas 25 casos ativos',
        limitedUpdates: 'Apenas 100 atualizações de status/mês',
        limitedManagers: 'Apenas 1 gerente',
        noCustomBranding: 'Sem marca personalizada',
        limitedToSubdomain: 'Limitado ao subdomínio',
      },
    },
    PROFESSIONAL: {
      name: 'Profissional',
      price: '€99',
      period: 'por mês',
      description:
        'Ideal para empresas de serviços em crescimento com vários membros da equipe',
      features: {
        activeCases: '100 casos ativos',
        statusUpdates: '500 atualizações de status/mês',
        managers: '5 gerentes',
        subdomain: 'statusat.com/EMPRESA',
        uploadLogo: 'Enviar logo',
        priorityEmail: 'Email prioritário (24h)',
      },
      limitations: {
        limitedCases: 'Apenas 100 casos ativos',
        limitedUpdates: 'Apenas 500 atualizações de status/mês',
        limitedManagers: 'Apenas 5 gerentes',
        limitedToSubdomain: 'Limitado ao subdomínio',
        noCustomColors: 'Sem cores personalizadas',
        noDedicatedManager: 'Sem gerente dedicado',
      },
    },
    ENTERPRISE: {
      name: 'Empresarial',
      price: '€199',
      period: 'por mês',
      description:
        'Ideal para grandes empresas e organizações com necessidades específicas',
      features: {
        unlimitedCases: 'Casos ativos ilimitados',
        statusUpdates: '2000 atualizações de status/mês',
        unlimitedManagers: 'Gerentes ilimitados',
        customSubdomain: 'EMPRESA.statusat.com',
        brandColors: 'Cores da marca e enviar logo',
        dedicatedSupport: 'Suporte dedicado',
      },
    },
  },
};
