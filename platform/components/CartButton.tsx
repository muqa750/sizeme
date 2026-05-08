'use client'
import { useCart } from '@/context/CartContext'

export default function CartButton() {
  const { totals, setOpen } = useCart()

  return (
    <button
      onClick={() => setOpen(true)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        color: '#1a1a1a',
        position: 'relative',
      }}
    >
      السلة
      {totals.qty > 0 && (
        <span style={{
          background: '#1a1a1a',
          color: '#fff',
          fontSize: '0.6rem',
          width: 18,
          height: 18,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
        }}>
          {totals.qty}
        </span>
      )}
    </button>
  )
}
