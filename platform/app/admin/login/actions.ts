'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE  = 'sizeme_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 يوم

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  const from     = formData.get('from') as string || '/admin'

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`)
  }

  // تخزين الـ secret في cookie آمن (httpOnly, sameSite)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })

  redirect(from)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
