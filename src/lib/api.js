import { supabase } from './supabase.js'

export async function saveDiagnostico({ pharmaId, totalScore, profileName, ticketAverage, answers, revenue }) {
  if (!supabase) {
    console.error('[saveDiagnostico] Supabase não inicializado — verifique as variáveis de ambiente no Vercel.')
    return null
  }

  console.log('[saveDiagnostico] Salvando...', { pharmaId, totalScore, profileName })

  const { data, error } = await supabase
    .from('diagnosticos')
    .insert({
      pharma_id: pharmaId || null,
      total_score: totalScore,
      profile_name: profileName,
      ticket_average: ticketAverage,
      answers,
      revenue,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[saveDiagnostico] Erro:', error.message, error)
    return null
  }

  console.log('[saveDiagnostico] Salvo com ID:', data.id)
  return data.id
}

export async function saveLead({ diagnosticoId, pharmaId, nome, telefone, email, empresa, site, faturamentoMensal }) {
  if (!supabase) {
    console.error('[saveLead] Supabase não inicializado — verifique as variáveis de ambiente no Vercel.')
    return null
  }

  console.log('[saveLead] Salvando...', { nome, telefone, diagnosticoId })

  const { data, error } = await supabase
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
    .select('id')
    .single()

  if (error) {
    console.error('[saveLead] Erro:', error.message, error)
    return null
  }

  console.log('[saveLead] Salvo com ID:', data.id)
  return data.id
}
