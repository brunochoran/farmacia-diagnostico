const NOTE_ICONS = {
  1: '🔴',
  2: '🟡',
  3: '🟢',
  4: '🟢',
  5: '🟢',
}

const NOTE_COLORS = {
  1: { border: '#E24B4A', bg: '#fef2f2', label: 'bg-red-100 text-red-700' },
  2: { border: '#EF9F27', bg: '#fffbeb', label: 'bg-amber-100 text-amber-700' },
  3: { border: '#5DCAA5', bg: '#f0fdf4', label: 'bg-green-100 text-green-700' },
}

export default function Bottlenecks({ bottlenecks }) {
  if (!bottlenecks || bottlenecks.length === 0) return null

  return (
    <div className="bg-white px-5 py-5">
      <h3 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
        Análise de gargalos
      </h3>
      <p className="text-sm font-bold text-gray-900 mb-4">
        Principais pontos de atenção identificados
      </p>

      <div className="space-y-3">
        {bottlenecks.map(({ block, note }) => {
          const colors = NOTE_COLORS[Math.min(note, 3)]
          return (
            <div
              key={block.id}
              className="border-l-4 px-4 py-4"
              style={{
                borderLeftColor: colors.border,
                backgroundColor: colors.bg,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{NOTE_ICONS[note]}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 ${colors.label}`}
                >
                  {block.name} — nota {note}/5
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {block.bottleneckTitle}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {block.bottleneckText}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
