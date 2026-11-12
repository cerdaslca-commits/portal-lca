import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CalendarDays, Moon, ArrowRight } from 'lucide-react'
import { countdowns, formatGregorian, formatHijri, MONTHS_AR, todayEvent, todayJakarta, toHijri, upcoming, wordOfDay } from '@/lib/hijri'
import data from '@/data/business-data.json'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { fadeUp } from '@/lib/motion'

const T = data.today
const trig = 'gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-brand-ink2 data-[state=active]:bg-brand data-[state=active]:text-brand-ondark data-[state=active]:shadow-none hover:text-brand-ink'

// Recompute when the Jakarta date changes (checked every 5 minutes).
function useJakartaDay() {
  const [day, setDay] = useState(() => todayJakarta())
  useEffect(() => {
    const t = setInterval(() => { const d = todayJakarta(); setDay((p) => (p.getTime() === d.getTime() ? p : d)) }, 300000)
    return () => clearInterval(t)
  }, [])
  return day
}

export function Today() {
  const day = useJakartaDay()
  const cal = useMemo(() => {
    const h = toHijri(day)
    return { h, hijri: formatHijri(h), gregorian: formatGregorian(day), cd: countdowns(day), next: upcoming(day).filter((e) => e.inDays > 0).slice(0, 4), today: todayEvent(day), word: wordOfDay(day) }
  }, [day])
  const W = cal.word as { arabic: string; latin: string; meaning: string; ref: string; ayah: string; translation: string; note?: string }
  return (
    <section id="hari-ini" aria-labelledby="today-title" className="bg-brand-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHead kicker="Hari ini bersama Al-Qur'an" title="Satu halaman setiap hari," accent="satu kata setiap pagi." />
        <Reveal variants={fadeUp} className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* date tile */}
          <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] bg-brand-night p-8 text-brand-ondark lg:col-span-4">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl" style={{ background: 'var(--mesh-emerald)', opacity: 0.7 }} />
            <div className="relative">
              <p className="eyebrow flex items-center gap-2 text-brand-gold"><Moon className="h-3.5 w-3.5" /> Hari ini · KHGT</p>
              <p id="today-title" className="mt-4 font-display text-[2rem] leading-none sm:text-[2.6rem]">{cal.hijri}</p>
              <p className="arabic mt-2 text-left text-xl text-brand-ondark2" style={{ direction: 'rtl', textAlign: 'left' }}>{MONTHS_AR[cal.h.m - 1]}</p>
              <p className="mt-3 text-sm text-brand-ondark2">{cal.gregorian} · WIB</p>
              <ul className="mt-8 grid grid-cols-3 gap-2">
                {cal.cd.map((c) => (
                  <li key={c.label} className="rounded-2xl bg-[var(--color-glass)] p-3 ring-1 ring-[var(--color-glass-border)]" title={formatGregorian(c.e.date, { day: 'numeric', month: 'long', year: 'numeric' })}>
                    <span className="tnum block text-2xl font-light">{c.e.inDays === 0 ? 'Hari ini' : c.e.inDays}</span>
                    <span className="mt-1 block text-[0.7rem] leading-tight text-brand-ondark2">{c.e.inDays === 0 ? c.label.replace('menuju ', '') : `hari ${c.label}`}</span>
                    <span className="mt-1 block text-[0.65rem] text-brand-ondark3">{formatGregorian(c.e.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-brand-ondark2">{cal.today ? `Hari ini: ${cal.today.title}. ${cal.today.text}` : 'Tidak ada hari besar hari ini. Luangkan waktu membaca Al-Qur\'an, walau satu halaman.'}</p>
            </div>
          </div>

          <Tabs defaultValue="kata" className="card-light min-w-0 p-3 md:p-4 lg:col-span-8">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-full bg-brand-surface p-1 hide-scrollbar">
              <TabsTrigger value="kata" className={trig}><BookOpen className="h-4 w-4" /> Kata hari ini</TabsTrigger>
              <TabsTrigger value="kalender" className={trig}><CalendarDays className="h-4 w-4" /> Pengingat</TabsTrigger>
              <TabsTrigger value="materi" className={trig}><ArrowRight className="h-4 w-4" /> Materi pekan ini</TabsTrigger>
            </TabsList>

            <TabsContent value="kata" className="mt-0 p-5 md:p-7">
              <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
                <span className="arabic grid h-32 w-32 place-items-center rounded-[1.5rem] bg-brand-container text-6xl text-brand">{W.arabic}</span>
                <div>
                  <p className="text-xs font-semibold text-brand-goldink">Kata hari ini · QS. {W.ref}</p>
                  <p className="mt-2 text-3xl font-light tracking-tight text-brand-ink">{W.meaning} <span className="font-display italic text-brand-mute">{W.latin}</span></p>
                  <p className="arabic mt-3 text-right text-2xl text-brand-ink md:text-left" style={{ direction: 'rtl' }}>{W.ayah}</p>
                  <p className="mt-2 text-sm text-brand-ink2">“{W.translation}”</p>
                </div>
              </div>
              {W.note && <p className="mt-6 rounded-2xl bg-brand-goldsoft px-4 py-3 text-sm text-brand-ink2">{W.note}</p>}
            </TabsContent>

            <TabsContent value="kalender" className="mt-0 p-5 md:p-7">
              <ul className="divide-y divide-[var(--color-border)]">
                {cal.next.map((n) => (
                  <li key={n.title + n.inDays} className="flex items-center gap-5 py-4">
                    <span className="tnum w-16 shrink-0 text-center text-brand">
                      <span className="block text-2xl font-light leading-none">{n.date.getUTCDate()}</span>
                      <span className="block text-xs font-semibold">{formatGregorian(n.date, { month: 'short', year: 'numeric' })}</span>
                    </span>
                    <span>
                      <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">{n.kind} · {n.inDays} hari lagi</span>
                      <span className="block font-semibold text-brand-ink">{n.title}</span>
                      <span className="block text-sm text-brand-ink2">{n.text} {formatGregorian(n.date, { weekday: 'long' })}.</span>
                    </span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="materi" className="mt-0 grid gap-3 p-5 md:grid-cols-3 md:p-7">
              {T.materi.map((m) => (
                <article key={m.title} className="flex flex-col rounded-2xl bg-brand-surface p-5 lift">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">{m.tag}</p>
                  <h3 className="mt-2 font-semibold leading-snug text-brand-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink2">{m.text}</p>
                </article>
              ))}
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  )
}
