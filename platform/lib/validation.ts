/**
 * أدوات التحقق من المدخلات + تنقية HTML
 * تُستخدم في كل الـ Server Actions
 */

// ── إيميل ───────────────────────────────────────────────────────
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function isValidEmail(s: string): boolean {
  const trimmed = s.trim()
  return trimmed.length <= 100 && EMAIL_RE.test(trimmed)
}

// ── هاتف عراقي ──────────────────────────────────────────────────
// الصيغ المقبولة:
//   7XXXXXXXXX         (10 أرقام، بدون 0 في البداية)
//   07XXXXXXXXX        (11 رقم، يبدأ بـ 07)
//   +9647XXXXXXXXX     (14 خانة مع +)
//   009647XXXXXXXXX    (15 خانة مع 00)
//   9647XXXXXXXXX      (13 رقم بدون +)
// شبكات: 70/71/72/73/74/75/76/77/78/79
const IRAQ_PHONE_RE = /^(\+?964|00964|0?)7[0-9]{9}$/

export function isValidIraqiPhone(s: string): boolean {
  // إزالة المسافات والشرطات
  const cleaned = s.trim().replace(/[\s-]/g, '')
  return IRAQ_PHONE_RE.test(cleaned)
}

// تطبيع رقم الهاتف إلى صيغة موحدة: 9647XXXXXXXXX
export function normalizeIraqiPhone(s: string): string {
  const cleaned = s.trim().replace(/[\s-]/g, '')
  if (cleaned.startsWith('+964')) return cleaned.slice(1)        // +964... → 964...
  if (cleaned.startsWith('00964')) return cleaned.slice(2)        // 00964... → 964...
  if (cleaned.startsWith('0')) return '964' + cleaned.slice(1) // 07... → 9647...
  if (/^7[0-9]{9}$/.test(cleaned)) return '964' + cleaned          // 7... → 9647...
  return cleaned
}

// ── النشرة: إيميل أو هاتف ──────────────────────────────────────
export function validateNewsletterContact(s: string): { ok: boolean; normalized?: string; error?: string } {
  const trimmed = s.trim()
  if (!trimmed) return { ok: false, error: 'يرجى إدخال بريدك أو رقم هاتفك.' }
  if (trimmed.length > 100) return { ok: false, error: 'الإدخال طويل جداً.' }

  if (isValidEmail(trimmed)) {
    return { ok: true, normalized: trimmed.toLowerCase() }
  }
  if (isValidIraqiPhone(trimmed)) {
    return { ok: true, normalized: normalizeIraqiPhone(trimmed) }
  }
  // رسالة مفصلة تشرح للمستخدم بالضبط ماذا يفعل
  const hasAt = trimmed.includes('@')
  if (hasAt) {
    return { ok: false, error: 'صيغة البريد الإلكتروني غير صحيحة. مثال: name@gmail.com' }
  }
  const onlyDigits = /^[+\d\s-]+$/.test(trimmed)
  if (onlyDigits) {
    return { ok: false, error: 'رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 11 رقم. مثال: 07739334545' }
  }
  return { ok: false, error: 'أدخل بريد إلكتروني (name@gmail.com) أو رقم هاتف عراقي (07XXXXXXXXX).' }
}

// ── HTML Sanitization ──────────────────────────────────────────
/**
 * إزالة كل tags HTML + escape للحروف الخاصة
 * بسيط وفعّال ضد XSS الأساسي بدون dependencies إضافية
 */
export function sanitizeText(s: string): string {
  return s
    .trim()
    // إزالة كل HTML tags
    .replace(/<[^>]*>/g, '')
    // escape للحروف الخطرة المتبقية
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    // إزالة null bytes و control chars (ما عدا \n \r \t)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

// ── Rating label whitelist ────────────────────────────────────
export const RATING_LABELS = ['غاضب', 'حزين', 'عادي', 'راضي', 'سعيد جداً'] as const
export type RatingLabel = typeof RATING_LABELS[number]

export function isValidRatingLabel(s: string): s is RatingLabel {
  return RATING_LABELS.includes(s as RatingLabel)
}

export function clampRatingScore(n: number): number {
  if (!Number.isFinite(n)) return 1
  return Math.max(1, Math.min(5, Math.round(n)))
}
