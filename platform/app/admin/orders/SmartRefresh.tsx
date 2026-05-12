'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * يحدّث الصفحة تلقائياً عندما يعود المستخدم للتبويب
 * بعد غياب أكثر من STALE_MS ثانية — بدون polling.
 */
const STALE_MS = 30_000 // 30 ثانية

export default function SmartRefresh() {
  const router   = useRouter()
  const hiddenAt = useRef<number | null>(null)

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        hiddenAt.current = Date.now()
      } else {
        if (hiddenAt.current !== null && Date.now() - hiddenAt.current > STALE_MS) {
          router.refresh()
        }
        hiddenAt.current = null
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [router])

  return null
}
