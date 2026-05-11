# 📁 FILE_GUIDE — دليل ملفات مشروع SizeMe

> **الغرض من هذا الملف:** مرجع تقني شامل يشرح كل ملف وكل مجلد في المشروع بأسلوب بسيط، بحيث تعرف دائماً "وين أروح لو أردت تعديل كذا؟"

---

## 🗂️ الهيكل العام

```
E:\sizeme\
├── FILE_GUIDE.md              ← هذا الملف
├── CLAUDE.md                  ← تعليمات المشروع الرئيسية لـ Claude
├── index.html                 ← الموقع القديم (لا تلمسه)
├── orders-script.gs           ← سكريبت Google القديم (لا تلمسه)
└── platform\                  ← ✅ المشروع الجديد (Next.js 14)
    ├── app\                   ← صفحات الموقع ولوحة الأدمن
    ├── components\            ← المكونات القابلة للاستخدام
    ├── context\               ← إدارة الحالة (السلة)
    ├── lib\                   ← البيانات والأدوات والأنواع
    ├── public\                ← ملفات ثابتة (أيقونات، صور ثابتة)
    ├── package.json           ← المكتبات المستخدمة
    ├── tailwind.config.ts     ← إعدادات Tailwind
    ├── tsconfig.json          ← إعدادات TypeScript
    └── .env.local             ← ⚠️ المفاتيح السرية (لا ترفعه لـ GitHub)
```

---

## 📄 ملفات الجذر المهمة

| الملف | الوظيفة |
|-------|---------|
| `.env.local` | المفاتيح السرية: Supabase URL + Service Role + RESEND_API_KEY + ADMIN_PASSWORD |
| `package.json` | قائمة المكتبات المثبّتة وأوامر التشغيل (`npm run dev`) |
| `tailwind.config.ts` | إعدادات Tailwind (الألوان، الفونتات، الـ breakpoints) |

---

## 📁 app\ — صفحات الموقع

### الملفات الجذرية في app\

| الملف | الوظيفة |
|-------|---------|
| `layout.tsx` | الـ Root Layout — يُحمّل الفونتات، يلفّ كل شيء بـ CartProvider + ClientShell |
| `globals.css` | كل CSS variables (--ink, --paper, --accent…) + Dark mode + Animations |
| `page.tsx` | **الصفحة الرئيسية** — يجلب المنتجات والأقسام وعنوان الفيديو من Supabase |
| `actions.ts` | **Server Action** لإرسال طلب جديد (`submitOrder`) — يحفظ في Supabase ويرسل إيميل تنبيه |

---

### 📁 app\api\

| المسار | الوظيفة |
|--------|---------|
| `api/search-products/route.ts` | API endpoint يرجع قائمة المنتجات الخفيفة للبحث (Fuse.js) — يُخزَّن في كاش 5 دقائق |

---

### 📁 app\admin\ — لوحة الأدمن

> كل صفحات الأدمن محمية بـ auth. الدخول عبر `/admin/login`.

| المسار | الوظيفة |
|--------|---------|
| `admin/layout.tsx` | Layout الأدمن — الـ Sidebar بالروابط + زر تسجيل الخروج |
| `admin/page.tsx` | **Dashboard** — إحصائيات سريعة (طلبات، منتجات، إيرادات اليوم) |
| `admin/actions.ts` | Server Actions للأدمن: `setOrderStatus`, `createProduct`, `updateProduct`, `deleteProduct` |
| `admin/login/page.tsx` | صفحة تسجيل الدخول |
| `admin/login/actions.ts` | Server Action للتحقق من كلمة السر وإنشاء الـ session |

**إدارة الطلبات:**
| المسار | الوظيفة |
|--------|---------|
| `admin/orders/page.tsx` | صفحة الطلبات — فلترة حسب الحالة + pagination |
| `admin/orders/OrderRow.tsx` | صف الطلب القابل للتوسيع — تعديل بيانات الزبون + المنتجات inline |
| `admin/orders/StatusSelect.tsx` | قائمة تغيير حالة الطلب (new/confirmed/shipped/delivered/cancelled) |

**إدارة المنتجات:**
| المسار | الوظيفة |
|--------|---------|
| `admin/products/page.tsx` | جدول المنتجات الكامل |
| `admin/products/ProductsTable.tsx` | مكوّن الجدول مع إمكانية التعديل والحذف |
| `admin/products/ProductStatusSelect.tsx` | تغيير حالة المنتج (active/best-seller/new/hidden) |

**الإحصائيات:**
| المسار | الوظيفة |
|--------|---------|
| `admin/analytics/page.tsx` | صفحة الإحصائيات — تجلب البيانات وتمررها للـ Client Component |
| `admin/analytics/AnalyticsCharts.tsx` | الرسوم البيانية (Recharts): مبيعات يومية، توزيع الحالات، أكثر الألوان طلباً، top buyers |

**قسم الإدارة:**
| المسار | الوظيفة |
|--------|---------|
| `admin/management/coupons/` | إدارة كوبونات الخصم — إضافة/تعديل/حذف/تفعيل |
| `admin/management/newsletter/` | عرض المشتركين في النشرة البريدية + حذف |
| `admin/management/ratings/` | عرض تقييمات الزبائن (للاطلاع فقط) |
| `admin/management/suggestions/` | عرض اقتراحات المنتجات + حذف |
| `admin/management/settings/` | **إعدادات المتجر** — تعديل قيم مثل `hero_video_url`, `notify_emails` |

---

### 📁 app\category\, product\, reviews\, size-guide\, legal\

| المسار | الوظيفة |
|--------|---------|
| `category/[slug]/page.tsx` | صفحة القسم — يعرض المنتجات مع pagination (18 منتج/صفحة) |
| `product/[id]/page.tsx` | صفحة المنتج التفصيلية — الصور، الألوان، المقاسات، إضافة للسلة |
| `reviews/page.tsx` | صفحة آراء الزبائن |
| `size-guide/page.tsx` | دليل المقاسات |
| `legal/[slug]/page.tsx` | الصفحات القانونية: `warning` / `terms` / `privacy` / `exchange` / `faq` |

---

## 📁 components\ — المكونات

### مكونات الهيكل الأساسي

| الملف | الوظيفة |
|-------|---------|
| `Header.tsx` | الـ Header الثابت — Glass effect + Dark mode + Hamburger + زر البحث + السلة |
| `Footer.tsx` | الفوتر — اختيار اللغة + أعمدة الروابط + النشرة البريدية + تقييم emoji |
| `ClientShell.tsx` | Wrapper يخفي Header/Footer/Cart/WhatsApp عن صفحات `/admin` باستخدام `usePathname()` |
| `SplashLoader.tsx` | شاشة البداية (Logo animation) تظهر مرة واحدة |
| `AnnouncementBar.tsx` | شريط الإعلانات المتحرك في أعلى الصفحة |

### مكونات التسوق

| الملف | الوظيفة |
|-------|---------|
| `CartDrawer.tsx` | سلة التسوق (slide-in من اليسار) — عرض المنتجات + checkout form + شاشة النجاح |
| `CartButton.tsx` | زر "أضف للسلة" في صفحة المنتج |
| `AddToCartSection.tsx` | قسم الإضافة للسلة — اختيار اللون والمقاس + زر الإضافة |
| `ProductCard.tsx` | بطاقة المنتج — صور متعددة، ألوان، hover effects |

### مكونات البحث والفلتر

| الملف | الوظيفة |
|-------|---------|
| `SearchOverlay.tsx` | **Overlay البحث** — Fuse.js للبحث الفوري، يجلب المنتجات من `/api/search-products` |
| `FilterBar.tsx` | شريط الفلتر (مبني لكن موقوف مؤقتاً) |
| `FilterDrawer.tsx` | Drawer الفلتر من الأسفل (مبني لكن موقوف مؤقتاً) |
| `FilteredCatalog.tsx` | الكتالوج الرئيسي للصفحة الرئيسية |
| `CategoryFilteredGrid.tsx` | شبكة منتجات صفحة القسم |

### مكونات متفرقة

| الملف | الوظيفة |
|-------|---------|
| `WhatsAppFloat.tsx` | زر WhatsApp العائم في زاوية الشاشة |
| `SuggestionModal.tsx` | نافذة اقتراح منتج — تحفظ في جدول `suggestions` |
| `ScrollRevealInit.tsx` | يُفعّل animations الـ scroll reveal |

### 📁 components\home\ — مكونات الصفحة الرئيسية

| الملف | الوظيفة |
|-------|---------|
| `HeroSection.tsx` | قسم الـ Hero — النص + **فيديو رؤيتنا** (يسحب رابطه من `hero_video_url` في الإعدادات) |
| `TrustStrip.tsx` | شريط مزايا المتجر (توصيل، ضمان، جودة…) |
| `DeliveryCountdown.tsx` | عداد تجهيز الطلب بتوقيت العراق (UTC+3) |
| `CategoryPreview.tsx` | معاينة قسم مع رابط "عرض الكل" |
| `GuaranteeSection.tsx` | قسم ضمان الجودة (خلفية داكنة) |
| `RatingsSection.tsx` | عرض تقييمات الزبائن |
| `ContactSection.tsx` | قسم التواصل مع الأيقونات |

---

## 📁 lib\ — البيانات والأدوات

### ملفات أساسية

| الملف | الوظيفة |
|-------|---------|
| `supabase.ts` | إنشاء client الـ Supabase — `supabase` للمتجر (anon key) و`createAdminClient()` للأدمن (service role) |
| `types.ts` | جميع أنواع TypeScript: `Product`, `Order`, `OrderItem`, `Category`, `Coupon`, `CartItem`… |
| `utils.ts` | دوال مساعدة: `fmt()` لتنسيق المبالغ، `imgPath()` لمسار الصور، `generateOrderId()`, `COLOR_HEX`, `COLOR_NAMES_AR` |
| `api.ts` | دوال جلب البيانات للمتجر (public): `getProducts()`, `getCategories()`, `getProductsPaged()`, `getSetting()` |
| `admin-api.ts` | دوال جلب البيانات للأدمن (service role): `getAdminOrders()`, `getAnalyticsData()`, `getCoupons()`, `getSettings()`… |
| `email.ts` | نظام الإيميلات عبر Resend — `sendOrderNotification()` يُرسل تفاصيل الطلب لـ `notify_emails` |

### 📁 lib\actions\ — Server Actions

> Server Actions = دوال تُنفَّذ على السيرفر وتُستدعى من الـ Client Components مباشرة

| الملف | الوظيفة |
|-------|---------|
| `actions/newsletter.ts` | `subscribeNewsletter()` — يضيف مشترك جديد في النشرة البريدية |
| `actions/ratings.ts` | `submitRating()` — يحفظ تقييم emoji في جدول `ratings` |
| `actions/suggestions.ts` | `submitSuggestion()` — يحفظ اقتراح منتج في جدول `suggestions` |
| `actions/admin-management.ts` | كل عمليات الأدمن: Coupons CRUD + تعديل الطلبات + حذف المشتركين + الإعدادات |

---

## 📁 context\ — إدارة الحالة

| الملف | الوظيفة |
|-------|---------|
| `context/CartContext.tsx` | إدارة سلة التسوق بـ `useState` — يحسب الأسعار والخصومات والتوصيل تلقائياً |

---

## 🗄️ جداول Supabase

| الجدول | البيانات |
|--------|---------|
| `products` | المنتجات (brand, colors[], sizes[], img_key, category_id, status, sort_order) |
| `categories` | الأقسام (tshirt, polo, shirt, jeans, tracksuit) مع الأسعار والمقاسات |
| `orders` | الطلبات (order_id, name, phone, province, status, total, coupon_code…) |
| `order_items` | منتجات كل طلب (brand, color, size, qty, unit_price, line_total) |
| `coupons` | كوبونات الخصم (code, type, value, expires_at, is_active) |
| `settings` | إعدادات المتجر (key → value): `hero_video_url`, `notify_emails`… |
| `newsletter_subscribers` | المشتركون في النشرة البريدية |
| `ratings` | تقييمات الزبائن (emoji + score) |
| `suggestions` | اقتراحات المنتجات من الزبائن |

---

## 🔑 متغيرات البيئة (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL          ← رابط مشروع Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← مفتاح القراءة العامة
SUPABASE_SERVICE_ROLE_KEY         ← مفتاح الأدمن الكامل (server-side فقط)
ADMIN_PASSWORD                    ← كلمة سر لوحة الأدمن
ADMIN_SECRET                      ← مفتاح تشفير الـ session
RESEND_API_KEY                    ← مفتاح Resend لإرسال إيميلات الطلبات
RESEND_FROM_EMAIL                 ← الإيميل المُرسِل
NEXT_PUBLIC_SITE_URL              ← رابط الموقع (للرابط في الإيميل)
```

---

## 🧭 دليل "وين أروح لو أردت تعديل..."

| التعديل | الملف |
|---------|-------|
| تغيير فيديو الـ Hero | `Admin → الإعدادات → hero_video_url` |
| تغيير إيميلات الإشعارات | `Admin → الإعدادات → notify_emails` |
| تعديل نص الصفحة الرئيسية | `components/home/HeroSection.tsx` |
| إضافة قسم جديد | `supabase → categories` + `components/home/CategoryPreview.tsx` |
| تعديل الألوان المدعومة | `lib/utils.ts` → `COLOR_HEX` و `COLOR_NAMES_AR` |
| تغيير أسعار التوصيل والخصومات | `context/CartContext.tsx` |
| تعديل رسالة الواتساب | `app/actions.ts` → `submitOrder()` |
| تعديل تصميم إيميل الطلب | `lib/email.ts` → `buildEmailHtml()` |
| إضافة إعداد جديد للمتجر | `supabase → settings` (INSERT) ثم `app/admin/management/settings/SettingsClient.tsx` |
| تعديل شريط الإعلانات | `components/AnnouncementBar.tsx` |
| تعديل CSS variables (ألوان الموقع) | `app/globals.css` |
| تعديل منطق البحث | `components/SearchOverlay.tsx` + `app/api/search-products/route.ts` |
| تعديل صفحة قانونية | `app/legal/[slug]/page.tsx` |

---

## ⚠️ ملفات لا تُلمس

```
E:\sizeme\index.html              ← الموقع القديم
E:\sizeme\orders-script.gs        ← سكريبت Google القديم
E:\sizeme\platform\.env.local     ← لا تُرفع لـ GitHub أبداً
E:\sizeme\platform\scripts\       ← سكريبتات رفع الصور (تعمل محلياً فقط)
```

---

*آخر تحديث: مايو 2026*
