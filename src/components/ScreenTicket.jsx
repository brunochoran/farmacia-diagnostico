import { useState } from 'react'

export default function ScreenTicket({ onSubmit, onBack }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    // Permite apenas dígitos
    const raw = e.target.value.replace(/\D/g, '')
    setValue(raw)
    setError('')
  }

  function handleSubmit() {
    const num = parseInt(value, 10)
    if (!num || num <= 0) {
      setError('Digite um valor válido em reais.')
      return
    }
    onSubmit(num)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  const isValid = parseInt(value, 10) > 0

  return (
    <div className="min-h-dvh flex flex-col px-6 py-10 bg-white max-w-lg mx-auto">
      {/* Voltar */}
      <button
        onClick={onBack}
        className="self-start text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-8 transition-colors"
      >
        ← Voltar
      </button>

      {/* Cabeçalho */}
      <div className="mb-8">
        <span className="inline-block bg-brand/10 text-brand text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-5">
          Pergunta inicial
        </span>
        <h2 className="text-xl font-bold text-gray-900 leading-snug">
          Qual é o ticket médio por pedido da sua farmácia?
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Usaremos esse valor para calcular a estimativa de faturamento.
        </p>
      </div>

      {/* Input */}
      <div className="flex-1">
        <label className="block text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">
          Valor médio por pedido
        </label>
        <div className="flex items-center border-2 border-gray-200 focus-within:border-brand transition-colors">
          <span className="px-4 py-4 text-gray-500 font-semibold text-sm border-r border-gray-200 bg-gray-50">
            R$
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 180"
            autoFocus
            className="flex-1 px-4 py-4 text-lg font-bold text-gray-900 outline-none bg-white placeholder-gray-300"
          />
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
        )}
        <p className="mt-3 text-xs text-gray-400">
          Se não souber o exato, coloque uma estimativa. Pode ser qualquer valor.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 font-bold text-sm transition-all duration-150 ${
            isValid
              ? 'bg-brand hover:bg-brand-dark active:scale-95 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
