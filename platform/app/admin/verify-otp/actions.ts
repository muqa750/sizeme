'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase'

const AUTH_COOKIE    = 'sizeme_admin'
const PENDING_COOKIE = 'sizeme_otp_pending'
const SESSION_MAX_AGE = 60 * 60 * 24 * 3 // 3 أيام
const OTP_MAX_AGE     = 5 * 60           // 5 دقائق

// ── التحقق من الرمز ────────────────────────────────────────────────────────
// لا نعتمد على pending cookie (مشكلة في Next.js 14 Server Actions)
// بدلاً من ذلك: نبحث مباشرةً في DB عن رمز صالح غير مستخدم
export async function verifyOtp(formData: FormData) {
  const code = ((formData.get('code') as string) ?? '').trim()
  const from = (formData.get('from') as string) || '/admin'

  if (!code || !/^\d{6}$/.test(code)) {
    redirect(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`)
  }

  const admin = createAdminClient()

  // نبحث عن أحدث رمز صالح يطابق الكود المدخل
  const { data: otpRecord } = await admin
    .from('admin_otps')
    .select('id, code, expires_at, used')
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  // نتحقق من الكود مع إزالة أي مسافات (CHAR padding في PostgreSQL)
  const match = (otpRecord ?? []).find(r => r.code.trim() === code)

  if (!match) {
    redirect(`/admin/verify-otp?error=1&from=${encodeURIComponent(from)}`)
  }

  // وضع علامة "مستخدم" لمنع إعادة الاستخدام
  await admin.from('admin_otps').update({ used: true }).eq('id', match.id)

  // حذف pending cookie وإضافة auth cookie (3 أيام)
  const cookieStore = await cookies()
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

// ── إعادة إرسال الرمز ──────────────────────────────────────────────────────
export async function resendOtp(formData: FormData) {
  const from = (formData.get('from') as string) || '/admin'

  const admin = createAdminClient()

  // إلغاء كل الرموز القديمة غير المستخدمة
  await admin
    .from('admin_otps')
    .update({ used: true })
    .eq('used', false)

  // توليد رمز جديد
  const code      = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + OTP_MAX_AGE * 1000)

  const { error: insertErr } = await admin
    .from('admin_otps')
    .insert({ code, expires_at: expiresAt.toISOString(), used: false })

  if (insertErr) {
    redirect(`/admin/login?from=${encodeURIComponent(from)}`)
  }

  // إرسال الرمز الجديد
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const resend = new Resend(resendKey)
    resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'SizeMe <orders@sizeme.iq>',
      to:      'mustafaqais750@gmail.com',
      subject: `${code} — رمز دخول SizeMe Admin`,
      html: `
        <div style="font-family:Arial,sans-serif;direction:rtl;max-width:420px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:36px;">
            <div style="font-size:22px;color:#c9a84c;letter-spacing:6px;font-family:'Georgia',serif;">SizeMe</div>
            <div style="font-size:10px;color:#aaa;letter-spacing:3px;margin-top:4px;">ADMIN ACCESS</div>
          </div>
          <div style="background:#f9f9f9;border-radius:10px;padding:36px;text-align:center;">
            <p style="color:#888;font-size:13px;margin:0 0 20px;">رمز الدخول الجديد</p>
            <div style="font-size:40px;font-weight:700;color:#1a1a1a;letter-spacing:12px;font-family:monospace;">${code}</div>
            <p style="color:#aaa;font-size:11px;margin:20px 0 0;">صالح لمدة <strong style="color:#888;">5 دقائق</strong> فقط</p>
          </div>
        </div>
      `,
    }).catch(err => console.error('[Resend OTP] Failed:', err))
  } else {
    console.log(`[DEV RESEND OTP] ${code}`)
  }

  redirect(`/admin/verify-otp?resent=1&from=${encodeURIComponent(from)}`)
}
