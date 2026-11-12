import { useEffect, useState } from 'react'
import { DonateHero } from '@/sections/donasi/DonateHero'
import { Villages } from '@/sections/donasi/Villages'
import { ImpactPrograms } from '@/sections/donasi/ImpactPrograms'
import { Proof } from '@/sections/donasi/Proof'
import { TrustFAQ } from '@/sections/donasi/TrustFAQ'
import { CTA } from '@/sections/CTA'
import { StickyDonate } from '@/components/StickyDonate'
import { queryParam, scrollToId } from '@/lib/route'
import { villageById } from '@/lib/villages'

export function Donasi() {
  const fromUrl = () => (villageById(queryParam('desa')) ? queryParam('desa')! : '')
  const [desa, setDesa] = useState(fromUrl)
  useEffect(() => {
    const sync = () => { const d = fromUrl(); if (d) { setDesa(d); setTimeout(() => scrollToId('donasi-form'), 350) } }
    sync()
    window.addEventListener('lca:navigate', sync)
    return () => window.removeEventListener('lca:navigate', sync)
  }, [])
  const toForm = () => scrollToId('donasi-form')
  return (
    <main>
      <DonateHero desa={desa} setDesa={setDesa} />
      <Villages setDesa={setDesa} />
      <ImpactPrograms />
      <Proof />
      <TrustFAQ />
      <CTA onDonate={toForm} title="Jadikan cerita berikutnya" accent="mungkin terjadi." />
      <StickyDonate onClick={toForm} />
    </main>
  )
}
