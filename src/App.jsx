import { useState, useEffect, useCallback } from 'react'
import { BLOCKS } from './data/questions.js'
import {
  getTotalScore,
  getMaturityProfile,
  getRevenueEstimate,
} from './utils/scoring.js'
import { saveDiagnostico, saveLead } from './lib/api.js'
import ScreenPresentation from './components/ScreenPresentation.jsx'
import ScreenTicket from './components/ScreenTicket.jsx'
import ScreenBlocks from './components/ScreenBlocks.jsx'
import ScreenLoading from './components/ScreenLoading.jsx'
import ScreenResult from './components/ScreenResult.jsx'
import ScreenForm from './components/ScreenForm.jsx'

export default function App() {
  // 'presentation' | 'ticket' | 'blocks' | 'loading' | 'result' | 'form'
  const [currentScreen, setCurrentScreen] = useState('presentation')
  const [ticketAverage, setTicketAverage] = useState(null)
  const [answers, setAnswers] = useState({})
  const [currentBlock, setCurrentBlock] = useState(0)
  const [entryPhase, setEntryPhase] = useState('gateway')
  const [entryQuestion, setEntryQuestion] = useState(0)
  const [diagnosticoId, setDiagnosticoId] = useState(null)

  // Lê o pharma_id da URL (ex: ?pharma_id=5511999999999)
  const [pharmaId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('pharma_id') || null
  })

  // ── Handlers ─────────────────────────────────────────────────

  function handleStart() { setCurrentScreen('ticket') }
  function handleBackFromTicket() { setCurrentScreen('presentation') }

  function handleTicketSubmit(value) {
    setTicketAverage(value)
    setCurrentBlock(0)
    setEntryPhase('gateway')
    setEntryQuestion(0)
    setCurrentScreen('blocks')
  }

  function handleAnswer(questionId, score) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }))
  }

  function handleNextBlock() {
    const nextBlock = currentBlock + 1
    setCurrentBlock(nextBlock)
    setEntryPhase('gateway')
    setEntryQuestion(0)
  }

  function handleSkipBlock() {
    const nextBlock = currentBlock + 1
    if (nextBlock >= BLOCKS.length) {
      setCurrentScreen('loading')
    } else {
      setCurrentBlock(nextBlock)
      setEntryPhase('gateway')
      setEntryQuestion(0)
    }
  }

  function handleFinish() {
    setCurrentScreen('loading')
  }

  function handleBackFromBlock() {
    if (currentBlock === 0) {
      setCurrentScreen('ticket')
    } else {
      setCurrentBlock(currentBlock - 1)
      setEntryPhase('questions')
      setEntryQuestion(BLOCKS[currentBlock - 1].questions.length - 1)
    }
  }

  // Chamado quando o loading termina — salva no Supabase e vai pro resultado
  const handleLoadingDone = useCallback(async () => {
    const totalScore = getTotalScore(answers)
    const profile = getMaturityProfile(totalScore)
    const revenue = getRevenueEstimate(ticketAverage)

    const id = await saveDiagnostico({
      pharmaId,
      totalScore,
      profileName: profile.name,
      ticketAverage,
      answers,
      revenue,
    })

    setDiagnosticoId(id)
    setCurrentScreen('result')
  }, [answers, ticketAverage, pharmaId])

  // Salva o lead e redireciona pro WhatsApp (o redirect acontece dentro do ScreenForm)
  async function handleFormSubmit(formData) {
    const totalScore = getTotalScore(answers)
    const profile = getMaturityProfile(totalScore)
    await saveLead({
      diagnosticoId,
      pharmaId,
      profileName: profile.name,
      totalScore,
      ...formData,
    })
  }

  function handleRestart() {
    setCurrentScreen('presentation')
    setTicketAverage(null)
    setAnswers({})
    setCurrentBlock(0)
    setEntryPhase('gateway')
    setEntryQuestion(0)
    setDiagnosticoId(null)
  }

  // ── Render ───────────────────────────────────────────────────

  if (currentScreen === 'presentation') {
    return <ScreenPresentation onStart={handleStart} />
  }

  if (currentScreen === 'ticket') {
    return <ScreenTicket onSubmit={handleTicketSubmit} onBack={handleBackFromTicket} />
  }

  if (currentScreen === 'blocks') {
    return (
      <ScreenBlocks
        key={currentBlock}
        currentBlock={currentBlock}
        answers={answers}
        onAnswer={handleAnswer}
        onNextBlock={handleNextBlock}
        onSkipBlock={handleSkipBlock}
        onFinish={handleFinish}
        onBack={handleBackFromBlock}
        initialPhase={entryPhase}
        initialQuestion={entryQuestion}
      />
    )
  }

  if (currentScreen === 'loading') {
    return <ScreenLoading onDone={handleLoadingDone} />
  }

  if (currentScreen === 'result') {
    return (
      <ScreenResult
        answers={answers}
        ticketAverage={ticketAverage}
        onRestart={handleRestart}
        onOpenForm={() => setCurrentScreen('form')}
      />
    )
  }

  if (currentScreen === 'form') {
    const totalScore = getTotalScore(answers)
    const profile = getMaturityProfile(totalScore)
    return (
      <ScreenForm
        profileName={profile.name}
        totalScore={totalScore}
        pharmaId={pharmaId}
        onSubmit={handleFormSubmit}
        onBack={() => setCurrentScreen('result')}
      />
    )
  }

  return null
}
