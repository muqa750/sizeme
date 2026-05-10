export const dynamic = 'force-dynamic'

import { getNewsletterSubscribers } from '@/lib/admin-api'
import NewsletterClient from './NewsletterClient'

export default async function NewsletterPage() {
  const { subscribers, count } = await getNewsletterSubscribers()
  return <NewsletterClient subscribers={subscribers as any} count={count} />
}
