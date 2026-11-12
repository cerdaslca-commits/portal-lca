import { lazy, Suspense } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { useRoute } from '@/lib/route'
import { Nav } from '@/sections/Nav'
import { Footer } from '@/sections/Footer'
import { Portal } from '@/pages/Portal'

// Other pages are code-split so the first visit stays light.
const Donasi = lazy(() => import('@/pages/Donasi').then((m) => ({ default: m.Donasi })))
const DesaList = lazy(() => import('@/pages/DesaList').then((m) => ({ default: m.DesaList })))
const DesaDetail = lazy(() => import('@/pages/DesaDetail').then((m) => ({ default: m.DesaDetail })))

export default function App() {
  const [{ route, id }, go] = useRoute()
  return (
    <LazyMotion features={domAnimation} strict>
      <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ondark">Lewati ke konten</a>
      <Nav route={route} go={go} />
      <div id="konten">
        {route === 'portal' ? (
          <Portal onDonate={() => go('donasi')} />
        ) : (
          <Suspense fallback={<div className="min-h-[100svh] bg-brand-night" aria-busy="true" />}>
            {route === 'donasi' && <Donasi />}
            {route === 'desa' && <DesaList />}
            {route === 'desa-detail' && id && <DesaDetail key={id} id={id} />}
          </Suspense>
        )}
      </div>
      <Footer go={go} />
    </LazyMotion>
  )
}
