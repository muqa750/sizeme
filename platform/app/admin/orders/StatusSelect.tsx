'use client'
import { useTransition } from 'react'
import { setOrderStatus } from '../actions'
import type { Order } from '@/lib/types'

const OPTIONS: { value: Order['status']; label: string }[] = [
  { value: 'new', label: 'جديد' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'shipped', label: 'شُحن' },
  { value: 'delivered', label: 'سُلّم' },
  { value: 'cancelled', label: 'ملغي' },
]

const STATUS_COLOR: Record<string, string> = {
  new: '#2563eb',
  confirmed: '#7c3aed',
  shipped: '#d97706',
  delivered: '#16a34a',
  cancelled: '#dc2626',
}

export default function StatusSelect({
  orderId,
  current,
}: {
  orderId: string
  current: Order['status']
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      defaultValue={current}
      disabled={pending}
      onChange={e => {
        startTransition(async () => {
          await setOrderStatus(orderId, e.target.value as Order['status'])
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
