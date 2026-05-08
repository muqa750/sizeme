-- ============================================================
-- SizeMe — Supabase Database Schema
-- انسخ هذا الكود كاملاً في: Supabase → SQL Editor → New Query
-- ============================================================


-- ══════════════════════════════════════
-- 1. CATEGORIES — فئات المنتجات
-- ══════════════════════════════════════
create table public.categories (
  id          text primary key,          -- 'tshirt' | 'polo' | 'shirt' | 'jeans' | 'tracksuit'
  name_ar     text not null,
  name_en     text not null,
  name_ku     text not null,
  price       integer not null,          -- بالدينار العراقي
  sizes       text[] not null,           -- ['2XL','3XL','4XL','5XL','6XL','7XL']
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

insert into public.categories (id, name_ar, name_en, name_ku, price, sizes, sort_order) values
  ('tshirt',    'تي شيرت', 'T-Shirt',   'تی شێرت',   35000, array['2XL','3XL','4XL','5XL','6XL','7XL'], 1),
  ('polo',      'بولو',    'Polo',       'پۆلۆ',       35000, array['2XL','3XL','4XL','5XL','6XL','7XL'], 2),
  ('shirt',     'قميص',   'Shirt',      'کراس',       25000, array['2XL','3XL','4XL','5XL','6XL','7XL'], 3),
  ('tracksuit', 'تراكسوت', 'Tracksuit', 'تراکسوت',   70000, array['2XL','3XL','4XL','5XL','6XL','7XL'], 4),
  ('jeans',     'بنطرون', 'Jeans',      'جینز',       30000, array['38','40','42','44','46','48'],        5);


-- ══════════════════════════════════════
-- 2. PRODUCTS — المنتجات
-- ══════════════════════════════════════
create table public.products (
  id           serial primary key,
  sku          text unique not null,
  brand        text not null,
  sub          text,                      -- الوصف الفرعي (مثل: 'E33 Flag')
  category_id  text references public.categories(id),
  img_key      text not null,             -- مفتاح الصورة (مثل: 'lacoste-e33')
  cat_seq      text,                      -- رقم التسلسل داخل المجلد (مثل: '01')
  colors       text[],                    -- مصفوفة الألوان المتاحة
  status       text default 'active',     -- 'active' | 'best-seller' | 'new' | 'hidden'
  sort_order   integer default 0,
  added_at     date,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- المنتجات الحالية (35 منتج)
insert into public.products (id, sku, brand, sub, category_id, img_key, cat_seq, colors, status, sort_order, added_at) values
  (1,  'LA-01', 'LACOSTE',        'E33 Flag',      'tshirt',    'lacoste-e33',    '01', array['Black','White','Olive'],                        'best-seller', 1,  null),
  (2,  'PO-02', 'U.S. POLO ASSN', 'Polo Classic',  'tshirt',    'polo',           '02', array['Black','White','Royal Blue','Taupe'],            'best-seller', 2,  null),
  (3,  'GI-03', 'GIVENCHY',       'Paris',         'tshirt',    'givenchy',       '03', array['Black','White','Brown'],                        'active',      3,  null),
  (4,  'OW-04', 'OFF-WHITE',      'Hand Logo',     'tshirt',    'off-white',      '04', array['Black','White','Royal Blue'],                   'active',      4,  null),
  (5,  'HU-05', 'HUGO',           'Bold Logo',     'tshirt',    'hugo',           '05', array['Black','White','Dark Navy'],                    'active',      5,  null),
  (6,  'LA-06', 'LACOSTE',        '1927 Heritage', 'tshirt',    'lacoste-1927',   '06', array['Black','White'],                               'best-seller', 6,  null),
  (7,  'BA-07', 'BALMAIN',        'Paris',         'tshirt',    'balmain',        '07', array['Black','White','Olive','Burgundy'],             'active',      7,  null),
  (8,  'AL-08', 'ALO',            'basic',         'tshirt',    'alo',            '08', array['Black','Dark Navy','Charcoal','Brown'],         'active',      8,  null),
  (9,  'PR-09', 'PRADA',          'Milano',        'tshirt',    'prada',          '09', array['Black','White','Brown','Charcoal'],             'active',      9,  null),
  (10, 'BU-10', 'BURBERRY',       'Knight',        'tshirt',    'burberry',       '10', array['Black','White','Charcoal'],                    'active',      10, null),
  (11, 'TO-11', 'TOMMY JEANS',    'Graffiti',      'tshirt',    'tommy',          '11', array['Black','White','Charcoal'],                    'active',      11, null),
  (12, 'CK-12', 'CALVIN KLEIN',   'CK Monogram',   'tshirt',    'ck',             '12', array['Black','White'],                               'active',      12, null),
  (13, 'KI-13', 'KITON',          'Napoli',        'tshirt',    'kiton',          '13', array['Black','White'],                               'active',      13, null),
  (14, 'LO-14', 'LOEWE',          'Madrid 1846',   'tshirt',    'loewe',          '14', array['Black','White'],                               'active',      14, null),
  (15, 'LV-15', 'LOUIS VUITTON',  'Paris',         'tshirt',    'lv',             '15', array['Black','White','Taupe'],                       'best-seller', 15, null),
  (16, 'KI-16', 'KITON',          'Small Logo',    'tshirt',    'kiton-small',    '16', array['Black','White','Charcoal'],                    'active',      16, null),
  (17, 'CK-17', 'CALVIN KLEIN',   'Classic',       'tshirt',    'calvin-klein',   '17', array['Black','White','Olive','Brown'],               'active',      17, null),
  (18, 'BO-18', 'BOSS',           'sun logo',      'tshirt',    'boos',           '18', array['Black','White','Dark Navy'],                   'active',      18, null),
  (19, 'ES-19', 'ESSENTIALS',     'NBA',           'tshirt',    'essentials',     '19', array['Black','White','Taupe'],                       'active',      19, null),
  (20, 'PO-20', 'U.S. POLO ASSN', 'Assn horse',   'tshirt',    'u-s-polo',       '20', array['Black','White','Olive'],                       'active',      20, null),
  (21, 'HE-21', 'HERMÈS',         'horse Paris',   'tshirt',    'hermes',         '21', array['Black','White'],                               'best-seller', 21, null),
  (22, 'BA-22', 'BALENCIAGA',     'balenc shop',   'tshirt',    'balenciaga',     '22', array['Black','White','Royal Blue'],                  'active',      22, null),
  (23, 'SU-23', 'SUPREME',        'Earth Logo',    'tshirt',    'supreme',        '23', array['Black','White','Charcoal'],                    'active',      23, null),
  (24, 'HE-24', 'HERMÈS',         'Lines Logo',    'tshirt',    'hermes-h',       '24', array['Black','White'],                               'active',      24, null),
  (25, 'MA-25', 'MASSIMO DUTTI',  'since 1985',    'tshirt',    'massimo-dutti',  '25', array['Black','White','Brown','Charcoal'],            'active',      25, null),
  (26, 'LV-26', 'LOUIS VUITTON',  'umbrellas',     'tshirt',    'lv',             '26', array['Black','White','Royal Blue','Olive','Burgundy'],'new',        26, '2026-04-01'),
  (27, 'Po-27', 'POLO PLUS',      'Classic Fit',   'polo',      'polo-plus',      '01', array['Black','White','Royal Blue'],                  'new',         27, '2026-04-17'),
  (28, 'HE-28', 'HERMÈS',         'Sport',         'tracksuit', 'hermes-ss',      '01', array['Black','White','Brown'],                       'new',         28, '2026-04-17'),
  (29, 'BA-29', 'BALENCIAGA',     'PARIS',         'tshirt',    'balenciaga',     '27', array['Black','White','Charcoal'],                    'new',         29, '2026-04-23'),
  (30, 'SU-30', 'SUPREME',        'NASA USA',      'tshirt',    'supreme',        '28', array['Black','White'],                               'new',         30, '2026-04-23'),
  (31, 'LV-31', 'LOUIS VUITTON',  'cuneiform',     'tshirt',    'lv',             '29', array['Black','White','Taupe'],                       'new',         31, '2026-04-23'),
  (32, 'JJ-32', 'JACK & JONES',   'WORLD WIDE',    'tshirt',    'jackjones',      '30', array['Black','White'],                               'new',         32, '2026-04-23'),
  (33, 'BU-33', 'BURBERRY',       'Classic',       'shirt',     'burberry-new',   '01', array['Black','White'],                               'new',         33, '2026-04-17'),
  (34, 'CA-34', 'CARGO',          'Army Style',    'jeans',     'cargo-army',     '01', array['Olive','Taupe'],                               'new',         34, '2026-04-23'),
  (35, 'CA-35', 'CARGO',          'Army Black',    'jeans',     'cargo-army',     '02', array['Black','Charcoal'],                            'new',         35, '2026-04-23');

-- إعادة تعيين الـ sequence بعد الإدخال اليدوي
select setval('public.products_id_seq', 35);


-- ══════════════════════════════════════
-- 3. ORDERS — الطلبات
-- ══════════════════════════════════════
create table public.orders (
  id              serial primary key,
  order_id        text unique not null,  -- 'SZ-260508-A3X1'
  status          text default 'new',    -- 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  name            text not null,
  phone           text not null,
  province        text,
  area            text,
  address         text,
  notes           text,
  subtotal        integer not null,
  bulk_discount   integer default 0,
  coupon_code     text,
  coupon_discount integer default 0,
  shipping        integer default 5000,
  total           integer not null,
  payment_method  text default 'COD',
  lang            text default 'ar',
  created_at      timestamptz default now()
);


-- ══════════════════════════════════════
-- 4. ORDER_ITEMS — تفاصيل منتجات كل طلب
-- ══════════════════════════════════════
create table public.order_items (
  id          serial primary key,
  order_id    text references public.orders(order_id) on delete cascade,
  product_id  integer references public.products(id),
  sku         text,
  brand       text,
  sub         text,
  color       text,
  size        text,
  qty         integer not null default 1,
  unit_price  integer not null,
  line_total  integer not null
);


-- ══════════════════════════════════════
-- 5. COUPONS — كوبونات الخصم
-- ══════════════════════════════════════
create table public.coupons (
  id           serial primary key,
  code         text unique not null,
  type         text not null check (type in ('percent', 'fixed')),
  value        integer not null,         -- نسبة % أو مبلغ ثابت
  expires_at   date,                     -- null = بدون تاريخ انتهاء
  max_uses     integer,                  -- null = غير محدود
  used_count   integer default 0,
  is_active    boolean default true,
  created_at   timestamptz default now()
);

insert into public.coupons (code, type, value, expires_at, is_active) values
  ('welcome',      'percent', 10, '2026-12-31', true),
  ('SIZEME2026',   'percent',  5, '2026-12-31', true),
  ('VIP15',        'percent', 10, '2026-09-30', true),
  ('waleedsizeme', 'percent', 10, null,         true);


-- ══════════════════════════════════════
-- 6. SETTINGS — إعدادات المتجر
-- ══════════════════════════════════════
create table public.settings (
  key    text primary key,
  value  jsonb not null
);

insert into public.settings (key, value) values
  ('bulk_threshold',         '4'),
  ('shipping_free_threshold','10'),
  ('shipping_cost',          '5000'),
  ('whatsapp_number',        '"9647739334545"'),
  ('notify_emails',          '["mustafaqais750@gmail.com","waleed789054@gmail.com"]'),
  ('store_active',           'true');


-- ══════════════════════════════════════
-- 7. Row Level Security (RLS)
-- ══════════════════════════════════════

-- المتجر: قراءة عامة للمنتجات والفئات
alter table public.categories enable row level security;
alter table public.products    enable row level security;
alter table public.coupons     enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.settings    enable row level security;

-- قراءة عامة (المتجر)
create policy "public read categories" on public.categories for select using (true);
create policy "public read products"   on public.products   for select using (status != 'hidden');
create policy "public read settings"   on public.settings   for select using (true);

-- كوبونات: قراءة عامة (التحقق من الكود)
create policy "public read coupons" on public.coupons
  for select using (is_active = true);

-- الطلبات: الإضافة عامة، القراءة للـ Admin فقط
create policy "public insert orders" on public.orders
  for insert with check (true);
create policy "public insert order_items" on public.order_items
  for insert with check (true);

-- Admin: صلاحيات كاملة (عبر service_role key فقط)
-- يُستخدم في لوحة التحكم server-side


-- ══════════════════════════════════════
-- 8. Updated_at trigger
-- ══════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();
