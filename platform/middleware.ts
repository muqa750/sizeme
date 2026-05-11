import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE    = 'sizeme_admin'
const GATEWAY_COOKIE = 'sizeme_gateway'
const PENDING_COOKIE = 'sizeme_otp_pending'

// ── In-memory rate limiting for login attempts ─────────────────────────────
// ملاحظة: يعمل على مستوى الـ instance — كافٍ لمشروع بأدمن واحد
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>()
const MAX_LOGIN_ATTEMPTS = 8
const BLOCK_DURATION     = 15 * 60 * 1000 // 15 دقيقة

function isLoginRateLimited(ip: string): boolean {
  const now   = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry) return false
  if (now < entry.blockedUntil) return true
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    loginAttempts.set(ip, { count: entry.count, blockedUntil: now + BLOCK_DURATION })
    return true
  }
  return false
}

export function recordFailedLogin(ip: string) {
  const entry = loginAttempts.get(ip) ?? { count: 0, blockedUntil: 0 }
  loginAttempts.set(ip, { count: entry.count + 1, blockedUntil: entry.blockedUntil })
}

export function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip)
}

// ── Middleware ─────────────────────────────────────────────────────────────
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const gatewayToken = process.env.ADMIN_GATEWAY_TOKEN ?? ''

  // ── 1. مسار البوابة السرية: يضع gateway cookie ويعيد التوجيه لصفحة الدخول
  if (pathname === '/admin-sz-1997') {
    const response = NextResponse.redirect(new URL('/admin/login', req.url))
    response.cookies.set(GATEWAY_COOKIE, gatewayToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   60 * 60 * 24 * 90, // 90 يوم
      path:     '/',
    })
    return response
  }

  // ── 2. حماية مسارات /admin
  if (pathname.startsWith('/admin')) {
    const gateway = req.cookies.get(GATEWAY_COOKIE)

    // بدون gateway cookie → المستخدم لم يمر عبر المسار السري → الصفحة الرئيسية
    if (!gateway || gateway.value !== gatewayToken) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Gateway صحيح — صفحات الدخول والـ OTP لا تحتاج auth cookie
    if (
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/verify-otp')
    ) {
      return NextResponse.next()
    }

    // باقي صفحات الأدمن تحتاج auth cookie
    const auth = req.cookies.get(AUTH_COOKIE)
    if (!auth || auth.value !== process.env.ADMIN_SECRET) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-sz-1997', '/admin/:path*'],
}
