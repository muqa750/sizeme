/**
 * Skeleton screens — placeholders فاخرة بهوية SizeMe
 * تعرض أثناء جلب البيانات (في loading.tsx)
 */

export function ProductCardSkeleton() {
  return (
    <div className="sz-skel" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div className="sz-shimmer" style={{ aspectRatio: '4/5', background: 'var(--line)', borderRadius: 2 }} />
      <div className="sz-shimmer" style={{ height: 10, width: '40%', background: 'var(--line)', borderRadius: 2 }} />
      <div className="sz-shimmer" style={{ height: 14, width: '75%', background: 'var(--line)', borderRadius: 2 }} />
      <div className="sz-shimmer" style={{ height: 12, width: '30%', background: 'var(--line)', borderRadius: 2 }} />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      <div
        className="sz-skel-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 0.625rem', padding: 'clamp(1rem, 4vw, 2rem)' }}
      >
        {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
      <style>{`
        @media (min-width: 640px)  { .sz-skel-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .sz-skel-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        .sz-shimmer {
          position: relative;
          overflow: hidden;
        }
        .sz-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: sz-shimmer 1.4s infinite;
          transform: translateX(-100%);
        }
        html[data-theme="dark"] .sz-shimmer::after {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }
        @keyframes sz-shimmer { 100% { transform: translateX(100%); } }
      `}</style>
    </>
  )
}

export function HeroSkeleton() {
  return (
    <div className="sz-shimmer" style={{
      width: '100%', aspectRatio: '3/1', minHeight: 120, maxHeight: 260,
      background: 'var(--line)',
    }} />
  )
}

export function PageHeadingSkeleton() {
  return (
    <div style={{ padding: '2rem 1.25rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="sz-shimmer" style={{ height: 10, width: 120, background: 'var(--line)', borderRadius: 2, marginBottom: '1rem' }} />
      <div className="sz-shimmer" style={{ height: 42, width: '55%', background: 'var(--line)', borderRadius: 2, marginBottom: '0.75rem' }} />
      <div className="sz-shimmer" style={{ height: 12, width: 80, background: 'var(--line)', borderRadius: 2 }} />
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div style={{ direction: 'rtl', maxWidth: 1200, margin: '0 auto', padding: '1.25rem' }}>
      <div className="sz-prod-skel" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="sz-shimmer" style={{ aspectRatio: '4/5', background: 'var(--line)', borderRadius: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="sz-shimmer" style={{ height: 10, width: 100, background: 'var(--line)', borderRadius: 2 }} />
          <div className="sz-shimmer" style={{ height: 32, width: '70%', background: 'var(--line)', borderRadius: 2 }} />
          <div className="sz-shimmer" style={{ height: 22, width: '40%', background: 'var(--line)', borderRadius: 2 }} />
          <div className="sz-shimmer" style={{ height: 1, background: 'var(--line)', margin: '0.5rem 0' }} />
          <div className="sz-shimmer" style={{ height: 14, width: '90%', background: 'var(--line)', borderRadius: 2 }} />
          <div className="sz-shimmer" style={{ height: 14, width: '80%', background: 'var(--line)', borderRadius: 2 }} />
          <div className="sz-shimmer" style={{ height: 14, width: '60%', background: 'var(--line)', borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="sz-shimmer" style={{ width: 44, height: 44, background: 'var(--line)', borderRadius: '50%' }} />
            ))}
          </div>
          <div className="sz-shimmer" style={{ height: 48, background: 'var(--line)', borderRadius: 4, marginTop: '0.5rem' }} />
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .sz-prod-skel { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  )
}
