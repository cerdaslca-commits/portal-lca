#!/usr/bin/env python3
"""Menyusun halaman Laporan Bulanan Portal LCA dari laporan.json.

Pemakaian (dari akar repo):  python3 tools/laporan.py

Yang diperbarui:
- index.html : blok di antara <!-- LAPORAN:MULAI --> dan <!-- LAPORAN:SELESAI -->
               (bulan terbaru = /laporan, bulan sebelumnya = /laporan-YYYY-MM),
               menu "Laporan Bulanan <bulan>", dan grafik setoran Tafaqur (#ch-tafaqur).
- sitemap.xml: alamat arsip /laporan-YYYY-MM.
Skrip ini hanya menyusun ulang; isi data diubah di laporan.json.
"""
import html, json, math, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
START, END = '<!-- LAPORAN:MULAI -->', '<!-- LAPORAN:SELESAI -->'
BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']


def e(s):
    return html.escape(str(s), quote=True)


def tanggal(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} {BULAN[int(m) - 1]} {y}'


def tabel(t):
    kol = t['kolom']
    h = ''
    if t.get('judul'):
        h += f'<h3>{e(t["judul"])}</h3>'
    h += '<div class="tbl"><table><thead><tr>' + ''.join(
        f'<th{" class=\"r\"" if i else ""}>{e(c)}</th>' for i, c in enumerate(kol)) + '</tr></thead><tbody>'
    for row in t['baris']:
        h += '<tr>' + ''.join(f'<td{" class=\"r\"" if i else ""}>{e(c)}</td>' for i, c in enumerate(row)) + '</tr>'
    h += '</tbody>'
    if t.get('kaki'):
        h += '<tfoot><tr>' + ''.join(f'<td{" class=\"r\"" if i else ""}>{e(c)}</td>' for i, c in enumerate(t['kaki'])) + '</tr></tfoot>'
    return h + '</table></div>'


def daftar(judul, items):
    if not items:
        return ''
    return f'<h3>{e(judul)}</h3><ul>' + ''.join(f'<li>{e(x)}</li>' for x in items) + '</ul>'


def dept_block(d, isi):
    h = f'<h2 class="lap-h"><img src="/img/dept/{e(d["logo"])}-96.webp" alt="" loading="lazy">{e(d["nama"])}</h2>\n'
    h += '<div class="dept lap-d">'
    if isi.get('ringkasan'):
        h += f'<p>{e(isi["ringkasan"])}</p>'
    if isi.get('angka'):
        h += '<div class="mini">' + ''.join(f'<div><b>{e(v)}</b><span>{e(l)}</span></div>' for v, l in isi['angka']) + '</div>'
    if isi.get('tabel'):
        h += tabel(isi['tabel'])
    h += daftar('Catatan', isi.get('catatan'))
    h += daftar('Rencana bulan buku berikutnya', isi.get('rencana'))
    if isi.get('sumber'):
        h += f'<p class="src">Sumber: {e(isi["sumber"])}.</p>'
    return h + '</div>\n'


def section(b, pid, semua, depts):
    terbaru = pid == 'laporan'
    ada = [d for d in depts if d['id'] in b['dept']]
    belum = [d['nama'] for d in depts if d['id'] not in b['dept']]
    h = (f'<section class="page" id="p-{pid}" data-title="Laporan Bulanan {e(b["label"])}" '
         f'data-sec="Data &amp; Laporan" data-lap="{e(b["id"])}" hidden>\n')
    h += '  <span class="eyebrow">Data &amp; Laporan</span>\n'
    h += f'  <h1>Laporan Bulanan <em>{e(b["label"])}</em></h1>\n'
    h += (f'  <p>Periode bulan buku LCA: {e(b["periode"])}. Disarikan dari laporan syuro {len(ada)} bagian: '
          f'{e(", ".join(d["nama"] for d in ada))}. Diperbarui {e(tanggal(b["diperbarui"]))}.</p>\n')
    nav = []
    for x in semua:
        href = '#laporan' if x is semua[0] else f'#laporan-{x["id"]}'
        if x is b:
            nav.append(f'<b>{e(x["label"])}</b>')
        else:
            nav.append(f'<a href="{href}">{e(x["label"])}</a>')
    h += '  <p class="lap-arsip">Pilih bulan: ' + ' · '.join(nav) + '</p>\n'
    if b.get('sorotan'):
        h += '  <div class="kpis lap-kpis">' + ''.join(f'<div class="kpi"><b>{e(v)}</b><span>{e(l)}</span></div>' for v, l in b['sorotan']) + '</div>\n'
    if b.get('ringkasan'):
        h += f'  <p class="lead">{e(b["ringkasan"])}</p>\n'
    h += '  <div class="chips lap-chips"></div>\n'
    for d in ada:
        h += dept_block(d, b['dept'][d['id']])
    if belum:
        h += ('<h2 class="lap-h lap-belum">Laporan yang belum masuk</h2>\n<div class="dept lap-d"><p>'
              + e(', '.join(belum)) + '. '
              + ('Halaman ini diperbarui otomatis begitu laporannya diunggah ke arsip syuro.' if terbaru else 'Laporan bagian ini tidak tersedia untuk bulan tersebut.')
              + '</p></div>\n')
    h += ('  <p class="src">Laporan ini menyajikan angka gabungan dari laporan syuro bulanan. Data pribadi Penggerak, '
          'donatur, santri, dan anggota koperasi tidak ditampilkan. Laporan lengkap dapat diminta melalui sekretariat LCA.</p>\n')
    return h + '</section>\n'


SCRIPT = """<style>
.lap-arsip{font-family:var(--f-ui);font-size:14px;color:var(--muted)}
.lap-arsip a,.lap-arsip b{white-space:nowrap}
.lap-h{display:flex;align-items:center;gap:12px;margin-top:34px;scroll-margin-top:80px}
.lap-h img{width:44px;height:44px;border-radius:50%;flex:none;object-fit:contain}
.lap-d{margin-top:10px}
@media (min-width:700px){.lap-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
.lap-d h3{font-size:1.05rem;margin:18px 0 6px}
</style>
<script>(function(){function go(){document.querySelectorAll('section[data-lap]').forEach(function(s){var c=s.querySelector('.lap-chips');if(!c||c.childNodes.length)return;
s.querySelectorAll('h2.lap-h').forEach(function(h){var b=document.createElement('button');b.type='button';var im=h.querySelector('img');
b.innerHTML=(im?'<img alt="" src="'+im.getAttribute('src')+'">':'')+h.textContent;b.addEventListener('click',function(){h.scrollIntoView({behavior:'smooth',block:'start'})});c.appendChild(b)})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();</script>
"""


def main():
    data = json.load(open(os.path.join(ROOT, 'laporan.json'), encoding='utf-8'))
    depts = data['departemen']
    semua = sorted(data['bulan'], key=lambda b: b['id'], reverse=True)
    for b in semua:
        unknown = set(b['dept']) - {d['id'] for d in depts}
        if unknown:
            sys.exit(f'Departemen tidak dikenal di {b["id"]}: {unknown}')
    blok = START + '\n'
    for i, b in enumerate(semua):
        blok += section(b, 'laporan' if i == 0 else f'laporan-{b["id"]}', semua, depts) + '\n'
    blok += SCRIPT + END

    p = os.path.join(ROOT, 'index.html')
    s = open(p, encoding='utf-8').read()
    if START in s:
        a, z = s.index(START), s.index(END) + len(END)
        s = s[:a] + blok + s[z:]
    else:
        a = s.index('<section class="page" id="p-laporan"')
        z = s.index('</section>', a) + len('</section>')
        s = s[:a] + blok + s[z:]

    s, n = re.subn(r'<li><a href="#laporan">Laporan Bulanan[^<]*</a></li>',
                   f'<li><a href="#laporan">Laporan Bulanan {semua[0]["label"]}</a></li>', s)
    if n != 1:
        print('Peringatan: menu "Laporan Bulanan" tidak ditemukan tepat satu kali', file=sys.stderr)
    s = re.sub(r'<li><a href="#laporan">Laporan Bulanan[^<]*</a><small>[^<]*</small></li>',
               f'<li><a href="#laporan">Laporan Bulanan {semua[0]["label"]}</a><small>{tanggal(semua[0]["diperbarui"])}</small></li>', s)

    rw = data.get('riwayat_setoran') or []
    key = "bars($('#ch-tafaqur'),["
    if rw and key in s:
        a = s.index(key) + len(key)
        z = s.index('].map(', a)
        arr = ','.join(f"['{m}',{v:.1f}]" for m, v in rw[-8:])
        s = s[:a] + arr + s[z:]
        # skala sumbu: angka setelah "})," pada baris yang sama
        line_end = s.index('\n', a)
        line = s[a:line_end]
        mx = int(math.ceil(max(v for _, v in rw[-8:]) * 1.08 / 10.0) * 10)
        line2 = re.sub(r'\}\),\d+\);\s*$', '}),' + str(mx) + ');', line)
        s = s[:a] + line2 + s[line_end:]
        s = re.sub(r'(<h4>Setoran Tafaqur per bulan, )\d{4}(</h4>)', r'\g<1>2026\g<2>', s)
    open(p, 'w', encoding='utf-8').write(s)

    sp = os.path.join(ROOT, 'sitemap.xml')
    if os.path.exists(sp):
        x = open(sp, encoding='utf-8').read()
        m = re.search(r'\n(\s*)<url><loc>(https://[^<]+)/laporan</loc></url>', x)
        if m:
            ind, base = m.group(1), m.group(2)
            add = ''.join(f'\n{ind}<url><loc>{base}/laporan-{b["id"]}</loc></url>' for b in semua[1:]
                          if f'/laporan-{b["id"]}<' not in x)
            x = x[:m.end()] + add + x[m.end():]
            open(sp, 'w', encoding='utf-8').write(x)
    print(f'OK: {len(semua)} bulan, terbaru {semua[0]["label"]} '
          f'({len(semua[0]["dept"])} dari {len(depts)} bagian).')


if __name__ == '__main__':
    main()
