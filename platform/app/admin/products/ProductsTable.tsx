'use client'
import { useState } from 'react'
import { fmtEn, imgPath } from '@/lib/utils'
import ProductStatusSelect from './ProductStatusSelect'
import type { Product } from '@/lib/types'

const STATUS_COLOR: Record<string, string> = {
  active:        '#16a34a',
  'best-seller': '#7c3aed',
  new:           '#2563eb',
  hidden:        '#9ca3af',
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? products.filter(p =>
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
    : products

  return (
    <>
      {/* خانة البحث */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث بكود المنتج أو البراند..."
          style={{
            width: '100%',
            maxWidth: 340,
            padding: '0.625rem 1rem',
            border: '1px solid #e5e5e5',
            fontSize: '0.875rem',
            outline: 'none',
            background: '#fff',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <span style={{ fontSize: '0.72rem', color: '#aaa', marginRight: 10 }}>
            {filtered.length} نتيجة
          </span>
        )}
      </div>

      {/* الجدول */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              {['', 'SKU', 'البراند', 'الفئة', 'الألوان', 'السعر', 'الحالة'].map(h => (
                <th key={h} style={{
                  textAlign: 'right',
                  padding: '0.75rem 1rem',
                  fontWeight: 500,
                  color: '#888',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => (
              <tr key={product.id} style={{
                borderBottom: '1px solid #f5f5f5',
                background: i % 2 === 0 ? '#fff' : '#fafafa',
              }}>
                {/* صورة مصغرة */}
                <td style={{ padding: '0.625rem 1rem', width: 48 }}>
                  <div style={{ width: 40, height: 52, background: '#f7f7f7', overflow: 'hidden' }}>
                    <img
                      src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
                      alt={product.brand}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                </td>

                {/* SKU */}
                <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>
                  {product.sku}
                </td>

                {/* البراند */}
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>
                  {product.brand}
                  {product.sub && (
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#aaa', fontWeight: 400 }}>
                      {product.sub}
                    </span>
                  )}
                </td>

                {/* الفئة */}
                <td style={{ padding: '0.875rem 1rem', color: '#888', fontSize: '0.78rem' }}>
                  {product.category?.name_ar ?? product.category_id}
                </td>

                {/* الألوان */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                      {product.colors?.length ?? 0} لون
                    </span>
                  </div>
                </td>

                {/* السعر */}
                <td style={{ padding: '0.875rem 1rem', fontWeight: 500, whiteSpace: 'nowrap', direction: 'ltr', textAlign: 'right', fontSize: '0.78rem' }}>
                  {fmtEn(product.category?.price ?? 35000)}
                </td>

                {/* الحالة */}
                <td style={{ padding: '0.875rem 1rem' }}>
                  <ProductStatusSelect productId={product.id} current={product.status} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#aaa', fontSize: '0.875rem' }}>
                  لا توجد نتائج لـ "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
