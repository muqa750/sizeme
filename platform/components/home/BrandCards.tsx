'use client'
import Link from 'next/link'
import { useState } from 'react'

const SUPABASE_URL = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co'

function imgUrl(imgPath: string, imgVer: number) {
  return `${SUPABASE_URL}/storage/v1/object/public/${imgPath}${imgVer > 0 ? `?v=${imgVer}` : ''}`
}

export interface BrandSpot {
  slot:    number
  brands:  string[]
  imgPath: string
  imgVer:  number
}

function BrandCard({ spot }: { spot: BrandSpot }) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = imgUrl(spot.imgPath, spot.imgVer)

  return (
    <Link href={`/brand/${spot.slot}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#1a1a1a', position: 'relative', borderRadius: 4 }}
        className="brand-card-wrap"
      >
        {!imgFailed && (
          <img
            src={src}
            alt={spot.brand}
            className="brand-card-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
    </Link>
  )
}

interface Props { spots: BrandSpot[] }

export default function BrandCards({ spots }: Props) {
  return (
    <section style={{ padding: '4rem 1.25rem 3rem', direction: 'rtl' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-ibm), IBM Plex Sans Arabic, sans-serif',
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          fontWeight: 700, color: 'var(--ink)', margin: 0, lineHeight: 1.2,
        }}>براندات اللحظة</h2>
        <p style={{
          fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
          color: 'var(--mute)', marginTop: '0.4rem', fontWeight: 300,
        }}>الأكثر رواجاً حالياً</p>
      </div>
      <div className="brand-cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
        {spots.map(s => <BrandCard key={s.slot} spot={s} />)}
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
