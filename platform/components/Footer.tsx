'use client'
import { useState } from 'react'
import Link from 'next/link'
import SuggestionModal from '@/components/SuggestionModal'
import { subscribeNewsletter } from '@/lib/actions/newsletter'
import { submitRating } from '@/lib/actions/ratings'

const EMOJIS = [
  { value: 'غاضب', score: 1, icon: '😡' },
  { value: 'حزين', score: 2, icon: '😞' },
  { value: 'عادي', score: 3, icon: '😐' },
  { value: 'راضي', score: 4, icon: '😊' },
  { value: 'سعيد جداً', score: 5, icon: '😍' },
]

const colLink = {
  color: 'var(--mute)',
  textDecoration: 'none',
  fontSize: '0.825rem',
  lineHeight: 1,
  transition: 'color 0.18s',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: 0,
  display: 'block',
  textAlign: 'inherit',
} as const

const LANGS = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'ku', label: 'کوردی' },
]

export default function Footer() {
  const [contact, setContact] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [rated, setRated] = useState(false)
  const [selectedRating, setSelected] = useState<string | null>(null)
  const [suggOpen, setSuggOpen] = useState(false)
  const [activeLang, setActiveLang] = useState('ar')
  const [langOpen, setLangOpen] = useState(false)

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim() || subStatus === 'loading') return
    setSubStatus('loading')
    const res = await subscribeNewsletter(contact)
    setSubStatus(res.ok ? 'done' : 'error')
  }

  async function handleRate(value: string, score: number) {
    if (rated) return
    setSelected(value)
    setTimeout(() => setRated(true), 400)
    await submitRating(value, score)
  }

  const hover = (ink = true) => (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = ink ? 'var(--ink)' : 'var(--mute)'
  }

  return (
    <>
      <SuggestionModal open={suggOpen} onClose={() => setSuggOpen(false)} />

      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--footer-glass)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      }}>

        {/* ══ ٠ — شريط اللغة ══ */}
        <div style={{
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                border: 'none',
                borderRadius: 999,
                padding: '6px 10px',
                cursor: 'pointer', color: 'var(--mute)',
                fontSize: '0.82rem', fontFamily: 'inherit',
                letterSpacing: '0.04em',
              }}
            >
              {/* Globe */}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.5" />
                <ellipse cx="12" cy="12" rx="4" ry="9.5" />
                <line x1="2.5" y1="12" x2="21.5" y2="12" />
              </svg>
              <span>{LANGS.find(l => l.code === activeLang)?.label}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown */}
            {langOpen && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: 10, overflow: 'hidden',
                minWidth: 130,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                zIndex: 10,
              }}>
                {LANGS.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setActiveLang(lang.code); setLangOpen(false) }}
                    style={{
                      display: 'block', width: '100%',
                      padding: '10px 16px', textAlign: 'center',
                      background: activeLang === lang.code ? 'rgba(201,168,76,0.08)' : 'transparent',
                      color: activeLang === lang.code ? 'var(--accent)' : 'var(--ink)',
                      border: 'none', cursor: 'pointer',
                      fontSize: '0.82rem', fontFamily: 'inherit',
                      transition: 'background 0.12s',
                      borderBottom: '1px solid var(--line)',
                    }}
                    onMouseEnter={e => { if (activeLang !== lang.code) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
                    onMouseLeave={e => { if (activeLang !== lang.code) e.currentTarget.style.background = 'transparent' }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ ١ — أعمدة الروابط ══ */}
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1.5rem 2.5rem' }}>
          <div className="footer-cols">

            {/* المساعدة */}
            <div className="footer-col">
              <p className="footer-col-title">المساعدة</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'سياسة الاستبدال والإرجاع', href: '/legal/exchange' },
                  { label: 'الأسئلة الشائعة', href: '/legal/faq' },
                  { label: 'حاسبة المقاس', href: '/size-guide' },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} style={colLink}
                      onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* سياساتنا */}
            <div className="footer-col">
              <p className="footer-col-title">سياساتنا</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'تحذير قانوني', href: '/legal/warning' },
                  { label: 'شروط الاستخدام', href: '/legal/terms' },
                  { label: 'سياسة الخصوصية', href: '/legal/privacy' },
                ].map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} style={colLink}
                      onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* تفاعل معنا */}
            <div className="footer-col">
              <p className="footer-col-title">تفاعل معنا</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link href="/reviews" style={colLink}
                  onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
                  آراء الزبائن
                </Link>
                <button onClick={() => setSuggOpen(true)} style={colLink}
                  onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
                  شاركنا اقتراحك
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── فاصل ── */}
        <div style={{ borderTop: '1px solid var(--line)' }} />

        {/* ══ ٢ — النشرة البريدية + التقييم ══ */}
        <div
          style={{
            maxWidth: '40rem',
            margin: '0 auto',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
            textAlign: 'center',
          }}
        >
          {/* Newsletter */}
          <div style={{ width: '100%' }}>
            <p className="serif" style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>
              انضم إلى عائلة Sizeme
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--mute)', marginBottom: '1.25rem' }}>
              لتصلك المجموعات الحصرية والعروض قبل الجميع
            </p>

            {subStatus === 'done' ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                ✓ شكراً لاشتراكك! أنت الآن مشترك في النشرة البريدية.
              </p>
            ) : (
              <>
                <form
                  onSubmit={handleNewsletter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '22rem',
                    margin: '0 auto',
                    border: '1px solid var(--line)',
                    borderRadius: '9999px',
                    padding: '0.2rem',
                    background: 'var(--paper)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <input
                    type="text"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="بريدك الإلكتروني أو رقم الهاتف"
                    disabled={subStatus === 'loading'}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      padding: '0.5rem 0.75rem',
                      fontFamily: 'inherit',
                      color: 'var(--ink)',
                      direction: 'rtl',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    style={{
                      background: 'var(--ink)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'inherit',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#000')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--ink)')}
                  >
                    {subStatus === 'loading' ? '...' : 'اشترك'}
                  </button>
                </form>
                {subStatus === 'error' && (
                  <p style={{ fontSize: '0.75rem', color: '#c0392b', marginTop: '0.5rem' }}>
                    حدث خطأ، حاول مجدداً.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Emoji rating */}
          <div style={{ width: '100%' }}>
            {rated ? (
              <div>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>🌟</div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>شكراً لتقييمك!</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--mute)', marginTop: '0.25rem' }}>رأيك يصنع الفرق.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.8rem', color: 'var(--mute)', marginBottom: '0.875rem' }}>
                  كيف كانت تجربتك؟
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.625rem' }}>
                  {EMOJIS.map(e => (
                    <button
                      key={e.value}
                      aria-label={e.value}
                      onClick={() => handleRate(e.value, e.score)}
                      className="emoji-btn"
                    >
                      <span
                        className="emoji-icon"
                        style={{
                          transform: selectedRating === e.value ? 'scale(1.35)' : 'scale(1)',
                          transition: 'transform 0.2s',
                          display: 'block',
                        }}
                      >
                        {e.icon}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── فاصل ── */}
        <div style={{ borderTop: '1px solid var(--line)' }} />

        {/* ══ ٣ — الشعار + الوصف ══ */}
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 1.5rem 1.5rem',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
            <span className="serif" style={{ fontSize: '1.5rem', letterSpacing: '0.28em' }}>
              SIZEME
            </span>
          </Link>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.775rem',
              color: 'var(--mute)',
              lineHeight: 1.8,
              maxWidth: '34rem',
              marginInline: 'auto',
            }}
          >
            في سايزمي، نؤمن أن الأناقة لا تتوقف عند رقم معيّن.

            نحن لا نبيع ملابس بمقاسات كبيرة فحسب، بل نعيد تعريف الموضة العالمية لتناسبك أنت.

            دمجنا الخبرة التقنية في التصميم مع أرقى الأقمشة لنمنح الرجل العراقي الثقة التي يستحقها.

            سايزمي.. مقاسك الخاص، بأناقة لا تعرف الحدود..
            .
          </p>
        </div>

        {/* ── فاصل ── */}
        <div style={{ borderTop: '1px solid var(--line)' }} />

        {/* ══ ٤ — Copyright ══ */}
        <div
          style={{
            maxWidth: '64rem',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.68rem',
            color: 'var(--mute)',
          }}
        >
          <span>© {new Date().getFullYear()} SizeMe — جميع الحقوق محفوظة</span>
          <span style={{ letterSpacing: '0.28em' }}>IRAQ · BAGHDAD</span>
        </div>

      </footer>

      <style>{`
        /* Desktop */
        .footer-cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          justify-items: center;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          text-align: right;
          min-width: 140px;
        }
        .footer-col-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--ink);
          margin: 0 0 0.25rem;
        }

        /* Mobile */
        @media (max-width: 600px) {
          .footer-cols {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
          .footer-col {
            text-align: center;
            align-items: center;
            min-width: unset;
          }
          .footer-col:last-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </>
  )
}
