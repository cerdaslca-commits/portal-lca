import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Mesh } from '@/components/Mesh'
import { VillageCard } from '@/components/VillageCard'
import { CTA } from '@/sections/CTA'
import { navigate } from '@/lib/route'
import { rupiah } from '@/lib/format'
import { CITIES, VILLAGES, cityLabel, pct, shortfall, totals } from '@/lib/villages'

type Sort = 'kebutuhan' | 'terbaru' | 'terlama' | 'az'
const PAGE = 12

export function DesaList() {
  const [q, setQ] = useState('')
  const [city, setCity] = useState<string>('Semua')
  const [sort, setSort] = useState<Sort>('kebutuhan')
  const [limit, setLimit] = useState(PAGE)
  const T = totals()

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const idx = new Map(VILLAGES.map((v, i) => [v.id, i]))
    const r = VILLAGES.filter((v) => (city === 'Semua' || v.city === city) && (!needle || `${v.name} ${v.district} ${v.city}`.toLowerCase().includes(needle)))
    const by: Record<Sort, (a: typeof r[0], b: typeof r[0]) => number> = {
      kebutuhan: (a, b) => shortfall(b) - shortfall(a),
      terbaru: (a, b) => idx.get(b.id)! - idx.get(a.id)!,
      terlama: (a, b) => idx.get(a.id)! - idx.get(b.id)!,
      az: (a, b) => a.name.localeCompare(b.name, 'id'),
    }
    return [...r].sort(by[sort])
  }, [q, city, sort])

  const chip = (active: boolean) => `min-h-[40px] whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${active ? 'bg-brand text-brand-ondark' : 'bg-brand-raised text-brand-ink2 ring-1 ring-[var(--color-border)] hover:text-brand-ink'}`

  return (
    <main>
      <section id="top" className="noise relative isolate overflow-hidden bg-brand-night pb-14 pt-32 md:pb-20 md:pt-40">
        <Mesh />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-brand-gold">GENCAR per desa</p>
            <h1 className="mt-4 font-body display-thin text-[clamp(2.5rem,6vw,4.75rem)] text-brand-ondark">
              85 desa, <span className="font-display italic tracking-normal text-brand-gold">satu gerakan.</span>
            </h1>
            <p className="mt-5 max-w-[54ch] text-[1.05rem] leading-relaxed text-brand-ondark2">Cari desa Anda atau desa yang paling membutuhkan. Setiap desa punya kebutuhan dana dan capaian program yang tercatat.</p>
          </div>
          <div className="glass rounded-[1.5rem] p-6 lg:col-span-5">
            <p className="text-sm font-semibold text-brand-ondark">Dana program seluruh desa</p>
            <p className="tnum mt-2 text-3xl font-light text-brand-ondark">{rupiah(T.collected)} <span className="text-base text-brand-ondark2">/ {rupiah(T.required)}</span></p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--color-glass)]">
              <div className="h-full rounded-full" style={{ width: `${Math.round((T.collected / T.required) * 100)}%`, background: 'linear-gradient(90deg, var(--mesh-mint), var(--color-accent))' }} />
            </div>
            <ul className="tnum mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-brand-ondark">
              {CITIES.map((c) => (
                <li key={c}><span className="block text-xl font-light">{VILLAGES.filter((v) => v.city === c).length}</span><span className="text-xs text-brand-ondark2">{cityLabel(c)}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg py-12 md:py-16" aria-label="Daftar desa">
        <div className="container-x">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Cari desa</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-mute" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} placeholder="Cari desa atau kecamatan…"
                className="h-12 w-full rounded-full bg-brand-raised pl-11 pr-4 text-[0.95rem] text-brand-ink ring-1 ring-[var(--color-border)] outline-none placeholder:text-brand-mute focus:ring-2 focus:ring-[var(--color-primary)]" />
            </label>
            <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="group" aria-label="Filter wilayah">
              {['Semua', ...CITIES].map((c) => (
                <button key={c} aria-pressed={city === c} onClick={() => { setCity(c); setLimit(PAGE) }} className={chip(city === c)}>{c === 'Semua' ? 'Semua wilayah' : cityLabel(c)}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-brand-mute" aria-live="polite"><b className="tnum text-brand-ink">{list.length}</b> desa ditemukan</p>
            <label className="flex items-center gap-2 text-sm text-brand-ink2">Urutkan
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-full bg-brand-raised px-3 text-sm text-brand-ink ring-1 ring-[var(--color-border)]">
                <option value="kebutuhan">Paling butuh dana</option>
                <option value="terbaru">Garapan terbaru</option>
                <option value="terlama">Garapan terlama</option>
                <option value="az">Nama A–Z</option>
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-[1.5rem] bg-brand-surface p-10 text-center">
              <p className="font-semibold text-brand-ink">Desa tidak ditemukan</p>
              <p className="mt-1 text-sm text-brand-ink2">Coba kata kunci lain, atau pilih "Semua wilayah".</p>
              <button onClick={() => { setQ(''); setCity('Semua') }} className="btn btn-outline mt-4">Reset pencarian</button>
            </div>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {list.slice(0, limit).map((v) => (<li key={v.id}><VillageCard v={v} compact /></li>))}
            </ul>
          )}
          {limit < list.length && (
            <div className="mt-10 text-center">
              <button onClick={() => setLimit((l) => l + PAGE)} className="btn btn-outline">Tampilkan {Math.min(PAGE, list.length - limit)} desa berikutnya</button>
              <p className="mt-2 text-xs text-brand-mute">Tersisa {list.length - limit} desa</p>
            </div>
          )}
          <p className="mt-10 text-xs text-brand-mute">Rata-rata capaian dana: {Math.round(VILLAGES.reduce((a, v) => a + pct(v), 0) / VILLAGES.length)}% · Data dana & program per Oktober 2026.</p>
        </div>
      </section>
      <CTA onDonate={() => navigate('donasi')} title="Belum menentukan desa?" accent="Infak ke desa yang paling membutuhkan." />
    </main>
  )
}
