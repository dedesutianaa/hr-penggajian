import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, Lock, Printer, Send, ShieldCheck } from 'lucide-react'
import { Panel, PanelHead } from '@/components/ui/panel'
import { Avatar, Field, Pill, StatusPill } from '@/components/ui/bits'
import { getPayslipById } from '@/lib/server-data'
import { formatIDR } from '@/lib/format'

export default async function PayslipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slip = await getPayslipById(id)
  if (!slip) notFound()

  const earnings = [
    { label: 'Gaji pokok', amount: Math.round(slip.gross * 0.66) },
    { label: 'Tunjangan jabatan', amount: Math.round(slip.gross * 0.14) },
    { label: 'Tunjangan transport', amount: Math.round(slip.gross * 0.04) },
    { label: 'Uang makan', amount: Math.round(slip.gross * 0.03) },
    { label: 'Lembur', amount: Math.round(slip.gross * 0.03) },
  ]
  const deductions = [
    { label: 'PPh 21', amount: Math.round(slip.gross * 0.05) },
    { label: 'BPJS Kesehatan (1%)', amount: Math.round(slip.gross * 0.01) },
    { label: 'BPJS JHT (2%)', amount: Math.round(slip.gross * 0.02) },
    { label: 'BPJS JP (1%)', amount: Math.round(slip.gross * 0.01) },
    { label: 'Pinjaman karyawan', amount: Math.round(slip.gross * 0.02) },
  ]
  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0)
  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0)
  const net = totalEarnings - totalDeductions

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/slip-gaji"
          className="focus-ring inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" /> Daftar slip gaji
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
          >
            <Printer className="size-3.5" /> Cetak
          </button>
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
          >
            <Send className="size-3.5" /> Kirim ulang
          </button>
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
          >
            <Download className="size-3.5" /> Unduh PDF
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/8 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-ink text-[13px] font-bold text-lime">N</span>
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.02em] text-ink">PT Nexa Digital Indonesia</p>
                <p className="text-[10.5px] text-muted">Jl. Jend. Sudirman Kav. 52-53, Jakarta 12190</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-[0.14em] text-muted uppercase">Slip gaji</p>
              <p className="text-[15px] font-semibold text-ink">{slip.period}</p>
              <p className="text-[10.5px] text-muted">{slip.id}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={slip.employeeName} tone="mint" size="lg" />
              <div>
                <p className="text-[15px] font-semibold text-ink">{slip.employeeName}</p>
                <p className="text-[11px] text-muted">
                  {slip.employeeNik ?? '—'} · Karyawan
                </p>
                <p className="text-[10.5px] text-muted">
                  ID {slip.employeeId} · NPWP {slip.employeeNik ?? '—'}
                </p>
              </div>
            </div>
            <StatusPill status={slip.status} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">Penghasilan</p>
              <ul className="mt-2 divide-y divide-ink/6">
                {earnings.map((item) => (
                  <li key={item.label} className="flex items-center justify-between py-2 text-[11.5px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-medium text-ink">{formatIDR(item.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex items-center justify-between rounded-xl bg-white/70 px-2.5 py-2 text-[11.5px] font-semibold">
                <span>Total penghasilan</span>
                <span>{formatIDR(totalEarnings)}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">Potongan</p>
              <ul className="mt-2 divide-y divide-ink/6">
                {deductions.map((item) => (
                  <li key={item.label} className="flex items-center justify-between py-2 text-[11.5px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-medium text-ink">{formatIDR(item.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex items-center justify-between rounded-xl bg-white/70 px-2.5 py-2 text-[11.5px] font-semibold">
                <span>Total potongan</span>
                <span>{formatIDR(totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3 rounded-[20px] bg-lime p-4">
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] text-ink/60 uppercase">Gaji bersih (take home pay)</p>
              <p className="mt-1 text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink">{formatIDR(net)}</p>
            </div>
            <div className="text-right text-[10.5px] text-ink/70">
              <p>BCA •••• {slip.employeeAccount?.slice(-4) ?? '****'}</p>
              <p>Dibayarkan 28 Nov 2026</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/70 bg-white/50 p-3 text-[10px] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            Dokumen ini dihasilkan otomatis oleh NEXA HR dan sah tanpa tanda tangan basah. Perhitungan menggunakan aturan
            PPh 21 v2026.4 dan tarif BPJS yang berlaku. Pertanyaan: helpdesk HR · tiket HD-5521.
          </div>
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          <Panel>
            <PanelHead title="Rincian pajak & jaminan sosial" hint={`Periode ${slip.period}`} />
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <Field label="PPh 21" value={formatIDR(deductions[0].amount)} />
              <Field label="Status PTKP" value="TK/0" />
              <Field label="BPJS Kesehatan" value={formatIDR(deductions[1].amount)} />
              <Field label="BPJS TK" value={formatIDR(deductions[2].amount + deductions[3].amount)} />
              <Field label="Bruto setahun" value={formatIDR(totalEarnings * 12)} />
              <Field label="Metode" value="Tarif efektif bulanan" />
            </dl>
            <div className="mt-3 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
              Penghitungan akhir tahun dilakukan pada payroll Desember, termasuk THR dan bukti potong 1721-A1.
            </div>
          </Panel>

          <Panel>
            <PanelHead title="Riwayat slip" hint="6 periode terakhir" />
            <ul className="mt-3 space-y-1.5">
              {[slip.period, 'Oktober 2026', 'September 2026', 'Agustus 2026', 'Juli 2026', 'Juni 2026'].map(
                (period, idx) => (
                  <li
                    key={period}
                    className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-[11.5px] font-medium text-ink">{period}</p>
                      <p className="text-[10px] text-muted">{formatIDR(idx === 0 ? net : 35820000)}</p>
                    </div>
                    <StatusPill status={idx === 0 ? slip.status : 'Dibayar'} />
                  </li>
                )
              )}
            </ul>
          </Panel>

          <Panel className="glass-dark text-white">
            <div className="flex items-start gap-2.5">
              <Lock className="mt-0.5 size-4 text-lime" />
              <div>
                <p className="text-[12px] font-semibold">Akses terbatas</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-white/60">
                  Slip ini hanya dapat dilihat oleh pemilik akun. Setiap unduhan tercatat di audit log dan tidak dapat
                  dihapus.
                </p>
              </div>
            </div>
            <Pill variant="lime" className="mt-3 px-2.5 py-1 text-[10px]">
              Audit trail aktif
            </Pill>
          </Panel>
        </div>
      </div>
    </div>
  )
}
