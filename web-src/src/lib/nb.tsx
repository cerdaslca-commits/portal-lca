import { Fragment } from 'react'

// Judul besar: setiap kata dibungkus span.lca-w agar bisa "bersinar" saat disentuh (lihat public/shell.css),
// dan "Al-Qur'an" tidak terputus di tanda hubungnya.
export function nb(text: string) {
  return text.split(/(\s+)/).map((w, i) =>
    !w ? null : /^\s+$/.test(w) ? <Fragment key={i}>{w}</Fragment> : (
      <span key={i} className={w.startsWith("Al-Qur'an") ? 'lca-w whitespace-nowrap' : 'lca-w'}>{w}</span>
    ))
}
