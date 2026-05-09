'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

/** مكوّن خفي يشغّل الـ IntersectionObserver على كل عناصر .reveal */
export default function ScrollRevealInit() {
  useScrollReveal()
  return null
}
