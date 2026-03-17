import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import { AGENCY_NAME, EVENT_NAME } from '../config.js'

// ── CSS customizado — sem Tailwind interno ──────────────────────────────────
const CSS = `
  .fc {
    background: #0F172A;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 5 / 7;
    position: relative;
    padding: 0;
    border: 1px solid rgba(29,158,117,0.25);
    font-family: 'Inter', system-ui, sans-serif;
    overflow: hidden;
    color: #fff;
    display: flex;
    flex-direction: column;
  }

  /* Gradiente de fundo verde no topo */
  .fc::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(29,158,117,0.18) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  /* Linha decorativa no topo */
  .fc-topbar {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 16px 0;
  }

  .fc-score {
    font-size: 3rem;
    font-weight: 900;
    color: #1D9E75;
    line-height: 1;
    letter-spacing: -2px;
  }

  .fc-score-label {
    font-size: 9px;
    font-weight: 700;
    color: rgba(29,158,117,0.7);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 2px;
  }

  .fc-profile-badge {
    text-align: right;
    max-width: 130px;
  }

  .fc-profile-name {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    line-height: 1.3;
    color: rgba(255,255,255,0.85);
  }

  .fc-profile-pill {
    display: inline-block;
    margin-top: 4px;
    padding: 2px 8px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px solid rgba(29,158,117,0.5);
    color: #1D9E75;
  }

  /* Divider */
  .fc-divider {
    position: relative;
    z-index: 1;
    margin: 8px 16px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(29,158,117,0.4), transparent);
  }

  /* Radar zone */
  .fc-radar {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
  }

  /* Badges grid */
  .fc-badges {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin: 0 12px 10px;
    border: 1px solid rgba(29,158,117,0.15);
  }

  .fc-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px 4px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(29,158,117,0.08);
  }

  .fc-badge-name {
    font-size: 7px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: center;
    margin-bottom: 2px;
  }

  .fc-badge-note {
    font-size: 14px;
    font-weight: 900;
    color: #1D9E75;
    line-height: 1;
  }

  .fc-badge-note.low {
    color: #E24B4A;
  }

  .fc-badge-note.mid {
    color: #EF9F27;
  }

  /* Rodapé */
  .fc-footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 6px 16px 12px;
    border-top: 1px solid rgba(29,158,117,0.12);
  }

  .fc-footer-text {
    font-size: 7px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(29,158,117,0.5);
  }
`

function getNoteClass(note) {
  if (note <= 2) return 'low'
  if (note === 3) return 'mid'
  return ''
}

export default function FifaCard({ overallNote, profile, radarData }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="fc">
        {/* Topo: nota geral + perfil */}
        <div className="fc-topbar">
          <div>
            <div className="fc-score">{overallNote}</div>
            <div className="fc-score-label">nota geral</div>
          </div>
          <div className="fc-profile-badge">
            <div className="fc-profile-name">{profile.name}</div>
            <div className="fc-profile-pill" style={{ borderColor: profile.color, color: profile.color }}>
              Diagnóstico
            </div>
          </div>
        </div>

        <div className="fc-divider" />

        {/* Gráfico radar */}
        <div className="fc-radar">
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={radarData} outerRadius="62%" margin={{ top: 12, right: 22, bottom: 12, left: 22 }}>
              <PolarGrid
                stroke="rgba(255,255,255,0.08)"
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: 'rgba(255,255,255,0.65)',
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'Inter',
                }}
              />
              <Radar
                dataKey="value"
                stroke="#1D9E75"
                fill="#1D9E75"
                fillOpacity={0.22}
                strokeWidth={2}
                dot={{ fill: '#1D9E75', strokeWidth: 0, r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Badges: 6 áreas com notas */}
        <div className="fc-badges">
          {radarData.map(({ subject, value }) => (
            <div key={subject} className="fc-badge">
              <span className="fc-badge-name">{subject}</span>
              <span className={`fc-badge-note ${getNoteClass(value)}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="fc-footer">
          <div className="fc-footer-text">
            Diagnóstico {AGENCY_NAME} × {EVENT_NAME}
          </div>
        </div>
      </div>
    </>
  )
}
