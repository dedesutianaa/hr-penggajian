import { CalendarClock, Plus, ShieldCheck, Target, UserRound, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Cell, Pill, Progress, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { getCandidates, getInterviews, getRequisitions } from '@/lib/server-data'

export default async function RecruitmentPage() {
  const [requisitions, interviews, candidates] = await Promise.all([
    getRequisitions(),
    getInterviews(),
    getCandidates(),
  ])
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Rekrutmen · ATS terhubung headcount
          </>
        }
        title="Rekrutmen & pipeline"
        description="Requisition terhubung posisi dan anggaran headcount, scorecard terstruktur, dan data kandidat menjadi data karyawan saat hire."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Buat requisition
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Posisi terbuka" value="24" delta="+3" hint="Dari 312 posisi aktif" icon={<Target className="size-4" />} />
        <StatCard label="Kandidat aktif" value="186" hint="Pipeline 4 tahap" icon={<Users className="size-4" />} />
        <StatCard label="Interview minggu ini" value="18" hint="6 panel · 2 onsite" icon={<CalendarClock className="size-4" />} />
        <StatCard label="Offer berjalan" value="5" hint="2 menunggu e-sign" icon={<UserRound className="size-4" />} />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Requisition" hint="Anggaran headcount vs aktual" />
          <div className="mt-3">
            <Table
              head={['Posisi', 'Departemen', 'Headcount', 'Tahap', 'Umur', 'Budget']}
              minWidth="min-w-[680px]"
            >
              {requisitions.map((requisition) => {
                return (
                  <Row key={requisition.id}>
                    <Cell>
                      <p className="text-[12.5px] font-medium text-ink">{requisition.role}</p>
                      <p className="text-[10px] text-muted">
                        {requisition.id} · {requisition.entity}
                      </p>
                    </Cell>
                    <Cell className="text-[11.5px] text-ink-soft">{requisition.dept}</Cell>
                    <Cell className="text-[11.5px] text-ink-soft">{requisition.headcount}</Cell>
                    <Cell>
                      <StatusPill status={requisition.stage === 'Offer' ? 'Disetujui' : 'Dalam proses'} />
                    </Cell>
                    <Cell className="text-[11.5px] whitespace-nowrap text-ink-soft">
                      {requisition.days} hari
                    </Cell>
                    <Cell className="text-[11px] whitespace-nowrap text-ink-soft">{requisition.budget}</Cell>
                  </Row>
                )
              })}
            </Table>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
            <ShieldCheck className="size-3.5" />
            Data kandidat dihapus otomatis sesuai UU PDP setelah 12 bulan, kecuali ada dasar retensi lain.
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Jadwal interview" hint="Hari ini · 22 November 2026" />
          <ul className="mt-3 space-y-2">
            {interviews.map((interview) => (
              <li
                key={interview.id}
                className="flex items-center gap-3 rounded-[18px] border border-white/70 bg-white/50 p-2.5"
