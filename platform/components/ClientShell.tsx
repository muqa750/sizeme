'use client'

import { usePathname } from 'next/navigation'
import AnnouncementBar from './AnnouncementBar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import WhatsAppFloat from './WhatsAppFloat'
import SplashLoader from './SplashLoader'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname.startsWith('/admin')

  return (
    <>
      <SplashLoader />
      {!isAdmin && <AnnouncementBar />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <WhatsAppFloat />}
    </>
  )
}
