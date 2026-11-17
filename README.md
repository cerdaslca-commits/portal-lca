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

## Kerangka bersama & menu global (sejak November 2026)

Semua halaman (beranda React, `/donasi`, `/desa`, dan seluruh halaman portal lama) memakai **header, menu, dan footer yang sama**,
disisipkan oleh `server.js`:

- Menu & isi footer: `web-src/src/data/shell.json` (disalin ke `web/shell.json` saat build). Ubah menu cukup di file ini.
- Tampilan: `web-src/public/shell.css`; perilaku: `web-src/public/shell.js` (menu tarik-turun, menu HP, statistik pengunjung).
- Halaman portal lama memakai tema terang dan huruf yang sama dengan beranda (`index.html` tidak diubah).

Menu global: **Beranda · Tentang · Program · Pustaka · Laporan & Media · Gabung · Donasi**.

### Video GENCAR & testimoni
Tiga video (profil LCA, testimoni penerima manfaat, testimoni guru ngaji) disimpan di `media/video/` dan diputar dari server portal sendiri (mendukung Range untuk iPhone/Safari). Tampil di beranda (bagian Video, `/#video`), halaman GENCAR, Galeri, dan Donasi. Tautan YouTube tambahan ada di `web-src/src/data/business-data.json → youtube`.

### Efek visual
Semburat warna hijau-emas-merah-hitam + pola bintang segi-delapan (latar), kontur gradasi di setiap kartu, foto bergerak pelan (hanya saat terlihat, mati bila pengguna memilih "kurangi gerakan"), dan kata bersinar saat disentuh/diarahkan. Semua diatur di bagian akhir `web-src/public/shell.css` dan `shell.js`.

### Pusat program
Setiap halaman program (`/gencar`, `/sensus`, `/pendidikan`, `/wakaf`, `/guru`, `/tafaqur`, `/kegiatan`, `/program15`)
otomatis menampilkan semua yang terkait, berurutan: ikhtisar → cara kerja → departemen pelaksana → hasil & data →
dokumentasi foto → video → kajian terkait → cara ikut serta → program lainnya.
Isinya diambil langsung dari bagian portal yang sudah ada (departemen, laporan bulanan, hasil sensus, galeri, kajian),
jadi cukup perbarui sumbernya di `index.html`. Susunannya diatur di `HUBS` dalam `web-src/public/shell.js`.
Halaman `/tafaqur` adalah halaman baru (disisipkan `server.js`).

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

## Laporan Bulanan (otomatis)

Halaman `/laporan` (bulan terbaru) dan arsip `/laporan-YYYY-MM` disusun dari **`laporan.json`** oleh `python3 tools/laporan.py`
(menulis blok `<!-- LAPORAN:MULAI -->…<!-- LAPORAN:SELESAI -->` di `index.html`, menu, grafik setoran Tafaqur, dan `sitemap.xml`).
Sumbernya laporan syuro tiap departemen di Google Drive `ARSIP TAHUN 2026 / LAPORAN BULANAN / <BULAN>`.
Tugas terjadwal Claude memeriksa folder itu setiap bulan, mengisi `laporan.json`, lalu commit ke `main`.
Halaman program (`/pendidikan`, `/tafaqur`, `/sensus`, `/wakaf`, `/guru`) ikut menampilkan angka bulan ini dari judul bagian departemen.
Aturan isi: hanya angka gabungan, tanpa nama orang, IM/payroll, kasbon, piutang, saldo kas, atau nomor HP.
