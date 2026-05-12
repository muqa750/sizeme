import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const AUTH_COOKIE = 'sizeme_admin'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const code = ((formData.get('code') as string) ?? '').trim()
  const from = (formData.get('from') as string) || '/admin'

  const origin = request.nextUrl.origin

  // تحقق من صيغة الرمز
  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.redirect(
      new URL(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`, origin),
    )
  }

  const admin = createAdminClient()

  // نبحث عن رمز صالح (غير مستخدم وغير منتهٍ) يطابق الكود المدخل
  const { data: records } = await admin
    .from('admin_otps')
    .select('id, code, expires_at, used')
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  const match = (records ?? []).find(r => r.code.trim() === code)

  if (!match) {
    return NextResponse.redirect(
      new URL(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`, origin),
    )
  }

  // وضع علامة "مستخدم"
  await admin.from('admin_otps').update({ used: true }).eq('id', match.id)

  // NextResponse.redirect + cookies.set = الطريقة الأكثر موثوقية
  const response = NextResponse.redirect(new URL(from, origin))

  response.cookies.set(AUTH_COOKIE, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 24 * 3, // 3 أيام
    path:     '/',
  })

  return response
}
