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
              >
                <span className="grid w-12 shrink-0 place-items-center rounded-xl bg-ink py-1.5 text-[10.5px] font-semibold text-lime">
                  {interview.time}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-ink">{interview.name}</p>
                  <p className="truncate text-[10px] text-muted">
                    {interview.role} · {interview.panel}
                  </p>
                </div>
                <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                  {interview.mode}
                </Pill>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <SubPanel>
              <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Time to hire</p>
              <p className="mt-1 text-lg font-semibold">34 hari</p>
              <Progress value={68} tone="lime" className="mt-1.5" />
            </SubPanel>
            <SubPanel>
              <p className="text-[10px] tracking-[0.08em] text-muted uppercase">Offer accept</p>
              <p className="mt-1 text-lg font-semibold">82%</p>
              <Progress value={82} tone="mint" className="mt-1.5" />
            </SubPanel>
          </div>
        </Panel>
      </div>

        <Panel>
          <PanelHead
            title="Pipeline kandidat"
            hint="Semua requisition · kandidat per tahap"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                {candidates.length} kandidat
              </Pill>
            }
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {requisitions.map((req) => {
              const stageCandidates = candidates.filter((c) => c.stageId === req.id)
              return (
                <div
                  key={req.id}
                  className="rounded-[20px] border border-white/70 bg-white/40 p-2.5"
                >
                  <div className="flex items-center justify-between px-1 pb-2">
                    <p className="text-[11px] font-semibold text-ink">{req.role}</p>
                    <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[9.5px] font-medium text-ink-soft">
                      {stageCandidates.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {stageCandidates.map((candidate) => (
                      <li
                        key={candidate.id}
                        className="rounded-[16px] border border-white/80 bg-white/75 p-2.5 shadow-[0_1px_2px_rgba(20,30,20,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[11.5px] font-semibold text-ink">{candidate.name}</p>
                            <p className="truncate text-[9.5px] text-muted">{candidate.role}</p>
                          </div>
                          <span className="rounded-full bg-lime px-1.5 py-0.5 text-[9px] font-semibold text-ink">
                            {candidate.score}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[9px] text-muted">{candidate.source}</span>
                          <span className="text-[9px] font-medium text-ink-soft">Scorecard</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Panel>
    </div>
  )
}
