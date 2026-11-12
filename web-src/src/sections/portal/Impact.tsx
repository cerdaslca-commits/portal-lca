import data from '@/data/business-data.json'
import { Counter } from '@/components/Counter'
import { Reveal } from '@/components/Reveal'
import { staggerContainer, fadeUp } from '@/lib/motion'

const SHORT = ['desa & kelurahan', 'KK tersensus', 'mushaf diwakafkan', 'santri belajar gratis', 'guru ngaji dibina']

export function Impact() {
  return (
    <section id="dampak-portal" aria-labelledby="impact-title" className="relative bg-brand-bg py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="impact-title" className="max-w-xl font-body display-thin text-[clamp(1.75rem,3.4vw,2.6rem)] text-brand-ink">
            Dampak yang bisa dihitung, <span className="font-display italic tracking-normal text-brand">rumah demi rumah.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-brand-mute">{data.statsNote}</p>
        </div>
        <Reveal variants={staggerContainer} as="ul" className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-brand-line ring-1 ring-[var(--color-border)] md:grid-cols-5">
          {data.stats.map((s, i) => (
            <Reveal key={s.label} variants={fadeUp} as="li" className={`bg-brand-raised p-6 md:p-7 ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`}>
              <Counter to={s.value} className="block font-body text-[clamp(2.25rem,3.6vw,3rem)] font-light tracking-tight text-brand-ink" />
              <span className="mt-2 block text-sm font-medium text-brand-ink2">{SHORT[i]}</span>
              <span className="mt-0.5 block text-xs text-brand-mute">{i === 0 ? 'di Bandung Raya' : 'kumulatif'}</span>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
