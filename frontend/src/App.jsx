import { useState, useRef } from 'react'
import ImageUploader from './components/ImageUploader.jsx'
import ScoreDisplay from './components/ScoreDisplay.jsx'
import ZoneBreakdown from './components/ZoneBreakdown.jsx'
import ActionPlan from './components/ActionPlan.jsx'
import RecommendationCard from './components/RecommendationCard.jsx'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function App() {
  const [view, setView] = useState('upload') // 'upload' | 'loading' | 'results'
  const [preview, setPreview] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef(null) // guarda el File para mandarlo al backend

  function handleImageSelect(file) {
    fileRef.current = file
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  async function handleAnalyze() {
    if (!fileRef.current) return
    setView('loading')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', fileRef.current)

      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Error ${res.status}`)
      }

      const data = await res.json()
      setAnalysis(data)
      setView('results')
    } catch (err) {
      setError(err.message)
      setView('upload')
    }
  }

  function handleReset() {
    setView('upload')
    setPreview(null)
    setAnalysis(null)
  }

  if (view === 'loading') {
    return <LoadingScreen />
  }

  if (view === 'results' && analysis) {
    return (
      <ResultsScreen
        analysis={analysis}
        preview={preview}
        onReset={handleReset}
      />
    )
  }

  return (
    <UploadScreen
      preview={preview}
      error={error}
      onImageSelect={handleImageSelect}
      onAnalyze={handleAnalyze}
    />
  )
}

function UploadScreen({ preview, error, onImageSelect, onAnalyze }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="px-5 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">RoomScan</h1>
        <p className="text-gray-400 text-sm mt-1">Subí una foto y te decimos por dónde empezar a ordenar.</p>
      </header>

      {/* Uploader */}
      <main className="flex-1 px-5 pb-8 flex flex-col gap-5">
        <ImageUploader preview={preview} onImageSelect={onImageSelect} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {preview && (
          <button
            onClick={onAnalyze}
            className="w-full bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-150 shadow-lg shadow-indigo-500/20"
          >
            Analizar cuarto
          </button>
        )}
      </main>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-5">
      <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-white font-semibold text-lg">Analizando tu cuarto...</p>
        <p className="text-gray-400 text-sm mt-1">Esto tarda unos segundos.</p>
      </div>
    </div>
  )
}

function ResultsScreen({ analysis, preview, onReset }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header con foto de fondo */}
      <div className="relative h-52 overflow-hidden">
        <img src={preview} alt="Cuarto analizado" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 to-gray-950" />
        <button
          onClick={onReset}
          className="absolute top-10 left-5 text-white/80 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Nueva foto
        </button>
      </div>

      {/* Contenido */}
      <div className="px-5 pb-12 -mt-4 flex flex-col gap-6">
        <ScoreDisplay
          score={analysis.overall_score}
          level={analysis.level}
          summary={analysis.summary}
          totalMinutes={analysis.estimated_total_minutes}
        />
        <ZoneBreakdown zones={analysis.zones} />
        <ActionPlan steps={analysis.action_plan} />
        <RecommendationCard tips={analysis.tips} />
      </div>
    </div>
  )
}
