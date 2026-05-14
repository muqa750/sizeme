'use client'
import { useState, useTransition } from 'react'
import ProductCard from '@/components/ProductCard'
import FilterBar from '@/components/FilterBar'
import type { Product } from '@/lib/types'

const PER_PAGE = 18

interface Props {
  initialProducts: Product[]
  total: number
  category?: string
  status?: string
  brands?: string[]
  colors?: string[]
  brandFilter?: string   // فلتر ماركة ثابت (صفحة الماركة) — لا يُزال من المستخدم
}

export default function ProductGrid({ initialProducts, total, category, status, brands = [], colors = [], brandFilter }: Props) {
  const [products, setProducts]         = useState<Product[]>(initialProducts)
  const [page, setPage]                 = useState(1)
  const [totalCount, setTotalCount]     = useState(total)
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [activeColors, setActiveColors] = useState<string[]>([])
  const [panelOpen, setPanelOpen]       = useState(false)
  const [pending, startTransition]      = useTransition()

  const hasMore      = products.length < totalCount
  const hasFilter    = brands.length > 1 || colors.length > 1
  const activeCount  = activeBrands.length + activeColors.length

  function buildParams(p: number, br: string[], co: string[]) {
    const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) })
    if (category) params.set('category', category)
    if (status)   params.set('status', status)
    // دائماً أضف brandFilter إذا موجود، مع الماركات المختارة من المستخدم
    const allBrands = brandFilter ? [brandFilter, ...br] : br
    if (allBrands.length) params.set('brands', allBrands.join(','))
    if (co.length) params.set('colors', co.join(','))
    return params
  }

  function applyFilter(br: string[], co: string[]) {
    setActiveBrands(br)
    setActiveColors(co)
    setPage(1)
    startTransition(async () => {
      const res  = await fetch(`/api/products?${buildParams(1, br, co)}`)
      const data = await res.json()
      setProducts(data.products)
      setTotalCount(data.total)
    })
  }

  function loadMore() {
    const nextPage = page + 1
    startTransition(async () => {
      const res  = await fetch(`/api/products?${buildParams(nextPage, activeBrands, activeColors)}`)
      const data = await res.json()
      setProducts(prev => [...prev, ...data.products])
      setPage(nextPage)
    })
  }

  return (
    <>
      {/* ── زر التصفية ── */}
      {hasFilter && (
        <div style={{ padding: '1.25rem 1.25rem 1rem', maxWidth: 1200, margin: '0 auto', direction: 'rtl' }}>
          <button
            onClick={() => setPanelOpen(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              border: `1px solid ${panelOpen ? 'var(--ink)' : 'var(--line)'}`,
              borderRadius: '999px',
              background: panelOpen ? 'var(--ink)' : 'transparent',
              color: panelOpen ? '#fff' : 'var(--ink)',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.18s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            تصفية
            {activeCount > 0 && (
              <span style={{
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: '999px',
                fontSize: '0.6rem',
                padding: '1px 6px',
                fontWeight: 600,
              }}>
                {activeCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── لوحة الفلتر ── */}
      {hasFilter && panelOpen && (
        <div style={{
          width: '100%',
          direction: 'rtl',
          marginBottom: '2rem',
          background: 'var(--paper)',
          overflow: 'hidden',
        }}>
          <FilterBar
            brands={brands}
            colors={colors}
            activeBrands={activeBrands}
            activeColors={activeColors}
            onBrand={br => applyFilter(br, activeColors)}
            onColor={co => applyFilter(activeBrands, co)}
          />
        </div>
      )}

      {/* ── مؤشر التحميل ── */}
      {pending && (
        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--mute)', padding: '1rem 0' }}>
          جاري التصفية...
        </p>
      )}

      {/* ── الشبكة ── */}
      {products.length === 0 && !pending ? (
        <p style={{ color: 'var(--mute)', textAlign: 'center', padding: '5rem 0', fontSize: '0.85rem' }}>
          لا توجد منتجات لهذا الفلتر
        </p>
      ) : (
        <div className="product-grid-flush" style={{ opacity: pending ? 0.4 : 1, transition: 'opacity 0.25s' }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* ── زر عرض المزيد ── */}
      {hasMore && !pending && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
          <button onClick={loadMore} disabled={pending} className="load-more-btn">
            عرض المزيد
          </button>
        </div>
      )}
    </>
  )
}
