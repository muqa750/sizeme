'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Category } from '@/lib/types'

const SUPABASE_URL = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co'
/* الـ bucket اسمه imagescategories — مستقل وليس داخل products */
const IMG_BASE = `${SUPABASE_URL}/storage/v1/object/public/imagescategories`

interface Props {
  categories: Category[]
}

/* القسم الوهمي للاكسسوارات */
const ACCESSORIES_PLACEHOLDER: Category = {
  id: 'accessories',
  name_ar: 'اكسسوارات',
  name_en: 'Accessories',
  name_ku: '',
  price: 0,
  sizes: [],
  sort_order: 99,
  created_at: '',
}

function CategoryCard({ cat, isPlaceholder }: { cat: Category; isPlaceholder: boolean }) {
  const [imgFailed, setImgFailed] = useState(false)
  /* الـ id هو نفسه اسم الصورة: tshirt, polo, shirt, jeans, tracksuit */
  const imgUrl = `${IMG_BASE}/${cat.id}.jpg`

  const imgEl = (
    <div
      className="cat-card-img-wrap"
      style={{
        aspectRatio: '1/1',
        overflow: 'hidden',
        background: 'var(--line)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!imgFailed ? (
        <img
          src={imgUrl}
          alt={cat.name_ar}
          className="cat-card-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        /* fallback عند فشل تحميل الصورة */
        <span style={{ fontSize: '0.7rem', color: 'var(--mute)', letterSpacing: '0.1em' }}>
          {cat.name_ar}
        </span>
      )}

      {/* شريط "يتوفر قريباً" للاكسسوارات */}
      {isPlaceholder && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(26,26,26,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: '#fff',
            background: 'rgba(0,0,0,0.55)',
            padding: '0.35rem 1rem',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            يتوفر قريباً
          </span>
        </div>
      )}
    </div>
  )

  const label = (
    <p style={{
      marginTop: '0.5rem',
      fontSize: '0.85rem',
      color: isPlaceholder ? 'var(--mute)' : 'var(--ink)',
      letterSpacing: '0.03em',
      textAlign: 'left',
    }}>
      {cat.name_ar}
    </p>
  )

  if (isPlaceholder) {
    return (
      <div style={{ cursor: 'default' }}>
        {imgEl}
        {label}
      </div>
    )
  }

  return (
    <Link href={`/category/${cat.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      {imgEl}
      {label}
    </Link>
  )
}

export default function CategoryCards({ categories }: Props) {
  const all = [...categories, ACCESSORIES_PLACEHOLDER]

  return (
    <section style={{ padding: '3rem 1.25rem', direction: 'rtl' }}>

      {/* الشبكة */}
      <div
        className="cat-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
      >
        {all.map(cat => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            isPlaceholder={cat.id === 'accessories'}
          />
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cat-cards-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        .cat-card-img {
          transition: transform 0.4s ease;
        }
        .cat-card-img-wrap:hover .cat-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  )
}
