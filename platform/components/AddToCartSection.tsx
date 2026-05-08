'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'
import { COLOR_HEX, COLOR_NAMES_AR } from '@/lib/utils'

interface Props {
  product: Product
  sizes:   string[]
}

export default function AddToCartSection({ product, sizes }: Props) {
  const { addItem, totals } = useCart()

  const colors = product.colors ?? []
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '')
  const [selectedSize,  setSelectedSize]  = useState('')
  const [shake, setShake] = useState(false)

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }

    addItem({
      productId:  product.id,
      sku:        product.sku,
      brand:      product.brand,
      sub:        product.sub,
      color:      selectedColor,
      size:       selectedSize,
      qty:        1,
      unitPrice:  totals.unitPrice,
      lineTotal:  totals.unitPrice,
      imgKey:     product.img_key,
      catSeq:     product.cat_seq,
      categoryId: product.category_id,
    })
  }

  return (
    <>
      {/* الألوان */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#888', marginBottom: '0.75rem' }}>
          اللون {selectedColor && `— ${COLOR_NAMES_AR[selectedColor] ?? selectedColor}`}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {colors.map(color => (
            <button
              key={color}
              title={COLOR_NAMES_AR[color] ?? color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: COLOR_HEX[color] ?? '#ccc',
                border: selectedColor === color ? '2px solid #1a1a1a' : '2px solid transparent',
                cursor: 'pointer',
                outline: selectedColor === color ? '2px solid #1a1a1a' : '1px solid rgba(0,0,0,0.15)',
                outlineOffset: selectedColor === color ? 2 : 0,
                transition: 'outline 0.15s',
              }}
            />
          ))}
        </div>
      </div>

      {/* المقاسات */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#888', marginBottom: '0.75rem' }}>
          القياس
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              style={{
                padding: '6px 14px',
                border: selectedSize === size ? '1px solid #1a1a1a' : '1px solid #e5e5e5',
                background: selectedSize === size ? '#1a1a1a' : '#fff',
                color:      selectedSize === size ? '#fff' : '#1a1a1a',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* زر الإضافة */}
      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          background: '#1a1a1a',
          color: '#fff',
          padding: '1rem',
          border: 'none',
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          textTransform: 'uppercase',
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}
      >
        أضف إلى السلة
      </button>

      {!selectedSize && (
        <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.5rem', textAlign: 'center' }}>
          اختر المقاس أولاً
        </p>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20%       { transform: translateX(-6px) }
          40%       { transform: translateX(6px) }
          60%       { transform: translateX(-4px) }
          80%       { transform: translateX(4px) }
        }
      `}</style>
    </>
  )
}
