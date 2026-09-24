'use client'

import { useMemo, useState } from 'react'
import { Check, Clock, Inbox, X } from 'lucide-react'
import { Panel, PanelHead } from '@/components/ui/panel'
import { Avatar, Pill, StatusPill } from '@/components/ui/bits'
import { approvals } from '@/lib/data'
import { formatIDR } from '@/lib/format'
import { cn } from '@/lib/utils'

const filters = ['Semua', 'Cuti', 'Gaji', 'Lembur', 'Expense', 'Requisition'] as const

function categoryOf(type: string) {
  if (type.includes('Cuti')) return 'Cuti'
  if (type.includes('gaji')) return 'Gaji'
  if (type.includes('Lembur')) return 'Lembur'
  if (type.includes('Reimbursement')) return 'Expense'
  return 'Requisition'
}

export function ApprovalInbox() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Semua')
  const [handled, setHandled] = useState<Record<string, 'approved' | 'rejected'>>({})

  const visible = useMemo(
    () =>
      approvals.filter(
        (approval) => filter === 'Semua' || categoryOf(approval.type) === filter,
      ),
    [filter],
  )

  const pending = visible.filter((approval) => !handled[approval.id])

  return (
    <Panel>
      <PanelHead
        title="Menunggu keputusan Anda"
        hint="Setiap keputusan tercatat di audit log beserta alasannya"
        action={
          <Pill variant="lime" className="px-2 py-1 text-[10px]">
            {pending.length} menunggu
          </Pill>
        }
      />

      <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn(
              'focus-ring rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors',
              filter === item
                ? 'bg-ink text-white'
                : 'border border-white/80 bg-white/60 text-ink-soft hover:bg-white',
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {pending.map((approval) => (
          <li key={approval.id} className="rounded-[20px] border border-white/70 bg-white/50 p-3">
            <div className="flex flex-wrap items-start gap-3">
              <Avatar name={approval.requester} tone={approval.tone} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[12.5px] font-semibold text-ink">{approval.requester}</p>
                  <Pill variant="outline" className="px-2 py-0.5 text-[9.5px]">
                    {approval.type}
                  </Pill>
                  {approval.sla === 'Lewat SLA' ? <StatusPill status="Terlambat" /> : null}
                </div>
                <p className="mt-0.5 text-[11px] text-ink-soft">{approval.detail}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" /> {approval.submitted}
                  </span>
                  <span>SLA {approval.sla}</span>
                  {approval.amount ? <span className="font-medium text-ink">{formatIDR(approval.amount)}</span> : null}
                  <span>{approval.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setHandled((state) => ({ ...state, [approval.id]: 'approved' }))}
                  className="focus-ring inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[10.5px] font-medium text-white transition-colors hover:bg-ink/90"
                >
                  <Check className="size-3" /> Setujui
                </button>
                <button
                  type="button"
                  onClick={() => setHandled((state) => ({ ...state, [approval.id]: 'rejected' }))}
                  className="focus-ring inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[10.5px] font-medium text-ink-soft transition-colors hover:bg-white"
                >
                  <X className="size-3" /> Tolak
                </button>
              </div>
            </div>
          </li>
        ))}

        {pending.length === 0 ? (
          <li className="flex flex-col items-center gap-2 rounded-[20px] border border-white/70 bg-white/50 px-4 py-10 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-lime/60 text-ink">
              <Inbox className="size-5" />
            </span>
            <p className="text-[12.5px] font-semibold text-ink">Tidak ada approval di filter ini</p>
            <p className="max-w-xs text-[11px] text-muted">
              Semua permintaan sudah diproses. Keputusan tercatat di audit log dan notifikasi dikirim ke pemohon.
            </p>
          </li>
        ) : null}
      </ul>

      {Object.keys(handled).length > 0 ? (
        <p className="mt-3 rounded-2xl bg-lime/40 px-3 py-2 text-[10.5px] text-ink-soft">
          {Object.keys(handled).length} keputusan tersimpan pada prototipe ini. Di sistem nyata, aksi ini memicu workflow
          berikutnya dan notifikasi.
        </p>
      ) : null}
    </Panel>
  )
}
