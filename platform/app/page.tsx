import { getCategories, getNewArrivals, getBestSellers } from '@/lib/api'
import { getSettings } from '@/lib/admin-api'
import Header from '@/components/Header'
import HeroSection from '@/components/home/HeroSection'
import TrustStrip from '@/components/home/TrustStrip'
import GuaranteeSection from '@/components/home/GuaranteeSection'
import ContactSection from '@/components/home/ContactSection'
import RatingsSection from '@/components/home/RatingsSection'
import ScrollRevealInit from '@/components/ScrollRevealInit'
import DeliveryCountdown from '@/components/home/DeliveryCountdown'
import CategoryCards from '@/components/home/CategoryCards'
import HomeProductRow from '@/components/home/HomeProductRow'

export default async function HomePage() {
  const [categories, newArrivals, bestSellers, settings] = await Promise.all([
    getCategories(),
    getNewArrivals(6),
    getBestSellers(6),
    getSettings(),
  ])

  const heroVideoUrl       = settings.find(s => s.key === 'hero_video_url')?.value as string | undefined
  const heroCollectionPath = (settings.find(s => s.key === 'hero_video_collection')?.value as string | undefined)
    ?? (categories.find(c => c.id === 'tshirt') ? '/category/tshirt' : undefined)

  return (
    <>
      <Header categories={categories} />
      <ScrollRevealInit />
      <main>

        {/* ─── Hero ─── */}
        <HeroSection
          videoUrl={heroVideoUrl}
          collectionPath={heroCollectionPath}
          firstCategoryId={categories[0]?.id}
        />

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

        {/* ─── Delivery Countdown ─── */}
        <DeliveryCountdown />

        {/* ─── بطاقات الأقسام ─── */}
        <div className="reveal">
          <CategoryCards categories={categories} />
        </div>

        {/* ─── Trust Strip ─── */}
        <div className="reveal"><TrustStrip /></div>

        {/* ─── وصل حديثاً ─── */}
        {newArrivals.length > 0 && (
          <div className="reveal">
            <HomeProductRow
              kicker="جديد"
              title="وصل حديثاً"
              products={newArrivals}
              viewAllHref="/new-arrivals"
            />
          </div>
        )}

        {/* ─── الأكثر طلباً ─── */}
        {bestSellers.length > 0 && (
          <div className="reveal">
            <HomeProductRow
              kicker="الأبرز"
              title="الأكثر طلباً"
              products={bestSellers}
              viewAllHref="/best-sellers"
            />
          </div>
        )}

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
