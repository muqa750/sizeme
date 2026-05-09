const MESSAGES = [
  'اطلب وتونس.. التوصيل يوصل لباب بيتك وين ما تكون بالعراق 🚚🇮🇶',
  'وفر فلوسك وكشخ.. اطلب 5 قطع تي شيرت واحصل على خصم خاص! 💸',
  'القياس ما ناسبك؟ لتشيل هم.. الاستبدال عدنا أسهل منه ماكو وبكل بساطة 🔄',
  'كشختك بـ سايزمي غير.. اطلب بسرعة قبل ما تخلص الوجبة! 🔥',
  'مقاسات من 2XL حتى 7XL — جودة ماركات عالمية وبأسعار تناسبك',
]

export default function AnnouncementBar() {
  return (
    <div
      className="marquee announcement-gold"
      dir="ltr"
      style={{
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2520 50%, #1a1a1a 100%)',
        color: '#fff',
        fontSize: '0.72rem',
        padding: '0.5rem 0',
        letterSpacing: '0.04em',
      }}
    >
      <div className="marquee-track">
        {/* نسختان لتأثير اللف المتواصل */}
        {[0, 1].map(copy => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            style={{
              display: 'flex',
              gap: '3rem',
              paddingInline: '1.5rem',
              minWidth: '100vw',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {MESSAGES.map((msg, i) => (
              <span key={i} style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--accent)', marginInlineEnd: '0.4rem' }}>·</span>
                {msg}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
