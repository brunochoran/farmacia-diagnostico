import { useState } from 'react'
import { BLOCKS } from './data/questions.js'
import ScreenPresentation from './components/ScreenPresentation.jsx'
import ScreenTicket from './components/ScreenTicket.jsx'
import ScreenBlocks from './components/ScreenBlocks.jsx'
import ScreenResult from './components/ScreenResult.jsx'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('presentation')
  // 'presentation' | 'ticket' | 'blocks' | 'result'

  const [ticketAverage, setTicketAverage] = useState(null)

  const [answers, setAnswers] = useState({})
  // { 'b0q0': 2, 'b0q1': 1, ... }

  const [currentBlock, setCurrentBlock] = useState(0)

  // Controla onde o ScreenBlocks começa quando remonta
  // phase: 'gateway' | 'questions'
  const [entryPhase, setEntryPhase] = useState('gateway')
  const [entryQuestion, setEntryQuestion] = useState(0)

  // ── Handlers ─────────────────────────────────────────────────

  function handleStart() {
    setCurrentScreen('ticket')
  }

  function handleBackFromTicket() {
    setCurrentScreen('presentation')
  }

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

  // Avança para o próximo bloco após responder o último
  function handleNextBlock() {
    const nextBlock = currentBlock + 1
    setCurrentBlock(nextBlock)
    setEntryPhase('gateway')
    setEntryQuestion(0)
  }

  // Pula o bloco (resposta "Não" no gateway) — score zerado
  function handleSkipBlock() {
    const nextBlock = currentBlock + 1
    if (nextBlock >= BLOCKS.length) {
      setCurrentScreen('result')
    } else {
      setCurrentBlock(nextBlock)
      setEntryPhase('gateway')
      setEntryQuestion(0)
    }
  }

  function handleFinish() {
    setCurrentScreen('result')
  }

  // Volta a partir do ScreenBlocks
  function handleBackFromBlock() {
    if (currentBlock === 0) {
      // Primeiro bloco → volta para tela de ticket
      setCurrentScreen('ticket')
    } else {
      // Bloco anterior, começa na última pergunta
      setCurrentBlock(currentBlock - 1)
      setEntryPhase('questions')
      setEntryQuestion(BLOCKS[currentBlock - 1].questions.length - 1)
    }
  }

  function handleRestart() {
    setCurrentScreen('presentation')
    setTicketAverage(null)
    setAnswers({})
    setCurrentBlock(0)
    setEntryPhase('gateway')
    setEntryQuestion(0)
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

  if (currentScreen === 'result') {
    return (
      <ScreenResult
        answers={answers}
        ticketAverage={ticketAverage}
        onRestart={handleRestart}
      />
    )
  }

  return null
}
