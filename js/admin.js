/* =====================================================================
   ADMIN SETTINGS — use the same values as the website
   ===================================================================== */
const ADMIN = {
  supabaseUrl: '',   // e.g. 'https://abcdefghijk.supabase.co'
  supabaseKey: '',   // the "anon public" / "publishable" key
  currency: 'KSh'
};

(function(){
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const money = n => ADMIN.currency + ' ' + Math.round(Number(n) || 0).toLocaleString('en-KE');
  const fmtDate = d => new Date(d).toLocaleString('en-KE', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  const digits = s => String(s || '').replace(/\D/g, '');
  const intlPhone = p => { let d = digits(p); if (d.startsWith('0')) d = '254' + d.slice(1); if (d.length === 9) d = '254' + d; return d; };
  const waTo = (phone, text) => `https://wa.me/${intlPhone(phone)}?text=${encodeURIComponent(text)}`;

  const ORDER_STATUSES = [
    ['received', 'Received'], ['confirmed', 'Confirmed'], ['workshop', 'In the workshop'],
    ['ready', 'Ready'], ['delivered', 'Delivered / collected'], ['cancelled', 'Cancelled']
  ];
  const REQUEST_STATUSES = [
    ['new', 'New'], ['contacted', 'Contacted'], ['quoted', 'Quoted'], ['in_progress', 'In progress'], ['closed', 'Closed']
  ];
  const statusName = (list, k) => (list.find(s => s[0] === k) || [k, k])[1];

  const toastEl = $('#toast'); let toastT;
  function toast(msg, isErr){
    toastEl.textContent = msg; toastEl.classList.toggle('err', !!isErr); toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 3000);
  }
  function show(view){
    ['loginView', 'setupView', 'appView'].forEach(v => $('#' + v).hidden = v !== view);
  }

  if (!ADMIN.supabaseUrl || !ADMIN.supabaseKey || !window.supabase){ show('setupView'); return; }
  const db = window.supabase.createClient(ADMIN.supabaseUrl, ADMIN.supabaseKey);

  let tab = 'orders', filter = 'all', query = '', selected = null;
  let orders = [], requests = [];

  /* ---------- sign in / out ---------- */
  async function start(){
    const { data: { session } } = await db.auth.getSession();
    if (!session){ show('loginView'); return; }
    const { data: isAdmin, error } = await db.rpc('is_admin');
    if (error || !isAdmin){
      await db.auth.signOut();
      show('loginView');
      $('#loginMsg').textContent = "This account isn't set up as a Kartech admin yet. See step 6 of the setup guide.";
      return;
    }
    $('#whoAmI').textContent = session.user.email;
    show('appView');
    await load();
  }
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('#loginBtn'), msg = $('#loginMsg');
    msg.textContent = '';
    btn.disabled = true; btn.textContent = 'Signing in…';
    const { error } = await db.auth.signInWithPassword({ email: $('#loginEmail').value.trim(), password: $('#loginPass').value });
    btn.disabled = false; btn.textContent = 'Sign in';
    if (error){ msg.textContent = 'Wrong email or password.'; return; }
    start();
  });
  $('#logoutBtn').addEventListener('click', async () => { await db.auth.signOut(); orders = []; requests = []; selected = null; show('loginView'); });

  /* ---------- load data ---------- */
  async function load(){
    const [o, r] = await Promise.all([
      db.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
      db.from('custom_requests').select('*').order('created_at', { ascending: false }).limit(500)
    ]);
    if (o.error || r.error){ toast("Couldn't load data. Check your connection.", true); return; }
    orders = o.data; requests = r.data;
    $('#countOrders').textContent = orders.filter(x => x.status === 'received').length || '';
    $('#countRequests').textContent = requests.filter(x => x.status === 'new').length || '';
    renderList();
    if (selected){
      const list = tab === 'orders' ? orders : requests;
      const still = list.find(x => x.id === selected);
      if (still) renderDetail(still); else clearDetail();
    }
  }
  $('#refreshBtn').addEventListener('click', async () => { await load(); toast('Up to date'); });
  setInterval(() => { if (!$('#appView').hidden && document.visibilityState === 'visible') load(); }, 60000);

  /* ---------- tabs, filters, search ---------- */
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    tab = b.dataset.tab; filter = 'all'; selected = null;
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    $('#search').value = ''; query = '';
    clearDetail(); renderList();
  }));
  $('#search').addEventListener('input', e => { query = e.target.value.trim().toLowerCase(); renderList(); });
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    filter = b.dataset.f; renderList();
  });

  function renderList(){
    const statuses = tab === 'orders' ? ORDER_STATUSES : REQUEST_STATUSES;
    const list = tab === 'orders' ? orders : requests;
    $('#chips').innerHTML = [['all', 'All']].concat(statuses).map(([k, n]) => {
      const c = k === 'all' ? list.length : list.filter(x => x.status === k).length;
      return `<button type="button" data-f="${k}" class="${filter === k ? 'on' : ''}">${n} (${c})</button>`;
    }).join('');
    const shown = list.filter(x => {
      if (filter !== 'all' && x.status !== filter) return false;
      if (!query) return true;
      const hay = tab === 'orders'
        ? [x.order_no, x.customer_name, x.phone, x.email, x.delivery_location].join(' ')
        : [x.ref, x.name, x.phone, x.email, x.need].join(' ');
      return hay.toLowerCase().includes(query) || (digits(query).length > 3 && digits(hay).includes(digits(query)));
    });
    $('#rows').innerHTML = shown.length ? shown.map(x => tab === 'orders' ? `
      <button type="button" class="row${selected === x.id ? ' on' : ''}" data-id="${x.id}">
        <div><div class="no">${esc(x.order_no)}</div><div class="when">${fmtDate(x.created_at)}</div></div>
        <div class="who"><strong>${esc(x.customer_name)}</strong><span>${esc(x.phone)} · ${x.items.reduce((a, i) => a + (i.qty || 0), 0)} item(s) · ${esc(x.fulfilment)}</span></div>
        <div class="amt">${x.subtotal > 0 ? money(x.subtotal) : 'On request'}</div>
        <div class="pill-cell"><span class="pill s-${x.status}">${statusName(ORDER_STATUSES, x.status)}</span></div>
      </button>` : `
      <button type="button" class="row${selected === x.id ? ' on' : ''}" data-id="${x.id}">
        <div><div class="no">${esc(x.ref)}</div><div class="when">${fmtDate(x.created_at)}</div></div>
        <div class="who"><strong>${esc(x.name)}</strong><span>${esc(x.space || '')} · ${esc(x.need.slice(0, 70))}</span></div>
        <div class="amt">${x.files.length ? x.files.length + ' file(s)' : ''}</div>
        <div class="pill-cell"><span class="pill s-${x.status}">${statusName(REQUEST_STATUSES, x.status)}</span></div>
      </button>`).join('')
      : `<p class="empty">${list.length ? 'Nothing matches.' : tab === 'orders' ? 'No orders yet.' : 'No custom requests yet.'}</p>`;
  }
  $('#rows').addEventListener('click', e => {
    const r = e.target.closest('.row'); if (!r) return;
    selected = r.dataset.id;
    $$('.row').forEach(x => x.classList.toggle('on', x === r));
    const item = (tab === 'orders' ? orders : requests).find(x => x.id === selected);
    if (item){ renderDetail(item); $('#detail').classList.add('open'); }
  });

  /* ---------- detail panel ---------- */
  function clearDetail(){
    $('#detail').innerHTML = `<p class="detail-empty">Select ${tab === 'orders' ? 'an order' : 'a request'} to see the details.</p>`;
    $('#detail').classList.remove('open');
  }
  function renderDetail(x){
    const d = $('#detail');
    if (tab === 'orders'){
      const opts = ORDER_STATUSES.map(([k, n]) => `<option value="${k}"${x.status === k ? ' selected' : ''}>${n}</option>`).join('');
      const update = `Hi ${x.customer_name}, an update on your Kartech order ${x.order_no}: it is now "${statusName(ORDER_STATUSES, x.status)}".${x.status_note ? ' ' + x.status_note : ''}`;
      d.innerHTML = `
        <div class="d-head">
          <div><p class="d-no">${esc(x.order_no)}</p><p class="d-date">Placed ${fmtDate(x.created_at)} · updated ${fmtDate(x.updated_at)}</p></div>
          <button type="button" class="d-close" data-close>Close ×</button>
        </div>
        <div class="d-sec">
          <p class="label">Status</p>
          <label class="field"><span>Stage (the customer sees this when tracking)</span><select id="dStatus">${opts}</select></label>
          <label class="field"><span>Message to the customer (optional, shown on the tracking page)</span><textarea id="dNote" placeholder="e.g. Ready for collection from Friday.">${esc(x.status_note || '')}</textarea></label>
          <button type="button" class="btn green" id="dSave">Save</button><span class="saved" id="dSaved"></span>
        </div>
        <div class="d-sec">
          <p class="label">Customer</p>
          <p><strong>${esc(x.customer_name)}</strong></p>
          <p><a href="tel:+${intlPhone(x.phone)}">${esc(x.phone)}</a>${x.email ? ` · <a href="mailto:${esc(x.email)}">${esc(x.email)}</a>` : ''}</p>
          <div class="d-actions">
            <a class="btn" target="_blank" rel="noopener" href="${esc(waTo(x.phone, update))}">WhatsApp an update</a>
            <a class="btn line" href="tel:+${intlPhone(x.phone)}">Call</a>
          </div>
        </div>
        <div class="d-sec">
          <p class="label">${esc(x.fulfilment)}</p>
          ${x.delivery_location ? `<p>${esc(x.delivery_location)}</p>` : '<p>—</p>'}
        </div>
        <div class="d-sec">
          <p class="label">Items</p>
          <ul class="d-items">${x.items.map(i => `<li><span>${i.qty} × ${esc(i.name)}${i.finish ? ` <em>(${esc(i.finish)})</em>` : ''}</span><span>${i.price == null ? 'On request' : money(i.price * i.qty)}</span></li>`).join('')}</ul>
          <div class="d-total"><span>Subtotal</span><span>${x.subtotal > 0 ? money(x.subtotal) : 'On request'}${x.unpriced_items && x.subtotal > 0 ? ` + ${x.unpriced_items} on request` : ''}</span></div>
        </div>
        ${x.notes ? `<div class="d-sec"><p class="label">Customer notes</p><p class="d-need">${esc(x.notes)}</p></div>` : ''}`;
      $('#dSave').addEventListener('click', () => save('orders', x.id, { status: $('#dStatus').value, status_note: $('#dNote').value.trim() || null }));
    } else {
      const opts = REQUEST_STATUSES.map(([k, n]) => `<option value="${k}"${x.status === k ? ' selected' : ''}>${n}</option>`).join('');
      const reply = `Hi ${x.name}, thank you for your custom request ${x.ref} with Kartech. `;
      d.innerHTML = `
        <div class="d-head">
          <div><p class="d-no">${esc(x.ref)}</p><p class="d-date">Sent ${fmtDate(x.created_at)}</p></div>
          <button type="button" class="d-close" data-close>Close ×</button>
        </div>
        <div class="d-sec">
          <p class="label">What they need · ${esc(x.space || '')}</p>
          <p class="d-need">${esc(x.need)}</p>
        </div>
        ${x.files.length ? `<div class="d-sec"><p class="label">Photos &amp; sketches</p><div class="files" id="dFiles">${x.files.map(() => `<a><span class="pdf">Loading…</span></a>`).join('')}</div></div>` : ''}
        <div class="d-sec">
          <p class="label">Contact</p>
          <p><strong>${esc(x.name)}</strong></p>
          <p>${x.phone ? `<a href="tel:+${intlPhone(x.phone)}">${esc(x.phone)}</a>` : ''}${x.phone && x.email ? ' · ' : ''}${x.email ? `<a href="mailto:${esc(x.email)}">${esc(x.email)}</a>` : ''}</p>
          <div class="d-actions">
            ${x.phone ? `<a class="btn" target="_blank" rel="noopener" href="${esc(waTo(x.phone, reply))}">Reply on WhatsApp</a>` : ''}
            ${x.email ? `<a class="btn line" href="mailto:${esc(x.email)}?subject=${encodeURIComponent('Your Kartech request ' + x.ref)}">Email</a>` : ''}
          </div>
        </div>
        <div class="d-sec">
          <p class="label">Status</p>
          <label class="field"><span>Stage</span><select id="dStatus">${opts}</select></label>
          <label class="field"><span>Internal notes (only admins see this)</span><textarea id="dNote" placeholder="Quote sent, sizes agreed…">${esc(x.admin_notes || '')}</textarea></label>
          <button type="button" class="btn green" id="dSave">Save</button><span class="saved" id="dSaved"></span>
        </div>`;
      $('#dSave').addEventListener('click', () => save('custom_requests', x.id, { status: $('#dStatus').value, admin_notes: $('#dNote').value.trim() || null }));
      if (x.files.length) loadFiles(x.files);
    }
  }
  async function loadFiles(paths){
    const { data, error } = await db.storage.from('request-files').createSignedUrls(paths, 3600);
    const box = $('#dFiles'); if (!box) return;
    if (error || !data){ box.innerHTML = '<p>Couldn\'t load the files.</p>'; return; }
    box.innerHTML = data.map((f, i) => {
      const name = paths[i].split('/').pop();
      const isPdf = /\.pdf$/i.test(name);
      return `<a href="${esc(f.signedUrl)}" target="_blank" rel="noopener" title="${esc(name)}">${isPdf || !f.signedUrl ? `<span class="pdf">${esc(name)}</span>` : `<img src="${esc(f.signedUrl)}" alt="${esc(name)}">`}</a>`;
    }).join('');
  }
  $('#detail').addEventListener('click', e => { if (e.target.closest('[data-close]')) $('#detail').classList.remove('open'); });

  async function save(table, id, changes){
    const btn = $('#dSave'); btn.disabled = true; btn.textContent = 'Saving…';
    const { error } = await db.from(table).update(changes).eq('id', id);
    btn.disabled = false; btn.textContent = 'Save';
    if (error){ toast("Couldn't save. Try again.", true); return; }
    toast('Saved');
    await load();
    const s = $('#dSaved'); if (s) s.textContent = 'Saved ✓';
  }

  db.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') show('loginView'); });
  start();
})();
