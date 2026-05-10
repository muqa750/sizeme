export const dynamic = 'force-dynamic'

import { getSuggestions } from '@/lib/admin-api'
import SuggestionsClient from './SuggestionsClient'

export default async function SuggestionsPage() {
  const suggestions = await getSuggestions()
  return <SuggestionsClient suggestions={suggestions as any} />
}
