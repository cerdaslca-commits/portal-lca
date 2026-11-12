import { ArrowRight, Heart, MapPin } from 'lucide-react'
import { pic } from '@/lib/images'
import { navigate } from '@/lib/route'
import { rupiah } from '@/lib/format'
import { pct, photoFor, type Village } from '@/lib/villages'

export function FundingBar({ v, dark = false }: { v: Village; dark?: boolean }) {
  const p = pct(v)
  return (
    <div>
      <div className={`h-2 overflow-hidden rounded-full ${dark ? 'bg-[var(--color-glass)]' : 'bg-brand-surface ring-1 ring-[var(--color-border)]'}`}
        role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={`Dana terkumpul ${p}%`}>
        <div className="h-full rounded-full" style={{ width: `${Math.max(p, 3)}%`, background: 'linear-gradient(90deg, var(--mesh-mint), var(--color-accent))' }} />
      </div>
      <div className={`tnum mt-2 flex justify-between text-xs ${dark ? 'text-brand-ondark2' : 'text-brand-mute'}`}>
        <span><b className={dark ? 'text-brand-ondark' : 'text-brand-ink'}>{rupiah(v.fundingCollected)}</b> terkumpul</span>
        <span>{p}% dari {rupiah(v.fundingRequired)}</span>
      </div>
    </div>
  )
}

export function VillageCard({ v, compact = false }: { v: Village; compact?: boolean }) {
  const img = photoFor(v)
  const stats: [number | null, string][] = [[v.kk, 'KK disensus'], [v.mushaf, 'mushaf'], [v.peserta, 'peserta belajar'], [v.guru, 'guru ngaji']]
  const shown = stats.filter(([n]) => n !== null)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-brand-raised ring-1 ring-[var(--color-border)] lift">
      <a href={`/desa/${v.id}`} onClick={(e) => { e.preventDefault(); navigate('desa-detail', v.id) }} className="relative block aspect-[16/10] overflow-hidden" aria-label={`Lihat GENCAR ${v.name}`}>
        <img {...pic(img, '(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw')} alt={img.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
        <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-brand-ondark">{v.period}</span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold tracking-tight text-brand-ink">
          <a href={`/desa/${v.id}`} onClick={(e) => { e.preventDefault(); navigate('desa-detail', v.id) }} className="hover:text-brand">{v.name}</a>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-mute"><MapPin className="h-3.5 w-3.5" /> Kec. {v.district} · {v.city}</p>
        {!compact && (
          <dl className="tnum mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
            {shown.map(([n, l]) => (
              <div key={l}><dt className="sr-only">{l}</dt><dd className="text-xl font-light tracking-tight text-brand-ink">{n!.toLocaleString('id-ID')}</dd><dd className="text-xs text-brand-mute">{l}</dd></div>
            ))}
          </dl>
        )}
        {v.note && !compact && <p className="mt-3 text-xs leading-relaxed text-brand-mute">{v.note}</p>}
        <div className="mt-5"><FundingBar v={v} /></div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <button onClick={() => navigate('donasi', undefined, `desa=${v.id}`)} className="btn btn-emerald !px-4 text-sm"><Heart className="h-4 w-4" /> Dukung desa ini</button>
          <a href={`/desa/${v.id}`} onClick={(e) => { e.preventDefault(); navigate('desa-detail', v.id) }} aria-label={`Detail GENCAR ${v.name}`}
            className="grid h-11 w-11 place-items-center rounded-full text-brand-ink2 ring-1 ring-[var(--color-border)] transition-colors hover:bg-brand-surface hover:text-brand"><ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </article>
  )
}
