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
}

export default function ProductGrid({ initialProducts, total, category, status, brands = [], colors = [] }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(total)
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [activeColors, setActiveColors] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  const hasMore = products.length < totalCount

  function buildParams(p: number, br: string[], co: string[]) {
    const params = new URLSearchParams({ page: String(p), perPage: String(PER_PAGE) })
    if (category) params.set('category', category)
    if (status) params.set('status', status)
    if (br.length) params.set('brands', br.join(','))
    if (co.length) params.set('colors', co.join(','))
    return params
  }

  function applyFilter(br: string[], co: string[]) {
    setActiveBrands(br)
    setActiveColors(co)
    setPage(1)
    startTransition(async () => {
      const res = await fetch(`/api/products?${buildParams(1, br, co)}`)
      const data = await res.json()
      setProducts(data.products)
      setTotalCount(data.total)
    })
  }

  function loadMore() {
    const nextPage = page + 1
    startTransition(async () => {
      const res = await fetch(`/api/products?${buildParams(nextPage, activeBrands, activeColors)}`)
      const data = await res.json()
      setProducts(prev => [...prev, ...data.products])
      setPage(nextPage)
    })
  }

  const showFilter = brands.length > 1 || colors.length > 1

  return (
    <>
      {/* ── الفلتر ── */}
      {showFilter && (
        <div style={{ padding: '0 1.25rem', maxWidth: 1200, margin: '0 auto', direction: 'rtl' }}>
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

      {/* ── مسافة بين الفلتر والمنتجات ── */}
      {showFilter && <div style={{ height: '3rem' }} />}

      {/* ── الشبكة ── */}
      {products.length === 0 ? (
        <p style={{ color: 'var(--mute)', textAlign: 'center', padding: '5rem 0', fontSize: '0.85rem' }}>
          لا توجد منتجات لهذا الفلتر
        </p>
      ) : (
        <div className="product-grid-flush" style={{ opacity: pending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* ── زر عرض المزيد ── */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
          <button onClick={loadMore} disabled={pending} className="load-more-btn">
            {pending ? '...' : 'عرض المزيد'}
          </button>
        </div>
      )}
    </>
  )
}
