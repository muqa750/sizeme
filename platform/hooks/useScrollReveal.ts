'use client'
import { useEffect } from 'react'

/**
 * useScrollReveal
 * يراقب كل عنصر يحمل class "reveal" ويضيف "in-view" عند ظهوره
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
