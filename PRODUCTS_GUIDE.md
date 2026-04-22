# 🛍️ دليل إضافة المنتجات — SizeMe

---

## 🗂️ هيكل المجلدات

```text
sizeme/
├── imagestshirts/    ← صور التي شيرت
├── imagespolo/       ← صور البولو
├── imagesjeans/      ← صور البنطرون
├── imagestracksuit/  ← صور التراكسوت
├── imagesshirts/     ← صور القمصان
└── js/data.js        ← ملف البيانات الرئيسي (حيث تتم إضافة المنتجات)
```

---

## 📐 قاعدة تسمية الصور (موحدة لجميع الأقسام)

كل قسم يمتلك تسلسلاً خاصاً به ومستقلاً تماماً عن الأقسام الأخرى.
اسم الصورة دائماً يتبع هذه الصيغة:
```text
{catSeq}-{رقم-صورة}-{imgKey}.jpg
```

**أمثلة:**
- **تي شيرت جديد**: `32-1-gucci-logo.jpg` (حيث التسلسل الخاص بالتيشيرتات `catSeq` وصل لـ 32).
- **بولو جديد**: `02-1-ralph-lauren.jpg` (التسلسل الخاص بالبولو `catSeq` وصل لـ 02).
- **بنطرون جديد**: `03-1-cargo.jpg` (التسلسل الخاص بالبنطرونات `catSeq` وصل لـ 03).

> ⚡ **ملاحظة مهمة:** تسلسل المجلد (`catSeq`) مستقل تماماً عن رقم المنتج العام (`TOTAL_PRODUCTS`).

---

## 🚀 الخطوات الثلاث لإضافة أي منتج

```text
1. ارفع الصورة بالاسم الصحيح في المجلد المخصص لها (حسب تسلسل القسم).
          ↓
2. في ملف js/data.js، قم بزيادة الرقم TOTAL_PRODUCTS بمقدار 1 (لتحديد أن هناك منتجاً جديداً سيظهر أولاً).
          ↓
3. أضف بيانات المنتج الجديد في جدول PRODUCTS_META في ملف js/data.js مع إعطائه الرقم العام الجديد (TOTAL_PRODUCTS).
```

---

## 🔍 أين تتم الإضافة في `js/data.js`؟

1. افتح ملف `js/data.js` في المحرر (VS Code).
2. ابحث عن `export const TOTAL_PRODUCTS` وقم بزيادة الرقم بمقدار المنتجات التي تضيفها.
3. ابحث عن `export const PRODUCTS_META` وأضف السطر الجديد في نهاية القائمة بالرقم العام الجديد.

---

## 📝 نموذج كامل لكل فئة

### تي شيرت 
```javascript
// في imagestshirts/ → 32-1-brand-name.jpg
38: { sku:'XX-38', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection Name',
      colors:[C.BLK, C.WHT], category:'tshirt', catSeq:'32', added:'2026-05-01' },
```

### بولو
```javascript
// في imagespolo/ → 02-1-brand-name.jpg
39: { sku:'XX-39', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection Name',
      colors:[C.BLK, C.WHT], category:'polo', catSeq:'02', added:'2026-05-01' },
```

### بنطرون (مقاساته أرقام أوروبية)
```javascript
// في imagesjeans/ → 03-1-brand-name.jpg
40: { sku:'XX-40', imgKey:'brand-name', brand:'BRAND NAME', sub:'Slim Fit',
      colors:[C.BLK, C.DNV], category:'jeans', catSeq:'03', added:'2026-05-01' },
```

### تراكسوت
```javascript
// في imagestracksuit/ → 02-1-brand-name.jpg
41: { sku:'XX-41', imgKey:'brand-name', brand:'BRAND NAME', sub:'Sport',
      colors:[C.BLK, C.WHT], category:'tracksuit', catSeq:'02', added:'2026-05-01' },
```

### قميص
```javascript
// في imagesshirts/ → 02-1-brand-name.jpg
42: { sku:'XX-42', imgKey:'brand-name', brand:'BRAND NAME', sub:'Slim Fit',
      colors:[C.BLK, C.WHT], category:'shirt', catSeq:'02', added:'2026-05-01' },
```

---

## 🎨 رموز الألوان

| الرمز | اللون | الهيكس |
|-------|-------|--------|
| `C.BLK` | أسود | #1a1a1a |
| `C.WHT` | أبيض | #f5f5f5 |
| `C.RBL` | أزرق ملكي | #1e3a6e |
| `C.DNV` | كحلي | #213360 |
| `C.OLV` | زيتي | #4a4a2a |
| `C.BRN` | بني | #5c3a1e |
| `C.CHR` | رمادي فحمي | #3a3a3a |
| `C.TPE` | بيج | #b8a898 |
| `C.BRG` | برغندي | #6e1e2a |

---

## ⚠️ أخطاء شائعة يجب تجنبها

| الخطأ | السبب | الحل |
|-------|-------|------|
| الصورة لا تظهر | اسم الملف لا يطابق `catSeq` أو `imgKey` | تحقق من كل حرف بما فيها الشرطات وتطابق `catSeq` مع بداية اسم الصورة. |
| منتج يظهر بدون صورة | نسيت رفع الصورة | ارفع `{catSeq}-1-{imgKey}.jpg` على الأقل. |
| المنتج لا يظهر في قسمه | نسيت `category:` | أضف الحقل (مثلاً `category:'polo'`). |
| أرقام مقاسات خاطئة للبنطرون | نسيت `category:'jeans'` | المقاسات تُحدَّد تلقائياً بناءً على الفئة (Jeans يستخدم مقاسات الخصر 38-48). |
| الترتيب لا يظهر الأحدث أولاً | لم تستخدم الرقم العام (TOTAL_PRODUCTS) | تأكد أن المنتجات الأحدث تحصل على الرقم العام الأكبر في `PRODUCTS_META`. |
| لم يظهر شعار "جديد" | نسيت إضافة تاريخ الإضافة | أضف الحقل `added:'YYYY-MM-DD'` بتاريخ اليوم. |
