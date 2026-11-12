import { Fragment } from 'react'

// Keeps "Al-Qur'an" from breaking at its hyphen inside large display headlines.
export function nb(text: string) {
  const parts = text.split(/(Al-Qur'an[.,]?)/)
  return parts.map((p, i) => (p.startsWith("Al-Qur'an") ? <span key={i} className="whitespace-nowrap">{p}</span> : <Fragment key={i}>{p}</Fragment>))
}
