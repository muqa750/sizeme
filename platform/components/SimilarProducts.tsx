import { getProductsPaged } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import SimilarProductsScroll from '@/components/SimilarProductsScroll'
import type { Product } from '@/lib/types'

interface Props {
  brand:       string
  categoryId:  string | number
  excludeId:   number
}

const TARGET = 12

export default async function SimilarProducts({ brand, categoryId, excludeId }: Props) {
  // 1) منتجات نفس الماركة أولاً
  const { products: brandProducts } = await getProductsPaged({
    brands:  [brand],
    page:    1,
    perPage: TARGET + 1,
  })

  let merged: Product[] = brandProducts.filter(p => p.id !== excludeId)

  // 2) إذا لم تكتمل الـ 12 → نكمل من نفس القسم بدون تكرار
  if (merged.length < TARGET) {
    const { products: catProducts } = await getProductsPaged({
      category: String(categoryId),
      page:     1,
      perPage:  TARGET + 5,
    })

    const existingIds = new Set([excludeId, ...merged.map(p => p.id)])
    const fillers = catProducts.filter(p => !existingIds.has(p.id))
    merged = [...merged, ...fillers]
  }

  const similar = merged.slice(0, TARGET)
  if (!similar.length) return null

  return (
    <section className="similar-section">
      {/* ── الرأس — نفس نمط HomeProductRow ── */}
      <div className="similar-header">
        <p className="kicker" style={{ marginBottom: '0.4rem' }}>مختارات مماثلة</p>
        <h2 className="serif" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', fontWeight: 400 }}>
          قد يعجبك أيضاً
        </h2>
      </div>

      {/* ── الصف الأفقي مع drag scroll للماوس ── */}
      <SimilarProductsScroll>
        {similar.map(p => (
          <div key={p.id} className="similar-item">
            <ProductCard product={p} />
          </div>
        ))}
      </SimilarProductsScroll>
    </section>
  )
}
