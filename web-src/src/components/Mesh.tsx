// Stripe-style gradient mesh in the LCA emerald/gold palette.
// Base layer is static radial gradients (cheap on phones). Blurred, slowly drifting blobs are
// added only on larger screens with motion allowed (see .mesh-blob in index.css).
type Props = { variant?: 'night' | 'light'; className?: string }

export function Mesh({ variant = 'night', className = '' }: Props) {
  const night = variant === 'night'
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{
        background: night
          ? 'radial-gradient(60% 55% at 15% 0%, oklch(45% 0.1 168 / 0.7), transparent 70%), radial-gradient(45% 50% at 95% 10%, oklch(55% 0.1 195 / 0.4), transparent 70%), radial-gradient(45% 45% at 55% 110%, oklch(80% 0.14 82 / 0.25), transparent 70%)'
          : 'radial-gradient(60% 55% at 15% 0%, oklch(45% 0.1 168 / 0.25), transparent 70%), radial-gradient(45% 45% at 55% 110%, oklch(80% 0.14 82 / 0.3), transparent 70%)',
      }} />
      <div className="mesh-blob absolute -left-[10%] -top-[30%] h-[80%] w-[60%] rounded-full"
        style={{ background: 'var(--mesh-emerald)', opacity: night ? 0.55 : 0.2, animation: 'drift-a 22s ease-in-out infinite' }} />
      <div className="mesh-blob absolute bottom-[-30%] left-[30%] h-[70%] w-[45%] rounded-full"
        style={{ background: 'var(--mesh-gold)', opacity: night ? 0.22 : 0.25, animation: 'drift-c 30s ease-in-out infinite' }} />
    </div>
  )
}
