'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import type { Category } from '@/lib/types'
import SearchOverlay from './SearchOverlay'

interface Props {
  categories: Category[]
}

export default function Header({ categories }: Props) {
  const { totals, setOpen } = useCart()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [dark,        setDark]        = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // تحميل الوضع المحفوظ
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.dataset.theme = 'dark'
      setDark(true)
    }
  }, [])

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme === 'dark'
    if (isDark) {
      delete document.documentElement.dataset.theme
      localStorage.setItem('theme', 'light')
      setDark(false)
    } else {
      document.documentElement.dataset.theme = 'dark'
      localStorage.setItem('theme', 'dark')
      setDark(true)
    }
  }

  function closeNav() { setMenuOpen(false) }

  return (
    <>
      {/* ═══════════════ HEADER ═══════════════ */}
      <header
        className="border-b hairline sticky top-0 z-40"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderBottom: '1px solid var(--glass-border)',
          transition: 'background 0.3s',
        }}
      >
        <div
          className="grid items-center mx-auto"
          style={{
            gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
            padding: '0 0.75rem',
            height: 56,
            maxWidth: 1280,
          }}
        >

          {/* ── يمين (col-1 RTL): Hamburger + Dark Mode ── */}
          <div className="flex items-center">

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="القائمة"
              className="hdr-btn"
              style={{ width: 46, height: 46 }}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              aria-label={dark ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="hdr-btn"
              style={{ width: 46, height: 46 }}
            >
              {dark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* ── وسط: الشعار ── */}
          <Link
            href="/"
            className="no-underline text-inherit"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 1,
              lineHeight: 1,
            }}
          >
            <span
              className="serif"
              style={{ fontSize: '1.5rem', letterSpacing: '0.22em', lineHeight: 1, color: 'var(--ink)' }}
            >
              SIZEME
            </span>
            <span style={{ fontSize: '0.5rem', letterSpacing: '0.22em', color: 'var(--mute)', marginTop: 1 }}>
              للقياسات الخاصة
            </span>
          </Link>

          {/* ── يسار (col-3 RTL): Search + Cart ── */}
          <div className="flex items-center justify-end">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="البحث"
              className="hdr-btn"
              style={{ width: 46, height: 46 }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5l4 4" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setOpen(true)}
              aria-label="السلة"
              className="hdr-btn relative"
              style={{ width: 46, height: 46 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h2l2 12h10l2-9H7" />
                <circle cx="9" cy="21" r="1" />
                <circle cx="17" cy="21" r="1" />
              </svg>
              {totals.qty > 0 && (
                <span
                  className="absolute flex items-center justify-center text-white font-medium"
                  style={{
                    top: 2,
                    insetInlineEnd: 2,
                    background: 'var(--accent)',
                    fontSize: 10,
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    lineHeight: 1,
                  }}
                >
                  {totals.qty}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ SEARCH ═══════════════ */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ═══════════════ OVERLAY ═══════════════ */}
      <div
        id="mobileNavOverlay"
        className={menuOpen ? 'open' : ''}
        onClick={closeNav}
      />

      {/* ═══════════════ MOBILE NAV DRAWER ═══════════════ */}
      <nav
        id="mobileNavDrawer"
        className={menuOpen ? 'open' : ''}
        aria-label="Navigation"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* ── رأس الدرج ── */}
        <div
          className="flex items-center justify-between border-b hairline"
          style={{ padding: '0.9rem 1.25rem', flexShrink: 0 }}
        >
          <button onClick={closeNav} className="p-1" aria-label="إغلاق">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
          <span className="serif" style={{ fontSize: '1.1rem', letterSpacing: '0.18em' }}>SIZEME</span>
        </div>

        {/* ── الرئيسية ── */}
        <div style={{ padding: '0.5rem 0' }}>
          <Link
            href="/"
            onClick={closeNav}
            className="mnav-cat"
            style={{ color: 'var(--mute)', fontSize: '0.82rem' }}
          >
            الرئيسية
          </Link>
        </div>

        {/* ── الأقسام — بدون عنوان وبدون خطوط ── */}
        <div style={{ flex: 1 }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              onClick={closeNav}
              className="mnav-cat"
            >
              {cat.name_ar}
            </Link>
          ))}
        </div>

        {/* ── القسم السفلي ── */}
        <div className="border-t hairline" style={{ padding: '1.25rem', flexShrink: 0 }}>

          {/* اختيار اللغة ── */}
          <div className="flex items-center justify-between mb-3" style={{ padding: '0.5rem 0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--mute)', fontSize: '0.82rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.5" />
                <ellipse cx="12" cy="12" rx="4" ry="9.5" />
                <line x1="2.5" y1="12" x2="21.5" y2="12" />
              </svg>
              <span>اللغة</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { code: 'ar', label: 'ع' },
                { code: 'en', label: 'En' },
                { code: 'ku', label: 'کو' },
              ].map(lang => (
                <button
                  key={lang.code}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: lang.code === 'ar' ? '1px solid var(--accent)' : '1px solid var(--line)',
                    background: lang.code === 'ar' ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: lang.code === 'ar' ? 'var(--accent)' : 'var(--mute)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* زر الوضع الليلي — iOS style ── */}
          <div
            className="flex items-center justify-between mb-5"
            style={{ padding: '0.7rem 0.9rem', borderRadius: 12, background: 'rgba(128,128,128,0.07)' }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--ink)' }}>
              {dark ? 'الوضع الليلي' : 'الوضع النهاري'}
            </span>
            <button
              role="switch"
              aria-checked={dark}
              onClick={toggleTheme}
              className="ios-switch"
              aria-label="تغيير الوضع"
            >
              <span className={`ios-track ${dark ? 'on' : ''}`} />
            </button>
          </div>

          {/* روابط السياسات — صف أفقي */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', direction: 'rtl' }}>
            {[
              { label: 'تحذير قانوني', href: '/legal/warning' },
              { label: 'شروط الاستخدام', href: '/legal/terms' },
              { label: 'سياسة الخصوصية', href: '/legal/privacy' },
            ].map(({ label, href }, i, arr) => (
              <span key={href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href={href}
                  onClick={closeNav}
                  style={{ fontSize: '0.72rem', color: 'var(--mute)', textDecoration: 'none', whiteSpace: 'nowrap' }}
                >
                  {label}
                </Link>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--line)' }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </nav>

    </>
  )
}
