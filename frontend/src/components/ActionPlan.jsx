import { useState } from 'react'

// Plan de acción paso a paso, ordenado por impacto visual
export default function ActionPlan({ steps }) {
  const [done, setDone] = useState(new Set())

  function toggle(step) {
    setDone((prev) => {
      const next = new Set(prev)
      next.has(step) ? next.delete(step) : next.add(step)
      return next
    })
  }

  const impactConfig = {
    high:   { label: 'Alto impacto',   color: 'text-indigo-400',  dot: 'bg-indigo-400'  },
    medium: { label: 'Impacto medio',  color: 'text-sky-400',     dot: 'bg-sky-400'     },
    low:    { label: 'Impacto bajo',   color: 'text-gray-500',    dot: 'bg-gray-500'    },
  }

  const completed = done.size
  const total = steps.length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-base">Plan de acción</h2>
        <span className="text-gray-500 text-xs">{completed}/{total} listo</span>
      </div>

      {/* Barra de progreso del plan */}
      {total > 0 && (
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {steps.map((step) => {
          const isDone = done.has(step.step)
          const impact = impactConfig[step.impact] ?? impactConfig.medium

          return (
            <button
              key={step.step}
              onClick={() => toggle(step.step)}
              className={`
                w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-all duration-150
                ${isDone
                  ? 'bg-gray-900/50 border-gray-800 opacity-50'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700 active:scale-[0.98]'
                }
              `}
            >
              {/* Checkbox */}
              <div className={`
                mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${isDone ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'}
              `}>
                {isDone && <span className="text-white text-xs">✓</span>}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-gray-500 text-xs font-medium">Paso {step.step}</span>
                  <span className={`text-xs ${impact.color} flex items-center gap-1`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${impact.dot}`} />
                    {impact.label}
                  </span>
                </div>
                <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-gray-500' : 'text-white'}`}>
                  {step.action}
                </p>
                <p className="text-gray-500 text-xs mt-1">~{step.duration_minutes} min</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
