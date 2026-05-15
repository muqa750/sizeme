'use client'
import { useState } from 'react'
import { subscribeNewsletter } from '@/lib/actions/newsletter'

export default function NewsletterSection() {
  const [contact, setContact] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim() || subStatus === 'loading') return
    setSubStatus('loading')
    setErrorMsg('')
    const res = await subscribeNewsletter(contact)
    if (res.ok) {
      setSubStatus('done')
    } else {
      setSubStatus('error')
      setErrorMsg(res.error ?? 'حدث خطأ، حاول مجدداً.')
    }
  }

  return (
    <section style={{ background: 'var(--paper)' }}>
      <div
        style={{
          maxWidth: '40rem',
          margin: '0 auto',
          padding: '3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p className="serif" style={{ fontSize: '1.15rem', marginBottom: '0.35rem', color: 'var(--ink)' }}>
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
                  color: 'var(--paper)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {subStatus === 'loading' ? '...' : 'اشترك'}
              </button>
            </form>
            {subStatus === 'error' && (
              <p style={{ fontSize: '0.75rem', color: '#c0392b', marginTop: '0.75rem', lineHeight: 1.6 }}>
                {errorMsg}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
