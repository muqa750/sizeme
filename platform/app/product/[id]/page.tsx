import { getProductById, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import ProductPageClient from '@/components/ProductPageClient'
import SimilarProducts from '@/components/SimilarProducts'
import { notFound } from 'next/navigation'
import { imgPath } from '@/lib/utils'

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    getProductById(Number(params.id)),
    getCategories(),
  ])

  if (!product) notFound()

  const sizes = product.category?.sizes ?? ['2XL','3XL','4XL','5XL','6XL','7XL']
  const fallbackImgs = [1, 2, 3].map(s =>
    imgPath(product.category_id, product.cat_seq, product.img_key, s)
  )

  return (
    <>
      <Header categories={categories} />

      <main className="product-page-main">
        <div className="product-page-layout">
          <ProductPageClient
            product={product}
            sizes={sizes}
            fallbackImgs={fallbackImgs}
          />
        </div>

        {/* ── قد يعجبك أيضاً ── */}
        <SimilarProducts
          brand={product.brand}
          categoryId={product.category_id}
          excludeId={product.id}
        />
      </main>
    </>
  )
}
