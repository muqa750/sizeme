'use client'
import { useState } from 'react'
import Link from 'next/link'

// ── جدول المقاسات التقريبية ─────────────────────────────────────────────────
const SIZE_GUIDE: Record<string, { chest: string; waist: string; weight: string }> = {
  '2XL': { chest: '124–128', waist: '108–112', weight: '90–100' },
  '3XL': { chest: '128–132', waist: '112–116', weight: '100–110' },
  '4XL': { chest: '132–136', waist: '116–120', weight: '110–120' },
  '5XL': { chest: '136–140', waist: '120–124', weight: '120–130' },
  '6XL': { chest: '140–144', waist: '124–128', weight: '130–145' },
  '7XL': { chest: '144–150', waist: '128–134', weight: '145–160' },
}

// ── Accordion واحد ──────────────────────────────────────────────────────────
function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '16px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'right',
        }}
      >
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>{title}</span>
        <span style={{
          fontSize: '1.2rem', fontWeight: 300, color: 'var(--mute)', lineHeight: 1,
          transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none',
          flexShrink: 0, marginRight: 8,
        }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: 20 }}>{children}</div>}
    </div>
  )
}

// ── أنماط مشتركة ─────────────────────────────────────────────────────────────
const muteText: React.CSSProperties = { fontSize: '0.82rem', color: 'var(--mute)', lineHeight: 1.85 }
const boldLabel: React.CSSProperties = { fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }
const thinValue: React.CSSProperties = { fontSize: '0.82rem', fontWeight: 300, color: 'var(--mute)' }

// ══ المكوّن الرئيسي ══════════════════════════════════════════════════════════
interface Props {
  description?: string | null
  sku: string
  brand: string
  selectedSize: string
}

export default function ProductAccordions({ description, sku, brand, selectedSize }: Props) {
  const sizeData = SIZE_GUIDE[selectedSize] ?? null

  return (
    <div style={{ marginTop: 8 }}>

      {/* ━━━ 1. التفاصيل والمقاس ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Accordion title="التفاصيل والمقاس" defaultOpen>

        {/* وصف المنتج */}
        {description && (
          <p style={{ ...muteText, whiteSpace: 'pre-line', marginBottom: 14 }}>
            {description}
          </p>
        )}

        {/* الخامات — العنوان عريض، القيمة ناعمة */}
        <div style={{ marginBottom: 10 }}>
          <p style={boldLabel}>الخامات</p>
          <p style={thinValue}>قماش قطن 100%</p>
        </div>

        {/* معرف المنتج — العنوان عريض، القيمة ناعمة */}
        <div style={{ marginBottom: 10 }}>
          <p style={boldLabel}>معرف المنتج</p>
          <p style={{ ...thinValue, fontFamily: 'monospace' }}>{sku}</p>
        </div>

        {/* الماركة — العنوان عريض، القيمة ناعمة */}
        <div style={{ marginBottom: 18 }}>
          <p style={boldLabel}>الماركة</p>
          <p style={thinValue}>{brand}</p>
        </div>

        {/* ── المقاس (عنوان + نص توضيحي) ── */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ ...boldLabel, marginBottom: 6 }}>المقاس</p>
          <p style={{ ...muteText, marginBottom: 4 }}>
            تستطيع مشاهدة كل تفاصيل مقاس المنتج في{' '}
            <Link href="/size-guide" style={{ color: 'var(--ink)', textDecoration: 'underline', textDecorationColor: 'var(--line)' }}>
              دليل المقاسات
            </Link>
          </p>
          <p style={muteText}>
            ايضاً لديك حاسبة المقاسات البسيطة في الأعلى  للتأكد من مقاسك الصحيح بسرعة
          </p>
        </div>

        {/* حاسبة المقاس — تظهر فقط عند اختيار مقاس */}
        {sizeData && (
          <div style={{
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 14,
          }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 500 }}>
              مقاسك المختار: {selectedSize}
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'الصدر', value: sizeData.chest + ' سم' },
                { label: 'الخصر', value: sizeData.waist + ' سم' },
                { label: 'الوزن التقريبي', value: sizeData.weight + ' كغ' },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--mute)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ملاحظة + واتساب */}
        <div style={{
          background: 'rgba(0,0,0,0.02)', borderRadius: 8,
          padding: '10px 12px', borderRight: '3px solid var(--line)',
        }}>
          <p style={{ ...muteText, marginBottom: 6 }}>
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>ملاحظة:</strong>{' '}
            إذا كنت محتاراً بين مقاسين ننصح باختيار الأكبر
          </p>
          <p style={muteText}>
            <span style={{ color: 'var(--ink)' }}>للمساعدة الشخصية تواصل معنا عبر</span>{' '}
            <a
              href="https://wa.me/9647739334545"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#25D366', fontWeight: 500, textDecoration: 'none' }}
            >
              واتساب
            </a>
          </p>
        </div>
      </Accordion>

      {/* ━━━ 2. العناية بالمنتج ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Accordion title="العناية بالمنتج">
        <p style={{ ...muteText, fontWeight: 500, color: 'var(--ink)', marginBottom: 10 }}>
          نوصيك باتباع إرشادات العناية للحفاظ على جودة هذا المنتج:
        </p>
        {[
          'أقصى درجة حرارة للغسيل هي 30 درجة مئوية',
          'عملية تنظيف خفيفة',
          'لا تستخدم المُبيّض',
          'لا يمكن تجفيفه في مجفف الملابس',
          'يُكوى عند درجة حرارة قصوى لقاعدة المكواة تبلغ 110 درجة مئوية',
          'لا يُنظَّف بالتنظيف الجاف',
          'تجفيف على سطح مستوٍ',
          'غسل لطيف',
          'يُفضَّل الكي على الجانب الداخلي مع استخدام قطعة نسيج بين المنتج والمكواة',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--accent)', fontSize: '0.6rem', marginTop: 5, flexShrink: 0 }}>●</span>
            <span style={muteText}>{item}</span>
          </div>
        ))}
      </Accordion>

      {/* ━━━ 3. الشحن والاستبدال ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Accordion title="الشحن والاستبدال">
        <p style={{ ...muteText, marginBottom: 14 }}>
          نحرص على وصول طلبيتك بأسرع وقت ممكن مع توفير مرونة كاملة في الاستبدال لضمان رضاك التام.
        </p>
        {[
          {
            title: 'التوصيل',
            body: 'شحن سريع خلال 24–48 ساعة داخل العراق',
          },
          {
            title: 'الاستبدال',
            body: 'يمكنك معاينة القطعة وتجربة المقاس فور وصول المندوب. في حال عدم الملاءمة يمكنك طلب تبديل المقاس مباشرة وسيقوم المندوب بتنفيذ الطلب.',
          },
          {
            title: 'الدفع',
            body: 'الدفع نقداً عند الاستلام لضمان راحتك',
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: 14 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{title}</p>
            <p style={muteText}>{body}</p>
          </div>
        ))}
        <Link
          href="/legal/terms"
          style={{ ...muteText, color: 'var(--ink)', textDecoration: 'underline', textDecorationColor: 'var(--line)', display: 'inline-block', marginTop: 4 }}
        >
          مشاهدة سياسة الاستبدال ←
        </Link>
      </Accordion>

      <div style={{ borderTop: '1px solid var(--line)' }} />
    </div>
  )
}
