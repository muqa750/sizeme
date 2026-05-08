'use client'
import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { CartItem } from '@/lib/types'

/* ══ Constants ══ */
const UNIT_PRICE      = 35_000
const BULK_PRICE      = 30_000
const BULK_THRESHOLD  = 4
const SHIP_THRESHOLD  = 10
const SHIPPING        = 5_000

/* ══ Helpers ══ */
export function calcTotals(items: CartItem[]) {
  const qty      = items.reduce((s, i) => s + i.qty, 0)
  const isBulk   = qty >= BULK_THRESHOLD
  const unitPrice = isBulk ? BULK_PRICE : UNIT_PRICE
  const subtotal  = items.reduce((s, i) => s + i.qty * unitPrice, 0)
  const bulkDisc  = isBulk ? (UNIT_PRICE - BULK_PRICE) * qty : 0
  const shipping  = qty === 0 ? 0 : qty >= SHIP_THRESHOLD ? 0 : SHIPPING
  const total     = subtotal + shipping
  return { qty, subtotal, bulkDisc, shipping, total, unitPrice }
}

function itemKey(item: CartItem) {
  return `${item.productId}-${item.color}-${item.size}`
}

/* ══ Reducer ══ */
type Action =
  | { type: 'ADD';    item: CartItem }
  | { type: 'REMOVE'; key: string }
  | { type: 'SET_QTY'; key: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD';   items: CartItem[] }

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'LOAD':  return action.items
    case 'CLEAR': return []
    case 'REMOVE':
      return state.filter(i => itemKey(i) !== action.key)
    case 'SET_QTY':
      return state.map(i => itemKey(i) === action.key
        ? { ...i, qty: action.qty, lineTotal: i.unitPrice * action.qty }
        : i
      ).filter(i => i.qty > 0)
    case 'ADD': {
      const key = itemKey(action.item)
      const existing = state.find(i => itemKey(i) === key)
      if (existing) {
        return state.map(i => itemKey(i) === key
          ? { ...i, qty: i.qty + action.item.qty, lineTotal: i.unitPrice * (i.qty + action.item.qty) }
          : i
        )
      }
      return [...state, action.item]
    }
  }
}

/* ══ Context ══ */
interface CartCtx {
  items:    CartItem[]
  totals:   ReturnType<typeof calcTotals>
  open:     boolean
  setOpen:  (v: boolean) => void
  addItem:  (item: CartItem) => void
  removeItem: (key: string) => void
  setQty:   (key: string, qty: number) => void
  clear:    () => void
  itemKey:  typeof itemKey
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [])
  const [open, setOpen]   = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sizeme-cart')
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
    } catch {}
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('sizeme-cart', JSON.stringify(items))
  }, [items, hydrated])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD', item })
    setOpen(true)
  }

  return (
    <Ctx.Provider value={{
      items,
      totals: calcTotals(items),
      open, setOpen,
      addItem,
      removeItem: key => dispatch({ type: 'REMOVE', key }),
      setQty:     (key, qty) => dispatch({ type: 'SET_QTY', key, qty }),
      clear:      () => dispatch({ type: 'CLEAR' }),
      itemKey,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
