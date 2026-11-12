import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Heart, Menu, X } from 'lucide-react'
import { images, pic } from '@/lib/images'
import { scrollToId, type Route } from '@/lib/route'
import { easeExpo } from '@/lib/motion'
import { PORTAL_LINKS } from '@/lib/pustaka'
import { SocialIcons } from '@/components/SocialIcons'

const LINKS: Record<Route, { label: string; id: string }[]> = {
  portal: [
    { label: 'Program', id: 'program' },
    { label: 'Hari Ini', id: 'hari-ini' },
    { label: 'Pustaka', id: 'pustaka' },
  ],
  donasi: [
    { label: 'Desa', id: 'desa' },
    { label: 'Dampak', id: 'dampak' },
    { label: 'Bukti Nyata', id: 'bukti' },
    { label: 'Tanya Jawab', id: 'faq' },
  ],
  desa: [],
  'desa-detail': [],
}
const TABS: { r: Route; label: string; long: string }[] = [
  { r: 'portal', label: 'Portal', long: 'Portal LCA' },
  { r: 'desa', label: 'Desa', long: '85 Desa' },
  { r: 'donasi', label: 'Donasi', long: 'Donasi' },
]
const isActive = (cur: Route, r: Route) => cur === r || (r === 'desa' && cur === 'desa-detail')

export function Nav({ route, go }: { route: Route; go: (r: Route) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const solid = scrolled || open
  const ink = solid ? 'text-brand-ink' : 'text-brand-ondark'
  const donate = () => { setOpen(false); if (route === 'donasi') scrollToId('donasi-form'); else go('donasi') }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
      <nav
        aria-label="Navigasi utama"
        className={`container-x flex h-16 items-center justify-between gap-2 rounded-full !px-3 sm:gap-4 sm:!px-5 transition-all duration-300 ${
          solid ? 'bg-[color-mix(in_oklch,var(--color-bg)_86%,transparent)] shadow-[0_8px_30px_-12px_var(--shadow-tint-strong)] ring-1 ring-[var(--color-border)] backdrop-blur-xl' : 'bg-[oklch(30%_0.07_170/0.28)] ring-1 ring-white/20 backdrop-blur-md'
        }`}
        style={{ maxWidth: 1240 }}
      >
        <button onClick={() => go('portal')} className="flex min-w-0 items-center gap-2.5 rounded-full sm:gap-3" aria-label="Beranda Lembaga Cerdas Al-Qur'an">
          <img {...pic(images.logoLca, '', true)} alt={images.logoLca.alt} className="h-10 w-10 shrink-0 rounded-full shadow-[0_4px_14px_-4px_rgba(0,0,0,0.45)] ring-2 ring-white/80 sm:h-11 sm:w-11" />
          <span className={`flex min-w-0 flex-col text-left leading-tight ${ink}`}>
            <span className="whitespace-nowrap text-[0.8rem] font-bold tracking-tight min-[380px]:text-[0.86rem] sm:text-[0.98rem]">Lembaga Cerdas Al-Qur'an</span>
            <span className={`whitespace-nowrap text-[0.64rem] sm:text-[0.7rem] ${solid ? 'text-brand-mute' : 'text-brand-ondark2'}`}>Yayasan Al-Kalam · sejak 2007</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS[route].map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollToId(l.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${ink} ${solid ? 'hover:bg-brand-surface' : 'hover:bg-white/10'}`}
              >
                {l.label}
              </button>
            </li>
          ))}
          {(LINKS[route].length <= 3 ? PORTAL_LINKS.filter((l) => l.href !== '/sensus') : []).map((l) => (
            <li key={l.href} className="hidden xl:block">
              <a href={l.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${ink} ${solid ? 'hover:bg-brand-surface' : 'hover:bg-white/10'}`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            role="tablist"
            aria-label="Pilih halaman"
            className={`hidden rounded-full p-1 text-xs font-semibold md:flex ${solid ? 'bg-brand-surface ring-1 ring-[var(--color-border)]' : 'bg-white/15 ring-1 ring-white/25'}`}
          >
            {TABS.map(({ r, label }) => (
              <button
                key={r}
                role="tab"
                aria-selected={isActive(route, r)}
                onClick={() => go(r)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  isActive(route, r) ? 'bg-brand text-brand-ondark' : solid ? 'text-brand-ink2 hover:text-brand-ink' : 'text-white hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={donate} aria-label="Donasi" className="btn btn-gold !min-h-[40px] !px-3 text-sm sm:!px-4">
            <Heart className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">Donasi</span>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full xl:hidden ${ink} ${solid ? 'hover:bg-brand-surface' : 'hover:bg-white/10'}`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: easeExpo }}
            className="container-x mt-2 rounded-3xl bg-[color-mix(in_oklch,var(--color-bg)_95%,transparent)] p-3 shadow-[0_20px_50px_-20px_var(--shadow-tint-strong)] ring-1 ring-[var(--color-border)] backdrop-blur-xl xl:hidden"
          >
            <div className="grid grid-cols-3 gap-1 rounded-full bg-brand-surface p-1 text-sm font-semibold">
              {TABS.map(({ r, long }) => (
                <button key={r} onClick={() => { setOpen(false); go(r) }}
                  className={`rounded-full py-2.5 ${isActive(route, r) ? 'bg-brand text-brand-ondark' : 'text-brand-ink2'}`}>
                  {long}
                </button>
              ))}
            </div>
            <ul className="mt-2">
              {LINKS[route].map((l) => (
                <li key={l.id}>
                  <button onClick={() => { setOpen(false); setTimeout(() => scrollToId(l.id), 50) }}
                    className="w-full rounded-2xl px-4 py-3.5 text-left text-base font-medium text-brand-ink hover:bg-brand-surface">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="px-4 pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">Pustaka & layanan</p>
            <ul className="mt-1 grid grid-cols-2 gap-1">
              {PORTAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block rounded-2xl px-4 py-3 text-base font-medium text-brand-ink hover:bg-brand-surface">{l.label}</a>
                </li>
              ))}
            </ul>
            <SocialIcons size="sm" only={['tiktok', 'instagram', 'youtube', 'facebook', 'snack', 'x', 'whatsapp']} className="justify-center border-t border-brand-line px-2 pb-1 pt-3" />
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
