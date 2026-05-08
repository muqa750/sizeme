'use client'
import { useTransition } from 'react'
import { setProductStatus } from '../actions'
import type { Product } from '@/lib/types'

const OPTIONS: { value: Product['status']; label: string }[] = [
  { value: 'active',      label: 'نشط'         },
  { value: 'best-seller', label: 'الأكثر مبيعاً' },
  { value: 'new',         label: 'وصل حديثاً'  },
  { value: 'hidden',      label: 'مخفي'         },
]

const STATUS_COLOR: Record<string, string> = {
  active:       '#16a34a',
  'best-seller': '#7c3aed',
  new:           '#2563eb',
  hidden:        '#9ca3af',
}

export default function ProductStatusSelect({
  productId,
  current,
}: {
  productId: number
  current: Product['status']
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={e => {
        startTransition(async () => {
          await setProductStatus(productId, e.target.value as Product['status'])
        })
      }}
      style={{
        border: '1px solid #e5e5e5',
        background: '#fff',
        padding: '4px 8px',
        fontSize: '0.75rem',
        color: STATUS_COLOR[current] ?? '#555',
        cursor: pending ? 'wait' : 'pointer',
        outline: 'none',
        borderRadius: 2,
      }}
    >
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
