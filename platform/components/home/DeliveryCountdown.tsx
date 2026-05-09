'use client'
import { useEffect, useState } from 'react'

function getIraqTime() {
  const now  = new Date()
  const iraq = new Date(now.getTime() + 3 * 3_600_000) /* UTC+3 */
  const h = iraq.getUTCHours()
  const m = iraq.getUTCMinutes()
  const s = iraq.getUTCSeconds()
  return h * 3600 + m * 60 + s
}

const CUTOFF = 20 * 3600 /* 20:00 */
const pad = (n: number) => String(n).padStart(2, '0')

function buildMessage(totalSec: number): string {
  if (totalSec < CUTOFF) {
    const diff = CUTOFF - totalSec
    const dh = Math.floor(diff / 3600)
    const dm = Math.floor((diff % 3600) / 60)
    const ds = diff % 60
    return `اطلب خلال ${pad(dh)}:${pad(dm)}:${pad(ds)} ليصلك الطلب غداً!`
  }
  return 'اطلب الآن — سيُشحن طلبك صباح الغد!'
}

export default function DeliveryCountdown() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    setMsg(buildMessage(getIraqTime()))
    const id = setInterval(() => setMsg(buildMessage(getIraqTime())), 1000)
    return () => clearInterval(id)
  }, [])

  if (msg === null) return null

  const isNight = getIraqTime() >= CUTOFF

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--countdown-bg)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderTop: '1px solid var(--countdown-border)',
        borderBottom: '1px solid var(--countdown-border)',
        padding: '0.7rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        direction: 'rtl',
      }}
    >
      {/* أيقونة الشاحنة */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, opacity: 0.9 }}
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v4h-7V8z" />
        <circle cx="5.5" cy="18.5" r="1.5" />
        <circle cx="18.5" cy="18.5" r="1.5" />
      </svg>

      {/* الرسالة */}
      <span
        style={{
          fontSize: '0.78rem',
          color: 'var(--ink)',
          letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums',
          opacity: 0.85,
        }}
      >
        {isNight ? (
          msg
        ) : (
          <>
            {'اطلب خلال '}
            <strong
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.05em',
              }}
            >
              {msg.match(/\d{2}:\d{2}:\d{2}/)?.[0] ?? ''}
            </strong>
            {' ليصلك الطلب غداً!'}
          </>
        )}
      </span>
    </div>
  )
}
