'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Download, Search, SlidersHorizontal } from 'lucide-react'
import { Panel } from '@/components/ui/panel'
import { Avatar, Cell, Row, StatusPill, Table } from '@/components/ui/bits'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const departments = ['Semua departemen', 'Engineering', 'People & Culture', 'Finance', 'Operations', 'Product', 'Legal & Compliance']
const statuses = ['Semua status', 'Aktif', 'Cuti', 'Onboarding', 'Offboarding']

export function EmployeeDirectory({
  employees,
  total = employees.length,
}: {
  employees: {
    id: string
    name: string
    email: string
    role: string
    department: string
    entity: string
    location: string
    type: string
    status: string
    joinDate: string | Date
    tone?: string
    [key: string]: any
  }[]
  total?: number
}) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(departments[0])
  const [status, setStatus] = useState(statuses[0])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return employees.filter((employee) => {
      const matchesTerm =
        !term ||
        employee.name.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.location.toLowerCase().includes(term)
      const matchesDepartment = department === departments[0] || employee.department === department
      const matchesStatus = status === statuses[0] || employee.status === status
      return matchesTerm && matchesDepartment && matchesStatus
    })
  }, [employees, query, department, status])

  return (
    <Panel className="p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-sm text-ink focus-within:ring-2 focus-within:ring-ink/15">
            <Search className="size-4 shrink-0 text-muted" />
            <span className="sr-only">Cari karyawan</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, posisi, email, atau lokasi"
              className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted"
            />
          </label>
          <div className="flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Filter departemen</span>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="focus-ring appearance-none rounded-full border border-white/80 bg-white/70 py-2 pr-8 pl-3.5 text-[12px] font-medium text-ink-soft"
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="focus-ring appearance-none rounded-full border border-white/80 bg-white/70 py-2 pr-8 pl-3.5 text-[12px] font-medium text-ink-soft"
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted" />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-[12px] font-medium text-ink-soft transition-colors hover:bg-white"
          >
            <Download className="size-3.5" /> Ekspor
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table
          head={['Karyawan', 'Posisi', 'Entitas', 'Tipe', 'Bergabung', 'Status', '']}
          minWidth="min-w-[900px]"
        >
          {filtered.map((employee) => (
            <Row key={employee.id}>
              <Cell>
                <div className="flex items-center gap-2.5">
                  <Avatar name={employee.name} tone={(employee.tone ?? 'mint') as 'mint' | 'lilac' | 'peach' | 'sky' | 'lime'} size="sm" />
                  <div className="min-w-0">
                    <Link
                      href={`/karyawan/${employee.id}`}
                      className="block truncate text-[12.5px] font-medium text-ink hover:underline"
                    >
                      {employee.name}
                    </Link>
                    <p className="truncate text-[10.5px] text-muted">{employee.email}</p>
                  </div>
                </div>
              </Cell>
              <Cell>
                <p className="text-[12px] font-medium text-ink">{employee.role}</p>
                <p className="text-[10.5px] text-muted">{employee.department}</p>
              </Cell>
              <Cell>
                <p className="text-[11.5px] text-ink-soft">{employee.entity}</p>
                <p className="text-[10.5px] text-muted">{employee.location}</p>
              </Cell>
              <Cell>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10.5px] font-medium',
                    employee.type === 'Tetap' ? 'bg-white/80 text-ink-soft' : 'bg-lilac/70 text-[#5b4a9c]',
                  )}
                >
                  {employee.type}
                </span>
              </Cell>
              <Cell className="text-[12px] whitespace-nowrap text-ink-soft">{formatDate(String(employee.joinDate))}</Cell>
              <Cell>
                <StatusPill status={employee.status} />
              </Cell>
              <Cell className="w-10">
                <Link
                  href={`/karyawan/${employee.id}`}
                  aria-label={`Buka profil ${employee.name}`}
                  className="focus-ring grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-ink hover:text-white"
                >
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Cell>
            </Row>
          ))}
          {filtered.length === 0 ? (
            <Row>
              <Cell colSpan={7} className="py-10 text-center text-sm text-muted">
                Tidak ada karyawan yang cocok dengan filter ini.
              </Cell>
            </Row>
          ) : null}
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
        <p>
          Menampilkan <span className="font-semibold text-ink">{filtered.length}</span> dari {total} karyawan
        </p>
        <div className="flex items-center gap-1">
          {['1', '2', '3', '…', '108'].map((page, index) => (
            <button
              key={`${page}-${index}`}
              type="button"
              aria-current={page === '1' ? 'page' : undefined}
              className={cn(
                'focus-ring grid size-7 place-items-center rounded-full text-[11px] font-medium',
                page === '1' ? 'bg-ink text-white' : 'border border-white/80 bg-white/60 text-ink-soft hover:bg-white',
              )}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  )
}
