import { useState } from 'react'
import { AGENCY_NAME } from '../config.js'

function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function maskCurrency(value) {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  if (!digits) return ''
  const num = parseInt(digits, 10) / 100
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseCurrency(masked) {
  return masked.replace(/\D/g, '')
}

const WHATSAPP_NUMBER = '551152427599'

function buildWhatsAppMessage({ nome, telefone, email, empresa, site, faturamentoMensal, profileName, totalScore, pharmaId }) {
  const linhas = [
    `Olá equipe ${AGENCY_NAME}! 👋`,
    ``,
    `Acabei de fazer o *Diagnóstico Digital* e gostaria de conversar.`,
    ``,
    `📋 *Meu Resultado*`,
    `Perfil: ${profileName}`,
    `Score: ${totalScore}/45`,
    ``,
    `👤 *Meus Dados*`,
    `Nome: ${nome}`,
    `Tel: ${telefone}`,
    email ? `Email: ${email}` : null,
    empresa ? `Empresa: ${empresa}` : null,
    site ? `Site: ${site}` : null,
    faturamentoMensal ? `Faturamento médio: ${faturamentoMensal}` : null,
    pharmaId ? `\nID: ${pharmaId}` : null,
  ].filter(Boolean).join('\n')

  return encodeURIComponent(linhas)
}

export default function ScreenForm({ profileName, totalScore, pharmaId, onSubmit, onBack }) {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    empresa: '',
    site: '',
    faturamentoMensal: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    let masked = value
    if (name === 'telefone') masked = maskPhone(value)
    if (name === 'faturamentoMensal') masked = maskCurrency(value)
    setForm(prev => ({ ...prev, [name]: masked }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.nome.trim()) errs.nome = 'Informe seu nome'
    if (!form.telefone.trim()) errs.telefone = 'Informe seu telefone'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    await onSubmit({ ...form, faturamentoMensal: parseCurrency(form.faturamentoMensal) })

    const msg = buildWhatsAppMessage({
      ...form,
      profileName,
      totalScore,
      pharmaId,
    })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  const inputClass = (field) =>
    `w-full border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-brand transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">← Voltar</button>
        <div className="flex-1" />
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-7">
        {/* Intro */}
        <div className="mb-7">
          <span className="inline-block bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4">
            Antes de conversar
          </span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Para a conversa ser mais produtiva, precisamos de algumas informações
          </h2>
          <p className="text-sm text-gray-400">
            Levamos seu diagnóstico para a reunião — sem você precisar explicar do zero.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className={inputClass('nome')}
            />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              WhatsApp / Telefone <span className="text-red-400">*</span>
            </label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              inputMode="tel"
              className={inputClass('telefone')}
            />
            {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={inputClass('email')}
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Nome da farmácia
            </label>
            <input
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              placeholder="Farmácia Exemplo"
              className={inputClass('empresa')}
            />
          </div>

          {/* Site */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Site (se tiver)
            </label>
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              placeholder="www.suafarmacia.com.br"
              className={inputClass('site')}
            />
          </div>

          {/* Faturamento */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Faturamento médio mensal (R$)
            </label>
            <input
              name="faturamentoMensal"
              value={form.faturamentoMensal}
              onChange={handleChange}
              placeholder="R$ 0,00"
              inputMode="numeric"
              className={inputClass('faturamentoMensal')}
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark active:scale-95 text-white font-black text-sm py-4 px-6 transition-all duration-150 disabled:opacity-60"
            >
              {loading ? 'Enviando...' : `Falar com a equipe ${AGENCY_NAME} no WhatsApp →`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Você será direcionado para o WhatsApp com seu diagnóstico em mãos.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
