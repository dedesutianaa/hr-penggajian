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
