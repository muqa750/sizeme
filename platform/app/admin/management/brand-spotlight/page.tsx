import { getBrandSpotlights } from './actions'
import { getAdminProducts } from '@/lib/admin-api'
import BrandSpotlightEditor from './BrandSpotlightEditor'

export default async function BrandSpotlightPage() {
  const [spotlights, products] = await Promise.all([
    getBrandSpotlights(),
    getAdminProducts(),
  ])

  // استخراج الماركات الفريدة من المنتجات
  const brands = Array.from(
    new Set(products.map(p => p.brand).filter(Boolean))
  ).sort()

  return (
    <div style={{ padding: '2rem', direction: 'rtl', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
          fontWeight: 700, color: '#1a1a1a', margin: 0,
        }}>
          براندات اللحظة
        </h1>
        <p style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
          قم بتعديل الـ 3 خانات التي تظهر في الصفحة الرئيسية
        </p>
      </div>

      <BrandSpotlightEditor spotlights={spotlights} brands={brands} />
    </div>
  )
}
