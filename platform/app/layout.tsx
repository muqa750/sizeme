import type { Metadata } from 'next'
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import ClientShell from '@/components/ClientShell'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SIZEME — للمقاسات الخاصة',
  description: 'متخصصون بملابس الماركات الحصرية، الأنماط الفاخرة، والقياسات الخاصة (2XL–7XL).',
  openGraph: {
    title: 'SIZEME — للمقاسات الخاصة',
    description: 'ملابس الرجال من 2XL إلى 7XL في العراق',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cormorant.variable} ${ibmPlex.variable}`} suppressHydrationWarning>
      <head>
        {/* يشغّل قبل أي رسم لمنع وميض الثيم */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}})()` }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <CartProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </CartProvider>
      </body>
    </html>
  )
}
