import { useEffect, useState } from 'react'
import { villageById } from '@/lib/villages'
import { trackHit } from '@/lib/pustaka'

export type Route = 'portal' | 'donasi' | 'desa' | 'desa-detail'
export type RouteState = { route: Route; id?: string }

const ORIGIN = 'https://cerdaslca.org'
const DEFAULT_DESC = 'Satu desa demi satu desa, LCA mendata, mengajar, mewakafkan mushaf, dan memuliakan guru ngaji di 85 desa Bandung Raya — gratis untuk masyarakat sejak 2007.'

export const pathOf = (s: RouteState) =>
  s.route === 'donasi' ? '/donasi' : s.route === 'desa' ? '/desa' : s.route === 'desa-detail' ? `/desa/${s.id}` : '/'

function metaOf(s: RouteState) {
  if (s.route === 'donasi') return { title: "Donasi GENCAR — Hadirkan Al-Qur'an di Setiap Rumah | LCA", desc: "Infak untuk Sensus Al-Qur'an, pendidikan baca Al-Qur'an gratis, wakaf mushaf, dan Peduli Guru Ngaji. Bayar via QRIS, transfer, atau Midtrans.", og: '/og-donasi.jpg' }
  if (s.route === 'desa') return { title: '85 Desa GENCAR — Pilih dan Dukung Desanya | LCA', desc: 'Daftar 85 desa/kelurahan garapan GENCAR di Cimahi, Bandung Barat, dan Kabupaten Bandung, lengkap dengan kebutuhan dana dan capaian program.', og: '/og-donasi.jpg' }
  if (s.route === 'desa-detail') {
    const v = villageById(s.id)
    if (v) return { title: `GENCAR ${v.name} — Kec. ${v.district} | LCA`, desc: `Dukung Gerakan Cerdas Baca Al-Qur'an di ${v.name}, Kec. ${v.district}: sensus Al-Qur'an, wakaf mushaf, belajar gratis, dan peduli guru ngaji.`, og: '/og-donasi.jpg' }
  }
  return { title: "Lembaga Cerdas Al-Qur'an (LCA) — Gerakan Cerdas Baca Al-Qur'an", desc: DEFAULT_DESC, og: '/og-image.jpg' }
}

const parse = (): RouteState => {
  const p = window.location.pathname.replace(/\/+$/, '') || '/'
  if (window.location.hash.startsWith('#/donasi') || p === '/donasi') return { route: 'donasi' }
  if (p === '/desa') return { route: 'desa' }
  const m = p.match(/^\/desa\/([a-z0-9-]+)$/)
  if (m && villageById(m[1])) return { route: 'desa-detail', id: m[1] }
  if (m) return { route: 'desa' }
  return { route: 'portal' }
}

function setMeta(s: RouteState) {
  const m = metaOf(s)
  const url = ORIGIN + pathOf(s)
  document.title = m.title
  const set = (sel: string, attr: string, val: string) => document.querySelector(sel)?.setAttribute(attr, val)
  set('meta[name="description"]', 'content', m.desc)
  set('meta[property="og:title"]', 'content', m.title)
  set('meta[property="og:description"]', 'content', m.desc)
  set('meta[property="og:image"]', 'content', ORIGIN + m.og)
  set('meta[property="og:url"]', 'content', url)
  set('link[rel="canonical"]', 'href', url)
}

const EVT = 'lca:navigate'
/** Navigate from anywhere (no prop drilling). `query` e.g. "desa=cilame". */
export function navigate(route: Route, id?: string, query?: string) {
  const path = pathOf({ route, id }) + (query ? `?${query}` : '')
  if (path !== window.location.pathname + window.location.search) window.history.pushState(null, '', path)
  window.dispatchEvent(new Event(EVT))
  window.scrollTo({ top: 0 })
}

export function useRoute(): [RouteState, (r: Route, id?: string) => void] {
  const [state, setState] = useState<RouteState>(parse)
  useEffect(() => {
    if (window.location.hash.startsWith('#/donasi')) window.history.replaceState(null, '', '/donasi')
    setMeta(state)
    trackHit(pathOf(state))
  }, [state])
  useEffect(() => {
    const on = () => setState(parse())
    window.addEventListener('popstate', on)
    window.addEventListener(EVT, on)
    return () => { window.removeEventListener('popstate', on); window.removeEventListener(EVT, on) }
  }, [])
  return [state, (r, id) => navigate(r, id)]
}

export const queryParam = (k: string) => new URLSearchParams(window.location.search).get(k) ?? undefined

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
