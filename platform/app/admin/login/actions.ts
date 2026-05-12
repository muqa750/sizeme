'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase'

const AUTH_COOKIE    = 'sizeme_admin'
const PENDING_COOKIE = 'sizeme_otp_pending'
const SESSION_MAX_AGE = 60 * 60 * 24 * 3   // 3 أيام
const OTP_MAX_AGE     = 5 * 60             // 5 دقائق

// ── إرسال رمز OTP ─────────────────────────────────────────────────────────
export async function login(formData: FormData) {
  const password = formData.get('password') as string
  const from     = formData.get('from') as string || '/admin'

  // تحقق من كلمة السر
  if (password !== process.env.ADMIN_PASSWORD) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`)
  }

  // توليد رمز 6 أرقام
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + OTP_MAX_AGE * 1000)

  // حفظ الـ OTP في قاعدة البيانات
  const admin = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: otpRecord, error: otpErr } = await (admin as any)
    .from('admin_otps')
    .insert({
      code,
      expires_at: expiresAt.toISOString(),
      used:       false,
    })
    .select('id')
    .single()

  if (otpErr || !otpRecord) {
    console.error('[OTP] Insert error:', otpErr)
    redirect(`/admin/login?error=2&from=${encodeURIComponent(from)}`)
  }

  // إرسال الرمز عبر Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const resend = new Resend(resendKey)
    resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'SizeMe <orders@sizeme.iq>',
      to:      'mustafaqais750@gmail.com',
      subject: `${code} — رمز دخول SizeMe Admin`,
      html: `
        <div style="font-family:Arial,sans-serif;direction:rtl;max-width:420px;margin:0 auto;padding:40px 20px;background:#fff;">
          <div style="text-align:center;margin-bottom:36px;">
            <div style="font-size:22px;color:#c9a84c;letter-spacing:6px;font-weight:300;font-family:'Georgia',serif;">SizeMe</div>
            <div style="font-size:10px;color:#aaa;letter-spacing:3px;margin-top:4px;">ADMIN ACCESS</div>
          </div>
          <div style="background:#f9f9f9;border-radius:10px;padding:36px;text-align:center;">
            <p style="color:#888;font-size:13px;margin:0 0 20px;">رمز الدخول الخاص بك</p>
            <div style="font-size:40px;font-weight:700;color:#1a1a1a;letter-spacing:12px;font-family:monospace;">${code}</div>
            <p style="color:#aaa;font-size:11px;margin:20px 0 0;">صالح لمدة <strong style="color:#888;">5 دقائق</strong> فقط</p>
          </div>
          <p style="color:#ccc;font-size:10px;text-align:center;margin-top:28px;line-height:1.5;">
            إذا لم تطلب هذا الرمز، تجاهل هذا الإيميل تماماً
          </p>
        </div>
      `,
    }).catch(err => console.error('[OTP Email] Failed:', err))
  } else {
    // في بيئة التطوير: اطبع الرمز في الـ console
    console.log(`[DEV OTP] رمز الدخول: ${code}`)
  }

  // حفظ ID السجل في cookie مؤقت
  const cookieStore = await cookies()
  cookieStore.set(PENDING_COOKIE, otpRecord.id as string, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   OTP_MAX_AGE,
    path:     '/',
  })

  redirect(`/admin/verify-otp?from=${encodeURIComponent(from)}`)
}

// ── تسجيل الخروج ──────────────────────────────────────────────────────────
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect('/admin/login')
}
