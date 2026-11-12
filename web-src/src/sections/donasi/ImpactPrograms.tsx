import data from '@/data/business-data.json'
import { logo, pic } from '@/lib/images'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { fadeUp, staggerContainer } from '@/lib/motion'

const DESC = [
  'Pendataan setiap muslim dalam komunitas untuk mengetahui kepemilikan, kemampuan, dan kebiasaan membaca Al-Qur\'an, sebagai dasar program mental spiritual setempat.',
  'Belajar Al-Qur\'an gratis bagi siapa pun, dengan metode yang disesuaikan kondisi peserta dan didukung aplikasi LCA Online.',
  'Menerima dan menyalurkan wakaf Al-Qur\'an dengan komitmen satu mushaf untuk satu orang muslim, dibina melalui tadarus online.',
  'Memperhatikan keilmuan dan kesejahteraan guru ngaji beserta keluarganya agar fokus mendidik para santri.',
]
const LOGOS = ['Sensus', 'Pendidikan', 'Wakaf', 'Peduli Guru Ngaji']
const WHY = [
  ['Nyata & terukur', 'Setiap program punya laporan dan dampak yang jelas.'],
  ['Sampai ke pelosok', 'Penggerak hadir langsung di rumah-rumah warga.'],
  ['Amanah & transparan', 'Laporan rutin dapat diakses masyarakat.'],
  ['Jariyah berkelanjutan', 'Al-Qur\'an dibaca, dipelajari, dan diamalkan.'],
]

export function ImpactPrograms() {
  return (
    <section id="dampak" className="bg-brand-surface py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead kicker="Ke mana infak bergerak" title="Empat program," accent="satu siklus kebaikan." />
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-brand-ink2">Sensus menemukan kebutuhan, lalu mushaf diantar, guru ngaji dikirim, dan guru ngaji itu sendiri dimuliakan.</p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {WHY.map(([t, d], i) => (
                <li key={t} className="rounded-2xl bg-brand-raised p-4 ring-1 ring-[var(--color-border)]">
                  <span className="tnum grid h-7 w-7 place-items-center rounded-full bg-brand-goldsoft text-xs font-bold text-brand-goldink">{i + 1}</span>
                  <p className="mt-3 text-sm font-semibold text-brand-ink">{t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-ink2">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Reveal variants={staggerContainer} as="ol" className="flex flex-col gap-4 lg:col-span-7">
          {data.programs.map((p, i) => {
            const l = logo(LOGOS[i])
            return (
              <Reveal key={p.name} variants={fadeUp} as="li" className="card-light grid gap-5 p-6 sm:grid-cols-[auto_1fr] md:p-8 lift">
                <img {...pic(l)} alt={l.alt} className="h-16 w-16 rounded-full" />
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-goldink">0{i + 1} · {p.kicker}</p>
                  <h3 className="mt-1.5 text-2xl font-light tracking-tight text-brand-ink">{p.name}</h3>
                  <p className="mt-2 max-w-[56ch] text-[0.95rem] leading-relaxed text-brand-ink2">{DESC[i]}</p>
                </div>
              </Reveal>
            )
          })}
          <li className="rounded-[1.25rem] bg-brand-cream p-6 font-display text-2xl italic leading-snug text-brand-ink md:p-8">
            “Setiap huruf yang dibaca, setiap orang yang belajar, dan setiap guru yang terus mengajar menjadi pahala jariyah untuk Anda.”
          </li>
        </Reveal>
      </div>
    </section>
  )
}
