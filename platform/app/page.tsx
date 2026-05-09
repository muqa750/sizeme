import { getProducts, getCategories } from '@/lib/api'
import Header from '@/components/Header'
import HeroSection from '@/components/home/HeroSection'
import TrustStrip from '@/components/home/TrustStrip'
import GuaranteeSection from '@/components/home/GuaranteeSection'
import ContactSection from '@/components/home/ContactSection'
import RatingsSection from '@/components/home/RatingsSection'
import ScrollRevealInit from '@/components/ScrollRevealInit'
import DeliveryCountdown from '@/components/home/DeliveryCountdown'
import FilteredCatalog from '@/components/FilteredCatalog'

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  /* كل المنتجات مجمّعة حسب القسم — بدون slice حتى يعمل الفلتر على الكل */
  const groups = categories.map(cat => ({
    category: cat,
    products: products.filter(p => p.category_id === cat.id),
  })).filter(g => g.products.length > 0)

  return (
    <>
      <Header categories={categories} />
      <ScrollRevealInit />
      <main>

        {/* ─── Hero ─── */}
        <HeroSection />

        {/* ─── About ─── */}
        <section
          id="about"
          className="reveal max-w-4xl mx-auto text-center"
          style={{ padding: '5rem 1.25rem 7rem' }}
        >
          <p className="kicker">حرفتنا</p>
          <h2
            className="serif mt-4 leading-tight"
            style={{ fontSize: 'clamp(1.45rem, 4.6vw, 2.8rem)' }}
          >
            متخصصون بملابس الماركات الحصرية
            <br />الأنماط الفاخرة والألوان المميزة
          </h2>
          <div
            className="flex items-center justify-center gap-3 mt-8 text-xs"
            style={{ letterSpacing: '0.3em', color: 'var(--mute)' }}
          >
            <span>قماش فاخر</span>
            <span>·</span>
            <span>مقاسات مريحة</span>
            <span>·</span>
            <span>سعر عادل</span>
          </div>
        </section>

        {/* ─── Trust Strip ─── */}
        <div className="reveal"><TrustStrip /></div>

        {/* ─── Delivery Countdown ─── */}
        <DeliveryCountdown />

        {/* ─── الكتالوج مع الفلتر ─── */}
        <div style={{ paddingTop: '4rem' }}>
          <FilteredCatalog groups={groups} />
        </div>

        {/* ─── Guarantee ─── */}
        <div className="reveal"><GuaranteeSection /></div>

        {/* ─── Contact ─── */}
        <div className="reveal"><ContactSection /></div>

        {/* ─── Ratings ─── */}
        <div className="reveal"><RatingsSection /></div>

      </main>
    </>
  )
}
