import Link from 'next/link'
import { getProductsPaged } from '@/lib/api'
import type { Product } from '@/lib/types'
import { imgPath, variantImgUrl } from '@/lib/utils'

interface Props {
  brand:      string
  excludeId:  number
}

export default async function SimilarProducts({ brand, excludeId }: Props) {
  const { products } = await getProductsPaged({
    brands:  [brand],
    page:    1,
    perPage: 7,     // نجلب 7 ونحذف المنتج الحالي → يبقى 6 على الأكثر
  })

  const similar = products.filter(p => p.id !== excludeId).slice(0, 6)
  if (!similar.length) return null

  return (
    <section style={{ padding: '2rem 0 3rem', borderTop: '1px solid var(--line)', marginTop: 12 }}>
      {/* العنوان */}
      <div style={{ padding: '0 1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: 4 }}>
          من نفس الماركة
        </p>
        <h2 className="serif" style={{
          fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
          letterSpacing: '0.05em',
          color: 'var(--ink)',
        }}>
          قد يعجبك أيضاً
        </h2>
      </div>

      {/* شريط منتجات أفقي قابل للتمرير */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'auto',
        padding: '0 1rem 0.5rem',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>
        {similar.map(product => (
          <SimilarCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// ── بطاقة صغيرة مبسّطة ──────────────────────────────────────────────────────
function SimilarCard({ product }: { product: Product }) {
  const price = product.price ?? product.category?.price ?? 35000

  // الصورة: أول variant أو imgPath
  const firstVariantKey = product.variants
    ? Object.values(product.variants)[0]?.images?.[0]
    : undefined

  const imgSrc = firstVariantKey
    ? variantImgUrl(firstVariantKey)
    : imgPath(product.category_id, product.cat_seq, product.img_key, 1)

  return (
    <Link
      href={`/product/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, width: 155 }}
    >
      {/* الصورة */}
      <div style={{
        width: 155, aspectRatio: '4/5',
        background: '#f5f5f5',
        borderRadius: 10, overflow: 'hidden',
        marginBottom: 8,
      }}>
        <img
          src={imgSrc}
          alt={product.brand}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* المعلومات */}
      <p className="serif" style={{
        fontSize: '0.9rem', letterSpacing: '0.04em',
        color: 'var(--ink)', marginBottom: 2,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {product.brand}
      </p>
      {product.sub && (
        <p style={{ fontSize: '0.68rem', color: 'var(--mute)', marginBottom: 4 }}>
          {product.sub}
        </p>
      )}
      <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink)' }}>
        {price.toLocaleString('en-US')}
        <span style={{ color: 'var(--mute)', fontSize: '0.65rem', fontWeight: 400, marginRight: '0.2rem' }}> د.ع</span>
      </p>
    </Link>
  )
}
