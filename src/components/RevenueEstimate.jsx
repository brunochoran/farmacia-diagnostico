import { formatBRL } from '../utils/scoring.js'

function ProjectionRow({ label, value, isLast }) {
  return (
    <div className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  )
}

export default function RevenueEstimate({ revenue, ticketAverage }) {
  const { investimento, cpl, conversas, taxaConversao, vendas, faturamento, roas } = revenue

  const fmtNum = n => n.toLocaleString('pt-BR')
  const fmtPct = n => `${Math.round(n * 100)}%`

  return (
    <div className="bg-white px-5 py-5">
      <h3 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
        Estimativa financeira
      </h3>
      <p className="text-sm font-bold text-gray-900 mb-1">
        O que outras farmácias estão gerando com estrutura digital
      </p>
      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        Com base nos dados da nossa base de farmácias de manipulação, investindo{' '}
        <span className="font-semibold text-gray-600">{formatBRL(investimento)}/mês</span>{' '}
        em tráfego pago:
      </p>

      {/* Tabela de projeção */}
      <div className="border border-gray-200 px-4 mb-4">
        <ProjectionRow label="Custo por conversa (CPL)" value={formatBRL(cpl)} />
        <ProjectionRow label="Conversas geradas/mês" value={fmtNum(conversas)} />
        <ProjectionRow label="Taxa de conversão" value={fmtPct(taxaConversao)} />
        <ProjectionRow label="Vendas/mês" value={fmtNum(vendas)} />
        <ProjectionRow label="Ticket médio" value={formatBRL(ticketAverage)} isLast />
      </div>

      {/* Seta */}
      <div className="flex justify-center mb-3">
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-gray-200" />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M6 8L0 0h12L6 8z" fill="#d1d5db" />
          </svg>
        </div>
      </div>

      {/* Cards faturamento + ROAS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border-2 border-brand bg-brand/5 px-4 py-4 col-span-2">
          <p className="text-xs text-brand font-bold uppercase tracking-widest mb-1">
            Faturamento projetado/mês
          </p>
          <p className="text-3xl font-black text-brand leading-none">
            {formatBRL(faturamento)}
            <span className="text-sm font-normal text-brand/60 ml-1">/mês</span>
          </p>
        </div>
        <div className="border border-gray-200 bg-gray-50 px-4 py-3 col-span-2">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">ROAS</p>
          <p className="text-2xl font-black text-gray-800 leading-none">
            {roas.toFixed(1)}x
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Para cada R$1 investido → <span className="font-semibold text-gray-600">R${roas.toFixed(2)} em faturamento</span>
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Estimativa baseada em benchmarks reais de farmácias de manipulação com estrutura
        similar. Resultados variam conforme operação e mercado local.
      </p>
    </div>
  )
}
