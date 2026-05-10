import Link from 'next/link'
import { logout } from './login/actions'

const NAV_MAIN = [
  { href: '/admin',           label: 'الرئيسية' },
  { href: '/admin/orders',    label: 'الطلبات'  },
  { href: '/admin/products',  label: 'المنتجات' },
  { href: '/admin/analytics', label: 'إحصائيات' },
]

const NAV_MGMT = [
  { href: '/admin/management/coupons',     label: 'الكوبونات'      },
  { href: '/admin/management/newsletter',  label: 'النشرة البريدية' },
  { href: '/admin/management/ratings',     label: 'التقييمات'      },
  { href: '/admin/management/suggestions', label: 'الاقتراحات'     },
  { href: '/admin/management/settings',    label: 'الإعدادات'      },
]

const linkStyle = {
  display: 'block',
  padding: '0.65rem 1.5rem',
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.8rem',
  letterSpacing: '0.04em',
} as const

const sectionLabel = {
  padding: '0.5rem 1.5rem 0.25rem',
  fontSize: '0.58rem',
  letterSpacing: '0.18em',
  color: '#555',
  fontWeight: 700,
  marginTop: '0.75rem',
} as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: 210,
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 0',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 1.5rem 2rem',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.25rem',
          letterSpacing: '0.15em',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '1rem',
        }}>
          SIZEME
          <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#555', marginTop: 4 }}>
            ADMIN
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {/* — القسم الرئيسي — */}
          <p style={sectionLabel}>القسم الرئيسي</p>
          {NAV_MAIN.map(n => (
            <Link key={n.href} href={n.href} style={linkStyle}>{n.label}</Link>
          ))}

          {/* — الإدارة — */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1rem' }}>
            <p style={sectionLabel}>الإدارة</p>
            {NAV_MGMT.map(n => (
              <Link key={n.href} href={n.href} style={{ ...linkStyle, color: '#aaa', fontSize: '0.775rem' }}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer links */}
        <div style={{
          padding: '1rem 1.5rem 0',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <Link href="/" style={{ fontSize: '0.72rem', color: '#666', textDecoration: 'none' }}>
            ← العودة للمتجر
          </Link>
          <form action={logout}>
            <button type="submit" style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '0.72rem',
              cursor: 'pointer',
              padding: 0,
              letterSpacing: '0.05em',
            }}>
              تسجيل خروج
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, background: '#f9f9f9', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
