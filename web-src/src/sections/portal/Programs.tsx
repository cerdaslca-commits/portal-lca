import { ArrowUpRight } from 'lucide-react'
import data from '@/data/business-data.json'
import { DEPT, images, logo, type Img, pic } from '@/lib/images'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { cardReveal, staggerContainer } from '@/lib/motion'

const P = data.programs
const FAMILY = ['LCA', 'GENCAR', 'GEMAR', 'Sensus', 'Pendidikan', 'Tafaqur', 'Wakaf', 'Kiprah Muslimah', 'Mitra Berkah', 'Informasi', 'Kaca Cermin', 'Kaca Patri']

function PhotoCard({ img, kicker, title, text, logoImg, big = false, className = '' }:
  { img: Img; kicker: string; title: string; text: string; logoImg?: Img; big?: boolean; className?: string }) {
  return (
    <Reveal variants={cardReveal} className={`group relative isolate overflow-hidden rounded-[1.75rem] bg-brand-night lift ${className}`}>
      <img {...pic(img, big ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 42vw, 100vw')} alt={img.alt}
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, oklch(30% 0.07 170 / 0.03) 20%, oklch(30% 0.07 170 / 0.62) 100%)' }} />
      <div className={`flex h-full flex-col justify-between ${big ? 'p-8 md:p-10' : 'p-6 md:p-7'}`}>
        <div className="flex items-start justify-between">
          {logoImg ? <img {...pic(logoImg)} alt={logoImg.alt} className={`${big ? 'h-16 w-16' : 'h-12 w-12'} rounded-full shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] ring-2 ring-white/40`} /> : <span />}
          <span className="glass grid h-10 w-10 place-items-center rounded-full text-brand-ondark transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div>
          <p className="eyebrow text-brand-gold">{kicker}</p>
          <h3 className={`mt-2 font-body font-light tracking-tight text-brand-ondark ${big ? 'text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.05]' : 'text-[1.6rem] leading-tight'}`}>{title}</h3>
          <p className={`mt-3 max-w-[46ch] leading-relaxed text-brand-ondark2 ${big ? 'text-base' : 'text-sm'}`}>{text}</p>
        </div>
      </div>
    </Reveal>
  )
}

export function Programs() {
  return (
    <section id="program" aria-labelledby="program-title" className="bg-brand-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHead kicker="Program inti GENCAR" title="Empat layanan, satu tujuan:" accent="Al-Qur'an di setiap rumah."
          body="Dari jawaban sensus, layanan kami bergerak: mushaf diantar, guru ngaji dikirim, dan motivasi diberikan. Semuanya gratis untuk masyarakat." />
        <Reveal variants={staggerContainer} className="mt-12 grid auto-rows-[minmax(260px,auto)] gap-4 md:grid-cols-12">
          <PhotoCard big img={images.program.sensus} logoImg={logo('Sensus')} kicker={P[0].kicker} title={P[0].name} text={P[0].text} className="min-h-[440px] md:col-span-7 md:row-span-2" />
          <PhotoCard img={images.program.pendidikan} logoImg={logo('Pendidikan')} kicker={P[1].kicker} title={P[1].name} text={P[1].text} className="md:col-span-5" />
          <PhotoCard img={images.program.wakaf} logoImg={logo('Wakaf')} kicker={P[2].kicker} title={P[2].name} text={P[2].text} className="md:col-span-5" />
          <PhotoCard img={images.program.guru} logoImg={logo('Peduli Guru Ngaji')} kicker={P[3].kicker} title={P[3].name} text={P[3].text} className="md:col-span-5" />
          <Reveal variants={cardReveal} className="flex flex-col justify-between gap-8 rounded-[1.75rem] bg-brand-cream p-7 md:col-span-7 md:p-9">
            <div>
              <p className="eyebrow text-brand-goldink">Keluarga besar LCA</p>
              <h3 className="mt-2 font-body text-[1.6rem] font-light leading-tight tracking-tight text-brand-ink">
                7 departemen & 2 komunitas, <span className="font-display italic tracking-normal text-brand">satu semboyan.</span>
              </h3>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-brand-ink2">Setiap gerakan memiliki logo sendiri, dengan lingkaran hitam-kuning dan bulan sabit yang sama: “{data.motto}”.</p>
            </div>
            <ul className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 lg:grid-cols-6">
              {FAMILY.map((n) => {
                const l = logo(n)
                return (
                  <li key={n}>
                    <a href={DEPT[n]?.href ?? '/departemen'} title={DEPT[n]?.full ?? n} className="group flex flex-col items-center gap-1.5 text-center">
                      <img {...pic(l)} alt={l.alt} className="h-16 w-16 rounded-full shadow-[0_8px_20px_-10px_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105 md:h-[72px] md:w-[72px]" />
                      <span className="text-[0.72rem] font-semibold leading-tight text-brand-ink group-hover:text-brand">{n}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </Reveal>
      </div>
    </section>
  )
}
