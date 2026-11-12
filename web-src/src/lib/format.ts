export const idNum = (n: number) => n.toLocaleString('id-ID')
export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID')
/** Compact rupiah for tight mobile layouts: Rp12 jt, Rp2,5 jt, Rp275 rb */
export const rupiahShort = (n: number) =>
  n >= 1_000_000 ? `Rp${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt` : n >= 1000 ? `Rp${Math.round(n / 1000)} rb` : `Rp${n}`
