# SizeMe — Project Context for Claude Code

## نبذة عن المشروع
منصة تجارة إلكترونية عراقية متخصصة في ملابس الرجال ذات المقاسات الخاصة (2XL → 7XL).
الهوية البصرية: Quiet Luxury / Minimalism — تجنب أي عناصر مزدحمة.
الأولوية: Mobile-First (معظم المستخدمين في العراق يتصفحون بالموبايل).

---

## هيكل الملفات

| الملف | الوظيفة |
|---|---|
| `index.html` | **الملف الرئيسي الوحيد** — كل الـ JS والـ CSS والـ HTML داخله |
| `orders-script.gs` | Google Apps Script — يُنسخ يدوياً في Apps Script Editor |
| `newsletter-script.gs` | Google Apps Script للنشرة البريدية |
| `google-apps-script.js` | Google Apps Script لتقييمات الموقع |
| `js/app.js` | **غير مستخدم** — لا تعدّل هذا الملف أبداً |

> ⚠️ **مهم جداً:** الموقع يعتمد فقط على `index.html`. أي تعديل يجب أن يكون فيه مباشرة.

---

## التقنيات المستخدمة

- HTML/CSS/JS كلها inline في `index.html`
- Tailwind CSS (CDN)
- Google Apps Script (Web App) لحفظ الطلبات وإرسال الإيميلات
- واتساب `wa.me` لاستقبال الطلبات
- نظام I18N داخلي (عربي / إنجليزي / كردي)

---

## ثوابت مهمة في index.html

```js
const UNIT_PRICE        = 35000;   // السعر الأساسي للقطعة
const BULK_UNIT_PRICE   = 30000;   // سعر العرض (4+ قطع)
const BULK_DISC_PER_PCS = 5000;    // الخصم لكل قطعة
const BULK_THRESHOLD    = 4;       // حد تفعيل خصم السعر
const SHIPPING_FREE_THRESHOLD = 10; // حد الشحن المجاني
const SHIPPING          = 5000;    // كلفة التوصيل الافتراضية
```

---

## Google Apps Script

- **Orders URL (الحالي):**
  `https://script.google.com/macros/s/AKfycbyOAn2W6w-62mmYDtuFwfhuqC1x9FhaROFC6Dzt6Fg6hZPJzW_aXsvWUhwVrD3N6nQZIg/exec`
- **إيميلات الإشعار:** `mustafaqais750@gmail.com` و `waleed789054@gmail.com`
- **اسم الشيت:** `الطلبات`
- ⚠️ كل تعديل على الـ Script يحتاج **New Deployment** وليس Manage Deployments
- بعد كل نشر جديد: حدّث `ORDERS_SHEETS_URL` في `index.html`

---

## عروض المتجر الحالية

| الشرط | المزية |
|---|---|
| 1–3 قطع | السعر الأساسي (35,000) + توصيل 5,000 |
| 4–9 قطع | سعر 30,000/قطعة + توصيل 5,000 |
| 10+ قطع | سعر 30,000/قطعة + **شحن مجاني** |

---

## ميزات مضافة مؤخراً

- ✅ حاسبة المقاس (`#sizeCalcModal`) — وزن + طول (اختياري) + عرض الصدر (اختياري)
- ✅ سياسة الاستبدال في الفوتر (modal)
- ✅ تنبيه انقطاع الاتصال (`#offlineToast`) — أسفل الشاشة
- ✅ كشف فشل إرسال الطلب مع رسالة للزبون
- ✅ Order ID تلقائي بصيغة `SZ-YYMMDD-XXXX`
- ✅ إشعار إيميل عند كل طلب جديد

---

## أسلوب العمل المفضّل

- لا تعدّل `js/app.js` أبداً
- قبل أي تعديل على JS داخل `index.html` تحقق من صحة الـ syntax
- I18N موجود لـ 3 لغات — أي نص جديد يُضاف للغات الثلاث: `ar` / `en` / `ku`
- تجنب الـ `addEventListener` المتكررة — استخدم `onclick =` لتجنب تراكم الـ listeners
- أسلوب التصميم: minimalist — لا ألوان زاهية، لا عناصر مزدحمة

---

## واتساب

- رقم الواتساب: `9647739334545`
- الطلبات تُرسل عبر `wa.me` مع رسالة مُنسّقة تحتوي تفاصيل الزبون والمنتجات
- تفاصيل المنتجات الكاملة تُحفظ في Google Sheets فقط
