import { useState } from 'react'
import { AGENCY_NAME } from '../config.js'

function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

function maskCurrency(value) {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  if (!digits) return ''
  const num = parseInt(digits, 10) / 100
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function parseCurrency(masked) {
  return masked.replace(/\D/g, '')
}

const WHATSAPP_NUMBER = '551152427599'

function buildWhatsAppMessage({ pharmaId }) {
  const linhas = [
    `Olá equipe ${AGENCY_NAME}!`,
    ``,
    `Acabei de fazer o *Diagnóstico Digital* e gostaria de conversar.`,
    pharmaId ? `ID: ${pharmaId}` : null,
  ].filter(Boolean).join('\n')
  return encodeURIComponent(linhas)
}

export default function LeadFormCard({ pharmaId, onSubmit }) {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', empresa: '', site: '', faturamentoMensal: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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
    try {
      await onSubmit({ ...form, faturamentoMensal: parseCurrency(form.faturamentoMensal) })
    } catch (err) {
      console.error('Erro ao salvar:', err)
    }
    const msg = buildWhatsAppMessage({ pharmaId })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setLoading(false)
    setSubmitted(true)
  }

  const inputClass = (field) =>
    `w-full border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-brand transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`

  if (submitted) {
    return (
      <div className="bg-white border border-gray-100 px-6 py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Dados enviados!</h3>
        <p className="text-sm text-gray-400">
          O WhatsApp foi aberto. Nossa equipe vai entrar em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100">
      <div className="px-6 pt-6 pb-2">
        <span className="inline-block bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4">
          Próximo passo
        </span>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Para a conversa ser mais produtiva, precisamos de algumas informações
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          Levamos seu diagnóstico para a reunião — sem você precisar explicar do zero.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Nome <span className="text-red-400">*</span>
          </label>
          <input name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome completo" className={inputClass('nome')} />
          {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            WhatsApp / Telefone <span className="text-red-400">*</span>
          </label>
          <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" inputMode="tel" className={inputClass('telefone')} />
          {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">E-mail</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClass('email')} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nome da farmácia</label>
          <input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Farmácia Exemplo" className={inputClass('empresa')} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Site (se tiver)</label>
          <input name="site" value={form.site} onChange={handleChange} placeholder="www.suafarmacia.com.br" className={inputClass('site')} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Faturamento médio mensal (R$)</label>
          <input name="faturamentoMensal" value={form.faturamentoMensal} onChange={handleChange} placeholder="R$ 0" inputMode="numeric" className={inputClass('faturamentoMensal')} />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark active:scale-95 text-white font-black text-sm py-4 px-6 transition-all duration-150 disabled:opacity-60"
          >
            {loading ? 'Enviando...' : `Falar com a equipe ${AGENCY_NAME} no WhatsApp →`}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Você será direcionado para o WhatsApp com seu diagnóstico em mãos.
          </p>
        </div>
      </form>
    </div>
  )
}
