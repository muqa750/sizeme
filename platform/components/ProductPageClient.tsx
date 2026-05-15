'use client'
import { useState, useMemo } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'
import { variantImgUrl, COLOR_HEX, COLOR_NAMES_AR } from '@/lib/utils'
import ProductGallery from './ProductGallery'
import ProductAccordions from './ProductAccordions'

interface Props {
  product:      Product
  sizes:        string[]
  fallbackImgs: string[]   // الصور الاحتياطية (imgPath × 3)
}

export default function ProductPageClient({ product, sizes, fallbackImgs }: Props) {
  const { addItem, totals } = useCart()

  const colors = product.colors ?? []

  // اللون المختار
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? '')
  // المقاس المختار
  const [selectedSize,  setSelectedSize]  = useState<string>('')
  // اهتزاز الزر عند النقر بدون مقاس
  const [shake, setShake] = useState(false)

  // ── صور المعرض بناءً على اللون المختار ──────────────────────────────────
  const galleryImages = useMemo<string[]>(() => {
    const variant = product.variants?.[selectedColor]
    if (variant?.images?.length) {
      return variant.images.map(uuid => variantImgUrl(uuid))
    }
    return fallbackImgs
  }, [selectedColor, product.variants, fallbackImgs])

  // Thumbnail اللون (أول صورة variant أو null → يظهر swatch)
  function colorThumb(color: string): string | null {
    const v = product.variants?.[color]
    return v?.images?.[0] ? variantImgUrl(v.images[0]) : null
  }

  // ── إضافة للسلة ──────────────────────────────────────────────────────────
  function handleAdd() {
    if (!selectedSize) {
      setShake(true)
      setTimeout(() => setShake(false), 550)
      return
    }
    addItem({
      productId:  product.id,
      sku:        product.sku,
      brand:      product.brand,
      sub:        product.sub,
      color:      selectedColor,
      size:       selectedSize,
      qty:        1,
      unitPrice:  totals.unitPrice,
      lineTotal:  totals.unitPrice,
      imgKey:     product.img_key,
      catSeq:     product.cat_seq,
      categoryId: product.category_id,
    })
  }

  const price = product.price ?? product.category?.price ?? 35000

  return (
    <>
      {/* ══ المعرض ══════════════════════════════════════════════════════════ */}
      <div>
        <ProductGallery images={galleryImages} alt={product.brand} />

        {/* ── مصغّرات الألوان ── */}
        {colors.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              padding: '12px 14px 8px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            } as React.CSSProperties}
          >
            {colors.map(color => {
              const thumb = colorThumb(color)
              const active = selectedColor === color
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={COLOR_NAMES_AR[color] ?? color}
                  style={{
                    flexShrink: 0,
                    width:  56,
                    height: 70,
                    borderRadius: 8,
                    border: active
                      ? '2.5px solid var(--ink)'
                      : '1.5px solid var(--line)',
                    overflow:   'hidden',
                    background: thumb ? 'transparent' : (COLOR_HEX[color] ?? '#ccc'),
                    cursor:     'pointer',
                    padding:    0,
                    transition: 'border-color 0.18s',
                    boxShadow:  active ? '0 0 0 1px var(--ink)' : 'none',
                  }}
                >
                  {thumb && (
                    <img
                      src={thumb}
                      alt={COLOR_NAMES_AR[color] ?? color}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ══ معلومات المنتج + الخيارات ════════════════════════════════════════ */}
      <div className="product-info-section">

        {/* Category label */}
        <p style={{
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: 'var(--mute)',
          marginBottom: 6,
          textTransform: 'uppercase',
        }}>
          {product.category?.name_ar}
        </p>

        {/* Brand */}
        <h1 className="serif" style={{
          fontSize: 'clamp(1.7rem, 6vw, 2.4rem)',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
          marginBottom: 4,
          color: 'var(--ink)',
        }}>
          {product.brand}
        </h1>

        {/* Sub-model */}
        {product.sub && (
          <p style={{ color: 'var(--mute)', fontSize: '0.9rem', marginBottom: 14 }}>
            {product.sub}
          </p>
        )}

        {/* Price */}
        <p style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: 24, color: 'var(--ink)' }}>
          {price.toLocaleString('en-US')}
          <span style={{ color: 'var(--mute)', fontSize: '0.82rem', fontWeight: 400, marginRight: '0.25rem' }}> د.ع</span>
        </p>

        {/* ── اللون ── */}
        {colors.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--mute)', marginBottom: 10 }}>
              اللون
              <span style={{ color: '#e53e3e', marginRight: 3, fontSize: '0.8rem' }}>*</span>
              {selectedColor && (
                <span style={{ color: 'var(--ink)', fontWeight: 500, marginRight: 6 }}>
                  — {COLOR_NAMES_AR[selectedColor] ?? selectedColor}
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map(color => {
                const active = selectedColor === color
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={COLOR_NAMES_AR[color] ?? color}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background:  COLOR_HEX[color] ?? '#ccc',
                      border:      active ? '2px solid var(--ink)' : '2px solid transparent',
                      outline:     active ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,0.13)',
                      outlineOffset: active ? 2 : 0,
                      cursor:      'pointer',
                      transition:  'outline 0.15s',
                      padding:     0,
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* ── المقاس ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: 'var(--mute)', marginBottom: 10 }}>
            القياس
            <span style={{ color: '#e53e3e', marginRight: 3, fontSize: '0.8rem' }}>*</span>
          </p>
          {/* صف واحد أفقي قابل للتمرير */}
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            flexWrap: 'nowrap',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 4,
          } as React.CSSProperties}>
            {sizes.map(size => {
              const active = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '8px 16px',
                    border:      active ? '1.5px solid var(--ink)' : '1px solid var(--line)',
                    background:  active ? 'var(--ink)' : 'transparent',
                    color:       active ? '#fff' : 'var(--ink)',
                    fontSize:    '0.875rem',
                    borderRadius: 6,
                    cursor:      'pointer',
                    minWidth:    52,
                    minHeight:   44,
                    flexShrink:  0,
                    transition:  'all 0.15s',
                    fontFamily:  'inherit',
                    fontWeight:  active ? 500 : 400,
                  }}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── زر الإضافة على الديسكتوب (inline) ── */}
        <div className="product-cta-desktop" style={{ marginTop: 24 }}>
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              background: 'var(--ink)',
              color: '#fff',
              padding: '1rem',
              border: 'none',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              borderRadius: 4,
              fontFamily: 'inherit',
              animation: shake ? 'shake 0.5s ease' : 'none',
            }}
          >
            أضف إلى السلة
          </button>
        </div>
        {/* ── الأكورديون — التفاصيل / العناية / الشحن ── */}
        <div style={{ marginTop: 28 }}>
          <ProductAccordions
            description={product.description}
            sku={product.sku}
            brand={product.brand}
            selectedSize={selectedSize}
          />
        </div>

      </div>

      {/* ══ CTA الثابت في الأسفل (موبايل فقط) ═══════════════════════════════ */}
      <div className="product-cta-fixed">
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            background: 'var(--ink)',
            color: '#fff',
            padding: '0.9rem',
            border: 'none',
            fontSize: '0.875rem',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            borderRadius: 8,
            fontFamily: 'inherit',
            animation: shake ? 'shake 0.5s ease' : 'none',
          }}
        >
          {selectedSize
            ? `أضف إلى السلة — ${selectedSize}`
            : 'أضف إلى السلة'}
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform:translateX(0) }
          20%      { transform:translateX(-6px) }
          40%      { transform:translateX(6px) }
          60%      { transform:translateX(-4px) }
          80%      { transform:translateX(4px) }
        }
        /* الزر الـ inline يظهر على الديسكتوب فقط */
        .product-cta-desktop { display: none; }
        @media (min-width: 768px) {
          .product-cta-desktop { display: block; }
        }
      `}</style>
    </>
  )
}
