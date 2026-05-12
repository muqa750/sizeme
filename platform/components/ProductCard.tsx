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
  const [hovered, setHovered] = useState(false)
  const price = product.category?.price ?? 35000

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      >
        {/* ── الصورة ── */}
        <div style={{
          aspectRatio: '3/4',
          background: '#f5f5f5',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Placeholder نص */}
          {imgError && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.1rem',
                letterSpacing: '0.12em',
                color: '#ccc',
              }}>
                {product.brand}
              </span>
              <span style={{ fontSize: '0.6rem', color: '#ddd', letterSpacing: '0.2em' }}>
                NO IMAGE
              </span>
            </div>
          )}

          {/* الصورة */}
          {!imgError && (
            <img
              src={imgPath(product.category_id, product.cat_seq, product.img_key, 1)}
              alt={`${product.brand} ${product.sub ?? ''}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
              onError={() => setImgError(true)}
            />
          )}

          {/* Badge */}
          {(product.status === 'best-seller' || product.status === 'new') && (
            <span style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#1a1a1a',
              color: '#fff',
              fontSize: '0.575rem',
              letterSpacing: '0.18em',
              padding: '4px 9px',
            }}>
              {product.status === 'best-seller' ? 'BEST SELLER' : 'NEW'}
            </span>
          )}
        </div>

        {/* ── معلومات ── */}
        <div style={{ display: 'flex', padding: '0.7rem 0.5rem 0.7rem 0.4rem', gap: '1rem' }}>

          {/* الخط العمودي — مقوس الطرفين */}
          <div style={{
            width: 3,
            flexShrink: 0,
            alignSelf: 'stretch',
            background: '#a3a3a3ff',
            borderRadius: 999,
          }} />

          {/* المحتوى */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Brand */}
            <p className="serif" style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              letterSpacing: '0.05em',
              color: 'var(--ink)',
              marginBottom: 2,
              lineHeight: 1.2,
            }}>
              {product.brand}
            </p>

            {/* Sub-name */}
            {product.sub && (
              <p style={{
                fontSize: '0.72rem',
                color: '#999',
                marginBottom: 6,
                letterSpacing: '0.02em',
              }}>
                {product.sub}
              </p>
            )}

            {/* الألوان المتاحة */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                {product.colors.slice(0, 6).map(color => (
                  <div
                    key={color}
                    title={color}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: COLOR_HEX[color] ?? '#ccc',
                      border: '1px solid rgba(0,0,0,0.12)',
                      flexShrink: 0,
                    }}
                  />
                ))}
                {product.colors.length > 6 && (
                  <span style={{ fontSize: '0.6rem', color: '#bbb' }}>
                    +{product.colors.length - 6}
                  </span>
                )}
              </div>
            )}

            {/* السعر */}
            <p style={{
              fontSize: '0.82rem',
              color: 'var(--ink)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              {fmt(price)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  )
}
