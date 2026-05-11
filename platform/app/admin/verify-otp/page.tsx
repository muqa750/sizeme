import { verifyOtp, resendOtp } from './actions'

interface Props {
  searchParams: { from?: string; error?: string; resent?: string }
}

export default function VerifyOtpPage({ searchParams }: Props) {
  const from      = searchParams.from ?? '/admin'
  const hasError  = searchParams.error === '1'
  const wasResent = searchParams.resent === '1'

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     '#f9f9f9',
      fontFamily:     'system-ui, sans-serif',
      direction:      'rtl',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily:    'Cormorant Garamond, serif',
            fontSize:      '2rem',
            letterSpacing: '0.2em',
            color:         '#1a1a1a',
            marginBottom:  4,
          }}>
            SIZEME
          </p>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#aaa' }}>
            ADMIN
          </p>
        </div>

        {/* Notice */}
        <p style={{
          textAlign:    'center',
          fontSize:     '0.82rem',
          color:        wasResent ? '#16a34a' : '#888',
          marginBottom: '1.75rem',
          lineHeight:   1.6,
        }}>
          {wasResent
            ? 'تم إرسال رمز جديد إلى إيميلك ✓'
            : 'تم إرسال رمز التحقق إلى إيميلك'}
          <br />
          <span style={{ fontSize: '0.72rem', color: '#bbb' }}>الرمز صالح لمدة 5 دقائق</span>
        </p>

        {/* Verify Form */}
        <form action={verifyOtp}>
          <input type="hidden" name="from" value={from} />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display:       'block',
              fontSize:      '0.7rem',
              letterSpacing: '0.1em',
              color:         '#888',
              marginBottom:  8,
            }}>
              رمز التحقق
            </label>
            <input
              type="text"
              name="code"
              autoFocus
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              style={{
                width:         '100%',
                padding:       '0.875rem 1rem',
                border:        hasError ? '1px solid #dc2626' : '1px solid #e5e5e5',
                background:    '#fff',
                fontSize:      '1.75rem',
                outline:       'none',
                boxSizing:     'border-box',
                textAlign:     'center',
                letterSpacing: '0.6em',
                fontFamily:    'monospace',
                fontWeight:    600,
                color:         '#1a1a1a',
              }}
            />
            {hasError && (
              <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 6 }}>
                الرمز غير صحيح أو انتهت صلاحيته
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width:         '100%',
              background:    '#1a1a1a',
              color:         '#fff',
              padding:       '0.875rem',
              border:        'none',
              fontSize:      '0.8rem',
              letterSpacing: '0.15em',
              cursor:        'pointer',
              marginBottom:  '0.75rem',
            }}
          >
            تحقق من الرمز
          </button>
        </form>

        {/* Resend Form */}
        <form action={resendOtp}>
          <input type="hidden" name="from" value={from} />
          <button
            type="submit"
            style={{
              width:         '100%',
              background:    'transparent',
              color:         '#888',
              padding:       '0.625rem',
              border:        '1px solid #e5e5e5',
              fontSize:      '0.78rem',
              letterSpacing: '0.05em',
              cursor:        'pointer',
            }}
          >
            إعادة إرسال الرمز
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: '#ccc' }}>
          <a href="/admin/login" style={{ color: '#aaa', textDecoration: 'none' }}>
            ← العودة لتسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  )
}
