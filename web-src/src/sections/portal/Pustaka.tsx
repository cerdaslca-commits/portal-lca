import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ClipboardList, FileBarChart, Images, Languages, ScrollText, UserPlus, Users } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { cardReveal, staggerContainer } from '@/lib/motion'
import { usePustaka, type PustakaItem } from '@/lib/pustaka'
import { ShareBar, absUrl } from '@/components/ShareBar'

const QUICK = [
  { href: '/kata', label: "Kata Al-Qur'an Hari Ini", note: 'Satu kata setiap subuh', Icon: Languages },
  { href: '/kalender', label: 'Kalender Hijriah KHGT', note: 'Hari besar & puasa sunnah', Icon: CalendarDays },
  { href: '/kisah', label: '100 Kisah Sirah', note: 'Satu kisah setiap hari', Icon: ScrollText },
  { href: '/sensus', label: "Sensus Al-Qur'an", note: 'Pendataan rumah demi rumah', Icon: ClipboardList },
  { href: '/laporan', label: 'Laporan Bulanan', note: 'Data & wilayah garapan', Icon: FileBarChart },
  { href: '/galeri', label: 'Galeri Foto & Video', note: 'Kegiatan di desa-desa', Icon: Images },
  { href: '/tentang', label: 'Tentang LCA', note: 'Sejarah, visi, legalitas', Icon: Users },
  { href: '/gabung', label: 'Daftar Relawan', note: 'Guru ngaji & petugas sensus', Icon: UserPlus },
]

function Row({ item, kicker }: { item: PustakaItem; kicker: string }) {
  return (
    <li className="border-t border-brand-line py-4 first:border-t-0">
      <a href={`/${item.id}`} className="group flex items-start justify-between gap-4">
        <span>
          <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">{kicker}{item.tag ? ` · ${item.tag}` : ''}</span>
          <span className="mt-1 block font-semibold leading-snug text-brand-ink group-hover:text-brand">{item.title}</span>
          {item.desc && <span className="mt-1 block text-sm leading-relaxed text-brand-ink2">{item.desc}</span>}
        </span>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-brand-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
      </a>
      <ShareBar compact className="mt-3" data={{ title: `${kicker}: ${item.title}`, text: [item.tag, item.desc].filter(Boolean).join('\n'), url: absUrl(`/${item.id}`) }} />
    </li>
  )
}

export function Pustaka() {
  const p = usePustaka()
  const materi = p?.materi.slice(0, 3) ?? []
  const sahabat = p?.sahabat.slice(0, 3) ?? []

  return (
    <section id="pustaka" aria-labelledby="pustaka-title" className="bg-brand-bg py-20 md:py-28">
      <div className="container-x">
        <div id="pustaka-title">
          <SectionHead kicker="Pustaka LCA" title="Belajar Al-Qur'an," accent="sepekan demi sepekan."
            body="Materi dari kitab para ulama, Sirah Nabawiyah, kisah para sahabat, dan kajian. Seri baru terbit setiap pekan."
            action={<a href="/materi" className="btn btn-outline self-start md:self-end"><BookOpen className="h-4 w-4" /> Semua materi</a>} />
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <article className="card-light p-6 md:p-8 lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold text-brand-ink">Materi Al-Qur'an terbaru</h3>
              <a href="/materi" className="text-sm font-medium text-brand hover:underline">{p ? `${p.materi.length} seri` : 'Lihat'} →</a>
            </div>
            {materi.length ? (
              <ul className="mt-3">{materi.map((m) => <Row key={m.id} item={{ ...m, title: m.title.replace(/^Seri \d+:\s*/, '') }} kicker={m.title.split(':')[0]} />)}</ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-brand-ink2">Seri Materi Al-Qur'an terbit setiap Senin, disusun dari kitab rujukan para ulama. <a className="font-medium text-brand underline" href="/materi">Buka daftar seri</a>.</p>
            )}
          </article>

          <article className="card-light p-6 md:p-8 lg:col-span-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold text-brand-ink">Kisah Sahabat terbaru</h3>
              <a href="/sirah" className="text-sm font-medium text-brand hover:underline">Daftar isi →</a>
            </div>
            {sahabat.length ? (
              <ul className="mt-3">{sahabat.map((s) => <Row key={s.id} item={s} kicker={`Sahabat No. ${s.id.split('-')[1]}`} />)}</ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-brand-ink2">Kisah 60 sahabat Rasulullah ﷺ, satu kisah setiap pekan. <a className="font-medium text-brand underline" href="/sirah">Buka daftar isi</a>.</p>
            )}
            <a href="/sirah-1" className="mt-4 flex items-center justify-between rounded-2xl bg-brand-surface px-4 py-3 text-sm font-medium text-brand-ink ring-1 ring-[var(--color-border)] hover:bg-brand-container">
              Sirah Nabawiyah{p?.sirah.length ? ` · ${p.sirah.length} bab` : ''} <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>

        <Reveal variants={staggerContainer} as="ul" className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {QUICK.map(({ href, label, note, Icon }) => (
            <Reveal key={href} variants={cardReveal} as="li">
              <a href={href} className="group flex h-full flex-col rounded-2xl bg-brand-raised p-4 ring-1 ring-[var(--color-border)] transition-colors hover:bg-brand-surface md:p-5">
                <Icon className="h-5 w-5 text-brand" aria-hidden />
                <span className="mt-3 text-sm font-semibold leading-snug text-brand-ink group-hover:text-brand">{label}</span>
                <span className="mt-1 text-xs leading-snug text-brand-mute">{note}</span>
              </a>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
