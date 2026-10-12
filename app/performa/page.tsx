import { ArrowUpRight, MessageSquare, Plus, Target, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead, SubPanel } from '@/components/ui/panel'
import { Pill, Progress, StatCard } from '@/components/ui/bits'
import { getOKRs, getPerformanceReviews } from '@/lib/server-data'

const cycle = [
  { label: 'Penetapan tujuan & OKR', date: '1–15 Jan 2026', state: 'done' },
  { label: 'Check-in Q1 & Q2', date: 'Apr · Jul 2026', state: 'done' },
  { label: 'Check-in Q3', date: 'Okt 2026', state: 'done' },
  { label: 'Review & kalibrasi', date: '1–15 Des 2026', state: 'current' },
  { label: 'Umpan balik 360', date: '16–20 Des 2026', state: 'next' },
]

export default async function PerformancePage() {
  const [okrs, reviews] = await Promise.all([getOKRs(), getPerformanceReviews()])

  const completedReviews = reviews.filter((r) => r.status === 'SELESAI').length
  const totalReviews = reviews.length
  const completionRate = totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Performance · OKR, review, dan kalibrasi
          </>
        }
        title="Performa & OKR"
        description="Tujuan, check-in, review berkala, umpan balik 360, dan kalibrasi 9-box dengan performance improvement plan terdokumentasi."
        actions={
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Plus className="size-3.5" /> Mulai siklus review
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Partisipasi OKR" value="87%" delta="+5%" hint="1.117 dari 1.284 karyawan" icon={<Target className="size-4" />} />
        <StatCard label="Review selesai" value="64%" hint="Batas 15 Des 2026" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Check-in Q3" value="78%" hint="Manajer & HRBP" icon={<Users className="size-4" />} />
        <StatCard label="PIP aktif" value="3" hint="Semua terdokumentasi" icon={<MessageSquare className="size-4" />} />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead
            title="OKR perusahaan"
            hint="Q4 2026 · progres per 22 November"
            action={
              <Pill variant="outline" className="px-2 py-1 text-[10px]">
                {okrs.length} objective
              </Pill>
            }
          />
          <ul className="mt-3 space-y-2">
            {okrs.map((okr) => (
              <li key={okr.id} className="rounded-[20px] border border-white/70 bg-white/50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink">{okr.title}</p>
                    <p className="text-[10.5px] text-muted">
                      {okr.owner} · {okr.keyResults ?? '—'}
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold text-ink">{okr.progress}%</span>
                </div>
                <Progress
                  value={okr.progress}
                  tone={okr.tone === 'lime' ? 'lime' : okr.tone === 'sky' ? 'sky' : 'mint'}
                  className="mt-2"
                />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
            <Target className="size-3.5" />
            OKR terhubung ke anggaran headcount dan bonus — hasil review mengalir ke siklus merit.
          </div>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead
            title="Distribusi review"
            hint="Performa karyawan siklus berjalan"
          />
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
            <div className="flex flex-col justify-around text-[9px] tracking-[0.06em] text-muted uppercase">
              {['Tinggi', 'Sedang', 'Rendah'].map((row) => (
                <span key={row} className="py-2 text-right">
                  {row}
                </span>
              ))}
            </div>
            <div className="space-y-1.5">
              {['Tinggi', 'Sedang', 'Rendah'].map((row, rowIndex) => (
                <div key={row} className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((colIndex) => (
                    <div
                      key={`${row}-${colIndex}`}
                      className={`rounded-xl border border-white/70 px-2 py-3 text-center ${
                        rowIndex === 0
                          ? 'bg-lime'
                          : rowIndex === 1
                            ? 'bg-mint'
                            : 'bg-peach'
                      }`}
                    >
                      <p className="text-[10px] font-semibold text-ink">
                        {row === 'Tinggi' ? 'Bintang' : row === 'Sedang' ? 'Inti' : 'Perlu coaching'}
                      </p>
                      <p className="text-[9px] text-ink/50">{colIndex + 2}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[9px] tracking-[0.06em] text-muted uppercase">
            <span>Rendah</span>
            <span>Performa</span>
            <span>Tinggi</span>
          </div>
          <div className="mt-4 rounded-[18px] border border-white/70 bg-white/50 p-3">
            <p className="text-[10px] font-semibold text-ink">Review siklus ini</p>
            <p className="mt-1 text-[10px] text-muted">
              {completedReviews} dari {totalReviews} review selesai ({completionRate}%)
            </p>
            <Progress value={completionRate} tone="lime" className="mt-2" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelHead title="Siklus review 2026" hint="Kalibrasi lintas departemen" />
          <ol className="mt-4 space-y-2">
            {cycle.map((step, index) => (
              <li
                key={step.label}
                className={`flex items-center gap-3 rounded-[18px] border p-3 ${
                  step.state === 'current' ? 'border-lime-deep/40 bg-lime/40' : 'border-white/70 bg-white/50'
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                    step.state === 'done' ? 'bg-ink text-lime' : step.state === 'current' ? 'bg-lime text-ink' : 'bg-white/70 text-muted'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-ink">{step.label}</p>
                  <p className="text-[10px] text-muted">{step.date}</p>
                </div>
                {step.state === 'current' ? (
                  <Pill variant="lime" className="px-2 py-0.5 text-[9.5px]">
                    Berjalan
                  </Pill>
                ) : null}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel className="lg:col-span-5">
          <PanelHead title="Umpan balik 360" hint="Anonim · minimal 3 responden" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: 'Responden', value: '186' },
              { label: 'Selesai', value: '142' },
              { label: 'Rata-rata skor', value: '4,2 / 5' },
              { label: 'PIP terdokumentasi', value: '3' },
            ].map((item) => (
              <SubPanel key={item.label}>
                <p className="text-[10px] tracking-[0.08em] text-muted uppercase">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{item.value}</p>
              </SubPanel>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-white/70 bg-white/50 p-3">
            <p className="text-[11px] font-semibold text-ink">Catatan kalibrasi</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              Distribusi rating dijaga 20% exceeds, 65% meets, 15% below. Perubahan rating wajib disertai alasan dan
              disetujui HRBP.
            </p>
            <button
              type="button"
              className="focus-ring mt-2 inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[10.5px] font-medium text-white"
            >
              Buka talent review <ArrowUpRight className="size-3" />
            </button>
          </div>
        </Panel>
      </div>
    </div>
  )
}
