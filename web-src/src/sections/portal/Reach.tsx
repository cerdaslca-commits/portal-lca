import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import data from '@/data/business-data.json'
import { navigate } from '@/lib/route'
import { Mesh } from '@/components/Mesh'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { Counter } from '@/components/Counter'
import { easeExpo, sectionReveal, slideIn, staggerContainer } from '@/lib/motion'

const C = data.coverage
const R = 54
const CIRC = 2 * Math.PI * R

function Ring() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const pct = C.total / C.of
  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[300px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${C.total} dari ${C.of} desa/kelurahan di Bandung Raya`}>
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-glass-border)" strokeWidth="6" />
        <m.circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-accent)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${CIRC * pct} ${CIRC}`}
          initial={{ opacity: 0, rotate: -90 }} animate={inView ? { opacity: 1, rotate: 0 } : {}} transition={{ duration: 1.2, ease: easeExpo }}
          style={{ transformOrigin: '60px 60px' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <Counter to={C.total} className="font-body text-6xl font-light tracking-tight text-brand-ondark" />
        <span className="mt-1 text-sm text-brand-ondark2">dari <span className="tnum">{C.of}</span> desa/kelurahan</span>
        <span className="mt-1 text-xs font-semibold text-brand-gold">Bandung Raya · {Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}

function RegionBars() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <ul ref={ref} className="flex flex-col gap-5" aria-label="Cakupan per wilayah">
      {C.regions.map((r, i) => (
        <li key={r.name} title={`${r.name}: ${r.pct}% desa/kelurahan tergarap`}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-brand-ondark">{r.name}</span>
            <span className="tnum text-brand-ondark2">{r.pct > 0 ? `${r.pct}%` : 'Segera hadir'}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--color-glass)]">
            <m.div className="h-full origin-left rounded-full"
              style={{ width: `${Math.max(r.pct, 0)}%`, background: 'linear-gradient(90deg, var(--mesh-mint), var(--color-accent))' }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.15 * i, ease: easeExpo }} />
          </div>
        </li>
      ))}
      <li className="text-xs text-brand-ondark3">Sumber: Laporan Sekretariat, Agustus 2026.</li>
    </ul>
  )
}

export function Reach() {
  return (
    <section id="jangkauan" aria-labelledby="reach-title" className="noise relative isolate overflow-hidden bg-brand-night py-20 md:py-28">
      <Mesh />
      <div className="container-x relative">
        <Reveal variants={sectionReveal}>
          <SectionHead dark kicker="Jangkauan" title="Berawal dari satu desa," accent="kini 85 desa."
            body="Kami bukan lembaga yang menunggu umat datang ke masjid. Kami mendatangi rumah demi rumah, menanyakan apakah keluarga itu punya mushaf, bisa membaca, dan rutin tadarus."
            action={<a href="/desa" onClick={(e) => { e.preventDefault(); navigate('desa') }} className="btn btn-glass self-start md:self-end">Lihat 85 desa <ArrowRight className="h-4 w-4" /></a>} />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal variants={sectionReveal} className="glass rounded-[1.75rem] p-8 lg:col-span-5">
            <Ring />
          </Reveal>
          <Reveal variants={sectionReveal} delay={0.1} className="glass flex flex-col justify-center rounded-[1.75rem] p-8 lg:col-span-7 md:p-10">
            <p className="eyebrow text-brand-gold">Cakupan per wilayah</p>
            <p className="mb-8 mt-2 max-w-[48ch] text-sm text-brand-ondark2">Persentase desa/kelurahan yang sudah digarap GENCAR di tiap wilayah.</p>
            <RegionBars />
          </Reveal>
        </div>

        <div className="mt-16 flex items-baseline justify-between">
          <h3 id="reach-title" className="font-body text-xl font-light text-brand-ondark">Linimasa 2007–2026</h3>
          <span className="text-xs text-brand-ondark3">Geser →</span>
        </div>
        <Reveal variants={staggerContainer} as="ol" className="hide-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
          {data.timeline.map((t) => (
            <Reveal key={t.year} variants={slideIn} as="li" className="glass flex w-[270px] shrink-0 snap-start flex-col rounded-[1.25rem] p-6">
              <span className="font-display text-4xl italic text-brand-gold">{t.year}</span>
              <span className="mt-3 font-semibold leading-snug text-brand-ondark">{t.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-brand-ondark2">{t.text}</span>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
