import { BLOCKS } from '../data/questions.js'
import { MATURITY_PROFILES, BENCHMARK_INVESTIMENTO, BENCHMARK_CPL, BENCHMARK_CONVERSAS, BENCHMARK_CONVERSAO, BENCHMARK_VENDAS } from '../config.js'

/**
 * Soma os scores das 3 perguntas de um bloco.
 * @param {number} blockId - índice do bloco (0-5)
 * @param {Object} answers - mapa { b0q0: score, ... }
 * @returns {number} 0-9
 */
export function getBlockScore(blockId, answers) {
  const block = BLOCKS[blockId]
  return block.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
}

/**
 * Converte pontuação bruta do bloco em nota de 1 a 5.
 * @param {number} score - 0-9
 * @returns {number} 1-5
 */
export function getBlockNote(score) {
  if (score <= 1) return 1
  if (score <= 3) return 2
  if (score <= 5) return 3
  if (score <= 7) return 4
  return 5
}

/**
 * Soma total de todos os blocos.
 * @param {Object} answers
 * @returns {number} 0-54
 */
export function getTotalScore(answers) {
  return BLOCKS.reduce((sum, block) => sum + getBlockScore(block.id, answers), 0)
}

/**
 * Nota geral de 1.0 a 5.0 para exibir no card.
 * @param {number} totalScore - 0-54
 * @returns {string} ex: "3.4"
 */
export function getOverallNote(totalScore) {
  const note = 1 + (totalScore / 45) * 4
  return Math.min(5, Math.max(1, note)).toFixed(1)
}

/**
 * Retorna o perfil de maturidade com base na pontuação total.
 * @param {number} totalScore - 0-54
 * @returns {Object} perfil
 */
export function getMaturityProfile(totalScore) {
  return (
    MATURITY_PROFILES.find((p) => totalScore >= p.min && totalScore <= p.max) ||
    MATURITY_PROFILES[MATURITY_PROFILES.length - 1]
  )
}

/**
 * Monta array de dados para o RadarChart.
 * @param {Object} answers
 * @returns {Array} [{ subject, value, fullMark }]
 */
export function getRadarData(answers) {
  return BLOCKS.map((block) => ({
    subject: block.name,
    value: getBlockNote(getBlockScore(block.id, answers)),
    fullMark: 5,
  }))
}

/**
 * Retorna os blocos com menores notas (piores gargalos), máx 3.
 * @param {Object} answers
 * @returns {Array} [{ block, note }] ordenados do pior para o melhor
 */
export function getBottlenecks(answers) {
  const scored = BLOCKS.map((block) => ({
    block,
    note: getBlockNote(getBlockScore(block.id, answers)),
  }))
  scored.sort((a, b) => a.note - b.note)
  return scored.slice(0, 3)
}

/**
 * Retorna projeção de faturamento com base em benchmarks reais,
 * considerando um investimento mensal fixo de referência.
 * @param {number} ticketAverage - valor do ticket médio
 * @returns {{ investimento, cpl, conversas, taxaConversao, vendas, faturamento }}
 */
export function getRevenueEstimate(ticketAverage) {
  const faturamento = BENCHMARK_VENDAS * ticketAverage
  return {
    investimento: BENCHMARK_INVESTIMENTO,
    cpl: BENCHMARK_CPL,
    conversas: BENCHMARK_CONVERSAS,
    taxaConversao: BENCHMARK_CONVERSAO,
    vendas: BENCHMARK_VENDAS,
    faturamento,
  }
}

/**
 * Formata valor em reais brasileiros.
 * @param {number} value
 * @returns {string}
 */
export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}
