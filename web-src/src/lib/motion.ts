export const easeOut: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
export const easeStandard: [number, number, number, number] = [0.4, 0, 0.2, 1]
export const easeSpring: [number, number, number, number] = [0.34, 1.56, 0.64, 1]
export const easeExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
}
export const heroWord = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: easeExpo } },
}
export const cardReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeExpo } },
}
export const sectionReveal = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeStandard } },
}
export const slideIn = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: easeExpo } },
}
