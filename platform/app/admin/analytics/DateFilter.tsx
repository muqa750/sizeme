'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export type DateRange = 'week' | 'month' | 'quarter' | 'all'

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'week',    label: 'هذا الأسبوع' },
  { value: 'month',  label: 'هذا الشهر'   },
  { value: 'quarter', label: '3 أشهر'     },
  { value: 'all',    label: 'الكل'         },
]

export default function DateFilter({ current }: { current: DateRange }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function navigate(value: DateRange) {
    const p = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      p.delete('range')
    } else {
      p.set('range', value)
    }
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => navigate(opt.value)}
          style={{
            padding: '5px 13px',
            fontSize: '0.75rem',
            border: '1px solid',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            transition: 'all 0.1s',
            background: current === opt.value ? '#1a1a1a' : '#fff',
            color:      current === opt.value ? '#fff'    : '#888',
            borderColor: current === opt.value ? '#1a1a1a' : '#e5e5e5',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
