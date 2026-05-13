import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface Props {
  title: string
  kicker: string
  products: Product[]
  viewAllHref: string
}

export default function HomeProductRow({ title, kicker, products, viewAllHref }: Props) {
  if (products.length === 0) return null

  return (
    <section style={{ padding: '3rem 0', direction: 'rtl', overflow: 'hidden' }}>

      {/* ── الرأس ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 1.25rem',
        marginBottom: '1.25rem',
      }}>
        <div>
          <p className="kicker" style={{ marginBottom: '0.4rem' }}>{kicker}</p>
          <Link href={viewAllHref} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 className="serif" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', fontWeight: 400 }}>
              {title}
            </h2>
          </Link>
        </div>
        <Link
          href={viewAllHref}
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            color: 'var(--mute)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--line)',
            paddingBottom: 2,
            whiteSpace: 'nowrap',
          }}
        >
          عرض الكل ←
        </Link>
      </div>

      {/* ── الصف الأفقي ── */}
      <div
        className="product-row-scroll"
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          gap: '0.75rem',
          padding: '0 1.25rem 0.5rem',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {products.map(p => (
          <div
            key={p.id}
            className="product-row-item"
            style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <style>{`
        .product-row-scroll::-webkit-scrollbar { display: none; }

        /* موبايل: عرض بطاقتين */
        .product-row-item {
          width: calc(50vw - 1.5rem);
          max-width: 220px;
        }

        /* ديسكتوب: عرض 4 بطاقات */
        @media (min-width: 768px) {
          .product-row-item {
            width: calc(25% - 0.6rem);
            max-width: 280px;
          }
          .product-row-scroll {
            padding: 0 1.25rem 1rem;
          }
        }
      `}</style>
    </section>
  )
}
