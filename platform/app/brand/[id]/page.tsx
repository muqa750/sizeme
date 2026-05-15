export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getCategories, getProductsPaged } from '@/lib/api'
import { getBrandSpotlights } from '@/app/admin/management/brand-spotlight/actions'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

interface Props { params: { id: string } }

export default async function BrandPage({ params }: Props) {
  const slot = Number(params.id)
  if (!slot || slot < 1 || slot > 3) notFound()

  const [categories, spotlights] = await Promise.all([
    getCategories(),
    getBrandSpotlights(),
  ])

  const spot = spotlights.find(s => s.slot === slot)
  if (!spot || !spot.brands.length) notFound()

  const { products } = await getProductsPaged({
    brands:  spot.brands,
    page:    1,
    perPage: 40,
  })

  // الاسم الرئيسي للماركة (أول واحدة) + الباقي كنص فرعي
  const primaryBrand = spot.brands[0]
  const otherBrands  = spot.brands.slice(1)

  return (
    <>
      <Header categories={categories} />
      <main style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>

        {/* ── عنوان الماركة — نص فاخر بدلاً من الصورة ── */}
        <div style={{
          padding: 'clamp(2.5rem, 8vw, 4.5rem) 1.25rem clamp(1.5rem, 4vw, 2rem)',
          maxWidth: 1200, margin: '0 auto', textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.25em',
            color: 'var(--mute)', marginBottom: '0.75rem',
            textTransform: 'uppercase',
          }}>
            <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>الرئيسية</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>الماركة</span>
          </p>
          <h1 className="serif" style={{
            fontSize: 'clamp(2.25rem, 7vw, 4rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            margin: 0,
          }}>
            {primaryBrand}
          </h1>
          {otherBrands.length > 0 && (
            <p style={{
              fontSize: '0.75rem', letterSpacing: '0.15em',
              color: 'var(--mute)', marginTop: '0.85rem',
            }}>
              {otherBrands.join(' · ')}
            </p>
          )}
          <div style={{
            width: 40, height: 1, background: 'var(--accent)',
            margin: '1.25rem auto 0', opacity: 0.7,
          }} />
          <p style={{
            fontSize: '0.7rem', color: 'var(--mute)',
            letterSpacing: '0.1em', marginTop: '0.85rem',
          }}>
            {products.length} منتج
          </p>
        </div>

        {/* ── شبكة المنتجات ── */}
        <div style={{ padding: '0 clamp(1rem, 4vw, 2rem) clamp(2rem, 5vw, 3rem)' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--mute)' }}>
              <p style={{ fontSize: 15 }}>لا توجد منتجات لهذه الماركة حالياً</p>
              <Link href="/" style={{ color: 'var(--accent)', fontSize: 13, marginTop: 12, display: 'inline-block' }}>
                ← العودة للرئيسية
              </Link>
            </div>
          ) : (
            <>
              <div
                className="brand-prod-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 0.625rem' }}
              >
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <style>{`
                @media (min-width: 640px)  { .brand-prod-grid { grid-template-columns: repeat(3, 1fr) !important; } }
                @media (min-width: 1024px) { .brand-prod-grid { grid-template-columns: repeat(4, 1fr) !important; } }
              `}</style>
            </>
          )}
        </div>
      </main>
    </>
  )
}
