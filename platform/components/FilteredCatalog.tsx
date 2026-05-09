'use client'
import CategoryPreview from '@/components/home/CategoryPreview'
import type { Category, Product } from '@/lib/types'

interface Group {
  category: Category
  products: Product[]
}

interface Props {
  groups: Group[]
}

export default function FilteredCatalog({ groups }: Props) {
  return (
    <section id="shop" className="max-w-7xl mx-auto" style={{ padding: '0 1.25rem 5rem' }}>

      <div className="reveal" style={{ marginBottom: '3rem' }}>
        <p className="kicker mb-2">المجموعة</p>
        <h2 className="serif mb-5" style={{ fontSize: 'clamp(1.45rem, 4vw, 2rem)' }}>
          كل المنتجات
        </h2>
      </div>

      <div className="flex flex-col" style={{ gap: '4rem' }}>
        {groups.map(({ category, products }, i) => (
          <div key={category.id} className="reveal" data-d={String(Math.min(i + 1, 6))}>
            <CategoryPreview category={category} products={products.slice(0, 4)} />
          </div>
        ))}
      </div>

    </section>
  )
}
