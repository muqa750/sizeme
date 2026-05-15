'use client'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface Props {
  images: string[]
  alt:    string
}

export default function ProductGallery({ images, alt }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop:     false,
    align:    'center',
    dragFree: false,
  })

  const [selectedIdx, setSelectedIdx] = useState(0)

  // ── تتبّع الشريحة الحالية ──────────────────────────────────────────────
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIdx(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  // ── إعادة التهيئة عند تغيير اللون → يرجع للصورة الأولى فوراً ─────────
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    emblaApi.scrollTo(0, true)   // true = jump بدون animation
    setSelectedIdx(0)
  }, [emblaApi, images])

  if (!images.length) return null

  return (
    <div className="relative w-full select-none">

      {/*
        ── الحاوية الخارجية بنسبة 4:5 ثابتة ─────────────────────────────
        نسبة العرض:الارتفاع مضبوطة هنا لمنع أي تغيير في حجم الصورة
        عند تبديل الألوان
      */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 5' }}>

        {/* عداد الصور */}
        {images.length > 1 && (
          <div
            className="absolute top-3 left-3 z-10 pointer-events-none
                       text-white text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.38)', letterSpacing: '0.04em' }}
          >
            {selectedIdx + 1} / {images.length}
          </div>
        )}

        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden h-full w-full">
          <div className="flex h-full touch-pan-y">

            {images.map((src, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] min-w-0 h-full"
              >
                <img
                  src={src}
                  alt={`${alt} — ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ── نقاط التنقل ────────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-2.5 pb-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`الصورة ${i + 1}`}
              className="h-[7px] rounded-full border-none p-0 cursor-pointer transition-all duration-300"
              style={{
                width:      i === selectedIdx ? 22 : 7,
                background: i === selectedIdx ? 'var(--ink)' : '#d0d0d0',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
