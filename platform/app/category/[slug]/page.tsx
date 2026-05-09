import { getProductsPaged, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import CategoryFilteredGrid from '@/components/CategoryFilteredGrid'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const PER_PAGE = 18

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map(c => ({ slug: c.id }))
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))

  const [{ products, total }, categories] = await Promise.all([
    getProductsPaged({ category: params.slug, page, perPage: PER_PAGE }),
    getCategories(),
  ])

  const category = categories.find(c => c.id === params.slug)
  if (!category) notFound()

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <Header categories={categories} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.25rem 4rem', direction: 'rtl' }}>

        {/* ── Breadcrumb + العنوان ── */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#bbb', marginBottom: '0.5rem' }}>
            <Link href="/" style={{ color: '#bbb', textDecoration: 'none' }}>SIZEME</Link>
            {' / '}
            <span style={{ color: '#888' }}>{category.name_ar}</span>
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            letterSpacing: '0.04em',
            color: '#1a1a1a',
            fontWeight: 400,
            marginBottom: '0.375rem',
          }}>
            {category.name_ar}
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#bbb', letterSpacing: '0.05em' }}>
            {total} منتج
          </p>
        </div>

        {/* ── شبكة المنتجات مع الفلتر ── */}
        {products.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '5rem 0', fontSize: '0.85rem' }}>
            لا توجد منتجات في هذه الفئة حالياً
          </p>
        ) : (
          <>
            <CategoryFilteredGrid products={products} />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <nav style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                marginTop: '3rem',
                flexWrap: 'wrap',
              }} aria-label="pagination">

                {/* السابق */}
                {page > 1 && (
                  <Link
                    href={`/category/${params.slug}?page=${page - 1}`}
                    style={paginationBtn(false)}
                  >
                    ← السابق
                  </Link>
                )}

                {/* الأرقام */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <Link
                    key={n}
                    href={`/category/${params.slug}?page=${n}`}
                    style={paginationBtn(n === page)}
                  >
                    {n}
                  </Link>
                ))}

                {/* التالي */}
                {page < totalPages && (
                  <Link
                    href={`/category/${params.slug}?page=${page + 1}`}
                    style={paginationBtn(false)}
                  >
                    التالي →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </main>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem 1rem;
        }
        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem 0.625rem;
          }
        }
      `}</style>
    </>
  )
}

function paginationBtn(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
    padding: '0 0.625rem',
    border: active ? '1px solid #1a1a1a' : '1px solid #e5e5e5',
    background: active ? '#1a1a1a' : '#fff',
    color: active ? '#fff' : '#888',
    fontSize: '0.78rem',
    textDecoration: 'none',
    letterSpacing: '0.03em',
    transition: 'all 0.15s',
  }
}
