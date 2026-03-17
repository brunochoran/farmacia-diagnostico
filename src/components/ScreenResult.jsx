import { useMemo } from 'react'
import {
  getTotalScore,
  getOverallNote,
  getMaturityProfile,
  getRadarData,
  getBottlenecks,
  getRevenueEstimate,
  getBlockNote,
  getBlockScore,
} from '../utils/scoring.js'
import MaturityProfile from './MaturityProfile.jsx'
import FifaCard from './FifaCard.jsx'
import RevenueEstimate from './RevenueEstimate.jsx'
import Bottlenecks from './Bottlenecks.jsx'
import CTACard from './CTACard.jsx'
import { AGENCY_NAME } from '../config.js'

export default function ScreenResult({ answers, ticketAverage, onRestart, onOpenForm }) {
  const totalScore = useMemo(() => getTotalScore(answers), [answers])
  const overallNote = useMemo(() => getOverallNote(totalScore), [totalScore])
  const profile = useMemo(() => getMaturityProfile(totalScore), [totalScore])
  const radarData = useMemo(() => getRadarData(answers), [answers])
  const bottlenecks = useMemo(() => getBottlenecks(answers), [answers])
  const revenue = useMemo(
    () => getRevenueEstimate(ticketAverage),
    [ticketAverage]
  )
  const positionamentoNote = useMemo(
    () => getBlockNote(getBlockScore(4, answers)),
    [answers]
  )

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Cabeçalho de resultado */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 text-center fade-in fade-in-1">
        <span className="inline-block bg-brand/10 text-brand text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-3">
          Diagnóstico concluído
        </span>
        <h1 className="text-xl font-bold text-gray-900">
          Seu resultado está pronto
        </h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 1 — Perfil de maturidade */}
        <div className="fade-in fade-in-1">
          <MaturityProfile profile={profile} totalScore={totalScore} />
        </div>

        {/* 2 — Card FIFA */}
        <div className="fade-in fade-in-2 flex justify-center">
          <FifaCard
            overallNote={overallNote}
            profile={profile}
            radarData={radarData}
          />
        </div>

        {/* 3 — Estimativa de faturamento */}
        <div className="fade-in fade-in-3">
          <RevenueEstimate revenue={revenue} ticketAverage={ticketAverage} />
        </div>

        {/* 4 — Gargalos */}
        <div className="fade-in fade-in-4">
          <Bottlenecks bottlenecks={bottlenecks} />
        </div>

        {/* 5 — CTA */}
        <div className="fade-in fade-in-5">
          <CTACard profile={profile} positionamentoNote={positionamentoNote} onOpenForm={onOpenForm} />
        </div>

        {/* Refazer */}
        <div className="fade-in fade-in-6 pb-8 text-center">
          <button
            onClick={onRestart}
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            Refazer diagnóstico
          </button>
          <p className="mt-3 text-xs text-gray-300">
            {AGENCY_NAME} × Diagnóstico Digital 2026
          </p>
        </div>
      </div>
    </div>
  )
}
