'use client'
import { useState, useEffect, useCallback } from 'react'
import { submitSuggestion } from '@/lib/actions/suggestions'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SuggestionModal({ open, onClose }: Props) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  /* أغلق بـ Escape */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  /* إعادة الضبط عند الإغلاق */
  useEffect(() => {
    if (!open) {
      setTimeout(() => { setText(''); setStatus('idle'); setErrMsg('') }, 300)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')
    const res = await submitSuggestion(text)
    if (res.ok) {
      setStatus('done')
    } else {
      setErrMsg(res.error ?? 'حدث خطأ.')
      setStatus('error')
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,26,26,0.55)',
          backdropFilter: 'blur(3px)',
          zIndex: 800,
          animation: 'fadeIn 0.2s ease both',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="شاركنا اقتراحك"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 801,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: '#fff',
            width: '100%',
            maxWidth: 480,
            padding: '2rem',
            direction: 'rtl',
            animation: 'slideUp 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both',
            position: 'relative',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="إغلاق"
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--mute)',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '0.25rem',
            }}
          >
            ✕
          </button>

          {status === 'done' ? (
            /* ─── شاشة الشكر ─── */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
              <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                شكراً على اقتراحك!
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--mute)', lineHeight: 1.75 }}>
                رأيك يساعدنا على تطوير Sizeme بشكل أفضل.<br />
                سنأخذ اقتراحك بعين الاعتبار.
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '1.5rem',
                  background: 'var(--ink)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 2rem',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                إغلاق
              </button>
            </div>
          ) : (
            /* ─── النموذج ─── */
            <form onSubmit={handleSubmit}>
              <p className="kicker" style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>
                رأيك يهمنا
              </p>
              <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '0.5rem' }}>
                شاركنا اقتراحك
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--mute)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                سواء كان عن المنتجات أو المقاسات أو التوصيل — أي فكرة تساعدنا نكون أفضل.
              </p>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="مثال: أتمنى تضيفون ألوان أكثر ، أو توجد مشكلة في الموقع ..."
                rows={5}
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  border: '1px solid var(--line)',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  color: 'var(--ink)',
                  background: '#fafaf9',
                  lineHeight: 1.75,
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--line)')}
              />

              {/* Character count */}
              <p style={{ fontSize: '0.68rem', color: 'var(--mute)', marginTop: '0.35rem', textAlign: 'left' }}>
                {text.length} / 1000
              </p>

              {errMsg && (
                <p style={{ fontSize: '0.78rem', color: '#c0392b', marginTop: '0.5rem' }}>
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !text.trim()}
                style={{
                  marginTop: '1.25rem',
                  width: '100%',
                  background: status === 'loading' ? 'var(--mute)' : 'var(--ink)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  letterSpacing: '0.08em',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {status === 'loading' ? 'جاري الإرسال...' : 'إرسال الاقتراح'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </>
  )
}
