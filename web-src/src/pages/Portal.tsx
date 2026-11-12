import { Hero } from '@/sections/Hero'
import { Impact } from '@/sections/portal/Impact'
import { Stories } from '@/sections/portal/Stories'
import { Programs } from '@/sections/portal/Programs'
import { Reach } from '@/sections/portal/Reach'
import { Today } from '@/sections/portal/Today'
import { Pustaka } from '@/sections/portal/Pustaka'
import { Transparency } from '@/sections/portal/Transparency'
import { CTA } from '@/sections/CTA'
import { StickyDonate } from '@/components/StickyDonate'

export function Portal({ onDonate }: { onDonate: () => void }) {
  return (
    <main>
      <Hero onDonate={onDonate} />
      <Impact />
      <Stories />
      <Programs />
      <Reach />
      <Today />
      <Pustaka />
      <Transparency />
      <CTA onDonate={onDonate} />
      <StickyDonate onClick={onDonate} label="Ikut berinfak" />
    </main>
  )
}
