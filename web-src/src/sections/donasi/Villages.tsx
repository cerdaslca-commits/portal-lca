import { ArrowRight } from 'lucide-react'
import { navigate, scrollToId } from '@/lib/route'
import { FEATURED, villageById, type Village } from '@/lib/villages'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { VillageCard } from '@/components/VillageCard'
import { cardReveal, staggerContainer } from '@/lib/motion'

const LIST = FEATURED.map((id) => villageById(id)).filter(Boolean) as Village[]

export function Villages({ setDesa }: { setDesa: (d: string) => void }) {
  void setDesa; void scrollToId
  return (
    <section id="desa" className="bg-brand-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHead kicker="Pilih desa" title="Kenali desanya," accent="dukung langsung."
          body="Setiap desa garapan punya kebutuhan dana dan capaian program yang terukur. Pilih satu, dan infak Anda tercatat untuk desa itu."
          action={<a href="/desa" onClick={(e) => { e.preventDefault(); navigate('desa') }} className="btn btn-outline self-start md:self-end">Lihat 85 desa <ArrowRight className="h-4 w-4" /></a>} />
        <Reveal variants={staggerContainer} as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LIST.map((v) => (
            <Reveal key={v.id} variants={cardReveal} as="li"><VillageCard v={v} /></Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
