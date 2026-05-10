/**
 * SizeMe — نظام إرسال إيميلات التنبيه عبر Resend
 * يُستخدم فقط server-side
 */
import { Resend } from 'resend'
import { createAdminClient } from './supabase'

// ── تهيئة Resend ─────────────────────────────────────────────────────────────
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

// ── جلب قائمة الإيميلات من الإعدادات ────────────────────────────────────────
export async function getNotifyEmails(): Promise<string[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('settings')
      .select('value')
      .eq('key', 'notify_emails')
      .single()

    if (!data?.value) return []

    const val = data.value
    // دعم JSON array أو comma-separated string
    if (Array.isArray(val)) return (val as string[]).filter(Boolean)
    if (typeof val === 'string') {
      return val.split(',').map((e: string) => e.trim()).filter(Boolean)
    }
    return []
  } catch {
    return []
  }
}

// ── تنسيق المبالغ ────────────────────────────────────────────────────────────
function fmtIQD(amount: number) {
  return amount.toLocaleString('en-US') + ' د.ع'
}

// ── نوع بيانات الطلب ─────────────────────────────────────────────────────────
export interface OrderEmailData {
  order_id:        string
  name:            string
  phone:           string
  province:        string
  area:            string
  address:         string
  notes:           string
  coupon_code:     string
  items: Array<{
    brand:      string
    sub:        string
    color:      string
    size:       string
    qty:        number
    unit_price: number
    line_total: number
  }>
  subtotal:        number
  bulk_discount:   number
  coupon_discount: number
  shipping:        number
  total:           number
}

// ── بناء HTML الإيميل ────────────────────────────────────────────────────────
function buildEmailHtml(order: OrderEmailData, adminUrl: string): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a;">
        <strong>${item.brand}</strong>${item.sub ? `<span style="color:#999;font-weight:400;"> — ${item.sub}</span>` : ''}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#666;text-align:center;">
        ${item.color || '—'}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#666;text-align:center;">
        ${item.size || '—'}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#666;text-align:center;">
        ${item.qty}
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600;color:#1a1a1a;text-align:left;direction:ltr;white-space:nowrap;">
        ${fmtIQD(item.line_total)}
      </td>
    </tr>
  `).join('')

  const discountRows = [
    order.bulk_discount > 0 ? `
      <tr>
        <td style="padding:5px 0;font-size:13px;color:#888;">خصم الكمية</td>
        <td style="padding:5px 0;font-size:13px;color:#16a34a;text-align:left;direction:ltr;">− ${fmtIQD(order.bulk_discount)}</td>
      </tr>` : '',
    order.coupon_discount > 0 ? `
      <tr>
        <td style="padding:5px 0;font-size:13px;color:#888;">
          كوبون${order.coupon_code ? ` <code style="font-size:11px;background:#f5f5f5;padding:1px 5px;border-radius:3px;">${order.coupon_code}</code>` : ''}
        </td>
        <td style="padding:5px 0;font-size:13px;color:#16a34a;text-align:left;direction:ltr;">− ${fmtIQD(order.coupon_discount)}</td>
      </tr>` : '',
  ].filter(Boolean).join('')

  const addressBlock = [
    order.address ? `<tr><td style="padding:5px 0;font-size:13px;color:#888;width:110px;">العنوان</td><td style="padding:5px 0;font-size:13px;color:#1a1a1a;">${order.address}</td></tr>` : '',
    order.notes   ? `<tr><td style="padding:5px 0;font-size:13px;color:#888;">ملاحظات</td><td style="padding:5px 0;font-size:13px;color:#c0392b;">${order.notes}</td></tr>` : '',
  ].filter(Boolean).join('')

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>طلب جديد — ${order.order_id}</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:40px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td style="background:#1a1a1a;padding:28px 36px;text-align:center;">
        <div style="font-size:24px;color:#c9a84c;letter-spacing:6px;font-weight:300;">SizeMe</div>
        <div style="font-size:11px;color:#666;letter-spacing:3px;margin-top:6px;">NEW ORDER</div>
      </td>
    </tr>

    <!-- Order ID Banner -->
    <tr>
      <td style="background:#c9a84c;padding:12px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;font-weight:700;color:#1a1a1a;">رقم الطلب: ${order.order_id}</td>
            <td style="font-size:11px;color:#7a5e1a;text-align:left;">الدفع عند الاستلام</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Customer Info -->
    <tr>
      <td style="background:#fff;padding:28px 36px;border-bottom:1px solid #f5f5f5;">
        <div style="font-size:11px;color:#bbb;letter-spacing:2px;margin-bottom:16px;">معلومات الزبون</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#888;width:110px;">الاسم</td>
            <td style="padding:5px 0;font-size:14px;font-weight:700;color:#1a1a1a;">${order.name}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#888;">الهاتف</td>
            <td style="padding:5px 0;font-size:13px;font-weight:600;color:#1a1a1a;direction:ltr;text-align:right;">${order.phone}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#888;">المحافظة</td>
            <td style="padding:5px 0;font-size:13px;color:#1a1a1a;">${order.province}${order.area ? ` — ${order.area}` : ''}</td>
          </tr>
          ${addressBlock}
        </table>
      </td>
    </tr>

    <!-- Items -->
    <tr>
      <td style="background:#fff;padding:28px 36px;border-bottom:1px solid #f5f5f5;">
        <div style="font-size:11px;color:#bbb;letter-spacing:2px;margin-bottom:16px;">المنتجات (${order.items.length})</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#fafafa;">
              <th style="padding:10px 14px;font-size:11px;color:#aaa;font-weight:500;text-align:right;">المنتج</th>
              <th style="padding:10px 8px;font-size:11px;color:#aaa;font-weight:500;text-align:center;">اللون</th>
              <th style="padding:10px 8px;font-size:11px;color:#aaa;font-weight:500;text-align:center;">المقاس</th>
              <th style="padding:10px 8px;font-size:11px;color:#aaa;font-weight:500;text-align:center;">الكمية</th>
              <th style="padding:10px 14px;font-size:11px;color:#aaa;font-weight:500;text-align:left;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </td>
    </tr>

    <!-- Pricing Summary -->
    <tr>
      <td style="background:#fff;padding:0 36px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #f0f0f0;padding-top:18px;">
          ${discountRows}
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#888;">التوصيل</td>
            <td style="padding:5px 0;font-size:13px;color:${order.shipping === 0 ? '#16a34a' : '#1a1a1a'};text-align:left;direction:ltr;">
              ${order.shipping === 0 ? 'مجاني 🎉' : fmtIQD(order.shipping)}
            </td>
          </tr>
          <tr>
            <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#1a1a1a;">الإجمالي الكلي</td>
            <td style="padding:14px 0 0;font-size:18px;font-weight:700;color:#c9a84c;text-align:left;direction:ltr;">${fmtIQD(order.total)}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="background:#fff;padding:8px 36px 36px;text-align:center;">
        <a href="${adminUrl}"
           style="display:inline-block;background:#1a1a1a;color:#c9a84c;text-decoration:none;padding:14px 36px;font-size:13px;letter-spacing:1px;border-radius:6px;">
          عرض الطلب في لوحة التحكم ←
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9f9f9;padding:18px 36px;text-align:center;border-top:1px solid #f0f0f0;">
        <p style="margin:0;font-size:11px;color:#ccc;letter-spacing:1px;">
          SizeMe — تنبيه تلقائي — لا ترد على هذا الإيميل
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── الدالة الرئيسية: إرسال تنبيه طلب جديد ───────────────────────────────────
export async function sendOrderNotification(order: OrderEmailData): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY غير موجود — تم تخطي الإيميل')
    return
  }

  const emails = await getNotifyEmails()
  if (emails.length === 0) {
    console.warn('[Email] notify_emails فارغ في الإعدادات — تم تخطي الإيميل')
    return
  }

  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sizeme.iq'
  const adminUrl = `${siteUrl}/admin/orders`
  const html     = buildEmailHtml(order, adminUrl)

  try {
    const { data, error } = await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'SizeMe <orders@sizeme.iq>',
      to:      emails,
      subject: `🛍️ طلب جديد — ${order.order_id} — ${order.name}`,
      html,
    })

    if (error) {
      console.error('[Email] Resend error:', error)
    } else {
      console.log('[Email] تم الإرسال بنجاح:', data?.id)
    }
  } catch (err) {
    // الإيميل لا يوقف عملية الطلب أبداً
    console.error('[Email] Exception:', err)
  }
}
