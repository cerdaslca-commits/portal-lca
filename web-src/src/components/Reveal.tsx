import { useRef, type ReactNode } from 'react'
import { m, useInView, type Variants } from 'framer-motion'

export function Reveal({ children, variants, className = '', as = 'div', delay = 0 }:
  { children: ReactNode; variants: Variants; className?: string; as?: 'div' | 'section' | 'li' | 'ul' | 'ol'; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const M = m[as]
  return (
    <M ref={ref} variants={variants} initial="hidden" animate={inView ? 'show' : 'hidden'} transition={{ delay }} className={className}>
      {children}
    </M>
  )
}
