'use client'

import { useState, useTransition, useRef } from 'react'
import { createProduct, updateProduct, uploadProductImage, uploadVariantImage } from './actions'
import type { Product, Category, ProductVariant } from '@/lib/types'

const VARIANT_IMG_BASE = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co/storage/v1/object/public/products/variants'
function variantUrl(uuid: string) { return `${VARIANT_IMG_BASE}/${uuid}.jpg` }

// ─── ثوابت ────────────────────────────────────────────────────────────────────
const COLORS = [
  'Black', 'White', 'Dark Navy', 'Royal Blue',
  'Brown', 'Burgundy', 'Charcoal', 'Taupe', 'Olive',
]

const COLOR_HEX: Record<string, string> = {
  Black: '#1a1a1a', White: '#e0e0e0', 'Dark Navy': '#1B2A4A',
  'Royal Blue': '#1C4EBF', Brown: '#6B3F2A', Burgundy: '#6D1A36',
  Charcoal: '#3D3D3D', Taupe: '#B5A69A', Olive: '#5A5E3A',
}

const STATUS_OPTIONS = [
  { value: 'active',       label: 'نشط' },
  { value: 'best-seller',  label: 'الأكثر مبيعاً' },
  { value: 'new',          label: 'وصل حديثاً' },
  { value: 'hidden',       label: 'مخفي' },
]

// ─── Styles ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #e0e0e0', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, fontFamily: 'inherit',
  color: '#1a1a1a', background: '#fff', boxSizing: 'border-box',
  outline: 'none', minHeight: 40,
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#888', marginBottom: 5, fontWeight: 500,
}
const fieldGroup = (half = false): React.CSSProperties => ({
  display: 'flex', flexDirection: 'column', gap: 4,
  ...(half ? { flex: 1 } : {}),
})

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  product?: Product
  categories: Category[]
  nextSortOrder?: number   // يُمرَّر فقط عند إضافة منتج جديد
  onClose: () => void
  onSaved: () => void
}

// توليد SKU تلقائياً: أول حرفين من الماركة بحروف كبيرة + "-" + الترتيب
function buildSku(brand: string, sortOrder: number): string {
  const prefix = brand.trim().replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
  return prefix ? `${prefix}-${sortOrder}` : ''
}

export default function ProductForm({ product, categories, nextSortOrder, onClose, onSaved }: Props) {
  const isEdit = Boolean(product)
  const [pending, startTransition] = useTransition()
  const [err, setErr]   = useState('')
  const [done, setDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── حالة النموذج ────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    brand:       product?.brand       ?? '',
    sub:         product?.sub         ?? '',
    description: product?.description ?? '',
    category_id: product?.category_id ?? (categories[0]?.id ?? ''),
    sku:         product?.sku         ?? '',
    img_key:     product?.img_key     ?? '',
    cat_seq:     product?.cat_seq     ?? '',
    status:      product?.status      ?? 'active',
    sort_order:  nextSortOrder ?? product?.sort_order ?? 0,
    price:       product?.price       ?? (null as number | null),
    colors:      product?.colors      ?? [] as string[],
  })

  // ── عند تغيير الماركة في نموذج الإضافة → أعد توليد SKU تلقائياً ──────
  function handleBrandChange(value: string) {
    setForm(f => ({
      ...f,
      brand: value,
      ...(!isEdit && nextSortOrder !== undefined
        ? { sku: buildSku(value, nextSortOrder) }
        : {}),
    }))
  }

  const [imgUploading, setImgUploading] = useState(false)
  const [imgPreview, setImgPreview]     = useState<string | null>(null)

  // Variants: { color → { images: uuid[] } }
  const [variants, setVariants] = useState<Record<string, ProductVariant>>(
    (product?.variants as Record<string, ProductVariant>) ?? {}
  )
  // tracking which color is uploading
  const [variantUploading, setVariantUploading] = useState<Record<string, boolean>>({})
  const variantFileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // ── toggle color ─────────────────────────────────────────────────────────
  function toggleColor(c: string) {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(c)
        ? f.colors.filter(x => x !== c)
        : [...f.colors, c],
    }))
  }

  // ── رفع صورة Variant ─────────────────────────────────────────────────────
  async function handleVariantUpload(color: string, file: File) {
    const currentImages = variants[color]?.images ?? []
    if (currentImages.length >= 5) { setErr('الحد الأقصى 5 صور لكل لون'); return }

    setVariantUploading(v => ({ ...v, [color]: true }))
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadVariantImage(fd)
    setVariantUploading(v => ({ ...v, [color]: false }))

    if (!res.ok || !res.uuid) { setErr(res.error ?? 'فشل رفع الصورة'); return }

    setVariants(prev => ({
      ...prev,
      [color]: { images: [...(prev[color]?.images ?? []), res.uuid!] },
    }))
  }

  function removeVariantImage(color: string, uuid: string) {
    setVariants(prev => ({
      ...prev,
      [color]: { images: (prev[color]?.images ?? []).filter(u => u !== uuid) },
    }))
  }

  // ── رفع صورة ─────────────────────────────────────────────────────────────
  async function handleImageUpload(file: File) {
    setImgUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('categoryId', form.category_id)
    fd.append('catSeq', form.cat_seq || '00')
    fd.append('seq', '1')

    const res = await uploadProductImage(fd)
    setImgUploading(false)

    if (!res.ok) { setErr(res.error ?? 'فشل رفع الصورة'); return }
    setForm(f => ({ ...f, img_key: res.imgKey! }))
    setImgPreview(URL.createObjectURL(file))
  }

  // ── إرسال النموذج ─────────────────────────────────────────────────────────
  function handleSubmit() {
    setErr(''); setDone(false)
    if (!form.brand.trim() || !form.category_id || !form.sku.trim()) {
      setErr('الماركة، القسم، والكود مطلوبة'); return
    }

    startTransition(async () => {
      const fd = new FormData()
      fd.append('brand',       form.brand)
      fd.append('sub',         form.sub)
      fd.append('description', form.description)
      fd.append('category_id', form.category_id)
      fd.append('sku',         form.sku)
      fd.append('img_key',     form.img_key)
      fd.append('cat_seq',     form.cat_seq)
      fd.append('status',      form.status)
      fd.append('sort_order',  String(form.sort_order))
      if (form.price !== null) fd.append('price', String(form.price))
      fd.append('colors',      JSON.stringify(form.colors))
      fd.append('variants',    JSON.stringify(variants))

      const res = isEdit
        ? await updateProduct(product!.id, fd)
        : await createProduct(fd)

      if (!res.ok) { setErr(res.error ?? 'حدث خطأ'); return }
      setDone(true)
      setTimeout(() => { onSaved(); onClose() }, 600)
    })
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        zIndex: 9999, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '20px 16px', overflowY: 'auto',
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 14, width: '100%', maxWidth: 560,
          padding: 28, direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif' }}>
            {isEdit ? 'تعديل المنتج' : 'منتج جديد'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#bbb', lineHeight: 1 }}>×</button>
        </div>

        {/* Brand + Sub */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={fieldGroup(true)}>
            <span style={label}>الماركة *</span>
            <input style={inp} value={form.brand} onChange={e => handleBrandChange(e.target.value)} placeholder="مثال: Lacoste" />
          </div>
          <div style={fieldGroup(true)}>
            <span style={label}>الموديل / السلسلة</span>
            <input style={inp} value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} placeholder="مثال: Slim Fit" />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <span style={label}>الوصف (يُضاف لصفحة المنتج لاحقاً)</span>
          <textarea
            style={{ ...inp, minHeight: 72, resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="وصف المنتج، الخامة، التفاصيل..."
          />
        </div>

        {/* Category + SKU */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={fieldGroup(true)}>
            <span style={label}>القسم *</span>
            <select
              style={{ ...inp, cursor: 'pointer' }}
              value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name_ar}</option>
              ))}
            </select>
          </div>
          <div style={fieldGroup(true)}>
            <span style={label}>كود المنتج (SKU) *</span>
            <input
              style={{ ...inp, background: !isEdit ? '#f9f9f9' : '#fff', color: !isEdit ? '#555' : '#1a1a1a' }}
              value={form.sku}
              onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
              placeholder="يُولَّد تلقائياً عند كتابة الماركة"
            />
            {!isEdit && <span style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>يتولد تلقائياً — يمكن تعديله يدوياً</span>}
          </div>
        </div>

        {/* CatSeq + Sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={fieldGroup(true)}>
            <span style={label}>رقم تسلسل القسم (cat_seq)</span>
            <input
              style={inp} value={form.cat_seq}
              onChange={e => setForm(f => ({ ...f, cat_seq: e.target.value }))}
              placeholder="مثال: T01 أو P03"
            />
            <span style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>يُستخدم في مسار الصورة</span>
          </div>
          <div style={fieldGroup(true)}>
            <span style={label}>الترتيب (sort_order)</span>
            <input
              type="number"
              style={{ ...inp, background: !isEdit ? '#f0f0f0' : '#fff', color: '#555', cursor: !isEdit ? 'not-allowed' : 'text' }}
              value={form.sort_order}
              readOnly={!isEdit}
              onChange={e => isEdit && setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
            />
            {!isEdit && <span style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>يُعيَّن تلقائياً — غير قابل للتعديل</span>}
          </div>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14 }}>
          <span style={label}>السعر (د.ع) — اتركه فارغاً لاستخدام سعر القسم</span>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              style={{ ...inp, paddingLeft: 44 }}
              value={form.price ?? ''}
              onChange={e => setForm(f => ({
                ...f,
                price: e.target.value ? Number(e.target.value) : null,
              }))}
              placeholder={`سعر القسم الافتراضي: ${
                categories.find(c => c.id === form.category_id)?.price?.toLocaleString('en-US') ?? '35,000'
              }`}
            />
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 11, color: '#aaa', pointerEvents: 'none',
            }}>
              د.ع
            </span>
          </div>
          {form.price && (
            <span style={{ fontSize: 10, color: '#c9a84c', marginTop: 3, display: 'block' }}>
              السعر الفعلي: {form.price.toLocaleString('en-US')} د.ع
            </span>
          )}
        </div>

        {/* Status */}
        <div style={{ marginBottom: 14 }}>
          <span style={label}>الحالة</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(f => ({ ...f, status: opt.value as typeof f.status }))}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: '1px solid',
                  borderColor: form.status === opt.value ? '#1a1a1a' : '#e0e0e0',
                  background:  form.status === opt.value ? '#1a1a1a' : '#fff',
                  color:       form.status === opt.value ? '#fff'    : '#888',
                  fontFamily: 'inherit',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ marginBottom: 14 }}>
          <span style={label}>الألوان المتوفرة</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COLORS.map(c => {
              const selected = form.colors.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => toggleColor(c)}
                  title={c}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 20, fontSize: 12,
                    cursor: 'pointer', border: '1px solid',
                    borderColor: selected ? '#1a1a1a' : '#e0e0e0',
                    background:  selected ? '#1a1a1a' : '#fff',
                    color:       selected ? '#fff'    : '#555',
                    fontFamily:  'inherit',
                  }}
                >
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                    background: COLOR_HEX[c] ?? '#999',
                    border: c === 'White' ? '1px solid #ccc' : 'none',
                  }} />
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* Variants Gallery — صور لكل لون */}
        {form.colors.length > 0 && (
          <div style={{ marginBottom: 20, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
            <span style={{ ...label, fontSize: 12, color: '#555', marginBottom: 10, display: 'block' }}>
              صور الألوان — حتى 5 صور لكل لون
            </span>

            {form.colors.map(color => {
              const imgs = variants[color]?.images ?? []
              const uploading = variantUploading[color] ?? false
              const canAdd = imgs.length < 5 && !uploading

              return (
                <div key={color} style={{ marginBottom: 14 }}>
                  {/* اسم اللون */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                      background: COLOR_HEX[color] ?? '#ccc',
                      border: color === 'White' ? '1px solid #ccc' : 'none',
                    }} />
                    <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{color}</span>
                    <span style={{ fontSize: 10, color: '#bbb' }}>({imgs.length}/5)</span>
                  </div>

                  {/* الصور الحالية + زر الإضافة */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {imgs.map(uuid => (
                      <div key={uuid} style={{ position: 'relative', width: 60, height: 76 }}>
                        <img
                          src={variantUrl(uuid)}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e8' }}
                        />
                        <button
                          onClick={() => removeVariantImage(color, uuid)}
                          style={{
                            position: 'absolute', top: -6, left: -6,
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#e74c3c', color: '#fff',
                            border: 'none', cursor: 'pointer',
                            fontSize: 11, lineHeight: 1, padding: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title="حذف"
                        >✕</button>
                      </div>
                    ))}

                    {/* زر رفع صورة جديدة */}
                    {canAdd && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          ref={el => { variantFileRefs.current[color] = el }}
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) handleVariantUpload(color, file)
                            e.target.value = ''
                          }}
                        />
                        <button
                          onClick={() => variantFileRefs.current[color]?.click()}
                          style={{
                            width: 60, height: 76,
                            borderRadius: 6,
                            border: '1.5px dashed #d0d0d0',
                            background: '#fafafa',
                            cursor: 'pointer',
                            fontSize: 22, color: '#ccc',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}
                          title="أضف صورة"
                        >
                          +
                        </button>
                      </>
                    )}
                    {uploading && (
                      <div style={{ width: 60, height: 76, borderRadius: 6, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#bbb' }}>
                        رفع...
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Image Upload */}
        <div style={{ marginBottom: 20 }}>
          <span style={label}>الصورة الرئيسية</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Preview */}
            <div style={{ width: 64, height: 80, background: '#f5f5f5', borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid #e8e8e8' }}>
              {imgPreview && (
                <img src={imgPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={imgUploading}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '1px dashed #c0c0c0',
                  background: '#fafafa', cursor: imgUploading ? 'wait' : 'pointer',
                  fontSize: 12, color: '#666', fontFamily: 'inherit', width: '100%',
                }}
              >
                {imgUploading ? 'جارٍ الرفع...' : 'اختر صورة للرفع'}
              </button>
              {form.img_key && (
                <p style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>
                  img_key: <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: 3 }}>{form.img_key}</code>
                </p>
              )}
              <div style={{ marginTop: 6 }}>
                <input
                  style={{ ...inp, fontSize: 11 }}
                  value={form.img_key}
                  onChange={e => setForm(f => ({ ...f, img_key: e.target.value }))}
                  placeholder="أو أدخل img_key يدوياً"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error / Success */}
        {err  && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 10 }}>{err}</p>}
        {done && <p style={{ color: '#16a34a', fontSize: 12, marginBottom: 10 }}>تم الحفظ بنجاح ✓</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: '#666' }}
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={pending || imgUploading}
            style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: done ? '#16a34a' : '#1a1a1a',
              color: '#fff', cursor: pending ? 'wait' : 'pointer',
              fontSize: 13, fontFamily: 'inherit', fontWeight: 600,
              transition: 'background 0.2s',
            }}
          >
            {pending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
          </button>
        </div>
      </div>
    </div>
  )
}
