import { useState } from 'react'
import { Check, Link2, Send, Share2 } from 'lucide-react'
import { SOCIALS } from '@/lib/social'

const ORIGIN = 'https://cerdaslca.org'
const path = (k: string) => SOCIALS.find((s) => s.key === k)?.path ?? ''
const Fill = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-[18px] w-[18px]"><path d={d} /></svg>

export type ShareData = { title: string; text: string; url: string }

async function copy(s: string) {
  try { await navigator.clipboard.writeText(s) } catch {
    const a = document.createElement('textarea'); a.value = s; a.style.position = 'fixed'; a.style.opacity = '0'
    document.body.appendChild(a); a.select(); try { document.execCommand('copy') } catch { /* abaikan */ } a.remove()
  }
}

/** Pesan lengkap untuk WhatsApp/salin: judul tebal, isi, lalu tautan. */
export const shareMessage = (d: ShareData) => `*${d.title}*\n\n${d.text}\n\nBaca selengkapnya di Portal Lembaga Cerdas Al-Qur'an:\n${d.url}`
export const absUrl = (p: string) => (p.startsWith('http') ? p : ORIGIN + p)

/**
 * Tombol bagikan ke WhatsApp, Facebook, X, Telegram, Threads, salin tautan (untuk Instagram/TikTok),
 * dan "lainnya" (menu bagikan bawaan HP, berisi semua aplikasi yang terpasang).
 */
export function ShareBar({ data, compact = false, className = '' }: { data: ShareData; compact?: boolean; className?: string }) {
  const [done, setDone] = useState('')
  const msg = shareMessage(data)
  const u = encodeURIComponent(data.url), t = encodeURIComponent(`${data.title} | Lembaga Cerdas Al-Qur'an`)
  const flash = (m: string) => { setDone(m); setTimeout(() => setDone(''), 2600) }
  const open = (href: string) => window.open(href, '_blank', 'noopener')
  const btn = 'grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.55)] transition-transform duration-150 hover:-translate-y-0.5'
  const items = [
    { k: 'fb', label: 'Facebook', bg: '#0866FF', icon: <Fill d={path('facebook')} />, on: () => open(`https://www.facebook.com/sharer/sharer.php?u=${u}`) },
    { k: 'x', label: 'X (Twitter)', bg: '#000', icon: <Fill d={path('x')} />, on: () => open(`https://twitter.com/intent/tweet?text=${t}&url=${u}`) },
    { k: 'tg', label: 'Telegram', bg: '#229ED9', icon: <Send className="h-[17px] w-[17px]" />, on: () => open(`https://t.me/share/url?url=${u}&text=${t}`) },
    { k: 'th', label: 'Threads', bg: '#111', icon: <span className="text-[17px] font-bold leading-none">@</span>, on: () => open(`https://www.threads.net/intent/post?text=${encodeURIComponent(`${data.title}\n${data.url}`)}`) },
    { k: 'link', label: 'Salin tautan (Instagram/TikTok)', bg: '#475569', icon: done ? <Check className="h-[17px] w-[17px]" /> : <Link2 className="h-[17px] w-[17px]" />, on: () => copy(msg).then(() => flash('Disalin. Tempel di Instagram, TikTok, atau grup mana pun.')) },
    { k: 'more', label: 'Bagikan ke aplikasi lain', bg: 'var(--color-accent-ink)', icon: <Share2 className="h-[17px] w-[17px]" />, on: () => {
      if (navigator.share) navigator.share({ title: data.title, text: `${data.title}\n\n${data.text}`, url: data.url }).catch(() => {})
      else copy(msg).then(() => flash('Disalin. Tempel di aplikasi mana pun.'))
    } },
  ]
  return (
    <div className={`relative flex flex-wrap items-center gap-2 ${className}`}>
      <button type="button" onClick={() => open(`https://wa.me/?text=${encodeURIComponent(msg)}`)} aria-label="Bagikan via WhatsApp"
        className={`inline-flex h-9 items-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 ${compact ? 'w-9 justify-center' : 'pl-2.5 pr-4'}`}>
        <Fill d={path('whatsapp')} />{!compact && 'Bagikan ke WhatsApp'}
      </button>
      {items.map((i) => (
        <button key={i.k} type="button" onClick={i.on} title={i.label} aria-label={`Bagikan via ${i.label}`} className={btn} style={{ background: i.bg }}>{i.icon}</button>
      ))}
      {done && <span role="status" className="absolute left-0 top-full z-10 mt-2 rounded-xl bg-brand-night px-3 py-2 text-xs text-brand-ondark shadow-lg">{done}</span>}
    </div>
  )
}
