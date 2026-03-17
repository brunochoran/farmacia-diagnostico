export default function MaturityProfile({ profile, totalScore }) {
  return (
    <div
      className="bg-white border-l-4 px-5 py-5"
      style={{ borderLeftColor: profile.color }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="shrink-0 w-10 h-10 flex items-center justify-center text-white font-black text-sm"
          style={{ backgroundColor: profile.color }}
        >
          {totalScore}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
            Perfil de maturidade
          </p>
          <h2
            className="text-base font-bold leading-tight"
            style={{ color: profile.color }}
          >
            {profile.name}
          </h2>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {profile.description}
      </p>
    </div>
  )
}
