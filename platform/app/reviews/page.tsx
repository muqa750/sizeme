import Link from 'next/link'
import { getCategories } from '@/lib/api'
import { getReviews } from '@/lib/api'
import Header from '@/components/Header'
import ReviewForm from './ReviewForm'
import type { Review } from '@/lib/types'

const PER_PAGE = 6

function Stars({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= score ? 'var(--accent)' : 'var(--line)', fontSize: '0.85rem' }}>★</span>
      ))}
    </div>
  )
}

function avgScore(r: Pick<Review, 'fabric_rating'|'size_rating'|'delivery_rating'|'service_rating'>) {
  return (r.fabric_rating + r.size_rating + r.delivery_rating + r.service_rating) / 4
}

interface Props {
  searchParams: { page?: string }
}

export default async function ReviewsPage({ searchParams }: Props) {
  const [categories, dynamicReviews] = await Promise.all([
    getCategories(),
    getReviews(),
  ])

  const allCount   = dynamicReviews.length
  const totalPages = Math.max(1, Math.ceil(allCount / PER_PAGE))
  const page       = Math.max(1, Math.min(totalPages, parseInt(searchParams.page ?? '1') || 1))
  const offset     = (page - 1) * PER_PAGE

  const combined = dynamicReviews.map(r => ({
    id: r.id, name: r.name, body: r.body,
    score: avgScore(r),
    date: new Date(r.created_at).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long' }),
  }))
  const pageItems = combined.slice(offset, offset + PER_PAGE)

  const allScores = combined.map(r => r.score)
  const avg = allScores.length ? (allScores.reduce((s, v) => s + v, 0) / allScores.length).toFixed(1) : '5.0'

  return (
    <>
      <style>{`
        .reviews-main { max-width: 860px; margin: 0 auto; padding: 3rem 1.25rem 5rem; direction: rtl; }
        @media (max-width: 600px) {
          .reviews-main { max-width: 100%; margin: 0; padding: 1.75rem 0 4rem; }
          .reviews-main .reviews-inner { padding: 0 0.75rem; }
          .reviews-grid { padding: 0 0.75rem; }
        }
      `}</style>
      <Header categories={categories} />
      <main className="reviews-main">

        {/* Breadcrumb */}
        <p className="reviews-inner" style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>SIZEME</Link>
          {' / '}آراء الزبائن
        </p>

        {/* Hero */}
        <div className="reviews-inner" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="kicker" style={{ marginBottom: '0.75rem' }}>تقييمات حقيقية</p>
          <h1 className="serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, marginBottom: '1rem' }}>
            ماذا يقول زبائننا
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', border: '1px solid var(--line)', marginTop: '1rem' }}>
            <span className="serif" style={{ fontSize: '3.5rem', lineHeight: 1, color: 'var(--ink)' }}>{avg}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                {[0,1,2,3,4].map(i => <span key={i} style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>★</span>)}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--mute)' }}>من {allCount}+ تقييم موثق</p>
            </div>
          </div>
        </div>

        <div className="reviews-inner" style={{ borderTop: '1px solid var(--line)', marginBottom: '3rem' }} />

        {/* Reviews Grid */}
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
          {pageItems.map((r) => (
            <div key={r.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '1.5rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stars score={Math.round(r.score)} />
                <span style={{ fontSize: '0.68rem', color: 'var(--mute)', letterSpacing: '0.08em' }}>{r.date}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--mute)', lineHeight: 1.8, flex: 1 }}>"{r.body}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--line)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>
                  {r.name.charAt(0)}
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)' }}>{r.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="reviews-inner" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={p === 1 ? '/reviews' : `/reviews?page=${p}`}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderRadius: 6, fontSize: '0.82rem', textDecoration: 'none',
                  background: p === page ? 'var(--ink)' : 'transparent',
                  color:      p === page ? '#fff'      : 'var(--mute)',
                  borderColor: p === page ? 'var(--ink)' : 'var(--line)',
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}

        {/* فورم الرأي */}
        <div className="reviews-inner" style={{ marginTop: '3.5rem' }}>
          <ReviewForm />
        </div>

        {/* Back */}
        <div className="reviews-inner" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
          <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--mute)', textDecoration: 'none' }}>
            ← العودة للرئيسية
          </Link>
        </div>
      </main>
    </>
  )
}
