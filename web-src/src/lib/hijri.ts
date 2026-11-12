// Hijri calendar that follows KHGT (Kalender Hijriah Global Tunggal) as used on cerdaslca.org.
// Base: Umm al-Qura via Intl (matches KHGT on most months). KHGT_STARTS overrides months where
// they differ — extend this table each year from the official KHGT calendar.
import words from '@/data/words.json'

export const MONTHS = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Ula', 'Jumadil Akhirah', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah']
export const MONTHS_AR = ['مُحَرَّم', 'صَفَر', 'رَبِيع الأَوَّل', 'رَبِيع الآخِر', 'جُمَادَى الأُولَى', 'جُمَادَى الآخِرَة', 'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو القَعْدَة', 'ذُو الحِجَّة']

// [gregorian date of the 1st, hijri year, hijri month (1-12)] — KHGT
const KHGT_STARTS: [string, number, number][] = [
  ['2026-10-12', 1448, 5],
  ['2026-11-10', 1448, 6],
  ['2026-12-10', 1448, 7],
  ['2027-01-09', 1448, 8],
  ['2027-02-08', 1448, 9],
  ['2027-03-09', 1448, 10],
  ['2027-04-08', 1448, 11],
  ['2027-05-07', 1448, 12],
  ['2027-06-06', 1449, 1],
]

export type HDate = { y: number; m: number; d: number }
const DAY = 86400000
const TZ = 'Asia/Jakarta'

/** Today's date in Jakarta as a UTC-midnight Date (so day maths is stable). */
export function todayJakarta(now = new Date()): Date {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
const iso = (d: Date) => d.toISOString().slice(0, 10)
const parseIso = (s: string) => new Date(s + 'T00:00:00Z')

let fmt: Intl.DateTimeFormat | null = null
function umalqura(d: Date): HDate {
  try {
    fmt ??= new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' })
    const parts = fmt.formatToParts(d)
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value.replace(/\D/g, ''))
    return { y: get('year'), m: get('month'), d: get('day') }
  } catch {
    // Very old browsers: arithmetic (tabular) fallback
    const jd = Math.floor(d.getTime() / DAY) + 2440588
    const l0 = jd - 1948440 + 10632, n = Math.floor((l0 - 1) / 10631), l1 = l0 - 10631 * n + 354
    const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238)
    const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29
    const m = Math.floor((24 * l2) / 709)
    return { y: 30 * n + j - 30, m, d: l2 - Math.floor((709 * m) / 24) }
  }
}

export function toHijri(d: Date): HDate {
  const t = d.getTime()
  for (let i = 0; i < KHGT_STARTS.length - 1; i++) {
    const a = parseIso(KHGT_STARTS[i][0]).getTime(), b = parseIso(KHGT_STARTS[i + 1][0]).getTime()
    if (t >= a && t < b) return { y: KHGT_STARTS[i][1], m: KHGT_STARTS[i][2], d: Math.round((t - a) / DAY) + 1 }
  }
  return umalqura(d)
}

export const formatHijri = (h: HDate) => `${h.d} ${MONTHS[h.m - 1]} ${h.y} H`
export const formatGregorian = (d: Date, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('id-ID', { ...opts, timeZone: 'UTC' }).format(d)

type EventDef = { m: number; d: number; title: string; kind: 'Hari besar' | 'Puasa sunnah'; text: string }
const EVENTS: EventDef[] = [
  { m: 1, d: 1, title: 'Tahun Baru Hijriah', kind: 'Hari besar', text: '1 Muharram · Hari libur nasional.' },
  { m: 1, d: 10, title: "Puasa 'Asyura", kind: 'Puasa sunnah', text: '10 Muharram, didahului puasa Tasu\'a (9 Muharram).' },
  { m: 3, d: 12, title: 'Maulid Nabi ﷺ', kind: 'Hari besar', text: '12 Rabiul Awal · Hari libur nasional.' },
  { m: 7, d: 1, title: 'Awal bulan Rajab', kind: 'Hari besar', text: 'Salah satu dari empat bulan haram.' },
  { m: 7, d: 27, title: "Peringatan Isra Mi'raj", kind: 'Hari besar', text: '27 Rajab · Hari libur nasional.' },
  { m: 8, d: 15, title: "Nisfu Sya'ban", kind: 'Hari besar', text: "Pertengahan Sya'ban, menyambut Ramadhan." },
  { m: 9, d: 1, title: 'Awal Ramadhan', kind: 'Hari besar', text: 'Puasa Ramadhan dimulai.' },
  { m: 9, d: 17, title: "Nuzulul Qur'an", kind: 'Hari besar', text: "17 Ramadhan · Peringatan turunnya Al-Qur'an." },
  { m: 10, d: 1, title: 'Idul Fitri', kind: 'Hari besar', text: '1 Syawal · Hari libur nasional.' },
  { m: 12, d: 9, title: 'Puasa Arafah', kind: 'Puasa sunnah', text: '9 Dzulhijjah.' },
  { m: 12, d: 10, title: 'Idul Adha', kind: 'Hari besar', text: '10 Dzulhijjah · Hari libur nasional.' },
]

export type CalEvent = { date: Date; h: HDate; title: string; kind: string; text: string; inDays: number }

/** Scan forward day by day (cheap: ~400 iterations) and collect upcoming events. */
export function upcoming(from = todayJakarta(), horizon = 400) {
  const events: CalEvent[] = []
  for (let i = 0; i <= horizon; i++) {
    const date = new Date(from.getTime() + i * DAY)
    const h = toHijri(date)
    for (const e of EVENTS) if (e.m === h.m && e.d === h.d) events.push({ date, h, title: e.title, kind: e.kind, text: e.text, inDays: i })
    if (h.d === 13 && h.m !== 9 && !(h.m === 12)) {
      events.push({ date, h, title: 'Ayyamul Bidh', kind: 'Puasa sunnah', text: `13 ${MONTHS[h.m - 1]} ${h.y} H · Puasa sunnah tanggal 13, 14, 15.`, inDays: i })
    }
  }
  return events
}

export function countdowns(from = todayJakarta()) {
  const ev = upcoming(from)
  const pick = (title: string) => ev.find((e) => e.title === title)
  return [
    { label: 'menuju Ramadhan', e: pick('Awal Ramadhan') },
    { label: 'menuju Idul Fitri', e: pick('Idul Fitri') },
    { label: 'menuju Puasa Arafah', e: pick('Puasa Arafah') },
  ].filter((c) => c.e) as { label: string; e: CalEvent }[]
}

export function todayEvent(from = todayJakarta()) {
  return upcoming(from, 0)[0]
}

export function wordOfDay(from = todayJakarta()) {
  const start = parseIso(words.start).getTime()
  const n = words.words.length
  const idx = (((Math.floor((from.getTime() - start) / DAY)) % n) + n) % n
  return words.words[idx]
}

export { iso }
