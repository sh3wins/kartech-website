  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 40);
  }, { passive:true });

  const tnSection = document.getElementById('thenNow');
  if (tnSection) {
  const tnDivider = document.getElementById('tnDivider');
  const tnThen = document.querySelector('.tn-panel.then');
  function updateDivider(){
    const rect = tnSection.getBoundingClientRect();
    const vh = window.innerHeight;
    let progress = 1 - (rect.top / vh);
    progress = Math.min(1, Math.max(0, progress));
    tnDivider.style.left = (progress * 100) + '%';
    tnThen.style.flex = (1 - progress * 0.9);
  }
  window.addEventListener('scroll', updateDivider, { passive:true });
  updateDivider();
  }

  const evoWords = ['TABLES','CHAIRS','HOSPITALITY','OUTDOOR','CHURCHES','SCHOOLS','WAITING SEATS','KITCHENS','CUSTOM'];
  const evoSection = document.getElementById('evolution');
  if (evoSection) {
  const evoWordEl = document.getElementById('evoWord');
  const evoProgressEl = document.getElementById('evoProgress');
  evoWords.forEach((_,i) => {
    const dot = document.createElement('span');
    if(i===0) dot.classList.add('active');
    evoProgressEl.appendChild(dot);
  });
  let lastEvoIndex = 0;
  function updateEvolution(){
    const rect = evoSection.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    let progress = -rect.top / total;
    progress = Math.min(1, Math.max(0, progress));
    const index = Math.min(evoWords.length - 1, Math.floor(progress * evoWords.length));
    if(index !== lastEvoIndex || evoWordEl.textContent === ''){
      evoWordEl.style.opacity = 0;
      setTimeout(() => {
        evoWordEl.textContent = evoWords[index];
        evoWordEl.style.opacity = 1;
      }, 120);
      lastEvoIndex = index;
      [...evoProgressEl.children].forEach((d,i2) => d.classList.toggle('active', i2 === index));
    }
  }
  window.addEventListener('scroll', updateEvolution, { passive:true });
  updateEvolution();
  }

  const siPanel = document.getElementById('siPanel');
  if (siPanel) {
  const siName = document.getElementById('siName');
  const siInfo = document.getElementById('siInfo');
  document.querySelectorAll('.hotspot').forEach(hs => {
    hs.addEventListener('click', () => {
      siName.textContent = hs.dataset.name;
      siInfo.textContent = hs.dataset.info;
      siPanel.classList.add('open');
    });
  });
  document.getElementById('siClose').addEventListener('click', () => siPanel.classList.remove('open'));
  }

  document.querySelectorAll('.person').forEach(p => {
    p.addEventListener('click', () => p.classList.toggle('open'));
  });

  /* ===== SCREENS 15–17 ===== */
  (function(){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deskMQ = window.matchMedia('(min-width: 861px)');
    const hoverMQ = window.matchMedia('(hover: hover)');
    const isDesk = () => deskMQ.matches;

    /* mobile menu */
    const siteNav = document.getElementById('siteNav');
    const menuBtn = siteNav.querySelector('.menu-btn');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    siteNav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));

    /* reveal on scroll */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.rv, .ri, .io').forEach(el => io.observe(el));

    /* tap-to-reveal (works with touch + keyboard, not just hover) */
    document.querySelectorAll('[data-tap]').forEach(el => {
      el.addEventListener('click', () => el.classList.toggle('open'));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.classList.toggle('open'); }
      });
    });

    /* switchers: machinery (15.4) + customisation options (17.6) */
    document.querySelectorAll('[data-switch]').forEach(group => {
      const items = [...group.querySelectorAll('[data-switch-item]')];
      const set = item => items.forEach(i => {
        const on = i === item;
        i.classList.toggle('on', on);
        i.querySelector('button').setAttribute('aria-expanded', on);
      });
      items.forEach(item => {
        const btn = item.querySelector('button');
        btn.addEventListener('click', () => set(item));
        btn.addEventListener('mouseenter', () => { if (isDesk() && hoverMQ.matches) set(item); });
      });
      set(items[0]);
    });

    /* 15.3 making process — scroll moves sideways on desktop, swipe on mobile */
    let setStage = () => {}, sizeProc = () => {}, updateProc = () => {};
    const proc = document.getElementById('wProc');
    if (proc) {
    const track = document.getElementById('wTrack');
    const stages = [...track.children];
    const stepBtns = [...document.querySelectorAll('#wSteps button')];
    let procActive = -1;
    setStage = function(i){
      if (i === procActive) return;
      procActive = i;
      stages.forEach((s, k) => s.classList.toggle('on', k === i));
      stepBtns.forEach((b, k) => b.classList.toggle('on', k === i));
    }
    const trackDist = () => Math.max(0, track.scrollWidth - track.clientWidth);
    sizeProc = function(){
      if (isDesk()){
        proc.style.height = (window.innerHeight + trackDist()) + 'px';
      } else {
        proc.style.height = '';
        track.style.transform = '';
      }
    }
    updateProc = function(){
      if (!isDesk()) return;
      const total = proc.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -proc.getBoundingClientRect().top / total));
      track.style.transform = `translate3d(${-p * trackDist()}px,0,0)`;
      setStage(Math.round(p * (stages.length - 1)));
    }
    track.addEventListener('scroll', () => {
      if (isDesk()) return;
      const step = stages[1].offsetLeft - stages[0].offsetLeft;
      setStage(Math.min(stages.length - 1, Math.round(track.scrollLeft / step)));
    }, { passive: true });
    stepBtns.forEach((b, i) => b.addEventListener('click', () => {
      if (isDesk()){
        const total = proc.offsetHeight - window.innerHeight;
        const top = proc.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + total * (i / (stages.length - 1)) + 1, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        track.scrollTo({ left: stages[i].offsetLeft - stages[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      }
    }));

    }

    /* 15.1 slow push-in + 15.5 subtle parallax */
    const zooms = [...document.querySelectorAll('[data-zoom]')];
    const pars = [...document.querySelectorAll('[data-speed]')];
    function updateMotion(){
      if (reduce) return;
      zooms.forEach(z => {
        const r = z.parentElement.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / r.height));
        z.style.transform = `scale(${1 + p * 0.12})`;
      });
      const vh = window.innerHeight;
      pars.forEach(el => {
        const inner = el.firstElementChild;
        if (!isDesk()){ inner.style.transform = ''; return; }
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const offset = (r.top + r.height / 2) - vh / 2;
        inner.style.transform = `translate3d(0,${offset * parseFloat(el.dataset.speed)}px,0)`;
      });
    }

    /* chapter label in the nav */
    const navChapter = document.getElementById('navChapter');
    const chapters = [...document.querySelectorAll('[data-chapter]')];
    function updateChapter(){
      const line = window.innerHeight * 0.4;
      let cur = '';
      chapters.forEach(c => {
        const r = c.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) cur = c.dataset.chapter;
      });
      if (cur && navChapter.textContent !== cur) navChapter.textContent = cur;
      navChapter.classList.toggle('show', !!cur);
    }

    /* 17.3 before / after slider */
    const ba = document.getElementById('maBA');
    if (ba) {
    const knob = ba.querySelector('.ma-ba-knob');
    const layerFrom = ba.querySelector('.ma-ba-from');
    const layerTo = ba.querySelector('.ma-ba-to');
    const capFrom = document.getElementById('maCapFrom');
    const capTo = document.getElementById('maCapTo');
    let pos = 50, dragging = false;
    function setPos(v){
      pos = Math.max(0, Math.min(100, v));
      ba.style.setProperty('--pos', pos + '%');
      knob.setAttribute('aria-valuenow', Math.round(pos));
    }
    function moveTo(e){
      const r = ba.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    }
    ba.addEventListener('pointerdown', e => {
      dragging = true;
      try { ba.setPointerCapture(e.pointerId); } catch(_) {}
      if (e.pointerType !== 'touch') moveTo(e);   // on touch, wait for a sideways drag so vertical scrolling still works
    });
    ba.addEventListener('pointermove', e => { if (dragging) moveTo(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => ba.addEventListener(t, () => { dragging = false; }));
    knob.addEventListener('keydown', e => {
      const map = { ArrowLeft: -5, ArrowRight: 5, ArrowDown: -5, ArrowUp: 5 };
      if (map[e.key] !== undefined){ setPos(pos + map[e.key]); e.preventDefault(); }
      else if (e.key === 'Home'){ setPos(0); e.preventDefault(); }
      else if (e.key === 'End'){ setPos(100); e.preventDefault(); }
    });
    function swapMedia(layer, shot, img, alt){
      layer.dataset.shot = shot;
      layer.innerHTML = '';
      if (img){
        const el = document.createElement('img');
        el.src = img; el.alt = alt; el.draggable = false;
        layer.appendChild(el);
      }
    }
    const pairBtns = [...document.querySelectorAll('#maPairs button')];
    pairBtns.forEach(b => b.addEventListener('click', () => {
      pairBtns.forEach(x => x.classList.toggle('on', x === b));
      swapMedia(layerFrom, b.dataset.fromShot, b.dataset.fromImg, b.dataset.from);
      swapMedia(layerTo, b.dataset.toShot, b.dataset.toImg, b.dataset.to);
      capFrom.textContent = b.dataset.from;
      capTo.textContent = b.dataset.to;
      setPos(50);
    }));

    }

    /* one scroll loop for everything */
    let ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateProc(); updateMotion(); updateChapter(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { sizeProc(); onScroll(); });
    window.addEventListener('load', () => { sizeProc(); onScroll(); });
    setStage(0);
    sizeProc();
    updateProc(); updateMotion(); updateChapter();
  })();

  /* ===== SHOP · PRODUCT VIEW · CART · ORDERS · TRACKING · CUSTOM REQUESTS ===== */
  (function(){
    const $  = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
    const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
    const money = n => KARTECH.currency + ' ' + Math.round(n).toLocaleString('en-KE');
    const subtotalLabel = t => (t.sum === 0 && t.unpriced) ? 'On request' : money(t.sum);
    const priceLabel = (p, from) => p.price == null ? 'Price on request' : (from ? 'From ' : '') + money(p.price);
    const digits = s => String(s || '').replace(/\D/g, '');
    const validPhone = s => digits(s).length >= 9;
    const validEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    const store = {
      get(k, d){ try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(_) { return d; } },
      set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(_) {} }
    };
    const waLink = text => (digits(KARTECH.whatsapp) ? 'https://wa.me/' + digits(KARTECH.whatsapp) : 'https://wa.me/') + '?text=' + encodeURIComponent(text);
    const mailLink = (subject, body) => 'mailto:' + KARTECH.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const imgTag = (src, alt) => src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : '';
    const firstImg = p => imgTag((p.images || [])[0], p.name);
    function makeCode(prefix){
      const d = new Date();
      const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
      const rnd = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, 'X');
      return `${prefix}-${ymd}-${rnd}`;
    }
    const db = (KARTECH.supabaseUrl && KARTECH.supabaseKey && window.supabase)
      ? window.supabase.createClient(KARTECH.supabaseUrl, KARTECH.supabaseKey)
      : null;
    const joinList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

    /* toast */
    const toast = $('#kToast'); let toastTimer;
    function showToast(html){
      toast.innerHTML = html; toast.classList.add('show');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
    }

    /* contact details from settings */
    $$('[data-cfg]').forEach(el => {
      const k = el.dataset.cfg;
      if (k === 'phone'){
        el.textContent = KARTECH.phoneDisplay;
        if (digits(KARTECH.whatsapp)) el.href = 'tel:+' + digits(KARTECH.whatsapp);
      } else if (k === 'wa'){
        el.href = waLink('Hello Kartech, '); el.target = '_blank'; el.rel = 'noopener';
      } else if (k === 'email' && KARTECH.email){
        el.textContent = KARTECH.email; el.href = 'mailto:' + KARTECH.email;
      }
    });
    if (!KARTECH.email || db) $$('#cfEmailBtn').forEach(b => b.hidden = true);
    if (db) $$('.cf-note').forEach(n => n.textContent = 'Your request and any photos go straight to Kartech. We\'ll get back to you on the phone number or email you give us.');

    /* product mentions around the site pick up name / label / photo from PRODUCTS */
    $$('[data-product]').forEach(el => {
      if (el.classList.contains('hotspot')) return;
      const p = byId[el.dataset.product]; if (!p) return;
      const h = el.querySelector('h4'); if (h) h.textContent = p.name;
      const c = el.querySelector('.cat'); if (c) c.textContent = p.space;
      el.querySelectorAll('a').forEach(a => a.href = '#product-' + p.id);
      const ph = el.querySelector('.ph');
      if (ph && !el.hasAttribute('data-keep-img') && p.images && p.images[0]) ph.innerHTML = firstImg(p);
    });

    /* step inside hotspots → product link */
    const siLink = $('#siLink');
    $$('.hotspot').forEach(hs => hs.addEventListener('click', () => {
      const p = byId[hs.dataset.product];
      if (p){ siLink.href = '#product-' + p.id; siLink.hidden = false; } else siLink.hidden = true;
    }));

    /* ---------- SHOP GRID + TABS ---------- */
    const grid = $('#shopGrid');
    if (grid) {
    const tabs = $$('.shop-tabs span');
    let filter = 'All';
    function renderShop(){
      const list = PRODUCTS.filter(p => filter === 'All' || (p.tags || []).includes(filter));
      grid.innerHTML = list.length ? list.map(p => `
        <a class="product-card" href="#product-${esc(p.id)}">
          <div class="product-img ph lt" data-shot="Product photo — ${esc(p.name)}">${firstImg(p)}</div>
          <h4>${esc(p.name)}</h4>
          <div class="price">${esc(priceLabel(p, true))}</div>
          <div class="finishes">${p.finishes.length > 1 ? `Available in ${p.finishes.length} colours` : p.finishes.length ? esc(p.finishes[0].name) : ''}</div>
        </a>`).join('')
        : `<p class="shop-empty">No pieces in this category yet. <a href="#custom-request">Ask us to build one →</a></p>`;
    }
    function setFilter(f){
      filter = f;
      tabs.forEach(t => { const on = t.textContent.trim() === f; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
      renderShop();
    }
    $('.shop-tabs').setAttribute('role', 'tablist');
    tabs.forEach(t => {
      t.setAttribute('role', 'tab'); t.tabIndex = 0;
      t.addEventListener('click', () => setFilter(t.textContent.trim()));
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setFilter(t.textContent.trim()); } });
    });
    $$('[data-filter]').forEach(a => a.addEventListener('click', () => setFilter(a.dataset.filter)));
    setFilter('All');
    }

    /* ---------- PRODUCT PAGE (featured section + product view) ---------- */
    function productHTML(p){
      const imgs = p.images || [];
      const thumbs = [0, 1, 2].map(i => `<button type="button" class="pp-thumb ph lt${i === 0 ? ' on' : ''}" data-i="${i}" aria-label="Image ${i + 1}">${imgTag(imgs[i], '')}</button>`).join('');
      const swatches = p.finishes.map((f, i) => `<button type="button" class="pp-sw${i === 0 ? ' sel' : ''}" style="background:${esc(f.color)}" data-finish="${esc(f.name)}" aria-label="${esc(f.name)}" aria-pressed="${i === 0}"></button>`).join('');
      const acc = [['About the piece', p.about], ['Dimensions', p.dimensions], ['Materials', p.materials], ['Care', p.care], ['Delivery', p.delivery]]
        .map(([t, b], i) => `<div class="pp-accordion${i === 0 ? ' open' : ''}"><h5><button type="button" aria-expanded="${i === 0}">${t}</button></h5><p>${esc(b)}</p></div>`).join('');
      return `
      <div class="pp-wrap">
        <div>
          <div class="pp-gallery-main ph lt" data-shot="Product photo — ${esc(p.name)}">${imgTag(imgs[0], p.name)}</div>
          <div class="pp-thumbs">${thumbs}</div>
        </div>
        <div>
          <p class="pp-cat">${esc(p.space)}</p>
          <h2 class="pp-name">${esc(p.name)}</h2>
          <div class="pp-price">${esc(priceLabel(p, true))}${p.availability ? ' · ' + esc(p.availability) : ''}</div>
          <div class="pp-section"><label>MATERIAL</label><span>${esc(p.material)}</span></div>
          ${p.finishes.length ? `<div class="pp-section"><label>FINISH — <span class="pp-finish-name">${esc(p.finishes[0].name)}</span></label><div class="swatches">${swatches}</div></div>` : ''}
          <div class="pp-section"><label>QUANTITY</label><div class="qty"><button type="button" data-q="-1" aria-label="Fewer">&minus;</button><span class="pp-qty">1</span><button type="button" data-q="1" aria-label="More">+</button></div></div>
          <button type="button" class="pp-cta" data-add>Add to cart →</button>
          <button type="button" class="pp-secondary" data-custom>Request custom version</button>
          ${p.price == null ? `<p class="pp-note">Price on request — Kartech will confirm the price with you when you order.</p>` : ''}
        </div>
      </div>
      <div class="pp-details">${acc}</div>`;
    }
    function bindProduct(root, p){
      let qty = 1, finish = p.finishes[0] ? p.finishes[0].name : '';
      const main = root.querySelector('.pp-gallery-main');
      root.querySelectorAll('.pp-thumb').forEach(t => t.addEventListener('click', () => {
        root.querySelectorAll('.pp-thumb').forEach(x => x.classList.toggle('on', x === t));
        main.innerHTML = imgTag((p.images || [])[+t.dataset.i], p.name);
      }));
      root.querySelectorAll('.pp-sw').forEach(s => s.addEventListener('click', () => {
        finish = s.dataset.finish;
        root.querySelectorAll('.pp-sw').forEach(x => { x.classList.toggle('sel', x === s); x.setAttribute('aria-pressed', x === s); });
        const n = root.querySelector('.pp-finish-name'); if (n) n.textContent = finish;
      }));
      root.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
        qty = Math.max(1, Math.min(99, qty + Number(b.dataset.q)));
        root.querySelector('.pp-qty').textContent = qty;
      }));
      const add = root.querySelector('[data-add]');
      add.addEventListener('click', () => {
        addToCart(p.id, finish, qty);
        add.textContent = 'Added ✓';
        setTimeout(() => { add.textContent = 'Add to cart →'; }, 1600);
      });
      root.querySelector('[data-custom]').addEventListener('click', () => requestCustom(p, finish));
      root.querySelectorAll('.pp-accordion').forEach(acc => acc.querySelector('button').addEventListener('click', () => {
        const was = acc.classList.contains('open');
        root.querySelectorAll('.pp-accordion').forEach(a => { a.classList.remove('open'); a.querySelector('button').setAttribute('aria-expanded', 'false'); });
        if (!was){ acc.classList.add('open'); acc.querySelector('button').setAttribute('aria-expanded', 'true'); }
      }));
    }
    const featured = $('[data-product-page]');
    if (featured && byId[featured.dataset.productPage]){
      const p = byId[featured.dataset.productPage];
      featured.innerHTML = `<p class="k-kicker pp-kicker">Featured piece</p>` + productHTML(p);
      bindProduct(featured, p);
    }

    /* ---------- OPEN / CLOSE (driven by the address bar: #product-… and #cart) ---------- */
    const pv = $('#productView'), pvBody = $('#pvBody');
    const drawer = $('#cartDrawer');
    let pvReturn = null, ctReturn = null;
    const syncLock = () => document.documentElement.classList.toggle('k-lock', pv.classList.contains('open') || drawer.classList.contains('open'));
    const clearHash = () => history.replaceState(null, '', location.pathname + location.search);

    function openProduct(id){
      const p = byId[id];
      if (!p){ closeProduct(true); return; }
      closeCart(true);
      if (!pv.classList.contains('open')) pvReturn = document.activeElement;
      pvBody.innerHTML = productHTML(p);
      bindProduct(pvBody, p);
      pv.scrollTop = 0;
      pv.classList.add('open'); pv.setAttribute('aria-hidden', 'false'); syncLock();
      setTimeout(() => $('.pv-close').focus({ preventScroll: true }), 60);
    }
    function closeProduct(silent){
      if (!pv.classList.contains('open')) return;
      pv.classList.remove('open'); pv.setAttribute('aria-hidden', 'true'); syncLock();
      if (!silent && pvReturn) pvReturn.focus({ preventScroll: true });
    }
    function route(){
      const h = decodeURIComponent(location.hash);
      if (h.startsWith('#product-')) openProduct(h.slice(9));
      else if (h === '#cart') openCart();
      else { closeProduct(true); closeCart(true); }
    }
    window.addEventListener('hashchange', route);
    $$('[data-pv-close]').forEach(b => b.addEventListener('click', () => { clearHash(); closeProduct(); }));
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (pv.classList.contains('open')){ clearHash(); closeProduct(); }
      else if (drawer.classList.contains('open')){ clearHash(); closeCart(); }
    });

    function requestCustom(p, finish){
      clearHash(); closeProduct(true); closeCart(true);
      const ta = $('#cfNeed');
      if (!ta){ location.href = 'index.html#custom-request'; return; }
      $('#customForm').hidden = false; $('#cfDone').hidden = true;
      ta.value = `Custom version of the ${p.name}${finish ? ` (I saw it in ${finish})` : ''}.\n\nWhat I'd like changed: `;
      $('#custom-request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }, 700);
    }

    /* ---------- CART ---------- */
    const CART_KEY = 'kartech_cart_v1', ORDERS_KEY = 'kartech_orders_v1';
    let cart = store.get(CART_KEY, []).filter(i => byId[i.id] && i.qty > 0);
    const cBody = $('#cartBody'), cFoot = $('#cartFoot'), cTitle = $('#cartTitle');
    let view = 'items', lastOrder = null;

    function updateCount(){
      const n = cart.reduce((a, i) => a + i.qty, 0);
      $$('.cart-count').forEach(c => c.textContent = n ? n : '');
      $$('#navCart, .nav-cart-m').forEach(a => a.setAttribute('aria-label', `Cart, ${n} item${n === 1 ? '' : 's'}`));
    }
    const saveCart = () => { store.set(CART_KEY, cart); updateCount(); };
    function totals(){
      let sum = 0, unpriced = 0;
      cart.forEach(i => { const p = byId[i.id]; if (p.price == null) unpriced += i.qty; else sum += p.price * i.qty; });
      return { sum, unpriced };
    }
    function addToCart(id, finish, qty){
      const line = cart.find(i => i.id === id && i.finish === finish);
      if (line) line.qty = Math.min(99, line.qty + qty); else cart.push({ id, finish, qty });
      saveCart();
      if (view === 'done'){ view = 'items'; lastOrder = null; }
      if (drawer.classList.contains('open')) renderCart();
      showToast(`<span>${esc(byId[id].name)} added to cart</span><a href="#cart">View cart →</a>`);
    }
    function openCart(){
      closeProduct(true);
      toast.classList.remove('show');
      if (!drawer.classList.contains('open')) ctReturn = document.activeElement;
      renderCart();
      drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); syncLock();
      setTimeout(() => $('.ct-close').focus({ preventScroll: true }), 60);
    }
    function closeCart(silent){
      if (!drawer.classList.contains('open')) return;
      drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
      if (view === 'done'){ view = 'items'; lastOrder = null; }
      syncLock();
      if (!silent && ctReturn) ctReturn.focus({ preventScroll: true });
    }

    function renderCart(){
      if (view === 'checkout' && !cart.length) view = 'items';
      if (view === 'items'){
        cTitle.textContent = 'Your cart';
        if (!cart.length){
          cBody.innerHTML = `
            <div class="ct-empty">
              <p class="k-h3">Your cart is empty.</p>
              <p>Browse the shop, or tell us what you need built.</p>
              <div class="ct-empty-links">
                <a href="index.html#shop" class="k-btn dark">Go to the shop <span aria-hidden="true">→</span></a>
                <a href="index.html#custom-request" class="ct-link">Start a custom request →</a>
              </div>
            </div>`;
          cFoot.innerHTML = '';
          return;
        }
        cBody.innerHTML = `<ul class="ct-list">${cart.map((i, idx) => {
          const p = byId[i.id];
          return `
          <li class="ct-item">
            <a class="ct-thumb ph lt" href="#product-${esc(p.id)}" aria-label="${esc(p.name)}">${firstImg(p)}</a>
            <div>
              <div class="ct-row"><a class="ct-name" href="#product-${esc(p.id)}">${esc(p.name)}</a><span class="ct-price">${p.price == null ? 'On request' : money(p.price * i.qty)}</span></div>
              ${i.finish ? `<p class="ct-meta">Finish: ${esc(i.finish)}</p>` : ''}
              <div class="ct-row">
                <div class="qty ct-qty"><button type="button" data-cq="-1" data-i="${idx}" aria-label="Fewer">&minus;</button><span>${i.qty}</span><button type="button" data-cq="1" data-i="${idx}" aria-label="More">+</button></div>
                <button type="button" class="ct-remove" data-rm="${idx}">Remove</button>
              </div>
            </div>
          </li>`; }).join('')}</ul>`;
        const t = totals();
        cFoot.innerHTML = `
          <div class="ct-total"><span>Subtotal</span><strong>${subtotalLabel(t)}</strong></div>
          ${t.unpriced ? `<p class="ct-small">+ ${t.unpriced} item${t.unpriced > 1 ? 's' : ''} priced on request. Kartech will confirm the final price.</p>` : ''}
          <p class="ct-small">Delivery costs are confirmed with your order.</p>
          <button type="button" class="ct-btn" data-go="checkout">Checkout <span aria-hidden="true">→</span></button>`;
      }
      else if (view === 'checkout'){
        cTitle.textContent = 'Checkout';
        const t = totals();
        cBody.innerHTML = `
          <form class="ct-form" id="ctForm" novalidate>
            <p class="ct-step">Your details</p>
            <label class="ct-field"><span>Full name</span><input name="fullname" autocomplete="name"></label>
            <label class="ct-field"><span>Phone / WhatsApp</span><input name="phone" type="tel" autocomplete="tel" placeholder="07XX XXX XXX"></label>
            <label class="ct-field"><span>Email <em>(optional)</em></span><input name="email" type="email" autocomplete="email"></label>
            <p class="ct-step">Delivery or collection</p>
            <div class="ct-choice" role="radiogroup" aria-label="Delivery or collection">
              <label><input type="radio" name="fulfil" value="Delivery" checked> Deliver to me</label>
              <label><input type="radio" name="fulfil" value="Collect from Mtindwa"> Collect from Mtindwa</label>
              <label><input type="radio" name="fulfil" value="Collect from Utawala"> Collect from Utawala</label>
            </div>
            <label class="ct-field" data-deliv><span>Delivery location</span><input name="loc" placeholder="Area, town, building or landmark"></label>
            <label class="ct-field"><span>Notes <em>(optional)</em></span><textarea name="notes" rows="3" placeholder="Anything we should know — access, timing, sizes..."></textarea></label>
            <div class="ct-summary">
              ${cart.map(i => { const p = byId[i.id]; return `<div class="ct-row"><span>${i.qty} × ${esc(p.name)}${i.finish ? ` <em>(${esc(i.finish)})</em>` : ''}</span><span>${p.price == null ? 'On request' : money(p.price * i.qty)}</span></div>`; }).join('')}
              <div class="ct-row ct-sum"><span>Subtotal</span><strong>${subtotalLabel(t)}</strong></div>
            </div>
            <p class="ct-err" id="ctErr" role="alert"></p>
          </form>`;
        cFoot.innerHTML = `
          <button type="submit" form="ctForm" class="ct-btn">${db ? 'Place order' : 'Send order on WhatsApp'} <span aria-hidden="true">→</span></button>
          ${KARTECH.email && !db ? `<button type="button" class="ct-alt" data-email>Send by email instead</button>` : ''}
          <button type="button" class="ct-back" data-go="items">← Back to cart</button>
          <p class="ct-small">No payment is taken on this site. Kartech will confirm your order, the price and delivery, and how to pay.</p>`;
        const form = $('#ctForm');
        const deliv = form.querySelector('[data-deliv]');
        form.addEventListener('change', () => { deliv.hidden = form.querySelector('input[name="fulfil"]:checked').value !== 'Delivery'; });
        form.addEventListener('submit', e => { e.preventDefault(); placeOrder('wa'); });
        const eb = cFoot.querySelector('[data-email]');
        if (eb) eb.addEventListener('click', () => placeOrder('email'));
      }
      else if (view === 'done' && lastOrder){
        const o = lastOrder;
        cTitle.textContent = o.saved ? 'Order placed' : 'Order ready to send';
        if (o.saved){
          cBody.innerHTML = `
          <div class="ct-done">
            <p class="k-label">Your order number</p>
            <p class="ct-no">${esc(o.no)}</p>
            <p>Thank you, ${esc(o.name)}. Kartech has received your order and will contact you on <strong>${esc(o.phone)}</strong> to confirm the price, delivery and payment.</p>
            <p>Keep this number — you can use it to track your order.</p>
            <div class="ct-done-links">
              <a class="ct-btn" href="${esc(o.url)}" target="_blank" rel="noopener">Also message us on WhatsApp <span aria-hidden="true">→</span></a>
              <a class="ct-link" href="#track" data-track="${esc(o.no)}">Track this order →</a>
            </div>
          </div>`;
          cFoot.innerHTML = '';
          return;
        }
        cBody.innerHTML = `
          <div class="ct-done">
            <p class="k-label">Your order number</p>
            <p class="ct-no">${esc(o.no)}</p>
            <p>${o.channel === 'email' ? 'Your email app' : 'WhatsApp'} has opened with your order filled in. <strong>Press send</strong> so it reaches Kartech.</p>
            <p>Keep this number — you can use it to track your order.</p>
            <div class="ct-done-links">
              <a class="ct-btn" href="${esc(o.url)}" target="_blank" rel="noopener">Didn't open? Send again <span aria-hidden="true">→</span></a>
              <a class="ct-link" href="#track" data-track="${esc(o.no)}">Track this order →</a>
            </div>
          </div>`;
        cFoot.innerHTML = '';
      }
    }

    async function placeOrder(channel){
      const form = $('#ctForm'), err = $('#ctErr');
      const g = n => form.elements.namedItem(n);
      const name = g('fullname').value.trim(), phone = g('phone').value.trim(), email = g('email').value.trim();
      const fulfil = form.querySelector('input[name="fulfil"]:checked').value;
      const loc = g('loc').value.trim(), notes = g('notes').value.trim();
      form.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
      const problems = [];
      const mark = (n, msg) => { problems.push(msg); g(n).closest('.ct-field').classList.add('bad'); };
      if (!name) mark('fullname', 'your name');
      if (!validPhone(phone)) mark('phone', 'a phone number');
      if (fulfil === 'Delivery' && !loc) mark('loc', 'a delivery location');
      if (email && !validEmail(email)) mark('email', 'a valid email');
      if (problems.length){
        err.textContent = 'Please add ' + joinList(problems) + '.';
        const first = form.querySelector('.bad input, .bad textarea'); if (first) first.focus();
        return;
      }
      const t = totals();
      const order = {
        no: null, saved: false, date: new Date().toISOString(), channel,
        name, phone, email, fulfil, loc, notes,
        items: cart.map(i => ({ id: i.id, name: byId[i.id].name, finish: i.finish, qty: i.qty, price: byId[i.id].price })),
        subtotal: t.sum, unpriced: t.unpriced
      };
      if (db){
        const btns = $$('#cartFoot button');
        const sendBtn = cFoot.querySelector('.ct-btn');
        const label = sendBtn.innerHTML;
        btns.forEach(b => b.disabled = true);
        sendBtn.textContent = 'Placing your order…';
        err.textContent = '';
        const { data, error } = await db.rpc('place_order', { p: {
          name, phone, email, fulfilment: fulfil, location: loc, notes,
          items: order.items, subtotal: t.sum, unpriced: t.unpriced
        } });
        if (error || !data){
          btns.forEach(b => b.disabled = false);
          sendBtn.innerHTML = label;
          err.textContent = "We couldn't place your order just now. Check your internet connection and try again.";
          return;
        }
        order.no = data; order.saved = true;
      } else {
        order.no = makeCode('KT');
      }
      const text = [
        `${order.saved ? 'Hello Kartech, I just placed order' : 'New order —'} ${order.no}`, '',
        `Name: ${name}`, `Phone: ${phone}`, email ? `Email: ${email}` : null,
        fulfil === 'Delivery' ? `Delivery to: ${loc}` : fulfil, '',
        'Items:',
        ...order.items.map(i => `• ${i.qty} × ${i.name}${i.finish ? ` (${i.finish})` : ''} — ${i.price == null ? 'price on request' : money(i.price * i.qty)}`),
        '',
        `Subtotal: ${subtotalLabel(t)}${t.sum && t.unpriced ? ` + ${t.unpriced} item(s) priced on request` : ''}`,
        notes ? `\nNotes: ${notes}` : null
      ].filter(x => x !== null).join('\n');
      order.url = channel === 'email' ? mailLink(`New order ${order.no}`, text) : waLink(text);

      const orders = store.get(ORDERS_KEY, []);
      orders.unshift(order);
      store.set(ORDERS_KEY, orders.slice(0, 20));
      cart = []; saveCart();
      lastOrder = order; view = 'done'; renderCart(); renderRecent();

      if (order.saved) return;               // saved in the database — WhatsApp is optional
      if (channel === 'email') window.location.href = order.url;
      else window.open(order.url, '_blank', 'noopener');
    }

    drawer.addEventListener('click', e => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.dataset.cq){
        const i = Number(t.dataset.i);
        cart[i].qty = Math.max(1, Math.min(99, cart[i].qty + Number(t.dataset.cq)));
        saveCart(); renderCart();
      } else if (t.dataset.rm !== undefined){
        cart.splice(Number(t.dataset.rm), 1); saveCart(); renderCart();
      } else if (t.dataset.go){
        view = t.dataset.go; renderCart(); cBody.scrollTop = 0;
      } else if (t.hasAttribute('data-close')){
        clearHash(); closeCart();
      } else if (t.dataset.track && lastOrder && trForm){
        $('#trNo').value = lastOrder.no; $('#trPhone').value = lastOrder.phone;
        setTimeout(() => trForm.requestSubmit(), 80);
      }
    });
    $('#ctBackdrop').addEventListener('click', () => { clearHash(); closeCart(); });

    /* ---------- TRACK YOUR ORDER ---------- */
    const STAGES = [['received', 'Received'], ['confirmed', 'Confirmed'], ['workshop', 'In the workshop'], ['ready', 'Ready'], ['delivered', 'Delivered / collected']];
    const trForm = $('#trackForm'), trOut = $('#trackResult'), trRecent = $('#trRecent');
    function renderRecent(){
      if (!trRecent) return;
      const o = store.get(ORDERS_KEY, []);
      trRecent.innerHTML = o.length
        ? `<span class="k-label muted">Orders on this device:</span> ` + o.slice(0, 4).map(x => `<button type="button" data-no="${esc(x.no)}" data-ph="${esc(x.phone)}">${esc(x.no)}</button>`).join('')
        : '';
    }
    if (trForm) {
    trRecent.addEventListener('click', e => {
      const b = e.target.closest('[data-no]'); if (!b) return;
      $('#trNo').value = b.dataset.no; $('#trPhone').value = b.dataset.ph;
      trForm.requestSubmit();
    });
    function renderTrack(o){
      const ask = waLink(`Hello Kartech, I'd like an update on my order ${o.no}.`);
      const placed = o.date ? new Date(o.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      const cancelled = o.status === 'cancelled';
      const idx = Math.max(0, STAGES.findIndex(s => s[0] === o.status));
      trOut.innerHTML = `
        <div class="tr-card">
          <div class="tr-top">
            <div><p class="k-label muted">Order</p><p class="tr-no">${esc(o.no)}</p></div>
            ${placed ? `<div><p class="k-label muted">Placed</p><p>${placed}</p></div>` : ''}
            <div><p class="k-label muted">Status</p><p><strong>${cancelled ? 'Cancelled' : STAGES[idx][1]}</strong></p></div>
          </div>
          ${cancelled
            ? `<p class="tr-msg">This order has been cancelled. If that's unexpected, contact Kartech.</p>`
            : `<ol class="tr-stages">${STAGES.map((s, i) => `<li class="${i < idx ? 'done' : ''}${i === idx ? ' now' : ''}"><span class="tr-dot"></span>${s[1]}</li>`).join('')}</ol>`}
          ${o.workshop && o.workshop.length && !cancelled ? `
          <div class="tr-ws">
            <p class="k-label"><span class="tr-live"></span>Live from the workshop</p>
            ${o.workshop.map(w => `
              <div class="tr-ws-item">
                <p class="tr-ws-name">${w.qty} × ${esc(w.item)}</p>
                <ol class="tr-ws-steps">${(w.steps || []).map(s => `<li class="${s.status === 'done' ? 'done' : (s.status === 'working' || s.status === 'assigned') ? 'now' : ''}">${esc(s.name)}</li>`).join('')}</ol>
              </div>`).join('')}
            <p class="tr-ws-note">This updates by itself as each step is finished in our workshop.</p>
          </div>` : (o.note ? `<p class="tr-msg"><strong>Message from Kartech:</strong> ${esc(o.note)}</p>` : '')}
          ${o.pending ? `<p class="tr-msg">Your order has been sent. Kartech will confirm it with you on WhatsApp, and each step will show here once it's updated.</p>` : ''}
          ${o.items && o.items.length ? `<ul class="tr-items">${o.items.map(i => `<li><span>${i.qty} × ${esc(i.name)}${i.finish ? ` (${esc(i.finish)})` : ''}</span><span>${i.price == null ? 'On request' : money(i.price * i.qty)}</span></li>`).join('')}</ul>` : ''}
          <a class="ct-link" target="_blank" rel="noopener" href="${esc(ask)}">Ask for an update on WhatsApp →</a>
        </div>`;
    }
    function trackNotFound(no, msg){
      const ask = waLink(`Hello Kartech, I'd like an update on my order ${no}.`);
      trOut.innerHTML = `
        <div class="tr-card">
          <p class="tr-msg" style="margin-top:0">${msg || `<strong>We couldn't find ${esc(no)}.</strong> Check the order number and phone number, or ask Kartech directly.`}</p>
          <a class="k-btn dark" target="_blank" rel="noopener" href="${esc(ask)}">Ask on WhatsApp <span aria-hidden="true">→</span></a>
        </div>`;
    }
    trForm.addEventListener('submit', async e => {
      e.preventDefault();
      const no = $('#trNo').value.trim().toUpperCase().replace(/\s+/g, '');
      const ph = digits($('#trPhone').value);
      if (!no || ph.length < 9){
        trOut.innerHTML = `<div class="tr-card"><p class="tr-msg" style="margin-top:0">Enter your order number (it starts with KT) and the phone number you ordered with.</p></div>`;
        return;
      }
      if (db){
        trOut.innerHTML = `<div class="tr-card"><p class="tr-msg" style="margin-top:0">Checking your order…</p></div>`;
        const { data, error } = await db.rpc('track_order', { p_order_no: no, p_phone: ph });
        if (error){ trackNotFound(no, `<strong>We couldn't check right now.</strong> Check your internet connection and try again, or ask Kartech directly.`); return; }
        if (!data){ trackNotFound(no); return; }
        renderTrack({ no: data.order_no, date: data.created_at, status: data.status, note: data.status_note, items: data.items, workshop: data.workshop });
        return;
      }
      const local = store.get(ORDERS_KEY, []).find(o => o.no === no);
      const phoneOk = !local || digits(local.phone).slice(-9) === ph.slice(-9);
      const status = ORDER_STATUS[no] || (local ? 'received' : null);
      if (!status || !phoneOk){ trackNotFound(no); return; }
      renderTrack({ no, date: local && local.date, status, items: local && local.items, pending: !ORDER_STATUS[no] });
    });

    }

    /* ---------- CUSTOM REQUEST FORM ---------- */
    const cf = $('#customForm'), cfDone = $('#cfDone');
    if (cf) {
    const files = [];
    const fileIn = $('#cfFiles'), drop = $('#cfDrop'), fileList = $('#cfFileList');
    const MAX_FILES = 10, MAX_MB = 10;
    function renderFiles(){
      fileList.innerHTML = files.map((f, i) => `
        <li>${f.type.startsWith('image/') ? `<img src="${f._url}" alt="">` : `<span class="cf-pdf">PDF</span>`}
          <span>${esc(f.name)}</span><small>${(f.size / 1048576).toFixed(1)} MB</small>
          <button type="button" data-rmf="${i}" aria-label="Remove ${esc(f.name)}">×</button></li>`).join('');
    }
    function addFiles(list){
      let skipped = 0;
      [...list].forEach(f => {
        const okType = f.type.startsWith('image/') || f.type === 'application/pdf';
        if (files.length >= MAX_FILES || f.size > MAX_MB * 1048576 || !okType){ skipped++; return; }
        if (f.type.startsWith('image/')) f._url = URL.createObjectURL(f);
        files.push(f);
      });
      renderFiles();
      if (skipped) showToast(`<span>${skipped} file${skipped > 1 ? 's' : ''} skipped — images or PDFs only, up to ${MAX_MB} MB each, ${MAX_FILES} files max.</span>`);
    }
    drop.addEventListener('click', () => fileIn.click());
    drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileIn.click(); } });
    fileIn.addEventListener('change', () => { addFiles(fileIn.files); fileIn.value = ''; });
    ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));
    fileList.addEventListener('click', e => {
      const b = e.target.closest('[data-rmf]'); if (!b) return;
      const [f] = files.splice(Number(b.dataset.rmf), 1);
      if (f && f._url) URL.revokeObjectURL(f._url);
      renderFiles();
    });

    const spaces = $$('.cf-spaces span'), spaceIn = $('#cfSpace');
    spaces.forEach(s => {
      s.setAttribute('role', 'radio'); s.tabIndex = 0;
      s.setAttribute('aria-checked', s.classList.contains('sel'));
      const pick = () => {
        spaces.forEach(x => { x.classList.toggle('sel', x === s); x.setAttribute('aria-checked', x === s); });
        spaceIn.value = s.textContent.trim();
      };
      s.addEventListener('click', pick);
      s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
    });

    function readCustom(){
      const need = $('#cfNeed').value.trim(), name = $('#cfName').value.trim();
      const phone = $('#cfPhone').value.trim(), email = $('#cfEmail').value.trim();
      cf.querySelectorAll('.cf-err').forEach(x => x.classList.remove('show'));
      let first = null;
      const flag = (k, el) => { cf.querySelector(`[data-err="${k}"]`).classList.add('show'); first = first || el; };
      if (need.length < 5) flag('need', $('#cfNeed'));
      if (!name) flag('name', $('#cfName'));
      if (!validPhone(phone) && !validEmail(email)) flag('contact', $('#cfPhone'));
      if (first){ first.focus(); return null; }
      return { need, name, phone, email, space: spaceIn.value };
    }
    function customText(d, ref, uploaded){
      return [
        `New custom request — ${ref}`, '',
        `Where it will go: ${d.space}`, '',
        d.need, '',
        `Name: ${d.name}`, d.phone ? `Phone: ${d.phone}` : null, d.email ? `Email: ${d.email}` : null,
        files.length ? (uploaded ? `\n${files.length} photo/sketch file${files.length > 1 ? 's' : ''} uploaded with the request.` : `\nI have ${files.length} photo/sketch file${files.length > 1 ? 's' : ''} to send.`) : null
      ].filter(x => x !== null).join('\n');
    }
    function customDone(ref, how, d, url){
      const withFiles = files.length ? (how === 'email' ? ', and attach your photos or sketches' : ', then attach your photos or sketches in the chat') : '';
      const msg = {
        sent:  `Thanks, ${esc(d.name)} — your request${files.length ? ' and files have' : ' has'} reached Kartech. We'll get back to you ${d.phone ? 'on ' + esc(d.phone) : 'by email'}.`,
        email: `Your email app has opened with your request filled in. <strong>Press send</strong>${withFiles}.`,
        retry: `We couldn't send it from here just now. Tap below to send it on WhatsApp instead${withFiles}.`,
        wa:    `WhatsApp has opened with your request filled in. <strong>Press send</strong>${withFiles}.`
      }[how];
      cfDone.innerHTML = `
        <p class="k-label">Reference ${esc(ref)}</p>
        <p class="cf-done-head">${how === 'sent' ? "We've got it." : 'Almost there.'}</p>
        <p class="cf-done-msg">${msg}</p>
        <div class="cf-done-links">
          ${url ? `<a class="custom-cta" href="${esc(url)}" target="_blank" rel="noopener">${how === 'email' ? 'Open email again' : how === 'sent' ? 'Also message us on WhatsApp' : 'Open WhatsApp'} →</a>` : ''}
          <button type="button" class="cf-alt" id="cfAgain">Send another request</button>
        </div>`;
      cf.hidden = true; cfDone.hidden = false;
      cfDone.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      $('#cfAgain').addEventListener('click', () => {
        cf.reset();
        files.forEach(f => f._url && URL.revokeObjectURL(f._url)); files.length = 0; renderFiles();
        spaces[0].click();
        const b = cf.querySelector('.custom-cta'); b.disabled = false; b.textContent = 'Send Project →';
        cfDone.hidden = true; cf.hidden = false;
      });
    }
    cf.addEventListener('submit', async e => {
      e.preventDefault();
      const d = readCustom(); if (!d) return;
      const ref = makeCode('CR');
      if (db){
        const btn = cf.querySelector('.custom-cta');
        btn.disabled = true;
        btn.textContent = files.length ? 'Uploading photos…' : 'Sending…';
        try {
          const folder = 'requests/' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
          const paths = [];
          for (const f of files){
            const safe = f.name.replace(/[^\w.\-]+/g, '_').slice(-80);
            const path = `${folder}/${paths.length + 1}-${safe}`;
            const up = await db.storage.from('request-files').upload(path, f, { contentType: f.type, upsert: false });
            if (up.error) throw up.error;
            paths.push(path);
          }
          btn.textContent = 'Sending…';
          const { data, error } = await db.rpc('submit_custom_request', { p: { ...d, files: paths } });
          if (error || !data) throw error || new Error('No reference returned');
          customDone(data, 'sent', d, waLink(customText(d, data, true)));
        } catch(_) {
          btn.disabled = false; btn.textContent = 'Send Project →';
          customDone(ref, 'retry', d, waLink(customText(d, ref)));
        }
        return;
      }
      if (KARTECH.formEndpoint){
        const btn = cf.querySelector('.custom-cta');
        btn.disabled = true; btn.textContent = 'Sending…';
        const fd = new FormData();
        fd.append('_subject', `Custom request ${ref}`);
        fd.append('reference', ref);
        Object.entries(d).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append('attachment', f, f.name));
        try {
          const r = await fetch(KARTECH.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
          if (!r.ok) throw new Error(r.status);
          customDone(ref, 'sent', d);
        } catch(_) {
          customDone(ref, 'retry', d, waLink(customText(d, ref)));
        }
        return;
      }
      const url = waLink(customText(d, ref));
      window.open(url, '_blank', 'noopener');
      customDone(ref, 'wa', d, url);
    });
    $('#cfEmailBtn').addEventListener('click', () => {
      const d = readCustom(); if (!d) return;
      const ref = makeCode('CR');
      const url = mailLink(`Custom request ${ref}`, customText(d, ref));
      window.location.href = url;
      customDone(ref, 'email', d, url);
    });

    }

    /* start */
    updateCount();
    renderRecent();
    route();
  })();
