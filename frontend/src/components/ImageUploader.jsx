import { useRef, useState } from 'react'

// Componente de upload: drag & drop, selección de archivo y cámara
export default function ImageUploader({ preview, onImageSelect }) {
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    onImageSelect(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0])
  }

  // Si ya hay preview, mostrar miniatura con opción de cambiar
  if (preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
        <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/80 transition-colors"
        >
          Cambiar foto
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Zona de drag & drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          aspect-video rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${dragging
            ? 'border-indigo-400 bg-indigo-500/10'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:bg-gray-800/50'
          }
        `}
      >
        <div className="text-4xl select-none">🖼️</div>
        <div className="text-center px-6">
          <p className="text-white font-medium text-sm">Arrastrá una foto acá</p>
          <p className="text-gray-500 text-xs mt-0.5">o tocá para elegir desde la fototeca</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Botón de cámara separado */}
      <button
        onClick={() => cameraInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2.5 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white py-3.5 rounded-2xl text-sm font-medium transition-all duration-150 border border-gray-700"
      >
        <span className="text-lg">📷</span>
        Tomar foto ahora
      </button>

      {/* Input de cámara (capture="environment" abre cámara trasera en mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
