import { BookOpen, Clock, MessageSquare, Plus, Star, Ticket } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Progress, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getTickets } from '@/lib/server-data'

const knowledge = [
  { title: 'Cara mengubah rekening bank dengan verifikasi', category: 'Data pribadi', views: 1284 },
  { title: 'Kapan slip gaji diterbitkan?', category: 'Payroll', views: 986 },
  { title: 'Kebijakan cuti & carry-over 2026', category: 'Cuti', views: 742 },
  { title: 'Mengajukan surat keterangan kerja', category: 'Dokumen', views: 512 },
]

export default async function HelpdeskPage() {
  const { data: tickets } = await getTickets({ limit: 50 })
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Helpdesk HR · Case management
          </>
        }
        title="Helpdesk HR"
        description="Tiket, SLA, dan knowledge base untuk menurunkan beban tiket rutin. Asisten AI (P2) hanya menjawab dengan sumber dokumen yang dikutip."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Buat tiket
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tiket terbuka" value="34" delta="-8" hint="Turun 19% dari bulan lalu" icon={<Ticket className="size-4" />} />
        <StatCard label="SLA terpenuhi" value="92%" delta="+3%" hint="Target 90%" icon={<Clock className="size-4" />} />
        <StatCard label="Rata-rata respons" value="4 jam" hint="Jam kerja Asia/Jakarta" icon={<MessageSquare className="size-4" />} />
        <StatCard label="CSAT" value="4,6" hint="Dari 186 respons" icon={<Star className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Tiket terbaru"
            hint="Semua kategori · 5 tiket terakhir"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                34 terbuka
              </Pill>
            }
          />
          <div className="mt-3">
            <Table
              head={['Tiket', 'Subjek', 'Kategori', 'Prioritas', 'Pemilik', 'SLA', 'Status']}
              minWidth="min-w-[860px]"
            >
              {tickets.map((ticket) => (
                <Row key={ticket.id}>
                  <Cell className="text-[11px] font-medium text-ink">{ticket.id}</Cell>
                  <Cell className="max-w-[240px] text-[12px] text-ink-soft">{ticket.subject}</Cell>
                  <Cell className="text-[11px] text-ink-soft">{ticket.category}</Cell>
