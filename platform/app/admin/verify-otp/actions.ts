'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'

const AUTH_COOKIE    = 'sizeme_admin'
const PENDING_COOKIE = 'sizeme_otp_pending'
const SESSION_MAX_AGE = 60 * 60 * 24 * 3 // 3 أيام

export async function verifyOtp(formData: FormData) {
  const code = ((formData.get('code') as string) ?? '').trim()
  const from = formData.get('from') as string || '/admin'

  const cookieStore = await cookies()
  const pendingId   = cookieStore.get(PENDING_COOKIE)?.value

  // تحقق أساسي
  if (!pendingId || !code || code.length !== 6 || !/^\d{6}$/.test(code)) {
    redirect(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`)
  }

  const admin = createAdminClient()

  // جلب سجل الـ OTP
  const { data: otpRecord } = await admin
    .from('admin_otps')
    .select('id, code, expires_at, used')
    .eq('id', pendingId)
    .single()

  // تحقق من الصحة والصلاحية
  if (
    !otpRecord ||
    otpRecord.used ||
    otpRecord.code !== code ||
    new Date(otpRecord.expires_at) < new Date()
  ) {
    redirect(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`)
  }

  // وضع علامة "مستخدم" على الـ OTP لمنع إعادة الاستخدام
  await admin.from('admin_otps').update({ used: true }).eq('id', pendingId)

  // حذف pending cookie وإضافة auth cookie (3 أيام)
  cookieStore.delete(PENDING_COOKIE)
  cookieStore.set(AUTH_COOKIE, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   SESSION_MAX_AGE,
    path:     '/',
  })

  redirect(from)
}
