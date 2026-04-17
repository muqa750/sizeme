# 🛍️ دليل إضافة المنتجات — SizeMe

---

## 🗂️ هيكل المجلدات

```
sizeme/
├── imagestshirts/    ← صور التي شيرت
├── imagespolo/       ← صور البولو
├── imagesjeans/      ← صور البنطرون
├── imagestracksuit/  ← صور التراكسوت
├── imagesshirts/     ← صور القمصان (فارغ — جاهز)
└── index.html        ← ملف الموقع الرئيسي
```

---

## 📐 قاعدة تسمية الصور

### التي شيرت — `imagestshirts/`
```
{رقم-عالمي}-{رقم-صورة}-{imgKey}.jpg

مثال:
27-1-gucci-logo.jpg   ← منتج رقم 27 في PRODUCTS_META
27-2-gucci-logo.jpg   ← صورة ثانية لنفس المنتج
```

### باقي الأقسام — `imagespolo/ imagesjeans/ imagestracksuit/ imagesshirts/`
```
{catSeq}-{رقم-صورة}-{imgKey}.jpg

مثال (بولو ثانٍ):
02-1-ralph-lauren.jpg   ← catSeq = 02
02-2-ralph-lauren.jpg
```

> ⚡ catSeq = ترقيم خاص بكل مجلد، مستقل تماماً عن رقم المنتج العالمي

---

## 🚀 الخطوات الثلاث لإضافة أي منتج

```
1. ارفع الصورة بالاسم الصحيح في المجلد الصحيح
          ↓
2. غيّر TOTAL_PRODUCTS في index.html
          ↓
3. أضف سطراً في PRODUCTS_META في index.html
```

---

## 🔍 كيف تجد PRODUCTS_META في index.html

1. افتح `index.html` في VS Code
2. اضغط `Ctrl + F`
3. ابحث عن: `const PRODUCTS_META`
4. ستجد جدول المنتجات — أضف سطرك في الأسفل

---

## 📝 نموذج كامل لكل فئة

### تي شيرت (TOTAL_PRODUCTS = 30)
```js
// في imagestshirts/ → 30-1-brand-name.jpg
30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection Name',
      colors:[C.BLK, C.WHT] },
```

### بولو (TOTAL_PRODUCTS = 30)
```js
// في imagespolo/ → 02-1-brand-name.jpg
30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection Name',
      colors:[C.BLK, C.WHT],
      category:'polo',
      catSeq:'02' },
```

### بنطرون (TOTAL_PRODUCTS = 30)
```js
// في imagesjeans/ → 02-1-brand-name.jpg
30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Slim Fit',
      colors:[C.BLK, C.DNV],
      category:'jeans',
      catSeq:'02' },
```

### تراكسوت (TOTAL_PRODUCTS = 30)
```js
// في imagestracksuit/ → 02-1-brand-name.jpg
30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Sport',
      colors:[C.BLK, C.WHT],
      category:'tracksuit',
      catSeq:'02' },
```

### قميص (TOTAL_PRODUCTS = 30)
```js
// في imagesshirts/ → 01-1-brand-name.jpg
30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Slim Fit',
      colors:[C.BLK, C.WHT],
      category:'shirt',
      catSeq:'01' },
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

## 🔢 حالة TOTAL_PRODUCTS الحالية

```
TOTAL_PRODUCTS = 29

المنتجات الحالية:
01–26  → تي شيرت  (imagestshirts/)
27     → بولو     (imagespolo/  catSeq:01)
28     → بنطرون   (imagesjeans/ catSeq:01)
29     → تراكسوت  (imagestracksuit/ catSeq:01)

المنتج القادم → رقم 30
```

---

## ⚠️ أخطاء شائعة يجب تجنبها

| الخطأ | السبب | الحل |
|-------|-------|------|
| الصورة لا تظهر | اسم الملف لا يطابق imgKey | تحقق من كل حرف بما فيها الشرطات |
| منتج يظهر بدون صورة | نسيت رفع الصورة | ارفع `01-1-imgKey.jpg` على الأقل |
| المنتج لا يظهر في قسمه | نسيت `category:` | أضف الحقل |
| أرقام مقاسات خاطئة للبنطرون | نسيت `category:'jeans'` | المقاسات تُحدَّد تلقائياً بالـ category |
| خطأ في PRODUCTS_META | نسيت تغيير TOTAL_PRODUCTS | غيّر الرقم أولاً |
