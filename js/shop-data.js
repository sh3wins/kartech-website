/* =====================================================================
   KARTECH SHOP LIST: loads the owner's product list from the database
   (she edits it in the Kartech app → Stock → Shop products), then starts
   the site. If the database can't be reached within 4 seconds, the site
   starts with the list in settings.js instead, so the shop never goes blank.
   ===================================================================== */
(function(){
  var started = false;
  function start(){
    if (started) return; started = true;
    var s = document.createElement('script'); s.src = 'js/main.js?v=3';
    // main.js sizes some sections on the page's "load" event; if that already happened, run it again
    s.onload = function(){ if (document.readyState === 'complete') window.dispatchEvent(new Event('load')); };
    document.body.appendChild(s);
  }
  function use(rows){
    if (!rows || !rows.length) return;
    var list = rows.map(function(r){
      return { id:r.id, name:r.name, price: r.price == null ? null : Number(r.price), images:r.images || [], tags:r.tags || [],
        space:r.space || '', material:r.material || '', finishes:r.finishes || [], availability:r.availability || '',
        about:r.about || '', dimensions:r.dimensions || 'Ask us for the exact sizes.', materials:r.materials || r.material || '',
        care:r.care || 'Wipe with a damp cloth.', delivery:r.delivery || 'Delivery across Kenya. Cost and timing confirmed with your order.' };
    });
    PRODUCTS.length = 0; Array.prototype.push.apply(PRODUCTS, list);
  }
  if (!(KARTECH.supabaseUrl && KARTECH.supabaseKey) || !window.fetch) return start();
  var timer = setTimeout(start, 4000);
  fetch(KARTECH.supabaseUrl + '/rest/v1/kt_products?select=*&active=eq.true&order=sort.asc,name.asc',
        { headers: { apikey: KARTECH.supabaseKey, Authorization: 'Bearer ' + KARTECH.supabaseKey } })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(rows){ if (!started) use(rows); })
    .catch(function(){})
    .then(function(){ clearTimeout(timer); start(); });
})();
