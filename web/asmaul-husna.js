/* 99 Asmaul Husna — halaman dzikir interaktif (/asmaul-husna).
   Ketuk kartu untuk menandai nama yang sudah disebut; kemajuan tersimpan di perangkat.
   Tombol 🔊 memperdengarkan lafaz Arab bila perangkat punya suara bahasa Arab. */
(function () {
  'use strict';
  var root = document.getElementById('ah-app'); if (!root) return;
  var KEY = 'lca-asmaul-husna-v1', said = {};
  try { said = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(said)); } catch (e) {} };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var NAMES = [], filter = 'semua', voice = null;

  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var vs = speechSynthesis.getVoices() || [];
    voice = vs.filter(function (v) { return /^ar(-|_|$)/i.test(v.lang); })[0] || null;
    root.classList.toggle('ah-has-voice', !!voice);
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(t) {
    if (!voice) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t); u.voice = voice; u.lang = voice.lang; u.rate = 0.8; speechSynthesis.speak(u);
  }

  root.innerHTML =
    '<div class="ah-meter" aria-live="polite">' +
      '<div class="ah-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg"/></svg><div><b class="ah-count">0</b><small>dari 99</small></div></div>' +
      '<div class="ah-mtext"><span class="ah-k">Meter ketenangan</span><p class="ah-msg"></p>' +
        '<div class="ah-bars"><div><span>Kecemasan</span><i><em class="ah-bar-a"></em></i><b class="ah-va">99</b></div><div><span>Ketenangan</span><i><em class="ah-bar-b"></em></i><b class="ah-vb">0</b></div></div>' +
        '<div class="ah-actions"><button type="button" class="ah-next"></button><button type="button" class="ah-reset">Mulai dzikir dari awal</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="ah-filter" role="tablist"><button type="button" data-f="semua" class="on">Semua <span class="n-all">99</span></button><button type="button" data-f="belum">Belum <span class="n-bel">99</span></button><button type="button" data-f="sudah">Sudah <span class="n-sud">0</span></button></div>' +
    '<p class="ah-hint">Ketuk kartu setelah menyebut namanya dalam hati. Tidak perlu terburu-buru; biarkan setiap nama menenangkan satu kecemasan.</p>' +
    '<ol class="ah-grid"></ol>' +
    '<div class="ah-close"><span class="ah-k">Penutup dzikir</span><p class="ar">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</p><p>Selesai di nomor 99, tarik napas perlahan. Sebut kembali nama yang paling menenangkan hatimu hari ini.</p></div>';

  var grid = root.querySelector('.ah-grid');
  function render() {
    grid.innerHTML = NAMES.map(function (x) {
      var ok = !!said[x.n];
      return '<li class="ah-card' + (ok ? ' ok' : '') + '" data-n="' + x.n + '" tabindex="0" role="button" aria-pressed="' + ok + '" aria-label="' + x.n + '. ' + esc(x.lat) + ', ' + esc(x.arti) + (ok ? ', sudah disebut' : '') + '">' +
        '<span class="no">' + (x.n < 10 ? '0' : '') + x.n + '</span><span class="st">' + (ok ? 'Sudah disebut ✓' : 'Belum disebut') + '</span>' +
        '<span class="ar" lang="ar" dir="rtl">' + esc(x.ar) + '</span><b>' + esc(x.lat) + '</b><small>' + esc(x.arti) + '</small>' +
        '<button type="button" class="ah-say" data-say="' + x.n + '" aria-label="Dengarkan lafaz ' + esc(x.lat) + '">🔊</button></li>';
    }).join('');
    ring();
    update();
  }
  // Garis pelangi: setiap kartu warnanya bergeser (warna-warni), berputar hanya saat terlihat.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { en.target.classList.toggle('lca-live', en.isIntersecting); });
  }) : null;
  function ring() {
    Array.prototype.forEach.call(grid.children, function (li, i) { li.style.setProperty('--ah-d', (-((i * 0.47) % 6)).toFixed(2) + 's'); if (io) io.observe(li); });
    if (io) { io.observe(root.querySelector('.ah-close')); io.observe(root.querySelector('.ah-filter')); }
  }
  function update() {
    var n = NAMES.filter(function (x) { return said[x.n]; }).length;
    root.querySelector('.ah-count').textContent = n;
    root.querySelector('.ah-va').textContent = 99 - n; root.querySelector('.ah-vb').textContent = n;
    root.querySelector('.ah-bar-a').style.width = ((99 - n) / 99 * 100) + '%';
    root.querySelector('.ah-bar-b').style.width = (n / 99 * 100) + '%';
    root.querySelector('.ah-ring .fg').style.strokeDashoffset = (327 * (1 - n / 99)).toFixed(1);
    root.querySelector('.n-bel').textContent = 99 - n; root.querySelector('.n-sud').textContent = n;
    root.querySelector('.ah-msg').textContent = n === 0 ? 'Mulailah dari Ar-Rahman. Ucapkan satu per satu dalam hati.'
      : n < 99 ? (99 - n) + ' nama lagi. Hati menjadi tenteram dengan mengingat Allah.'
      : 'Alhamdulillah, 99 nama telah disebut. Semoga Allah menenangkan hati Anda.';
    var nx = NAMES.filter(function (x) { return !said[x.n]; })[0];
    var b = root.querySelector('.ah-next');
    b.textContent = nx ? 'Lanjut: ' + nx.n + '. ' + nx.lat : 'Alhamdulillah, selesai';
    b.disabled = !nx; b.setAttribute('data-n', nx ? nx.n : '');
    root.classList.toggle('ah-done', n === 99);
    applyFilter();
  }
  function applyFilter() {
    Array.prototype.forEach.call(grid.children, function (li) {
      var ok = li.classList.contains('ok');
      li.hidden = filter === 'belum' ? ok : filter === 'sudah' ? !ok : false;
    });
  }
  function toggle(li) {
    var n = +li.getAttribute('data-n'); said[n] = !said[n]; if (!said[n]) delete said[n]; save();
    li.classList.toggle('ok', !!said[n]); li.setAttribute('aria-pressed', !!said[n]);
    li.querySelector('.st').textContent = said[n] ? 'Sudah disebut ✓' : 'Belum disebut';
    if (said[n]) { li.classList.add('pop'); setTimeout(function () { li.classList.remove('pop'); }, 600); }
    update();
  }
  grid.addEventListener('click', function (e) {
    var s = e.target.closest('.ah-say');
    if (s) { e.stopPropagation(); var x = NAMES[+s.getAttribute('data-say') - 1]; speak(x.ar); return; }
    var li = e.target.closest('.ah-card'); if (li) toggle(li);
  });
  grid.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('ah-card')) { e.preventDefault(); toggle(e.target); } });
  root.querySelector('.ah-next').addEventListener('click', function () {
    var n = this.getAttribute('data-n'); if (!n) return;
    if (filter === 'sudah') { filter = 'semua'; setTab(); applyFilter(); }
    var li = grid.querySelector('[data-n="' + n + '"]'); if (!li) return;
    li.scrollIntoView({ behavior: 'smooth', block: 'center' }); li.classList.add('focus'); li.focus({ preventScroll: true });
    setTimeout(function () { li.classList.remove('focus'); }, 1600);
    var x = NAMES[n - 1]; if (voice) speak(x.ar);
  });
  root.querySelector('.ah-reset').addEventListener('click', function () {
    if (Object.keys(said).length && !confirm('Mulai dzikir dari awal? Tanda yang sudah disebut akan dihapus.')) return;
    said = {}; save(); render(); window.scrollTo({ top: root.getBoundingClientRect().top + scrollY - 110, behavior: 'smooth' });
  });
  function setTab() { Array.prototype.forEach.call(root.querySelectorAll('.ah-filter button'), function (x) { x.classList.toggle('on', x.getAttribute('data-f') === filter); }); }
  root.querySelector('.ah-filter').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; filter = b.getAttribute('data-f'); setTab(); applyFilter();
  });
  fetch('/asmaul-husna.json').then(function (r) { return r.json(); }).then(function (d) { NAMES = d; render(); })
    .catch(function () { grid.innerHTML = '<li>Gagal memuat daftar. Muat ulang halaman.</li>'; });
})();
