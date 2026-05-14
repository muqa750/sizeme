'use client'

import { useState, useTransition } from 'react'
import { fmtEn, imgPath } from '@/lib/utils'
import ProductForm from './ProductForm'
import { deleteProduct, setProductStatus } from './actions'
import type { Product, Category } from '@/lib/types'

// ─── ثوابت الحالة ─────────────────────────────────────────────────────────────
const STATUS_AR: Record<string, string> = {
  active:        'نشط',
  'best-seller': 'الأكثر مبيعاً',
  new:           'وصل حديثاً',
  hidden:        'مخفي',
}
const STATUS_COLOR: Record<string, string> = {
  active:        '#16a34a',
  'best-seller': '#7c3aed',
  new:           '#2563eb',
  hidden:        '#9ca3af',
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  products:   Product[]
  categories: Category[]
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductsTable({ products: initial, categories }: Props) {
  const [products, setProducts]       = useState(initial)
  const [query, setQuery]             = useState('')
  const [formProduct, setFormProduct] = useState<Product | null | 'new'>(null) // null=closed, 'new'=إضافة, Product=تعديل
  const [pending, startTransition]    = useTransition()
  const [deletingId, setDeletingId]   = useState<number | null>(null)

  // أعلى sort_order موجود + 1 → للمنتج الجديد
  const nextSortOrder = Math.max(0, ...products.map(p => p.sort_order ?? 0)) + 1

  const filtered = query.trim()
    ? products.filter(p =>
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        (p.sub?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : products

  // ── حذف منتج ──────────────────────────────────────────────────────────────
  function handleDelete(id: number, brand: string) {
    if (!confirm(`حذف "${brand}" نهائياً؟ هذا لا يمكن التراجع عنه.`)) return
    setDeletingId(id)
    startTransition(async () => {
      const res = await deleteProduct(id)
      setDeletingId(null)
      if (!res.ok) { alert(res.error ?? 'فشل الحذف'); return }
      setProducts(prev => prev.filter(p => p.id !== id))
    })
  }

  // ── تغيير الحالة مباشرة ────────────────────────────────────────────────────
  function handleStatusChange(id: number, status: Product['status']) {
    startTransition(async () => {
      const res = await setProductStatus(id, status)
      if (!res.ok) { alert(res.error ?? 'فشل تغيير الحالة'); return }
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    })
  }

  // ── بعد حفظ نموذج إضافة/تعديل → reload الصفحة بسيط ──────────────────────
  function handleSaved() {
    // reload products بدون refresh كامل: نوقف هنا ونترك revalidatePath تعمل
    window.location.reload()
  }

  return (
    <>
      {/* شريط البحث + زر إضافة */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث بالماركة أو الكود..."
          style={{
            flex: 1, maxWidth: 300,
            padding: '9px 14px',
            border: '1px solid #e5e5e5', borderRadius: 8,
            fontSize: '0.875rem', outline: 'none',
            background: '#fff', boxSizing: 'border-box',
          }}
        />
        {query && (
          <span style={{ fontSize: '0.72rem', color: '#aaa', whiteSpace: 'nowrap' }}>
            {filtered.length} نتيجة
          </span>
        )}
        <button
          onClick={() => setFormProduct('new')}
          style={{
            marginRight: 'auto',
            padding: '9px 18px', border: 'none', borderRadius: 8,
            background: '#1a1a1a', color: '#fff', fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          + منتج جديد
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10 }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{
              background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10,
              padding: 14, display: 'flex', gap: 14, alignItems: 'flex-start',
              opacity: deletingId === product.id ? 0.4 : 1, transition: 'opacity 0.2s',
            }}
          >
            {/* صورة */}
            <div style={{ width: 52, height: 66, background: '#f5f5f5', borderRadius: 6, flexShrink: 0, overflow: 'hidden' }}>
              <img
                src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
                alt={product.brand}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>

            {/* معلومات */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 1 }}>
                {product.brand}
                {product.sub && (
                  <span style={{ fontWeight: 400, color: '#999', fontSize: '0.75rem' }}> — {product.sub}</span>
                )}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#bbb', marginBottom: 6 }}>
                {product.sku}
              </p>

              {/* الحالة + السعر */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                  {product.category?.name_ar ?? product.category_id} · {product.colors?.length ?? 0} ألوان
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', direction: 'ltr' }}>
                  {fmtEn(product.category?.price ?? 35000)}
                </span>
              </div>

              {/* Dropdown الحالة */}
              <div style={{ marginBottom: 8 }}>
                <select
                  value={product.status}
                  disabled={pending}
                  onChange={e => handleStatusChange(product.id, e.target.value as Product['status'])}
                  style={{
                    width: '100%', border: '1px solid #e5e5e5', borderRadius: 6,
                    padding: '4px 8px', fontSize: '0.75rem',
                    color: STATUS_COLOR[product.status] ?? '#555',
                    background: '#fafafa', cursor: 'pointer', outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {Object.entries(STATUS_AR).map(([val, ar]) => (
                    <option key={val} value={val}>{ar}</option>
                  ))}
                </select>
              </div>

              {/* أزرار التعديل والحذف */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setFormProduct(product)}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #e0e0e0',
                    background: '#fff', color: '#555', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.brand)}
                  disabled={deletingId === product.id}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 6,
                    border: '1px solid #fde8e8', background: '#fff',
                    color: '#c0392b', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: '#aaa', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10 }}>
            لا توجد نتائج{query ? ` لـ "${query}"` : ''}
          </div>
        )}
      </div>

      {/* نموذج الإضافة / التعديل */}
      {formProduct !== null && (
        <ProductForm
          product={formProduct === 'new' ? undefined : formProduct}
          categories={categories}
          nextSortOrder={formProduct === 'new' ? nextSortOrder : undefined}
          onClose={() => setFormProduct(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
