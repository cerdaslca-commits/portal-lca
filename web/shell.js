/* Portal LCA: perilaku kerangka bersama + penyusun "pusat program" di halaman dalam.
   - Header: berubah solid saat digulir, menu tarik-turun (klik/hover), menu HP.
   - Footer: statistik pengunjung.
   - Halaman program (Sensus, Pendidikan, Wakaf, ...): menampilkan SEMUA yang terkait program itu,
     berurutan: ikhtisar → cara kerja → pelaksana (departemen) → hasil & data → dokumentasi →
     video → kajian terkait → cara ikut serta → program lainnya.
     Isinya diambil dari bagian portal yang sudah ada (tanpa menyalin teks), jadi selalu sinkron. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- header ---------------- */
  var H = document.getElementById('lcah');
  if (H) {
    var fixedSolid = H.getAttribute('data-solid') === '1';
    var onScroll = function () { if (!fixedSolid) H.classList.toggle('is-solid', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    var closeAll = function (except) { $$('.lcah-nav .has.open', H).forEach(function (li) { if (li !== except) { li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false'); } }); };
    $$('.lcah-nav .has > button', H).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation(); var li = b.parentNode, o = !li.classList.contains('open');
        closeAll(li); li.classList.toggle('open', o); b.setAttribute('aria-expanded', o ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.lcah-nav .has')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); setMob(false); } });
    var burger = $('.lcah-burger', H), mob = document.getElementById('lcah-mob');
    var setMob = function (o) {
      if (!mob) return; mob.hidden = !o; H.classList.toggle('is-open', o);
      burger.setAttribute('aria-expanded', o ? 'true' : 'false'); burger.setAttribute('aria-label', o ? 'Tutup menu' : 'Buka menu');
    };
    if (burger) burger.addEventListener('click', function () { setMob(mob.hidden); });
    if (mob) mob.addEventListener('click', function (e) { if (e.target.closest('a')) setMob(false); });
  }

  /* ---------------- footer: pengunjung ---------------- */
  var stat = document.getElementById('lcaf-stats');
  if (stat && window.fetch) {
    fetch('/api/stats', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d || !d.ok) return; var n = function (x) { return Number(x || 0).toLocaleString('id-ID'); };
      stat.textContent = 'Pengunjung hari ini ' + n(d.hari_ini && d.hari_ini.uv) + ' · sedang membuka ' + n(d.online) + ' · total ' + n(d.total && d.total.uv);
    }).catch(function () {});
  }

  /* ---------------- foto bergerak (Ken Burns) & kata bersinar ---------------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var kbIO = !reduce && 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { en.target.classList.toggle('kb-live', en.isIntersecting); });
  }, { rootMargin: '80px 0px' }) : null;
  var kbN = 0;
  function clipped(img) {
    for (var n = img.parentElement, i = 0; n && i < 3; n = n.parentElement, i++) {
      var o = getComputedStyle(n); if (/(hidden|clip)/.test(o.overflow + o.overflowX)) return true;
    }
    return false;
  }
  function scanKB() {
    if (!kbIO) return;
    $$('#root img.object-cover:not(.rounded-full):not(.lca-kb), .lca-phero > img.bg:not(.lca-kb), .gal img:not(.lca-kb)').forEach(function (img) {
      if (!clipped(img)) return;
      kbN++; img.classList.add('lca-kb'); if (kbN % 3 === 1) img.classList.add('d2'); else if (kbN % 3 === 2) img.classList.add('d3');
      img.style.animationDelay = (-Math.random() * 18).toFixed(1) + 's';
      kbIO.observe(img);
    });
  }
  function splitWords(root) {
    $$('main h1, main h2', root).forEach(function (h) {
      if (h.getAttribute('data-w') || h.closest('.lca-toc')) return; h.setAttribute('data-w', '1');
      var walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null), nodes = [], t;
      while ((t = walk.nextNode())) if (t.nodeValue.trim()) nodes.push(t);
      nodes.forEach(function (tn) {
        var f = document.createDocumentFragment();
        tn.nodeValue.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
          var sp = document.createElement('span'); sp.className = 'lca-w'; sp.textContent = w; f.appendChild(sp);
        });
        tn.parentNode.replaceChild(f, tn);
      });
    });
  }
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest && e.target.closest('.lca-w, .lca-glow, .arabic, .ar, h3');
    if (!t) return; t.classList.add('lit'); clearTimeout(t._lt); t._lt = setTimeout(function () { t.classList.remove('lit'); }, 1500);
  }, { passive: true });
  // Garis pelangi hanya berputar saat kartunya terlihat (hemat baterai di HP).
  var RING = '.card-light,.lca-legacy .card,.lca-legacy .box,.lca-legacy .dept,.lca-legacy .chart,.lca-legacy .calc,.lca-legacy .kata-card,.lca-kaj a,.lca-progs a,.lca-pnav,.lca-legacy .tbl,.lca-legacy .dalil,.lca-legacy .vcard,.lca-legacy .kpi,.lca-legacy .plist>div,.lca-cta a,.lca-share-end,.lca-legacy .acct>div,.lca-legacy .org>div,.lca-legacy .logos a,.lca-legacy .toc li,.lca-legacy .kal .c,.lca-legacy .soc a,.lca-legacy .pay,.lca-legacy .kal-today,#root .ring-1.bg-brand-raised,#root .ring-1.bg-brand-surface,#root .ring-1.bg-brand-line,#konten .card-light,.lca-legacy .evlist li';
  var ringIO = !reduce && 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { en.target.classList.toggle('lca-live', en.isIntersecting); });
  }) : null;
  function scanRing() {
    if (!ringIO) return;
    $$(RING).forEach(function (el) { if (el._ring) return; el._ring = 1; ringIO.observe(el); });
  }
  // Tabel lebar (3+ kolom) diberi label per sel agar tampil sebagai kartu bertumpuk di HP.
  function stackTables() {
    $$('.lca-legacy .tbl').forEach(function (box) {
      var t = $('table', box); if (!t) return;
      var ths = $$('thead th', t).map(function (th) { return th.textContent.trim(); });
      if (ths.length < 3) return;
      box.classList.add('stack');
      $$('tbody tr, tfoot tr', t).forEach(function (tr) { Array.prototype.slice.call(tr.children).forEach(function (td, i) { td.setAttribute('data-label', ths[i] || ''); }); if (ringIO) ringIO.observe(tr); });
    });
  }
  function fx() {
    scanKB(); scanRing();
    if (document.body.classList.contains('lca-legacy')) setTimeout(function () { splitWords(document); scanKB(); stackTables(); scanRing(); }, 0);
    var root = document.getElementById('root');
    if (root && 'MutationObserver' in window) {
      var tm; new MutationObserver(function () { clearTimeout(tm); tm = setTimeout(function () { scanKB(); scanRing(); }, 250); }).observe(root, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fx); else fx();

  if (!document.body.classList.contains('lca-legacy')) return;

  /* ================= halaman dalam ================= */
  var LG = function (k) { return /^\//.test(k) ? k : '/img/dept/' + k + '-192.webp'; };
  var PROGRAMS = [
    { id: 'gencar', name: 'GENCAR', logo: 'gencar', photo: '/media/gencar-bojongmanggu.webp', desc: 'Gerakan Cerdas Baca Al-Qur\'an' },
    { id: 'sensus', name: 'Sensus Al-Qur\'an', logo: 'sensus', desc: 'Pendataan dari rumah ke rumah' },
    { id: 'pendidikan', name: 'Pendidikan Baca Al-Qur\'an', logo: 'pendidikan', photo: '/media/imtihan-santri.webp', desc: 'Belajar gratis, guru datang ke rumah' },
    { id: 'wakaf', name: 'Wakaf Mushaf', logo: 'wakaf', desc: 'Satu muslim, satu mushaf' },
    { id: 'guru', name: 'Peduli Guru Ngaji', logo: '/img/logo-5-192.webp', photo: '/media/rihlah-2026.webp', desc: 'Santunan, keilmuan, dan rihlah' },
    { id: 'tafaqur', name: 'Tafaqur', logo: 'tafaqur', photo: '/media/sensus-tafaqur.webp', desc: 'Infak rutin untuk program Al-Qur\'an' },
    { id: 'kegiatan', name: 'Kegiatan Tahunan & Qurban', logo: 'lca', photo: '/media/qurban-1447.webp', desc: 'Qurban Bahagia, Imtihan, Rihlah' },
    { id: 'program15', name: '15 Program & GEMAR', logo: 'gemar', desc: 'Program lengkap & pendukung' }
  ];
  var CTA = {
    donasi: ['/donasi', 'Dukung dengan infak', 'QRIS, transfer, atau Midtrans. Setiap rupiah tercatat dalam laporan bulanan.', 'Donasi sekarang →', 'g'],
    relawan: ['/gabung', 'Jadi relawan', 'Daftar sebagai guru ngaji atau petugas sensus. Formulir singkat, dihubungi sekretariat.', 'Daftar relawan →'],
    desa: ['/gabung', 'Ajukan GENCAR di desa Anda', 'Pemerintah desa, MUI, RW, atau DKM dapat mengajukan agar GENCAR hadir di wilayahnya.', 'Ajukan desa →'],
    pilihdesa: ['/desa', 'Dukung satu desa', 'Pilih dari 85 desa garapan, lihat kebutuhan dan capaian dananya.', 'Lihat 85 desa →'],
    tafaqur: ['https://wa.me/6281931324346?text=' + encodeURIComponent('Assalamu\'alaikum LCA, saya ingin menjadi donatur Tafaqur.'), 'Daftar donatur Tafaqur', 'Hubungi sekretariat lewat WhatsApp; petugas akan berkunjung setiap bulan.', 'Daftar via WhatsApp →', 'g'],
    wa: ['https://wa.me/6281931324346', 'Tanya sekretariat', 'Ada pertanyaan tentang program ini? Hubungi sekretariat LCA di 0819-3132-4346.', 'Chat WhatsApp →']
  };
  // Susunan setiap pusat program. pre = sebelum video, post = sesudah video.
  var HUBS = {
    gencar: { pre: [
        { t: 'progs', k: 'Empat program inti', h: 'Satu tujuan, empat layanan' },
        { t: 'page', id: 'dampak', k: 'Hasil & data', h: 'Dampak dan wilayah garapan', more: ['/dampak', 'Buka halaman Dampak & Wilayah'] },
        { t: 'gal', cats: ['GENCAR'], k: 'Dokumentasi', h: 'GENCAR di lapangan' }],
      post: [{ t: 'kaj', ids: ['kajian-tanggungjawab', 'kajian-mushaf'] }, { t: 'cta', items: ['pilihdesa', 'desa', 'donasi'] }] },
    sensus: { pre: [
        { t: 'dept', id: 'd-sensus', k: 'Pelaksana', h: 'Departemen Sensus (Depsus)', more: ['/departemen', 'Semua departemen & komunitas'] },
        { t: 'lap', h2: ['Departemen Sensus'], k: 'Laporan bulanan', h: 'Sensus bulan ini', more: ['/laporan', 'Buka laporan bulanan lengkap'] },
        { t: 'page', id: 'sensus-tanimulya', k: 'Hasil & data', h: 'Hasil terbaru: Sensus Reborn Tanimulya', more: ['/sensus-tanimulya', 'Buka laporan hasil sensus'] },
        { t: 'gal', cats: ['Sensus'], k: 'Dokumentasi', h: 'Petugas sensus di lapangan' }],
      post: [{ t: 'kaj', ids: ['kajian-tanggungjawab'] }, { t: 'cta', items: ['relawan', 'desa', 'donasi'] }] },
    pendidikan: { pre: [
        { t: 'dept', id: 'd-pendidikan', k: 'Pelaksana', h: 'Departemen Pendidikan (Depdik)', more: ['/departemen', 'Semua departemen & komunitas'] },
        { t: 'lap', h2: ['Departemen Pendidikan', 'Pendidikan Kancab 2 Katapang'], k: 'Laporan bulanan', h: 'Angka pendidikan bulan ini', more: ['/laporan', 'Buka laporan bulanan lengkap'] },
        { t: 'gal', cats: ['Imtihan'], k: 'Dokumentasi', h: 'Imtihan dan wisuda santri' }],
      post: [{ t: 'kaj', ids: ['kajian-terbata', 'kajian-digital'] }, { t: 'cta', items: ['relawan', 'donasi', 'wa'] }] },
    wakaf: { pre: [
        { t: 'dept', id: 'd-wakaf', k: 'Pelaksana', h: 'Departemen Wakaf', more: ['/departemen', 'Semua departemen & komunitas'] },
        { t: 'lap', h2: ['Departemen Wakaf'], k: 'Laporan bulanan', h: 'Penyaluran mushaf bulan ini', more: ['/laporan', 'Buka laporan bulanan lengkap'] },
        { t: 'calc', k: 'Hitung wakaf', h: 'Kalkulator wakaf mushaf' },
        { t: 'gal', cats: ['Wakaf'], k: 'Dokumentasi', h: 'Mushaf sampai ke tangan penerima' }],
      post: [{ t: 'kaj', ids: ['kajian-mushaf'] }, { t: 'cta', items: ['donasi', 'pilihdesa', 'wa'] }] },
    guru: { pre: [
        { t: 'dept', id: 'd-koperasi', k: 'Kesejahteraan', h: 'Koperasi Syariah Guru Ngaji Mitra Berkah', more: ['/departemen', 'Semua departemen & komunitas'] },
        { t: 'lap', h2: ['Koperasi Syariah Mitra Berkah'], k: 'Laporan bulanan', h: 'Koperasi bulan ini', more: ['/laporan', 'Buka laporan bulanan lengkap'] },
        { t: 'gal', cats: ['Rihlah'], k: 'Dokumentasi', h: 'Foto kegiatan guru ngaji' }],
      post: [{ t: 'cta', items: ['relawan', 'donasi', 'wa'] }] },
    tafaqur: { pre: [
        { t: 'dept', id: 'd-tafaqur', k: 'Pelaksana', h: 'Departemen Tafaqur (Fundraising)', more: ['/departemen', 'Semua departemen & komunitas'] },
        { t: 'lap', h2: ['Departemen Tafaqur', 'Bendahara'], k: 'Laporan bulanan', h: 'Setoran dan donatur bulan ini', more: ['/laporan', 'Buka laporan bulanan lengkap'] }],
      post: [{ t: 'kaj', ids: ['kajian-malaikat'] }, { t: 'cta', items: ['tafaqur', 'donasi', 'wa'] }] },
    kegiatan: { pre: [{ t: 'gal', cats: ['Qurban Bahagia', 'Imtihan', 'Rihlah'], k: 'Dokumentasi', h: 'Qurban Bahagia, Imtihan, dan Rihlah' }],
      post: [{ t: 'cta', items: ['donasi', 'relawan', 'wa'] }] },
    program15: { pre: [{ t: 'progs', k: 'Program inti', h: 'Empat program inti GENCAR' }], post: [{ t: 'cta', items: ['pilihdesa', 'donasi', 'relawan'] }] }
  };
  var DEPT_TO_PROG = { 'd-sensus': 'sensus', 'd-pendidikan': 'pendidikan', 'd-wakaf': 'wakaf', 'd-tafaqur': 'tafaqur', 'd-koperasi': 'guru' };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function clean(node) {
    $$('[id]', node).forEach(function (x) { x.removeAttribute('id'); });
    if (node.removeAttribute) node.removeAttribute('id');
    $$('.lca-share,.lca-share-end,.snav,script', node).forEach(function (x) { x.remove(); });
    return node;
  }
  function block(b, body) {
    var w = el('div', 'lca-hub');
    w.appendChild(el('span', 'hk', esc(b.k || '')));
    var h = el('h2', null, esc(b.h || '')); w.appendChild(h);
    var bd = el('div', 'lca-hub-body'); bd.appendChild(body); w.appendChild(bd);
    if (b.more) { var a = el('a', 'lca-hub-more', esc(b.more[1]) + ' →'); a.href = b.more[0]; w.appendChild(a); }
    return w;
  }
  function sectionBody(id) {
    var src = document.getElementById('p-' + id); if (!src) return null;
    var f = document.createDocumentFragment();
    Array.prototype.slice.call(src.children).forEach(function (c) {
      if (c.matches('h1,.eyebrow,.title-logo,.meta,.lca-share,.lca-share-end,.snav,.lca-phero,.lca-toc')) return;
      f.appendChild(clean(c.cloneNode(true)));
    });
    return f;
  }
  function lapBody(titles) {
    var src = document.getElementById('p-laporan'); if (!src) return null;
    var f = document.createDocumentFragment(), take = false, got = false, kids = Array.prototype.slice.call(src.children);
    var per = kids.filter(function (c) { return c.tagName === 'P'; })[0];
    if (per) { var pp = clean(per.cloneNode(true)); pp.className = 'src'; f.appendChild(pp); }
    kids.forEach(function (c) {
      if (c.tagName === 'H2') take = titles.indexOf(c.textContent.trim()) > -1;
      if (take) { var x = clean(c.cloneNode(true)); if (x.tagName === 'H2') { x = el('h3', null, x.innerHTML); } f.appendChild(x); got = true; }
    });
    return got ? f : null;
  }
  function galBody(cats) {
    var figs = $$('#gallery figure').filter(function (f) { return cats.indexOf(f.getAttribute('data-cat')) > -1; });
    if (!figs.length) return null;
    var g = el('div', 'gal');
    figs.slice(0, 9).forEach(function (f) { var c = clean(f.cloneNode(true)); c.style.display = ''; c.removeAttribute('hidden'); g.appendChild(c); });
    return g;
  }
  function kajBody(ids) {
    var w = el('div', 'lca-kaj'), n = 0;
    ids.forEach(function (id) {
      var s = document.getElementById('p-' + id); if (!s) return;
      var meta = (s.getAttribute('data-kajian') || '').split('|');
      var a = el('a', null, '<small>Kajian' + (meta[0] ? ' · ' + esc(meta[0]) : '') + '</small><b>' + esc(s.getAttribute('data-title') || '') + '</b>' +
        (meta[1] ? '<span>' + esc(meta[1]) + '</span>' : '') + '<em>Baca kajian →</em>');
      a.href = '/' + id; w.appendChild(a); n++;
    });
    return n ? w : null;
  }
  function ctaBody(keys) {
    var w = el('div', 'lca-cta');
    keys.forEach(function (k) {
      var c = CTA[k]; if (!c) return;
      var a = el('a', c[4] || '', '<b>' + esc(c[1]) + '</b><span>' + esc(c[2]) + '</span><em>' + esc(c[3]) + '</em>');
      a.href = c[0]; if (/^https?:/.test(c[0])) { a.target = '_blank'; a.rel = 'noopener'; }
      w.appendChild(a);
    });
    return w;
  }
  function progsBody() {
    var w = el('div', 'lca-progs');
    PROGRAMS.slice(1, 5).concat([PROGRAMS[5]]).forEach(function (p) {
      var a = el('a', null, '<img src="' + LG(p.logo) + '" alt="" loading="lazy"><span><b>' + esc(p.name) + '</b><span>' + esc(p.desc) + '</span></span>');
      a.href = '/' + p.id; w.appendChild(a);
    });
    return w;
  }
  function calcBody() {
    var calc = document.getElementById('calc'); if (!calc) return null;
    var prev = calc.previousElementSibling; if (prev && prev.tagName === 'H2' && /Kalkulator/i.test(prev.textContent)) prev.remove();
    calc.style.margin = '0';
    return calc; // dipindahkan (bukan disalin) agar tombol +/− tetap berfungsi
  }
  function build(b) {
    var body = null;
    if (b.t === 'dept') { var d = document.getElementById(b.id); if (d) { body = clean(d.cloneNode(true)); var hh = $('.dept-h', body); if (hh) hh.remove(); } }
    else if (b.t === 'page') body = sectionBody(b.id);
    else if (b.t === 'lap') body = lapBody(b.h2);
    else if (b.t === 'gal') body = galBody(b.cats);
    else if (b.t === 'kaj') { body = kajBody(b.ids); b.k = b.k || 'Kajian terkait'; b.h = b.h || 'Bacaan untuk menguatkan langkah'; }
    else if (b.t === 'cta') { body = ctaBody(b.items); b.k = 'Ikut serta'; b.h = b.h || 'Bagaimana Anda bisa terlibat'; }
    else if (b.t === 'progs') body = progsBody();
    else if (b.t === 'calc') body = calcBody();
    return body ? block(b, body) : null;
  }

  function hero(sec, p, idx) {
    var eyebrow = $(':scope > .eyebrow', sec), tl = $(':scope > .title-logo', sec), h1 = $('h1', sec), lead = $(':scope > p.lead', sec), fig = $(':scope > figure.photo', sec);
    if (!h1) return;
    var img = fig && $('img', fig), src = img ? img.getAttribute('src') : p.photo;
    var hero = el('div', 'lca-phero' + (src ? '' : ' noimg'));
    if (src) { var bg = el('img', 'bg'); bg.src = src; bg.alt = ''; hero.appendChild(bg); }
    var inn = el('div', 'lca-phero-in');
    var lg = el('img', 'lg'); lg.src = LG(p.logo); lg.alt = 'Logo ' + p.name; inn.appendChild(lg);
    inn.appendChild(el('span', 'k', 'Program GENCAR · ' + (idx + 1) + ' dari ' + PROGRAMS.length));
    inn.appendChild(h1);
    if (lead) inn.appendChild(lead);
    inn.appendChild(el('div', 'lca-phero-act', '<a class="p1" href="/donasi">Dukung program ini</a><a class="p2" href="#" data-jump="1">Lihat seluruh isi ↓</a>'));
    hero.appendChild(inn);
    sec.insertBefore(hero, sec.firstChild);
    [eyebrow, tl, fig].forEach(function (x) { if (x) x.remove(); });
    return hero;
  }

  function toc(sec, after) {
    var hs = $$(':scope > h2, :scope > .lca-hub > h2', sec);
    if (hs.length < 2) return;
    var nav = el('nav', 'lca-toc'); nav.setAttribute('aria-label', 'Isi halaman');
    hs.forEach(function (h, i) {
      var t = h.textContent.trim().replace(/^Tonton di YouTube LCA$/, 'Video');
      if (t.length > 34) t = t.slice(0, 32).replace(/\s+\S*$/, '') + '…';
      var b = el('button', null, '<b>' + (i + 1) + '</b>' + esc(t)); b.type = 'button';
      b.addEventListener('click', function () { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      nav.appendChild(b); h._tocBtn = b;
    });
    after.insertAdjacentElement('afterend', nav);
    var jump = $('[data-jump]', sec); if (jump) jump.addEventListener('click', function (e) { e.preventDefault(); nav.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          $$('button', nav).forEach(function (x) { x.classList.toggle('on', x === en.target._tocBtn); });
          var on = en.target._tocBtn; if (on) nav.scrollTo({ left: on.offsetLeft - 40, behavior: 'smooth' });
        });
      }, { rootMargin: '-160px 0px -60% 0px' });
      hs.forEach(function (h) { io.observe(h); });
    }
  }

  function pnav(sec, cur) {
    var w = el('nav', 'lca-pnav'); w.setAttribute('aria-label', 'Program lainnya');
    w.appendChild(el('p', null, 'Program LCA'));
    var ul = el('ul');
    PROGRAMS.forEach(function (p) {
      var li = el('li'), a = el('a', p.id === cur ? 'on' : '', '<img src="' + LG(p.logo) + '" alt="" loading="lazy"><span>' + esc(p.name) + '</span>');
      a.href = '/' + p.id; if (p.id === cur) a.setAttribute('aria-current', 'page');
      li.appendChild(a); ul.appendChild(li);
    });
    w.appendChild(ul); return w;
  }

  function composeHub(p, idx) {
    var sec = document.getElementById('p-' + p.id), cfg = HUBS[p.id];
    if (!sec || !cfg || sec.getAttribute('data-hub')) return;
    sec.setAttribute('data-hub', '1');
    var hr = hero(sec, p, idx);
    // video "Tonton di YouTube LCA" menjadi pemisah: sebelum = isi & data, sesudah = kajian & ajakan
    var vid = $$(':scope > h2', sec).filter(function (h) { return /Tonton di YouTube/i.test(h.textContent); })[0];
    (cfg.pre || []).forEach(function (b) { var n = build(b); if (n) { if (vid) sec.insertBefore(n, vid); else sec.appendChild(n); } });
    (cfg.post || []).forEach(function (b) { var n = build(b); if (n) sec.appendChild(n); });
    sec.appendChild(pnav(sec, p.id));
    if (hr) toc(sec, hr);
  }

  function init() {
    PROGRAMS.forEach(composeHub);
    // Halaman Departemen: setiap departemen menautkan ke pusat programnya.
    Object.keys(DEPT_TO_PROG).forEach(function (id) {
      var a = document.getElementById(id); if (!a || $('.lca-deptlink', a)) return;
      var p = PROGRAMS.filter(function (x) { return x.id === DEPT_TO_PROG[id]; })[0];
      var l = el('a', 'lca-deptlink', 'Lihat program ' + esc(p.name) + ' →'); l.href = '/' + p.id; a.appendChild(l);
    });
    // Tautan lama yang masih menunjuk halaman Donasi lama → halaman donasi baru.
    $$('a[href="#donasi"]').forEach(function (a) { a.setAttribute('href', '/donasi'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* Navigasi antarhalaman portal tanpa muat ulang, dengan alamat yang rapi (/sensus, bukan /x#sensus). */
  function markMenu() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (!H) return;
    $$('.lcah-list a', H).forEach(function (a) { var on = a.getAttribute('href') === p; a.classList.toggle('is-on', on); });
    $$('.lcah-nav > ul > li', H).forEach(function (li) {
      var top = li.firstElementChild, on = !!$('.lcah-list a.is-on', li) || (top.tagName === 'A' && top.getAttribute('href') === p);
      if (!on && /^\/(materi|sirah|sahabat|kisah|kajian)-/.test(p)) on = /Pustaka/.test(top.textContent);
      top.classList.toggle('is-on', on);
    });
  }
  function go(id, push) {
    if (push) history.pushState(null, '', '/' + id);
    window.dispatchEvent(new Event('hashchange')); // router portal membaca alamat
    markMenu();
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || id === 'beranda' || id === 'donasi') return;
    if (document.getElementById('p-' + id) || /^kisah-\d+$/.test(id)) { e.preventDefault(); go(id, true); }
  });
  window.addEventListener('popstate', function () { go(null, false); });
  // Alamat lama bergaya /halaman#lain dirapikan menjadi /lain.
  var h0 = location.hash.slice(1);
  if (h0 && (document.getElementById('p-' + h0) || /^kisah-\d+$/.test(h0))) history.replaceState(null, '', '/' + h0);
  markMenu();
})();
