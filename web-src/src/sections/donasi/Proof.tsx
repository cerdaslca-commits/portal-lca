import { useState } from 'react'
import { Play } from 'lucide-react'
import data from '@/data/business-data.json'
import { byAlt, bySection, pic } from '@/lib/images'
import { Mesh } from '@/components/Mesh'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { slideIn, staggerContainer, sectionReveal } from '@/lib/motion'

// Sampul: foto lapangan untuk video lama; video baru memakai sampul dari videonya sendiri (v.poster).
const POSTERS: Record<string, ReturnType<typeof byAlt>> = {
  '/media/video/lca-perjalanan.mp4': byAlt('Barisan Penggerak'),
  '/media/video/testimoni-penerima-manfaat.mp4': byAlt('Penerima wakaf mushaf'),
  '/media/video/testimoni-guru-ngaji.mp4': byAlt('apresiasi kepada guru ngaji'),
}

function Reel({ i }: { i: number }) {
  const [play, setPlay] = useState(false)
  const v = data.videos[i] as { title: string; url: string; duration?: string; poster?: string; quote?: string }
  const cover = POSTERS[v.url]
  return (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-brand-night2 ring-1 ring-[var(--color-glass-border)]">
      {play ? (
        <video src={v.url} poster={cover?.src ?? v.poster} controls autoPlay playsInline preload="metadata" className="h-full w-full object-cover" />
      ) : (
        <button onClick={() => setPlay(true)} className="absolute inset-0 text-left" aria-label={`Putar video: ${v.title}`}>
          {cover ? <img {...pic(cover, '(min-width: 768px) 25vw, 72vw')} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
            : <img src={v.poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />}
          <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, oklch(22% 0.05 170 / 0.77))' }} />
          <span className="glass absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-brand-ondark transition-transform duration-200 group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
          <span className="absolute inset-x-4 bottom-4">
            {v.duration && <span className="tnum text-xs text-brand-ondark2">{v.duration}</span>}
            <span className="mt-1 block font-semibold leading-snug text-brand-ondark">{v.title}</span>
            {v.quote && <span className="mt-1.5 line-clamp-3 block text-xs italic leading-snug text-brand-ondark2">“{v.quote}”</span>}
          </span>
        </button>
      )}
    </div>
  )
}

export function Proof({ id = 'bukti', kicker = 'Bukti nyata', title = 'Lihat kegiatannya. Dengarkan ceritanya.', accent = 'Lanjutkan dampaknya.', feedOn = true, youtube = false }:
  { id?: string; kicker?: string; title?: string; accent?: string; feedOn?: boolean; youtube?: boolean }) {
  const feed = bySection('gallery').slice(0, 6)
  return (
    <section id={id} className="noise relative isolate overflow-hidden bg-brand-night py-20 md:py-28">
      <Mesh />
      <div className="container-x relative">
        <Reveal variants={sectionReveal}>
          <SectionHead dark kicker={kicker} title={title} accent={accent} />
        </Reveal>
        <Reveal variants={staggerContainer} className="hide-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {data.videos.map((_, i) => (
            <Reveal key={i} variants={slideIn} className="w-[72%] shrink-0 snap-center sm:w-[46%] md:w-auto"><Reel i={i} /></Reveal>
          ))}
        </Reveal>

        {youtube && (
          <div className="mt-10">
            <p className="text-sm font-semibold text-brand-ondark">Tonton juga di YouTube LCA</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.youtube.map((y) => (
                <li key={y.url}><a href={y.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-brand-ondark ring-1 ring-white/20 transition-colors hover:bg-white/20">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#ff0033]" aria-hidden><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>{y.title}</a></li>
              ))}
              <li><a href="https://www.youtube.com/@cerdaslca" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-night">Kanal @cerdaslca ↗</a></li>
            </ul>
          </div>
        )}
        {feedOn && (<>
        <div className="mt-16 flex items-baseline justify-between">
          <h3 className="font-body text-xl font-light text-brand-ondark">Dokumentasi lapangan</h3>
          <a href="https://www.instagram.com/lembagacerdasalquran/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand-gold hover:underline">@lembagacerdasalquran ↗</a>
        </div>
        <ul className="mt-6 grid grid-cols-3 gap-1.5 overflow-hidden rounded-[1.25rem] md:grid-cols-6">
          {feed.map((g) => (
            <li key={g.src} className="group relative aspect-square overflow-hidden bg-brand-night2">
              <img {...pic(g, '(min-width: 768px) 16vw, 33vw')} alt={g.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-end bg-[oklch(22%_0.05_170/0.59)] p-3 text-xs font-medium leading-snug text-brand-ondark opacity-0 transition-opacity duration-200 group-hover:opacity-100">{g.alt}</span>
            </li>
          ))}
        </ul>
        </>)}
      </div>
    </section>
  )
}
