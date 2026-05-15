-- ═══════════════════════════════════════════════════════════════════
-- تحديث RLS لجدول newsletter_subscribers
-- بعد التطبيع، كل الأرقام تُحفظ بصيغة 9647XXXXXXXXX
-- ═══════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "newsletter_insert_anon" ON newsletter_subscribers;

CREATE POLICY "newsletter_insert_anon"
ON newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (
  contact IS NOT NULL
  AND length(trim(contact)) BETWEEN 6 AND 100
  AND (
    -- إيميل
    contact ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    OR
    -- هاتف عراقي بصيغة موحدة بعد normalization: 9647XXXXXXXXX
    contact ~ '^9647[0-9]{9}$'
  )
);
