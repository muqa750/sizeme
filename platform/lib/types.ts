// أنواع TypeScript — تتوافق مع @supabase/supabase-js v2

export type Database = {
  public: {
    Views:          Record<string, unknown>
    Functions:      Record<string, unknown>
    Enums:          Record<string, unknown>
    CompositeTypes: Record<string, unknown>
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
        Relationships: []
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
        Relationships: []
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: Partial<OrderInsert>
        Relationships: []
      }
      order_items: {
        Row: OrderItem
        Insert: OrderItemInsert
        Update: Partial<OrderItemInsert>
        Relationships: []
      }
      coupons: {
        Row: Coupon
        Insert: Omit<Coupon, 'id' | 'created_at' | 'used_count'>
        Update: Partial<Omit<Coupon, 'id' | 'created_at'>>
        Relationships: []
      }
      settings: {
        Row: Setting
        Insert: Setting
        Update: Partial<Setting>
        Relationships: []
      }
      admin_otps: {
        Row: AdminOTP
        Insert: Omit<AdminOTP, 'id' | 'created_at'>
        Update: Partial<Omit<AdminOTP, 'id' | 'created_at'>>
        Relationships: []
      }
      suggestions: {
        Row: Suggestion
        Insert: Omit<Suggestion, 'id' | 'created_at'>
        Update: Partial<Omit<Suggestion, 'id' | 'created_at'>>
        Relationships: []
      }
      newsletter_subscribers: {
        Row: NewsletterSubscriber
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at'>
        Update: Partial<Omit<NewsletterSubscriber, 'id' | 'created_at'>>
        Relationships: []
      }
      ratings: {
        Row: Rating
        Insert: Omit<Rating, 'id' | 'created_at'>
        Update: Partial<Omit<Rating, 'id' | 'created_at'>>
        Relationships: []
      }
    }
  }
}

// ── الكيانات ──────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name_ar: string
  name_en: string
  name_ku: string
  price: number
  sizes: string[]
  sort_order: number
  created_at: string
}

export interface Product {
  id: number
  sku: string
  brand: string
  sub: string | null
  description?: string | null
  category_id: string
  img_key: string
  cat_seq: string | null
  colors: string[]
  status: 'active' | 'best-seller' | 'new' | 'hidden'
  sort_order: number
  added_at: string | null
  created_at: string
  updated_at: string
  // joined
  category?: Category
}

export interface Order {
  id: number
  order_id: string
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  name: string
  phone: string
  province: string | null
  area: string | null
  address: string | null
  notes: string | null
  subtotal: number
  bulk_discount: number
  coupon_code: string | null
  coupon_discount: number
  shipping: number
  total: number
  payment_method: string
  lang: string
  created_at: string
  // joined relation — ليست عموداً حقيقياً في DB
  order_items?: OrderItem[]
}

// نوع الإدخال الصريح بدون الـ relation المُدمجة ولا الـ id
export interface OrderInsert {
  order_id: string
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  name: string
  phone: string
  province: string | null
  area: string | null
  address: string | null
  notes: string | null
  subtotal: number
  bulk_discount: number
  coupon_code: string | null
  coupon_discount: number
  shipping: number
  total: number
  payment_method: string
  lang: string
}

export interface OrderItem {
  id: number
  order_id: string
  product_id: number | null
  sku: string | null
  brand: string | null
  sub: string | null
  color: string | null
  size: string | null
  qty: number
  unit_price: number
  line_total: number
}

export interface OrderItemInsert {
  order_id: string
  product_id: number | null
  sku: string | null
  brand: string | null
  sub: string | null
  color: string | null
  size: string | null
  qty: number
  unit_price: number
  line_total: number
}

export interface Coupon {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  expires_at: string | null
  max_uses: number | null
  used_count: number
  is_active: boolean
  created_at: string
}

export interface Setting {
  key: string
  value: unknown
}

// أنواع مساعدة للمتجر
export interface CartItem {
  productId: number
  sku: string
  brand: string
  sub: string | null
  color: string
  size: string
  qty: number
  unitPrice: number
  lineTotal: number
  imgKey: string
  catSeq: string | null
  categoryId: string
}

export type Lang = 'ar' | 'en' | 'ku'

// OTP للأدمن
export interface AdminOTP {
  id: string
  code: string
  expires_at: string
  used: boolean
  created_at: string
}

export interface Suggestion {
  id: number
  text: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: number
  contact: string
  created_at: string
}

export interface Rating {
  id: number
  label: string
  value?: string | null
  score: number
  created_at: string
}
