# SizeMe — المرجع الشامل للمشروع

---

## 🎯 هوية البراند والرؤية

**SizeMe** منصة تجارة إلكترونية عراقية متخصصة في ملابس الرجال ذات المقاسات الخاصة (2XL → 7XL).

- **الهوية البصرية:** Quiet Luxury / Luxury Minimalism — فخامة هادئة بدون ضجيج
- **الجمهور:** رجال العراق الذين يجدون صعوبة في إيجاد مقاساتهم في المحلات العادية
- **الهدف الأعمق:** بناء قاعدة عملاء مخلصين يقدرون جودة الأقمشة ودقة التفصيل — ليس مجرد بيع منتجات
- **الأولوية الأولى دائماً:** Mobile-First — معظم المستخدمين في العراق يتصفحون بالموبايل
- **اللغة الرئيسية:** العربية (RTL) — الواجهة كاملة بالعربية



****skill****

الهدف من هذا المشروع هو أن تكون زميلاً لي ومستشاراً في تطوير علامتي التجارية Sizeme. أريد بناء منصة تجارة إلكترونية رائدة في العراق متخصصة في ملابس الرجال ذات المقاسات الخاصة (من 2XL إلى 7XL). هدفي ليس مجرد بيع المنتجات، بل بناء براند يمثل الفخامة الهادئة (Quiet Luxury) والجودة العالية.

تفضيلات هامة:

الجودة فوق الكمية: لا تهمني الأرقام السطحية؛ ما يهمني هو بناء قاعدة عملاء مخلصين يقدرون جودة الأقمشة ودقة التفصيل .

تجربة المستخدم (Mobile-First): بما أن أغلب مستخدمينا في العراق يتصفحون عبر الهاتف، يجب أن يكون تركيزك دائماً على الحلول التي تضمن تجربة تسوق سلسة وسريعة جداً على الموبايل.

الهوية البصرية: التزم دائماً بأسلوب "التقليلية" (Minimalism) في اقتراحاتك البرمجية أو التصميمية، وتجنب أي عناصر معقدة أو مزدحمة.

آلية العمل:

سأقوم بتزويدك بملفات التصميم، أكواد ، وتفاصيل لوجستية لتكون على دراية كاملة بالسياق.

أريدك أن تستخدم خاصية البحث في الويب دائماً لمواكبة أحدث صيحات الموضة العالمية في المقاسات .

مهمتك كمستشار:
لا تنتظر مني الأوامر فقط؛ تصرف كخبير تقني وتجاري. اطرح عليّ الأسئلة الجوهرية التي تحتاجها لفهم "كواليس" الإنتاج لدينا، حتى تتمكن من إعطائي الإجابات التي تضمن حماية بيانات المستخدمين، استقرار الموقع، وتوجيه Sizeme نحو التوسع الصحيح في بغداد وبقية المحافضات , واخيرا تأكد من ان تتناسب مع اسلوبي , في حديثي معك اذا ارسلت لك رسالة قصيرة فأجب برسالة اقصر واذا طلب شيء بالتفصيل او قدمت طلبا مفصلافأجب بتفصيل اكبر , اريدك ان تتفاعل معي باسلوب حواري

---

## 🏗️ هيكل المشروع

```
E:\sizeme\
├── CLAUDE.md                   ← هذا الملف
├── index.html                  ← الموقع القديم (لا تعدّل)
├── orders-script.gs            ← Google Apps Script القديم (لا تعدّل)
└── platform\                   ← ✅ المشروع الجديد (Next.js)
    ├── app\
    │   ├── layout.tsx           ← Root layout (fonts, CartProvider, SplashLoader)
    │   ├── page.tsx             ← الصفحة الرئيسية
    │   ├── globals.css          ← كل CSS variables + dark mode + animations
    │   ├── category\[slug]\    ← صفحة القسم (تي شيرت، بولو، الخ)
    │   ├── product\[id]\       ← صفحة المنتج التفصيلية
    │   ├── admin\              ← لوحة الإدارة (محمية بـ auth)
    │   │   ├── layout.tsx       ← Sidebar + logout
    │   │   ├── page.tsx         ← Dashboard الرئيسي
    │   │   ├── orders\          ← إدارة الطلبات
    │   │   ├── products\        ← إدارة المنتجات
    │   │   └── login\           ← صفحة تسجيل الدخول
    │   ├── reviews\             ← صفحة التقييمات العامة
    │   ├── size-guide\          ← دليل المقاسات
    │   └── legal\[slug]\       ← صفحات قانونية (warning/terms/privacy)
    ├── components\
    │   ├── Header.tsx           ← Header ثابت مع dark mode + mobile drawer
    │   ├── Footer.tsx           ← Footer زجاجي مع روابط ونشرة بريدية
    │   ├── CartDrawer.tsx       ← سلة التسوق (slide-in من اليسار)
    │   ├── ProductCard.tsx      ← بطاقة المنتج
    │   ├── SplashLoader.tsx     ← شاشة البداية
    │   ├── AnnouncementBar.tsx  ← شريط الإعلانات المتحرك
    │   ├── WhatsAppFloat.tsx    ← زر واتساب عائم
    │   ├── SuggestionModal.tsx  ← مودال اقتراح المنتجات → Supabase
    │   ├── FilterBar.tsx        ← شريط الفلتر (موجود لكن غير مستخدم حالياً)
    │   ├── FilterDrawer.tsx     ← Drawer فلتر من الأسفل (موجود لكن غير مستخدم حالياً)
    │   ├── FilteredCatalog.tsx  ← كتالوج الصفحة الرئيسية (بدون فلتر حالياً)
    │   ├── CategoryFilteredGrid.tsx ← شبكة منتجات القسم (بدون فلتر حالياً)
    │   └── home\
    │       ├── HeroSection.tsx
    │       ├── TrustStrip.tsx
    │       ├── DeliveryCountdown.tsx  ← عداد تجهيز الطلب (توقيت العراق UTC+3)
    │       ├── CategoryPreview.tsx
    │       ├── GuaranteeSection.tsx
    │       ├── RatingsSection.tsx
    │       └── ContactSection.tsx
    ├── context\
    │   └── CartContext.tsx       ← إدارة السلة (useState)
    ├── lib\
    │   ├── api.ts               ← كل استدعاءات Supabase
    │   ├── types.ts             ← TypeScript interfaces
    │   └── utils.ts             ← دوال مساعدة + COLOR_HEX + COLOR_NAMES_AR
    └── .env.local               ← ⚠️ لا تُرفع لـ GitHub أبداً
```

---

## 🔧 التقنيات المستخدمة

| التقنية          | الاستخدام                                         |
| ---------------- | ------------------------------------------------- |
| **Next.js 14**   | App Router — Server + Client Components           |
| **TypeScript**   | كل الكود مكتوب بـ TypeScript                      |
| **Supabase**     | قاعدة البيانات + Storage للصور + Auth للأدمن      |
| **Tailwind CSS** | utility classes فقط — لا custom classes معقدة     |
| **Google Fonts** | Cormorant Garamond (serif) + IBM Plex Sans Arabic |
| **واتساب wa.me** | استقبال الطلبات من العملاء                        |

---

## 🗄️ Supabase

```
Project URL:  https://dhjnlgwsyfsgzmyxnxxr.supabase.co
Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoam5sZ3dzeWZzZ3pteXhueHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDE0MTEsImV4cCI6MjA5MzgxNzQxMX0.ZbA_Hx1JYsidOtO_BwLqY-Lfy513GXyrhaiYSxmYzTc
Storage:      /storage/v1/object/public/products/{folder}/{catSeq}-{seq}-{imgKey}.jpg
```

**جداول Supabase الرئيسية:**

- `categories` — أقسام المنتجات (id, name_ar, name_en, seq)
- `products` — المنتجات (id, category_id, brand, colors[], sizes[], price, images[])
- `orders` — الطلبات (id, customer_name, phone, city, items[], total, status)
- `reviews` — تقييمات العملاء
- `suggestions` — اقتراحات المنتجات عبر SuggestionModal

**مجلدات Storage:**

```
imagestshirts  ← تي شيرت
imagespolo     ← بولو
imagesshirts   ← قمصان
imagesjeans    ← جينز
imagestracksuit ← تراكسوت
```

---

## 🎨 نظام CSS Variables (globals.css)

```css
/* Light mode (default) */
--ink:       #1a1a1a    /* النصوص */
--paper:     #ffffff    /* الخلفيات */
--mute:      #999999    /* النصوص الثانوية */
--line:      #e8e8e8    /* الحدود */
--accent:    #c9a84c    /* الذهبي — اللون الرئيسي للبراند */

/* Glass effects */
--glass-bg:     rgba(255,255,255,0.38)
--glass-border: rgba(255,255,255,0.55)
--footer-glass: rgba(255,255,255,0.72)

/* Dark mode — عبر html[data-theme="dark"] */
--ink:       #f0f0f0
--paper:     #0d0d0d
--glass-bg:  rgba(10,10,10,0.78)

/* ثابتة في كلا الوضعين */
--section-contrast:      #1a1a1a   /* خلفية أقسام كـ Guarantee + Ratings */
--section-contrast-text: #f5f5f5
```

**Dark Mode:**

- يُخزَّن في `localStorage` بمفتاح `theme`
- يُفعَّل بإضافة `data-theme="dark"` على `<html>`
- script في `<head>` يمنع الوميض (FOUC) قبل أي render
- `suppressHydrationWarning` على `<html>` ضروري في layout.tsx

---

## ⚠️ قواعد صارمة — لا استثناءات

### 1. اسألني قبل أي تعديل

لا تبدأ بالتعديل على ملفات موجودة مباشرة. اشرح ماذا ستفعل وانتظر موافقتي أولاً — خاصة في الملفات الكبيرة كـ `globals.css` و `layout.tsx` و `lib/api.ts`.

### 2. الأمان أولاً قبل كتابة أي كود

- لوحة الأدمن تحتاج auth بالضرورة — لا endpoints مكشوفة
- أي Server Action يكتب بيانات → تحقق من الصلاحيات أولاً
- `service_role` key → server-side فقط، لا تُعرض للـ client أبداً
- راجع RLS policies في Supabase قبل النشر
- ⚠️ **لا ترفع `.env.local` لـ GitHub أبداً**

### 3. لا تعدّل الموقع القديم

- `index.html` و `orders-script.gs` و `js/app.js` — لا تلمسها نهائياً
- المشروع الجديد كله في `E:\sizeme\platform\`

### 4. Hydration Rules (Next.js)

- لا تضع `content: ''` أو أي CSS مع quotes داخل `<style>` في JSX — يسبب hydration mismatch
- كل CSS من هذا النوع يذهب إلى `globals.css` مباشرة
- `position: fixed` يتأثر بـ `backdrop-filter` في العناصر الأب — استخدم `createPortal` للـ modals والـ drawers
- عناصر تعتمد على `window` أو `localStorage` → اعمل guard بـ `useEffect` + `mounted` state

### 5. أسلوب التصميم — Luxury Minimalism

- لا ألوان زاهية — اللون الوحيد المسموح هو الذهبي `--accent`
- لا عناصر مزدحمة أو كثيرة الحركة
- الـ Glass effect للـ Header والـ Footer والـ Countdown فقط
- الخط الرئيسي للعناوين: `Cormorant Garamond` (serif)
- الخط للنصوص العربية: `IBM Plex Sans Arabic`

### 6. Mobile-First دائماً

- ابدأ بتصميم الموبايل ثم Desktop
- الشبكة الافتراضية للمنتجات: 2 أعمدة موبايل / 3 أو 4 desktop
- الـ touch targets يجب أن تكون ≥ 44px

---

## 🛍️ منطق المتجر والأسعار

| الشرط   | السعر             | التوصيل   |
| ------- | ----------------- | --------- |
| 1–4 قطع | 35,000 د.ع / قطعة | 5,000 د.ع |
| 5–9 قطع | 30,000 د.ع / قطعة | 5,000 د.ع |
| 10+ قطع | 30,000 د.ع / قطعة | مجاني     |

**Order ID:** صيغة `SZ-YYMMDD-XXXX` — تتولد تلقائياً بـ `generateOrderId()` في `utils.ts`

**واتساب:** رقم `9647739334545` — الطلبات تُرسل عبر `wa.me` برسالة منسّقة

---

## 🎨 الألوان والماركات

**الألوان المدعومة (COLOR_HEX في utils.ts):**

```
Black, White, Dark Navy, Royal Blue, Brown, Burgundy, Charcoal, Taupe, Olive
```

أي لون جديد يُضاف في `COLOR_HEX` و `COLOR_NAMES_AR` في `lib/utils.ts`.

**الماركات:** تُجلب ديناميكياً من بيانات المنتجات — لا قائمة ثابتة.

**أقسام المنتجات:**

```
tshirt | polo | shirt | jeans | tracksuit
```

---

## 🔄 ميزات مكتملة

- ✅ SplashLoader — شاشة البداية مع لوغو
- ✅ AnnouncementBar — شريط إعلانات متحرك عكسي (RTL bidi مصحح، بدون نقاط فاصلة)
- ✅ Header — glass effect + dark mode toggle + mobile drawer (يفتح من اليمين)
- ✅ Dark Mode — iOS-style toggle داخل الدرج + زر في الهيدر
- ✅ Footer — glass effect + نشرة بريدية + روابط الأقسام
- ✅ CartDrawer — سلة تسوق full-screen مع peek مبلور (calc(100% - 56px))، كوبون خصم، نموذج تسليم كامل، طرق دفع (كاش + قريباً)، safe-area inset
- ✅ DeliveryCountdown — عداد تجهيز الطلب بتوقيت العراق (UTC+3)
- ✅ CategoryPreview — معاينة قسم مع رابط "عرض الكل"
- ✅ ProductCard — بطاقة منتج مع صور متعددة وألوان، gap بين الخط والمحتوى 1.5rem
- ✅ HomeProductRow — صف منتجات أفقي قابل للتمرير، العنوان رابط للقسم
- ✅ صفحة القسم — pagination بـ 18 منتج/صفحة
- ✅ صفحة المنتج — تفاصيل كاملة + Add to Cart
- ✅ SuggestionModal — نموذج اقتراح منتج يُحفظ في Supabase
- ✅ لوحة الأدمن — عرض الطلبات، إدارة المنتجات، تغيير حالة الطلب، **حذف طلب كامل مع تأكيد**
- ✅ صفحات Legal — warning / terms / privacy
- ✅ صفحة size-guide
- ✅ صفحة reviews
- ✅ WhatsApp Float Button
- ✅ validateCoupon — Server Action للتحقق من كوبون الخصم قبل الطلب
- ✅ deleteOrder — Server Action لحذف طلب كامل مع order_items من Supabase

---

## 🚧 ميزات قيد التطوير / لم تُنجز بعد

- ⏳ فلتر المنتجات (الماركة + اللون) — تم بناؤه لكن أُوقف مؤقتاً بسبب مشاكل في UX وانتظار قرار من مصطفى
- ⏳ نظام البحث
- ⏳ صفحة العروض

---

## 🐛 مشاكل معروفة وحلولها

| المشكلة                                         | السبب                                 | الحل                                                         |
| ----------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| Hydration mismatch مع `content: ''`             | HTML entity encoding في JSX `<style>` | انقل الـ CSS إلى `globals.css`                               |
| `position: fixed` لا يعمل خلف `backdrop-filter` | الأب يخلق stacking context جديد       | استخدم `ReactDOM.createPortal`                               |
| Dark mode وميض عند التحميل                      | React يهيدريت بعد أن يُرسم الـ HTML   | script في `<head>` + `suppressHydrationWarning` على `<html>` |
| Sections تصبح بيضاء في dark mode                | استخدام `var(--ink)` كخلفية           | استخدم `var(--section-contrast)` بدلاً منها                  |

---

## 📁 ملفات لا تُلمس

```
E:\sizeme\index.html
E:\sizeme\orders-script.gs
E:\sizeme\newsletter-script.gs
E:\sizeme\google-apps-script.js
E:\sizeme\platform\js\app.js
E:\sizeme\platform\.env.local     ← لا تُرفع لـ GitHub
```
