import { nb } from '@/lib/nb'
import type { ReactNode } from 'react'

export function SectionHead({ kicker, title, accent, body, dark = false, action }:
  { kicker: string; title: string; accent?: string; body?: string; dark?: boolean; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`eyebrow ${dark ? 'text-brand-gold' : 'text-brand-goldink'}`}>{kicker}</p>
        <h2 className={`mt-4 font-body display-thin text-[clamp(2rem,4.2vw,3.25rem)] ${dark ? 'text-brand-ondark' : 'text-brand-ink'}`}>
          {nb(title)}{' '}
          {accent && <span className={`font-display italic tracking-normal ${dark ? 'text-brand-gold' : 'text-brand'}`}>{nb(accent)}</span>}
        </h2>
        {body && <p className={`mt-4 max-w-[60ch] text-base leading-relaxed ${dark ? 'text-brand-ondark2' : 'text-brand-ink2'}`}>{body}</p>}
      </div>
      {action}
    </div>
  )
}
