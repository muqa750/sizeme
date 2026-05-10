export const dynamic = 'force-dynamic'

import { getSettings } from '@/lib/admin-api'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const settings = await getSettings()
  return <SettingsClient settings={settings as any} />
}
