import { useEffect, useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import data from '@/data/business-data.json'
import { images, pic } from '@/lib/images'
import type { Route } from '@/lib/route'
import { SOCIALS } from '@/lib/social'
import { SocialGlyph } from '@/components/SocialIcons'

type Stats = { online: number; hari_ini: { uv: number }; total: { uv: number } }

export function Footer({ go }: { go: (r: Route) => void }) {
  const [st, setSt] = useState<Stats | null>(null)
  useEffect(() => {
    fetch('/api/stats', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((d) => d && d.ok && setSt(d)).catch(() => {})
  }, [])
  const n = (x: number) => x.toLocaleString('id-ID')
  return (
    <footer className="aurora pb-10 pt-16">
      <div className="container-x">
        <div className="grid gap-10 border-t border-brand-line pt-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="flex items-center gap-3">
              <img {...pic(images.logoLca)} alt={images.logoLca.alt} className="h-14 w-14 rounded-full shadow-[0_6px_18px_-6px_rgba(0,0,0,0.4)]" />
              <div>
                <p className="font-semibold text-brand-ink">{data.name}</p>
                <p className="text-sm text-brand-mute">{data.legalName}</p>
              </div>
            </div>
            <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-brand-ink2">
              Mengajak masyarakat memperhatikan Al-Qur'an untuk memiliki dan memberi, membaca dan menghafal, belajar dan mengajar, serta membimbing dan mengamalkannya.
            </p>
          </div>
          <nav aria-label="Tautan" className="md:col-span-2">
            <p className="text-sm font-semibold text-brand-ink">Jelajahi</p>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-ink2">
              <li><button onClick={() => go('portal')} className="hover:text-brand">Portal LCA</button></li>
              <li><button onClick={() => go('desa')} className="hover:text-brand">85 Desa GENCAR</button></li>
              <li><button onClick={() => go('donasi')} className="hover:text-brand">Donasi GENCAR</button></li>
              <li><a href="/materi" className="hover:text-brand">Materi Al-Qur'an</a></li>
              <li><a href="/sirah" className="hover:text-brand">Sirah & Kisah Sahabat</a></li>
              <li><a href="/kalender" className="hover:text-brand">Kalender Hijriah</a></li>
              <li><a href="/sensus" className="hover:text-brand">Sensus Al-Qur'an</a></li>
              <li><a href="/tentang" className="hover:text-brand">Tentang LCA</a></li>
              <li><a href="/gabung" className="hover:text-brand">Daftar relawan</a></li>
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="text-sm font-semibold text-brand-ink">Kontak</p>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-ink2">
              <li><a href={data.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brand"><MessageCircle className="h-4 w-4" /> WA {data.whatsapp}</a></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {data.phone}</li>
              <li><a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-brand"><Mail className="h-4 w-4" /> {data.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {data.address}</li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-sm font-semibold text-brand-ink">Ikuti kami</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {SOCIALS.map((s) => (
                <li key={s.key}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-center gap-2 rounded-xl bg-brand-raised px-2 py-2 text-[0.82rem] text-brand-ink ring-1 ring-[var(--color-border)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-14px_var(--shadow-tint-strong)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: s.bg, color: s.ink ?? '#fff' }}><SocialGlyph s={s} className="h-3.5 w-3.5" /></span>
                    <span className="min-w-0 leading-tight"><span className="block font-medium">{s.label}</span>{s.followers && <span className="tnum block text-[0.7rem] text-brand-mute">{s.followers} pengikut</span>}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 text-xs text-brand-mute sm:flex-row">
          <p>© 2026 {data.legalName} · {data.name}</p>
          {st ? (
            <p className="tnum">Pengunjung hari ini {n(st.hari_ini.uv)} · sedang membuka {n(st.online)} · total {n(st.total.uv)}</p>
          ) : (
            <p>{data.tagline}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
