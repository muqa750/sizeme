import { I18N, C, TOTAL_PRODUCTS, PRODUCTS_META, PRODUCTS, COUPONS } from './data.js';

/* --- INJECT SORTING I18N --- */
if (I18N.ar) {
  I18N.ar.filterSort = 'الترتيب:';
  I18N.ar.sortNewest = 'الأحدث';
  I18N.ar.sortPriceAsc = 'السعر: الأقل إلى الأعلى';
  I18N.ar.sortPriceDesc = 'السعر: الأعلى إلى الأقل';
  I18N.ar.sortBestSeller = 'الأكثر طلباً';
  I18N.ar.sortNewArrivals = 'وصل حديثاً';
}
if (I18N.en) {
  I18N.en.filterSort = 'Sort By:';
  I18N.en.sortNewest = 'Newest';
  I18N.en.sortPriceAsc = 'Price: Low to High';
  I18N.en.sortPriceDesc = 'Price: High to Low';
  I18N.en.sortBestSeller = 'Best Seller';
  I18N.en.sortNewArrivals = 'New Arrivals';
}
if (I18N.ku) {
  I18N.ku.filterSort = 'ڕیزبەندی:';
  I18N.ku.sortNewest = 'نوێترین';
  I18N.ku.sortPriceAsc = 'نرخ: کەمترین بۆ بەرزترین';
  I18N.ku.sortPriceDesc = 'نرخ: بەرزترین بۆ کەمترین';
  I18N.ku.sortBestSeller = 'زۆرترین داواکاری';
  I18N.ku.sortNewArrivals = 'تازە گەیشتوو';
}
/* --------------------------- */

    /*
     * imgPath() — مسار صورة المنتج
     * ─────────────────────────────────────────────────────────────────
     * هيكل المجلدات الجديد (كل فئة في مجلدها المستقل):
     *   imagestshirts/  ← التي شيرت   (التسلسل العام: 01-26)
     *   imagespolo/     ← البولو       (تسلسل خاص يبدأ من 01)
     *   imagesshirts/   ← القمصان     (تسلسل خاص يبدأ من 01)
     *   imagesjeans/    ← البنطرون    (تسلسل خاص يبدأ من 01)
     *
     * صيغة اسم الملف: {prefix}-{seq}-{imgKey}.jpg
     *   مثال تي شيرت:   imagestshirts/01-1-lacoste-e33.jpg
     *   مثال بولو:       imagespolo/01-1-polo-rl.jpg
     * ─────────────────────────────────────────────────────────────────
     */
    const IMG_FOLDERS = {
      tshirt: 'imagestshirts',
      polo: 'imagespolo',
      shirt: 'imagesshirts',
      jeans: 'imagesjeans',
      tracksuit: 'imagestracksuit',
    };
    function imgPath(p, seq) {
      const folder = IMG_FOLDERS[p.category] || 'imagestshirts';
      const pfx = p.catSeq || p.prefix;   // catSeq للمجلدات الجديدة، prefix للتي شيرت
      return `${folder}/${pfx}-${seq}-${p.imgKey}.jpg`;
    }
    /* ─────────────────────────────────────────────────────────────────
       SIZES_BY_CAT — مقاسات مختلفة حسب نوع المنتج
       ─────────────────────────────────────────────────────────────────
       ملابس علوية (تي شيرت / بولو / قميص / تراكسوت) → نظام XL
       بنطرون (jeans) → نظام الأرقام الأوروبي (خصر)
       ─────────────────────────────────────────────────────────────────
    */
    const SIZES_BY_CAT = {
      tshirt: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
      polo: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
      shirt: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
      tracksuit: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL'],
      jeans: ['38', '40', '42', '44', '46', '48'],
    };
    /* دالة مساعدة — تُرجع مصفوفة المقاسات الصحيحة لأي منتج */
    function getSizes(p) { return SIZES_BY_CAT[p.category] || SIZES_BY_CAT.tshirt; }

    /* SIZES للتوافق مع أي كود قديم يستخدمه (لا تُحذف) */
    const SIZES = SIZES_BY_CAT.tshirt;

    /* =================== PRICING =================== */
    /* سعر كل فئة بالدينار العراقي */
    const CAT_PRICES = {
      tshirt: 35000,
      polo: 35000,
      shirt: 25000,
      jeans: 30000,
      tracksuit: 70000,
    };
    /* دالة مساعدة — تُرجع سعر أي منتج حسب فئته */
    function getPrice(p) { return CAT_PRICES[p.category] || CAT_PRICES.tshirt; }

    const UNIT_PRICE = 35000;      // يُبقى للتوافق
    const BULK_UNIT_PRICE = 30000;
    const BULK_DISC_PER_PCS = 5000;       // خصم ثابت 5,000 لكل قطعة عند 10+
    const SHIPPING = 5000;
    const BULK_THRESHOLD = 10;
    const BULK_DISCOUNT = (UNIT_PRICE - BULK_UNIT_PRICE) / UNIT_PRICE;

    /* =================== STATE =================== */
    const PAGE_SIZE = 8;
    // ترتيب وعناوين المجموعات على الصفحة
    const CATEGORIES = [
      { key: 'tshirt', icon: 'T', label: { ar: 'تي شيرت', en: 'T-Shirt', ku: 'تی شێرت' } },
      { key: 'polo', icon: 'P', label: { ar: 'بولو', en: 'Polo', ku: 'پۆلۆ' } },
      { key: 'tracksuit', icon: 'TR', label: { ar: 'تراكسوت', en: 'Tracksuit', ku: 'تراکسوت' } },
      { key: 'jeans', icon: 'J', label: { ar: 'بنطرون', en: 'Jeans', ku: 'جینز' } },
      { key: 'shirt', icon: 'S', label: { ar: 'قميص', en: 'Shirt', ku: 'کراس' } },
    ];

    let state = {
      lang: 'ar',
      cart: [],          // {pid, brand, sub, img, color, size, qty}
      filter: { brand: 'all', color: 'all', sort: 'newest' },
      catPage: {},          // صفحة كل فئة مستقلة: { tshirt:0, polo:0, ... }
      coupon: null         // { code, type, value } — set by applyCoupon()
    };

    /* =================== HELPERS =================== */
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const fmt = n => new Intl.NumberFormat('en-US').format(n) + ' IQD';

    /* =================== FILTER HELPERS =================== */
    // Brands are derived automatically from PRODUCTS array.
    // Add a new product to PRODUCTS → its brand auto-appears as a filter button.
    function uniqueBrands() {
      const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
      return ['all', ...brands];
    }
    function uniqueColors() {
      // Fixed palette order — only show colours actually used by at least one product
      const used = new Set(PRODUCTS.flatMap(p => p.colors.map(c => c.n)));
      const palette = Object.values(C).filter(c => used.has(c.n));
      return [{ n: 'all', h: '' }, ...palette];
    }
    function filteredProducts() {
      return PRODUCTS.filter(p => {
        const brandOk = state.filter.brand === 'all' || p.brand === state.filter.brand;
        const colorOk = state.filter.color === 'all' || p.colors.some(c => c.n === state.filter.color);
        return brandOk && colorOk;
      });
    }

    /* =================== RENDER FILTERS =================== */
    function renderFilters() {
      const t = I18N[state.lang];

      /* --- Brand tabs --- */
      const bf = $('#brandFilters');
      bf.innerHTML = uniqueBrands().map(b => `
    <button class="pill-filter ${state.filter.brand === b ? 'active' : ''}"
            data-brand="${b}">
      ${b === 'all' ? t.filterAll : b}
    </button>`).join('');
      bf.querySelectorAll('[data-brand]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.filter.brand = btn.dataset.brand;
          state.catPage = {};   // إعادة ضبط صفحات كل الفئات عند تغيير الفلتر
          renderFilters();
          renderProducts();
        });
      });
      /* ── Slide indicator to active brand chip ── */
      requestAnimationFrame(() => {
        const activeB = bf.querySelector('.chip.active');
        if (window.moveFilterIndicator) moveFilterIndicator('brandFilters', activeB);
      });

      /* --- Color dots --- */
      const cf = $('#colorFilters');
      cf.innerHTML = uniqueColors().map(c => `
    ${c.n === 'all'
          ? `<button class="pill-filter ${state.filter.color === 'all' ? 'active' : ''}"
                 data-color="all">${t.filterAll}</button>`
          : `<span class="color-dot ${state.filter.color === c.n ? 'active' : ''}"
               data-color="${c.n}" style="background:${c.h};color:${c.h}" title="${c.n}"></span>`
        }`).join('');
      cf.querySelectorAll('[data-color]').forEach(el => {
        el.addEventListener('click', () => {
          state.filter.color = el.dataset.color;
          state.catPage = {};   // إعادة ضبط صفحات كل الفئات عند تغيير الفلتر
          renderFilters();
          renderProducts();
        });
      });
      /* ── Slide indicator to active color "All" chip ── */
      requestAnimationFrame(() => {
        const activeC = cf.querySelector('.chip.active');
        if (window.moveFilterIndicator && activeC) moveFilterIndicator('colorFilters', activeC);
      });

      /* --- Sort filter --- */
      const sf = $('#sortFilter');
      if (sf) {
        sf.value = state.filter.sort;
        if (!sf.dataset.bound) {
          sf.addEventListener('change', (e) => {
            state.filter.sort = e.target.value;
            state.catPage = {};
            renderProducts();
          });
          sf.dataset.bound = 'true';
        }
      }
    }

    /* =================== NEW PRODUCT BADGE =================== */
    /**
     * Returns true if the product was added within the last 3 days.
     * Reads the `added` field from PRODUCTS_META (format: 'YYYY-MM-DD').
     * When adding a new product, set: added:'YYYY-MM-DD' in PRODUCTS_META.
     * The badge disappears automatically after 3 days — no manual action needed.
     */
    function isNewProduct(p) {
      const num = parseInt(p.id.replace('p', ''), 10);
      const meta = PRODUCTS_META[num];
      if (!meta || !meta.added) return false;
      const added = new Date(meta.added + 'T00:00:00');
      const diffDays = (Date.now() - added.getTime()) / 86400000;
      return diffDays >= 0 && diffDays <= 3;
    }

    /* =================== RENDER PRODUCTS =================== */
    /* بناء HTML بطاقة منتج واحدة */
    /* دالة مساعدة — تُرجع HTML البادج حسب status */
    function renderBadge(p, t) {
      if (p.status === 'best-seller') {
        const label = { ar: 'الأكثر طلباً', en: 'Best Seller', ku: 'زۆرترین داواکاری' }[state.lang] || 'الأكثر طلباً';
        return `<span class="badge-bestseller">${label}</span>`;
      }
      if (p.status === 'new') {
        return `<span class="badge-new">${t.newBadge || 'جديد'}</span>`;
      }
      return '';
    }

    function renderCard(p, i) {
      const t = I18N[state.lang];
      const isBestSeller = p.status === 'best-seller';
      return `
    <article class="product-card fade-in reveal${isBestSeller ? ' card-bestseller' : ''}" data-pid="${p.id}" data-d="${(i % 8) + 1}">
      <!-- ── TOUCH SLIDER ── -->
      <div class="product-img slider-wrap relative" data-idx="0">
        <div class="slider-track" onclick="openProductModal('${p.id}')" style="cursor:pointer">
          <div class="slide">
            <img src="${imgPath(p, 1)}" alt="${p.brand}"
                 loading="${i === 0 ? 'eager' : 'lazy'}"
                 class="img-lazy"
                 style="opacity:0;transition:opacity .25s"
                 onload="this.classList.add('loaded');this.style.opacity='1'; this.nextElementSibling.style.display='none';"
                 onerror="this.style.display='none';" />
            <div class="absolute inset-0 flex flex-col items-center justify-center bg-[#f2ece2] pointer-events-none">
              <div class="brand-watermark">${p.brand}</div>
              <div class="brand-sub">${p.sub}</div>
            </div>
          </div>
        </div>
        <!-- النقاط بالأسفل - تظهر فقط عندما يكون هناك أكثر من صورة -->
        <div class="slider-dots absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 hidden z-10">
          <span class="sdot active"></span>
        </div>
      </div>
      <!-- ── INFO ── -->
      <div class="p-4 card-info">
        <!-- الاسم والوصف -->
        <div class="card-head">
          <h3 class="serif text-lg leading-tight card-brand">${p.brand}</h3>
          <p class="card-sub">${p.sub}</p>
        </div>
        <!-- السعر — سطر منفصل دائماً ظاهر -->
        <div class="card-price-row">
          <span class="card-price">${fmt(getPrice(p))}</span>
          ${renderBadge(p, t)}
        </div>
        <!-- الألوان -->
        <div class="card-colors-wrap">
          <div class="flex gap-2 flex-wrap" data-role="colors">
            ${p.colors.map((c, ci) => `<span class="color-dot ${ci === 0 ? 'active' : ''}" data-color="${c.n}" style="background:${c.h};color:${c.h}" title="${c.n}"></span>`).join('')}
          </div>
        </div>
        <!-- المقاسات -->
        <div class="card-sizes-wrap">
          <div class="grid grid-cols-3 gap-1.5" data-role="sizes">${(() => {
          const sizes = getSizes(p);
          const wgMap = p.category === 'jeans' ? t.wgJeans : t.wg;
          return sizes.map(s => `<div class="size-card" data-size="${s}"><div class="lbl">${s}</div><div class="wt">${wgMap[s] || ''}</div></div>`).join('');
        })()}</div>
        </div>
        <button class="btn-outline w-full py-2.5 mt-4 text-[11px] tracking-[.2em]" data-role="add">${t.addBag}</button>
      </div>
    </article>`;
    }

    /* =================== PAGINATION PER CATEGORY =================== */
    const CAT_PAGE_SIZE = 12;   // عدد المنتجات في كل صفحة لكل فئة

    function renderCatPagination(catKey, page, pages, t) {
      if (pages <= 1) return '';
      const cls = (active, disabled) =>
        `cat-pg-btn w-10 h-10 text-sm rounded-none transition-all
     ${active ? 'bg-[color:var(--ink)] text-white border-[color:var(--ink)]'
          : 'border hairline bg-white text-[color:var(--ink)] hover:border-[color:var(--ink)]'}
     ${disabled ? 'opacity-30 pointer-events-none' : 'cursor-pointer'}`;
      let html = `<div class="flex items-center justify-center gap-2 mt-8 flex-wrap">`;
      html += `<button class="${cls(false, page === 0)}" data-cat="${catKey}" data-pg="${page - 1}">${t.pagePrev}</button>`;
      const shown = new Set([0, pages - 1, page, page - 1, page + 1].filter(n => n >= 0 && n < pages));
      let prev = -1;
      [...shown].sort((a, b) => a - b).forEach(i => {
        if (prev >= 0 && i - prev > 1)
          html += `<span class="w-10 h-10 flex items-center justify-center text-[color:var(--mute)]">…</span>`;
        html += `<button class="${cls(i === page, false)}" data-cat="${catKey}" data-pg="${i}">${i + 1}</button>`;
        prev = i;
      });
      html += `<button class="${cls(false, page >= pages - 1)}" data-cat="${catKey}" data-pg="${page + 1}">${t.pageNext}</button>`;
      html += `</div>`;
      return html;
    }

    /* =================== RENDER PRODUCTS =================== */
    function renderProducts() {
      /* ── Skeleton فوري حتى يُرسم DOM الحقيقي ── */
      showProductSkeleton(4);

      setTimeout(function () {
        const t = I18N[state.lang];
        let all = filteredProducts();
        
        /* ── الفرز (Sorting) ── */
        if (state.filter.sort === 'priceAsc') {
          all.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (state.filter.sort === 'priceDesc') {
          all.sort((a, b) => getPrice(b) - getPrice(a));
        } else if (state.filter.sort === 'bestSeller') {
          all.sort((a, b) => (b.status === 'best-seller' ? 1 : 0) - (a.status === 'best-seller' ? 1 : 0));
        } else if (state.filter.sort === 'newArrivals') {
          all.sort((a, b) => (b.status === 'new' ? 1 : 0) - (a.status === 'new' ? 1 : 0));
        }

        const total = all.length;

        /* ── عداد المنتجات ── */
        $('#shopCount').textContent = t.shopCountFn(total, PRODUCTS.length);

        /* ── pagination القديمة لا تُستخدم — أخلِ الحاوية ── */
        $('#pagination').innerHTML = '';

        const sections = $('#productSections');

        if (total === 0) {
          sections.innerHTML = `<p class="text-center text-[color:var(--mute)] py-16">${t.noResults}</p>`;
          return;
        }

        /* ── بناء قسم لكل فئة بالترتيب (تي شيرت → بولو → بنطرون → قميص) ── */
        sections.innerHTML = CATEGORIES.map(cat => {
          const catAll = all.filter(p => p.category === cat.key);
          if (catAll.length === 0) return '';

          const label = cat.label[state.lang] || cat.label.ar;
          const pages = Math.ceil(catAll.length / CAT_PAGE_SIZE);
          const pg = Math.min(state.catPage[cat.key] || 0, Math.max(0, pages - 1));
          state.catPage[cat.key] = pg;
          const slice = catAll.slice(pg * CAT_PAGE_SIZE, pg * CAT_PAGE_SIZE + CAT_PAGE_SIZE);

          /* عداد المنتجات بجانب عنوان القسم */
          const countLabel = state.lang === 'en'
            ? `${catAll.length} ${catAll.length === 1 ? 'item' : 'items'}`
            : state.lang === 'ku'
              ? `${catAll.length} بەرهەم`
              : `${catAll.length} منتج`;

          return `
        <div class="category-section mb-14" id="cat-${cat.key}">
          <div class="flex items-center justify-between mb-5 pb-3 border-b hairline gap-3">
            <div class="flex items-baseline gap-3">
              <h3 class="serif text-2xl md:text-3xl">${label}</h3>
              <span class="text-sm text-[color:var(--mute)]">${countLabel}</span>
            </div>
            ${cat.key === 'tshirt' || cat.key === 'polo' || cat.key === 'shirt' || cat.key === 'tracksuit' ? `
            <button onclick="openSizeCalc()" class="flex items-center gap-1 text-xs text-[color:var(--mute)] hover:text-[color:var(--ink)] transition-colors" style="letter-spacing:.08em;white-space:nowrap;min-height:36px;padding:.25rem .5rem">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><line x1="8" y1="7" x2="8" y2="17"/><line x1="12" y1="7" x2="12" y2="17"/><line x1="16" y1="7" x2="16" y2="17"/></svg>
              ${{ ar: 'احسب مقاسك', en: 'Size guide', ku: 'قەبارەکەت بزانە' }[state.lang] || 'احسب مقاسك'}
            </button>` : ''}
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            ${slice.map((p, i) => renderCard(p, i)).join('')}
          </div>
          ${renderCatPagination(cat.key, pg, pages, t)}
        </div>`;
        }).join('');

        /* ── ربط أزرار Pagination لكل فئة ── */
        $$('#productSections .cat-pg-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            state.catPage[cat] = +btn.dataset.pg;
            renderProducts();
            /* تمرير ناعم للقسم المُحدَّث بعد رسم DOM */
            requestAnimationFrame(() => {
              const el = document.getElementById(`cat-${cat}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          });
        });

        /* ── ربط تفاعلات بطاقات المنتجات ── */
        $$('#productSections .product-card').forEach(card => {
          card.querySelectorAll('[data-role="colors"] .color-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
              card.querySelectorAll('[data-role="colors"] .color-dot').forEach(d => d.classList.remove('active'));
              dot.classList.add('active');
              if (card.goToSlide) card.goToSlide(index);
            });
          });
          card.querySelectorAll('[data-role="sizes"] .size-card').forEach(sc => {
            sc.addEventListener('click', () => {
              card.querySelectorAll('[data-role="sizes"] .size-card').forEach(x => x.classList.remove('active'));
              sc.classList.add('active');
            });
          });
          const addBtn = card.querySelector('[data-role="add"]');
          addBtn?.addEventListener('click', () => {
            const p = PRODUCTS.find(x => x.id === card.dataset.pid);
            const color = card.querySelector('[data-role="colors"] .active')?.dataset.color;
            const size = card.querySelector('[data-role="sizes"] .active')?.dataset.size;
            const t2 = I18N[state.lang];
            if (!size) { alert(t2.selectSize); return; }
            if (window.flashAddBtn) flashAddBtn(addBtn);
            addToCart({ pid: p.id, brand: p.brand, sub: p.sub, sku: p.sku, img: imgPath(p, 1), color, size, qty: 1, price: getPrice(p) });
            openCart();
          });
        });

        /* ── تهيئة السلايدر + كشف التمرير ── */
        requestAnimationFrame(() => { initSliders(); if (window.observeRevealElements) observeRevealElements(); });

      }, 0);
    }

    /* =================== SLIDER ENGINE (scroll-snap) =================== */
    const MAX_EXTRA_IMAGES = 6;

    function initSliders() {
      $$('#productSections .product-card').forEach(card => {
        const p = PRODUCTS.find(x => x.id === card.dataset.pid);
        if (!p) return;
        const wrap = card.querySelector('.slider-wrap');
        const track = card.querySelector('.slider-track');
        if (!track) return; // حماية في حال عدم وجود السلايدر
        const dotsWrap = card.querySelector('.slider-dots');
        const btnPrev = card.querySelector('.slider-arrow.prev');
        const btnNext = card.querySelector('.slider-arrow.next');

        let currentIdx = 0;

        /* ── الحصول على الـ slide الحالي من موضع التمرير ── */
        function getCurrentIdx() {
          const slides = track.querySelectorAll('.slide');
          if (!slides.length) return 0;
          const sw = slides[0].offsetWidth;
          return sw ? Math.round(track.scrollLeft / sw) : 0;
        }

        /* ── تحديث النقاط ── */
        function updateDots() {
          currentIdx = getCurrentIdx();
          dotsWrap.querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('active', i === currentIdx));
        }

        /* ── الانتقال لـ slide معين ── */
        function goTo(idx) {
          const slides = track.querySelectorAll('.slide');
          idx = Math.max(0, Math.min(idx, slides.length - 1));
          currentIdx = idx;
          slides[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          setTimeout(updateDots, 350);
        }
        card.goToSlide = goTo;

        /* ── مراقبة التمرير لتحديث النقاط ── */
        let scrollTimer;
        track.addEventListener('scroll', () => {
          clearTimeout(scrollTimer);
          scrollTimer = setTimeout(updateDots, 80);
        }, { passive: true });

        /* ── Arrow clicks ── */
        btnPrev?.addEventListener('click', e => { e.stopPropagation(); goTo(currentIdx - 1); });
        btnNext?.addEventListener('click', e => { e.stopPropagation(); goTo(currentIdx + 1); });

        /* ── Dot clicks ── */
        dotsWrap?.addEventListener('click', e => {
          const dot = e.target.closest('.sdot');
          if (!dot) return;
          e.stopPropagation();
          goTo([...dotsWrap.querySelectorAll('.sdot')].indexOf(dot));
        });

        /* ── Probe extra images (2 → MAX_EXTRA_IMAGES+1) ── */
        for (let seq = 2; seq <= MAX_EXTRA_IMAGES + 1; seq++) {
          (function (s) {
            const slide = document.createElement('div');
            slide.className = 'slide hidden';
            const img = document.createElement('img');
            img.alt = p.brand;
            slide.appendChild(img);
            track.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = 'sdot hidden';
            dotsWrap.appendChild(dot);

            const probe = new Image();
            probe.onload = () => {
              img.src = probe.src;
              slide.classList.remove('hidden');
              dot.classList.remove('hidden');
              dotsWrap.classList.remove('hidden');
              if (btnPrev) btnPrev.classList.remove('hidden');
              if (btnNext) btnNext.classList.remove('hidden');
            };
            probe.src = imgPath(p, s);
          })(seq);
        }
      });
    }

    /* =================== PAGINATION =================== */
    function renderPagination(page, pages) {
      const t = I18N[state.lang];
      const pag = $('#pagination');
      if (pages <= 1) { pag.innerHTML = ''; return; }

      const btn = (label, pg, disabled = false, active = false) =>
        `<button class="${active
          ? 'bg-[color:var(--ink)] text-white w-9 h-9 text-sm'
          : 'border hairline bg-white w-9 h-9 text-sm hover:bg-[color:var(--paper)]'}
      ${disabled ? 'opacity-30 pointer-events-none' : ''}"
      data-pg="${pg}">${label}</button>`;

      let html = btn(t.pagePrev, page - 1, page === 0);

      /* smart page numbers: always show first, last, current ±1 */
      const shown = new Set([0, pages - 1, page, page - 1, page + 1].filter(n => n >= 0 && n < pages));
      let prev = -1;
      [...shown].sort((a, b) => a - b).forEach(i => {
        if (prev >= 0 && i - prev > 1) html += `<span class="w-9 h-9 flex items-center justify-center text-[color:var(--mute)]">…</span>`;
        html += btn(i + 1, i, false, i === page);
        prev = i;
      });

      html += btn(t.pageNext, page + 1, page >= pages - 1);
      pag.innerHTML = html;

      pag.querySelectorAll('[data-pg]').forEach(b => {
        b.addEventListener('click', () => {
          state.page = +b.dataset.pg;
          renderProducts();
          document.getElementById('shop').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    /* updateBulkBar — معرَّفة في قسم الميزات الجديدة أدناه */

    /* =================== CART =================== */
    function addToCart(item) {
      const key = it => `${it.pid}|${it.size}|${it.color}`;
      const existing = state.cart.find(c => key(c) === key(item));
      if (existing) existing.qty += 1;
      else state.cart.push(item);
      updateCart();
      if (window.bounceCartCount) bounceCartCount();
      const toastMap = { ar: '✓ تمت الإضافة إلى السلة', en: '✓ Added to bag', ku: '✓ زیادکرا بۆ سەبەتە' };
      if (window.showToast) showToast(toastMap[state.lang] || '✓ Added to bag');
    }
    function changeQty(idx, delta) {
      state.cart[idx].qty += delta;
      if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
      updateCart();
    }
    function totalQty() { return state.cart.reduce((s, i) => s + i.qty, 0); }

    function computeTotals() {
      const qty = totalQty();
      const sub = state.cart.reduce((s, i) => s + (i.price || UNIT_PRICE) * i.qty, 0); // مجموع سعر كل منتج × كميته
      const bulk = qty >= BULK_THRESHOLD;
      const bulkDiscount = bulk ? qty * BULK_DISC_PER_PCS : 0; // خصم ثابت 5,000 لكل قطعة عند 10+

      // Coupon applied on top of bulk discount
      let couponDiscount = 0;
      if (state.coupon && qty > 0) {
        const afterBulk = sub - bulkDiscount;
        if (state.coupon.type === 'percent') {
          couponDiscount = Math.round(afterBulk * state.coupon.value / 100);
        } else {
          couponDiscount = Math.min(state.coupon.value, afterBulk);
        }
      }

      const discount = bulkDiscount + couponDiscount;
      const shipping = qty === 0 ? 0 : (bulk ? 0 : SHIPPING);
      const total = sub - discount + shipping;
      return { qty, sub, bulk, bulkDiscount, couponDiscount, discount, shipping, total };
    }

    function updateCart() {
      const t = I18N[state.lang];
      const items = $('#cartItems');
      const totals = computeTotals();
      $('#cartCount').textContent = totals.qty;

      if (state.cart.length === 0) {
        items.innerHTML = `<p class="text-center text-[color:var(--mute)] py-10">${t.empty}</p>`;
      } else {
        items.innerHTML = state.cart.map((it, i) => `
      <div class="flex gap-3 pb-4 border-b hairline">
        <div class="w-16 h-20 bg-[color:var(--paper)] flex-shrink-0 overflow-hidden">
          <img src="${it.img}" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between gap-2">
            <div class="min-w-0">
              <div class="font-medium truncate">${it.brand} <span class="text-[10px] tracking-[.12em] text-[color:var(--mute)] font-normal">[${it.sku || ''}]</span></div>
              <div class="text-xs text-[color:var(--mute)]">${it.sub} · ${it.color || '—'} · ${it.size}</div>
            </div>
            <button class="text-xs text-[color:var(--mute)] hover:text-[color:var(--accent)]" data-rm="${i}">${t.remove}</button>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="inline-flex items-center border hairline">
              <button class="px-2.5 py-1" data-dec="${i}">−</button>
              <span class="px-3 text-sm">${it.qty}</span>
              <button class="px-2.5 py-1" data-inc="${i}">+</button>
            </div>
            <div class="text-sm">${fmt((it.price || UNIT_PRICE) * it.qty)}</div>
          </div>
        </div>
      </div>
    `).join('');

        items.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => changeQty(+b.dataset.inc, +1));
        items.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => changeQty(+b.dataset.dec, -1));
        items.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { state.cart.splice(+b.dataset.rm, 1); updateCart(); });
      }

      $('#sumSub').textContent = fmt(totals.sub);
      $('#sumShip').textContent = totals.shipping === 0 && totals.qty > 0 ? t.free : fmt(totals.shipping);
      $('#sumTotal').textContent = fmt(totals.total);

      // Bulk discount row
      if (totals.bulkDiscount > 0) {
        $('#discRow').style.display = 'flex';
        $('#sumDisc').textContent = '− ' + fmt(totals.bulkDiscount);
        $('#bulkHint').textContent = t.free + ' ✓';
      } else {
        $('#discRow').style.display = 'none';
        $('#bulkHint').textContent = t.bulkHint;
      }

      // Coupon discount row
      if (totals.couponDiscount > 0) {
        $('#couponDiscRow').style.display = 'flex';
        $('#sumCouponDisc').textContent = '− ' + fmt(totals.couponDiscount);
      } else {
        $('#couponDiscRow').style.display = 'none';
      }

      // Show/hide coupon + payment sections
      const cs = $('#couponSection');
      const ps = $('#paySection');
      if (state.cart.length > 0) { cs.classList.remove('hidden'); ps.classList.remove('hidden'); }
      else { cs.classList.add('hidden'); ps.classList.add('hidden'); removeCoupon(true); }

      $('#checkoutBtn').disabled = state.cart.length === 0;
      updateBulkBar();
      if (window.updateMobileBar) updateMobileBar();
    }

    /* =================== COUPON LOGIC =================== */
    function applyCoupon() {
      const raw = ($('#couponInput').value || '').trim().toUpperCase();
      const t = I18N[state.lang];
      const err = $('#couponError');
      if (!raw) return;

      // Check validity + expiry
      const today = new Date().toISOString().slice(0, 10);
      const found = COUPONS.find(c => c.code === raw && (!c.expires || c.expires >= today));

      if (!found) {
        err.classList.remove('hidden');
        $('#couponInput').focus();
        return;
      }
      // Apply
      state.coupon = found;
      err.classList.add('hidden');
      $('#couponInputWrap').classList.add('hidden');
      $('#couponAppliedWrap').classList.remove('hidden');
      $('#couponAppliedWrap').classList.add('flex');
      const discText = found.type === 'percent' ? `${found.value}%` : fmt(found.value);
      $('#couponAppliedLabel').textContent = t.couponApplied(found.code, discText);
      updateCart();
    }

    function removeCoupon(silent = false) {
      state.coupon = null;
      if (!silent) {
        $('#couponInput').value = '';
        $('#couponError').classList.add('hidden');
      }
      $('#couponInputWrap').classList.remove('hidden');
      $('#couponAppliedWrap').classList.add('hidden');
      $('#couponAppliedWrap').classList.remove('flex');
      if (!silent) updateCart();
    }

    /* =================== DRAWERS / MODALS =================== */
    function openCart() { $('#cartOverlay').classList.remove('hidden'); $('#cartDrawer').classList.add('open'); }
    function closeCart() { $('#cartOverlay').classList.add('hidden'); $('#cartDrawer').classList.remove('open'); }
    function openCheckout() {
      const t = I18N[state.lang]; const tot = computeTotals();
      $('#coSub').textContent = fmt(tot.sub);
      $('#coShip').textContent = tot.shipping === 0 && tot.qty > 0 ? t.free : fmt(tot.shipping);
      $('#coTotal').textContent = fmt(tot.total);
      // Bulk discount
      if (tot.bulkDiscount > 0) { $('#coDiscRow').style.display = 'flex'; $('#coDisc').textContent = '− ' + fmt(tot.bulkDiscount); }
      else { $('#coDiscRow').style.display = 'none'; }
      // Coupon discount
      if (tot.couponDiscount > 0) { $('#coCouponDiscRow').style.display = 'flex'; $('#coCouponDisc').textContent = '− ' + fmt(tot.couponDiscount); }
      else { $('#coCouponDiscRow').style.display = 'none'; }
      const cm = $('#checkoutModal');
      cm.classList.remove('modal-enter', 'hidden');
      cm.classList.add('flex');
      void cm.offsetWidth; // force reflow so animation restarts
      cm.classList.add('modal-enter');
      $('#checkoutOverlay').classList.remove('hidden');
    }
    function closeCheckout() { $('#checkoutOverlay').classList.add('hidden'); $('#checkoutModal').classList.add('hidden'); $('#checkoutModal').classList.remove('flex'); }

    /* =================== I18N APPLY =================== */
    /*
     * applyLang() — نظام استرداد اللغة المُحسَّن
     * ─────────────────────────────────────────────────────────────────────
     * المشكلة: تغيير الاتجاه (RTL ↔ LTR) أثناء تشغيل الصفحة
     *          لا يُطبَّق بشكل كامل لأن CSS المُحمَّل مسبقاً لا يُعاد ترتيبه.
     *
     * الحل: عند تغيير الاتجاه فقط (ar/ku ↔ en) نحفظ اللغة الجديدة
     *       ثم نعيد تحميل الصفحة مرة واحدة — الـ inline script في الـ <head>
     *       سيطبّق اللغة الصحيحة قبل رسم أي CSS.
     *
     * تغيير بين لغتين بنفس الاتجاه (ar ↔ ku) → لا reload — يُطبَّق فوراً.
     * ─────────────────────────────────────────────────────────────────────
     */
    function applyLang(lang) {
      const DIR = { ar: 'rtl', en: 'ltr', ku: 'rtl' };
      const currentDir = document.documentElement.dir || 'rtl';
      const newDir = DIR[lang] || 'rtl';

      /* ── 1. حفظ اللغة في localStorage ── */
      try { localStorage.setItem('sizeme_lang', lang); } catch (e) { /* وضع خاص */ }

      /* ── 2. تغيير الاتجاه؟ → Reload مرة واحدة لضمان CSS نظيف ──
              نتحقق من عدم وجود علامة reload نشطة لمنع حلقة لا نهائية */
      if (newDir !== currentDir) {
        /* نضع علامة مؤقتة في sessionStorage تنتهي بعد Reload واحد */
        try {
          var reloadFlag = sessionStorage.getItem('sizeme_dir_reload');
          if (!reloadFlag) {
            sessionStorage.setItem('sizeme_dir_reload', '1');
            window.location.reload();
            return; /* نوقف التنفيذ — الصفحة ستُعاد تحميلها */
          } else {
            /* تم الـ reload بالفعل — نزيل العلامة ونكمل بشكل طبيعي */
            sessionStorage.removeItem('sizeme_dir_reload');
          }
        } catch (e) { /* sessionStorage غير متاح */ }
      }

      /* ── 3. تطبيق فوري بدون reload (نفس الاتجاه أو بعد الـ reload) ── */
      state.lang = lang;
      const t = I18N[lang];

      document.documentElement.lang = lang;
      document.documentElement.dir = newDir;

      $$('[data-i18n]').forEach(el => {
        const k = el.dataset.i18n;
        if (t[k] !== undefined && typeof t[k] === 'string') el.textContent = t[k];
      });
      $$('[data-i18n-placeholder]').forEach(el => {
        const k = el.dataset.i18nPlaceholder;
        if (t[k]) el.placeholder = t[k];
      });
      $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

      /* تحديث نصوص حاسبة المقاس */
      const scBtnLbl = document.getElementById('sizeCalcBtnLbl');
      if (scBtnLbl) scBtnLbl.textContent = t.sizeCalcBtn || 'احسب مقاسك';
      const scTitle = document.getElementById('scTitle');
      if (scTitle) scTitle.textContent = t.sizeCalcTitle || 'احسب مقاسك';
      const scWL = document.getElementById('scWeightLbl');
      if (scWL) scWL.textContent = t.scWeightLbl || 'الوزن (كغ)';
      const scHL = document.getElementById('scHeightLbl');
      if (scHL) scHL.textContent = t.scHeightLbl || 'الطول (سم) — اختياري';
      const scBtn2 = document.getElementById('scBtn');
      if (scBtn2) scBtn2.textContent = t.scCalcBtn || 'احسب';

      /* تحديث placeholder قسم البريد الإلكتروني في الفوتر */
      const footEmail = document.getElementById('footEmailInput');
      if (footEmail && t.footNewsletterInput) footEmail.placeholder = t.footNewsletterInput;

      renderFilters();
      renderProducts();
      updateCart();
    }

    /* =================== EVENTS =================== */
    $('#cartBtn').onclick = openCart;
    $('#cartClose').onclick = closeCart;
    $('#cartOverlay').onclick = closeCart;
    $('#checkoutBtn').onclick = () => { closeCart(); openCheckout(); };
    $('#couponApplyBtn').onclick = applyCoupon;
    $('#couponRemoveBtn').onclick = () => removeCoupon(false);
    $('#couponInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } });
    $('#couponInput').addEventListener('input', () => $('#couponError').classList.add('hidden'));

    // Payment method — COD is always active; online is disabled until further notice
    $('#payCOD').onclick = () => {
      $('#payCOD').classList.add('active');
    };
    $('#payOnline').onclick = e => { e.preventDefault(); /* disabled */ };
    $('#coClose').onclick = closeCheckout;
    $('#checkoutOverlay').onclick = closeCheckout;

    /* =================== FORM VALIDATION =================== */
    function validateForm(fd) {
      const t = I18N[state.lang];
      let valid = true;

      // ── helpers ──
      const fields = [
        { id: 'coNameInp', errId: 'errName', key: 'valName', rule: v => v.trim().length >= 2 },
        { id: 'coProvInp', errId: 'errProv', key: 'valProv', rule: v => v.trim() !== '' },
        { id: 'coAreaInp', errId: 'errArea', key: 'valArea', rule: v => v.trim().length >= 2 },
        { id: 'coAddrInp', errId: 'errAddr', key: 'valAddr', rule: v => v.trim().length >= 3 },
        { id: 'coPhoneInp', errId: 'errPhone', key: 'valPhone', rule: v => v.trim().length >= 5 },
      ];

      // Clear previous errors
      document.querySelectorAll('#coForm .field-error-msg').forEach(el => el.classList.remove('show'));
      document.querySelectorAll('#coForm .field-error-input').forEach(el => el.classList.remove('field-error-input'));

      fields.forEach(({ id, errId, key, rule }) => {
        const el = document.getElementById(id);
        const val = el ? el.value : '';
        if (!rule(val)) {
          // Show error message
          const errEl = document.getElementById(errId);
          if (errEl) {
            const span = errEl.querySelector('[data-i18n]');
            if (span && t[key]) span.textContent = t[key];
            errEl.classList.add('show');
          }
          if (el) el.classList.add('field-error-input');
          valid = false;
        }
      });

      // Extra phone format check (07XXXXXXXXX = 11 digits starting with 07)
      const phoneVal = (document.getElementById('coPhoneInp')?.value || '').trim().replace(/\s/g, '');
      if (phoneVal.length > 0 && !/^07\d{9}$/.test(phoneVal)) {
        const errEl = document.getElementById('errPhone');
        const span = errEl?.querySelector('[data-i18n]');
        if (span) span.textContent = t.valPhoneFmt || t.valPhone;
        errEl?.classList.add('show');
        document.getElementById('coPhoneInp')?.classList.add('field-error-input');
        valid = false;
      }

      // Scroll to first error
      if (!valid) {
        const firstErr = document.querySelector('#coForm .field-error-input');
        firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return valid;
    }

    // Clear error on input/change
    ['coNameInp', 'coProvInp', 'coAreaInp', 'coAddrInp', 'coPhoneInp'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const event = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(event, () => {
        el.classList.remove('field-error-input');
        // Find and hide associated error
        const wrap = el.closest('.field-wrap');
        wrap?.querySelector('.field-error-msg')?.classList.remove('show');
      });
    });

    $('#coForm').addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);

      // ── Custom validation — stop if any required field is empty/invalid ──
      if (!validateForm(fd)) return;

      const name = fd.get('name');
      const t = I18N[state.lang];
      const tot = computeTotals();

      /* ---- Build WhatsApp message ---- */
      const nl = '%0A';   // URL-encoded newline
      const bold = s => `*${s}*`;

      const itemLines = state.cart
        .map(i => `  • ${i.brand} [${i.sku || ''}] — ${i.color || ''} / ${i.size} × ${i.qty} = ${fmt((i.price || UNIT_PRICE) * i.qty)}`)
        .join(nl);

      const discLine = tot.bulkDiscount > 0
        ? `${nl}🎁 Bulk discount (30K/piece): -${fmt(tot.bulkDiscount)}`
        : '';

      const couponLine = (state.coupon && tot.couponDiscount > 0)
        ? `${nl}🏷️ Coupon (${state.coupon.code}): -${fmt(tot.couponDiscount)}`
        : '';

      const shippingLine = tot.shipping === 0
        ? `🚚 Delivery: Free`
        : `🚚 Delivery: ${fmt(tot.shipping)}`;

      const payLabel = I18N[state.lang].payWhatsApp || 'Cash on Delivery';

      const msg =
        `🛍️ ${bold('New SizeMe Order')}${nl}${nl}` +
        `👤 ${bold('Name')}: ${fd.get('name')}${nl}` +
        `📞 ${bold('Phone')}: ${fd.get('phone')}${nl}` +
        `📍 ${bold('Province')}: ${fd.get('province')}${nl}` +
        `🏘️ ${bold('Area')}: ${fd.get('area')}${nl}` +
        `🏠 ${bold('Address')}: ${fd.get('address')}${nl}` +
        (fd.get('notes') ? `📝 ${bold('Notes')}: ${fd.get('notes')}${nl}` : '') +
        `💳 ${bold('Payment')}: ${payLabel}${nl}` +
        `${nl}${bold('Items')}:${nl}${itemLines}${nl}` +
        `${nl}💵 Subtotal: ${fmt(tot.sub)}` +
        `${discLine}${couponLine}${nl}` +
        `${shippingLine}${nl}` +
        `${bold('💰 Total: ')}${fmt(tot.total)}`;

      /* ---- Show confirmation first, then open WhatsApp ---- */
      $('#cfMsg').textContent = t.cfBody(name);
      closeCheckout();
      $('#confirmOverlay').classList.remove('hidden');
      $('#confirmModal').classList.remove('hidden');
      $('#confirmModal').classList.add('flex');

      /* Open WhatsApp after a short delay so modal renders first */
      setTimeout(() => {
        window.open(`https://wa.me/9647739334545?text=${msg}`, '_blank');
      }, 600);

      /* Reset cart + coupon */
      state.cart = []; removeCoupon(true); updateCart();
      e.target.reset();
    });
    $('#cfClose').onclick = () => { $('#confirmOverlay').classList.add('hidden'); $('#confirmModal').classList.add('hidden'); $('#confirmModal').classList.remove('flex'); };
    $('#confirmOverlay').onclick = () => $('#cfClose').click();

    $$('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

    /* =================== MOBILE NAV DRAWER =================== */
    function openMobileNav() {
      $('#mobileNavDrawer').classList.add('open');
      $('#mobileNavOverlay').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
      $('#mobileNavDrawer').classList.remove('open');
      $('#mobileNavOverlay').classList.remove('open');
      document.body.style.overflow = '';
    }
    $('#menuBtn').addEventListener('click', openMobileNav);
    $('#mobileNavClose').addEventListener('click', closeMobileNav);
    $('#mobileNavOverlay').addEventListener('click', closeMobileNav);

    /* =================== SUGGESTION POPUP =================== */
    function openSugg() { $('#suggOverlay').classList.remove('hidden'); $('#suggModal').classList.remove('hidden'); $('#suggModal').classList.add('flex'); }
    function closeSugg() { $('#suggOverlay').classList.add('hidden'); $('#suggModal').classList.add('hidden'); $('#suggModal').classList.remove('flex'); }
    $('#suggBtn').onclick = openSugg;
    $('#suggClose').onclick = closeSugg;
    $('#suggOverlay').onclick = closeSugg;
    const SUGG_URL = 'https://script.google.com/macros/s/AKfycbzI3HPm5xrvJbFfUNrC3iM9Y_2e-mQQ3H-ipl7qEHlDyuOD7KUIWfdkloWSMEaR45m-/exec';

    $('#suggSend').onclick = () => {
      const txt = $('#suggText').value.trim();
      if (!txt) return;

      // إخفاء حقل الكتابة والزر وإظهار رسالة النجاح
      $('#suggText').style.display = 'none';
      $('#suggSend').style.display = 'none';
      $('#suggSuccess').classList.remove('hidden');

      // إرسال البيانات إلى Google Sheets (no-cors لتجنب مشاكل السياسات)
      fetch(SUGG_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion: txt })
      }).catch(() => { }); // نتجاهل أخطاء الشبكة بصمت

      // إغلاق المودال تلقائياً بعد ثانيتين وإعادة تهيئة الواجهة
      setTimeout(() => {
        closeSugg();
        setTimeout(() => {
          $('#suggText').value = '';
          $('#suggText').style.display = '';
          $('#suggSend').style.display = '';
          $('#suggSuccess').classList.add('hidden');
        }, 400); // الانتظار حتى تنتهي حركة الإغلاق
      }, 2000);
    };

    /* =================== REVIEWS POPUP =================== */
    const MAX_REVIEWS = 30;
    let rvIdx = 0, rvTotal = 0;

    function openReviews() {
      $('#reviewsOverlay').classList.remove('hidden');
      $('#reviewsModal').classList.remove('hidden');
      $('#reviewsModal').classList.add('flex');

      const track = $('#reviewsTrack');
      const dots = $('#reviewsDots');
      const empty = $('#reviewsEmpty');
      track.innerHTML = '';
      dots.innerHTML = '';
      rvIdx = 0; rvTotal = 0;

      /* probe reviews/1.jpg|jpeg … reviews/MAX_REVIEWS.jpg|jpeg */
      const EXTS = ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'PNG', 'webp'];
      let done = 0, totalProbes = MAX_REVIEWS * EXTS.length;
      const found = [];
      const seen = new Set();
      for (let i = 1; i <= MAX_REVIEWS; i++) {
        EXTS.forEach(ext => {
          (function (n, e) {
            const img = new Image();
            img.onload = () => {
              if (!seen.has(n)) { seen.add(n); found.push({ n, src: img.src }); }
              finish();
            };
            img.onerror = () => { finish(); };
            img.src = `reviews/${n}.${e}`;
          })(i, ext);
        });
      }
      function finish() {
        if (++done < totalProbes) return;
        found.sort((a, b) => a.n - b.n);
        rvTotal = found.length;
        if (rvTotal === 0) { empty.classList.remove('hidden'); track.parentElement.querySelector('.slider-arrow').style.display = 'none'; return; }
        empty.classList.add('hidden');
        found.forEach((f, i) => {
          const slide = document.createElement('div');
          slide.className = 'slide flex items-center justify-center bg-black';
          slide.style.minWidth = '100%';
          const img = document.createElement('img');
          img.src = f.src; img.style.cssText = 'max-height:70vh;max-width:100%;object-fit:contain;';
          slide.appendChild(img);
          track.appendChild(slide);
          const dot = document.createElement('span'); dot.className = 'sdot' + (i === 0 ? ' active' : '');
          dots.appendChild(dot);
        });
        rvGoTo(0);
      }
    }
    function rvGoTo(idx) {
      const slides = $('#reviewsTrack').querySelectorAll('.slide');
      idx = Math.max(0, Math.min(idx, slides.length - 1));
      rvIdx = idx;
      const isRTL = document.documentElement.dir === 'rtl';
      $('#reviewsTrack').style.transform = `translateX(${isRTL ? '' : '-'}${idx * 100}%)`;
      $('#reviewsDots').querySelectorAll('.sdot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    function closeReviews() { $('#reviewsOverlay').classList.add('hidden'); $('#reviewsModal').classList.add('hidden'); $('#reviewsModal').classList.remove('flex'); }
    $('#reviewsBtn').onclick = openReviews;
    $('#reviewsClose').onclick = closeReviews;
    $('#reviewsOverlay').onclick = closeReviews;
    $('#rvPrev').onclick = () => rvGoTo(rvIdx - 1);
    $('#rvNext').onclick = () => rvGoTo(rvIdx + 1);
    $('#reviewsDots').addEventListener('click', e => {
      const d = e.target.closest('.sdot'); if (!d) return;
      rvGoTo([...$('#reviewsDots').querySelectorAll('.sdot')].indexOf(d));
    });

    /* =================== INIT =================== */

    /*
     * استعادة اللغة المحفوظة عند تحميل الصفحة
     * الأولوية: localStorage → الافتراضي 'ar'
     */
    (function initLang() {
      var saved = 'ar';
      try {
        var v = localStorage.getItem('sizeme_lang');
        if (v && I18N[v]) saved = v;
      } catch (e) { }
      applyLang(saved);
    })();

    updateCart();

    /*
     * ── معالجة BFCache (Back-Forward Cache) في Safari iOS ──────────────────
     * Safari يحفظ الصفحة في الذاكرة عند الضغط على "رجوع"
     * الصفحة تعود دون إعادة تشغيل JS — لذلك نعيد تطبيق اللغة يدوياً
     * عبر حدث pageshow مع التحقق من الخاصية e.persisted
     */
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return; /* تحميل عادي — لا شيء مطلوب */
      var saved = 'ar';
      try {
        var v = localStorage.getItem('sizeme_lang');
        if (v && I18N[v]) saved = v;
      } catch (err) { }
      applyLang(saved);
    });

    /* hide video fallback when video has real source loaded */
    const vid = $('#heroVideo');
    vid.addEventListener('loadeddata', () => { $('#videoFallback').style.display = 'none'; });
    vid.addEventListener('error', () => { /* keep fallback */ });

    /* =====================================================
       PREMIUM ANIMATIONS — JavaScript Engine
       Framer Motion equivalent for vanilla HTML/JS
       ===================================================== */

    /* ── 1. Scroll-reveal IntersectionObserver (whileInView) ── */
    (function initRevealObserver() {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

      window._revealObserver = io;
      window.observeRevealElements = function () {
        document.querySelectorAll('.reveal:not(.in-view)').forEach(el => io.observe(el));
      };
      // observe immediately for elements already in DOM
      window.observeRevealElements();
    })();

    /* ── تحريك النجوم وأشرطة التقييم عند ظهور القسم ── */
    (function initRatingAnimation() {
      const section = document.getElementById('ratingSection');
      if (!section) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(section);
          // تحريك كل نجمة بتأخير متتالي
          section.querySelectorAll('.star-fill').forEach((star, i) => {
            setTimeout(() => star.classList.add('animate'), i * 120);
          });
          // تحريك أشرطة التقييم بعد النجوم
          setTimeout(() => {
            section.querySelectorAll('.rating-bar-fill').forEach(bar => {
              bar.classList.add('animate');
            });
          }, 700);
        });
      }, { threshold: 0.3 });
      io.observe(section);
    })();

    /* ── 2. Ripple wave on every .btn-ink and .btn-outline click (whileTap) ── */
    function addRipple(btn, e) {
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      const r = btn.getBoundingClientRect();
      wave.style.cssText = `left:${(e.clientX - r.left - 5)}px;top:${(e.clientY - r.top - 5)}px;`;
      btn.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove(), { once: true });
    }
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-ink, .btn-outline');
      if (btn) addRipple(btn, e);
    }, true);

    /* ── 3. Cart badge bounce ── */
    function bounceCartCount() {
      const el = $('#cartCount');
      if (!el) return;
      el.classList.remove('badge-pop');
      void el.offsetWidth; // force reflow → restart animation
      el.classList.add('badge-pop');
      el.addEventListener('animationend', () => el.classList.remove('badge-pop'), { once: true });
    }

    /* ── 4. Toast notification (add-to-bag confirmation) ── */
    let _toastTimer = null;
    function showToast(msg) {
      const toast = document.getElementById('sm-toast');
      if (!toast) return;
      toast.textContent = msg;
      clearTimeout(_toastTimer);
      toast.classList.add('show');
      _toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    /* ── 5. Add-to-bag flash animation on the button ── */
    function flashAddBtn(btn) {
      if (!btn) return;
      btn.classList.remove('add-flash');
      void btn.offsetWidth;
      btn.classList.add('add-flash');
      btn.addEventListener('animationend', () => btn.classList.remove('add-flash'), { once: true });
    }

    /* ── 6. Mobile floating cart bar ── */
    function updateMobileBar() {
      const bar = document.getElementById('mobileBar');
      const qtyEl = document.getElementById('mbarQty');
      const totEl = document.getElementById('mbarTotal');
      if (!bar) return;
      const tot = computeTotals();
      if (tot.qty > 0) {
        bar.classList.add('show');
        if (qtyEl) qtyEl.textContent = tot.qty;
        if (totEl) totEl.textContent = fmt(tot.total);
      } else {
        bar.classList.remove('show');
      }
    }

    /* expose all as globals so guarded calls (window.fn) resolve */
    window.bounceCartCount = bounceCartCount;
    window.showToast = showToast;
    window.flashAddBtn = flashAddBtn;
    window.updateMobileBar = updateMobileBar;

    /* ── Skeleton Loader (21st.dev shimmer — 4 cards) ── */
    function showProductSkeleton(n) {
      n = n || 4;
      const skeletonGrid = `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">` +
        Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="skeleton-block" style="aspect-ratio:3/4;border-radius:0;"></div>
      <div style="padding:1rem;">
        <div class="skeleton-block" style="height:1.1rem;width:58%;margin-bottom:.5rem;"></div>
        <div class="skeleton-block" style="height:.7rem;width:36%;margin-bottom:.9rem;"></div>
        <div class="skeleton-block" style="height:2.5rem;width:100%;border-radius:0;"></div>
      </div>
    </div>
  `).join('') + `</div>`;
      $('#productSections').innerHTML = skeletonGrid;
    }

    /* ── Filter Sliding Indicator (21st.dev tab underline) ── */
    function moveFilterIndicator(containerId, activeEl) {
      const container = document.getElementById(containerId);
      if (!container || !activeEl) return;
      let ind = container.querySelector('.filter-indicator');
      if (!ind) {
        ind = document.createElement('span');
        ind.className = 'filter-indicator';
        container.style.position = 'relative';
        container.appendChild(ind);
      }
      /* use offsetLeft for RTL-safe positioning */
      ind.style.left = activeEl.offsetLeft + 'px';
      ind.style.width = activeEl.offsetWidth + 'px';
      ind.style.opacity = '1';
    }
    window.moveFilterIndicator = moveFilterIndicator;

    /* =====================================================
       LOADING SCREEN — JS
       ===================================================== */
    (function () {
      const loader = document.getElementById('sizeLoader');
      if (!loader) return;
      function dismiss() {
        loader.classList.add('fade-out');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
      }
      window.addEventListener('load', function () { setTimeout(dismiss, 950); });
      setTimeout(function () { if (loader.parentNode) dismiss(); }, 2800); // fallback
    })();

    /* =====================================================
       BULK BAR — تحسين بصري
       ===================================================== */
    function updateBulkBar() {
      const t = I18N[state.lang];
      const qty = totalQty();
      const bar = $('#bulkBar');
      if (qty === 0) { bar.classList.add('hidden'); return; }
      bar.classList.remove('hidden');
      const pct = Math.min(100, (qty / 10) * 100);
      const done = qty >= 10;
      const fill = $('#bulkBarFill');
      const badge = $('#bulkBarBadge');
      const label = $('#bulkBarLabel');
      fill.style.width = pct + '%';
      fill.style.background = done ? 'var(--accent)' : 'var(--ink)';
      label.textContent = t.bulkProgressFn(qty);
      badge.textContent = done ? t.bulkActiveBadge : t.bulkPendingBadge;
      badge.style.color = done ? 'var(--accent)' : 'var(--mute)';
      /* فقاعات الكميات — 10 دوائر صغيرة */
      const bubbles = $('#bulkPcsBubbles');
      if (bubbles) {
        bubbles.innerHTML = Array.from({ length: 10 }, (_, i) => `
      <span class="bulk-pcs-bubble ${i < qty ? 'done' : 'pending'}">${i + 1}</span>
    `).join('');
      }
    }

    /* =====================================================
       PRODUCT MODAL
       ===================================================== */
    let _pmPid = null;

    function openProductModal(pid) {
      _pmPid = pid;
      const p = PRODUCTS.find(x => x.id === pid);
      if (!p) return;
      const t = I18N[state.lang];
      const modal = document.getElementById('productModal');
      if (!modal) return;

      /* ── صور: slider أفقي مع scroll-snap ── */
      const imgWrap = modal.querySelector('.pm-img-wrap');
      const dotsWrap = modal.querySelector('.pm-dots');
      imgWrap.innerHTML = '';
      dotsWrap.innerHTML = '';

      /* اكتشاف عدد الصور المتاحة (نجرب حتى 6) */
      const maxProbe = 6;
      let loadedSlides = 0;

      function updateDots() {
        dotsWrap.querySelectorAll('.pm-dot').forEach((d, i) => {
          d.classList.toggle('active', i === getCurrentSlide());
        });
      }
      function getCurrentSlide() {
        if (!imgWrap.children.length) return 0;
        const sw = imgWrap.children[0].offsetWidth;
        return sw ? Math.round(imgWrap.scrollLeft / sw) : 0;
      }
      imgWrap.addEventListener('scroll', updateDots);

      for (let seq = 1; seq <= maxProbe; seq++) {
        const slide = document.createElement('div');
        slide.className = 'pm-slide';

        /* watermark */
        const wm = document.createElement('div');
        wm.className = 'absolute inset-0 flex flex-col items-center justify-center bg-[#f2ece2]';
        wm.innerHTML = `<div class="brand-watermark">${p.brand}</div><div class="brand-sub">${p.sub}</div>`;
        slide.appendChild(wm);

        const img = document.createElement('img');
        img.alt = p.brand + ' ' + seq;
        img.loading = seq === 1 ? 'eager' : 'lazy';
        img.classList.add('img-lazy');
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;';
        img.onload = () => {
          img.classList.add('loaded');
          img.style.opacity = '1';
          wm.style.display = 'none';
          loadedSlides++;
          /* build dots */
          dotsWrap.innerHTML = '';
          for (let d = 0; d < loadedSlides; d++) {
            const dot = document.createElement('span');
            dot.className = 'pm-dot' + (d === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
              imgWrap.children[d].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            });
            dotsWrap.appendChild(dot);
          }
          if (loadedSlides <= 1) dotsWrap.style.display = 'none';
          else dotsWrap.style.display = '';
        };
        img.onerror = () => {
          if (seq === 1) { /* الصورة الأولى فشلت — نبقي الـ watermark */ img.style.display = 'none'; }
          else { slide.remove(); } /* نحذف slides الفارغة */
        };
        img.src = imgPath(p, seq);
        slide.appendChild(img);
        imgWrap.appendChild(slide);
      }

      /* ── الجانب الأيسر/الأيمن: التفاصيل ── */
      const info = modal.querySelector('.pm-info');
      const sizes = getSizes(p);
      const wgMap = p.category === 'jeans' ? t.wgJeans : t.wg;
      info.innerHTML = `
    <div class="flex items-start justify-between mb-1">
      <div>
        <h2 class="serif text-2xl leading-tight">${p.brand}</h2>
        <p class="kicker mt-0.5">${p.sub}</p>
      </div>
      <div class="text-lg font-medium">${fmt(getPrice(p))}</div>
    </div>
    <div class="mt-5">
      <p class="kicker mb-2">${t.selectColor}</p>
      <div class="flex gap-2.5 flex-wrap pm-colors">
        ${p.colors.map((c, ci) => `<span class="color-dot ${ci === 0 ? 'active' : ''}" data-color="${c.n}" style="background:${c.h};color:${c.h}" title="${c.n}"></span>`).join('')}
      </div>
    </div>
    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <p class="kicker">${t.selectSize}</p>
        <button class="text-xs text-[color:var(--mute)] underline underline-offset-2" onclick="openSizeCalc()" style="letter-spacing:.05em">
          ${state.lang === 'en' ? 'Size guide' : 'احسب مقاسك'}
        </button>
      </div>
      <div class="grid grid-cols-3 gap-1.5 pm-sizes">
        ${sizes.map(s => `<div class="size-card" data-size="${s}"><div class="lbl">${s}</div><div class="wt">${wgMap[s] || ''}</div></div>`).join('')}
      </div>
    </div>
    <button class="btn-ink w-full py-3.5 mt-5 text-xs tracking-[.2em] pm-add-btn">${t.addBag}</button>
  `;

      /* أحداث الألوان والمقاسات والإضافة */
      info.querySelectorAll('.pm-colors .color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          info.querySelectorAll('.pm-colors .color-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });
      info.querySelectorAll('.pm-sizes .size-card').forEach(sc => {
        sc.addEventListener('click', () => {
          info.querySelectorAll('.pm-sizes .size-card').forEach(s => s.classList.remove('active'));
          sc.classList.add('active');
        });
      });
      info.querySelector('.pm-add-btn').addEventListener('click', () => {
        const color = info.querySelector('.pm-colors .active')?.dataset.color;
        const size = info.querySelector('.pm-sizes .active')?.dataset.size;
        if (!size) { alert(t.selectSize); return; }
        addToCart({ pid: p.id, brand: p.brand, sub: p.sub, sku: p.sku, img: imgPath(p, 1), color, size, qty: 1, price: getPrice(p) });
        closeProductModal();
        openCart();
      });

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
      const modal = document.getElementById('productModal');
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    /* =====================================================
       SIZE CALCULATOR
       ===================================================== */
    function openSizeCalc() {
      const m = document.getElementById('sizeCalcModal');
      if (!m) return;
      m.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { const el = document.getElementById('scWeight'); if (el) el.focus(); }, 100);
    }
    function closeSizeCalc() {
      const m = document.getElementById('sizeCalcModal');
      if (!m) return;
      m.classList.remove('is-open');
      document.body.style.overflow = '';
      const res = document.getElementById('scResult');
      if (res) res.style.display = 'none';
      const sw = document.getElementById('scWeight'); if (sw) sw.value = '';
      const sh = document.getElementById('scHeight'); if (sh) sh.value = '';
    }
    function calcSize() {
      const w = parseFloat(document.getElementById('scWeight').value);
      if (!w || w < 40 || w > 300) { return; }
      /* ── جداول الأوزان ── */
      const xlMap = [
        { size: '2XL', min: 95, max: 106 },
        { size: '3XL', min: 106, max: 116 },
        { size: '4XL', min: 116, max: 126 },
        { size: '5XL', min: 126, max: 141 },
        { size: '6XL', min: 141, max: 156 },
        { size: '7XL', min: 156, max: 220 },
      ];
      const jeansMap = [
        { size: '38', min: 40, max: 86 },
        { size: '40', min: 86, max: 96 },
        { size: '42', min: 96, max: 111 },
        { size: '44', min: 111, max: 126 },
        { size: '46', min: 126, max: 141 },
        { size: '48', min: 141, max: 220 },
      ];
      const xl = xlMap.find(r => w >= r.min && w < r.max) || xlMap[xlMap.length - 1];
      const jeans = jeansMap.find(r => w >= r.min && w < r.max) || jeansMap[jeansMap.length - 1];
      const lang = state.lang;
      const res = document.getElementById('scResult');
      const lbl = { ar: 'مقاسك المقترح', en: 'Your Suggested Size', ku: 'قەبارەی پێشنیارکراو' }[lang] || 'مقاسك المقترح';
      const jeansLbl = { ar: 'بنطرون', en: 'Jeans', ku: 'جینز' }[lang] || 'بنطرون';
      res.style.display = 'block';
      res.innerHTML = `
    <p class="kicker mb-2">${lbl}</p>
    <div class="sc-size">${xl.size}</div>
    <p class="text-xs text-[color:var(--mute)] mt-1">${{ ar: 'تي شيرت / بولو / قميص / تراكسوت', en: 'T-Shirt · Polo · Shirt · Tracksuit', ku: 'تی شێرت · پۆلۆ · کراس · تراکسوت' }[lang] || ''}</p>
    <div class="mt-3 pt-3 border-t hairline">
      <div class="sc-size" style="font-size:clamp(1.5rem,6vw,2rem)">${jeans.size}</div>
      <p class="text-xs text-[color:var(--mute)] mt-1">${jeansLbl}</p>
    </div>
  `;
    }

    window.moveFilterIndicator = moveFilterIndicator;

    /* =====================================================
       THEME TOGGLE — فاتح / داكن
       ===================================================== */
    function initTheme() {
      var saved = 'light';
      try { var v = localStorage.getItem('sizeme_theme'); if (v) saved = v; } catch (e) { }
      document.documentElement.setAttribute('data-theme', saved);
      updateThemeIcon(saved);
    }
    function toggleTheme() {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('sizeme_theme', next); } catch (e) { }
      updateThemeIcon(next);
    }
    function updateThemeIcon(theme) {
      var icon = document.getElementById('themeIcon');
      if (!icon) return;
      if (theme === 'dark') {
        /* Sun icon for switching to light */
        icon.innerHTML = '<circle cx=\"12\" cy=\"12\" r=\"5\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/>';
      } else {
        /* Moon icon for switching to dark */
        icon.innerHTML = '<path d=\"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z\"/>';
      }
    }
    var _themeBtn = document.getElementById('themeToggle');
    if (_themeBtn) _themeBtn.addEventListener('click', toggleTheme);
    initTheme();

    /* ── Header scroll shadow ── */
    (function () {
      var header = document.querySelector('header');
      if (!header) return;
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            if (window.scrollY > 10) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    })();

    /* =====================================================
       EMOJI RATING WIDGET — Modern Interactive
       ===================================================== */
    (function () {
      'use strict';

      var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxFxw3RuQz2yW5Esb0ld9qv4yHSabBVMNiSb3zfx-aO7m8r7CaSRMxDQCoRq6f5l_AM0Q/exec';

      function sendRating(value, score, source) {
        var ts = encodeURIComponent(new Date().toISOString());
        var url = SHEETS_URL +
          '?rating=' + encodeURIComponent(value) +
          '&score=' + encodeURIComponent(score) +
          '&timestamp=' + ts +
          '&source=' + encodeURIComponent(source || 'sizeme-footer');

        // إرسال عبر fetch
        fetch(url, { method: 'GET', mode: 'no-cors' })
          .catch(err => console.error(err));
      }

      function initWidget(cfg) {
        var face = document.getElementById(cfg.faceId);
        var thanks = document.getElementById(cfg.thanksId);
        var btns = document.querySelectorAll(cfg.colsSelector);
        if (!face || !thanks || !btns.length) return;

        btns.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var icon = btn.querySelector('.emoji-icon');
            if (icon) {
              icon.classList.add('emoji-bounce');
              icon.style.filter = 'grayscale(0%) opacity(100%)';
            }

            // إرسال التقييم
            sendRating(btn.dataset.value, btn.dataset.score, cfg.source);

            // إخفاء الوجوه وإظهار الشكر بحركة ناعمة
            setTimeout(function () {
              face.style.opacity = '0';
              setTimeout(function () {
                face.style.display = 'none';
                thanks.classList.remove('hidden');
              }, 300);
            }, 350);
          });
        });

        return {
          reset: function () {
            face.style.display = '';
            face.style.opacity = '1';
            thanks.classList.add('hidden');
            btns.forEach(function (b) {
              var ic = b.querySelector('.emoji-icon');
              if (ic) {
                ic.classList.remove('emoji-bounce');
                ic.style.filter = '';
              }
            });
          }
        };
      }

      /* ── تهيئة أداة الفوتر ── */
      initWidget({
        faceId: 'frwFace',
        thanksId: 'frwThanks',
        colsSelector: '#footRatingWidget .emoji-btn',
        source: 'sizeme-footer'
      });

      /* ── تهيئة أداة مودال التأكيد ── */
      var confirmInst = initWidget({
        faceId: 'erwFace',
        thanksId: 'erwThanks',
        colsSelector: '#confirmModal .emoji-btn',
        source: 'sizeme-checkout'
      });

      /* إعادة ضبط مودال التأكيد عند فتحه مجدداً */
      var confirmModal = document.getElementById('confirmModal');
      if (confirmModal && confirmInst) {
        new MutationObserver(function (muts) {
          muts.forEach(function (m) {
            if (m.attributeName === 'class' && !confirmModal.classList.contains('hidden')) {
              confirmInst.reset();
            }
          });
        }).observe(confirmModal, { attributes: true, attributeFilter: ['class'] });
      }

    })();

    (function () {
      const fab = document.getElementById('waFloat');
      if (!fab) return;
      let isDragging = false, wasMoved = false;
      let startX, startY, fabX, fabY;

      /* استرجاع الموقع المحفوظ */
      try {
        const saved = JSON.parse(localStorage.getItem('waFloat_pos'));
        if (saved) {
          fab.style.right = 'auto';
          fab.style.bottom = 'auto';
          fab.style.left = Math.min(saved.x, window.innerWidth - 60) + 'px';
          fab.style.top = Math.min(saved.y, window.innerHeight - 60) + 'px';
        }
      } catch (e) { }

      function onStart(e) {
        const ev = e.touches ? e.touches[0] : e;
        const rect = fab.getBoundingClientRect();
        startX = ev.clientX; startY = ev.clientY;
        fabX = rect.left; fabY = rect.top;
        isDragging = true; wasMoved = false;
        fab.classList.add('wa-dragging');
        e.preventDefault();
      }
      function onMove(e) {
        if (!isDragging) return;
        const ev = e.touches ? e.touches[0] : e;
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) wasMoved = true;
        if (!wasMoved) return;
        let nx = fabX + dx, ny = fabY + dy;
        /* حدود الشاشة */
        nx = Math.max(0, Math.min(nx, window.innerWidth - 58));
        ny = Math.max(0, Math.min(ny, window.innerHeight - 58));
        fab.style.right = 'auto';
        fab.style.bottom = 'auto';
        fab.style.left = nx + 'px';
        fab.style.top = ny + 'px';
        e.preventDefault();
      }
      function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        fab.classList.remove('wa-dragging');
        /* snap to nearest edge */
        const rect = fab.getBoundingClientRect();
        const midX = rect.left + rect.width / 2;
        let finalX;
        if (midX < window.innerWidth / 2) {
          finalX = 8;
        } else {
          finalX = window.innerWidth - 58 - 8;
        }
        fab.style.transition = 'left .3s cubic-bezier(.34,1.56,.64,1), top .3s ease';
        fab.style.left = finalX + 'px';
        setTimeout(() => { fab.style.transition = ''; }, 350);
        /* حفظ الموقع */
        try { localStorage.setItem('waFloat_pos', JSON.stringify({ x: finalX, y: rect.top })); } catch (e) { }
        /* إذا لم يتحرك → فتح الرابط */
        if (!wasMoved) {
          window.open(fab.href, '_blank');
        }
      }

      fab.addEventListener('touchstart', onStart, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
      /* دعم الماوس للاختبار */
      fab.addEventListener('mousedown', onStart);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      /* منع فتح الرابط عند السحب */
      fab.addEventListener('click', function (e) { if (wasMoved) { e.preventDefault(); wasMoved = false; } });
    })();


/* =================== EXPOSE GLOBALS FOR INLINE HTML HANDLERS =================== */
window.closeMobileNav = closeMobileNav;
window.openSizeCalc = openSizeCalc;
window.closeSizeCalc = closeSizeCalc;
window.calcSize = calcSize;
window.closeCart = closeCart;
window.openCart = openCart;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.changeQty = changeQty;
