import { SOCIALS, type Social } from '@/lib/social'

export function SocialGlyph({ s, className = 'h-5 w-5' }: { s: Social; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={s.path} />
    </svg>
  )
}

/** Deretan ikon media sosial berwarna resmi. */
export function SocialIcons({ size = 'md', only, className = '' }: { size?: 'sm' | 'md' | 'lg'; only?: string[]; className?: string }) {
  const list = only ? SOCIALS.filter((s) => only.includes(s.key)) : SOCIALS
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  const ico = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-[18px] w-[18px]' : 'h-5 w-5'
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {list.map((s) => (
        <li key={s.key}>
          <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}
            className={`grid ${box} place-items-center rounded-full shadow-[0_6px_18px_-8px_rgba(0,0,0,0.45)] ring-2 ring-white/70 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105`}
            style={{ background: s.bg, color: s.ink ?? '#fff' }}>
            <SocialGlyph s={s} className={ico} />
          </a>
        </li>
      ))}
    </ul>
  )
}
