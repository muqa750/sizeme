/**
 * دوال مساعدة عامة
 */

// تنسيق السعر بالدينار العراقي — أرقام إنجليزية
export function fmt(amount: number): string {
  return amount.toLocaleString('en-US') + ' د.ع'
}

// تنسيق السعر بالدينار العراقي — أرقام إنجليزية (للأدمن)
export function fmtEn(amount: number): string {
  return amount.toLocaleString('en-US') + ' IQD'
}

// تنسيق التاريخ بالأرقام الإنجليزية
export function dateEn(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}
export function timeEn(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  })
}

// مسار صورة المنتج — Supabase Storage
const STORAGE_BASE = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co/storage/v1/object/public/products'

const IMG_FOLDERS: Record<string, string> = {
  tshirt:    'imagestshirts',
  polo:      'imagespolo',
  shirt:     'imagesshirts',
  jeans:     'imagesjeans',
  tracksuit: 'imagestracksuit',
}

export function imgPath(
  categoryId: string,
  catSeq: string | null,
  imgKey: string,
  seq: number = 1
): string {
  const folder = IMG_FOLDERS[categoryId] || 'imagestshirts'
  return `${STORAGE_BASE}/${folder}/${catSeq}-${seq}-${imgKey}.jpg`
}

// توليد Order ID
export function generateOrderId(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = String(now.getFullYear()).slice(-2) + pad(now.getMonth() + 1) + pad(now.getDate())
  const rand = Math.random().toString(36).slice(-4).toUpperCase()
  return `SZ-${date}-${rand}`
}

// ترجمة اسم اللون للعربية
export const COLOR_NAMES_AR: Record<string, string> = {
  'Black':      'أسود',
  'White':      'أبيض',
  'Dark Navy':  'نيلي',
  'Royal Blue': 'أزرق ملكي',
  'Brown':      'جوزي',
  'Burgundy':   'ماروني',
  'Charcoal':   'رصاصي',
  'Taupe':      'توبي',
  'Olive':      'زيتوني',
}

export const COLOR_HEX: Record<string, string> = {
  'Black':      '#1a1a1a',
  'White':      '#f5f5f5',
  'Dark Navy':  '#1B2A4A',
  'Royal Blue': '#1C4EBF',
  'Brown':      '#6B3F2A',
  'Burgundy':   '#6D1A36',
  'Charcoal':   '#3D3D3D',
  'Taupe':      '#B5A69A',
  'Olive':      '#5A5E3A',
}
