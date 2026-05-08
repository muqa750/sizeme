'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { fmt, imgPath, COLOR_HEX } from '@/lib/utils'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [imgError, setImgError] = useState(false)
  const price = product.category?.price ?? 35000

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #e5e5e5',
        background: '#fff',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        {/* صورة المنتج */}
        <div style={{
          aspectRatio: '3/4',
          background: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* اسم البراند كـ placeholder */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1rem',
            letterSpacing: '0.1em',
            color: '#2b2b2b',
          }}>
            {product.brand}
          </div>
          {!imgError && (
            <img
              src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
              alt={product.brand}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={() => setImgError(true)}
            />
          )}
          {/* Badge */}
          {product.status === 'best-seller' && (
            <span style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: '#1a1a1a',
              color: '#fff',
              fontSize: '0.625rem',
              letterSpacing: '0.15em',
              padding: '3px 8px',
            }}>
              BEST SELLER
            </span>
          )}
          {product.status === 'new' && (
            <span style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: '#1a1a1a',
              color: '#fff',
              fontSize: '0.625rem',
              letterSpacing: '0.15em',
              padding: '3px 8px',
            }}>
              NEW
            </span>
          )}
        </div>

        {/* معلومات المنتج */}
        <div style={{ padding: '0.875rem' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            marginBottom: '2px',
          }}>
            {product.brand}
          </div>
          {product.sub && (
            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
              {product.sub}
            </div>
          )}
          {/* الألوان */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {product.colors?.slice(0, 5).map(color => (
              <div key={color} style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: COLOR_HEX[color] ?? '#ccc',
                border: '1px solid rgba(0,0,0,0.1)',
              }} title={color} />
            ))}
            {(product.colors?.length ?? 0) > 5 && (
              <span style={{ fontSize: '0.65rem', color: '#888', lineHeight: '12px' }}>
                +{product.colors.length - 5}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {fmt(price)}
          </div>
        </div>
      </div>
    </Link>
  )
}
