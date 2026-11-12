import { nb } from '@/lib/nb'
import { ArrowRight, MessageCircle } from 'lucide-react'
import data from '@/data/business-data.json'
import { images, pic } from '@/lib/images'
import { Mesh } from '@/components/Mesh'
import { Reveal } from '@/components/Reveal'
import { sectionReveal } from '@/lib/motion'

export function CTA({ onDonate, title = 'Satu desa berubah, seratus desa maju,', accent = "Indonesia diberkahi Al-Qur'an." }:
  { onDonate: () => void; title?: string; accent?: string }) {
  return (
    <section aria-label="Ajakan berdonasi" className="bg-brand-bg px-3 py-6 md:px-5">
      <Reveal variants={sectionReveal} className="noise relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-brand-night">
        <img {...pic(images.story[1] ?? images.hero, '100vw')} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
        <Mesh className="-z-10" />
        <div className="container-x relative grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brand-gold">Mari jadi bagian dari gerakan ini</p>
            <h2 className="mt-4 font-body display-thin text-[clamp(2.25rem,5vw,4.25rem)] text-brand-ondark">
              {nb(title)} <span className="font-display italic tracking-normal text-brand-gold">{nb(accent)}</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <button onClick={onDonate} className="btn btn-gold w-full !min-h-[52px] text-base sm:w-auto">Donasi sekarang <ArrowRight className="h-4 w-4" /></button>
            <a href={data.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-glass w-full sm:w-auto"><MessageCircle className="h-4 w-4" /> Tanya via WhatsApp</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
