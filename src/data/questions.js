export const BLOCKS = [
  // ──────────────────────────────────────────────
  // BLOCO 0 — Atendimento (sem gateway)
  // ──────────────────────────────────────────────
  {
    id: 0,
    name: 'Atendimento',
    gateway: null,
    bottleneckTitle: 'Leads chegando, vendas vazando',
    bottleneckText:
      'Resposta lenta ou sem script de fechamento desperdiça cada lead gerado pelos anúncios. O tráfego fez o trabalho — o atendimento não estava pronto.',
    opportunityTitle: 'Atendimento acima da média — cada décimo percentual aqui vale mais que mais verba',
    opportunityText:
      'Você já converte bem. Pequenos ajustes no script de reativação e no follow-up podem aumentar a conversão sem precisar gerar mais leads.',
    questions: [
      {
        id: 'b0q0',
        text: 'Quanto tempo leva para responder um lead novo no WhatsApp?',
        options: [
          { label: 'Às vezes demora horas — depende de quem está no balcão', score: 0 },
          { label: 'Normalmente respondemos no mesmo dia', score: 1 },
          { label: 'Em até 30 minutos na maioria das vezes', score: 2 },
          { label: 'Temos automação — o lead é respondido na hora', score: 3 },
        ],
      },
      {
        id: 'b0q1',
        text: 'Quando o cliente pergunta o preço e some, o que acontece?',
        options: [
          { label: 'A gente perde — sem follow-up', score: 0 },
          { label: 'Às vezes mandamos uma mensagem depois, sem padrão', score: 1 },
          { label: 'Temos um script de reativação — a maioria volta', score: 3 },
        ],
      },
      {
        id: 'b0q2',
        text: 'Quem atende o WhatsApp tem treinamento para fechar venda?',
        options: [
          { label: 'Não — é mais informação do que venda', score: 0 },
          { label: 'Tem orientação informal, mas varia muito', score: 1 },
          { label: 'Sim — temos script e o time é treinado para converter', score: 3 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // BLOCO 1 — Anúncios
  // ──────────────────────────────────────────────
  {
    id: 1,
    name: 'Anúncios',
    gateway: 'Você investe em anúncios pagos atualmente?',
    bottleneckTitle: 'Anúncio sem oferta compete só no preço',
    bottleneckText:
      'Sem uma oferta de entrada clara, o criativo não tem razão para gerar ação imediata. Frete grátis, desconto na primeira compra ou brinde mudam esse jogo.',
    opportunityTitle: 'Estrutura de anúncios acima da média — o próximo salto é no criativo',
    opportunityText:
      'Você tem oferta, objetivo e estrutura. O que separa resultados bons de excepcionais agora é cadência de novos criativos e testes constantes.',
    questions: [
      {
        id: 'b1q0',
        text: 'Quando você pensa em investir em tráfego pago, o que aparece primeiro?',
        options: [
          { label: 'Medo — de bloqueio, de errar a comunicação, de gastar sem retorno', score: 0 },
          { label: 'Vontade, mas não sei por onde começar ou em quem confiar', score: 1 },
          { label: 'Clareza — sei o que fazer e tenho estrutura rodando', score: 3 },
        ],
      },
      {
        id: 'b1q1',
        text: 'Quando você anuncia, o criativo tem uma oferta específica?',
        options: [
          { label: 'Não — anunciamos a farmácia de forma geral', score: 0 },
          { label: 'Às vezes sim, mas não é regra', score: 1 },
          { label: 'Sim — sempre tem uma oferta clara de entrada', score: 3 },
        ],
      },
      {
        id: 'b1q2',
        text: 'Você aproveita cosméticos e suplementos para anunciar com mais liberdade?',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Às vezes, mas sem estratégia clara', score: 1 },
          { label: 'Sim — uso esses produtos como porta de entrada para novos clientes', score: 3 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // BLOCO 2 — Meta Ads
  // ──────────────────────────────────────────────
  {
    id: 2,
    name: 'Meta Ads',
    gateway: 'Você anuncia no Instagram ou Facebook (Meta Ads)?',
    bottleneckTitle: 'Impulsionamento não é tráfego',
    bottleneckText:
      'Post impulsionado tem objetivo de engajamento. Campanha de Mensagens tem objetivo de conversa. São ferramentas diferentes com resultados diferentes.',
    opportunityTitle: 'Meta Ads rodando bem — o ganho agora está na frequência de testes',
    opportunityText:
      'Campanha de mensagens, objetivo certo e rosto humano: você já faz o que a maioria ignora. Aumentar a cadência de criativos novos reduz o CPL sem aumentar verba.',
    questions: [
      {
        id: 'b2q0',
        text: 'Como você costuma anunciar no Instagram/Facebook?',
        options: [
          { label: 'Impulsiono posts pelo próprio Instagram, sem Gerenciador', score: 0 },
          { label: 'Uso o Gerenciador, mas sem muito critério nos objetivos', score: 1 },
          { label: 'Campanha de Mensagens para WhatsApp como foco principal', score: 3 },
        ],
      },
      {
        id: 'b2q1',
        text: 'Quem aparece nos vídeos dos seus anúncios?',
        options: [
          { label: 'Ninguém — usamos artes, encartes e fotos de produto', score: 0 },
          { label: 'Às vezes algum funcionário, mas não é padrão', score: 1 },
          { label: 'O dono ou a farmacêutica — câmera no rosto, todo mês', score: 3 },
        ],
      },
      {
        id: 'b2q2',
        text: 'Com que frequência os criativos são renovados?',
        options: [
          { label: 'O mesmo anúncio fica rodando meses — ou eu não sei dizer', score: 0 },
          { label: 'Troco quando percebo que parou de funcionar', score: 1 },
          { label: 'Troco constantemente — sempre tenho novos no ar', score: 3 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // BLOCO 3 — Presença Google
  // ──────────────────────────────────────────────
  {
    id: 3,
    name: 'Google',
    gateway: 'Você usa o Google para atrair clientes — seja com Google Ads ou com o perfil no Google Meu Negócio?',
    bottleneckTitle: 'Invisível para quem já quer comprar',
    bottleneckText:
      "Quem pesquisa 'farmácia de manipulação [cidade]' no Google já tem intenção de compra. Sem presença lá, você não existe para esse cliente.",
    opportunityTitle: 'Boa presença no Google — ainda tem intenção de compra para capturar',
    opportunityText:
      'Perfil otimizado e anúncios ativos é combinação que poucos têm. Revisar o caminho do clique até o WhatsApp pode melhorar ainda mais sua taxa de conversão.',
    questions: [
      {
        id: 'b3q0',
        text: 'Sua farmácia aparece quando alguém pesquisa no Google?',
        options: [
          { label: 'Não sei', score: 0 },
          { label: 'Aparece no Maps, mas não nos anúncios', score: 1 },
          { label: 'Sim — temos Google Ads ativo e perfil otimizado', score: 3 },
        ],
      },
      {
        id: 'b3q1',
        text: 'Como está seu perfil no Google Meu Negócio?',
        options: [
          { label: 'Nunca mexi — está como veio ou não existe', score: 0 },
          { label: 'Existe mas incompleto — sem fotos ou horário desatualizado', score: 1 },
          { label: 'Otimizado — fotos, produtos, avaliações respondidas', score: 3 },
        ],
      },
      {
        id: 'b3q2',
        text: 'Quando alguém chega no seu site pelo Google, o que acontece?',
        options: [
          { label: 'Não tenho site — ou tenho um que não converte', score: 0 },
          { label: 'A pessoa pode preencher um formulário ou clicar nos nossos contatos', score: 1 },
          { label: 'Cada clique vai direto para o WhatsApp — simples e rápido', score: 3 },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // BLOCO 4 — Autoridade & Posicionamento (sem gateway)
  // ──────────────────────────────────────────────
  {
    id: 4,
    name: 'Autoridade',
    gateway: null,
    bottleneckTitle: 'Autoridade que não aparece não converte',
    bottleneckText:
      'Você provavelmente tem credibilidade técnica. Mas sem presença consistente nas redes, ela fica restrita a quem já te conhece. Conteúdo e posicionamento resolvem isso.',
    opportunityTitle: 'Autoridade visível — consistência vai amplificar o alcance',
    opportunityText:
      'Você já aparece e educa. Manter a cadência e testar formatos novos como vídeos curtos costuma dobrar o alcance orgânico sem custo extra.',
    questions: [
      {
        id: 'b4q0',
        text: 'Com que frequência a farmácia publica nas redes sociais?',
        options: [
          { label: 'Raramente ou nunca — o perfil está parado', score: 0 },
          { label: 'Algumas vezes por mês, sem consistência', score: 1 },
          { label: 'Publicamos regularmente — pelo menos 3x por semana', score: 3 },
        ],
      },
      {
        id: 'b4q1',
        text: 'Sua farmácia posta conteúdo relevante além de promoções?',
        options: [
          { label: 'Não — o conteúdo é quase todo promocional (produto, preço, desconto)', score: 0 },
          { label: 'Às vezes publicamos algo educativo, mas sem consistência', score: 1 },
          {
            label:
              'Sim — temos conteúdo sobre sintomas, soluções e saúde personalizada de forma regular',
            score: 3,
          },
        ],
      },
      {
        id: 'b4q2',
        text: 'A farmácia tem um rosto humano nas redes sociais?',
        options: [
          { label: 'Não — o perfil é só artes, fotos de produto e texto', score: 0 },
          { label: 'Aparece às vezes, mas sem frequência ou estratégia', score: 1 },
          {
            label:
              'Sim — farmacêutico, dono ou colaborador aparece regularmente em vídeos',
            score: 3,
          },
        ],
      },
    ],
  },
]
