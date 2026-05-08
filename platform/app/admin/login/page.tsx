import { login } from './actions'

interface Props {
  searchParams: { error?: string; from?: string }
}

export default function LoginPage({ searchParams }: Props) {
  const hasError = searchParams.error === '1'
  const from     = searchParams.from ?? '/admin'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9f9f9',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2rem',
            letterSpacing: '0.2em',
            color: '#1a1a1a',
            marginBottom: 4,
          }}>
            SIZEME
          </p>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#aaa' }}>
            ADMIN
          </p>
        </div>

        {/* Form */}
        <form action={login}>
          <input type="hidden" name="from" value={from} />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: '#888',
              marginBottom: 8,
            }}>
              كلمة السر
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: hasError ? '1px solid #dc2626' : '1px solid #e5e5e5',
                background: '#fff',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '0.1em',
              }}
            />
            {hasError && (
              <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 6 }}>
                كلمة السر غير صحيحة
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#1a1a1a',
              color: '#fff',
              padding: '0.875rem',
              border: 'none',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              cursor: 'pointer',
            }}
          >
            دخول
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.72rem', color: '#ccc' }}>
          للمتجر{' '}
          <a href="/" style={{ color: '#aaa', textDecoration: 'none' }}>
            اضغط هنا
          </a>
        </p>
      </div>
    </div>
  )
}
