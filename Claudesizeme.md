☁️ Cloud SizeMe — Full Project Memory & Context
===============================================

> نسخة احتياطية كاملة من سياق مشروع SizeMe لنقلها إلى جلسة جديدة.آخر تحديث: 2026-04-19

* * *

1. معلومات المشروع الأساسية

---------------------------

| البند         | القيمة                                                  |
| ------------- | ------------------------------------------------------- |
| اسم المشروع   | SizeMe                                                  |
| نوعه          | متجر إلكتروني لبيع ملابس بمقاسات خاصة في العراق         |
| مسار المشروع  | `E:\sizeme\` (هارد خارجي — نُقل من D: في 2026-04-18)    |
| الملف الرئيسي | `E:\sizeme\index.html` (ملف واحد — Vanilla HTML/CSS/JS) |
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

### 2.2 قواعد اللغة والتنسيق

* الشرح بالعربية الكاملة
* الأكواد في بلوكات منفصلة
* لا خلط إنجليزي داخل الجمل العربية

### 2.3 Mobile-First

* 95% من مستخدمي SizeMe على الجوال
* كل تعديل يُصمم للموبايل أولاً قبل الحاسوب
* الاختبار على عرض 390px (iPhone)

* * *

3. بنية الملفات

---------------

    E:\sizeme\
    ├── index.html               ← الموقع الكامل (ملف واحد)
    ├── favicon.png
    ├── PRODUCTS_GUIDE.md        ← دليل إضافة المنتجات
    ├── sizeme-workflow-SKILL.md ← نسخة احتياطية من السكيل
    ├── imagestshirts\           ← صور تي شيرت
    ├── imagespolo\              ← صور بولو
    ├── imagesjeans\             ← صور بنطرون
    ├── imagestracksuit\         ← صور تراكسوت
    ├── imagesshirts\            ← صور قمصان (فارغ — جاهز)
    ├── reviews\                 ← صور تقييمات الزبائن
    └── video\
        └── brand-mission.mp4   ← فيديو الهيرو (اختياري)

* * *

4. التقنيات المستخدمة

---------------------

* HTML/CSS/JS Vanilla — بدون build tool أو framework
* Tailwind CDN (v3)
* Google Fonts: Cormorant Garamond + Inter + Tajawal
* RTL/LTR support كامل (AR/KU = rtl, EN = ltr)
* WhatsApp checkout (رسالة واتساب مباشرة)

* * *

5. CSS Custom Properties

------------------------

    :root {
      /* الألوان */
      --ink:    #1a1a1a;
      --paper:  #faf8f5;
      --accent: #b8312e;
      --line:   #e6e1d8;
      --mute:   #7a736a;
    
      /* نظام الخطوط الديناميكي */
      --fs-2xs : clamp(.55rem, 1.4vw, .65rem);
      --fs-xs  : clamp(.65rem, 1.8vw, .75rem);
      --fs-sm  : clamp(.75rem, 2.2vw, .875rem);
      --fs-base: clamp(.875rem, 2.5vw, 1rem);
      --fs-lg  : clamp(1rem, 3vw, 1.2rem);
      --fs-xl  : clamp(1.1rem, 3.5vw, 1.4rem);
      --fs-2xl : clamp(1.4rem, 4.5vw, 2rem);
      --fs-3xl : clamp(1.8rem, 6vw, 3rem);
      --fs-hero: clamp(2rem, 8vw, 4rem);
    
      /* Easing */
      --spring : cubic-bezier(0.34, 1.56, 0.64, 1);
      --smooth : cubic-bezier(0.4, 0, 0.2, 1);
      --decel  : cubic-bezier(0, 0, 0.2, 1);
      --accel  : cubic-bezier(0.4, 0, 1, 1);
    }

* * *

6. بنية البيانات الرئيسية

-------------------------

### 6.1 ألوان المنتجات

    const C = {
      BLK: { n:'Black',   h:'#1a1a1a' },
      WHT: { n:'White',   h:'#f5f5f5' },
      RBL: { n:'Royal Blue', h:'#1e3a6e' },
      DNV: { n:'Dark Navy',  h:'#213360' },
      OLV: { n:'Olive',   h:'#4a4a2a' },
      BRN: { n:'Brown',   h:'#5c3a1e' },
      CHR: { n:'Charcoal',h:'#3a3a3a' },
      TPE: { n:'Taupe',   h:'#b8a898' },
      BRG: { n:'Burgundy',h:'#6e1e2a' },
    };

### 6.2 مجلدات الصور

    const IMG_FOLDERS = {
      tshirt   : 'imagestshirts',
      polo     : 'imagespolo',
      shirt    : 'imagesshirts',
      jeans    : 'imagesjeans',
      tracksuit: 'imagestracksuit',
    };
    
    function imgPath(p, seq){
      const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
      const pfx    = p.catSeq || p.prefix;
      return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
    }

### 6.3 نظام الأسعار (CAT_PRICES)

    const CAT_PRICES = {
      tshirt   : 35000,   // 35,000 دينار
      polo     : 35000,
      shirt    : 25000,   // 25,000 دينار
      jeans    : 30000,   // 30,000 دينار
      tracksuit: 70000,   // 70,000 دينار
    };
    function getPrice(p){ return CAT_PRICES[p.category] || CAT_PRICES.tshirt; }
    
    const BULK_DISC_PER_PCS = 5000;   // خصم 5,000 لكل قطعة عند 10+
    const SHIPPING          = 5000;
    const BULK_THRESHOLD    = 10;

### 6.4 نظام المقاسات

    const SIZES_BY_CAT = {
      tshirt   : ['2XL','3XL','4XL','5XL','6XL','7XL'],
      polo     : ['2XL','3XL','4XL','5XL','6XL','7XL'],
      shirt    : ['2XL','3XL','4XL','5XL','6XL','7XL'],
      tracksuit: ['2XL','3XL','4XL','5XL','6XL','7XL'],
      jeans    : ['38','40','42','44','46','48'],  // مقاسات خصر
    };
    function getSizes(p){ return SIZES_BY_CAT[p.category] || SIZES_BY_CAT.tshirt; }

**جدول أوزان البنطرون:**

| المقاس | الوزن      |
| ------ | ---------- |
| 38     | 75–85 كغ   |
| 40     | 85–95 كغ   |
| 42     | 95–110 كغ  |
| 44     | 110–125 كغ |
| 46     | 125–140 كغ |
| 48     | 140–155 كغ |

**جدول أوزان XL:**

| المقاس | الوزن      |
| ------ | ---------- |
| 2XL    | 95–105 كغ  |
| 3XL    | 105–115 كغ |
| 4XL    | 115–125 كغ |
| 5XL    | 125–140 كغ |
| 6XL    | 140–155 كغ |
| 7XL    | 155–175 كغ |

### 6.5 الفئات (CATEGORIES)

    const CATEGORIES = [
      { key:'tshirt',    icon:'T',  label:{ar:'تي شيرت',  en:'T-Shirt',  ku:'تی شێرت'} },
      { key:'polo',      icon:'P',  label:{ar:'بولو',      en:'Polo',     ku:'پۆلۆ'} },
      { key:'tracksuit', icon:'TR', label:{ar:'تراكسوت',   en:'Tracksuit',ku:'تراکسوت'} },
      { key:'jeans',     icon:'J',  label:{ar:'بنطرون',    en:'Jeans',    ku:'جینز'} },
      { key:'shirt',     icon:'S',  label:{ar:'قميص',      en:'Shirt',    ku:'کراس'} },
    ];

### 6.6 State

    let state = {
      lang   : 'ar',
      cart   : [],        // {pid, brand, sub, sku, img, color, size, qty, price}
      filter : { brand:'all', color:'all' },
      catPage: {},        // { tshirt:0, polo:0, ... } — pagination مستقل لكل فئة
      coupon : null
    };

### 6.7 PRODUCTS_META الحالية

    const TOTAL_PRODUCTS = 29;
    
    // التي شيرت: 1–26 (imagestshirts/{globalNum}-{seq}-{imgKey}.jpg)
    // مثال: 1: { sku:'GC-01', imgKey:'gucci-logo', brand:'GUCCI', sub:'Logo Print', colors:[C.BLK,C.WHT] }
    
    // المنتجات الأخرى:
    27: { sku:'PP-27', imgKey:'polo-plus',       brand:'POLO PLUS', sub:'Classic Fit',
          colors:[C.BLK,C.WHT,C.RBL], category:'polo',      catSeq:'01', added:'2026-04-17' },
    
    28: { sku:'TZ-28', imgKey:'tranzet-slimfit', brand:'TRANZET',   sub:'Slim Fit',
          colors:[C.BLK,C.DNV],        category:'jeans',     catSeq:'01', added:'2026-04-17' },
    
    29: { sku:'HE-29', imgKey:'hermes-ss',       brand:'HERMÈS',    sub:'Sport',
          colors:[C.BLK,C.WHT,C.BRN], category:'tracksuit', catSeq:'01', added:'2026-04-17' },

**المنتج القادم → رقم 30**

* * *

7. قواعد تسمية الصور

--------------------

### تي شيرت (`imagestshirts/`)

    {رقم-عالمي}-{رقم-صورة}-{imgKey}.jpg
    مثال: 27-1-gucci-logo.jpg

### باقي الفئات

    {catSeq}-{رقم-صورة}-{imgKey}.jpg
    مثال: 02-1-ralph-lauren.jpg   (catSeq = '02')

> catSeq مستقل لكل مجلد ولا علاقة له بالرقم العالمي للمنتج

* * *

8. كيفية إضافة منتج جديد

------------------------

**الخطوات الثلاث:**
    1. ارفع الصورة بالاسم الصحيح في المجلد الصحيح
             ↓
    2. غيّر TOTAL_PRODUCTS في index.html
             ↓
    3. أضف سطراً في PRODUCTS_META

**مثال — بولو جديد (TOTAL_PRODUCTS = 30):**
    // الصورة: imagespolo/02-1-brand-name.jpg
    30: { sku:'XX-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Collection',
          colors:[C.BLK, C.WHT],
          category:'polo',
          catSeq:'02',
          added:'2026-04-19' },

**مثال — قميص (أول قميص — catSeq:'01'):**
    // الصورة: imagesshirts/01-1-brand-name.jpg
    30: { sku:'SH-30', imgKey:'brand-name', brand:'BRAND NAME', sub:'Slim Fit',
          colors:[C.BLK, C.WHT],
          category:'shirt',
          catSeq:'01',
          added:'2026-04-19' },

* * *

9. الميزات المطبّقة حالياً

--------------------------

### 9.1 واجهة المتجر

* عرض المنتجات بفئات مستقلة (تي شيرت / بولو / تراكسوت / بنطرون / قمصان)
* pagination مستقل لكل فئة (12 منتج/صفحة — `CAT_PAGE_SIZE = 12`)
* فلترة بالماركة واللون
* slider للصور مع swipe وdrag support
* skeleton loading عند التحميل

### 9.2 السلة والطلب

* سلة تسوق كاملة مع تغيير الكميات
* حساب إجمالي بأسعار كل فئة على حدة
* خصم كمية: 5,000 دينار/قطعة عند 10+ قطع
* شحن مجاني عند 10+ قطع
* Coupon system (percent أو fixed)
* إتمام الطلب عبر واتساب

### 9.3 Bulk Bar محسَّن

* شريط تقدم يتحول للأحمر عند الاكتمال
* 10 دوائر صغيرة تتلوّن مع كل قطعة تُضاف
* رسائل تحفيزية بالثلاث لغات

### 9.4 شاشة التحميل

* SIZEME فقط مع animation نبض (تلوّن وتوهج متكرر)
* تختفي بـ fade بعد 0.95 ثانية من تحميل الصفحة

### 9.5 Product Modal

* الضغط على صورة المنتج يفتح modal كامل
* صورة كبيرة + اختيار اللون والمقاس + إضافة للسلة
* على الجوال: يصعد من الأسفل (sheet)
* على الحاسوب: يظهر مركزياً
* **مهم:** يستخدم `.is-open` class للفتح/الإغلاق (لا `.hidden`)

### 9.6 حاسبة المقاس

* زر "احسب مقاسك" بجانب عنوان كل قسم (XL categories فقط)
* الزبون يدخل وزنه → يحصل على مقاسه لكل الفئات تلقائياً
* **مهم:** يستخدم `.is-open` class (نفس المشكلة السابقة مع CSS specificity)

### 9.7 قسم "وصل حديثاً"

* منتجات أُضيفت خلال آخر 15 يوماً (`NEW_ARRIVALS_DAYS = 15`)
* يظهر تلقائياً في أعلى المتجر
* تمرير أفقي على الجوال (horizontal scroll)

### 9.8 ميزات أخرى

* Toast notification عند الإضافة للسلة
* WhatsApp floating button (جوال فقط)
* Mobile cart bar ثابت في الأسفل
* Scroll-reveal animations
* Language switcher (AR/EN/KU) مع إعادة تحميل عند تغيير الاتجاه
* Customer reviews slider
* Suggestion form عبر واتساب

* * *

10. Bug معروف وتم حله — CSS Specificity

---------------------------------------

**المشكلة:** المودالات (Product Modal + Size Calculator) كانت تظهر تلقائياً لأن:
    /* CSS ID selector = specificity 1,0,0 */
    #productModal { display: flex; }   /* يتغلب على */
    /* Tailwind class = specificity 0,1,0 */
    .hidden { display: none; }         /* لا يعمل! */

**الحل المطبق:**
    #productModal { display: none; }        /* مخفي افتراضياً */
    #productModal.is-open { display: flex;} /* يظهر بـ .is-open فقط */


    // فتح:
    modal.classList.add('is-open');
    // إغلاق:
    modal.classList.remove('is-open');

* * *

11. بنية اللغات (I18N)

----------------------

3 لغات: `ar` (RTL)، `en` (LTR)، `ku` (RTL)

**المفاتيح الرئيسية:**
    I18N.ar = {
      dir:'rtl',
      shopNote:'تيشيرت 35K · بنطرون 30K · قميص 25K · تراكسوت 70K دينار',
      trust1:'سعر حسب الفئة',
      addBag:'أضف إلى السلة',
      selectSize:'اختر المقاس', selectColor:'اختر اللون',
      wg:{ '2XL':'95–105 كغ', ... },
      wgJeans:{ '38':'75–85 كغ', ... },
      bulkProgressFn:(n)=> n>=10 ? '🎉 سعر 30,000 للقطعة + شحن مجاني مفعّل!' : `أضف ${10-n} قطعة...`,
      sizeCalcBtn:'احسب مقاسك',
      // ... إلخ
    }

**تطبيق اللغة:**
    function applyLang(lang){ ... }
    // تغيير AR↔KU: بدون reload (نفس الاتجاه RTL)
    // تغيير AR↔EN: reload مرة واحدة (تغيير الاتجاه RTL↔LTR)

* * *

12. Viewport والـ Mobile Fixes

------------------------------

    <meta name="viewport" content="width=device-width, initial-scale=1.0,
      maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    
    
    /* منع iOS zoom على inputs */
    input, select, textarea { font-size: max(16px, 1rem) !important; }
    
    /* منع double-tap zoom */
    * { touch-action: manipulation; }
    
    /* منع Safari scroll bounce على drawers */
    .drawer { overscroll-behavior: contain; }
    
    /* Safari compositing للـ header */
    header { transform: translateZ(0); }

* * *

13. دالة imgPath

----------------

    function imgPath(p, seq){
      const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
      const pfx    = p.catSeq || p.prefix;
      return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
    }

**لاحظ:** التي شيرت تستخدم `p.prefix` (= الرقم العالمي مثل "27"), باقي الفئات تستخدم `p.catSeq` (= "01", "02"...).

* * *

14. نظام الصور في بطاقة المنتج

------------------------------

    <!-- الحل الصحيح: watermark ظاهر افتراضياً، يختفي عند تحميل الصورة -->
    <img src="..." style="opacity:0;transition:opacity .25s"
         onload="this.style.opacity='1';this.nextElementSibling.style.display='none';"
         onerror="this.style.display='none';" />
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#f2ece2]">
      <div class="brand-watermark">${p.brand}</div>
      <div class="brand-sub">${p.sub}</div>
    </div>

**السبب:** `onerror` لا يُطلق دائماً على متصفحات الجوال → الـ watermark افتراضي أكثر موثوقية.

* * *

15. Coupon System

-----------------

    const COUPONS = [
      { code:'welcome',    type:'percent', value:15,   expires:'2026-12-31' },
      { code:'SIZEME2026', type:'percent', value:5,    expires:'2026-12-31' },
      { code:'VIP15',      type:'percent', value:10,   expires:'2026-09-30' },
      { code:'WELCOME',    type:'fixed',   value:5000, expires:null },
    ];

* * *

16. دالة computeTotals

----------------------

    function computeTotals(){
      const qty          = totalQty();
      const sub          = state.cart.reduce((s,i)=>s + (i.price||UNIT_PRICE)*i.qty, 0);
      const bulk         = qty >= BULK_THRESHOLD;  // 10+
      const bulkDiscount = bulk ? qty * BULK_DISC_PER_PCS : 0;  // 5,000 × عدد القطع
      // + coupon discount
      const shipping     = qty===0 ? 0 : (bulk ? 0 : SHIPPING);  // 5,000 أو مجاني
      const total        = sub - discount + shipping;
      return { qty, sub, bulk, bulkDiscount, couponDiscount, discount, shipping, total };
    }

* * *

17. README ملفات الصور

----------------------

كل مجلد صور يحتوي على README.md يشرح:

* صيغة تسمية الملفات
* المنتجات الحالية في المجلد
* جدول catSeq للمنتجات القادمة

| المجلد             | README                                |
| ------------------ | ------------------------------------- |
| `imagestshirts/`   | يشرح `{globalNum}-{seq}-{imgKey}.jpg` |
| `imagespolo/`      | يشرح `{catSeq}-{seq}-{imgKey}.jpg`    |
| `imagesjeans/`     | يشرح مقاسات الخصر + catSeq            |
| `imagestracksuit/` | يشرح catSeq + جدول التراكسوت          |
| `imagesshirts/`    | فارغ جاهز — catSeq:'01' للأول         |

* * *

18. PRODUCTS_GUIDE.md

---------------------

ملف `E:\sizeme\PRODUCTS_GUIDE.md` يحتوي:

* هيكل المجلدات الكامل
* قاعدة تسمية الصور
* الخطوات الثلاث لإضافة منتج
* نموذج كامل لكل فئة
* رموز الألوان
* حالة TOTAL_PRODUCTS الحالية
* أخطاء شائعة وكيف تتجنبها

* * *

19. أوامر git المستخدمة

-----------------------

    # رفع التعديلات (الأمر الأساسي)
    cd /d E:\sizeme && git add -A && git commit -m "تعديل: [وصف]" && git push
    
    # ملاحظة: cd /d يضمن التشغيل من المجلد الصحيح في Windows

* * *

20. أشياء مهمة لا تنساها

------------------------

1. **مسار المشروع** `E:\sizeme\` (هارد خارجي — ليس D:)
2. **CSS Specificity** — المودالات تستخدم `.is-open` لا `.hidden`
3. **catSeq** مستقل لكل مجلد — لا يتعلق بالرقم العالمي
4. **jeans** = مقاسات خصر (38-48) لا XL
5. **getPrice(p)** = السعر حسب الفئة لا UNIT_PRICE الثابت
6. **cart items** يجب أن يحتوي على `price:getPrice(p)` عند الإضافة
7. **computeTotals** يجمع `i.price * i.qty` لكل منتج على حدة
8. **اللغة** تُحفظ في localStorage وتُطبَّق في `<head>` مباشرةً لمنع flash
9. **BFCache Safari** معالج بـ `pageshow` event
10. **الصور** — watermark ظاهر افتراضياً، يختفي بـ `onload`
11. التأكد دائما ان التصميم يعمل على متصفح الهاتف

* * *

21. الميزات المقترحة لم تُنفَّذ بعد

-----------------------------------

* زر واتساب عائم (CSS موجود — `#waFloat`) ✅ موجود
* عداد الطلبات ("تم بيع +1,200 قطعة")
* "Complete the Look" cross-selling
* Recently viewed products
* Stock availability indicator

* * *

22. حالة catSeq الحالية

-----------------------

| المجلد             | catSeq الحالية | المنتج القادم |
| ------------------ | -------------- | ------------- |
| `imagespolo/`      | 01             | 02            |
| `imagesjeans/`     | 01             | 02            |
| `imagestracksuit/` | 01             | 02            |
| `imagesshirts/`    | — (فارغ)       | 01            |

* * *

_آخر تعديل: 2026-04-19 — جلسة Cowork مع حميد_
