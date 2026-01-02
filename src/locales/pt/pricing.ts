export default {
  // SEO
  seo: {
    title: 'Preços - Planos simples e transparentes | StatusAt',
    description:
      'Escolha o plano perfeito para o seu negócio. Três níveis de preços transparentes a partir de €49/mês com teste gratuito de 7 dias. Sem taxas ocultas, cancele a qualquer momento.',
    keywords:
      'preços, planos, assinatura, custo, preços de rastreamento de status, software de fluxo de trabalho acessível',
  },

  // Hero Section
  hero: {
    title: 'Preços',
    titleHighlight: 'simples e transparentes',
    title2: '',
    subtitle: 'Escolha o plano certo para o seu negócio',
    trialInfo:
      'Teste grátis de 7 dias • Cancele a qualquer momento • Comece em minutos',
  },

  // Pricing Plans
  plans: {
    starter: {
      name: 'Starter',
      price: '€49',
      period: '/mês',
      description:
        'Ideal para profissionais autônomos e pequenas empresas que estão começando',
      features: [
        '25 casos ativos',
        '100 atualizações de status/mês',
        '1 gerente',
        'Sem marca personalizada',
        'Email prioritário (24h)',
        'Notificações por email e WhatsApp',
        'Fluxos de status personalizados',
        'Gestão de documentos',
        'Inscrição por código QR',
        'Portal responsivo para móveis',
      ],
      cta: 'Iniciar teste de 7 dias',
    },
    professional: {
      name: 'Professional',
      price: '€99',
      period: '/mês',
      description:
        'Ideal para empresas de serviços em crescimento com vários membros da equipe',
      features: [
        '100 casos ativos',
        '500 atualizações de status/mês',
        '5 gerentes',
        'Carregar logotipo',
        'Email prioritário (24h)',
        'Notificações por email e WhatsApp',
        'Fluxos de status personalizados',
        'Gestão de documentos',
        'Inscrição por código QR',
        'Portal responsivo para móveis',
        'Acesso multiusuário',
      ],
      popular: 'Mais popular',
      cta: 'Iniciar teste de 7 dias',
    },
    enterprise: {
      name: 'Enterprise',
      price: '€199',
      period: '/mês',
      description:
        'Ideal para empresas maiores e organizações com necessidades específicas',
      features: [
        'Casos ativos ilimitados',
        '2000 atualizações de status/mês',
        'Gerentes ilimitados',
        'Cores da marca e carregar logotipo',
        'Suporte dedicado',
        'Notificações por email e WhatsApp',
        'Fluxos de status personalizados',
        'Gestão de documentos',
        'Inscrição por código QR',
        'Portal responsivo para móveis',
        'Acesso multiusuário',
        'Solicitações de recursos prioritárias',
      ],
      cta: 'Iniciar teste de 7 dias',
    },
  },

  // Feature Comparison Table
  comparison: {
    title: 'Comparar todas as funcionalidades',
    subtitle: 'Veja exatamente o que você obtém com cada plano',
    categories: {
      core: 'Funcionalidades principais',
      branding: 'Marca e personalização',
      communication: 'Comunicação',
      support: 'Suporte',
      advanced: 'Funcionalidades avançadas',
    },
    features: {
      activeCases: 'Casos ativos',
      statusUpdates: 'Atualizações de status por mês',
      managers: 'Gerentes da equipe',
      customFlows: 'Fluxos de status personalizados',
      documentManagement: 'Gestão de documentos',
      qrEnrollment: 'Inscrição por código QR',
      mobilePortal: 'Portal responsivo para móveis',
      uploadLogo: 'Carregar logotipo',
      brandColors: 'Cores da marca personalizadas',
      emailNotifications: 'Notificações por email',
      whatsappNotifications: 'Notificações por WhatsApp',
      multiUserAccess: 'Acesso multiusuário',
      priorityEmail: 'Suporte prioritário por email',
      dedicatedSupport: 'Suporte dedicado',
      priorityFeatures: 'Solicitações de recursos prioritárias',
    },
    values: {
      unlimited: 'Ilimitado',
      included: 'Incluído',
      notIncluded: 'Não incluído',
    },
  },

  // FAQ Section
  faq: {
    title: 'Perguntas frequentes',
    subtitle: 'Tudo o que você precisa saber sobre nossos preços',
    questions: [
      {
        q: 'Como funciona o teste gratuito de 7 dias?',
        a: 'Comece a usar o StatusAt imediatamente com acesso completo a todas as funcionalidades do seu plano escolhido. Adicione seus detalhes de pagamento para começar, mas você só será cobrado após 7 dias. Cancele a qualquer momento durante o teste sem custo.',
      },
      {
        q: 'Posso mudar de plano mais tarde?',
        a: 'Com certeza! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ao fazer upgrade, você obterá acesso imediato às novas funcionalidades e será cobrado um valor proporcional. Ao fazer downgrade, as alterações entram em vigor no seu próximo ciclo de faturamento.',
      },
      {
        q: 'Existe contrato ou compromisso?',
        a: 'Sem contratos, sem compromissos. Todos os planos são faturados mensalmente e você pode cancelar a qualquer momento.',
      },
      {
        q: 'Quais métodos de pagamento vocês aceitam?',
        a: 'Aceitamos todos os principais cartões de crédito (Visa, Mastercard, American Express) e cartões de débito. Todos os pagamentos são processados com segurança através do Stripe.',
      },
      {
        q: 'Vocês oferecem reembolsos?',
        a: 'Se você cancelar nos primeiros 7 dias, pode solicitar um reembolso total. Depois disso, você pode cancelar a qualquer momento, mas nenhum reembolso será emitido pelo tempo não utilizado.',
      },
      {
        q: 'Posso obter desconto para faturamento anual?',
        a: 'Atualmente oferecemos apenas faturamento mensal. No entanto, ocasionalmente realizamos promoções - consulte nossas páginas de destino para códigos de cupom como VISA10 ou LAW10 para 10% de desconto!',
      },
      {
        q: 'E quanto à privacidade e segurança dos dados?',
        a: 'A segurança dos seus dados é nossa prioridade. Todos os dados são criptografados em trânsito e em repouso. Estamos em conformidade com o RGPD e nunca vendemos seus dados. Você é o proprietário dos seus dados e pode excluí-los a qualquer momento.',
      },
    ],
  },

  // CTA Section
  cta: {
    title: 'Pronto para começar?',
    subtitle:
      'Junte-se a centenas de empresas que usam StatusAt para manter seus clientes informados',
    button: 'Inicie seu teste gratuito',
    noCredit: 'Teste grátis de 7 dias • Cancele a qualquer momento',
  },
};
