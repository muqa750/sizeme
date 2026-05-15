'use client'
import Link from 'next/link'
import { useState } from 'react'
import { logout } from './login/actions'

// ── ترتيب القائمة الجديد ────────────────────────────────────────────────────
const NAV_MAIN = [
  { href: '/admin',                             label: 'الرئيسية'       },
  { href: '/admin/orders',                      label: 'الطلبات'        },
  { href: '/admin/analytics',                   label: 'الإحصائيات'     },
  { href: '/admin/products',                    label: 'المنتجات'       },
  { href: '/admin/management/coupons',          label: 'الكوبونات'      },
  { href: '/admin/management/newsletter',       label: 'النشرة البريدية' },
  { href: '/admin/management/suggestions',      label: 'الاقتراحات'     },
  { href: '/admin/management/ratings',          label: 'التقييمات'      },
  { href: '/admin/management/reviews',          label: 'الآراء'         },
]

const NAV_ADMIN = [
  { href: '/admin/management/brand-spotlight', label: 'براندات اللحظة' },
  { href: '/admin/management/settings',        label: 'الإعدادات'      },
]

const linkStyle = {
  display: 'block',
  padding: '0.7rem 1.5rem',
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.875rem',
} as const

const sectionLabel = {
  padding: '0.5rem 1.5rem 0.25rem',
  fontSize: '0.65rem',
  color: '#555',
  fontWeight: 700,
  marginTop: '0.75rem',
} as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .adm-topbar  { display: flex !important; }
          .adm-sidebar {
            position: fixed !important;
            top: 0; bottom: 0; right: 0;
            z-index: 50;
            transform: translateX(100%);
            transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
            width: 260px !important;
            padding-top: 3.5rem !important;
          }
          .adm-sidebar.open { transform: translateX(0) !important; }
          .adm-close        { display: block !important; }
          .adm-main         { padding-top: 52px; width: 100%; }
        }
        @media (min-width: 768px) {
          .adm-topbar { display: none !important; }
          .adm-close  { display: none !important; }
        }
        .adm-link:hover { background: rgba(255,255,255,0.06); color: #fff !important; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>

        {/* ── Mobile Top Bar — الهمبرجر على اليمين ── */}
        <div className="adm-topbar" style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 52, background: '#1a1a1a',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem', zIndex: 40,
          direction: 'rtl',
        }}>
          {/* الهمبرجر أولاً → يظهر على اليمين في RTL */}
          <button
            onClick={() => setOpen(true)}
            aria-label="القائمة"
            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '6px' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {/* اللوغو ثانياً → يظهر على اليسار */}
          <span style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}>
            SIZEME
          </span>
        </div>

        {/* ── Overlay ── */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 49 }}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`adm-sidebar${open ? ' open' : ''}`} style={{
          width: 220,
          background: '#1a1a1a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 0',
          flexShrink: 0,
          position: 'relative',
        }}>

          {/* زر الإغلاق (موبايل) */}
          <button
            className="adm-close"
            onClick={() => setOpen(false)}
            style={{
              display: 'none',
              position: 'absolute', top: 14, left: 14,
              background: 'none', border: 'none',
              color: '#666', cursor: 'pointer', padding: 4,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Logo */}
          <div style={{
            padding: '0 1.5rem 1.75rem',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.3rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '0.75rem',
          }}>
            SIZEME
            <span style={{ display: 'block', fontSize: '0.62rem', color: '#555', marginTop: 4 }}>
              ADMIN
            </span>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1 }}>
            <p style={sectionLabel}>القسم الرئيسي</p>
            {NAV_MAIN.map(n => (
              <Link
                key={n.href} href={n.href}
                className="adm-link"
                style={linkStyle}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '1rem' }}>
              <p style={sectionLabel}>الإدارة</p>
              {NAV_ADMIN.map(n => (
                <Link
                  key={n.href} href={n.href}
                  className="adm-link"
                  style={{ ...linkStyle, color: '#aaa' }}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div style={{
            padding: '1rem 1.5rem 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <Link href="/" style={{ fontSize: '0.78rem', color: '#666', textDecoration: 'none' }}>
              ← العودة للمتجر
            </Link>
            <form action={logout}>
              <button type="submit" style={{
                background: 'none', border: 'none', color: '#555',
                fontSize: '0.78rem', cursor: 'pointer', padding: 0,
              }}>
                تسجيل خروج
              </button>
            </form>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="adm-main" style={{ flex: 1, background: '#f9f9f9', overflow: 'auto' }}>
          {children}
        </main>

      </div>
    </>
  )
}
