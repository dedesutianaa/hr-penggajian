'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Asterisk, Bell, ChevronDown, LayoutGrid, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const primaryNav = [
  { href: '/', label: 'Dashboard' },
  { href: '/karyawan', label: 'Karyawan' },
  { href: '/payroll', label: 'Payroll' },
  { href: '/kehadiran', label: 'Waktu & Cuti' },
  { href: '/rekrutmen', label: 'Rekrutmen' },
  { href: '/laporan', label: 'Laporan' },
]

const moduleGroups = [
  {
    group: 'Core HR',
    items: [
      { href: '/karyawan', label: 'Direktori karyawan' },
      { href: '/organisasi', label: 'Organisasi & entitas' },
      { href: '/onboarding', label: 'Onboarding & offboarding' },
    ],
  },
  {
    group: 'Payroll & reward',
    items: [
      { href: '/payroll', label: 'Siklus payroll' },
      { href: '/slip-gaji', label: 'Slip gaji' },
      { href: '/kompensasi', label: 'Kompensasi & grade' },
      { href: '/benefit', label: 'Benefit & expense' },
    ],
  },
  {
    group: 'Talent',
    items: [
      { href: '/rekrutmen', label: 'Rekrutmen (ATS)' },
      { href: '/performa', label: 'Performa & OKR' },
    ],
  },
  {
    group: 'Operasional',
    items: [
      { href: '/approval', label: 'Inbox approval' },
      { href: '/helpdesk', label: 'Helpdesk HR' },
      { href: '/laporan', label: 'Analitik & laporan' },
      { href: '/audit', label: 'Audit log' },
      { href: '/pengaturan', label: 'Pengaturan & integrasi' },
    ],
  },
  {
    group: 'Saya',
    items: [{ href: '/saya', label: 'Self-service karyawan' }],
  },
]

const allPages = moduleGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.group })),
)

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setMenuOpen(false)
    setPaletteOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return allPages
    return allPages.filter(
      (page) => page.label.toLowerCase().includes(term) || page.group.toLowerCase().includes(term),
    )
  }, [query])

  const moduleActive = moduleGroups
    .flatMap((group) => group.items)
    .some((item) => isActive(pathname, item.href) && !primaryNav.some((nav) => nav.href === item.href))

  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 rounded-full border border-white/70 bg-white/65 p-1.5 pl-2 shadow-[0_1px_2px_rgba(20,30,20,0.05),0_18px_40px_-30px_rgba(20,30,20,0.5)] backdrop-blur-xl">
          <Link
            href="/"
            className="focus-ring flex items-center gap-2 rounded-full py-1 pr-2 pl-1"
            aria-label="NEXA HR — beranda"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink text-lime">
              <Asterisk className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">nexa</span>
            <span className="rounded-full bg-lime px-1.5 py-0.5 text-[9px] font-bold tracking-[0.08em] text-ink">
              HR
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-ring rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors',
                    active ? 'bg-ink text-white' : 'text-ink-soft hover:bg-white/80 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                className={cn(
                  'focus-ring flex items-center gap-1.5 rounded-full border border-white/80 px-3 py-2 text-[11.5px] font-medium transition-colors',
                  moduleActive ? 'bg-ink text-white' : 'bg-white/60 text-ink-soft hover:bg-white',
                )}
              >
                <LayoutGrid className="size-3.5" />
                Modul
                <ChevronDown className={cn('size-3 transition-transform', menuOpen && 'rotate-180')} />
              </button>
              {menuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Tutup menu modul"
                    className="fixed inset-0 z-0 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="glass absolute top-full right-0 z-10 mt-2 w-[560px] rounded-[26px] p-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {moduleGroups.map((group) => (
                        <div key={group.group}>
                          <p className="px-2 pb-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                            {group.group}
                          </p>
                          <ul>
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    'block rounded-xl px-2 py-1.5 text-[12.5px] transition-colors hover:bg-white/70',
                                    isActive(pathname, item.href) ? 'font-semibold text-ink' : 'text-ink-soft',
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
