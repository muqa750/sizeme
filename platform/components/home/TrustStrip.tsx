export default function TrustStrip() {
  const items = [
    {
      label: 'ضمان استبدال القياس',
      sub: 'اطلب باطمئنان',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" style={{ color: 'var(--accent)' }}>
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: '2XL → 7XL',
      sub: 'مدى المقاسات',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" style={{ color: 'var(--accent)' }}>
          <rect x="2" y="7" width="20" height="10" rx="2" />
          <path d="M6 7V5M10 7V5M14 7V5M18 7V5M6 17v2M10 17v2M14 17v2M18 17v2" />
        </svg>
      ),
    },
    {
      label: '30,000 /قطعة',
      sub: '5+ قطع',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" style={{ color: 'var(--accent)' }}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: 'شحن مجاني',
      sub: 'على الطلبات الكبيرة',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" style={{ color: 'var(--accent)' }}>
          <rect x="1" y="3" width="15" height="13" rx="1" />
          <path d="M16 8h4l3 5v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="1.5" />
          <circle cx="18.5" cy="18.5" r="1.5" />
        </svg>
      ),
    },
  ]

  return (
    <section className="border-y hairline" style={{ background: 'var(--paper)', overflowX: 'auto' }}>
      <div
        className="max-w-7xl mx-auto px-5 py-6 grid text-center"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', minWidth: 340 }}
      >
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1" style={{ padding: '0 0.25rem' }}>
            <div style={{ width: 24, height: 24, flexShrink: 0 }} className="flex items-center justify-center">
              {item.icon}
            </div>
            <div className="serif leading-tight" style={{ fontSize: 'clamp(0.7rem, 2.2vw, 0.95rem)' }}>{item.label}</div>
            <div className="kicker" style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.65rem)' }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
