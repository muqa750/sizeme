import { getProducts, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const bestSellers = products.filter(p => p.status === 'best-seller')
  const newArrivals = products.filter(p => p.status === 'new')

  return (
    <>
      <Header categories={categories} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: '#888', marginBottom: '0.75rem' }}>
            IRAQ&apos;S PLUS-SIZE DESTINATION
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '0.05em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            مقاسات خاصة
            <br />
            <span style={{ color: '#888' }}>من 2XL إلى 7XL</span>
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            {products.length} منتج متاح حالياً
          </p>
        </section>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              color: '#888',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              الأكثر مبيعاً
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              color: '#888',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              وصل حديثاً
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* All Products */}
        <section>
          <h2 style={{
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: '#888',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}>
            جميع المنتجات
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

      </main>
    </>
  )
}
