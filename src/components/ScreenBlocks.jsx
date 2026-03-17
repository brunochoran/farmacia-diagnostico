import { useState } from 'react'
import { BLOCKS } from '../data/questions.js'

const TOTAL_QUESTIONS = 15 // 5 blocos × 3 perguntas

export default function ScreenBlocks({
  currentBlock,
  answers,
  onAnswer,
  onNextBlock,
  onSkipBlock,
  onFinish,
  onBack,
  initialPhase,
  initialQuestion,
}) {
  const block = BLOCKS[currentBlock]
  const isLastBlock = currentBlock === BLOCKS.length - 1

  // 'gateway' = pergunta de triagem | 'questions' = perguntas do bloco
  // Se o bloco não tem gateway, começa direto nas perguntas
  const [phase, setPhase] = useState(!block.gateway ? 'questions' : (initialPhase ?? 'gateway'))
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion ?? 0)

  // ID da opção atualmente em animação (para o flash)
  const [flashingId, setFlashingId] = useState(null)

  // ── Cálculo de progresso ────────────────────────────────
  // Gateway conta como 0 perguntas respondidas neste bloco
  const answeredInBlock = phase === 'questions' ? currentQuestion : 0
  const progressPercent = Math.round(
    ((currentBlock * 3 + answeredInBlock) / TOTAL_QUESTIONS) * 100
  )

  // ── Gateway handlers ────────────────────────────────────
  function handleGatewayAnswer(answer) {
    if (flashingId !== null) return
    setFlashingId(answer)
    setTimeout(() => {
      setFlashingId(null)
      if (answer === 'sim') {
        setPhase('questions')
        setCurrentQuestion(0)
      } else {
        // Não → pula o bloco (score zero)
        if (isLastBlock) onFinish()
        else onSkipBlock()
      }
    }, 380)
  }

  // ── Question handlers ───────────────────────────────────
  function handleOptionClick(questionId, score, optionKey) {
    if (flashingId !== null) return
    setFlashingId(optionKey)
    onAnswer(questionId, score)
    setTimeout(() => {
      setFlashingId(null)
      const isLastQuestion = currentQuestion === block.questions.length - 1
      if (isLastQuestion) {
        if (isLastBlock) onFinish()
        else onNextBlock()
      } else {
        setCurrentQuestion((q) => q + 1)
      }
    }, 380)
  }

  // ── Voltar ──────────────────────────────────────────────
  function handleBack() {
    if (flashingId !== null) return
    if (phase === 'gateway') {
      onBack()
    } else if (currentQuestion === 0) {
      if (block.gateway) setPhase('gateway')
      else onBack()
    } else {
      setCurrentQuestion((q) => q - 1)
    }
  }

  // ── Layout base ─────────────────────────────────────────
  return (
    <div className="min-h-dvh flex flex-col bg-white max-w-lg mx-auto">
      {/* Barra de progresso */}
      <div className="h-1 bg-gray-100 w-full">
        <div
          className="h-full bg-brand transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          ← Voltar
        </button>
        <span className="text-xs text-gray-400 font-medium">
          {block.name} — {currentBlock + 1}/{BLOCKS.length}
        </span>
        <span className="text-xs text-gray-400">{progressPercent}%</span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col px-6 py-7">
        {phase === 'gateway' ? (
          <GatewayQuestion
            block={block}
            flashingId={flashingId}
            onAnswer={handleGatewayAnswer}
          />
        ) : (
          <QuestionView
            block={block}
            currentBlock={currentBlock}
            currentQuestion={currentQuestion}
            flashingId={flashingId}
            onOptionClick={handleOptionClick}
          />
        )}
      </div>
    </div>
  )
}

// ── Tela de gateway (sim/não) ────────────────────────────────
function GatewayQuestion({ block, flashingId, onAnswer }) {
  return (
    <>
      <div className="mb-8">
        <span className="inline-block bg-brand/10 text-brand text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-4">
          {block.name}
        </span>
        <h2 className="text-lg font-bold text-gray-900 leading-snug">
          {block.gateway}
        </h2>
      </div>

      <div className="flex gap-3">
        {[
          { id: 'sim', label: 'Sim' },
          { id: 'nao', label: 'Não' },
        ].map(({ id, label }) => {
          const isFlashing = flashingId === id
          return (
            <button
              key={id}
              onClick={() => onAnswer(id)}
              disabled={flashingId !== null}
              className={[
                'flex-1 py-4 border-2 text-base font-bold transition-all duration-100',
                isFlashing
                  ? 'border-brand bg-brand/10 text-brand option-flash'
                  : id === 'sim'
                  ? 'border-gray-200 bg-white text-gray-800 hover:border-brand/40'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}

// ── Tela de pergunta do bloco ────────────────────────────────
function QuestionView({ block, currentBlock, currentQuestion, flashingId, onOptionClick }) {
  const question = block.questions[currentQuestion]

  return (
    <>
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">
          Pergunta {currentBlock * 3 + currentQuestion + 1} de {TOTAL_QUESTIONS}
        </p>
        <h2 className="text-lg font-bold text-gray-900 leading-snug">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const optKey = `${question.id}-${opt.score}`
          const isFlashing = flashingId === optKey
          return (
            <button
              key={opt.label}
              onClick={() => onOptionClick(question.id, opt.score, optKey)}
              disabled={flashingId !== null}
              className={[
                'w-full text-left px-5 py-4 border-2 text-sm font-medium leading-snug transition-all duration-100',
                isFlashing
                  ? 'border-brand bg-brand/10 text-brand option-flash'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-brand/40',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
