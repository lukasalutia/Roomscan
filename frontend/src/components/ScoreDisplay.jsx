// Muestra el score general con nivel visual (semáforo) y resumen
export default function ScoreDisplay({ score, level, summary, totalMinutes }) {
  const config = {
    clean:    { label: 'Ordenado',       color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', ring: 'bg-emerald-500' },
    moderate: { label: 'Algo desordenado', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  ring: 'bg-amber-500'  },
    messy:    { label: 'Desordenado',    color: 'text-red-400',     bg: 'bg-red-500/10',    border: 'border-red-500/20',    ring: 'bg-red-500'    },
  }

  const { label, color, bg, border, ring } = config[level] ?? config.moderate

  return (
    <div className={`rounded-2xl border p-5 ${bg} ${border}`}>
      {/* Score + nivel */}
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-6xl font-black tracking-tight ${color}`}>{score}</div>
          <div className="text-gray-400 text-xs mt-0.5">sobre 100</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${bg} ${color} border ${border}`}>
            {label}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <span>⏱</span>
            <span>{totalMinutes} min para ordenar</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${ring}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Resumen */}
      <p className="text-gray-300 text-sm mt-4 leading-relaxed">{summary}</p>
    </div>
  )
}
