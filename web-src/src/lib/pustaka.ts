import { useEffect, useState } from 'react'

/**
 * Jembatan ke konten portal lama (index.html di akar repo portal-lca).
 * Halaman-halaman itu tetap dilayani server.js di alamat /<id> (mis. /materi-3, /sahabat-9, /gabung).
 * Daftarnya dibaca langsung dari index.html lewat /api/pustaka, jadi seri baru yang ditambahkan
 * tugas terjadwal otomatis muncul di beranda tanpa build ulang.
 */
export type PustakaItem = { id: string; title: string; sec: string; tag?: string; desc?: string; terbit?: string }
export type Pustaka = { materi: PustakaItem[]; sahabat: PustakaItem[]; sirah: PustakaItem[]; kajian: PustakaItem[] }

const num = (id: string) => Number(id.replace(/\D+/g, '')) || 0
const byNumDesc = (a: PustakaItem, b: PustakaItem) => num(b.id) - num(a.id)

export function usePustaka(): Pustaka | null {
  const [data, setData] = useState<Pustaka | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/pustaka', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { pages?: PustakaItem[] }) => {
        if (!alive || !Array.isArray(d.pages)) return
        const p = d.pages
        setData({
          materi: p.filter((x) => /^materi-\d+$/.test(x.id)).sort(byNumDesc),
          sahabat: p.filter((x) => /^sahabat-\d+$/.test(x.id)).sort(byNumDesc),
          sirah: p.filter((x) => /^sirah-\d+$/.test(x.id)).sort((a, b) => num(a.id) - num(b.id)),
          kajian: p.filter((x) => /^kajian-[a-z]/.test(x.id)),
        })
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  return data
}

/** Pencatat kunjungan (dipakai panel Pengunjung di portal & tab Pengunjung di admin). */
let lastHit = ''
export function trackHit(path: string) {
  if (path === lastHit) return
  lastHit = path
  try {
    navigator.sendBeacon('/api/hit', new Blob([JSON.stringify({ p: path })], { type: 'application/json' }))
  } catch { /* abaikan */ }
}

/** Menu ke halaman portal (konten lama). */
export const PORTAL_LINKS = [
  { label: 'Materi', href: '/materi' },
  { label: 'Sirah', href: '/sirah' },
  { label: 'Kalender', href: '/kalender' },
  { label: 'Sensus', href: '/sensus' },
  { label: 'Relawan', href: '/gabung' },
]
