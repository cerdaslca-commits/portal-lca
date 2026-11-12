import data from '@/data/villages.json'
import { byAlt, village as villagePhoto, type Img } from '@/lib/images'

export type Village = {
  id: string; name: string; district: string; city: string; period: string
  fundingRequired: number; fundingCollected: number
  kk: number | null; mushaf: number | null; peserta: number | null; guru: number | null; note?: string
}
export const VILLAGES = data.villages as Village[]
export const CITIES = ['Cimahi', 'Bandung Barat', 'Kabupaten Bandung'] as const
export const FEATURED = ['cilame', 'cipageran', 'tanimulya', 'gadobangkong']
export const villageById = (id?: string) => VILLAGES.find((v) => v.id === id)
export const pct = (v: Village) => Math.min(100, Math.round((v.fundingCollected / v.fundingRequired) * 100))
export const shortfall = (v: Village) => Math.max(0, v.fundingRequired - v.fundingCollected)
export const cityLabel = (c: string) => (c === 'Bandung Barat' ? 'Kab. Bandung Barat' : c === 'Kabupaten Bandung' ? 'Kab. Bandung' : `Kota ${c}`)

// Villages without their own documentation photo get a deterministic program photo.
const FALLBACK = ['Sensus Al-Qur\'an di masyarakat', 'mendatangi rumah warga', 'teras rumah warga', 'Pendidikan Baca', 'diantar sampai ke rumah', 'Bojongmanggu', 'hadir di wilayah garapan', 'celengan Tafaqur']
export function photoFor(v: Village): Img {
  const own = villagePhoto(v.name)
  if (own.src) return own
  if (v.id === 'bojongmanggu') return byAlt('Bojongmanggu')
  let h = 0
  for (const c of v.id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return byAlt(FALLBACK[h % FALLBACK.length])
}
export const totals = () => ({
  required: VILLAGES.reduce((a, v) => a + v.fundingRequired, 0),
  collected: VILLAGES.reduce((a, v) => a + v.fundingCollected, 0),
})
