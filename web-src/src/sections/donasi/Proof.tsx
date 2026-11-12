import { useState } from 'react'
import { Play } from 'lucide-react'
import data from '@/data/business-data.json'
import { byAlt, bySection, pic } from '@/lib/images'
import { Mesh } from '@/components/Mesh'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { slideIn, staggerContainer, sectionReveal } from '@/lib/motion'

const POSTERS = [byAlt('Barisan Penggerak'), byAlt('Penerima wakaf mushaf'), byAlt('apresiasi kepada guru ngaji')]

function Reel({ i }: { i: number }) {
  const [play, setPlay] = useState(false)
  const v = data.videos[i]
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-brand-night2 ring-1 ring-[var(--color-glass-border)]">
      {play ? (
        <video src={v.url} poster={POSTERS[i].src} controls autoPlay playsInline className="h-full w-full object-cover" />
      ) : (
        <button onClick={() => setPlay(true)} className="absolute inset-0 text-left" aria-label={`Putar video: ${v.title}`}>
          <img {...pic(POSTERS[i], '(min-width: 768px) 33vw, 72vw')} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, oklch(12% 0.03 172 / 0.9))' }} />
          <span className="glass absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-brand-ondark transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
          <span className="absolute inset-x-4 bottom-4">
            {v.duration && <span className="tnum text-xs text-brand-ondark2">{v.duration}</span>}
            <span className="mt-1 block font-semibold leading-snug text-brand-ondark">{v.title}</span>
          </span>
        </button>
      )}
    </div>
  )
}

export function Proof() {
  const feed = bySection('gallery').slice(0, 6)
  return (
    <section id="bukti" className="noise relative isolate overflow-hidden bg-brand-night py-20 md:py-28">
      <Mesh />
      <div className="container-x relative">
        <Reveal variants={sectionReveal}>
          <SectionHead dark kicker="Bukti nyata" title="Lihat kegiatannya. Dengarkan ceritanya." accent="Lanjutkan dampaknya." />
        </Reveal>
        <Reveal variants={staggerContainer} className="hide-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} variants={slideIn} className="w-[72%] shrink-0 snap-center sm:w-[46%] md:w-auto"><Reel i={i} /></Reveal>
          ))}
        </Reveal>

        <div className="mt-16 flex items-baseline justify-between">
          <h3 className="font-body text-xl font-light text-brand-ondark">Dokumentasi lapangan</h3>
          <a href="https://www.instagram.com/lembagacerdasalquran/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-gold hover:underline">@lembagacerdasalquran ↗</a>
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-1.5 overflow-hidden rounded-[1.25rem] md:grid-cols-6">
          {feed.map((g) => (
            <li key={g.src} className="group relative aspect-square overflow-hidden bg-brand-night2">
              <img {...pic(g, '(min-width: 768px) 16vw, 33vw')} alt={g.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-end bg-[oklch(12%_0.03_172/0.7)] p-3 text-xs font-medium leading-snug text-brand-ondark opacity-0 transition-opacity duration-200 group-hover:opacity-100">{g.alt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
