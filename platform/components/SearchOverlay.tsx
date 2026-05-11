'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { imgPath } from '@/lib/utils'

// ── نوع المنتج الخفيف ─────────────────────────────────────────────────────────
interface SlimProduct {
  id:          number
  brand:       string
  sub:         string
  colors:      string[]
  category_id: string
  img_key:     string
  cat_seq:     string
  cat_name:    string
}

interface Props {
  open:    boolean
  onClose: () => void
}

// ── إعدادات Fuse.js ───────────────────────────────────────────────────────────
const FUSE_OPTIONS: Fuse.IFuseOptions<SlimProduct> = {
  keys: [
    { name: 'brand',    weight: 0.7 },
    { name: 'sub',      weight: 0.4 },
    { name: 'cat_name', weight: 0.3 },
    { name: 'colors',   weight: 0.2 },
  ],
  threshold:         0.35,
  minMatchCharLength: 2,
  includeScore:      true,
}

// ── ألوان الماركة للنقاط ──────────────────────────────────────────────────────
const COLOR_HEX: Record<string, string> = {
  Black:      '#1a1a1a',
  White:      '#e0e0e0',
  'Dark Navy':'#1B2A4A',
  'Royal Blue':'#1C4EBF',
  Brown:      '#6B3F2A',
  Burgundy:   '#6D1A36',
  Charcoal:   '#3D3D3D',
  Taupe:      '#B5A69A',
  Olive:      '#5A5E3A',
}

export default function SearchOverlay({ open, onClose }: Props) {
  const router = useRouter()

  const [query,    setQuery]    = useState('')
  const [products, setProducts] = useState<SlimProduct[]>([])
  const [fuse,     setFuse]     = useState<Fuse<SlimProduct> | null>(null)
  const [results,  setResults]  = useState<SlimProduct[]>([])
  const [loading,  setLoading]  = useState(false)
  const [active,   setActive]   = useState(-1) // keyboard nav index

  const inputRef = useRef<HTMLInputElement>(null)

  // ── جلب المنتجات عند أول فتح ─────────────────────────────────────────────
  useEffect(() => {
    if (!open || products.length > 0) return
    setLoading(true)
    fetch('/api/search-products')
      .then(r => r.json())
      .then((data: SlimProduct[]) => {
        setProducts(data)
        setFuse(new Fuse(data, FUSE_OPTIONS))
      })
      .finally(() => setLoading(false))
  }, [open, products.length])

  // ── Focus عند الفتح ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setQuery('')
      setResults([])
      setActive(-1)
    }
  }, [open])

  // ── منع تمرير الصفحة ─────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // ── Esc للإغلاق ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setActive(a => Math.min(a + 1, results.length - 1))
      if (e.key === 'ArrowUp')   setActive(a => Math.max(a - 1, -1))
      if (e.key === 'Enter' && active >= 0 && results[active]) {
        navigate(results[active])
      }
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, active, results])

  // ── البحث ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((val: string) => {
    setQuery(val)
    setActive(-1)
    if (!fuse || val.trim().length < 2) { setResults([]); return }
    const raw = fuse.search(val.trim())
    setResults(raw.slice(0, 8).map(r => r.item))
  }, [fuse])

  // ── التنقل للمنتج ─────────────────────────────────────────────────────────
  function navigate(product: SlimProduct) {
    onClose()
    router.push(`/product/${product.id}`)
  }

  if (!open) return null

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,10,10,0.88)',
          zIndex: 200,
          animation: 'srFadeIn 0.18s ease',
        }}
      />

      {/* ── Panel ── */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 201,
          animation: 'srSlideDown 0.22s ease',
        }}
      >
        <div style={{
          background: 'var(--paper)',
          maxWidth: 680,
          margin: '0 auto',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}>

          {/* ── حقل البحث ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 20px',
            borderBottom: '1px solid var(--line)',
            height: 64,
          }}>
            {/* أيقونة البحث */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5l4 4" />
            </svg>

            <input
              ref={inputRef}
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="ابحث عن ماركة، قسم، لون..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '1rem', fontFamily: 'inherit',
                background: 'transparent', color: 'var(--ink)',
                direction: 'rtl',
              }}
            />

            {/* مسح */}
            {query && (
              <button
                onClick={() => handleSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mute)', fontSize: '1.2rem', padding: 4, lineHeight: 1 }}
              >
                ×
              </button>
            )}

            {/* إغلاق */}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--line)',
                borderRadius: 6, padding: '4px 10px',
                fontSize: '0.7rem', color: 'var(--mute)',
                cursor: 'pointer', fontFamily: 'inherit',
                letterSpacing: '0.05em', flexShrink: 0,
              }}
            >
              Esc
            </button>
          </div>

          {/* ── النتائج ── */}
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>

            {/* تحميل */}
            {loading && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mute)', fontSize: '0.8rem' }}>
                ...
              </div>
            )}

            {/* نتائج */}
            {!loading && results.length > 0 && (
              <div>
                {results.map((product, i) => (
                  <button
                    key={product.id}
                    onClick={() => navigate(product)}
                    onMouseEnter={() => setActive(i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: 14, padding: '12px 20px',
                      background: active === i ? 'var(--line)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'right',
                      direction: 'rtl', transition: 'background 0.1s',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    {/* الصورة */}
                    <div style={{
                      width: 52, height: 66, flexShrink: 0,
                      background: '#f2f2f2', overflow: 'hidden', borderRadius: 4,
                    }}>
                      <img
                        src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
                        alt={product.brand}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    {/* المعلومات */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.9rem', fontWeight: 600,
                        color: 'var(--ink)', margin: '0 0 3px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {product.brand}
                      </p>
                      {product.sub && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--mute)', margin: '0 0 6px' }}>
                          {product.sub}
                        </p>
                      )}
                      {/* نقاط الألوان */}
                      {product.colors.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {product.colors.slice(0, 6).map(c => (
                            <span
                              key={c}
                              title={c}
                              style={{
                                width: 10, height: 10, borderRadius: '50%',
                                background: COLOR_HEX[c] ?? '#ccc',
                                border: '1px solid rgba(0,0,0,0.12)',
                                display: 'inline-block',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* القسم */}
                    <span style={{
                      fontSize: '0.65rem', color: 'var(--mute)',
                      background: 'var(--line)', padding: '3px 8px',
                      borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {product.cat_name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* لا نتائج */}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink)', marginBottom: 6 }}>
                  لا نتائج لـ «{query}»
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--mute)' }}>
                  جرّب اسم الماركة أو القسم مثل: بولو، تي شيرت، أسود
                </p>
              </div>
            )}

            {/* الحالة الابتدائية */}
            {!loading && query.length < 2 && (
              <div style={{ padding: '1.75rem 2rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--mute)', letterSpacing: '0.06em' }}>
                  ابدأ بالكتابة للبحث في المنتجات
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes srFadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes srSlideDown { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </>
  )
}
