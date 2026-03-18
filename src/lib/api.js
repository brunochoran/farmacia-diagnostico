import { supabase } from './supabase.js'

export async function saveDiagnostico({ pharmaId, totalScore, profileName, ticketAverage, answers, revenue }) {
  if (!supabase) {
    console.error('[saveDiagnostico] Supabase não inicializado.')
    return null
  }

  const id = crypto.randomUUID()

  const { error } = await supabase
    .from('diagnosticos')
    .insert({
      id,
      pharma_id: pharmaId || null,
      total_score: totalScore,
      profile_name: profileName,
      ticket_average: ticketAverage,
      answers,
      revenue,
    })

  if (error) {
    console.error('[saveDiagnostico] Erro:', error.message, error)
    return null
  }

  console.log('[saveDiagnostico] Salvo com sucesso, id:', id)
  return id
}

export async function saveLead({ diagnosticoId, pharmaId, nome, telefone, email, empresa, site, faturamentoMensal, profileName, totalScore }) {
  if (!supabase) {
    console.error('[saveLead] Supabase não inicializado.')
    return null
  }

  const { error } = await supabase
    .from('leads')
    .insert({
      diagnostico_id: diagnosticoId || null,
      pharma_id: pharmaId || null,
      nome,
      telefone,
      email: email || null,
      empresa: empresa || null,
      site: site || null,
      faturamento_mensal: faturamentoMensal ? parseInt(faturamentoMensal, 10) : null,
    })

  if (error) {
    console.error('[saveLead] Erro:', error.message, error)
    return null
  }

  console.log('[saveLead] Salvo com sucesso')

  // Envia para o Kommo via Vercel Function (fire-and-forget, não bloqueia o fluxo)
  fetch('/api/kommo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, telefone, email, empresa, site, faturamentoMensal, profileName, totalScore, pharmaId }),
  })
    .then(r => r.json())
    .then(d => console.log('[Kommo] Resposta:', d))
    .catch(err => console.error('[Kommo] Erro ao chamar function:', err))

  return true
}
