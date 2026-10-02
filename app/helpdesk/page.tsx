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
                  <Cell>
                    <StatusPill status={ticket.priority} />
                  </Cell>
                  <Cell className="text-[11px] text-ink-soft">{ticket.assignee}</Cell>
                  <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{ticket.sla}</Cell>
                  <Cell>
                    <StatusPill status={ticket.status} />
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="SLA per kategori" hint="Bulan berjalan" />
            <div className="mt-3 space-y-2.5">
              {[
                { label: 'Payroll', value: 96 },
                { label: 'Data pribadi', value: 91 },
                { label: 'Cuti', value: 94 },
                { label: 'Dokumen', value: 88 },
                { label: 'IT & akses', value: 82 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-medium text-ink">{item.value}%</span>
                  </div>
                  <Progress value={item.value} tone={item.value >= 90 ? 'lime' : 'mint'} className="mt-1" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Knowledge base" hint="Paling banyak dibuka" />
            <ul className="mt-3 space-y-2">
              {knowledge.map((article) => (
                <li
                  key={article.title}
                  className="rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
                >
                  <p className="text-[11.5px] font-medium text-ink">{article.title}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
                    <BookOpen className="size-3" /> {article.category} · {article.views} dilihat
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <SubPanel>
            <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Catatan kepatuhan</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-soft">
              Asisten AI untuk pertanyaan kebijakan ditunda ke P2 dan hanya boleh menjawab dengan kutipan dokumen resmi.
            </p>
          </SubPanel>
        </div>
      </div>
    </div>
  )
}
