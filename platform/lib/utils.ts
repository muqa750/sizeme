/**
 * دوال مساعدة عامة
 */

// تنسيق السعر بالدينار العراقي
export function fmt(amount: number): string {
  return amount.toLocaleString('ar-IQ') + ' د.ع'
}

// مسار صورة المنتج
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
  return `${folder}/${catSeq}-${seq}-${imgKey}.jpg`
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
