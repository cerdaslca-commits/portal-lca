// Image map driven by business-data.json metadata (imageType / sectionType / associatedName).
// Files live in /public/img as responsive WebP (photo-N-{480|960|1600}.webp, logo-N-{96|192}.webp).
import businessData from '@/data/business-data.json'
import manifest from '@/data/image-manifest.json'

export type Img = { src: string; srcSet: string; alt: string; ratio: number; logo?: boolean }
type Raw = { localPath: string; alt: string; imageType: string; sectionType?: string; associatedName?: string }
const M = manifest as Record<string, { widths: number[]; ratio: number }>
const all = businessData.images as Raw[]

const toImg = (r?: Raw): Img => {
  if (!r) return { src: '', srcSet: '', alt: '', ratio: 1 }
  const key = r.localPath.split('/').pop()!.replace(/\.(jpg|png)$/, '') // photo-3 / logo-1
  const m = M[key]
  if (key.startsWith('logo')) {
    return { src: `/img/${key}-96.webp`, srcSet: `/img/${key}-96.webp 1x, /img/${key}-192.webp 2x` , alt: r.alt, ratio: 1, logo: true }
  }
  const mid = m.widths.find((w) => w >= 960) ?? m.widths[m.widths.length - 1]
  return { src: `/img/${key}-${mid}.webp`, srcSet: m.widths.map((w) => `/img/${key}-${w}.webp ${w}w`).join(', '), alt: r.alt, ratio: m.ratio }
}

/** Spread onto <img>: responsive src/srcSet/sizes + lazy decoding by default. */
export const pic = (img: Img, sizes = '(min-width: 1024px) 50vw, 100vw', eager = false) => ({
  src: img.src,
  srcSet: img.srcSet,
  ...(img.logo ? {} : { sizes }),
  loading: eager ? ('eager' as const) : ('lazy' as const),
  decoding: 'async' as const,
  ...(eager ? { fetchPriority: 'high' as const } : {}),
})

export const bySection = (section: string): Img[] =>
  all.filter((i) => i.imageType === 'scene' && i.sectionType === section).map(toImg)
export const byAlt = (needle: string): Img =>
  toImg(all.find((i) => i.alt.toLowerCase().includes(needle.toLowerCase())))
/** Logo resmi departemen & komunitas LCA (dari Google Drive LCA), resolusi 96/192/384 px. */
export const DEPT: Record<string, { key: string; full: string; href: string }> = {
  LCA: { key: 'lca', full: "Lembaga Cerdas Al-Qur'an", href: '/tentang' },
  GENCAR: { key: 'gencar', full: "Gerakan Cerdas Baca Al-Qur'an", href: '/gencar' },
  GEMAR: { key: 'gemar', full: "Gerakan Memahami Arti Kata Al-Qur'an", href: '/program15' },
  Sensus: { key: 'sensus', full: 'Departemen Sensus', href: '/sensus' },
  Pendidikan: { key: 'pendidikan', full: 'Departemen Pendidikan', href: '/pendidikan' },
  Tafaqur: { key: 'tafaqur', full: 'Departemen Tafaqur', href: '/departemen' },
  Wakaf: { key: 'wakaf', full: 'Departemen Wakaf', href: '/wakaf' },
  'Kiprah Muslimah': { key: 'muslimah', full: 'Departemen Kiprah Muslimah', href: '/departemen' },
  'Mitra Berkah': { key: 'koperasi', full: 'Koperasi Syariah Guru Ngaji', href: '/departemen' },
  Informasi: { key: 'it', full: 'Departemen IT & LCA Online', href: '/departemen' },
  'Kaca Cermin': { key: 'kcc', full: 'Komunitas Kaca Cermin', href: '/departemen' },
  'Kaca Patri': { key: 'kcp', full: 'Komunitas Kaca Patri', href: '/departemen' },
}
const deptImg = (name: string): Img | null => {
  const d = DEPT[name]
  if (!d) return null
  const u = (s: number) => `/img/dept/${d.key}-${s}.webp`
  return { src: u(96), srcSet: `${u(96)} 1x, ${u(192)} 2x, ${u(384)} 4x`, alt: `Logo ${name}`, ratio: 1, logo: true }
}

export const logo = (name: string): Img =>
  deptImg(name) ?? toImg(all.find((i) => (i.imageType === 'logo' || i.imageType === 'product-logo') && i.associatedName === name))
export const village = (name: string): Img => toImg(all.find((i) => i.sectionType === `desa:${name}`))

export const images = {
  hero: bySection('hero')[0],
  heroDonasi: bySection('hero-donasi')[0],
  program: {
    sensus: byAlt("Sensus Al-Qur'an di masyarakat"),
    pendidikan: byAlt('Pendidikan Baca'),
    wakaf: byAlt('diantar sampai ke rumah'),
    guru: byAlt('apresiasi kepada guru ngaji'),
  },
  gallery: bySection('gallery'),
  story: bySection('story'),
  logoLca: logo('LCA'),
  logoGencar: logo('GENCAR'),
}
