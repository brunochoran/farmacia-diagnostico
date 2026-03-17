export default function ScreenPresentation({ onStart }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-white">
      {/* Marca / topo */}
      <div className="mb-10 text-center">
        <span className="inline-block bg-brand/10 text-brand text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-6">
          Diagnóstico Digital
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4 max-w-sm mx-auto">
          Como está o marketing digital da sua farmácia?
        </h1>

        <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
          6 minutos. Diagnóstico honesto.<br />
          Baseado em benchmarks reais do mercado.
        </p>
      </div>

      {/* Destaques */}
      <div className="w-full max-w-sm space-y-3 mb-10">
        {[
          { icon: '📊', text: '18 perguntas em 6 áreas estratégicas' },
          { icon: '🎯', text: 'Scorecard visual com nota por área' },
          { icon: '💰', text: 'Estimativa do faturamento que você está perdendo' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-gray-50 px-4 py-3">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-gray-700 font-medium">{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full max-w-sm bg-brand hover:bg-brand-dark active:scale-95 text-white font-bold text-base py-4 px-8 transition-all duration-150"
      >
        Iniciar diagnóstico
      </button>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Sem cadastro. Resultado imediato.
      </p>
    </div>
  )
}
