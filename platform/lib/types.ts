// أنواع TypeScript المولّدة من schema قاعدة البيانات

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'order_items'>
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'order_items'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      coupons: {
        Row: Coupon
        Insert: Omit<Coupon, 'id' | 'created_at' | 'used_count'>
        Update: Partial<Omit<Coupon, 'id' | 'created_at'>>
      }
      settings: {
        Row: Setting
        Insert: Setting
        Update: Partial<Setting>
      }
      admin_otps: {
        Row: AdminOTP
        Insert: Omit<AdminOTP, 'id' | 'created_at'>
        Update: Partial<Omit<AdminOTP, 'id' | 'created_at'>>
      }
    }
  }
}

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
  // joined
  order_items?: OrderItem[]
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
