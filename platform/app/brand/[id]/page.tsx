export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getCategories, getProductsPaged } from '@/lib/api'
import { getBrandSpotlights } from '@/app/admin/management/brand-spotlight/actions'
import { brandImgUrl } from '@/lib/brand-utils'
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
    brands:  spot.brands,   // يدعم الآن قائمة ماركات
    page:    1,
    perPage: 40,
  })

  const heroSrc = brandImgUrl(spot.imgPath, spot.imgVer)

  return (
    <>
      <Header categories={categories} />
      <main style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>

        {/* ── Hero — صورة فقط بدون نص ── */}
        <div style={{
          width: '100%', aspectRatio: '3/1',
          minHeight: 120, maxHeight: 260,
          overflow: 'hidden', background: '#1a1a1a',
        }}>
          <img
            src={heroSrc}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* ── شبكة المنتجات ── */}
        <div style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#999' }}>
              <p style={{ fontSize: 15 }}>لا توجد منتجات لهذه الماركة حالياً</p>
              <Link href="/" style={{ color: '#c9a84c', fontSize: 13, marginTop: 12, display: 'inline-block' }}>
                ← العودة للرئيسية
              </Link>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 12, color: '#bbb', marginBottom: 16, letterSpacing: '0.05em' }}>
                {products.length} منتج
              </p>
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
