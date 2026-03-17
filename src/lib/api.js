import { supabase } from './supabase.js'

/**
 * Salva o resultado do diagnóstico e retorna o ID gerado.
 */
export async function saveDiagnostico({ pharmaId, totalScore, profileName, ticketAverage, answers, revenue }) {
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
    console.error('Erro ao salvar diagnóstico:', error)
    return null
  }
  return data.id
}

/**
 * Salva os dados do lead e retorna o ID gerado.
 */
export async function saveLead({ diagnosticoId, pharmaId, nome, telefone, email, empresa, site, faturamentoMensal }) {
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
    console.error('Erro ao salvar lead:', error)
    return null
  }
  return data.id
}
