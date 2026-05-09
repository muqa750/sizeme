'use client'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface Props {
  products: Product[]
}

export default function CategoryFilteredGrid({ products }: Props) {
  return (
    <div className="products-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
