☁️ Cloud SizeMe — Full Project Memory & Context
===============================================

> نسخة احتياطية كاملة من سياق مشروع SizeMe لنقلها إلى جلسة جديدة. آخر تحديث: 2026-04-26

* * *

1. معلومات المشروع الأساسية

---------------------------

| البند         | القيمة                                                  |
| ------------- | ------------------------------------------------------- |
| اسم المشروع   | SizeMe                                                  |
| نوعه          | متجر إلكتروني لبيع ملابس بمقاسات خاصة في العراق         |
| مسار المشروع  | `E:\sizeme\` (هارد خارجي — نُقل من D: في 2026-04-18)    |
| الملف الرئيسي | `E:\sizeme\index.html` (ملف واحد)                       |
| GitHub        | مربوط بـ git push عبر VS Code Terminal                  |
| صاحب المشروع  | hameed — urmuqa@gmail.com                               |

* * *

2. قواعد العمل مع Claude (مهم جداً)

-----------------------------------

### 2.1 سكيل SizeMe Workflow

كل تعديل على الكود يلتزم بهذه الخطوات بالترتيب:

**الخطوة 1 — اطلب الإذن قبل أي تعديل**

اعرض ملخصاً قبل أي تغيير مع خيارين أو ثلاثة للاختيار بينها:

    📋 ما الذي سأغيره: [وصف]
    ⚠️  ما الذي قد يتأثر: [وصف]
    🔵 الخيار 1: [وصف]
    🟢 الخيار 2: [وصف]
    🟡 الخيار 3: [وصف — إن وُجد]
    أيّ خيار تفضل؟

لا تبدأ قبل الموافقة.

**الخطوة 2 — فحص الجوال (95% من المستخدمين على الجوال)**

* أحجام الخط: `clamp()` أو `var(--fs-*)` — لا أحجام ثابتة
* أزرار اللمس: حد أدنى 44×44px
* لا `width` ثابت أكبر من 100vw
* Safe Area: `env(safe-area-inset-*)`
* الاختبار على عرض 390px (iPhone)

**الخطوة 3 — تحقق من دعم الثلاث لغات**

* كل نص/تصميم يدعم AR و KU (RTL) و EN (LTR)
* التصميم الأساسي للعربية والكردية من اليمين لليسار
* الإنجليزية من اليسار لليمين
* لا فراغات زائدة في النصوص العربية

**الخطوة 4 — تحقق من الأداء والسرعة**

* الموقع يخدم مستخدمين في العراق — الأداء أولوية
* لا scripts ثقيلة، لا صور غير مضغوطة، لا CDN بطيء

**الخطوة 5 — نفّذ التعديل**

**الخطوة 6 — تحقق من صور المنتجات** (عند إضافة منتج)

**الخطوة 7 — أعطِ أمر git بعد كل تعديل:**

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

### 2.4 Mobile-First (الأهم)

* **95% من مستخدمي SizeMe على الجوال**
* كل تعديل يُصمم للموبايل أولاً قبل الحاسوب
* الاختبار على عرض 390px (iPhone)
* Hover effects مقصورة على `@media(hover:hover) and (pointer:fine)` فقط

### 2.5 دعم اللغات الثلاث في كل تصميم

* AR (العربية) = RTL — اللغة الأساسية
* KU (الكردية) = RTL
* EN (الإنجليزية) = LTR
* أي عنصر جديد يجب أن يظهر بشكل صحيح في الاتجاهين
* لا فراغات زائدة في النصوص العربية

* * *

3. بنية الملفات

---------------

    E:\sizeme\
    ├── index.html               ← الموقع الكامل (ملف واحد)
    ├── favicon.png
    ├── PRODUCTS_GUIDE.md        ← دليل إضافة المنتجات
    ├── ClaudesizeMe.md          ← هذا الملف (سياق المشروع)
    ├── sizeme-workflow-SKILL.md ← نسخة احتياطية من السكيل
    ├── package.json             ← Tailwind CLI setup (غير مكتمل)
    ├── tailwind.config.js       ← Tailwind config (غير مكتمل)
    ├── imagestshirts\           ← صور تي شيرت (30 منتج — catSeq 01-30)
    ├── imagespolo\              ← صور بولو (catSeq 01)
    ├── imagesjeans\             ← صور بنطرون (catSeq 01-02)
    ├── imagestracksuit\         ← صور تراكسوت (catSeq 01)
    ├── imagesshirts\            ← صور قمصان (catSeq 01)
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
      --paper: #ffffff;          /* تغيّر من #faf9f6 في 2026-04-26 */
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

> تنبيه: استخدم فقط الأسماء أعلاه. كتابة C.OLVC بدل C.OLV سببت تعطل الموقع بالكامل.

### 6.2 مجلدات الصور

    const IMG_FOLDERS = {
      tshirt:    'imagestshirts',
      polo:      'imagespolo',
      shirt:     'imagesshirts',
      jeans:     'imagesjeans',
      tracksuit: 'imagestracksuit',
    };

    function imgPath(p, seq) {
      const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
      const pfx = p.catSeq || p.prefix;
      return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
    }

### 6.3 نظام الأسعار

    const CAT_PRICES = {
      tshirt:    35000,
      polo:      35000,
      shirt:     25000,
      jeans:     30000,
      tracksuit: 70000,
    };
    function getPrice(p) { return CAT_PRICES[p.category] || CAT_PRICES.tshirt; }

    const BULK_DISC_PER_PCS = 5000;   // خصم 5,000 لكل قطعة عند 10+
    const SHIPPING           = 5000;
    const BULK_THRESHOLD     = 10;

### 6.4 نظام المقاسات

    const SIZES_BY_CAT = {
      tshirt:    ['2XL','3XL','4XL','5XL','6XL','7XL'],
      polo:      ['2XL','3XL','4XL','5XL','6XL','7XL'],
      shirt:     ['2XL','3XL','4XL','5XL','6XL','7XL'],
      tracksuit: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      jeans:     ['38','40','42','44','46','48'],
    };

### 6.5 الفئات

    const CATEGORIES = [
      { key:'tshirt',    icon:'T',  label:{ar:'تي شيرت', en:'T-Shirt',  ku:'تی شێرت'} },
      { key:'polo',      icon:'P',  label:{ar:'بولو',    en:'Polo',     ku:'پۆلۆ'} },
      { key:'tracksuit', icon:'TR', label:{ar:'تراكسوت', en:'Tracksuit',ku:'تراکسوت'} },
      { key:'jeans',     icon:'J',  label:{ar:'بنطرون',  en:'Jeans',    ku:'جینز'} },
      { key:'shirt',     icon:'S',  label:{ar:'قميص',    en:'Shirt',    ku:'کراس'} },
    ];

### 6.6 PRODUCTS_META الحالية

    const TOTAL_PRODUCTS = 35;   /* آخر تحديث: 2026-04-26 */

    // ── تي شيرت: 1–26 (imagestshirts/{catSeq}-{seq}-{imgKey}.jpg) ──
    1:  { sku:'LA-01', imgKey:'lacoste-e33',   brand:'LACOSTE',        sub:'E33 Flag',      colors:[C.BLK,C.WHT,C.OLV],             status:'best-seller' },
    2:  { sku:'PO-02', imgKey:'polo',           brand:'U.S. POLO ASSN', sub:'Polo Classic',  colors:[C.BLK,C.WHT,C.RBL,C.TPE],      status:'best-seller' },
    3:  { sku:'GI-03', imgKey:'givenchy',       brand:'GIVENCHY',       sub:'Paris',         colors:[C.BLK,C.WHT,C.BRN] },
    4:  { sku:'OW-04', imgKey:'off-white',      brand:'OFF-WHITE',      sub:'Hand Logo',     colors:[C.BLK,C.WHT,C.RBL] },
    5:  { sku:'HU-05', imgKey:'hugo',           brand:'HUGO',           sub:'Bold Logo',     colors:[C.BLK,C.WHT,C.DNV] },
    6:  { sku:'LA-06', imgKey:'lacoste-1927',   brand:'LACOSTE',        sub:'1927 Heritage', colors:[C.BLK,C.WHT],                   status:'best-seller' },
    7:  { sku:'BA-07', imgKey:'balmain',        brand:'BALMAIN',        sub:'Paris',         colors:[C.BLK,C.WHT,C.OLV,C.BRG] },
    8:  { sku:'AL-08', imgKey:'alo',            brand:'ALO',            sub:'basic',         colors:[C.BLK,C.DNV,C.CHR,C.BRN] },
    9:  { sku:'PR-09', imgKey:'prada',          brand:'PRADA',          sub:'Milano',        colors:[C.BLK,C.WHT,C.BRN,C.CHR] },
    10: { sku:'BU-10', imgKey:'burberry',       brand:'BURBERRY',       sub:'Knight',        colors:[C.BLK,C.WHT,C.CHR] },
    11: { sku:'TO-11', imgKey:'tommy',          brand:'TOMMY JEANS',    sub:'Graffiti',      colors:[C.BLK,C.WHT,C.CHR] },
    12: { sku:'CK-12', imgKey:'ck',             brand:'CALVIN KLEIN',   sub:'CK Monogram',   colors:[C.BLK,C.WHT] },
    13: { sku:'KI-13', imgKey:'kiton',          brand:'KITON',          sub:'Napoli',        colors:[C.BLK,C.WHT] },
    14: { sku:'LO-14', imgKey:'loewe',          brand:'LOEWE',          sub:'Madrid 1846',   colors:[C.BLK,C.WHT] },
    15: { sku:'LV-15', imgKey:'lv',             brand:'LOUIS VUITTON',  sub:'Paris',         colors:[C.BLK,C.WHT,C.TPE],             status:'best-seller' },
    16: { sku:'KI-16', imgKey:'kiton-small',    brand:'KITON',          sub:'Small Logo',    colors:[C.BLK,C.WHT,C.CHR] },
    17: { sku:'CK-17', imgKey:'calvin-klein',   brand:'CALVIN KLEIN',   sub:'Classic',       colors:[C.BLK,C.WHT,C.OLV,C.BRN] },
    18: { sku:'BO-18', imgKey:'boos',           brand:'BOSS',           sub:'sun logo',      colors:[C.BLK,C.WHT,C.DNV] },
    19: { sku:'ES-19', imgKey:'essentials',     brand:'ESSENTIALS',     sub:'NBA',           colors:[C.BLK,C.WHT,C.TPE] },
    20: { sku:'PO-20', imgKey:'u-s-polo',       brand:'U.S. POLO ASSN', sub:'Assn horse',    colors:[C.BLK,C.WHT,C.OLV] },
    21: { sku:'HE-21', imgKey:'hermes',         brand:'HERMÈS',         sub:'horse Paris',   colors:[C.BLK,C.WHT],                   status:'best-seller' },
    22: { sku:'BA-22', imgKey:'balenciaga',     brand:'BALENCIAGA',     sub:'balenc shop',   colors:[C.BLK,C.WHT,C.RBL] },
    23: { sku:'SU-23', imgKey:'supreme',        brand:'SUPREME',        sub:'Earth Logo',    colors:[C.BLK,C.WHT,C.CHR] },
    24: { sku:'HE-24', imgKey:'hermes-h',       brand:'HERMÈS',         sub:'Lines Logo',    colors:[C.BLK,C.WHT] },
    25: { sku:'MA-25', imgKey:'massimo-dutti',  brand:'MASSIMO DUTTI',  sub:'since 1985',    colors:[C.BLK,C.WHT,C.BRN,C.CHR] },
    26: { sku:'LV-26', imgKey:'lv',             brand:'LOUIS VUITTON',  sub:'umbrellas',     colors:[C.BLK,C.WHT,C.RBL,C.OLV,C.BRG],status:'new' },

    // ── فئات أخرى ──
    27: { sku:'Po-27', imgKey:'polo-plus',      brand:'POLO PLUS',  sub:'Classic Fit',
          colors:[C.BLK,C.WHT,C.RBL], category:'polo',      catSeq:'01', added:'2026-04-17', status:'new' },
    28: { sku:'HE-28', imgKey:'hermes-ss',      brand:'HERMÈS',     sub:'Sport',
          colors:[C.BLK,C.WHT,C.BRN], category:'tracksuit', catSeq:'01', added:'2026-04-17', status:'new' },

    // ── تي شيرت جديد (29-32) ──
    29: { sku:'BA-29', imgKey:'balenciaga',     brand:'BALENCIAGA', sub:'PARIS',
          colors:[C.BLK,C.WHT,C.CHR], category:'tshirt',    catSeq:'27', added:'2026-04-23', status:'new' },
    30: { sku:'SU-30', imgKey:'supreme',        brand:'SUPREME',    sub:'NASA USA',
          colors:[C.BLK,C.WHT],       category:'tshirt',    catSeq:'28', added:'2026-04-23', status:'new' },
    31: { sku:'LV-31', imgKey:'lv',             brand:'LOUIS VUITTON', sub:'cuneiform',
          colors:[C.BLK,C.WHT,C.TPE], category:'tshirt',    catSeq:'29', added:'2026-04-23', status:'new' },
    32: { sku:'JJ-32', imgKey:'jackjones',      brand:'JACK & JONES',  sub:'WORLD WIDE',
          colors:[C.BLK,C.WHT],       category:'tshirt',    catSeq:'30', added:'2026-04-23', status:'new' },

    // ── قميص ──
    33: { sku:'BU-33', imgKey:'burberry-new',   brand:'BURBERRY',   sub:'Classic',
          colors:[C.BLK,C.WHT],       category:'shirt',     catSeq:'01', added:'2026-04-17', status:'new' },

    // ── بنطرون ──
    34: { sku:'CA-34', imgKey:'cargo-army',     brand:'CARGO',      sub:'Army Style',
          colors:[C.OLV,C.TPE],       category:'jeans',     catSeq:'01', added:'2026-04-23', status:'new' },
    35: { sku:'CA-35', imgKey:'cargo-army',     brand:'CARGO',      sub:'Army Black',
          colors:[C.BLK,C.CHR],       category:'jeans',     catSeq:'02', added:'2026-04-23', status:'new' },

**المنتج القادم → رقم 36**

### 6.7 Coupons

    const COUPONS = [
      { code: 'welcome',      type: 'percent', value: 10, expires: '2026-12-31' },
      { code: 'SIZEME2026',   type: 'percent', value: 5,  expires: '2026-12-31' },
      { code: 'VIP15',        type: 'percent', value: 10, expires: '2026-09-30' },
      { code: 'waleedsizeme', type: 'percent', value: 10, expires: null },
    ];

* * *

7. قواعد تسمية الصور

--------------------

### تي شيرت (`imagestshirts/`)

    {catSeq}-{رقم-صورة}-{imgKey}.jpg
    مثال: 15-1-lv.jpg, 27-1-balenciaga.jpg

### باقي الفئات

    {catSeq}-{رقم-صورة}-{imgKey}.jpg
    مثال: 01-1-polo-plus.jpg, 01-1-burberry-new.jpg

> catSeq مستقل لكل مجلد ولا علاقة له بالرقم العالمي للمنتج

* * *

8. كيفية إضافة منتج جديد

------------------------

    1. ارفع الصورة بالاسم الصحيح في المجلد الصحيح
    2. غيّر TOTAL_PRODUCTS في index.html
    3. أضف سطراً في PRODUCTS_META
    4. أضف وصفاً في PRODUCTS_DESC

**مثال — تي شيرت جديد (TOTAL_PRODUCTS = 36):**

    // الصورة: imagestshirts/31-1-brand-name.jpg
    36: { sku:'XX-36', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection',
          colors:[C.BLK,C.WHT], category:'tshirt', catSeq:'31', added:'2026-04-26', status:'new' },

**مثال — بولو جديد:**

    // الصورة: imagespolo/02-1-brand-name.jpg
    36: { sku:'XX-36', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection',
          colors:[C.BLK,C.WHT], category:'polo', catSeq:'02', added:'2026-04-26' },

* * *

9. الميزات المطبّقة حالياً

--------------------------

### 9.1 واجهة المتجر
* عرض المنتجات بفئات مستقلة مع pagination مستقل (**8 منتجات/صفحة** — تغيّر من 12)
* فلترة بالماركة واللون (pill-filter design)
* Scroll-snap slider للصور مع swipe و drag support
* Skeleton loading عند التحميل
* قسم "وصل حديثاً" (NEW_ARRIVALS_DAYS = 90)
* Color selector بتصميم 21st.dev ring مع tooltip
* PRODUCTS_DESC — وصف نصي لكل منتج (35 وصفاً)

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

| المجلد             | catSeq المستخدمة | المنتج القادم |
| ------------------ | --------------- | ------------- |
| `imagestshirts/`   | 01–30           | 31            |
| `imagespolo/`      | 01              | 02            |
| `imagesjeans/`     | 01–02           | 03            |
| `imagestracksuit/` | 01              | 02            |
| `imagesshirts/`    | 01              | 02            |

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
10. **الموبايل أولاً** — 95% من المستخدمين على الجوال
11. **اللون الذهبي** `#c9a84c` هو accent الموقع
12. **--paper** = `#ffffff` (تغيّر من `#faf9f6` في 2026-04-26)
13. **PAGE_SIZE** = 8 منتجات/صفحة (تغيّر من 12 في 2026-04-26)
14. **اسأل دائماً قبل أي تعديل** وقدّم خيارين أو ثلاثة
15. **لا فراغات زائدة** في النصوص العربية
16. **كل تصميم** يدعم AR/KU (RTL) و EN (LTR) ويكون سريعاً للعراق

* * *

15. أوامر git

-------------

    cd /d E:\sizeme && git add -A && git commit -m "تعديل: [وصف]" && git push

* * *

_آخر تعديل: 2026-04-26 — جلسة Cowork مع حميد_
