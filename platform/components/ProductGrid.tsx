'use client'
import { useState, useTransition } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

const PER_PAGE = 18

interface Props {
  initialProducts: Product[]
  total: number
  category?: string
  status?: string
}

export default function ProductGrid({ initialProducts, total, category, status }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage]         = useState(1)
  const [pending, startTransition] = useTransition()

  const hasMore = products.length < total

  function loadMore() {
    const nextPage = page + 1
    startTransition(async () => {
      const params = new URLSearchParams({ page: String(nextPage), perPage: String(PER_PAGE) })
      if (category) params.set('category', category)
      if (status)   params.set('status', status)

      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(prev => [...prev, ...data.products])
      setPage(nextPage)
    })
  }

  if (products.length === 0) {
    return (
      <p style={{ color: 'var(--mute)', textAlign: 'center', padding: '5rem 0', fontSize: '0.85rem' }}>
        لا توجد منتجات حالياً
      </p>
    )
  }

  return (
    <>
      {/* ── الشبكة الملتصقة ── */}
      <div className="product-grid-flush">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* ── زر عرض المزيد ── */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
          <button
            onClick={loadMore}
            disabled={pending}
            className="load-more-btn"
          >
            {pending ? '...' : 'عرض المزيد'}
          </button>
        </div>
      )}
    </>
  )
}
