// دوال مساعدة لنظام براندات اللحظة — بدون 'use server'
const SUPABASE_URL = 'https://dhjnlgwsyfsgzmyxnxxr.supabase.co'

export function brandImgUrl(imgPath: string, imgVer: number): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${imgPath}${imgVer > 0 ? `?v=${imgVer}` : ''}`
}
