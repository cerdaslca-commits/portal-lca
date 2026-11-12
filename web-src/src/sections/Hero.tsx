import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import data from '@/data/business-data.json'
import { images, pic } from '@/lib/images'
import { heroWord, staggerContainer, easeExpo } from '@/lib/motion'
import { scrollToId } from '@/lib/route'
import { Mesh } from '@/components/Mesh'

const LINE_A = ['Satu', 'desa', 'demi', 'satu', 'desa,']
const LINE_B = ['memperhatikan', "Al-Qur'an."]

export function Hero({ onDonate }: { onDonate: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])

  return (
    <section ref={ref} id="top" className="noise relative isolate flex min-h-[100svh] items-end overflow-hidden bg-brand-night pb-14 pt-32 md:pb-20">
      <m.div style={{ y, scale }} className="absolute inset-0 -z-20">
        <img {...pic(images.hero, '100vw', true)} alt={images.hero.alt} className="h-full w-full object-cover object-center" />
      </m.div>
      {/* scrim: emerald night, heavier at bottom-left where text sits */}
      <div aria-hidden className="absolute inset-0 -z-10" style={{
        background: 'linear-gradient(180deg, oklch(17.5% 0.034 172 / 0.55) 0%, oklch(17.5% 0.034 172 / 0.35) 35%, oklch(17.5% 0.034 172 / 0.92) 82%), linear-gradient(90deg, oklch(17.5% 0.034 172 / 0.75) 0%, oklch(17.5% 0.034 172 / 0) 70%)',
      }} />
      <Mesh className="-z-10 opacity-60 mix-blend-soft-light" />

      <div className="container-x grid w-full gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <m.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeExpo }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-ondark">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            GENCAR · 85 desa sejak 2007
          </m.p>

          <m.h1 variants={staggerContainer} initial="hidden" animate="show"
            className="mt-6 font-body display-thin text-[clamp(2.75rem,7.4vw,6.25rem)] text-brand-ondark">
            <span className="block">
              {LINE_A.map((w, i) => (<m.span key={i} variants={heroWord} className="mr-[0.22em] inline-block">{w}</m.span>))}
            </span>
            <span className="block font-display italic tracking-normal text-brand-gold">
              {LINE_B.map((w, i) => (<m.span key={i} variants={heroWord} className="mr-[0.2em] inline-block">{w}</m.span>))}
            </span>
          </m.h1>

          <m.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease: easeExpo }}
            className="mt-6 max-w-[54ch] text-[1.075rem] leading-relaxed text-brand-ondark2">
            Kami mendata, mengajar, mewakafkan mushaf, dan memuliakan guru ngaji — rumah demi rumah. Semua layanan LCA kepada masyarakat tidak memungut biaya.
          </m.p>

          <m.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6, ease: easeExpo }}
            className="mt-8 flex flex-wrap gap-3">
            <button onClick={onDonate} className="btn btn-gold">Ikut berinfak <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => scrollToId('program')} className="btn btn-glass">Kenali program</button>
          </m.div>
        </div>

        <m.figure initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease: easeExpo }}
          className="glass hidden rounded-[1.75rem] p-6 lg:col-span-4 lg:block">
          <p className="arabic text-right text-[1.65rem] leading-[2.1] text-brand-ondark">{data.verse.arabic}</p>
          <figcaption className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-brand-ondark2">
            “{data.verse.translation}”
            <span className="mt-2 block text-xs font-semibold tracking-wide text-brand-gold">{data.verse.ref}</span>
          </figcaption>
        </m.figure>
      </div>

      <button onClick={() => scrollToId('dampak-portal')} aria-label="Gulir ke bawah"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 rounded-full p-2 text-brand-ondark3 transition-colors hover:text-brand-ondark md:block">
        <ChevronDown className="h-5 w-5" style={{ animation: 'drift-c 3s ease-in-out infinite' }} />
      </button>
    </section>
  )
}
