import { getProductsPaged, getCategories, getCategoryFilters } from '@/lib/api'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const PER_PAGE = 18

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map(c => ({ slug: c.id }))
}

export default async function CategoryPage({ params }: Props) {
  const [{ products, total }, categories, filters] = await Promise.all([
    getProductsPaged({ category: params.slug, page: 1, perPage: PER_PAGE }),
    getCategories(),
    getCategoryFilters(params.slug),
  ])

  const category = categories.find(c => c.id === params.slug)
  if (!category) notFound()

  return (
    <>
      <Header categories={categories} />

      <main style={{ direction: 'rtl' }}>

        {/* ── Breadcrumb + العنوان ── */}
        <div style={{ padding: '2rem 1.25rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--mute)', marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>الرئيسية</Link>
            {' / '}
            <span>{category.name_ar}</span>
          </p>
          <h1 className="serif" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
          }}>
            {category.name_ar}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--mute)', letterSpacing: '0.05em' }}>
            {total} منتج
          </p>
        </div>

        {/* ── الشبكة ── */}
        <ProductGrid
          initialProducts={products}
          total={total}
          category={params.slug}
          brands={filters.brands}
          colors={filters.colors}
        />

        {/* ── Back ── */}
        <div style={{ padding: '2.5rem 1.25rem', borderTop: '1px solid var(--line)', maxWidth: 1200, margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--mute)', textDecoration: 'none' }}>
            ← العودة للرئيسية
          </Link>
        </div>
      </main>
    </>
  )
}
