import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Counts from 0 to `to` over ~1.8s with an ease-out curve once visible.
export function Counter({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setVal(to); return }
    let raf = 0
    const start = performance.now()
    const dur = 1800
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className={`tnum ${className}`}>
      {val.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}
