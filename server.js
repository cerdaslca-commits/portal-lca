// Portal LCA: server statis + pendaftaran relawan + admin.
// Tanpa dependensi luar. Data disimpan di DATA_DIR (volume Railway /data).
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const PORT = +process.env.PORT || 3000;
const PUB = path.resolve(process.env.PUBLIC_DIR || path.join(__dirname, 'public'));
// Desain baru (React, hasil build web-src/ → web/). Melayani /, /donasi, /desa, /desa/<id> dan aset-asetnya.
const WEB = path.resolve(process.env.WEB_DIR || path.join(__dirname, 'web'));
const HAS_WEB = fs.existsSync(path.join(WEB, 'index.html'));
let DATA = process.env.DATA_DIR || '/data';
try { fs.mkdirSync(DATA, { recursive: true }); fs.accessSync(DATA, fs.constants.W_OK); }
catch (e) { DATA = path.join(__dirname, 'data'); fs.mkdirSync(DATA, { recursive: true }); console.warn('DATA_DIR tidak dapat ditulis, memakai', DATA); }
const FILE = path.join(DATA, 'relawan.json');
const ADMIN_PW = process.env.ADMIN_PASSWORD || '';
const SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update('lca|' + ADMIN_PW).digest('hex');

/* ---------- penyimpanan ---------- */
let rows = [];
try { rows = JSON.parse(fs.readFileSync(FILE, 'utf8')); if (!Array.isArray(rows)) rows = []; } catch (e) { rows = []; }
let saving = Promise.resolve();
function save() {
  saving = saving.then(() => new Promise(res => {
    const tmp = FILE + '.tmp';
    fs.writeFile(tmp, JSON.stringify(rows), err => {
      if (err) { console.error('gagal simpan', err); return res(); }
      fs.rename(tmp, FILE, e2 => { if (e2) console.error('gagal rename', e2); res(); });
    });
  }));
  return saving;
}

/* ---------- util ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.css': 'text/css; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.gif': 'image/gif', '.woff': 'font/woff' };
const SEC = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' };
function ip(req) { return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(); }
function send(res, code, body, headers) {
  res.writeHead(code, Object.assign({}, SEC, headers || {}));
  res.end(body);
}
function json(res, code, obj, headers) { send(res, code, JSON.stringify(obj), Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {})); }
function readBody(req, max) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on('data', c => { n += c.length; if (n > max) { reject(new Error('too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
const buckets = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(); let b = buckets.get(key);
  if (!b || now > b.reset) { b = { n: 0, reset: now + windowMs }; buckets.set(key, b); }
  b.n++; return b.n > max;
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k); }, 600000).unref();

/* ---------- validasi formulir ---------- */
const STR = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '');
const ARR = (v, allowed) => (Array.isArray(v) ? v.filter(x => typeof x === 'string' && allowed.includes(x)).slice(0, 20) : []);
const ONE = (v, allowed) => (allowed.includes(v) ? v : '');
const O = {
  peran: ['Guru Ngaji', 'Petugas Sensus'],
  jk: ['Laki-laki', 'Perempuan'],
  pendidikan: ['SD/sederajat', 'SMP/sederajat', 'SMA/SMK/sederajat', 'Pesantren', 'D1–D3', 'S1', 'S2/S3'],
  baca: ['Masih belajar (Iqro/terbata-bata)', 'Lancar, tajwid belum sempurna', 'Lancar dan sesuai kaidah tajwid'],
  hafalan: ['Belum ada', 'Sebagian Juz 30', 'Juz 30', '2–5 juz', 'Lebih dari 5 juz', '30 juz'],
  metode: ['Iqro', 'Ummi', 'Tilawati', 'Qiroati', 'Wafa', 'Al-Bana', 'Yanbu\'a', 'Lainnya'],
  pengalaman_mengajar: ['Belum pernah', 'Kurang dari 1 tahun', '1–3 tahun', 'Lebih dari 3 tahun'],
  sasaran: ['Anak-anak', 'Remaja', 'Dewasa', 'Lansia', 'Khusus muslimah'],
  hari: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'],
  waktu: ['Pagi', 'Siang', 'Sore', 'Ba\'da Maghrib', 'Malam'],
  komunikasi: ['Sangat nyaman', 'Cukup nyaman', 'Masih canggung'],
  bahasa: ['Indonesia', 'Sunda', 'Jawa', 'Lainnya'],
  pengalaman_survei: ['Belum pernah', 'Pernah sekali', 'Sering'],
  yatidak: ['Ya', 'Tidak'],
  tahu: ['Majelis/guru ngaji LCA', 'Teman/keluarga', 'Grup WhatsApp', 'Media sosial', 'Website LCA', 'Lainnya'],
};
function clean(b) {
  const r = {
    peran: ARR(b.peran, O.peran),
    nama: STR(b.nama, 100), jk: ONE(b.jk, O.jk), tgl_lahir: /^\d{4}-\d{2}-\d{2}$/.test(b.tgl_lahir || '') ? b.tgl_lahir : '',
    wa: STR(b.wa, 20).replace(/[^\d+]/g, ''), email: STR(b.email, 120),
    alamat: STR(b.alamat, 300), desa: STR(b.desa, 80), kecamatan: STR(b.kecamatan, 80), kota: STR(b.kota, 80),
    pendidikan: ONE(b.pendidikan, O.pendidikan), pekerjaan: STR(b.pekerjaan, 100),
    baca: ONE(b.baca, O.baca), belajar_tajwid: STR(b.belajar_tajwid, 200), hafalan: ONE(b.hafalan, O.hafalan),
    metode: ARR(b.metode, O.metode), rekaman: STR(b.rekaman, 300),
    pengalaman_mengajar: ONE(b.pengalaman_mengajar, O.pengalaman_mengajar), sasaran: ARR(b.sasaran, O.sasaran),
    datang_ke_rumah: ONE(b.datang_ke_rumah, O.yatidak),
    komunikasi: ONE(b.komunikasi, O.komunikasi), bahasa: ARR(b.bahasa, O.bahasa),
    pengalaman_survei: ONE(b.pengalaman_survei, O.pengalaman_survei), hp_android: ONE(b.hp_android, O.yatidak),
    kendaraan: ONE(b.kendaraan, O.yatidak), wilayah: STR(b.wilayah, 200),
    hari: ARR(b.hari, O.hari), waktu: ARR(b.waktu, O.waktu),
    motivasi: STR(b.motivasi, 1500), tahu: ONE(b.tahu, O.tahu),
    setuju: b.setuju === true,
    independen: b.independen === true,
  };
  const err = [];
  if (!r.peran.length) err.push('Pilih minimal satu peran.');
  if (r.nama.length < 3) err.push('Nama lengkap wajib diisi.');
  if (!r.jk) err.push('Jenis kelamin wajib dipilih.');
  if (!r.tgl_lahir) err.push('Tanggal lahir wajib diisi.');
  if (!/^(\+?62|0)8\d{7,12}$/.test(r.wa)) err.push('Nomor WhatsApp tidak valid (contoh: 0812xxxxxxx).');
  if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) err.push('Format email tidak valid.');
  if (!r.desa || !r.kecamatan || !r.kota) err.push('Desa/kelurahan, kecamatan, dan kota/kabupaten wajib diisi.');
  if (!r.baca) err.push('Kemampuan membaca Al-Qur\'an wajib dipilih.');
  if (!r.hari.length) err.push('Pilih minimal satu hari yang tersedia.');
  if (r.peran.includes('Guru Ngaji') && !r.pengalaman_mengajar) err.push('Pengalaman mengajar wajib dipilih.');
  if (r.peran.includes('Petugas Sensus') && !r.komunikasi) err.push('Kenyamanan berkomunikasi wajib dipilih.');
  if (r.motivasi.length < 10) err.push('Ceritakan motivasi Anda (minimal satu kalimat).');
  if (!r.independen) err.push('Relawan LCA disyaratkan tidak terkait dan tidak terikat dengan ormas/orpol Islam mana pun. Mohon centang pernyataan tersebut bila Anda memenuhinya.');
  if (!r.setuju) err.push('Mohon centang pernyataan persetujuan.');
  return { r, err };
}

/* ---------- sesi admin ---------- */
function sign(exp) { return exp + '.' + crypto.createHmac('sha256', SECRET).update(String(exp)).digest('hex'); }
function isAdmin(req) {
  if (!ADMIN_PW) return false;
  const m = /(?:^|;\s*)lca_admin=([^;]+)/.exec(req.headers.cookie || ''); if (!m) return false;
  const [exp, mac] = m[1].split('.'); if (!exp || !mac || +exp < Date.now()) return false;
  const good = sign(exp).split('.')[1];
  return mac.length === good.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good));
}
function pwOk(p) {
  const a = crypto.createHash('sha256').update(String(p)).digest(), b = crypto.createHash('sha256').update(ADMIN_PW).digest();
  return crypto.timingSafeEqual(a, b);
}
const COOKIE = 'Path=/; HttpOnly; Secure; SameSite=Strict';

function csv(list) {
  const cols = ['didaftar', 'status', 'peran', 'nama', 'jk', 'tgl_lahir', 'wa', 'email', 'alamat', 'desa', 'kecamatan', 'kota', 'pendidikan', 'pekerjaan', 'baca', 'belajar_tajwid', 'hafalan', 'metode', 'rekaman', 'pengalaman_mengajar', 'sasaran', 'datang_ke_rumah', 'komunikasi', 'bahasa', 'pengalaman_survei', 'hp_android', 'kendaraan', 'wilayah', 'hari', 'waktu', 'motivasi', 'tahu', 'independen', 'catatan'];
  const esc = v => { if (v === true) v = 'Ya'; else if (v === false) v = 'Tidak'; v = Array.isArray(v) ? v.join('; ') : (v == null ? '' : String(v)); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
  return '﻿' + cols.join(',') + '\r\n' + list.map(r => cols.map(c => esc(r[c])).join(',')).join('\r\n');
}

/* ---------- statistik pengunjung ---------- */
const SFILE = path.join(DATA, 'pengunjung.json');
let ST = { mulai: '', days: {}, pages: {} };
try { ST = Object.assign(ST, JSON.parse(fs.readFileSync(SFILE, 'utf8'))); } catch (e) {}
const SALT = crypto.randomBytes(16).toString('hex');
let uvToday = { d: '', set: new Set() };
const online = new Map();
let sDirty = false;
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|node-fetch|headless|lighthouse|monitor|uptime/i;
function wibDate(t) { return new Date((t || Date.now()) + 7 * 3600e3).toISOString().slice(0, 10); }
function hit(req, p) {
  const ua = String(req.headers['user-agent'] || '');
  if (!ua || BOT.test(ua)) return;
  const now = Date.now(), d = wibDate(now);
  if (!ST.mulai) ST.mulai = d;
  const key = crypto.createHash('sha256').update(SALT + d + ip(req) + ua).digest('hex').slice(0, 16);
  if (uvToday.d !== d) { uvToday = { d, set: new Set() }; const day = ST.days[d]; if (day && day.uvk) day.uvk.forEach(k => uvToday.set.add(k)); }
  const day = ST.days[d] || (ST.days[d] = { pv: 0, uv: 0, pages: {} });
  day.pv++;
  if (!uvToday.set.has(key)) { uvToday.set.add(key); day.uv++; }
  day.uvk = Array.from(uvToday.set);
  p = String(p || '/').slice(0, 60).replace(/[^\w\-\/]/g, '') || '/';
  if (Object.keys(day.pages).length < 300 || day.pages[p]) day.pages[p] = (day.pages[p] || 0) + 1;
  if (Object.keys(ST.pages).length < 1000 || ST.pages[p]) ST.pages[p] = (ST.pages[p] || 0) + 1;
  online.set(key, now);
  sDirty = true;
}
function onlineCount() { const lim = Date.now() - 5 * 60e3; let n = 0; for (const [k, t] of online) { if (t < lim) online.delete(k); else n++; } return n; }
function saveStats() {
  if (!sDirty) return; sDirty = false;
  const today = wibDate();
  for (const d in ST.days) if (d !== today && ST.days[d].uvk) delete ST.days[d].uvk; // simpan kunci hanya untuk hari ini
  const keys = Object.keys(ST.days).sort(); while (keys.length > 800) delete ST.days[keys.shift()];
  for (const d of keys.slice(0, -60)) if (ST.days[d] && ST.days[d].pages) delete ST.days[d].pages;
  try { fs.writeFileSync(SFILE + '.tmp', JSON.stringify(ST)); fs.renameSync(SFILE + '.tmp', SFILE); } catch (e) { console.error('gagal simpan statistik', e); }
}
setInterval(saveStats, 30e3).unref();
process.on('SIGTERM', () => { saveStats(); process.exit(0); });
process.on('SIGINT', () => { saveStats(); process.exit(0); });
function sumDays(from, to) { let uv = 0, pv = 0; for (const d in ST.days) if (d >= from && d <= to) { uv += ST.days[d].uv; pv += ST.days[d].pv; } return { uv, pv }; }
function publicStats() {
  const t = wibDate(), y = wibDate(Date.now() - 864e5), m = t.slice(0, 8) + '01';
  const T = ST.days[t] || { uv: 0, pv: 0 }, Y = ST.days[y] || { uv: 0, pv: 0 };
  return { online: onlineCount(), hari_ini: { uv: T.uv, pv: T.pv }, kemarin: { uv: Y.uv, pv: Y.pv }, bulan_ini: sumDays(m, t), total: sumDays('0000', '9999'), sejak: ST.mulai || t };
}

/* ---------- API ---------- */
async function api(req, res, url) {
  const p = url.pathname, m = req.method;
  if (p === '/api/relawan' && m === 'POST') {
    if (limited('daftar:' + ip(req), 5, 3600e3)) return json(res, 429, { ok: false, error: 'Terlalu banyak pendaftaran dari perangkat ini. Coba lagi nanti atau hubungi WhatsApp LCA.' });
    let b; try { b = JSON.parse(await readBody(req, 20000)); } catch (e) { return json(res, 400, { ok: false, error: 'Data tidak terbaca.' }); }
    if (b && b.website) return json(res, 200, { ok: true }); // honeypot
    const { r, err } = clean(b || {});
    if (err.length) return json(res, 422, { ok: false, error: err.join(' ') });
    const rec = Object.assign({ id: crypto.randomBytes(6).toString('hex'), didaftar: new Date().toISOString(), status: 'Baru', catatan: '' }, r);
    rows.push(rec); await save();
    console.log('pendaftar baru', rec.id, rec.peran.join('+'));
    return json(res, 201, { ok: true, id: rec.id });
  }
  if (p === '/api/hit' && m === 'POST') {
    if (!limited('hit:' + ip(req), 240, 600e3)) { let b = {}; try { b = JSON.parse(await readBody(req, 500) || '{}'); } catch (e) {} hit(req, b.p); }
    return send(res, 204, '', { 'Cache-Control': 'no-store' });
  }
  if (p === '/api/pustaka' && m === 'GET') return json(res, 200, { ok: true, pages: pustaka() }, { 'Cache-Control': 'public, max-age=300' });
  if (p === '/api/stats' && m === 'GET') return json(res, 200, Object.assign({ ok: true }, publicStats()));
  if (p === '/api/admin/login' && m === 'POST') {
    if (!ADMIN_PW) return json(res, 503, { ok: false, error: 'Admin belum diaktifkan. Atur variabel ADMIN_PASSWORD di Railway.' });
    if (limited('login:' + ip(req), 10, 900e3)) return json(res, 429, { ok: false, error: 'Terlalu banyak percobaan. Tunggu 15 menit.' });
    let b; try { b = JSON.parse(await readBody(req, 2000)); } catch (e) { b = {}; }
    if (!pwOk(b.password || '')) return json(res, 401, { ok: false, error: 'Kata sandi salah.' });
    const exp = Date.now() + 12 * 3600e3;
    return json(res, 200, { ok: true }, { 'Set-Cookie': 'lca_admin=' + sign(exp) + '; Max-Age=43200; ' + COOKIE });
  }
  if (p === '/api/admin/logout') return json(res, 200, { ok: true }, { 'Set-Cookie': 'lca_admin=; Max-Age=0; ' + COOKIE });
  if (p.startsWith('/api/admin/')) {
    if (!isAdmin(req)) return json(res, 401, { ok: false, error: 'Silakan masuk.', aktif: !!ADMIN_PW });
    if (m !== 'GET' && req.headers['x-lca'] !== '1') return json(res, 403, { ok: false });
    if (p === '/api/admin/me') return json(res, 200, { ok: true });
    if (p === '/api/admin/stats') {
      const days = Object.keys(ST.days).sort().slice(-90).map(d => ({ d, uv: ST.days[d].uv, pv: ST.days[d].pv }));
      const from = wibDate(Date.now() - 29 * 864e5), pg = {};
      for (const d in ST.days) if (d >= from && ST.days[d].pages) for (const k in ST.days[d].pages) pg[k] = (pg[k] || 0) + ST.days[d].pages[k];
      const top = Object.entries(pg).sort((a, b) => b[1] - a[1]).slice(0, 25);
      return json(res, 200, Object.assign({ ok: true, days, top30: top }, publicStats()));
    }
    if (p === '/api/admin/relawan' && m === 'GET') return json(res, 200, { ok: true, data: rows.slice().reverse() });
    if (p === '/api/admin/relawan.csv' && m === 'GET') return send(res, 200, csv(rows), { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="pendaftar-relawan-lca.csv"', 'Cache-Control': 'no-store' });
    const mm = /^\/api\/admin\/relawan\/([a-f0-9]{12})$/.exec(p);
    if (mm) {
      const i = rows.findIndex(r => r.id === mm[1]); if (i < 0) return json(res, 404, { ok: false });
      if (m === 'PATCH') {
        let b; try { b = JSON.parse(await readBody(req, 5000)); } catch (e) { b = {}; }
        const ST = ['Baru', 'Dihubungi', 'Tes bacaan', 'Diterima', 'Belum sesuai', 'Mengundurkan diri'];
        if (ST.includes(b.status)) rows[i].status = b.status;
        if (typeof b.catatan === 'string') rows[i].catatan = STR(b.catatan, 2000);
        rows[i].diubah = new Date().toISOString(); await save();
        return json(res, 200, { ok: true, data: rows[i] });
      }
      if (m === 'DELETE') { rows.splice(i, 1); await save(); return json(res, 200, { ok: true }); }
    }
    return json(res, 404, { ok: false });
  }
  return json(res, 404, { ok: false });
}

/* ---------- gabungan desain baru + portal lama ---------- */
const OLD_INDEX = path.join(PUB, 'index.html');
const ENT = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
const unent = s => String(s || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1)) : (ENT[e.toLowerCase()] ?? m));
// Daftar halaman portal lama (materi, sirah, sahabat, kajian) dibaca dari index.html — seri baru otomatis ikut.
let pk = { mtime: 0, pages: [] };
function pustaka() {
  let st; try { st = fs.statSync(OLD_INDEX); } catch (e) { return []; }
  if (st.mtimeMs === pk.mtime) return pk.pages;
  const html = fs.readFileSync(OLD_INDEX, 'utf8'), pages = [];
  const re = /<section class="page" id="p-([\w-]+)"([^>]*)>/g; let m;
  while ((m = re.exec(html))) {
    const id = m[1], a = {}; m[2].replace(/\s(data-[\w-]+)="([^"]*)"/g, (_, k, v) => { a[k] = unent(v); });
    if (!/^(materi|sirah|sahabat|kajian)-/.test(id)) continue;
    const meta = (a['data-materi'] || a['data-kajian'] || '').split('|');
    const sh = (a['data-sahabat'] || '').split('|');
    pages.push({ id, title: a['data-title'] || id, sec: a['data-sec'] || '',
      tag: a['data-sahabat'] ? sh[1] : (meta.length > 1 ? meta[0] : (a['data-bab'] || '')),
      desc: a['data-sahabat'] ? (sh[2] || '') : (meta.length > 1 ? meta[1] : ''),
      terbit: a['data-terbit'] || '' });
  }
  pk = { mtime: st.mtimeMs, pages };
  return pages;
}
// Skrip jembatan yang disisipkan ke portal lama (tanpa mengubah index.html):
// tombol Beranda/logo → beranda baru, Donasi → halaman donasi baru.
const BRIDGE = `<script>(function(){
var MAP={beranda:'/',donasi:'/donasi'};
function hid(){return location.hash.slice(1)||location.pathname.replace(/^\\/+|\\/+$/g,'')}
function chk(){var t=MAP[hid()];if(t){location.replace(t);return true}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var t=MAP[a.getAttribute('href').slice(1)];if(t){e.preventDefault();e.stopPropagation();location.href=t}},true);
window.addEventListener('hashchange',chk,true);chk();
})();</script>`;
const bridgeCache = { mtime: 0, raw: null, gz: null };
function serveOldPortal(req, res) {
  fs.stat(OLD_INDEX, (err, st) => {
    if (err) return send(res, 404, 'Not found');
    if (bridgeCache.mtime !== st.mtimeMs) {
      let html = fs.readFileSync(OLD_INDEX, 'utf8');
      const i = html.lastIndexOf('</html>');
      if (HAS_WEB) html = i > -1 ? html.slice(0, i) + BRIDGE + '\n' + html.slice(i) : html + BRIDGE;
      const raw = Buffer.from(html, 'utf8');
      Object.assign(bridgeCache, { mtime: st.mtimeMs, raw, gz: zlib.gzipSync(raw) });
    }
    const h = { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' };
    const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (gz) { h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding'; }
    const body = gz ? bridgeCache.gz : bridgeCache.raw;
    h['Content-Length'] = body.length;
    res.writeHead(200, Object.assign({}, SEC, h));
    res.end(req.method === 'HEAD' ? '' : body);
  });
}
// Sitemap gabungan: sitemap portal lama + halaman desain baru (/, /donasi, /desa, /desa/<id>).
function serveSitemap(req, res) {
  const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
  const locs = [], seen = new Set();
  for (const x of [read(path.join(WEB, 'sitemap.xml')), read(path.join(PUB, 'sitemap.xml'))]) {
    x.replace(/<loc>([^<]+)<\/loc>/g, (_, u) => { u = u.trim(); if (/\/(beranda)$/.test(u)) return; if (!seen.has(u)) { seen.add(u); locs.push(u); } });
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + locs.map(u => '  <url><loc>' + u + '</loc></url>').join('\n') + '\n</urlset>\n';
  send(res, 200, req.method === 'HEAD' ? '' : xml, { 'Content-Type': MIME['.xml'], 'Cache-Control': 'public, max-age=3600' });
}
// Rute desain baru → file HTML pra-render di web/.
function webPage(rel) {
  if (!HAS_WEB) return null;
  const p = rel.replace(/\/+$/, '') || '/';
  if (p === '/' || p === '/index.html') return path.join(WEB, 'index.html');
  if (p === '/donasi') return path.join(WEB, 'donasi', 'index.html');
  if (p === '/desa') return path.join(WEB, 'desa', 'index.html');
  const m = /^\/desa\/([a-z0-9-]+)$/.exec(p);
  if (m) { const f = path.join(WEB, 'desa', m[1], 'index.html'); return fs.existsSync(f) ? f : path.join(WEB, 'desa', 'index.html'); }
  return null;
}

/* ---------- statis ---------- */
const cache = new Map();
function serveFile(req, res, file, status) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found');
    const ext = path.extname(file).toLowerCase(), type = MIME[ext] || 'application/octet-stream';
    const inWeb = file.startsWith(WEB + path.sep);
    const rel = path.relative(inWeb ? WEB : PUB, file).split(path.sep).join('/');
    const cc = inWeb && rel.startsWith('assets/') ? 'public, max-age=31536000, immutable'
      : (rel.startsWith('media/') || (inWeb && /^(img|fonts)\//.test(rel))) ? 'public, max-age=604800'
      : (ext === '.html' || ext === '.json' || ext === '.webmanifest' ? 'no-cache' : 'public, max-age=3600');
    const h = { 'Content-Type': type, 'Cache-Control': cc };
    if (!inWeb && rel === 'admin.html') { h['X-Robots-Tag'] = 'noindex, nofollow'; h['Cache-Control'] = 'no-store'; }
    const gz = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /text|json|xml|svg|javascript/.test(type);
    if (gz) {
      const key = file + '|' + st.mtimeMs; let buf = cache.get(key);
      if (!buf) { buf = zlib.gzipSync(fs.readFileSync(file)); cache.set(key, buf); }
      h['Content-Encoding'] = 'gzip'; h['Vary'] = 'Accept-Encoding';
      return send(res, status || 200, req.method === 'HEAD' ? '' : buf, h);
    }
    h['Content-Length'] = st.size;
    res.writeHead(status || 200, Object.assign({}, SEC, h));
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer((req, res) => {const host = (req.headers.host || '').split(':')[0].toLowerCase();
const keepHosts = ['cerdaslca.org', 'portal-lca-production.up.railway.app', 'localhost', '127.0.0.1'];
if (!keepHosts.includes(host)) {
  res.writeHead(301, { Location: 'https://cerdaslca.org' + req.url });
  res.end();
  return;
}
  let url; try { url = new URL(req.url, 'http://x'); } catch (e) { return send(res, 400, 'Bad request'); }
  if (url.pathname === '/health') return send(res, 200, 'ok');
  if (url.pathname.startsWith('/api/')) return api(req, res, url).catch(e => { console.error(e); json(res, 500, { ok: false, error: 'Terjadi kesalahan server.' }); });
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  let rel; try { rel = decodeURIComponent(url.pathname); } catch (e) { return send(res, 400, 'Bad request'); }
  if (rel === '/admin' || rel === '/admin/') rel = '/admin.html';
  if (rel === '/sitemap.xml') return serveSitemap(req, res);
  if (HAS_WEB && (rel === '/beranda' || rel === '/beranda/')) return send(res, 301, '', { Location: '/' + url.search });
  // 1) halaman desain baru: /, /donasi, /desa, /desa/<id>
  const page = webPage(rel);
  if (page) return serveFile(req, res, page);
  // 2) file statis: aset desain baru (web/) lalu file portal lama (media/, kata.json, admin.html, ...)
  const wfile = path.resolve(WEB, '.' + rel), file = path.resolve(PUB, '.' + rel);
  if (!file.startsWith(PUB + path.sep) && file !== PUB) return send(res, 403, 'Forbidden');
  const tryWeb = HAS_WEB && wfile.startsWith(WEB + path.sep) && path.basename(wfile) !== 'index.html';
  fs.stat(tryWeb ? wfile : '', (e1, s1) => {
    if (!e1 && s1.isFile()) return serveFile(req, res, wfile);
    fs.stat(file, (err, st) => {
      if (!err && st.isFile()) return path.basename(file) === 'index.html' ? serveOldPortal(req, res) : serveFile(req, res, file);
      if (/\.[a-z0-9]{2,11}$/i.test(rel)) return send(res, 404, 'Not found');
      // 3) halaman portal lama (/materi-3, /sahabat-9, /gabung, /sensus, ...)
      serveOldPortal(req, res);
    });
  });
}).listen(PORT, () => console.log('Portal LCA di port', PORT, '| desain baru:', HAS_WEB ? WEB : 'TIDAK ADA', '| data:', FILE, '| admin:', ADMIN_PW ? 'aktif' : 'BELUM aktif'));
