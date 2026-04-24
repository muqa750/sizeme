---
name: sizeme-workflow
description: >
  سكيل خاص بمشروع SizeMe — متجر إلكتروني لملابس plus-size في العراق.
  استخدم هذا السكيل في كل مرة تعمل على ملف index.html أو تضيف منتجات أو
  تعدّل أي كود في مجلد sizeme. يضمن الحصول على إذن المستخدم قبل أي تغيير،
  والتحقق من التوافق مع الجوال، والتحقق من صور المنتجات، وإعطاء أمر git
  جاهز للنسخ بعد كل تعديل.
  ALWAYS trigger this skill whenever working on the SizeMe project, modifying
  index.html, adding products, or any edit inside the sizeme folder — even
  small edits must go through this workflow.
---

# SizeMe — Technical Reference & Development Workflow

> آخر تحديث: 2026-04-24
> هذا الملف هو المرجع التقني الوحيد لمشروع SizeMe. أيّ نموذج ذكاء اصطناعي يقرأه يجب أن يفهم فوراً: أين وصلنا، كيف بُني المشروع، وما هي القواعد غير القابلة للتفاوض.

---

## ═══════════════════════════════════════════════════════
## القسم 1 — الهوية التقنية
## ═══════════════════════════════════════════════════════

### 1.1 الفلسفة المعمارية

SizeMe متجر إلكتروني يعمل بملف واحد (`index.html` — ~6110 سطر). لا يوجد framework، لا يوجد bundler، لا يوجد build step. هذا قرار واعٍ لا خطأ:

| القرار         | السبب                                                       |
|----------------|-------------------------------------------------------------|
| ملف واحد      | صاحب المشروع (حميد) يعدّل الكود بنفسه — ملف واحد أسهل     |
| لا React/Vue  | لا حاجة لـ SPA — الموقع عبارة عن كتالوج منتجات بسيط        |
| لا Node build | Tailwind يعمل عبر CDN — محاولة سابقة لإعداد build فشلت      |
| لا قاعدة بيانات| المنتجات مُعرَّفة كـ JS objects مباشرةً في الكود            |

### 1.2 الحزمة التقنية (Tech Stack)

```
اللغات:        HTML5 + CSS3 + Vanilla JavaScript (ES6+)
الإطارات:       لا يوجد — Vanilla فقط
CSS Framework:  Tailwind CSS v3 عبر CDN
                ⚠️ <script src="https://cdn.tailwindcss.com"></script>
                ⛔ لا تستبدله أبداً بملف محلي — تعطّل الموقع بالكامل في 2026-04-24
الخطوط:         Google Fonts — 3 عائلات:
                • Cormorant Garamond — serif، للوقو والعناوين الفاخرة
                • Inter — sans-serif، للنصوص الإنجليزية
                • IBM Plex Sans Arabic — للنصوص العربية والكردية (weight: 300 للـ body)
الاستضافة:      GitHub Pages (git push من VS Code Terminal)
المسار:         E:\sizeme\ (هارد خارجي — نُقل من D: في 2026-04-18)
الدومين:        sizeme.iq
```

### 1.3 هيكلية الملف الواحد

ملف `index.html` مقسّم داخلياً بهذا الترتيب:

```
السطر    المحتوى
──────   ──────────────────────────────────────────────────────────
1-16     DOCTYPE + <head> + viewport meta (mobile-first)
17-20    Cache-Control headers (Safari iOS fix)
29-45    سكريبت فوري: تطبيق اللغة + الثيم من localStorage (يمنع وميض RTL/LTR)
46-62    SEO/OG meta tags + favicon + Tailwind CDN + Google Fonts
69-3158  ═══ <style> block ═══
         70-105    :root CSS variables (Luxury Gold Theme + font scale)
         107-300   Base styles (body, typography, buttons, cards, grid)
         190-237   Color selector CSS (21st.dev ring design)
         306-321   ⛔ Product image CSS (لا تلمسها أبداً)
         322-627   Components (slider, dots, modal, cart, checkout, etc.)
         628-965   @media(max-width:768px) — 13 قسم mobile fixes (M1–M13)
         722-732   ⛔ M3 mobile image CSS (لا تلمسها أبداً)
         966-1119  Hover effects (مقصورة على @media(hover:hover) and (pointer:fine))
         1120-1377 Premium Animations (spring physics, scroll-reveal, badge-pop, ripple)
         1378-1663 Emoji Rating Widget CSS (erw-* classes, dark mode support)
         1665-1705 WhatsApp float button CSS (draggable, gold border)
         2660-2690 Theme toggle button CSS
         2793-3045 ═══ Dark Theme CSS ═══ — [data-theme="dark"] لكل عنصر
         3047-3130 pill-filter + emoji-btn CSS
3161-3999 ═══ <body> HTML ═══
         3164-3166 Loading screen (sizeLoader)
         3168-3184 Marquee announcement bar (لهجة عراقية)
         3186-3239 Header (theme toggle, logo, cart, lang buttons)
         3241-3279 Mobile Nav Drawer
         3281-3600 Main content (Hero, filters, product sections, trust strip)
         3603-3679 Footer (emoji rating widget, contact, copyright)
         3680-3999 Modals (cart, checkout, product, sizeCalc, confirm, reviews, suggest)
4006-5984 ═══ <script> block ═══
         4008-4210 I18N object (ar, en, ku — كل النصوص الثلاث لغات)
         4220-4230 Color palette (const C — 9 ألوان فقط)
         4236      TOTAL_PRODUCTS = 29
         4243-4306 PRODUCTS_META (بيانات كل منتج)
         4308-4324 PRODUCTS array builder (ترتيب عكسي — الأحدث أولاً)
         4326-4339 COUPONS array
         4342-4398 imgPath() + IMG_FOLDERS + SIZES_BY_CAT + CAT_PRICES
         4407-4500 State + Helpers + Filters logic
         4519-4571 renderCard() — بطاقة منتج واحدة
         4598-4704 renderProducts() — عرض المنتجات بفئات + pagination
         4709-4827 initSliders() — scroll-snap slider مع probe للصور الإضافية
         4828-5015 Cart + Checkout + WhatsApp message builder
         5016-5073 applyLang() — تبديل اللغة مع RTL/LTR reload
         5359-5414 initLang() + initRevealObserver()
         5440-5503 Animation helpers (ripple, bounceCartCount, showToast, flashAddBtn)
         5543-5569 Loading screen dismissal (window.load + 2800ms fallback)
         5587-5720 openProductModal() — multi-image scroll-snap
         5725-5778 Size Calculator (calcSize)
         5784-5838 New Arrivals section
         5845-5871 Theme toggle (initTheme, toggleTheme, updateThemeIcon)
         5873-5888 Header scroll shadow
         5890-5983 Emoji Rating Widget JS (Google Sheets integration)
6029-6106 WhatsApp floating button (separate <script> block — draggable)
```

### 1.4 بنية المجلدات

```
E:\sizeme\
├── index.html               ← الموقع الكامل (ملف واحد ~6110 سطر)
├── favicon.png
├── images/logo.jpg          ← لوقو SizeMe (مع fallback نصي في الكود)
├── Claudesizeme.md          ← سياق المشروع الكامل لنقل الجلسات
├── sizeme-workflow-SKILL.md ← هذا الملف (المرجع التقني + سكيل العمل)
├── PRODUCTS_GUIDE.md        ← دليل مختصر لإضافة المنتجات
├── package.json             ← Tailwind CLI setup (غير مكتمل — لا تستخدمه)
├── tailwind.config.js       ← Tailwind config (غير مكتمل — لا تستخدمه)
│
├── imagestshirts/           ← صور تي شيرت (26 منتج: 01-1-brand.jpg → 26-1-brand.jpg)
├── imagespolo/              ← صور بولو (catSeq الحالي: 01)
├── imagesjeans/             ← صور بنطرون (catSeq الحالي: 01)
├── imagestracksuit/         ← صور تراكسوت (catSeq الحالي: 01)
├── imagesshirts/            ← صور قمصان (فارغ — جاهز للمنتج الأول catSeq: 01)
├── imageslogo/              ← SIZEME.png
├── reviews/                 ← صور تقييمات الزبائن
└── video/
    └── brand-mission.mp4    ← فيديو الهيرو (اختياري)
```

---

## ═══════════════════════════════════════════════════════
## القسم 2 — القرارات التصميمية (UI/UX)
## ═══════════════════════════════════════════════════════

### 2.1 Mobile-First — ليست مجرد توصية، بل قيد صارم

**95% من زبائن SizeMe يتصفحون من الجوال.** كل سطر CSS، كل عنصر HTML، كل تفاعل JS يُصمم أولاً لشاشة iPhone بعرض 390px ثم يُكيَّف للحاسوب.

**القيود الصارمة:**

| القاعدة                    | التطبيق                                                    |
|----------------------------|------------------------------------------------------------|
| لا أحجام خط ثابتة          | استخدم `clamp()` أو `var(--fs-*)` دائماً                    |
| أزرار اللمس ≥ 44×44px      | padding كافٍ، لا أزرار صغيرة أبداً                          |
| لا overflow أفقي           | لا `width` ثابت أكبر من `100vw`                             |
| Safe Area                  | `env(safe-area-inset-*)` للعناصر الثابتة                    |
| لا hover على الموبايل      | كل hover مغلّف بـ `@media(hover:hover) and (pointer:fine)` |
| Touch optimizations        | `touch-action: manipulation` + `-webkit-tap-highlight: transparent` |
| iOS zoom prevention        | `font-size: 16px` على inputs + `maximum-scale=1` في viewport |

**نظام الخطوط الديناميكي:**
```css
--fs-2xs: clamp(.6rem, 1.5vw, .7rem);   /* تسميات صغيرة جداً */
--fs-xs:  clamp(.7rem, 1.9vw, .8rem);   /* kicker / badge */
--fs-sm:  clamp(.8rem, 2.3vw, .925rem); /* نصوص ثانوية */
--fs-base:clamp(.925rem, 2.6vw, 1.06rem);/* النص الأساسي */
--fs-lg:  clamp(1.05rem, 3.1vw, 1.25rem);/* عناوين صغيرة */
--fs-xl:  clamp(1.15rem, 3.6vw, 1.45rem);/* عناوين متوسطة */
--fs-2xl: clamp(1.45rem, 4.6vw, 2.05rem);/* عناوين الأقسام */
--fs-3xl: clamp(1.85rem, 6.2vw, 3.1rem); /* عنوان Hero */
--fs-hero:clamp(2.1rem, 8.2vw, 4.1rem);  /* العنوان الرئيسي */
```

### 2.2 Arabic-First (RTL)

اللغة الافتراضية عربية. الاتجاه الافتراضي RTL. ثلاث لغات مدعومة:

| اللغة  | الكود | الاتجاه | ملاحظة                                    |
|--------|-------|---------|-------------------------------------------|
| العربية | ar    | RTL     | افتراضي — لهجة عراقية في الـ marquee       |
| الكردية | ku    | RTL     | تبديل بدون reload (نفس اتجاه العربية)     |
| الإنجليزية| en  | LTR     | تبديل يُسبب reload (تغيير اتجاه RTL↔LTR)  |

**آلية تطبيق اللغة:**
- سكريبت فوري في `<head>` يقرأ `localStorage.sizeme_lang` ويُطبق `dir` و `lang` فوراً لمنع وميض RTL/LTR
- `applyLang()` يُعيد تحميل الصفحة فقط عند تغيير الاتجاه (ar↔en أو ku↔en)
- كل النصوص مُعرَّفة في `I18N[lang]` — عربي وإنجليزي وكردي

### 2.3 ثيم Luxury Gold

اللون الذهبي `#c9a84c` هو الهوية البصرية لـ SizeMe. كل التصميم يدور حوله:

```css
:root {
  --ink: #1a1a1a;         /* نص أساسي */
  --paper: #faf9f6;       /* خلفية */
  --accent: #c9a84c;      /* ⭐ اللون الذهبي — هوية البراند */
  --accent-light: #d4b968;
  --accent-glow: rgba(201, 168, 76, 0.25);
  --error: #b8312e;
  --card-bg: #ffffff;
  --line: #e8e3da;        /* خطوط الفصل */
  --mute: #8a8578;        /* نص ثانوي */
  --gold-gradient: linear-gradient(135deg, #c9a84c 0%, #e8d48b 50%, #c9a84c 100%);
}
```

**Dark Mode:**
```css
[data-theme="dark"] {
  --ink: #f0ece2;
  --paper: #0f0f0f;
  --card-bg: #161616;
  --line: rgba(201, 168, 76, 0.12);
  --mute: #9a9590;
}
```
- زر toggle في الـ header (أيقونة شمس/قمر)
- محفوظ في `localStorage.sizeme_theme`
- يُطبَّق فورياً في `<head>` لمنع وميض

### 2.4 الأنيميشن (Premium Animations)

أربعة easing tokens مُستخدمة في كل الأنيميشن:
```css
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* ارتداد زنبركي */
--smooth: cubic-bezier(0.4, 0, 0.2, 1);       /* ناعم */
--decel:  cubic-bezier(0, 0, 0.2, 1);          /* تباطؤ */
--accel:  cubic-bezier(0.4, 0, 1, 1);          /* تسارع */
```

| الأنيميشن      | الاستخدام                           |
|----------------|-------------------------------------|
| scroll-reveal  | IntersectionObserver — عناصر تظهر عند التمرير |
| hero-rise      | عنوان Hero يطلع من تحت عند التحميل  |
| badge-pop      | بادج "جديد" يقفز                    |
| add-flash      | وميض عند الإضافة للسلة              |
| modal-enter    | المودال يدخل بحركة slide-up         |
| ripple         | موجة عند الضغط على الأزرار          |
| emoji-bounce   | الإيموجي يقفز عند الضغط             |
| fade-in        | ظهور تدريجي لبطاقات المنتجات        |

### 2.5 المودالات — قاعدة CSS Specificity

كل المودالات تستخدم `.is-open` للفتح/الإغلاق:

```css
#productModal { display: none; }
#productModal.is-open { display: flex; }
```

**⛔ لا تستخدم `.hidden` من Tailwind للمودالات.**
السبب: `#id` يملك specificity أعلى من `.class`، فـ `.hidden` لا تقدر تتغلب على `#productModal { display: none }`.

المودالات التي تتبع هذه القاعدة:
- `#productModal`
- `#sizeCalcModal`

---

## ═══════════════════════════════════════════════════════
## القسم 3 — المنطق البرمجي (Logic)
## ═══════════════════════════════════════════════════════

### 3.1 بنية بيانات المنتجات

#### لوحة الألوان — 9 ألوان فقط
```javascript
const C = {
  BLK: { n: 'Black',      h: '#111111' },
  WHT: { n: 'White',      h: '#FAFAFA' },
  DNV: { n: 'Dark Navy',  h: '#091E5B' },
  RBL: { n: 'Royal Blue', h: '#1E3FB5' },
  BRN: { n: 'Brown',      h: '#4A2C1D' },
  BRG: { n: 'Burgundy',   h: '#732020' },
  CHR: { n: 'Charcoal',   h: '#2D2D2D' },
  TPE: { n: 'Taupe',      h: '#8E8475' },
  OLV: { n: 'Olive',      h: '#3D4A2A' },
};
```
> ⛔ استخدم فقط هذه التسعة. كتابة `C.OLVC` بدل `C.OLV` أدّت لتعطل الموقع بالكامل (2026-04-24) — لأن `undefined.n` يرمي TypeError ويوقف كل الـ JS.

#### بيانات المنتج الواحد
```javascript
PRODUCTS_META = {
  // تي شيرت (1-26) — المجلد: imagestshirts/
  1: { sku: 'LA-01', imgKey: 'lacoste-e33', brand: 'LACOSTE', sub: 'E33 Flag',
       colors: [C.BLK, C.WHT, C.OLV] },

  // فئات أخرى (27+) — كل واحدة بمجلدها الخاص
  27: { sku: 'Po-27', imgKey: 'polo-plus', brand: 'POLO PLUS', sub: 'Classic Fit',
        colors: [C.BLK, C.WHT, C.RBL], category: 'polo', catSeq: '01', added: '2026-04-17' },
};
```

| الحقل      | الوصف                                              | مطلوب؟ |
|------------|-----------------------------------------------------|--------|
| `sku`      | كود المنتج الظاهر في رسالة الواتساب والسلة           | نعم    |
| `imgKey`   | الجزء الأخير من اسم ملف الصورة                       | نعم    |
| `brand`    | اسم الماركة (يظهر على البطاقة وفي الفلاتر تلقائياً)  | نعم    |
| `sub`      | وصف فرعي (Collection, Slim Fit, إلخ)                | نعم    |
| `colors`   | مصفوفة من C.XXX — الألوان المتاحة                    | نعم    |
| `category` | نوع المنتج (tshirt/polo/shirt/jeans/tracksuit)       | نعم لغير التي شيرت |
| `catSeq`   | رقم تسلسل المنتج داخل مجلد فئته                     | نعم لغير التي شيرت |
| `added`    | تاريخ الإضافة 'YYYY-MM-DD' — يُظهر بادج "جديد" لـ3 أيام | اختياري |

#### الحالة الحالية للمنتجات
```
TOTAL_PRODUCTS = 29
التي شيرت:  1–26 (imagestshirts/)
البولو:     27   (imagespolo/01-...)
البنطرون:   28   (imagesjeans/01-...)
التراكسوت:  29   (imagestracksuit/01-...)
القمصان:    —    (imagesshirts/ فارغ — جاهز)
المنتج القادم → رقم 30
```

### 3.2 نظام تسمية الصور

```javascript
const IMG_FOLDERS = {
  tshirt:    'imagestshirts',
  polo:      'imagespolo',
  shirt:     'imagesshirts',
  jeans:     'imagesjeans',
  tracksuit: 'imagestracksuit',
};

function imgPath(p, seq) {
  const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
  const pfx = p.catSeq || p.prefix;   // catSeq للمجلدات الجديدة، prefix للتي شيرت
  return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
}
```

**الصيغة:**
```
تي شيرت:    imagestshirts/{globalNum}-{seq}-{imgKey}.jpg    مثال: 15-1-lv.jpg
فئات أخرى:  {folder}/{catSeq}-{seq}-{imgKey}.jpg           مثال: 01-1-polo-plus.jpg
```

| المتغير       | الشرح                                         |
|---------------|-----------------------------------------------|
| `globalNum`   | رقم المنتج العالمي (01-26 للتي شيرت)           |
| `catSeq`      | تسلسل مستقل لكل مجلد فئة (يبدأ من 01)         |
| `seq`         | رقم الصورة (1 = أساسية، 2+ = إضافية — تُكتشف تلقائياً) |
| `imgKey`      | معرّف الصورة من PRODUCTS_META                  |

**حالة catSeq الحالية:**

| المجلد             | آخر catSeq | التالي |
|--------------------|-----------|--------|
| `imagespolo/`      | 01        | 02     |
| `imagesjeans/`     | 01        | 02     |
| `imagestracksuit/` | 01        | 02     |
| `imagesshirts/`    | (فارغ)    | 01     |

### 3.3 نظام الأسعار

```javascript
const CAT_PRICES = {
  tshirt:    35000,   // دينار عراقي
  polo:      35000,
  shirt:     25000,
  jeans:     30000,
  tracksuit: 70000,
};
function getPrice(p) { return CAT_PRICES[p.category] || CAT_PRICES.tshirt; }

const BULK_DISC_PER_PCS = 5000;   // خصم 5,000 لكل قطعة عند 10+
const SHIPPING = 5000;            // 5,000 دينار شحن
const BULK_THRESHOLD = 10;        // 10 قطع = شحن مجاني + خصم
```

**نظام الكوبونات:**
```javascript
const COUPONS = [
  { code: 'welcome',       type: 'percent', value: 10, expires: '2026-12-31' },
  { code: 'SIZEME2026',    type: 'percent', value: 5,  expires: '2026-12-31' },
  { code: 'VIP15',         type: 'percent', value: 10, expires: '2026-09-30' },
  { code: 'waleedsizeme',  type: 'percent', value: 10, expires: null },
];
```

### 3.4 نظام المقاسات

```javascript
const SIZES_BY_CAT = {
  tshirt:    ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
  polo:      ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
  shirt:     ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
  tracksuit: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
  jeans:     ['38',  '40',  '42',  '44',  '46',  '48'],  // مقاسات خصر أوروبية
};
```

### 3.5 حاسبة المقاسات (Size Calculator)

الزبون يُدخل وزنه بالكيلو → يحصل على مقاسين: واحد للملابس العلوية (XL) وواحد للبنطرون (أرقام).

**جدول الملابس العلوية (xlMap):**

| المقاس | الوزن الأدنى (كغ) | الوزن الأقصى (كغ) |
|--------|-------------------|-------------------|
| 2XL    | 95                | 106               |
| 3XL    | 106               | 116               |
| 4XL    | 116               | 126               |
| 5XL    | 126               | 141               |
| 6XL    | 141               | 156               |
| 7XL    | 156               | 220               |

**جدول البنطرون (jeansMap):**

| المقاس | الوزن الأدنى (كغ) | الوزن الأقصى (كغ) |
|--------|-------------------|-------------------|
| 38     | 40                | 86                |
| 40     | 86                | 96                |
| 42     | 96                | 111               |
| 44     | 111               | 126               |
| 46     | 126               | 141               |
| 48     | 141               | 220               |

**الآلية:**
```javascript
function calcSize() {
  const w = parseFloat($('#scWeight').value);
  if (!w || w < 40 || w > 300) return;
  const xl = xlMap.find(r => w >= r.min && w < r.max) || xlMap[xlMap.length-1];
  const jeans = jeansMap.find(r => w >= r.min && w < r.max) || jeansMap[jeansMap.length-1];
  // يعرض النتيجتين معاً
}
```

### 3.6 الربط مع Google Sheets (أداة التقييم)

أداة التقييم بالإيموجي ترسل بيانات التقييم إلى Google Sheets عبر Google Apps Script:

```javascript
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxFxw3RuQz2yW5Esb0ld9qv4yHSabBVMNiSb3zfx-aO7m8r7CaSRMxDQCoRq6f5l_AM0Q/exec';

function sendRating(value, score, source) {
  const ts = encodeURIComponent(new Date().toISOString());
  const url = SHEETS_URL +
    '?rating=' + encodeURIComponent(value) +
    '&score=' + encodeURIComponent(score) +
    '&timestamp=' + ts +
    '&source=' + encodeURIComponent(source || 'sizeme-footer');
  fetch(url, { method: 'GET', mode: 'no-cors' }).catch(console.error);
}
```

**البيانات المُرسلة:**

| الحقل       | الوصف                                  | مثال            |
|-------------|----------------------------------------|-----------------|
| `rating`    | القيمة النصية للتقييم                   | "سعيد جداً"     |
| `score`     | الرقم (1-5)                             | 5               |
| `timestamp` | وقت التقييم ISO                         | 2026-04-24T...  |
| `source`    | مصدر التقييم (footer أو checkout modal) | sizeme-footer   |

**الإيموجيات الخمسة:**
```
😡 غاضب (score: 1) → 😞 حزين (2) → 😐 عادي (3) → 😊 راضي (4) → 😍 سعيد جداً (5)
```

موجود في مكانين:
1. **الفوتر** (`#footRatingWidget`) — يظهر دائماً
2. **مودال التأكيد بعد الطلب** (`#confirmModal`) — يُعاد ضبطه عند كل فتح (MutationObserver)

### 3.7 تدفق الطلب عبر واتساب

```
الزبون يختار منتج + لون + مقاس → يضيف للسلة → يفتح Checkout →
يدخل الاسم + الرقم + المحافظة → يختار COD →
يتم بناء رسالة واتساب تلقائياً → يُفتح واتساب بالرسالة الجاهزة
```

رقم واتساب: `9647739334545`

### 3.8 Slider (عارض الصور)

- يستخدم CSS scroll-snap (لا مكتبة خارجية)
- `initSliders()` يتحقق من وجود صور إضافية (`-2-`, `-3-`, إلخ) عبر `Image()` probe
- إذا وُجدت صور إضافية، يُضيفها للـ track ويُظهر النقاط (dots)
- swipe support طبيعي من المتصفح عبر scroll-snap

### 3.9 عرض المنتجات

```javascript
const PAGE_SIZE = 8;  // (ملاحظة: CAT_PAGE_SIZE = 12 في بعض الأماكن)
const CATEGORIES = [
  { key: 'tshirt', icon: 'T',  label: { ar: 'تي شيرت', en: 'T-Shirt', ku: 'تی شێرت' } },
  { key: 'polo',   icon: 'P',  label: { ar: 'بولو',    en: 'Polo',    ku: 'پۆلۆ' } },
  { key: 'tracksuit', icon: 'TR', label: { ar: 'تراكسوت', en: 'Tracksuit', ku: 'تراکسوت' } },
  { key: 'jeans',  icon: 'J',  label: { ar: 'بنطرون',  en: 'Jeans',   ku: 'جینز' } },
  { key: 'shirt',  icon: 'S',  label: { ar: 'قميص',    en: 'Shirt',   ku: 'کراس' } },
];
```

- المنتجات تُعرض مُجمَّعة بالفئة، كل فئة بـ pagination مستقل
- الترتيب تنازلي (الأحدث أولاً)
- الفلاتر ديناميكية: كل ماركة/لون موجود في المنتجات يظهر تلقائياً كفلتر
- قسم "وصل حديثاً" (`NEW_ARRIVALS_DAYS = 90`) يعرض المنتجات التي أُضيفت خلال آخر 90 يوماً

### 3.10 شاشة التحميل

```javascript
// تختفي عند:
window.addEventListener('load', () => setTimeout(dismiss, 950));
// أو بعد 2800ms كـ fallback:
setTimeout(() => { if (loader.parentNode) dismiss(); }, 2800);
```

> ⚠️ أي خطأ JS يمنع تنفيذ هذا الكود = الموقع يبقى عالقاً على شاشة SIZEME. هذا بالضبط ما حصل مع `C.OLVC`.

---

## ═══════════════════════════════════════════════════════
## القسم 4 — التفاصيل التشغيلية
## ═══════════════════════════════════════════════════════

### 4.1 بيئة العمل

| البند             | التفاصيل                                               |
|--------------------|---------------------------------------------------------|
| المحرر            | VS Code                                                |
| نظام التشغيل      | Windows                                                |
| مسار المشروع      | `E:\sizeme\` (هارد خارجي)                              |
| Git               | مُعدّ — push مباشر من VS Code Terminal                 |
| الاستضافة         | GitHub Pages                                           |
| صاحب المشروع      | حميد (hameed) — urmuqa@gmail.com                       |
| اللغة المفضلة     | العربية (العراقية)                                      |
| Tailwind           | CDN فقط — ⛔ لا build محلي                             |

### 4.2 البرامج المساعدة

| البرنامج    | الاستخدام                                               |
|-------------|--------------------------------------------------------|
| VS Code     | تحرير الكود + Git Terminal                              |
| Wilcom      | برنامج تطريز — يُستخدم لتصميم الأنماط (patterns) على الملابس |
| Git         | إدارة النسخ — push عبر VS Code Terminal                 |
| Chrome      | اختبار الموقع (DevTools mobile simulation)              |
| واتساب      | قناة استلام الطلبات من الزبائن                           |

### 4.3 أهداف البراند (SizeMe)

SizeMe متجر إلكتروني عراقي متخصص بملابس الرجال ذوي القياسات الكبيرة (plus-size: 2XL → 7XL). الهوية:

- **الشعار:** "Dressed Well. In Every Size."
- **الفئة المستهدفة:** رجال عراقيون يبحثون عن ملابس ماركات عالمية بمقاسات كبيرة
- **القيمة:** ملابس فاخرة بأسعار موحّدة — لا فرق سعر بين 2XL و 7XL
- **التسليم:** كل العراق — "التوصيل يجيك وين ما تكون بالعراق"
- **الاستبدال:** سهل — "القياس ما ناسبك؟ لتشيل هم"
- **الخصم الجماعي:** 10+ قطع = خصم 5,000 دينار/قطعة + شحن مجاني
- **نبرة الصوت:** عراقية دافئة، فاخرة لكن بسيطة

### 4.4 الميزات المُفعَّلة حالياً

```
✅ عرض المنتجات بفئات مع pagination مستقل
✅ فلترة بالماركة واللون (pill-filter design)
✅ Scroll-snap image slider مع probe للصور الإضافية
✅ Product Modal مع multi-image scroll-snap
✅ سلة تسوق كاملة (إضافة/حذف/تعديل كمية)
✅ Checkout عبر واتساب
✅ نظام كوبونات (percent + fixed)
✅ خصم كمية (10+ قطع)
✅ حاسبة المقاسات (وزن → مقاس)
✅ Dark Mode (toggle + localStorage)
✅ 3 لغات (AR/EN/KU) مع RTL/LTR
✅ أداة تقييم بالإيموجي → Google Sheets
✅ Premium Animations (spring physics, scroll-reveal, ripple)
✅ قسم "وصل حديثاً" (90 يوم)
✅ Marquee bar بلهجة عراقية
✅ WhatsApp floating button (draggable, edge-snap)
✅ Mobile Nav Drawer
✅ شاشة تحميل SIZEME مع fade-out
✅ Header scroll shadow
✅ Toast notifications
✅ Skeleton loading
✅ Customer reviews section
✅ Suggestion form (واتساب)
✅ SEO/OG tags
```

---

## ═══════════════════════════════════════════════════════
## القسم 5 — سير العمل (Workflow) — خطوات إلزامية
## ═══════════════════════════════════════════════════════

### الخطوة 1 — اطلب الإذن قبل أي تعديل

قبل أن تلمس أي كود، اعرض على المستخدم ملخصاً واضحاً:

```
📋 ما الذي سأغيره:
• [وصف واضح لكل تغيير مقترح]

⚠️ ما الذي قد يتأثر:
• [أي أقسام أو وظائف قد تتأثر]

هل تريد المتابعة؟
```

**لا تجري أي تعديل قبل موافقة صريحة.**

### الخطوة 2 — فحص الجوال (قبل كتابة الكود)

| الفحص           | المعيار                                              |
|-----------------|------------------------------------------------------|
| أحجام الخط       | `clamp()` أو `var(--fs-*)` — لا أحجام ثابتة          |
| أزرار اللمس      | الحد الأدنى 44×44px                                  |
| Overflow أفقي    | لا `width` ثابت > 100vw                              |
| Safe Area        | `env(safe-area-inset-*)` للعناصر الثابتة              |
| الصور            | `width:100%; height:auto` أو `aspect-ratio`          |

### الخطوة 3 — نفّذ التعديل

- عدّل فقط ما وعدت به
- لا تغيير جانبي بدون إخبار المستخدم
- لا تعديل على `PRODUCTS_META` أو `TOTAL_PRODUCTS` إلا إذا طُلب

### الخطوة 4 — تحقق من صور المنتجات (عند إضافة منتج)

قبل تعديل `PRODUCTS_META`:
- `{folder}/{prefix}-1-{imgKey}.jpg` موجودة على الأقل
- الاسم مطابق تماماً (حساس لحالة الأحرف)

### الخطوة 5 — أمر git بعد كل تعديل

```bash
cd /d E:\sizeme && git add -A && git commit -m "تعديل: [وصف قصير]" && git push
```

---

## ═══════════════════════════════════════════════════════
## القسم 6 — قواعد غير قابلة للتفاوض (Red Lines)
## ═══════════════════════════════════════════════════════

```
⛔ #1  لا تلمس CSS الصور أبداً
       .product-img | .product-img img | M3 mobile fixes | .slide img
       .slider-wrap | .slider-track | .slide
       هذه تعمل بشكل مثالي — أي تعديل يكسرها

⛔ #2  لا تستبدل Tailwind CDN بملف محلي
       <script src="https://cdn.tailwindcss.com"></script>
       محاولة استبداله بـ dist/output.css عطّلت الموقع بالكامل (2026-04-24)

⛔ #3  لا تستخدم ألوان غير موجودة في const C
       C.OLVC غير موجود → TypeError → crash → الموقع يبقى على شاشة التحميل
       الألوان المسموحة: BLK, WHT, DNV, RBL, BRN, BRG, CHR, TPE, OLV

⛔ #4  لا تستخدم .hidden للمودالات
       استخدم .is-open بدلاً منها (CSS specificity)

⛔ #5  لا أحجام خط ثابتة
       استخدم clamp() أو var(--fs-*) دائماً

⛔ #6  لا hover بدون media query
       @media(hover:hover) and (pointer:fine) { } إلزامي
```

---

## ═══════════════════════════════════════════════════════
## القسم 7 — كيفية إضافة منتج جديد (3 خطوات)
## ═══════════════════════════════════════════════════════

```
الخطوة 1: ارفع الصورة بالاسم الصحيح في المجلد الصحيح
الخطوة 2: غيّر TOTAL_PRODUCTS (حالياً 29 → 30)
الخطوة 3: أضف سطراً في PRODUCTS_META
```

**مثال — بولو جديد:**
```javascript
// الصورة: imagespolo/02-1-brand-name.jpg
// TOTAL_PRODUCTS = 30
30: {
  sku: 'XX-30', imgKey: 'brand-name', brand: 'BRAND NAME', sub: 'Collection',
  colors: [C.BLK, C.WHT], category: 'polo', catSeq: '02', added: '2026-04-24'
},
```

**المنتج يظهر تلقائياً** في أول الصفحة (ترتيب تنازلي) + في قسم "وصل حديثاً" لمدة 90 يوماً + ماركته تظهر في الفلاتر تلقائياً.

---

## ═══════════════════════════════════════════════════════
## القسم 8 — الأخطاء السابقة والدروس المستفادة
## ═══════════════════════════════════════════════════════

| التاريخ    | الخطأ                                   | السبب                                    | الدرس                                       |
|------------|----------------------------------------|------------------------------------------|----------------------------------------------|
| 2026-04-24 | الموقع عالق على شاشة SIZEME            | `dist/output.css` غير موجود              | لا تستبدل Tailwind CDN بملف محلي            |
| 2026-04-24 | الموقع عالق على شاشة SIZEME (ثاني)     | `C.OLVC` بدل `C.OLV` = TypeError         | تحقق من كل لون في PRODUCTS_META             |
| عام        | المودال لا يفتح                         | استخدام `.hidden` بدل `.is-open`          | المودالات تستخدم `.is-open` فقط             |
| عام        | الصور مقطوعة على الموبايل               | تعديل CSS الصور                          | لا تلمس CSS الصور أبداً                     |

---

_آخر تعديل: 2026-04-24 — SizeMe Technical Reference v2.0_
