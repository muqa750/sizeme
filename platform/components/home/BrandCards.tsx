'use client'
import Link from 'next/link'
import { useState } from 'react'

const SUPABASE_URL = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co'
const IMG_BASE = `${SUPABASE_URL}/storage/v1/object/public/brands`

/* id = رقم الصفحة في الرابط — لا يُكشف اسم الماركة */
const BRANDS = [
  { id: '1', slug: 'louis-vuitton', name: 'Louis Vuitton' },
  { id: '2', slug: 'hermes',        name: 'Hermes' },
  { id: '3', slug: 'us-polo',       name: 'U.S. Polo' },
]

const PLACEHOLDER: Record<string, string> = {
  'louis-vuitton': '#1a1a1a',
  'hermes':        '#7B3F2A',
  'us-polo':       '#1C3A6B',
}

function BrandCard({ id, slug, name }: { id: string; slug: string; name: string }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <Link
      href={`/brand/${id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          aspectRatio: '3/2',
          overflow: 'hidden',
          background: PLACEHOLDER[slug] ?? '#1a1a1a',
          position: 'relative',
          borderRadius: 4,
        }}
        className="brand-card-wrap"
      >
        {!imgFailed && (
          <img
            src={`${IMG_BASE}/${slug}.jpg`}
            alt={name}
            className="brand-card-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgFailed(true)}
          />
        )}

        {imgFailed && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.7)',
            }}>
              {name}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default function BrandCards() {
  return (
    <section style={{ padding: '4rem 1.25rem 3rem', direction: 'rtl' }}>

      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-ibm), IBM Plex Sans Arabic, sans-serif',
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          براندات اللحظة
        </h2>
        <p style={{
          fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
          color: 'var(--mute)',
          marginTop: '0.4rem',
          fontWeight: 300,
        }}>
          الأكثر رواجاً حالياً
        </p>
      </div>

      <div
        className="brand-cards-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}
      >
        {BRANDS.map(b => (
          <BrandCard key={b.id} id={b.id} slug={b.slug} name={b.name} />
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .brand-cards-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 1rem !important; }
        }
        .brand-card-img { transition: transform 0.4s ease; }
        .brand-card-wrap:hover .brand-card-img { transform: scale(1.04); }
      `}</style>
    </section>
  )
}
