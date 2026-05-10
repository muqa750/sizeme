/**
 * رفع صور المنتجات إلى Supabase Storage
 * الاستخدام: node scripts/upload-images.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { config } from 'dotenv'

// قراءة المفاتيح من .env.local
config({ path: join(process.cwd(), '.env.local') })

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ تأكد من وجود NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في .env.local')
  process.exit(1)
}

const BUCKET = 'products'

// مسار المجلد الجذر للصور (سكريبت يشتغل من داخل platform/)
const IMAGES_ROOT = join(process.cwd(), '..') // E:\sizeme

const FOLDERS = [
  'imagestshirts',
  'imagespolo',
  'imagesshirts',
  'imagesjeans',
  'imagestracksuit',
]

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.find(b => b.name === BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) throw error
    console.log(`✓ Bucket "${BUCKET}" created`)
  } else {
    console.log(`✓ Bucket "${BUCKET}" already exists`)
  }
}

async function uploadFolder(folder) {
  const dir = join(IMAGES_ROOT, folder)
  let files
  try {
    files = readdirSync(dir).filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()))
  } catch {
    console.log(`⚠ Folder not found: ${dir}`)
    return { ok: 0, skip: 0, fail: 0 }
  }

  let ok = 0, skip = 0, fail = 0

  for (const file of files) {
    const storagePath = `${folder}/${file}`
    const localPath = join(dir, file)

    // تحقق إذا الملف موجود مسبقاً
    const { data: existing } = await supabase.storage.from(BUCKET).list(folder, {
      search: file,
    })
    if (existing?.find(f => f.name === file)) {
      skip++
      continue
    }

    const buffer = readFileSync(localPath)
    const contentType = file.endsWith('.png') ? 'image/png'
      : file.endsWith('.webp') ? 'image/webp'
        : 'image/jpeg'

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType, upsert: false })

    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`)
      fail++
    } else {
      ok++
      process.stdout.write(`\r  ↑ ${folder}: ${ok} رُفع`)
    }
  }

  console.log(`\r  ✓ ${folder}: ${ok} رُفع | ${skip} موجود مسبقاً | ${fail} فشل`)
  return { ok, skip, fail }
}

async function main() {
  console.log('═══ SizeMe — رفع الصور إلى Supabase Storage ═══\n')
  await ensureBucket()
  console.log()

  let total = { ok: 0, skip: 0, fail: 0 }
  for (const folder of FOLDERS) {
    const r = await uploadFolder(folder)
    total.ok += r.ok
    total.skip += r.skip
    total.fail += r.fail
  }

  console.log(`\n═══ الإجمالي ═══`)
  console.log(`✓ رُفع:  ${total.ok}`)
  console.log(`- موجود: ${total.skip}`)
  console.log(`✗ فشل:   ${total.fail}`)
  console.log(`\nرابط الصور: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`)
}

main().catch(console.error)
