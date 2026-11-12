import { ArrowLeft, Heart, MapPin, Share2 } from 'lucide-react'
import data from '@/data/business-data.json'
import { byAlt, logo, pic } from '@/lib/images'
import { navigate } from '@/lib/route'
import { rupiah, rupiahShort } from '@/lib/format'
import { VILLAGES, cityLabel, pct, photoFor, shortfall, villageById } from '@/lib/villages'
import { VillageCard, FundingBar } from '@/components/VillageCard'
import { CopyBtn } from '@/components/DonateForm'

const PROGRAMS = [
  { key: 'kk', name: "Sensus Al-Qur'an", text: "Pemetaan kepemilikan mushaf, kemampuan, dan kebiasaan membaca Al-Qur'an.", unit: 'KK telah disensus', logo: 'Sensus' },
  { key: 'mushaf', name: 'Wakaf Mushaf', text: 'Penyaluran mushaf bagi masyarakat yang membutuhkan.', unit: 'mushaf telah diwakafkan', logo: 'Wakaf' },
  { key: 'peserta', name: "Pendidikan Baca Al-Qur'an", text: "Belajar Al-Qur'an gratis, guru datang ke rumah.", unit: 'peserta belajar gratis', logo: 'Pendidikan' },
  { key: 'guru', name: 'Peduli Guru Ngaji', text: 'Apresiasi dan pembinaan bagi pengajar Al-Qur\'an.', unit: 'guru ngaji dibina', logo: 'Peduli Guru Ngaji' },
] as const
const DOCS = ['mendatangi rumah warga', 'diantar sampai ke rumah', 'Pendidikan Baca', 'apresiasi kepada guru ngaji']

export function DesaDetail({ id }: { id: string }) {
  const v = villageById(id)!
  const img = photoFor(v)
  const near = VILLAGES.filter((x) => x.id !== v.id && x.district === v.district).slice(0, 3)
  const more = near.length >= 3 ? near : [...near, ...VILLAGES.filter((x) => x.id !== v.id && x.city === v.city && !near.includes(x))].slice(0, 3)
  const share = () => {
    const url = `https://cerdaslca.org/desa/${v.id}`
    if (navigator.share) navigator.share({ title: `GENCAR ${v.name}`, url }).catch(() => {})
    else window.open(`https://wa.me/?text=${encodeURIComponent(`Dukung GENCAR ${v.name}: ${url}`)}`, '_blank')
  }
  return (
    <main>
      <section id="top" className="noise relative isolate overflow-hidden bg-brand-night pb-14 pt-28 md:pb-20 md:pt-36">
        <img {...pic(img, '100vw', true)} alt={img.alt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(90deg, oklch(17.5% 0.034 172 / 0.94), oklch(17.5% 0.034 172 / 0.7) 55%, oklch(17.5% 0.034 172 / 0.5)), linear-gradient(0deg, oklch(17.5% 0.034 172 / 0.9), transparent 45%)' }} />
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <a href="/desa" onClick={(e) => { e.preventDefault(); navigate('desa') }} className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-brand-ondark2 hover:text-brand-ondark"><ArrowLeft className="h-4 w-4" /> Semua desa</a>
            <p className="eyebrow mt-6 text-brand-gold">GENCAR · {v.period}</p>
            <h1 className="mt-3 font-body display-thin text-[clamp(2.75rem,7vw,5.5rem)] text-brand-ondark">{v.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-brand-ondark2"><MapPin className="h-4 w-4" /> Kec. {v.district}, {cityLabel(v.city)}</p>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-brand-ondark2">Program GENCAR di {v.name} mengajak masyarakat untuk mencintai, membiasakan diri, dan semakin cerdas membaca Al-Qur'an.</p>
          </div>
          <div className="glass rounded-[1.5rem] p-6 lg:col-span-5">
            <div className="tnum grid grid-cols-3 gap-3 text-brand-ondark">
              <div><span className="block text-xs text-brand-ondark2">Dibutuhkan</span><span className="block text-lg font-light"><span className="sm:hidden">{rupiahShort(v.fundingRequired)}</span><span className="hidden sm:inline">{rupiah(v.fundingRequired)}</span></span></div>
              <div><span className="block text-xs text-brand-ondark2">Terkumpul</span><span className="block text-lg font-light"><span className="sm:hidden">{rupiahShort(v.fundingCollected)}</span><span className="hidden sm:inline">{rupiah(v.fundingCollected)}</span></span></div>
              <div><span className="block text-xs text-brand-ondark2">Kekurangan</span><span className="block text-lg font-light text-brand-gold"><span className="sm:hidden">{rupiahShort(shortfall(v))}</span><span className="hidden sm:inline">{rupiah(shortfall(v))}</span></span></div>
            </div>
            <div className="mt-4"><FundingBar v={v} dark /></div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => navigate('donasi', undefined, `desa=${v.id}`)} className="btn btn-gold flex-1"><Heart className="h-4 w-4" /> Donasi untuk {v.name}</button>
              <button onClick={share} className="btn btn-glass !px-3.5" aria-label="Bagikan halaman desa"><Share2 className="h-4 w-4" /></button>
            </div>
            <p className="mt-3 text-xs text-brand-ondark3">{pct(v)}% kebutuhan dana telah terkumpul · data per Oktober 2026</p>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg py-16 md:py-24" aria-labelledby="prog-title">
        <div className="container-x">
          <p className="eyebrow text-brand-goldink">Program desa</p>
          <h2 id="prog-title" className="mt-3 font-body display-thin text-[clamp(1.9rem,4vw,3rem)] text-brand-ink">Yang sudah berjalan di <span className="font-display italic tracking-normal text-brand">{v.name}.</span></h2>
          {v.note && <p className="mt-4 max-w-[60ch] rounded-2xl bg-brand-goldsoft px-4 py-3 text-sm text-brand-ink2">{v.note}</p>}
          <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {PROGRAMS.map((p) => {
              const n = v[p.key]
              const l = logo(p.logo)
              return (
                <li key={p.key} className="card-light flex flex-col p-4 md:p-6">
                  <img {...pic(l)} alt={l.alt} className="h-10 w-10 rounded-full md:h-12 md:w-12" />
                  <span className="tnum mt-4 text-3xl font-light tracking-tight text-brand-ink md:mt-5 md:text-4xl">{n === null ? '—' : n.toLocaleString('id-ID')}</span>
                  <span className="mt-1 text-sm text-brand-mute">{n === null ? 'sedang dimutakhirkan' : p.unit}</span>
                  <span className="mt-4 font-semibold text-brand-ink">{p.name}</span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-brand-ink2 sm:block">{p.text}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-brand-surface py-16 md:py-24" aria-labelledby="pay-title">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brand-goldink">Cara berdonasi</p>
            <h2 id="pay-title" className="mt-3 font-body display-thin text-[clamp(1.9rem,4vw,3rem)] text-brand-ink">Transfer, QRIS, <span className="font-display italic tracking-normal text-brand">atau online.</span></h2>
            <p className="mt-4 max-w-[46ch] text-brand-ink2">Tuliskan "GENCAR {v.name}" saat konfirmasi agar infak dicatat untuk desa ini.</p>
            <button onClick={() => navigate('donasi', undefined, `desa=${v.id}`)} className="btn btn-gold mt-6"><Heart className="h-4 w-4" /> Isi formulir donasi</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="card-light p-5">
              <p className="text-sm font-semibold text-brand-ink">Transfer a.n. {data.payment.accountName}</p>
              <ul className="mt-3 space-y-2">
                {data.payment.banks.map((b) => (
                  <li key={b.bank} className="flex items-center justify-between gap-3 rounded-xl bg-brand-surface p-3">
                    <span><span className="block text-xs text-brand-mute">{b.bank}</span><span className="tnum block whitespace-nowrap text-[0.95rem] font-semibold text-brand-ink">{b.number}</span></span>
                    <CopyBtn text={b.number} />
                  </li>
                ))}
              </ul>
              <a href={`${data.whatsappUrl}?text=${encodeURIComponent(`Assalamu'alaikum LCA, saya sudah berinfak untuk GENCAR ${v.name}. Mohon kuitansinya.`)}`} target="_blank" rel="noreferrer" className="btn btn-emerald mt-4 w-full text-sm">Konfirmasi via WhatsApp</a>
            </div>
            <div className="card-light p-5 text-center">
              <img src={data.payment.qrisImage} alt={`QRIS ${data.payment.qrisMerchant}`} width={200} height={200} loading="lazy" className="mx-auto aspect-square w-full max-w-[180px] rounded-xl bg-white p-2 [image-rendering:pixelated]" />
              <p className="mt-2 text-sm font-semibold text-brand-ink">{data.payment.qrisMerchant}</p>
              <p className="text-xs text-brand-mute">QRIS · semua m-banking & e-wallet</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg py-16 md:py-20" aria-label="Dokumentasi kegiatan GENCAR">
        <div className="container-x">
          <p className="eyebrow text-brand-goldink">Dokumentasi kegiatan GENCAR</p>
          <ul className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
            {DOCS.map((d) => { const i = byAlt(d); return (
              <li key={d} className="group relative aspect-square overflow-hidden rounded-2xl">
                <img {...pic(i, '(min-width: 768px) 25vw, 50vw')} alt={i.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(12%_0.03_172/0.85)] p-3 text-xs font-medium text-brand-ondark">{i.alt}</span>
              </li>) })}
          </ul>
          <blockquote className="mt-10 rounded-[1.25rem] bg-brand-cream p-6 font-display text-2xl italic text-brand-ink md:p-8">
            “Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.” <span className="mt-2 block font-body text-sm not-italic text-brand-mute">HR. Bukhari</span>
          </blockquote>
          {more.length > 0 && (
            <>
              <h2 className="mt-16 text-xl font-light text-brand-ink">Desa lain di sekitar {v.name}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((x) => <li key={x.id}><VillageCard v={x} compact /></li>)}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
