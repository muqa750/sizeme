'use client'
import { useState } from 'react'
import { fmtEn, imgPath } from '@/lib/utils'
import ProductStatusSelect from './ProductStatusSelect'
import type { Product } from '@/lib/types'

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
      {/* بحث */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث بكود المنتج أو البراند..."
          style={{
            flex: 1, maxWidth: 340,
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
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map(product => (
          <div key={product.id} style={{
            background: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: 10,
            padding: 14,
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}>
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
              <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
                {product.brand}
                {product.sub && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.75rem' }}> — {product.sub}</span>}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#888', marginBottom: 6 }}>
                {product.sku}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                    {product.category?.name_ar ?? product.category_id} · {product.colors?.length ?? 0} ألوان
                  </span>
                  <br />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', direction: 'ltr', display: 'inline-block' }}>
                    {fmtEn(product.category?.price ?? 35000)}
                  </span>
                </div>
                <div>
                  <ProductStatusSelect productId={product.id} current={product.status} />
                </div>
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
    </>
  )
}
