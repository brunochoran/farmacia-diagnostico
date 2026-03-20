import { AGENCY_NAME } from '../config.js'

const WHATSAPP_NUMBER = '551152427599'

export default function CTACard({ profile, positionamentoNote }) {
  const showPalestiraLine = positionamentoNote < 3

  function handleClick() {
    const msg = encodeURIComponent(`Olá equipe ${AGENCY_NAME}!\n\nAcabei de fazer o *Diagnóstico Digital* e gostaria de conversar.`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <div className="bg-brand px-6 py-7 text-white">
      <p className="text-xs uppercase tracking-widest font-semibold opacity-75 mb-3">
        Próximo passo
      </p>

      <p className="text-base font-bold leading-snug mb-3">
        {profile.ctaText}
      </p>

      {showPalestiraLine && (
        <p className="text-sm opacity-90 leading-relaxed mb-5 border-l-2 border-white/40 pl-3">
          A palestra de hoje mostrou o caminho. O diagnóstico mostrou onde você está.
          O próximo passo é estruturar.
        </p>
      )}

      <button
        onClick={handleClick}
        className="w-full text-center bg-white text-brand font-black text-sm py-4 px-6 hover:bg-gray-100 active:scale-95 transition-all duration-150"
      >
        Conversar com a equipe da {AGENCY_NAME} →
      </button>
    </div>
  )
}
