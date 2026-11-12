import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { Heart } from 'lucide-react'

// Mobile-only bottom bar that appears once the hero is scrolled past.
export function StickyDonate({ onClick, label = 'Donasi sekarang' }: { onClick: () => void; label?: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <m.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.35 }}
          className="fixed inset-x-3 bottom-3 z-40 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <button onClick={onClick} className="btn btn-gold w-full !min-h-[54px] text-base shadow-[0_16px_40px_-12px_oklch(20%_0.05_172/0.6)]">
            <Heart className="h-4 w-4" /> {label}
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
