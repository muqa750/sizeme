'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export default function SearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState(defaultValue)

  // مزامنة مع searchParams عند التنقل خارجي
  useEffect(() => {
    setValue(searchParams.get('search') ?? '')
  }, [searchParams])

  function commit(val: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (val.trim()) {
      params.set('search', val.trim())
    } else {
      params.delete('search')
    }
    params.delete('offset') // ارجع للصفحة الأولى
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && commit(value)}
        onBlur={() => commit(value)}
        placeholder="ابحث بالاسم أو رقم الطلب..."
        style={{
          width: '100%',
          padding: '8px 36px 8px 14px',
          border: '1px solid #e5e5e5',
          borderRadius: 8,
          fontSize: '0.82rem',
          outline: 'none',
          background: '#fff',
          boxSizing: 'border-box',
          color: '#1a1a1a',
          fontFamily: 'inherit',
          opacity: pending ? 0.6 : 1,
          transition: 'opacity 0.15s',
        }}
      />
      {/* أيقونة بحث */}
      <span style={{
        position: 'absolute',
        left: 11, top: '50%', transform: 'translateY(-50%)',
        color: '#bbb', fontSize: '0.85rem', pointerEvents: 'none',
      }}>
        🔍
      </span>
      {/* زر مسح */}
      {value && (
        <button
          onClick={() => { setValue(''); commit('') }}
          style={{
            position: 'absolute',
            left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#bbb', fontSize: '1rem', lineHeight: 1,
            padding: 0,
          }}
          aria-label="مسح البحث"
        >
          ×
        </button>
      )}
    </div>
  )
}
