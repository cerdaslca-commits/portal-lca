import { BadgeCheck, MessageCircle } from 'lucide-react'
import data from '@/data/business-data.json'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { fadeUp } from '@/lib/motion'

const FAQ = [
  ['Apakah layanan LCA kepada masyarakat berbayar?', 'Tidak. Semua layanan LCA kepada masyarakat — sensus, belajar baca Al-Qur\'an, dan wakaf mushaf — tidak memungut biaya. Infak Anda yang membuatnya tetap gratis.'],
  ['Ke mana infak saya disalurkan?', 'Ke program yang Anda pilih: Infak umum GENCAR, Sensus Al-Qur\'an, Pendidikan Baca Al-Qur\'an, Wakaf Mushaf, Peduli Guru Ngaji, atau Zakat. Anda juga bisa memilih desa tertentu.'],
  ['Bagaimana cara membayar?', 'Melalui QRIS (GoPay, OVO, DANA, ShopeePay, LinkAja, m-banking), Midtrans, atau transfer bank. Setelah membayar, konfirmasi via WhatsApp untuk mendapatkan kuitansi.'],
  ['Apakah LCA berbadan hukum?', 'Ya. LCA berada di bawah Yayasan Al-Kalam yang disahkan Kemenkumham pada 2012, memiliki NPWP yayasan, dan GENCAR mendapat enam surat rekomendasi MUI dan Kemenag pada 2022.'],
  ['Bisakah saya berinfak rutin setiap bulan?', 'Bisa. Pilih “Rutin bulanan” di formulir. Untuk tabungan infak harian, ada juga program Tafaqur — celengan yang dikunjungi petugas setiap bulan.'],
]

export function TrustFAQ() {
  return (
    <section id="faq" className="bg-brand-bg py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead kicker="Amanah" title="Pertanyaan yang" accent="sering diajukan." />
          <ul className="mt-8 space-y-3">
            {data.legal.map((l) => (
              <li key={l} className="flex items-start gap-3 text-sm text-brand-ink2"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {l}</li>
            ))}
          </ul>
          <a href={data.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-outline mt-8"><MessageCircle className="h-4 w-4" /> Tanya admin: {data.whatsapp}</a>
        </div>
        <Reveal variants={fadeUp} className="lg:col-span-7">
          <Accordion type="single" collapsible defaultValue="q0" className="card-light px-2 md:px-4">
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={q} value={`q${i}`} className="border-brand-line last:border-0">
                <AccordionTrigger className="px-3 py-5 text-left text-base font-semibold text-brand-ink hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="px-3 pb-5 text-[0.95rem] leading-relaxed text-brand-ink2">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
