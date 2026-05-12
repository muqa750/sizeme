import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE    = 'sizeme_admin'
const GATEWAY_COOKIE = 'sizeme_gateway'

const SESSION_MAX_AGE = 60 * 60 * 24 * 3  // 3 أيام — تتجدد مع كل زيارة

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const gatewayToken = process.env.ADMIN_GATEWAY_TOKEN ?? ''

  // ── 1. المسار السري — يضع gateway cookie (session only، ينتهي بإغلاق المتصفح)
  if (pathname === '/admin-sz-1997') {
    const response = NextResponse.redirect(new URL('/admin/login', req.url))
    response.cookies.set(GATEWAY_COOKIE, gatewayToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // بدون maxAge = session cookie → ينتهي عند إغلاق المتصفح
      path:     '/',
    })
    return response
  }

  // ── 2. حماية كل مسارات /admin
  if (pathname.startsWith('/admin')) {
    const auth         = req.cookies.get(AUTH_COOKIE)
    const authValid    = auth?.value === process.env.ADMIN_SECRET
    const gateway      = req.cookies.get(GATEWAY_COOKIE)
    const gatewayValid = gateway?.value === gatewayToken

    // ── أ) مستخدم مسجّل دخوله ────────────────────────────────────────────────
    if (authValid) {
      // إذا حاول فتح صفحة الدخول وهو مسجّل → أرسله للأدمن مباشرةً
      if (pathname === '/admin/login' || pathname === '/admin/verify-otp') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      // تجديد الجلسة مع كل زيارة (sliding 3-day window)
      const response = NextResponse.next()
      response.cookies.set(AUTH_COOKIE, process.env.ADMIN_SECRET!, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   SESSION_MAX_AGE,
        path:     '/',
      })
      return response
    }

    // ── ب) غير مسجّل — بدون gateway cookie → الصفحة الرئيسية ────────────────
    if (!gatewayValid) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // ── ج) غير مسجّل + gateway صحيح → يسمح بصفحتَي الدخول والـ OTP فقط ──────
    if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/verify-otp')) {
      return NextResponse.next()
    }

    // غير مسجّل + يحاول فتح صفحة أخرى → أرسله لصفحة الدخول
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-sz-1997', '/admin/:path*'],
}
