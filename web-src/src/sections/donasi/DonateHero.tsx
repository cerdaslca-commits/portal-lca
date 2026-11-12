import { m } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import data from '@/data/business-data.json'
import { images, pic } from '@/lib/images'
import { easeExpo, heroWord, staggerContainer } from '@/lib/motion'
import { DonateForm } from '@/components/DonateForm'
import { Mesh } from '@/components/Mesh'

const C = data.coverage
const WORDS = ['Hadirkan', "Al-Qur'an", 'di', 'rumah']

export function DonateHero({ desa, setDesa }: { desa: string; setDesa: (d: string) => void }) {
  const pct = (C.total / C.of) * 100
  return (
    <section id="top" className="noise relative isolate overflow-hidden bg-brand-night pb-16 pt-28 md:pb-24 md:pt-36">
      <img {...pic(images.heroDonasi, '100vw', true)} alt={images.heroDonasi.alt} className="absolute inset-0 -z-20 h-full w-full object-cover object-[30%_30%]" />
      <div aria-hidden className="absolute inset-0 -z-10" style={{
        background: 'linear-gradient(90deg, oklch(17.5% 0.034 172 / 0.94) 0%, oklch(17.5% 0.034 172 / 0.78) 45%, oklch(17.5% 0.034 172 / 0.55) 100%), linear-gradient(0deg, oklch(17.5% 0.034 172 / 0.9), transparent 40%)',
      }} />
      <Mesh className="-z-10 opacity-70 mix-blend-soft-light" />

      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-end xl:col-span-7">
          <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-brand-ondark">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" /> Yayasan Al-Kalam · Rekomendasi MUI & Kemenag
          </p>
          <m.h1 variants={staggerContainer} initial="hidden" animate="show" className="mt-6 font-body display-thin text-[clamp(2.6rem,6.4vw,5.25rem)] text-brand-ondark">
            {WORDS.map((w, i) => <m.span key={i} variants={heroWord} className="mr-[0.22em] inline-block">{w}</m.span>)}
            <m.span variants={heroWord} className="inline-block font-display italic tracking-normal text-brand-gold">yang belum memilikinya.</m.span>
          </m.h1>
          <m.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6, ease: easeExpo }}
            className="mt-6 max-w-[52ch] text-[1.075rem] leading-relaxed text-brand-ondark2">
            Satu desa demi satu desa, bantu GENCAR menghadirkan Sensus Al-Qur'an, pendidikan gratis, wakaf mushaf, dan kepedulian guru ngaji.
          </m.p>

        </div>

        <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: easeExpo }} className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center xl:col-span-5 xl:col-start-8">
          <DonateForm desa={desa} setDesa={setDesa} />
        </m.div>
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6, ease: easeExpo }}
          className="glass max-w-xl self-start rounded-[1.5rem] p-5 md:p-6 lg:col-span-6 lg:col-start-1 lg:row-start-2 xl:col-span-7">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-semibold text-brand-ondark">Menuju seluruh Bandung Raya</p>
            <p className="tnum text-sm text-brand-ondark2"><span className="text-xl font-light text-brand-ondark">{C.total}</span> / {C.of} desa</p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--color-glass)]" role="progressbar" aria-valuenow={C.total} aria-valuemin={0} aria-valuemax={C.of} aria-label="Desa tergarap">
            <m.div className="h-full origin-left rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--mesh-mint), var(--color-accent))' }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 1.2, ease: easeExpo }} />
          </div>
          <ul className="tnum mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-brand-ondark">
            <li><span className="block text-xl font-light">48.726</span><span className="text-xs text-brand-ondark2">KK disensus</span></li>
            <li><span className="block text-xl font-light">12.853</span><span className="text-xs text-brand-ondark2">mushaf diwakafkan</span></li>
            <li><span className="block text-xl font-light">612</span><span className="text-xs text-brand-ondark2">guru ngaji dibina</span></li>
          </ul>
        </m.div>
      </div>
    </section>
  )
}
