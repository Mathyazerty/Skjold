import { useState } from "react"

const galleryItems = [
  {
    before: "/images/before-1.png",
    after: "/images/after-1.png",
    title: "Rustbehandling - Skærm",
    description: "Komplet fjernelse af rust og genoprettelse af skærm"
  },
  {
    before: "/images/before-2.png",
    after: "/images/after-2.png",
    title: "Lakpolering - Motorhjelm",
    description: "Fjernelse af swirl marks og dybdegående polering"
  },
  {
    before: "/images/before-3.png",
    after: "/images/after-3.png",
    title: "Rustbehandling - Hjulkasse",
    description: "Fuldstændig rustfjernelse og lakering af hjulkasse"
  }
]

function BeforeAfterSliderInternal({ before, after, title }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (clientX, rect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.clientX, rect)
  }

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.touches[0].clientX, rect)
  }

  return (
    <div
      className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      <img
        src={after}
        alt={`${title} - Efter`}
        className="object-cover w-full h-full"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt={`${title} - Før`}
          className="object-cover w-full h-full"
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
      <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded text-sm font-medium text-foreground">
        Før
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded text-sm font-medium text-primary-foreground">
        Efter
      </div>
    </div>
  )
}

export function BeforeAfterGallery() {
  return (
    <section id="gallery" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Før & Efter</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Se Resultaterne Med Egne Øjne
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Træk i slideren for at se den utrolige transformation vores behandlinger skaber.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="group">
              <BeforeAfterSliderInternal
                before={item.before}
                after={item.after}
                title={item.title}
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt, label, beforeFilter = "" }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [beforeLoaded, setBeforeLoaded] = useState(false)
  const [afterLoaded, setAfterLoaded] = useState(false)

  const handleMove = (clientX, rect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))
    setSliderPosition(percent)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.clientX, rect)
  }

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.touches[0].clientX, rect)
  }

  return (
    <div className="space-y-md">
      <div
        className="relative w-full min-h-80 rounded-xl overflow-hidden cursor-ew-resize select-none bg-gray-200"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Image "Après" (de base) */}
        <img
          src={afterSrc}
          alt={afterAlt || "Après"}
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setAfterLoaded(true)}
        />
        
        {/* Image "Avant" (par-dessus) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt || "Avant"}
            className="w-full h-full object-cover"
            style={{ filter: beforeFilter }}
            onLoad={() => setBeforeLoaded(true)}
          />
        </div>

        {/* Curseur de séparation */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6-4v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        {/* Label "Avant" */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded text-sm font-bold text-white">
          FØR
        </div>

        {/* Label "Après" */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded text-sm font-bold text-black">
          EFTER
        </div>
      </div>

      {/* Label principal */}
      {label && (
        <div className="text-center">
          <p className="font-bold text-on-surface">{label}</p>
        </div>
      )}
    </div>
  )
}
