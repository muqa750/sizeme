import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import type { Category, Product } from '@/lib/types'

interface Props {
  category: Category
  products: Product[]
}

export default function CategoryPreview({ category, products }: Props) {
  return (
    <div>
      {/* ── عنوان القسم ── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="kicker mb-1">{category.name_en?.toUpperCase()}</p>
          <h3 className="serif" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)' }}>
            {category.name_ar}
          </h3>
        </div>
        <Link
          href={`/category/${category.id}`}
          className="text-xs border-b transition-colors"
          style={{
            color: 'var(--mute)',
            borderColor: 'var(--line)',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            paddingBottom: 2,
          }}
        >
          عرض الكل ←
        </Link>
      </div>

      {/* ── الشبكة ── */}
      <div
        className="cat-preview-grid grid"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 0.625rem' }}
      >
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
