☁️ Cloud SizeMe — Full Project Memory & Context
===============================================

> نسخة احتياطية كاملة من سياق مشروع SizeMe لنقلها إلى جلسة جديدة. آخر تحديث: 2026-04-24

* * *

1. معلومات المشروع الأساسية

---------------------------

| البند         | القيمة                                                  |
| ------------- | ------------------------------------------------------- |
| اسم المشروع   | SizeMe                                                  |
| نوعه          | متجر إلكتروني لبيع ملابس بمقاسات خاصة في العراق         |
| مسار المشروع  | `E:\sizeme\` (هارد خارجي — نُقل من D: في 2026-04-18)    |
| الملف الرئيسي | `E:\sizeme\index.html` (~6110 سطر — ملف واحد)           |
| GitHub        | مربوط بـ git push عبر VS Code Terminal                  |
| صاحب المشروع  | hameed — urmuqa@gmail.com                               |

* * *

2. قواعد العمل مع Claude (مهم جداً)

-----------------------------------

### 2.1 سكيل SizeMe Workflow

كل تعديل على الكود يلتزم بهذه الخطوات بالترتيب:

**الخطوة 1 — اطلب الإذن قبل أي تعديل** اعرض ملخصاً قبل أي تغيير:
    📋 ما الذي سأغيره: [وصف]
    ⚠️ ما الذي قد يتأثر: [وصف]
    هل تريد المتابعة؟

لا تبدأ قبل الموافقة.

**الخطوة 2 — فحص الجوال (95% من المستخدمين على الجوال)**

* أحجام الخط: `clamp()` أو `var(--fs-*)` — لا أحجام ثابتة
* أزرار اللمس: حد أدنى 44×44px
* لا `width` ثابت أكبر من 100vw
* Safe Area: `env(safe-area-inset-*)`

**الخطوة 3 — نفّذ التعديل**

**الخطوة 4 — تحقق من صور المنتجات** (عند إضافة منتج)

**الخطوة 5 — أعطِ أمر git بعد كل تعديل:**
    cd /d E:\sizeme && git add -A && git commit -m "تعديل: [وصف]" && git push

### 2.2 قاعدة ذهبية: لا تلمس CSS الصور أبداً

لا تُغيّر CSS الصور في بطاقات المنتجات أبداً. الأقسام التالية ممنوع لمسها:
- `.product-img` و `.product-img img`
- قسم M3 في MOBILE FIXES (aspect-ratio 4/5, object-fit contain)
- `.slide img` في الموبايل
- أي شيء يتعلق بعرض الصور في `.slider-wrap` / `.slider-track` / `.slide`

### 2.3 لا تستبدل Tailwind CDN

لا تستبدل `<script src="https://cdn.tailwindcss.com">` بملف محلي إلا بعد التأكد من إعداد بناء كامل (npm run build).
حدثت مشكلة في 2026-04-24 بسبب هذا.

### 2.4 Mobile-First

* 95% من مستخدمي SizeMe على الجوال
* كل تعديل يُصمم للموبايل أولاً قبل الحاسوب
* الاختبار على عرض 390px (iPhone)

* * *

3. بنية الملفات

---------------

    E:\sizeme\
    ├── index.html               ← الموقع الكامل (ملف واحد)
    ├── favicon.png
    ├── images/logo.jpg          ← لوقو SizeMe
    ├── PRODUCTS_GUIDE.md        ← دليل إضافة المنتجات
    ├── Claudesizeme.md          ← هذا الملف (سياق المشروع)
    ├── sizeme-workflow-SKILL.md  ← نسخة احتياطية من السكيل
    ├── package.json             ← Tailwind CLI setup (غير مكتمل)
    ├── tailwind.config.js       ← Tailwind config (غير مكتمل)
    ├── imagestshirts\           ← صور تي شيرت (26 منتج)
    ├── imagespolo\              ← صور بولو (01)
    ├── imagesjeans\             ← صور بنطرون (01)
    ├── imagestracksuit\         ← صور تراكسوت (01)
    ├── imagesshirts\            ← صور قمصان (فارغ — جاهز)
    ├── imageslogo\              ← SIZEME.png
    ├── reviews\                 ← صور تقييمات الزبائن
    └── video\
        └── brand-mission.mp4   ← فيديو الهيرو (اختياري)

* * *

4. التقنيات المستخدمة

---------------------

* HTML/CSS/JS Vanilla — بدون build tool أو framework
* Tailwind CDN v3 (`<script src="https://cdn.tailwindcss.com">`)
* Google Fonts: Cormorant Garamond (serif/logo) + Inter (English) + IBM Plex Sans Arabic (Arabic)
* RTL/LTR support كامل (AR/KU = rtl, EN = ltr)
* WhatsApp checkout (رسالة واتساب مباشرة — 9647739334545)
* Google Sheets integration للتقييمات عبر Apps Script

* * *

5. CSS Custom Properties

------------------------

    :root {
      /* ── الألوان — Luxury Gold Theme ── */
      --ink: #1a1a1a;
      --paper: #faf9f6;
      --accent: #c9a84c;
      --accent-light: #d4b968;
      --accent-glow: rgba(201, 168, 76, 0.25);
      --error: #b8312e;
      --card-bg: #ffffff;
      --line: #e8e3da;
      --mute: #8a8578;
      --gold-gradient: linear-gradient(135deg, #c9a84c 0%, #e8d48b 50%, #c9a84c 100%);

      /* نظام الخطوط الديناميكي */
      --fs-2xs: clamp(.6rem, 1.5vw, .7rem);
      --fs-xs: clamp(.7rem, 1.9vw, .8rem);
      --fs-sm: clamp(.8rem, 2.3vw, .925rem);
      --fs-base: clamp(.925rem, 2.6vw, 1.06rem);
      --fs-lg: clamp(1.05rem, 3.1vw, 1.25rem);
      --fs-xl: clamp(1.15rem, 3.6vw, 1.45rem);
      --fs-2xl: clamp(1.45rem, 4.6vw, 2.05rem);
      --fs-3xl: clamp(1.85rem, 6.2vw, 3.1rem);
      --fs-hero: clamp(2.1rem, 8.2vw, 4.1rem);

      /* Easing */
      --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --smooth: cubic-bezier(0.4, 0, 0.2, 1);
      --decel: cubic-bezier(0, 0, 0.2, 1);
      --accel: cubic-bezier(0.4, 0, 1, 1);
    }

* * *

6. بنية البيانات الرئيسية

-------------------------

### 6.1 ألوان المنتجات

    const C = {
      BLK: { n: 'Black', h: '#111111' },
      WHT: { n: 'White', h: '#FAFAFA' },
      DNV: { n: 'Dark Navy', h: '#091E5B' },
      RBL: { n: 'Royal Blue', h: '#1E3FB5' },
      BRN: { n: 'Brown', h: '#4A2C1D' },
      BRG: { n: 'Burgundy', h: '#732020' },
      CHR: { n: 'Charcoal', h: '#2D2D2D' },
      TPE: { n: 'Taupe', h: '#8E8475' },
      OLV: { n: 'Olive', h: '#3D4A2A' },
    };

> تنبيه: استخدم فقط الأسماء أعلاه. كتابة C.OLVC بدل C.OLV سببت تعطل الموقع بالكامل.

### 6.2 مجلدات الصور

    const IMG_FOLDERS = {
      tshirt: 'imagestshirts',
      polo: 'imagespolo',
      shirt: 'imagesshirts',
      jeans: 'imagesjeans',
      tracksuit: 'imagestracksuit',
    };
    
    function imgPath(p, seq){
      const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
      const pfx = p.catSeq || p.prefix;
      return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
    }

### 6.3 نظام الأسعار

    const CAT_PRICES = {
      tshirt: 35000,
      polo: 35000,
      shirt: 25000,
      jeans: 30000,
      tracksuit: 70000,
    };
    function getPrice(p){ return CAT_PRICES[p.category] || CAT_PRICES.tshirt; }
    
    const BULK_DISC_PER_PCS = 5000;
    const SHIPPING = 5000;
    const BULK_THRESHOLD = 10;

### 6.4 نظام المقاسات

    const SIZES_BY_CAT = {
      tshirt: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      polo: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      shirt: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      tracksuit: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      jeans: ['38','40','42','44','46','48'],
    };

### 6.5 الفئات

    const CATEGORIES = [
      { key:'tshirt',    icon:'T',  label:{ar:'تي شيرت',  en:'T-Shirt',  ku:'تی شێرت'} },
      { key:'polo',      icon:'P',  label:{ar:'بولو',     en:'Polo',     ku:'پۆلۆ'} },
      { key:'tracksuit', icon:'TR', label:{ar:'تراكسوت',  en:'Tracksuit',ku:'تراکسوت'} },
      { key:'jeans',     icon:'J',  label:{ar:'بنطرون',   en:'Jeans',    ku:'جینز'} },
      { key:'shirt',     icon:'S',  label:{ar:'قميص',     en:'Shirt',    ku:'کراس'} },
    ];

### 6.6 PRODUCTS_META الحالية

    const TOTAL_PRODUCTS = 29;
    
    // التي شيرت: 1–26 (imagestshirts/{globalNum}-{seq}-{imgKey}.jpg)
    // المنتجات الأخرى:
    27: { sku:'Po-27', imgKey:'polo-plus', brand:'POLO PLUS', sub:'Classic Fit',
          colors:[C.BLK,C.WHT,C.RBL], category:'polo', catSeq:'01', added:'2026-04-17' },
    28: { sku:'ca-28', imgKey:'tranzet-slimfit', brand:'TRANZET', sub:'Slim Fit',
          colors:[C.BLK,C.DNV], category:'jeans', catSeq:'01', added:'2026-04-17' },
    29: { sku:'HE-29', imgKey:'hermes-ss', brand:'HERMÈS', sub:'Sport',
          colors:[C.BLK,C.WHT,C.BRN], category:'tracksuit', catSeq:'01', added:'2026-04-17' },

**المنتج القادم → رقم 30**

### 6.7 Coupons

    const COUPONS = [
      { code: 'welcome', type: 'percent', value: 10, expires: '2026-12-31' },
      { code: 'SIZEME2026', type: 'percent', value: 5, expires: '2026-12-31' },
      { code: 'VIP15', type: 'percent', value: 10, expires: '2026-09-30' },
      { code: 'waleedsizeme', type: 'percent', value: 10, expires: null },
    ];

* * *

7. قواعد تسمية الصور

--------------------

### تي شيرت (`imagestshirts/`)

    {رقم-عالمي}-{رقم-صورة}-{imgKey}.jpg
    مثال: 15-1-lv.jpg, 15-2-lv.jpg

### باقي الفئات

    {catSeq}-{رقم-صورة}-{imgKey}.jpg
    مثال: 01-1-polo-plus.jpg

> catSeq مستقل لكل مجلد ولا علاقة له بالرقم العالمي للمنتج

* * *

8. كيفية إضافة منتج جديد

------------------------

    1. ارفع الصورة بالاسم الصحيح في المجلد الصحيح
    2. غيّر TOTAL_PRODUCTS في index.html
    3. أضف سطراً في PRODUCTS_META

**مثال — بولو جديد (TOTAL_PRODUCTS = 30):**
    // الصورة: imagespolo/02-1-brand-name.jpg
    30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection',
          colors:[C.BLK, C.WHT], category:'polo', catSeq:'02', added:'2026-04-24' },

* * *

9. الميزات المطبّقة حالياً

--------------------------

### 9.1 واجهة المتجر
* عرض المنتجات بفئات مستقلة مع pagination مستقل (12 منتج/صفحة)
* فلترة بالماركة واللون (pill-filter design)
* Scroll-snap slider للصور مع swipe و drag support
* Skeleton loading عند التحميل
* قسم "وصل حديثاً" (NEW_ARRIVALS_DAYS = 90)
* Color selector بتصميم 21st.dev ring مع tooltip

### 9.2 السلة والطلب
* سلة تسوق كاملة مع تغيير الكميات
* حساب إجمالي بأسعار كل فئة على حدة
* خصم كمية: 5,000 دينار/قطعة عند 10+ قطع + شحن مجاني
* Coupon system (percent أو fixed)
* نظام الدفع: COD فقط حالياً (Online قريباً)
* إتمام الطلب عبر واتساب

### 9.3 Product Modal
* scroll-snap multi-image slider مع dots
* يستخدم `.is-open` class للفتح/الإغلاق (لا `.hidden`)

### 9.4 حاسبة المقاس
* الزبون يدخل وزنه → مقاسه لكل الفئات
* يستخدم `.is-open` class

### 9.5 Dark Mode
* زر toggle في الـ header (شمس/قمر)
* CSS كامل لـ `[data-theme="dark"]` لكل العناصر
* محفوظ في localStorage

### 9.6 أداة التقييم بالإيموجي
* 5 إيموجي (😡😞😐😊😍) في الفوتر + مودال التأكيد
* إرسال البيانات لـ Google Sheets عبر Apps Script
* SHEETS_URL مُعرَّف في الكود

### 9.7 Premium Animations
* Spring physics easing tokens
* Scroll-reveal (IntersectionObserver)
* Badge-pop, add-flash, modal-enter, hero-rise
* Ripple wave on buttons
* Rating section animation

### 9.8 ميزات أخرى
* Toast notification عند الإضافة للسلة
* WhatsApp floating button (draggable, edge-snap, localStorage position)
* Mobile cart bar ثابت في الأسفل
* Marquee bar بلهجة عراقية
* Language switcher (AR/EN/KU) مع reload عند تغيير الاتجاه
* Customer reviews slider
* Suggestion form عبر واتساب
* Header scroll shadow
* Logo صورة مع fallback نصي
* Mobile Nav Drawer
* Hover effects مقصورة على `@media(hover:hover) and (pointer:fine)`
* Touch optimizations (manipulation, tap-highlight removal, iOS zoom prevention)
* شاشة تحميل SIZEME مع fade-out

* * *

10. الخطوط

----------

    body { font-family: 'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif; }
    [dir="rtl"] body { font-family: 'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif; font-weight: 300; }
    [dir="rtl"] h1,h2,h3,h4,.font-bold,.font-semibold,.serif { font-weight: 700; }
    .serif { font-family: 'Cormorant Garamond', serif; }

* * *

11. بنية اللغات (I18N)

----------------------

3 لغات: `ar` (RTL)، `en` (LTR)، `ku` (RTL)

تغيير AR↔KU: بدون reload (نفس الاتجاه RTL)
تغيير AR↔EN: reload مرة واحدة (تغيير الاتجاه RTL↔LTR)

* * *

12. Bug معروف وتم حله — CSS Specificity

---------------------------------------

المودالات (Product Modal + Size Calculator) تستخدم `.is-open`:
    #productModal { display: none; }
    #productModal.is-open { display: flex; }

* * *

13. حالة catSeq الحالية

-----------------------

| المجلد             | catSeq الحالية | المنتج القادم |
| ------------------ | -------------- | ------------- |
| `imagespolo/`      | 01             | 02            |
| `imagesjeans/`     | 01             | 02            |
| `imagestracksuit/` | 01             | 02            |
| `imagesshirts/`    | — (فارغ)       | 01            |

* * *

14. أشياء مهمة لا تنساها

------------------------

1. **مسار المشروع** `E:\sizeme\` (هارد خارجي)
2. **لا تلمس CSS الصور أبداً** — تعمل بشكل صحيح
3. **لا تستبدل Tailwind CDN** بملف محلي بدون إعداد بناء كامل
4. **CSS Specificity** — المودالات تستخدم `.is-open` لا `.hidden`
5. **catSeq** مستقل لكل مجلد — لا يتعلق بالرقم العالمي
6. **jeans** = مقاسات خصر (38-48) لا XL
7. **getPrice(p)** = السعر حسب الفئة
8. **اللغة** تُحفظ في localStorage وتُطبَّق في `<head>` مباشرةً
9. **الألوان** استخدم فقط: BLK, WHT, DNV, RBL, BRN, BRG, CHR, TPE, OLV
10. **الموبايل أولاً** — 95% من المستخدمين
11. **اللون الذهبي** `#c9a84c` هو accent الموقع

* * *

15. أوامر git

-------------

    cd /d E:\sizeme && git add -A && git commit -m "تعديل: [وصف]" && git push

* * *

_آخر تعديل: 2026-04-24 — جلسة Cowork مع حميد_
