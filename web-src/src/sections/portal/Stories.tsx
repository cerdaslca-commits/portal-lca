import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { byAlt, images, type Img, pic } from '@/lib/images'
import { Reveal } from '@/components/Reveal'
import { slideIn, staggerContainer } from '@/lib/motion'

type Story = { label: string; frames: (Img & { caption: string })[] }
const f = (needle: string, caption?: string) => { const i = byAlt(needle); return { ...i, caption: caption ?? i.alt } }

const STORIES: Story[] = [
  { label: 'Sensus', frames: [f('mendatangi rumah warga'), f('teras rumah warga'), f('celengan Tafaqur')] },
  { label: 'Wakaf', frames: [f('Penerima wakaf mushaf'), f('diantar sampai ke rumah')] },
  { label: 'Belajar', frames: [f('Pendidikan Baca Al-Qur\'an bersama')] },
  { label: 'Guru Ngaji', frames: [f('apresiasi kepada guru ngaji'), f('Rihlah guru ngaji')] },
  { label: 'Imtihan', frames: [f('santriwati Imtihan'), f('Wisuda santri Imtihan')] },
  { label: 'Qurban', frames: [f('Qurban Bahagia 1447'), f('Qurban Bahagia 1446')] },
  { label: 'GENCAR', frames: [f('Bojongmanggu'), f('hadir di wilayah garapan'), f('penggerak perempuan')] },
]

export function Stories() {
  const [open, setOpen] = useState<number | null>(null)
  const [frame, setFrame] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set())

  const close = useCallback(() => setOpen(null), [])
  const next = useCallback(() => {
    if (open === null) return
    if (frame < STORIES[open].frames.length - 1) setFrame(frame + 1)
    else if (open < STORIES.length - 1) { setOpen(open + 1); setFrame(0) }
    else close()
  }, [open, frame, close])
  const prev = () => {
    if (open === null) return
    if (frame > 0) setFrame(frame - 1)
    else if (open > 0) { setOpen(open - 1); setFrame(0) }
  }

  useEffect(() => {
    if (open === null) return
    setSeen((s) => new Set(s).add(open))
    const t = setTimeout(next, 5000)
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() }
    window.addEventListener('keydown', key)
    return () => { clearTimeout(t); window.removeEventListener('keydown', key) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, frame, next, close])

  const story = open !== null ? STORIES[open] : null

  return (
    <section aria-labelledby="stories-title" className="bg-brand-bg pb-16 md:pb-24">
      <div className="container-x">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="stories-title" className="text-sm font-semibold text-brand-ink">Kabar lapangan</h2>
          <p className="text-xs text-brand-mute">Ketuk lingkaran untuk melihat cerita</p>
        </div>
        <Reveal variants={staggerContainer} as="ul" className="hide-scrollbar mt-5 flex snap-x gap-5 overflow-x-auto pb-2">
          {STORIES.map((s, i) => (
            <Reveal key={s.label} variants={slideIn} as="li" className="snap-start">
              <button onClick={() => { setOpen(i); setFrame(0) }} className="group flex w-[84px] flex-col items-center gap-2 rounded-2xl" aria-label={`Lihat cerita ${s.label}`}>
                <span className="rounded-full p-[3px] transition-transform duration-200 group-hover:scale-105"
                  style={{ background: seen.has(i) ? 'var(--color-border-strong)' : 'conic-gradient(from 200deg, var(--mesh-gold), var(--mesh-mint), var(--mesh-emerald), var(--mesh-gold))' }}>
                  <span className="block rounded-full bg-brand-bg p-[3px]">
                    <img {...pic(s.frames[0], '80px')} alt="" className="h-[72px] w-[72px] rounded-full object-cover" />
                  </span>
                </span>
                <span className="text-xs font-medium text-brand-ink2">{s.label}</span>
              </button>
            </Reveal>
          ))}
          <li className="snap-start">
            <a href="https://www.instagram.com/lembagacerdasalquran/" target="_blank" rel="noreferrer"
              className="flex w-[84px] flex-col items-center gap-2 rounded-2xl">
              <span className="grid h-[84px] w-[84px] place-items-center rounded-full border border-dashed border-brand-line2 bg-brand-surface p-2 text-center text-[0.68rem] font-semibold leading-tight text-brand hover:bg-brand-container">
                Instagram ↗
              </span>
              <span className="text-xs font-medium text-brand-ink2">Selengkapnya</span>
            </a>
          </li>
        </Reveal>
      </div>

      <AnimatePresence>
        {story && open !== null && (
          <m.div role="dialog" aria-modal="true" aria-label={`Cerita ${story.label}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[oklch(22%_0.05_170/0.78)] p-4 backdrop-blur-md" onClick={close}>
            <m.div key={open} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.35 }} onClick={(e) => e.stopPropagation()}
              className="relative aspect-[9/16] h-[min(86svh,760px)] max-w-full overflow-hidden rounded-[1.75rem] bg-brand-night shadow-2xl">
              <img {...pic(story.frames[frame], '(min-width: 768px) 430px, 100vw', true)} alt={story.frames[frame].alt} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, oklch(22% 0.05 170 / 0.51), transparent 22%, transparent 60%, oklch(22% 0.05 170 / 0.72))' }} />
              <div className="absolute inset-x-3 top-3 flex gap-1">
                {story.frames.map((_, i) => (
                  <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                    <span key={`${open}-${frame}`} className="block h-full origin-left rounded-full bg-[var(--color-on-dark)]"
                      style={{ transform: i < frame ? 'scaleX(1)' : 'scaleX(0)', animation: i === frame ? 'story-progress 5s linear forwards' : undefined }} />
                  </span>
                ))}
              </div>
              <div className="absolute inset-x-4 top-7 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-brand-ondark">
                  <img {...pic(images.logoLca)} alt="" className="h-8 w-8 rounded-full" /> lembagacerdasalquran · {story.label}
                </span>
                <button onClick={close} aria-label="Tutup cerita" className="grid h-10 w-10 place-items-center rounded-full text-brand-ondark hover:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              <p className="absolute inset-x-5 bottom-6 text-base font-medium leading-snug text-brand-ondark">{story.frames[frame].caption}</p>
              <button onClick={prev} aria-label="Sebelumnya" className="absolute inset-y-16 left-0 flex w-1/3 items-center opacity-0 hover:opacity-100 focus-visible:opacity-100">
                <ChevronLeft className="ml-2 h-7 w-7 text-brand-ondark" />
              </button>
              <button onClick={next} aria-label="Berikutnya" className="absolute inset-y-16 right-0 flex w-1/3 items-center justify-end opacity-0 hover:opacity-100 focus-visible:opacity-100">
                <ChevronRight className="mr-2 h-7 w-7 text-brand-ondark" />
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
