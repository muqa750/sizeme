import { getProductById, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import AddToCartSection from '@/components/AddToCartSection'
import { notFound } from 'next/navigation'
import { fmt, imgPath } from '@/lib/utils'

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    getProductById(Number(params.id)),
    getCategories(),
  ])

  if (!product) notFound()

  const price  = product.category?.price ?? 35000
  const sizes  = product.category?.sizes ?? ['2XL','3XL','4XL','5XL','6XL','7XL']
  const images = [1, 2, 3].map(s => imgPath(product.category_id, product.cat_seq, product.img_key, s))

  return (
    <>
      <Header categories={categories} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

          {/* الصورة */}
          <div style={{ aspectRatio: '3/4', background: '#f7f7f7', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem', letterSpacing: '0.1em', color: '#2b2b2b',
            }}>
              {product.brand}
            </div>
            <img
              src={images[0]}
              alt={product.brand}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* التفاصيل */}
          <div style={{ padding: '1rem 0' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#888', marginBottom: '0.5rem' }}>
              {product.category?.name_ar?.toUpperCase()}
            </p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem', letterSpacing: '0.05em', marginBottom: '0.25rem',
            }}>
              {product.brand}
            </h1>
            {product.sub && (
              <p style={{ color: '#888', marginBottom: '1.5rem' }}>{product.sub}</p>
            )}

            <p style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '2rem' }}>
              {price.toLocaleString('en-US')}
              <span style={{ color: 'var(--mute)', fontSize: '0.85rem', fontWeight: 400, marginRight: '0.25rem' }}> د.ع</span>
            </p>

            {/* اللون + المقاس + زر السلة (Client Component) */}
            <AddToCartSection product={product} sizes={sizes} />

            {/* SKU */}
            <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '1.5rem' }}>
              الكود: {product.sku}
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
