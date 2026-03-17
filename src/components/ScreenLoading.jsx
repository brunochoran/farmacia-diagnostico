import { useEffect } from 'react'

const STEPS = [
  'Calculando seu score por área...',
  'Identificando gargalos críticos...',
  'Estimando potencial de faturamento...',
  'Montando seu diagnóstico...',
]

export default function ScreenLoading({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50 px-8">
      {/* Spinner */}
      <div className="mb-10 relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-brand/20 border-t-brand animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-brand/10" />
        </div>
      </div>

      <p className="text-gray-800 font-bold text-lg text-center mb-2">
        Analisando seu diagnóstico
      </p>
      <p className="text-gray-400 text-sm text-center mb-10">
        Isso leva apenas alguns segundos...
      </p>

      {/* Steps animados */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 opacity-0"
            style={{ animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${i * 0.55}s` }}
          >
            <div
              className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 opacity-0"
              style={{ animation: `fadeInUp 0.3s ease forwards`, animationDelay: `${i * 0.55 + 0.1}s` }}
            >
              <div className="w-2 h-2 rounded-full bg-brand" />
            </div>
            <p className="text-xs text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
