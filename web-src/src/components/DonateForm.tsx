import { useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleCheck, Copy, Download, Lock, MessageCircle, Repeat } from 'lucide-react'
import data from '@/data/business-data.json'
import { rupiah } from '@/lib/format'
import { easeExpo } from '@/lib/motion'

const AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000]
const MIN = 10000
import { CITIES, VILLAGES, villageById, cityLabel } from '@/lib/villages'
export const desaLabel = (id: string) => { const v = villageById(id); return v ? `Desa ${v.name}` : 'Semua desa (paling dibutuhkan)' }

type Props = { desa: string; setDesa: (d: string) => void }

export function DonateForm({ desa, setDesa }: Props) {
  const [freq, setFreq] = useState<'sekali' | 'bulanan'>('sekali')
  const [amount, setAmount] = useState<number>(100000)
  const [custom, setCustom] = useState('')
  const [program, setProgram] = useState(data.donationPrograms[0])
  const [name, setName] = useState('')
  const [method, setMethod] = useState(data.paymentMethods[0])
  const [step, setStep] = useState<1 | 2>(1)

  const value = custom ? Number(custom.replace(/\D/g, '')) : amount
  const error = custom && value < MIN ? `Minimal ${rupiah(MIN)}` : ''
  const valid = value >= MIN

  const waText = useMemo(() => encodeURIComponent(
    `Assalamu'alaikum LCA, saya ${name || 'Hamba Allah'} berniat berinfak ${rupiah(value)}${freq === 'bulanan' ? ' per bulan' : ''} untuk ${program} (${desaLabel(desa)}) melalui ${method}. Mohon kuitansinya. Jazakumullah khairan.`,
  ), [name, value, freq, program, desa, method])

  const chip = (active: boolean) =>
    `tnum min-h-[44px] rounded-xl px-3 text-sm font-semibold transition-all duration-150 ring-1 ${active
      ? 'bg-brand text-brand-ondark ring-[var(--color-primary)] shadow-[0_6px_16px_-8px_var(--shadow-tint-strong)]'
      : 'bg-brand-raised text-brand-ink ring-[var(--color-border)] hover:ring-[var(--color-border-strong)] hover:bg-brand-surface'}`
  const field = 'mt-1.5 h-11 w-full rounded-xl bg-brand-raised px-3.5 text-[0.95rem] text-brand-ink ring-1 ring-[var(--color-border)] outline-none transition-shadow placeholder:text-brand-mute focus:ring-2 focus:ring-[var(--color-primary)]'

  return (
    <div id="donasi-form" className="scroll-mt-28 overflow-hidden rounded-[1.75rem] bg-[var(--color-bg)] shadow-[0_30px_80px_-30px_oklch(10%_0.03_172/0.7)] ring-1 ring-white/20">
      <div className="flex items-center justify-between border-b border-brand-line px-6 py-4">
        <p className="font-semibold text-brand-ink">{step === 1 ? 'Infak untuk GENCAR' : 'Ringkasan infak'}</p>
        <p className="flex items-center gap-1.5 text-xs text-brand-mute"><Lock className="h-3.5 w-3.5" /> Langkah {step} dari 2</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <m.form key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: easeExpo }}
            className="space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); if (valid) { setStep(2); const el = document.getElementById('donasi-form'); if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } }}>
            <div role="radiogroup" aria-label="Frekuensi" className="grid grid-cols-2 gap-1 rounded-full bg-brand-surface p-1">
              {(['sekali', 'bulanan'] as const).map((f) => (
                <button type="button" role="radio" aria-checked={freq === f} key={f} onClick={() => setFreq(f)}
                  className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-colors ${freq === f ? 'bg-brand-raised text-brand-ink shadow-sm ring-1 ring-[var(--color-border)]' : 'text-brand-mute hover:text-brand-ink'}`}>
                  {f === 'bulanan' && <Repeat className="h-3.5 w-3.5" />}{f === 'sekali' ? 'Sekali' : 'Rutin bulanan'}
                </button>
              ))}
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-brand-ink">Nominal</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {AMOUNTS.map((a) => (
                  <button type="button" key={a} aria-pressed={!custom && amount === a} onClick={() => { setAmount(a); setCustom('') }} className={chip(!custom && amount === a)}>
                    {a >= 1000000 ? '1 jt' : `${a / 1000} rb`}
                  </button>
                ))}
              </div>
              <label className="mt-3 block text-sm font-medium text-brand-ink" htmlFor="custom">Nominal lain</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 mt-[3px] -translate-y-1/2 text-sm text-brand-mute">Rp</span>
                <input id="custom" inputMode="numeric" placeholder="Contoh: 75.000" value={custom ? Number(custom).toLocaleString('id-ID') : ''}
                  onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  aria-invalid={!!error} aria-describedby={error ? 'custom-err' : undefined}
                  className={`${field} tnum pl-10 ${error ? '!ring-2 !ring-[var(--color-error)]' : ''}`} />
              </div>
              {error && <p id="custom-err" className="mt-1.5 text-xs font-medium text-[var(--color-error)]">⚠ {error}</p>}
            </fieldset>

            <div className="grid gap-4">
              <label className="block text-sm font-medium text-brand-ink">Program
                <select value={program} onChange={(e) => setProgram(e.target.value)} className={field}>
                  {data.donationPrograms.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-brand-ink">Untuk desa
                <select value={desa} onChange={(e) => setDesa(e.target.value)} className={field}>
                  <option value="">Semua desa (paling dibutuhkan)</option>
                  {CITIES.map((c) => (
                    <optgroup key={c} label={cityLabel(c)}>
                      {VILLAGES.filter((v) => v.city === c).map((v) => <option key={v.id} value={v.id}>{v.name} — Kec. {v.district}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-brand-ink">Nama <span className="font-normal text-brand-mute">(boleh dikosongkan)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hamba Allah" className={field} />
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-brand-ink">Cara bayar</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {data.paymentMethods.map((m) => (
                  <button type="button" key={m} aria-pressed={method === m} onClick={() => setMethod(m)} className={chip(method === m)}>{m}</button>
                ))}
              </div>
            </fieldset>

            <button type="submit" disabled={!valid} className="btn btn-gold w-full !min-h-[52px] text-base">
              Lanjutkan · <span className="tnum">{rupiah(valid ? value : 0)}</span>{freq === 'bulanan' && '/bln'} <ArrowRight className="h-4 w-4" />
            </button>
          </m.form>
        ) : (
          <m.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, ease: easeExpo }} className="p-6">
            <div className="flex items-center gap-3 rounded-2xl bg-brand-container p-4 text-brand">
              <CircleCheck className="h-6 w-6 shrink-0" />
              <p className="text-sm font-medium">Periksa ringkasan, lalu selesaikan pembayaran di bawah.</p>
            </div>
            <dl className="tnum mt-5 divide-y divide-[var(--color-border)] text-sm">
              {[['Nominal', `${rupiah(value)}${freq === 'bulanan' ? ' / bulan' : ''}`], ['Program', program], ['Desa', desaLabel(desa)], ['Atas nama', name || 'Hamba Allah'], ['Cara bayar', method]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3"><dt className="text-brand-mute">{k}</dt><dd className="text-right font-semibold text-brand-ink">{v}</dd></div>
              ))}
            </dl>
            <PaymentPanel method={method} value={value} />
            <a href={`${data.whatsappUrl}?text=${waText}`} target="_blank" rel="noreferrer" className="btn btn-emerald mt-5 w-full !min-h-[52px] text-base">
              <MessageCircle className="h-4 w-4" /> Sudah bayar? Konfirmasi via WhatsApp
            </a>
            <button onClick={() => setStep(1)} className="btn mt-2 w-full text-brand-ink2 hover:bg-brand-surface"><ArrowLeft className="h-4 w-4" /> Ubah</button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const P = data.payment

export function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(text.replace(/\D/g, '')).then(() => { setOk(true); setTimeout(() => setOk(false), 1600) }) }}
      className="flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand ring-1 ring-[var(--color-border)] transition-colors hover:bg-brand-container"
      aria-label={`Salin nomor ${text}`}>
      {ok ? <><Check className="h-3.5 w-3.5" /> Tersalin</> : <><Copy className="h-3.5 w-3.5" /> Salin</>}
    </button>
  )
}

function PaymentPanel({ method, value }: { method: string; value: number }) {
  if (method === 'QRIS') {
    return (
      <div className="mt-5 rounded-2xl bg-brand-surface p-4 text-center">
        <img src={P.qrisImage} alt={`QRIS ${P.qrisMerchant}`} width={280} height={280} className="mx-auto aspect-square w-full max-w-[240px] rounded-xl bg-white p-2 [image-rendering:pixelated]" />
        <p className="mt-3 text-sm font-semibold text-brand-ink">{P.qrisMerchant}</p>
        <p className="text-xs text-brand-mute">NMID {P.qrisNmid} · Bandung Barat</p>
        <p className="mt-3 text-xs leading-relaxed text-brand-ink2">Pindai dengan m-banking atau dompet digital (GoPay, OVO, DANA, ShopeePay, LinkAja), lalu masukkan nominal <b className="tnum">{rupiah(value)}</b>.</p>
        <a href={P.qrisImage} download="QRIS-Lembaga-Cerdas-Al-Quran.png" className="btn btn-outline mt-3 !min-h-[40px] text-sm"><Download className="h-4 w-4" /> Simpan QR</a>
      </div>
    )
  }
  if (method === 'Transfer') {
    return (
      <div className="mt-5 rounded-2xl bg-brand-surface p-4">
        <p className="text-sm text-brand-ink2">Transfer <b className="tnum text-brand-ink">{rupiah(value)}</b> a.n. <b className="text-brand-ink">{P.accountName}</b></p>
        <ul className="mt-3 space-y-2">
          {P.banks.map((b) => (
            <li key={b.bank} className="flex items-center justify-between gap-3 rounded-xl bg-brand-raised p-3 ring-1 ring-[var(--color-border)]">
              <span><span className="block text-xs text-brand-mute">{b.bank}</span><span className="tnum block font-semibold tracking-wide text-brand-ink">{b.number}</span></span>
              <CopyBtn text={b.number} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div className="mt-5 rounded-2xl bg-brand-surface p-4">
      <p className="text-sm font-semibold text-brand-ink">Bayar online via Midtrans</p>
      <p className="mt-1 text-xs leading-relaxed text-brand-ink2">Virtual Account bank, kartu debit/kredit, dan e-wallet. Halaman Midtrans terbuka di tab baru — masukkan nominal <b className="tnum">{rupiah(value)}</b>.</p>
      <a href={P.midtransUrl} target="_blank" rel="noreferrer" className="btn btn-gold mt-3 w-full">Lanjut ke halaman pembayaran <ArrowUpRight className="h-4 w-4" /></a>
    </div>
  )
}
