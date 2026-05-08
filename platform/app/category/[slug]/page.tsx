import { getProducts, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map(c => ({ slug: c.id }))
}

export default async function CategoryPage({ params }: Props) {
  const [products, categories] = await Promise.all([
    getProducts({ category: params.slug }),
    getCategories(),
  ])

  const category = categories.find(c => c.id === params.slug)
  if (!category) notFound()

  return (
    <>
      <Header categories={categories} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: '#888', marginBottom: '0.5rem' }}>
            SIZEME /
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            letterSpacing: '0.05em',
          }}>
            {category.name_ar}
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {products.length} منتج
          </p>
        </div>

        {products.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '4rem 0' }}>
            لا توجد منتجات في هذه الفئة حالياً
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
