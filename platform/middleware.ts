import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'sizeme_admin'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // حماية كل مسارات /admin ما عدا صفحة تسجيل الدخول نفسها
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const cookie = req.cookies.get(ADMIN_COOKIE)

    if (!cookie || cookie.value !== process.env.ADMIN_SECRET) {
      const loginUrl = new URL('/admin/login', req.url)
      // احتفظ بالمسار الأصلي للعودة إليه بعد تسجيل الدخول
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
