import Link from 'next/link'
import { getCategories } from '@/lib/api'
import Header from '@/components/Header'

const REVIEWS = [
  {
    name: 'أحمد الموسوي',
    city: 'بغداد',
    score: 5,
    date: 'مارس 2025',
    text: 'أخيراً متجر يفهم المقاسات الكبيرة. الجودة ممتازة والقماش ناعم جداً. الطلب وصل بالوقت المحدد وكان التغليف أنيق.',
  },
  {
    name: 'عمر الربيعي',
    city: 'البصرة',
    score: 5,
    date: 'فبراير 2025',
    text: 'طلبت 4XL وجاء بالمقاس الصحيح تماماً. الاستبدال كان سهل لما احتجت تغيير اللون. خدمة عملاء ممتازة والفريق محترف.',
  },
  {
    name: 'محمد الجبوري',
    city: 'الموصل',
    score: 5,
    date: 'يناير 2025',
    text: 'من أفضل تجارب التسوق اللي مريت بيها. الأسعار معقولة والجودة أفضل مما توقعت. راح أطلب مرة ثانية بالتأكيد.',
  },
  {
    name: 'كريم الشمري',
    city: 'النجف',
    score: 5,
    date: 'أبريل 2025',
    text: 'بحثت كثيراً عن مقاس 6XL وما لقيت غير سايزمي. القميص وصل وكأنه مصمم خصيصاً لي. شكراً للفريق الرائع.',
  },
  {
    name: 'حسين البغدادي',
    city: 'بغداد',
    score: 5,
    date: 'مارس 2025',
    text: 'تصاميم راقية تختلف عن أي متجر ثاني. الألوان مميزة والأقمشة فاخرة. التوصيل لبغداد كان بيوم واحد فقط.',
  },
  {
    name: 'علي الحسناوي',
    city: 'كربلاء',
    score: 4,
    date: 'فبراير 2025',
    text: 'منتجات جيدة جداً والمقاسات دقيقة. أتمنى يضيفون المزيد من ألوان البولو. بشكل عام تجربة ممتازة وسأعود للطلب.',
  },
]

function Stars({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          style={{
            color: i <= score ? 'var(--accent)' : 'var(--line)',
            fontSize: '0.9rem',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default async function ReviewsPage() {
  const categories = await getCategories()

  const avg = (REVIEWS.reduce((s, r) => s + r.score, 0) / REVIEWS.length).toFixed(1)

  return (
    <>
      <Header categories={categories} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.25rem 5rem', direction: 'rtl' }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>SIZEME</Link>
          {' / '}آراء الزبائن
        </p>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="kicker" style={{ marginBottom: '0.75rem' }}>تقييمات حقيقية</p>
          <h1
            className="serif"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, marginBottom: '1rem' }}
          >
            ماذا يقول زبائننا
          </h1>

          {/* Aggregate Score */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 2rem',
              border: '1px solid var(--line)',
              marginTop: '1rem',
            }}
          >
            <span className="serif" style={{ fontSize: '3.5rem', lineHeight: 1, color: 'var(--ink)' }}>
              {avg}
            </span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--mute)' }}>
                من {REVIEWS.length}+ تقييم موثق
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', marginBottom: '3rem' }} />

        {/* Reviews Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--line)',
                padding: '1.5rem',
                background: i % 2 === 0 ? '#fafaf9' : '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Stars + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stars score={r.score} />
                <span style={{ fontSize: '0.68rem', color: 'var(--mute)', letterSpacing: '0.08em' }}>
                  {r.date}
                </span>
              </div>

              {/* Text */}
              <p style={{ fontSize: '0.875rem', color: 'var(--mute)', lineHeight: 1.8, flex: 1 }}>
                "{r.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--line)' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{r.name}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--mute)' }}>{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2.5rem',
            border: '1px solid var(--line)',
            background: '#fafaf9',
          }}
        >
          <p className="serif" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            جربت منتجاتنا؟
          </p>
          <p style={{ fontSize: '0.825rem', color: 'var(--mute)', marginBottom: '1.5rem' }}>
            رأيك يساعدنا ويساعد زبائن آخرين في اختيار المقاس الصحيح.
          </p>
          <a
            href="https://wa.me/9647739334545?text=أريد%20تقييم%20منتج%20من%20سايزمي"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              background: 'var(--ink)',
              color: '#fff',
              padding: '0.75rem 2rem',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            شارك تقييمك عبر واتساب
          </a>
        </div>

        {/* Back */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
          <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--mute)', textDecoration: 'none' }}>
            ← العودة للرئيسية
          </Link>
        </div>
      </main>
    </>
  )
}
