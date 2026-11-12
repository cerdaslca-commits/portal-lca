// Pre-renders per-route HTML shells (own title, description, share image, canonical) so every URL
// works on ANY static host — even without rewrite rules — and is indexable. Also writes sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'

const ORIGIN = 'https://cerdaslca.org'
const html = readFileSync('dist/index.html', 'utf8')
const { villages } = JSON.parse(readFileSync('src/data/villages.json', 'utf8'))
const T1 = "Lembaga Cerdas Al-Qur'an (LCA) — Gerakan Cerdas Baca Al-Qur'an"
const D1 = 'Satu desa demi satu desa, LCA mendata, mengajar, mewakafkan mushaf, dan memuliakan guru ngaji di 85 desa Bandung Raya — gratis untuk masyarakat sejak 2007.'
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const rp = (n) => 'Rp' + n.toLocaleString('id-ID')

function page(path, title, desc, og, heroPreload) {
  let out = html.split(T1).join(esc(title)).split(D1).join(esc(desc))
    .replace(`${ORIGIN}/og-image.jpg`, `${ORIGIN}${og}`)
    .replace(`<link rel="canonical" href="${ORIGIN}/"`, `<link rel="canonical" href="${ORIGIN}${path}"`)
    .replace(`<meta property="og:url" content="${ORIGIN}/"`, `<meta property="og:url" content="${ORIGIN}${path}"`)
  out = out.replace(/<link rel="preload" as="image"[^>]*>/, heroPreload ?? '')
  const dir = 'dist' + path
  mkdirSync(dir, { recursive: true })
  writeFileSync(dir + '/index.html', out)
}
const pre = (n, widths) => `<link rel="preload" as="image" type="image/webp" href="/img/photo-${n}-960.webp" imagesrcset="${widths.map((w) => `/img/photo-${n}-${w}.webp ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high" />`

page('/donasi', "Donasi GENCAR — Hadirkan Al-Qur'an di Setiap Rumah | LCA",
  "Infak untuk Sensus Al-Qur'an, pendidikan baca Al-Qur'an gratis, wakaf mushaf, dan Peduli Guru Ngaji. Bayar via QRIS, transfer, atau Midtrans.", '/og-donasi.jpg', pre(1, [480, 960, 1400]))
page('/desa', '85 Desa GENCAR — Pilih dan Dukung Desanya | LCA',
  'Daftar 85 desa/kelurahan garapan GENCAR di Cimahi, Bandung Barat, dan Kabupaten Bandung, lengkap dengan kebutuhan dana dan capaian program.', '/og-donasi.jpg', '')
for (const v of villages) {
  page(`/desa/${v.id}`, `GENCAR ${v.name} — Kec. ${v.district} | LCA`,
    `Dukung Gerakan Cerdas Baca Al-Qur'an di ${v.name}, Kec. ${v.district}, ${v.city}. Dana dibutuhkan ${rp(v.fundingRequired)}, terkumpul ${rp(v.fundingCollected)}.`, '/og-donasi.jpg', '')
}
writeFileSync('dist/404.html', html)
copyFileSync('vercel.json', 'dist/vercel.json')

const urls = ['/', '/donasi', '/desa', ...villages.map((v) => `/desa/${v.id}`)]
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc><changefreq>${u.startsWith('/desa/') ? 'monthly' : 'weekly'}</changefreq><priority>${u === '/' ? '1.0' : u.split('/').length > 2 ? '0.6' : '0.9'}</priority></url>`).join('\n')}\n</urlset>\n`)
console.log(`postbuild: ${urls.length - 1} route pages, 404.html, sitemap.xml (${urls.length} URLs)`)
