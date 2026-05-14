import { getProductsPaged, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PER_PAGE = 18

/*
  الاسم هنا يجب أن يطابق بالضبط ما هو مخزون في حقل brand في Supabase
  عدّل هذه القائمة إذا احتجت لتغيير أسماء الماركات
*/
const BRAND_BY_ID: Record<string, string> = {
  '1': 'Louis Vuitton',
  '2': 'Hermes',
  '3': 'U.S. POLO ASSN',
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return Object.keys(BRAND_BY_ID).map(id => ({ slug: id }))
}

export default async function BrandPage({ params }: Props) {
  const brandName = BRAND_BY_ID[params.slug]
  if (!brandName) notFound()

  const [{ products, total }, categories] = await Promise.all([
    getProductsPaged({ brands: [brandName], page: 1, perPage: PER_PAGE }),
    getCategories(),
  ])

  return (
    <>
      <Header categories={categories} />

      <main style={{ direction: 'rtl' }}>

        <div style={{ padding: '2rem 1.25rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--mute)', marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>الرئيسية</Link>
            {' / '}
            <span>{brandName}</span>
          </p>
          <h1 className="serif" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            letterSpacing: '0.06em',
          }}>
            {brandName}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--mute)', letterSpacing: '0.05em' }}>
            {total} منتج
          </p>
        </div>

        <ProductGrid
          initialProducts={products}
          total={total}
          brandFilter={brandName}
        />

        <div style={{ padding: '2.5rem 1.25rem', borderTop: '1px solid var(--line)', maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--mute)', textDecoration: 'none' }}>
            ← العودة للرئيسية
          </Link>
        </div>
      </main>
    </>
  )
}
