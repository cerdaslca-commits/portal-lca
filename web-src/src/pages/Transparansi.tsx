import { ArrowUpRight, BadgeCheck, ClipboardList, FileBarChart, MapPinned, ShieldCheck } from 'lucide-react'
import data from '@/data/business-data.json'
import { Mesh } from '@/components/Mesh'
import { Reveal } from '@/components/Reveal'
import { cardReveal, staggerContainer } from '@/lib/motion'
import { Impact } from '@/sections/portal/Impact'
import { Transparency } from '@/sections/portal/Transparency'
import { CTA } from '@/sections/CTA'

// Laporan lengkap yang tersimpan di portal (halaman dalam).
const REPORTS = [
  { href: '/laporan', label: 'Laporan Bulanan', note: 'Syuro Sekretariat, Bendahara, dan Departemen: pendidikan, Tafaqur & keuangan, komunikasi donatur.', Icon: FileBarChart },
  { href: '/dampak', label: 'Dampak & Wilayah Garapan', note: 'Capaian kumulatif dan progres desa/kelurahan yang telah digarap di Bandung Raya.', Icon: MapPinned },
  { href: '/sensus-tanimulya', label: 'Hasil Sensus Reborn Tanimulya', note: 'Data sensus terbaru per RW: KK tersensus, rumah kosong, dan donatur baru.', Icon: ClipboardList },
  { href: '/legalitas', label: 'Legalitas & Rekomendasi', note: 'Badan hukum Yayasan Al-Kalam serta rekomendasi MUI dan Kemenag.', Icon: ShieldCheck },
]

export function Transparansi({ onDonate }: { onDonate: () => void }) {
  return (
    <main>
      <section id="top" className="noise relative isolate overflow-hidden bg-brand-night pb-14 pt-32 md:pb-20 md:pt-40">
        <Mesh />
        <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brand-gold">Transparansi LCA</p>
            <h1 className="mt-4 font-body display-thin text-[clamp(2.5rem,6vw,4.75rem)] text-brand-ondark">
              <span className="lca-w">Setiap</span> <span className="lca-w">rupiah</span> <span className="lca-w">tercatat,</span>{' '}
              <span className="font-display italic tracking-normal text-brand-gold"><span className="lca-w">setiap</span> <span className="lca-w">program</span> <span className="lca-w">terukur.</span></span>
            </h1>
            <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-brand-ondark2">
              Angka di halaman ini diambil dari Laporan Sekretariat dan Laporan Bendahara LCA, yang disusun setiap bulan dalam syuro bulanan. Laporan lengkap dapat dibuka atau diminta langsung kepada sekretariat.
            </p>
          </div>
          <ul className="glass grid gap-3 rounded-[1.5rem] p-6 text-sm text-brand-ondark lg:col-span-4">
            {data.legal.slice(0, 3).map((l) => (
              <li key={l} className="flex items-start gap-3"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" /> {l}</li>
            ))}
          </ul>
        </div>
      </section>

      <Impact />
      <Transparency />

      <section aria-labelledby="laporan-title" className="bg-brand-bg py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow text-brand-goldink">Laporan lengkap</p>
          <h2 id="laporan-title" className="mt-4 font-body display-thin text-[clamp(1.75rem,3.4vw,2.6rem)] text-brand-ink">
            Buka <span className="font-display italic tracking-normal text-brand">datanya sendiri.</span>
          </h2>
          <Reveal variants={staggerContainer} as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPORTS.map(({ href, label, note, Icon }) => (
              <Reveal key={href} variants={cardReveal} as="li">
                <a href={href} className="card-light group flex h-full flex-col p-6">
                  <Icon className="h-6 w-6 text-brand" aria-hidden />
                  <span className="mt-4 text-base font-semibold text-brand-ink group-hover:text-brand">{label}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink2">{note}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Buka laporan <ArrowUpRight className="h-4 w-4" /></span>
                </a>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      <CTA onDonate={onDonate} />
    </main>
  )
}
