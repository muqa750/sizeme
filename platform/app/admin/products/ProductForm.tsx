'use client'

import { useState, useTransition, useRef } from 'react'
import { createProduct, updateProduct, uploadProductImage, uploadVariantImage } from './actions'
import type { Product, Category, ProductVariant } from '@/lib/types'
import { imgPath } from '@/lib/utils'
import ImageCropModal from '@/components/ImageCropModal'

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
// ─── Styles ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #e0e0e0', borderRadius: 10,
  padding: '11px 14px', fontSize: 14, fontFamily: 'inherit',
  color: '#1a1a1a', background: '#fff', boxSizing: 'border-box',
  outline: 'none', minHeight: 44,
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#888', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em',
}
const sectionHeader: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '0.12em',
  textTransform: 'uppercase', marginBottom: 12, marginTop: 4,
  paddingBottom: 8, borderBottom: '1px solid #f0f0f0',
}

// توليد SKU
function buildSku(brand: string, sortOrder: number): string {
  const prefix = brand.trim().replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
  return prefix ? `${prefix}-${sortOrder}` : ''
}

interface Props {
  product?: Product
  categories: Category[]
  nextSortOrder?: number
  onClose: () => void
  onSaved: () => void
}

export default function ProductForm({ product, categories, nextSortOrder, onClose, onSaved }: Props) {
  const isEdit = Boolean(product)
  const [pending, startTransition] = useTransition()
  const [err, setErr]   = useState('')
  const [done, setDone] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
    status:      product?.status      ?? 'new',
    sort_order:  nextSortOrder ?? product?.sort_order ?? 0,
    price:       product?.price       ?? (null as number | null),
    colors:      product?.colors      ?? [] as string[],
  })

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

  // الصورة الحالية للمنتج عند التعديل
  const existingImgUrl = isEdit && form.img_key && form.cat_seq
    ? imgPath(form.category_id, form.cat_seq, form.img_key, 1)
    : null

  // Variants
  const [variants, setVariants] = useState<Record<string, ProductVariant>>(
    (product?.variants as Record<string, ProductVariant>) ?? {}
  )
  const [variantUploading, setVariantUploading] = useState<Record<string, boolean>>({})
  const variantFileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // ── Crop state ────────────────────────────────────────────────────────────
  const [cropFile, setCropFile]     = useState<File | null>(null)
  const [cropTarget, setCropTarget] = useState<'main' | string | null>(null)

  function openCrop(file: File, target: 'main' | string) {
    setCropFile(file)
    setCropTarget(target)
  }

  async function onCropConfirm(croppedFile: File) {
    const target = cropTarget
    setCropFile(null); setCropTarget(null)
    if (target === 'main') {
      await handleImageUpload(croppedFile)
    } else if (target) {
      await handleVariantUpload(target, croppedFile)
    }
  }

  // ── رفع صورة رئيسية ──────────────────────────────────────────────────────
  async function handleImageUpload(file: File) {
    setImgUploading(true)
    const catSeqToUse = form.cat_seq || '00'
    const fd = new FormData()
    fd.append('file', file)
    fd.append('categoryId', form.category_id)
    fd.append('catSeq', catSeqToUse)
    fd.append('seq', '1')
    const res = await uploadProductImage(fd)
    setImgUploading(false)
    if (!res.ok) { setErr(res.error ?? 'فشل رفع الصورة'); return }
    setForm(f => ({ ...f, img_key: res.imgKey!, cat_seq: catSeqToUse }))
    setImgPreview(URL.createObjectURL(file))
  }

  // ── رفع صورة variant ─────────────────────────────────────────────────────
  async function handleVariantUpload(color: string, file: File) {
    const current = variants[color]?.images ?? []
    if (current.length >= 5) { setErr('الحد الأقصى 5 صور لكل لون'); return }
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

  function toggleColor(c: string) {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(c)
        ? f.colors.filter(x => x !== c)
        : [...f.colors, c],
    }))
  }

  // ── إرسال ─────────────────────────────────────────────────────────────────
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
      fd.append('colors',   JSON.stringify(form.colors))
      fd.append('variants', JSON.stringify(variants))
      const res = isEdit
        ? await updateProduct(product!.id, fd)
        : await createProduct(fd)
      if (!res.ok) { setErr(res.error ?? 'حدث خطأ'); return }
      setDone(true)
      setTimeout(() => { onSaved(); onClose() }, 600)
    })
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* مودال القص */}
      {cropFile && cropTarget && (
        <ImageCropModal
          file={cropFile}
          onConfirm={onCropConfirm}
          onCancel={() => { setCropFile(null); setCropTarget(null) }}
        />
      )}

      {/* الخلفية */}
      <div
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 9999, display: 'flex', alignItems: 'flex-start',
          justifyContent: 'center', padding: '16px', overflowY: 'auto',
        }}
      >
        <div
          style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 540,
            padding: '24px 20px', direction: 'rtl',
            fontFamily: 'IBM Plex Sans Arabic, sans-serif',
            boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>
              {isEdit ? 'تعديل المنتج' : 'منتج جديد'}
            </h2>
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize: 24, cursor:'pointer', color:'#bbb', lineHeight:1, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>

          {/* ══ القسم 1: المعلومات الأساسية ══ */}
          <p style={sectionHeader}>المعلومات الأساسية</p>

          {/* الماركة */}
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>الماركة *</span>
            <input style={inp} value={form.brand} onChange={e => handleBrandChange(e.target.value)} placeholder="مثال: Louis Vuitton" />
          </div>

          {/* الموديل */}
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>الموديل / السلسلة</span>
            <input style={inp} value={form.sub} onChange={e => setForm(f => ({ ...f, sub: e.target.value }))} placeholder="مثال: Slim Fit" />
          </div>

          {/* القسم + الحالة */}
          <div style={{ display:'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <span style={lbl}>القسم *</span>
              <select
                style={{ ...inp, cursor:'pointer' }}
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <span style={lbl}>السعر (د.ع)</span>
              <div style={{ position:'relative' }}>
                <input
                  type="number"
                  style={{ ...inp, paddingLeft: 40 }}
                  value={form.price ?? ''}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))}
                  placeholder={categories.find(c => c.id === form.category_id)?.price?.toLocaleString('en-US') ?? '35,000'}
                />
                <span style={{ position:'absolute', left: 12, top:'50%', transform:'translateY(-50%)', fontSize: 11, color:'#bbb', pointerEvents:'none' }}>د.ع</span>
              </div>
            </div>
          </div>


          {/* ══ القسم 2: الألوان والصور ══ */}
          <p style={sectionHeader}>الألوان والصور</p>

          {/* اختيار الألوان */}
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>الألوان المتوفرة</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
              {COLORS.map(c => {
                const sel = form.colors.includes(c)
                return (
                  <button
                    key={c}
                    onClick={() => toggleColor(c)}
                    style={{
                      display:'flex', alignItems:'center', gap: 6,
                      padding: '7px 12px', borderRadius: 20, fontSize: 12,
                      cursor:'pointer', border:'1px solid', minHeight: 36,
                      borderColor: sel ? '#1a1a1a' : '#e0e0e0',
                      background:  sel ? '#1a1a1a' : '#fff',
                      color:       sel ? '#fff'    : '#555',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ width:12, height:12, borderRadius:'50%', background: COLOR_HEX[c] ?? '#999', border: c==='White' ? '1px solid #ccc' : 'none', flexShrink:0 }} />
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          {/* صور كل لون */}
          {form.colors.length > 0 && (
            <div style={{ marginBottom: 20, background:'#fafafa', borderRadius: 12, padding:'14px 14px' }}>
              <span style={{ ...lbl, color:'#666', marginBottom: 12 }}>صور الألوان — حتى 5 صور لكل لون</span>
              {form.colors.map(color => {
                const imgs = variants[color]?.images ?? []
                const uploading = variantUploading[color] ?? false
                const canAdd = imgs.length < 5 && !uploading
                return (
                  <div key={color} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #eee' }}>
                    <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ width:14, height:14, borderRadius:'50%', background: COLOR_HEX[color] ?? '#ccc', border: color==='White' ? '1px solid #ccc' : 'none', flexShrink:0 }} />
                      <span style={{ fontSize: 13, color:'#444', fontWeight: 600 }}>{color}</span>
                      <span style={{ fontSize: 10, color:'#bbb' }}>({imgs.length}/5)</span>
                    </div>

                    <div style={{ display:'flex', gap: 8, flexWrap:'wrap', alignItems:'flex-start' }}>
                      {imgs.map(uuid => (
                        <div key={uuid} style={{ position:'relative', width:62, height:78 }}>
                          <img src={variantUrl(uuid)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius: 8, border:'1px solid #e8e8e8' }} />
                          <button
                            onClick={() => removeVariantImage(color, uuid)}
                            style={{
                              position:'absolute', top:-7, left:-7,
                              width:20, height:20, borderRadius:'50%',
                              background:'#e74c3c', color:'#fff',
                              border:'none', cursor:'pointer', fontSize:11,
                              display:'flex', alignItems:'center', justifyContent:'center',
                            }}
                          >✕</button>
                        </div>
                      ))}

                      {canAdd && (
                        <>
                          <input
                            type="file" accept="image/*" style={{ display:'none' }}
                            ref={el => { variantFileRefs.current[color] = el }}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) openCrop(file, color)
                              e.target.value = ''
                            }}
                          />
                          <button
                            onClick={() => variantFileRefs.current[color]?.click()}
                            style={{
                              width:62, height:78, borderRadius: 8,
                              border:'1.5px dashed #c9a84c',
                              background:'rgba(201,168,76,0.04)',
                              cursor:'pointer', fontSize: 22, color:'#c9a84c',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              flexShrink:0,
                            }}
                          >+</button>
                        </>
                      )}

                      {uploading && (
                        <div style={{ width:62, height:78, borderRadius: 8, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#bbb' }}>
                          رفع...
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* الصورة الرئيسية */}
          <div style={{ marginBottom: 20 }}>
            <span style={lbl}>الصورة الرئيسية (احتياطية)</span>
            <div style={{ display:'flex', gap: 12, alignItems:'center' }}>
              {/* Preview */}
              <div style={{ width:62, height:78, background:'#f5f5f5', borderRadius: 8, overflow:'hidden', flexShrink:0, border:'1px solid #e8e8e8' }}>
                {(imgPreview || existingImgUrl) && (
                  <img
                    src={imgPreview ?? existingImgUrl!}
                    alt=""
                    style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  ref={fileRef}
                  type="file" accept="image/*" style={{ display:'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) openCrop(file, 'main')
                    e.target.value = ''
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={imgUploading}
                  style={{
                    width:'100%', padding: '10px 16px', borderRadius: 10,
                    border:'1.5px dashed #d0d0d0', background:'#fafafa',
                    cursor: imgUploading ? 'wait' : 'pointer',
                    fontSize: 13, color:'#888', fontFamily:'inherit', minHeight: 44,
                  }}
                >
                  {imgUploading ? 'جارٍ الرفع...' : form.img_key ? 'تغيير الصورة' : 'رفع صورة رئيسية'}
                </button>
                {form.img_key && (
                  <p style={{ fontSize: 10, color:'#bbb', marginTop: 4 }}>
                    <code style={{ background:'#f5f5f5', padding:'1px 5px', borderRadius: 3 }}>{form.img_key}</code>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ══ القسم 3: تفاصيل إضافية ══ */}
          <p style={sectionHeader}>تفاصيل إضافية</p>

          {/* الوصف */}
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>الوصف (اختياري)</span>
            <textarea
              style={{ ...inp, minHeight: 72, resize:'vertical' }}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="وصف المنتج، الخامة، التفاصيل..."
            />
          </div>

          {/* كود SKU */}
          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>كود المنتج (SKU) *</span>
            <input
              style={{ ...inp, background: !isEdit ? '#f9f9f9' : '#fff' }}
              value={form.sku}
              onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
              placeholder="يُولَّد تلقائياً عند كتابة الماركة"
            />
            {!isEdit && <span style={{ fontSize: 10, color:'#bbb', marginTop: 2, display:'block' }}>يتولد تلقائياً — يمكن تعديله</span>}
          </div>

          {/* ══ Advanced (مخفي افتراضياً) ══ */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            style={{
              background:'none', border:'none', cursor:'pointer',
              fontSize: 11, color:'#bbb', fontFamily:'inherit',
              display:'flex', alignItems:'center', gap: 6, marginBottom: 12,
              padding: '4px 0',
            }}
          >
            <span style={{ transform: showAdvanced ? 'rotate(90deg)' : 'none', transition:'0.2s', display:'inline-block' }}>▶</span>
            إعدادات متقدمة
          </button>

          {showAdvanced && (
            <div style={{ background:'#fafafa', borderRadius: 10, padding:'14px', marginBottom: 14 }}>
              <div style={{ display:'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <span style={lbl}>رقم تسلسل القسم (cat_seq)</span>
                  <input
                    style={inp} value={form.cat_seq}
                    onChange={e => setForm(f => ({ ...f, cat_seq: e.target.value }))}
                    placeholder="مثال: T01"
                  />
                  <span style={{ fontSize: 10, color:'#bbb', marginTop: 2, display:'block' }}>يُستخدم في مسار الصورة الرئيسية</span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={lbl}>الترتيب (sort_order)</span>
                  <input
                    type="number"
                    style={{ ...inp, background:'#f0f0f0', color:'#999', cursor: isEdit ? 'text' : 'not-allowed' }}
                    value={form.sort_order}
                    readOnly={!isEdit}
                    onChange={e => isEdit && setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* خطأ / نجاح */}
          {err  && <p style={{ color:'#c0392b', fontSize: 13, marginBottom: 12, padding:'10px 12px', background:'rgba(192,57,43,0.06)', borderRadius: 8 }}>{err}</p>}
          {done && <p style={{ color:'#16a34a', fontSize: 13, marginBottom: 12, padding:'10px 12px', background:'rgba(22,163,74,0.06)', borderRadius: 8 }}>تم الحفظ بنجاح ✓</p>}

          {/* أزرار الحفظ */}
          <div style={{ display:'flex', gap: 10, marginTop: 4 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, border:'1px solid #e0e0e0',
                background:'#fff', cursor:'pointer', fontSize: 14, fontFamily:'inherit', color:'#666',
              }}
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={pending || imgUploading}
              style={{
                flex: 2, padding: '12px', borderRadius: 10, border:'none',
                background: done ? '#16a34a' : '#1a1a1a',
                color:'#fff', cursor: pending ? 'wait' : 'pointer',
                fontSize: 14, fontFamily:'inherit', fontWeight: 700,
                transition:'background 0.2s',
              }}
            >
              {pending ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
