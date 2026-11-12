# Situs Lembaga Cerdas Al-Qur'an (LCA) & Donasi GENCAR

Situs statis (React + Vite + Tailwind) untuk **https://cerdaslca.org**.

| URL | Isi |
|---|---|
| `/` | Portal LCA: hero, angka dampak, Stories, program, jangkauan, **Hari Ini (kalender Hijriah otomatis)**, transparansi |
| `/donasi` | Donasi GENCAR: form infak (QRIS / Transfer / Midtrans), pilih desa (85 desa), bukti nyata, tanya jawab |
| `/desa` | Daftar 85 desa: cari, filter wilayah, urutkan (paling butuh dana, terbaru, A–Z) |
| `/desa/<nama-desa>` | Detail desa: kebutuhan & capaian dana, 4 program, cara donasi, desa sekitar (contoh `/desa/tanimulya`) |

## ⭐ Pasang di cPanel / Hostinger / Niagahoster (cerdaslca.org)

1. **Cadangkan situs lama dulu.** Di *File Manager*, masuk `public_html`, pilih semua file → *Compress* → unduh zip-nya
   (atau pindahkan ke folder `public_html_lama`). Isi lama (kajian, materi, sirah, dll.) akan **tergantikan** situs baru.
2. Unggah `cerdaslca-web-dist.zip` ke `public_html`, klik kanan → *Extract*. Pastikan file langsung berada di
   `public_html/` (bukan `public_html/dist/`): harus terlihat `index.html`, `.htaccess`, folder `assets`, `img`, `desa`, `donasi`.
3. Aktifkan **file tersembunyi** (*Settings → Show Hidden Files*) dan pastikan `.htaccess` ikut terunggah.
4. Aktifkan **SSL/HTTPS** (cPanel → *SSL/TLS Status* → AutoSSL, atau Hostinger → *SSL*).
5. Buka https://cerdaslca.org, https://cerdaslca.org/donasi, dan https://cerdaslca.org/desa/tanimulya untuk cek.

Jika muncul halaman lama, bersihkan cache browser / cache hosting (Hostinger: *Website → Cache Manager → Purge*).

---

## A. Cara deploy tercepat (tanpa coding)

Gunakan isi folder **`dist/`** (sudah jadi di `cerdaslca-web-dist.zip`). Situs dirancang dipasang di **akar domain**
(misalnya `https://cerdaslca.org/` atau `https://donasi.cerdaslca.org/`), bukan di subfolder.

### 1) Netlify (gratis, paling mudah)
1. Buka https://app.netlify.com/drop
2. Seret folder `dist` (hasil ekstrak zip) ke halaman itu → situs langsung online.
3. *Domain settings* → tambahkan domain Anda.
   File `_redirects` dan `_headers` sudah disertakan (routing + cache).

### 2) Vercel
1. `npm i -g vercel` lalu dari dalam folder `dist`: `vercel --prod`
   (atau impor folder sumber di dashboard Vercel: *Build command* `pnpm build`, *Output* `dist`).
2. `vercel.json` sudah disertakan.

### 3) Cloudflare Pages
*Create project → Direct upload* → unggah folder `dist`. `_redirects` & `_headers` otomatis dipakai.

### 4) Hosting cPanel / Hostinger / Niagahoster (Apache)
1. Buka *File Manager* → masuk ke `public_html` (atau folder subdomain, misal `donasi.cerdaslca.org`).
2. Unggah **seluruh isi** folder `dist` (termasuk file tersembunyi `.htaccess`).
3. Selesai. `.htaccess` mengatur routing, kompresi gzip, dan cache browser.

### 5) GitHub Pages
Unggah isi `dist` ke branch `gh-pages`. `404.html` dan `donasi/index.html` sudah dibuat, jadi `/donasi` tetap jalan
(gunakan domain kustom agar situs di akar domain).

> Tanpa aturan *rewrite* pun situs tetap jalan: `/donasi/index.html` dibuat otomatis saat build.

---

## B. Mengubah konten

### Data 85 desa
`src/data/villages.json` — nama, kecamatan, kota, masa garapan, `fundingRequired` (dana dibutuhkan),
`fundingCollected` (terkumpul), `kk`, `mushaf`, `peserta`, `guru`. Isi `null` bila data sedang dimutakhirkan
(contoh: Tanimulya mengikuti Sensus Reborn 2026, 3.606 KK). Perbarui angka dana secara berkala, lalu build ulang.
Halaman `/desa/<id>` dibuat otomatis untuk setiap desa saat build.

### Kalender Hijriah & kata harian (otomatis)
- Tanggal Hijriah, hitung mundur Ramadhan/Idul Fitri/Arafah, dan pengingat (Ayyamul Bidh, Rajab, Isra Mi'raj,
  Nisfu Sya'ban, Nuzulul Qur'an, Idul Adha, dll.) dihitung otomatis setiap hari (zona WIB).
- Mengikuti **KHGT**: tabel awal bulan ada di `src/lib/hijri.ts` (`KHGT_STARTS`, saat ini Jumadil Ula 1448 – Muharram 1449).
  **Tambahkan baris awal bulan setiap tahun** dari kalender resmi KHGT. Di luar tabel dipakai Umm al-Qura (biasanya sama).
- Kata harian berputar dari daftar di `src/data/words.json` (Al-Fatihah & Al-Ikhlas, terjemahan Kemenag). Tambah kata baru di sana.

### Lainnya

Hampir semua teks & angka ada di **`src/data/business-data.json`**:

- `stats` → angka dampak (85 desa, 48.726 KK, dst.)
- `payment` → QRIS, rekening bank, link Midtrans
- `today.materi` → materi pekan ini
- `timeline`, `weekly`, `penggerakPerBulan`, `legal`, `social`, kontak

Foto ada di `public/img/` dalam format WebP ukuran 480/960/1600 px.
Ganti/menambah foto: buat versi `photo-N-480.webp` & `photo-N-960.webp`, lalu daftarkan di
`src/data/image-manifest.json` dan `business-data.json → images`.

QRIS: `public/img/qris-lca.png` (merchant LEMBAGA CERDAS ALQURAN, NMID ID1025440289821).

Setelah mengubah, jalankan build ulang (bagian C).

## C. Build dari kode sumber

Butuh Node.js 20+ dan pnpm (`npm i -g pnpm`).

```bash
pnpm install
pnpm dev        # pratinjau lokal di http://localhost:5173
pnpm build      # hasil siap deploy di folder dist/
pnpm preview    # cek hasil build di http://localhost:4173
```

## D. Setelah online — checklist

- [ ] Situs sudah dikonfigurasi untuk `cerdaslca.org`. Jika domain lain, ganti URL di `index.html`,
      `scripts/postbuild.mjs`, `src/lib/route.ts`, `public/robots.txt`, lalu build ulang (sitemap dibuat otomatis).
- [ ] Cek pratinjau share WhatsApp/Facebook: https://developers.facebook.com/tools/debug/
- [ ] Daftarkan `sitemap.xml` di Google Search Console.
- [ ] Google Analytics memakai ID situs lama `G-4S8X1VRZ5D` (dimuat 2,5 detik setelah halaman siap).
      Hapus blok skrip di akhir `index.html` jika tidak dipakai.
- [ ] Video "Bukti Nyata" masih diputar dari `donasi-gencar.cerdaslca.chatgpt.site`. Situs lama tetap online (tidak dipublikasikan); bila suatu saat ditutup,
      pindahkan file video ke YouTube/hosting baru lalu ganti URL di `business-data.json → videos`.

## Performa (hasil uji)

- JavaScript awal ±145 KB (gzip); halaman Donasi, daftar desa, dan detail desa dimuat terpisah (masing-masing 3–8 KB).
- Font di-host sendiri (tanpa Google Fonts), hanya subset latin + arab.
- Gambar WebP responsif: HP memuat versi 480/960 px, desktop 960/1600 px; gambar di bawah layar dimuat belakangan.
- Efek blur/animasi berat hanya aktif di layar besar; menghormati pengaturan "kurangi gerakan".
- Uji lokal: tanpa error konsol, tanpa gambar rusak, tanpa geser horizontal di HP 390 px.
