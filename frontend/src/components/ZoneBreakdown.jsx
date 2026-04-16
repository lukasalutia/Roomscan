// Análisis por zona con score individual y lista de problemas
export default function ZoneBreakdown({ zones }) {
  return (
    <div>
      <h2 className="text-white font-semibold text-base mb-3">Por zona</h2>
      <div className="flex flex-col gap-3">
        {zones.map((zone) => (
          <ZoneCard key={zone.name} zone={zone} />
        ))}
      </div>
    </div>
  )
}

function ZoneCard({ zone }) {
  const { name, score, issues } = zone

  const color =
    score >= 70 ? 'bg-emerald-500' :
    score >= 45 ? 'bg-amber-500'  :
                  'bg-red-500'

  const textColor =
    score >= 70 ? 'text-emerald-400' :
    score >= 45 ? 'text-amber-400'  :
                  'text-red-400'

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-medium text-sm">{name}</span>
        <span className={`text-sm font-bold ${textColor}`}>{score}</span>
      </div>

      {/* Barra */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Issues */}
      {issues.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {issues.map((issue, i) => (
            <li key={i} className="text-gray-400 text-xs flex items-start gap-1.5">
              <span className="mt-0.5 shrink-0">·</span>
              {issue}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-xs">Sin problemas detectados</p>
      )}
    </div>
  )
}
