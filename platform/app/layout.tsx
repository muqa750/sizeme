import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'SizeMe — مقاسات خاصة من 2XL إلى 7XL',
  description: 'منصة ملابس الرجال ذات المقاسات الخاصة في العراق',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <CartProvider>
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
