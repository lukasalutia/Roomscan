// Tarjeta de tips para mantener el orden a largo plazo
export default function RecommendationCard({ tips }) {
  if (!tips?.length) return null

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
      <h2 className="text-white font-semibold text-base mb-4">Para que no vuelva a pasar</h2>
      <div className="flex flex-col gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 text-indigo-400 font-bold text-sm mt-0.5">{i + 1}</span>
            <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
