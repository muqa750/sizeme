-- ═══════════════════════════════════════════════════════════════════
-- SizeMe — RLS Policies + Rate Limiting
-- نسخ هذا الملف بالكامل وتشغيله في Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────
-- 1) جدول rate_limits (للحماية من spam)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  id          BIGSERIAL PRIMARY KEY,
  ip          TEXT NOT NULL,
  action      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limits_ip_action_time_idx
  ON rate_limits (ip, action, created_at DESC);

-- RLS مغلق تماماً: فقط service_role يقدر يقرأ/يكتب
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- (بدون policies → anon لا يستطيع لمسه)

-- تنظيف السجلات القديمة (أكثر من ساعة) — تشغيل دوري اختياري
-- DELETE FROM rate_limits WHERE created_at < now() - interval '1 hour';


-- ───────────────────────────────────────────────────────────────────
-- 2) newsletter_subscribers
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- منع التكرار: نفس الإيميل/الهاتف لا يُسجّل مرتين (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_contact_unique
  ON newsletter_subscribers (lower(contact));

-- حذف policies قديمة لو موجودة
DROP POLICY IF EXISTS "newsletter_insert_anon" ON newsletter_subscribers;

-- سياسة: anon يقدر INSERT فقط، مع تحقق من الطول والصيغة
CREATE POLICY "newsletter_insert_anon"
ON newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (
  contact IS NOT NULL
  AND length(trim(contact)) BETWEEN 6 AND 100
  AND (
    -- إيميل بسيط
    contact ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    OR
    -- هاتف عراقي: 07XXXXXXXXX أو +9647XXXXXXXXX أو 9647XXXXXXXXX
    contact ~ '^(\+?964|0)7[0-9]{9}$'
  )
);


-- ───────────────────────────────────────────────────────────────────
-- 3) ratings
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ratings_insert_anon" ON ratings;

CREATE POLICY "ratings_insert_anon"
ON ratings
FOR INSERT
TO anon
WITH CHECK (
  score BETWEEN 1 AND 5
  AND label IN ('غاضب', 'حزين', 'عادي', 'راضي', 'سعيد جداً')
);


-- ───────────────────────────────────────────────────────────────────
-- 4) suggestions
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "suggestions_insert_anon" ON suggestions;

CREATE POLICY "suggestions_insert_anon"
ON suggestions
FOR INSERT
TO anon
WITH CHECK (
  text IS NOT NULL
  AND length(trim(text)) BETWEEN 5 AND 1000
);


-- ───────────────────────────────────────────────────────────────────
-- 5) reviews
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_insert_anon" ON reviews;
DROP POLICY IF EXISTS "reviews_select_anon" ON reviews;

-- anon يقدر INSERT تقييم جديد مع تحقق صارم
CREATE POLICY "reviews_insert_anon"
ON reviews
FOR INSERT
TO anon
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) BETWEEN 2 AND 60
  AND body IS NOT NULL AND length(trim(body)) BETWEEN 1 AND 600
  AND fabric_rating   BETWEEN 1 AND 5
  AND size_rating     BETWEEN 1 AND 5
  AND delivery_rating BETWEEN 1 AND 5
  AND service_rating  BETWEEN 1 AND 5
);

-- anon يقدر يقرأ الـ reviews (لعرضها على الموقع)
CREATE POLICY "reviews_select_anon"
ON reviews
FOR SELECT
TO anon
USING (true);


-- ═══════════════════════════════════════════════════════════════════
-- ✅ تم. لتجريب أن RLS مفعّل:
--    SELECT relname, relrowsecurity FROM pg_class
--    WHERE relname IN ('newsletter_subscribers','ratings','suggestions','reviews','rate_limits');
-- ═══════════════════════════════════════════════════════════════════
