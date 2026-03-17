// ============================================================
// CONFIGURAÇÃO DA AGÊNCIA — edite aqui antes de publicar
// ============================================================

export const WHATSAPP_URL =
  'https://wa.me/55SEUNUMERO?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20diagn%C3%B3stico%20digital%20e%20gostaria%20de%20conversar.'

export const AGENCY_NAME = 'C2G'
export const EVENT_NAME = 'Pharma Share 2026'

// Benchmarks de referência (baseados em cases reais)
export const BENCHMARK_INVESTIMENTO = 3000   // verba mensal de referência (R$)
export const BENCHMARK_CPL = 7.50            // custo por conversa benchmark
export const BENCHMARK_CONVERSAS = 400       // conversas/mês com a verba de referência
export const BENCHMARK_CONVERSAO = 0.70      // taxa de conversão de referência
export const BENCHMARK_VENDAS = 280          // vendas/mês benchmark

// Ticket médio por faixa selecionada pelo usuário
export const TICKET_OPTIONS = [
  { label: 'Menos de R$80',         value: 60  },
  { label: 'Entre R$80 e R$150',    value: 115 },
  { label: 'Entre R$150 e R$300',   value: 225 },
  { label: 'Acima de R$300',        value: 400 },
]

// Perfis de maturidade
export const MATURITY_PROFILES = [
  {
    min: 0,
    max: 15,
    name: 'Farmácia Invisível',
    color: '#E24B4A',
    description:
      'Você tem um negócio com demanda, margem e autoridade técnica. Mas no digital, ainda está no improviso — ou parado por medo. A boa notícia: quase tudo aqui muda com método. O verdadeiro risco não é anunciar — é continuar improvisando enquanto o mercado evolui.',
    ctaText:
      'Antes de investir em tráfego, vale entender o que está travando. Uma conversa pode poupar meses de tentativa e erro.',
  },
  {
    min: 16,
    max: 27,
    name: 'Farmácia que Anuncia mas Não Tem Sistema',
    color: '#EF9F27',
    description:
      'Você já deu os primeiros passos. Mas os resultados são inconsistentes porque faltam as peças que transformam anúncio em crescimento previsível: atendimento, oferta e jornada. Tráfego sem sistema é custo. Com sistema, é ativo.',
    ctaText:
      'Você já tem movimento. Falta a estrutura que transforma isso em resultado consistente e previsível.',
  },
  {
    min: 28,
    max: 38,
    name: 'Farmácia em Construção',
    color: '#5DCAA5',
    description:
      'Você tem mais estrutura do que a maioria do setor. Os gargalos que restam são os que separam crescimento consistente de crescimento previsível. Suas ações precisam suportar suas ambições.',
    ctaText:
      'Você está perto. Os próximos movimentos são os que mais impactam — e costumam ser mais simples do que parecem.',
  },
  {
    min: 39,
    max: 45,
    name: 'Farmácia Referência',
    color: '#1D9E75',
    description:
      'Você construiu algo raro no setor magistral: uma operação de marketing com método. Atendimento, oferta, mídia e posicionamento funcionando juntos. O desafio agora é escala.',
    ctaText:
      'A conversa agora é sobre onde escalar com mais segurança e previsibilidade.',
  },
]
