import { useState } from 'react'
import { BadgeCheck, FileText } from 'lucide-react'
import data from '@/data/business-data.json'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { cardReveal, staggerContainer } from '@/lib/motion'

const SERIES = data.penggerakPerBulan
const MAX = 7000
const TICKS = [0, 2000, 4000, 6000]

function PenggerakChart() {
  const [hover, setHover] = useState<number | null>(null)
  return (
    <figure className="card-light flex h-full flex-col p-6 md:p-8">
      <figcaption>
        <p className="font-semibold text-brand-ink">Penggerak eksternal per bulan</p>
        <p className="mt-1 text-sm text-brand-mute">Rata-rata per bulan (donatur, majelis, responden), 2019–2025</p>
      </figcaption>
      <div className="relative mt-8 flex-1" style={{ minHeight: 240 }}>
        {/* recessive grid */}
        {TICKS.map((t) => (
          <div key={t} className="absolute inset-x-0 flex items-center gap-3" style={{ bottom: `${(t / MAX) * 100}%` }}>
            <span className="tnum w-10 text-right text-[0.7rem] text-brand-mute">{t ? `${t / 1000}rb` : '0'}</span>
            <span className="h-px flex-1 bg-brand-line" />
          </div>
        ))}
        <ul className="absolute inset-y-0 left-[52px] right-0 flex items-end gap-[2px]" aria-label="Diagram batang penggerak eksternal per tahun">
          {SERIES.map((d, i) => {
            const peak = d.eksternal === Math.max(...SERIES.map((s) => s.eksternal))
            return (
              <li key={d.year} className="relative flex h-full flex-1 items-end justify-center"
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}
                aria-label={`${d.year}: ${d.eksternal.toLocaleString('id-ID')} penggerak eksternal per bulan`}>
                <span className="w-[62%] max-w-[44px] rounded-t-[4px] transition-colors duration-150"
                  style={{ height: `${(d.eksternal / MAX) * 100}%`, background: hover === i || (hover === null && peak) ? 'var(--color-primary)' : 'oklch(70% 0.06 168)' }} />
                {(hover === i || (hover === null && peak)) && (
                  <span className="tnum pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg bg-brand-night px-2.5 py-1.5 text-xs text-brand-ondark shadow-lg"
                    style={{ bottom: `${(d.eksternal / MAX) * 100}%` }}>
                    {d.year} · {d.eksternal.toLocaleString('id-ID')}{peak ? ' · tertinggi' : ''}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <ul className="ml-[52px] mt-2 flex gap-[2px]">
        {SERIES.map((d) => (<li key={d.year} className="tnum flex-1 text-center text-[0.7rem] text-brand-mute">{d.year}</li>))}
      </ul>
      <details className="mt-5 text-sm text-brand-ink2">
        <summary className="cursor-pointer font-medium text-brand">Lihat sebagai tabel</summary>
        <table className="tnum mt-3 w-full text-left">
          <thead><tr className="text-brand-mute"><th className="py-1 font-medium">Tahun</th><th className="py-1 font-medium">Eksternal/bln</th><th className="py-1 font-medium">Tim inti/bln</th></tr></thead>
          <tbody>{SERIES.map((d) => (<tr key={d.year} className="border-t border-brand-line"><td className="py-1">{d.year}</td><td>{d.eksternal.toLocaleString('id-ID')}</td><td>{d.internal}</td></tr>))}</tbody>
        </table>
      </details>
    </figure>
  )
}

export function Transparency() {
  return (
    <section id="transparansi" className="bg-brand-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHead kicker="Transparansi" title="Laporan terbuka," accent="bulan demi bulan."
          body="Angka di bawah diambil dari Laporan Sekretariat LCA. Setiap donasi punya jejak, setiap program punya ukuran."
          action={<a href={`${data.whatsappUrl}?text=${encodeURIComponent("Assalamu'alaikum LCA, saya ingin meminta laporan bulanan terbaru.")}`} target="_blank" rel="noreferrer" className="btn btn-outline self-start md:self-end"><FileText className="h-4 w-4" /> Minta laporan lengkap</a>} />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal variants={staggerContainer} className="grid grid-cols-2 gap-4 lg:col-span-5">
            {data.weekly.map((w) => (
              <Reveal key={w.label} variants={cardReveal} className="card-light flex flex-col p-5 md:p-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">{w.period}</span>
                <span className="tnum mt-3 text-3xl font-light tracking-tight text-brand-ink">{w.value}</span>
                <span className="mt-2 text-sm leading-snug text-brand-ink2">{w.label}</span>
              </Reveal>
            ))}
          </Reveal>
          <div className="lg:col-span-7"><PenggerakChart /></div>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.legal.map((l) => (
            <li key={l} className="flex items-start gap-3 rounded-2xl bg-brand-raised p-4 text-sm text-brand-ink2 ring-1 ring-[var(--color-border)]">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
