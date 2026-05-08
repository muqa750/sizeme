import Link from 'next/link'
import type { Category } from '@/lib/types'
import CartButton from './CartButton'

interface Props {
  categories: Category[]
}

export default function Header({ categories }: Props) {
  return (
    <header style={{
      borderBottom: '1px solid #e5e5e5',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.5rem',
          letterSpacing: '0.15em',
          color: '#1a1a1a',
          textDecoration: 'none',
        }}>
          SIZEME
        </Link>

        {/* Navigation + Cart */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: '#1a1a1a',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {cat.name_ar}
              </Link>
            ))}
          </nav>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
