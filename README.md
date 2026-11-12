# Portal Lembaga Cerdas Al-Qur'an (LCA)

Portal LCA (Yayasan Al-Kalam), dideploy di Railway (project `tafaqur-app`, layanan `portal-lca`).
Railway otomatis membangun ulang setiap ada commit ke `main`.

## Susunan (desain baru + portal lama digabung)

| Alamat | Dilayani dari | Isi |
|---|---|---|
| `/` | `web/` (desain baru) | Beranda baru: hero, dampak, program, Hari Ini (Hijriah), **Pustaka** (materi & kisah terbaru otomatis), transparansi |
| `/donasi` | `web/` | Donasi GENCAR (QRIS / transfer / Midtrans) |
| `/desa`, `/desa/<id>` | `web/` | 85 desa GENCAR |
| `/materi-N`, `/sirah-N`, `/sahabat-N`, `/kisah`, `/kata`, `/kalender`, `/sensus`, `/gabung`, `/tentang`, … | `index.html` (portal lama) | Semua konten lama, formulir relawan, panel pengunjung |
| `/admin` | `admin.html` | Admin relawan & statistik pengunjung |
| `/api/*` | `server.js` | Relawan, pengunjung, `/api/pustaka` (daftar materi/sirah/sahabat/kajian dibaca dari `index.html`) |

- `/beranda` dialihkan ke `/`. Di portal lama, tombol **Beranda**/logo membuka beranda baru dan tombol **Donasi** membuka `/donasi` baru
  (disisipkan server, `index.html` tidak diubah).
- Tautan lama bergaya `cerdaslca.org/#materi-3` otomatis dibuka ke `/materi-3`.
- `sitemap.xml` digabung otomatis (sitemap portal lama + halaman desain baru).

## Menambah konten (tidak berubah)

- Seri **Materi Al-Qur'an** baru tetap ditambahkan di `index.html` (section `p-materi-N`), Kisah Sahabat di `p-sahabat-N`.
  Seri baru **otomatis muncul** di bagian Pustaka beranda baru, tanpa build ulang.
- Kalender Hijriah portal lama memakai tabel KHGT di `index.html`.

## Mengubah desain baru

Kode sumber ada di `web-src/` (React + Vite + Tailwind). Butuh Node.js 20+ dan pnpm.

```bash
cd web-src
pnpm install
pnpm dev      # pratinjau di http://localhost:5173 (tanpa API)
pnpm build    # membangun & menyalin hasil ke ../web/
```

Lalu commit folder `web/` dan `web-src/`. Data desa, angka dampak, rekening/QRIS ada di `web-src/src/data/`.

Uji lokal penuh (desain baru + portal lama + API): dari akar repo jalankan
`PUBLIC_DIR=. DATA_DIR=./data node server.js` lalu buka http://localhost:3000.
