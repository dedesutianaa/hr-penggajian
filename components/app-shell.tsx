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
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="focus-ring hidden items-center gap-2 rounded-full border border-white/80 bg-white/60 py-1.5 pr-2 pl-3 text-xs text-muted transition-colors hover:bg-white md:flex"
            >
              <Search className="size-3.5" />
              <span>Cari karyawan, slip, kebijakan</span>
              <kbd className="rounded-full bg-ink/6 px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Cari"
              className="focus-ring grid size-9 place-items-center rounded-full border border-white/80 bg-white/60 text-ink-soft transition-colors hover:bg-white md:hidden"
            >
              <Search className="size-4" />
            </button>
            <Link
              href="/approval"
              aria-label="Notifikasi dan approval"
              className="focus-ring relative grid size-9 place-items-center rounded-full border border-white/80 bg-white/60 text-ink-soft transition-colors hover:bg-white"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-2 size-1.5 rounded-full bg-lime-deep ring-2 ring-white" />
            </Link>
            <Link
              href="/saya"
              className="focus-ring flex items-center gap-2 rounded-full border border-white/80 bg-white/60 py-1 pr-2.5 pl-1 transition-colors hover:bg-white"
            >
              <span className="grid size-7 place-items-center rounded-full bg-peach text-[10px] font-semibold text-ink/70">
                AP
              </span>
              <span className="hidden text-[11px] leading-tight sm:block">
                <span className="block font-semibold text-ink">Alex Pradana</span>
                <span className="block text-muted">HR Ops Lead</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="no-scrollbar mx-auto mt-2 flex max-w-[1440px] items-center gap-1 overflow-x-auto lg:hidden">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'focus-ring rounded-full px-3 py-1.5 text-[11.5px] font-medium whitespace-nowrap',
                  active ? 'bg-ink text-white' : 'border border-white/70 bg-white/60 text-ink-soft',
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="focus-ring flex items-center gap-1 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[11.5px] font-medium whitespace-nowrap text-ink-soft"
          >
            Modul <ChevronDown className="size-3" />
          </button>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[1440px] px-3 pt-5 pb-10 md:px-6 md:pt-6">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/60 pt-4 text-[11px] text-muted">
          <p>NEXA HR · Prototipe desain frontend dengan data demo. Tidak terhubung ke sistem produksi.</p>
          <p className="flex items-center gap-3">
            <span>UU PDP</span>
            <span className="size-1 rounded-full bg-muted/50" />
            <span>ISO 27001 (target)</span>
            <span className="size-1 rounded-full bg-muted/50" />
            <span>SOC 2 (target)</span>
          </p>
        </div>
      </footer>

      {paletteOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/25 p-4 pt-20 backdrop-blur-sm md:pt-28">
          <button
            type="button"
            aria-label="Tutup pencarian"
            className="absolute inset-0 cursor-default"
            onClick={() => setPaletteOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian cepat"
            className="glass relative w-full max-w-lg rounded-[26px] p-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2">
              <Search className="size-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari halaman, karyawan, slip gaji…"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                aria-label="Tutup"
                className="focus-ring grid size-6 place-items-center rounded-full text-muted hover:bg-ink/5"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <ul className="mt-2 max-h-80 overflow-y-auto">
              {results.map((page) => (
                <li key={`${page.group}-${page.href}`}>
                  <Link
                    href={page.href}
                    className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-white/70"
                  >
                    <span>{page.label}</span>
                    <span className="text-[10px] tracking-[0.08em] text-muted uppercase">{page.group}</span>
                  </Link>
                </li>
              ))}
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">Tidak ada hasil untuk “{query}”.</li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/25 p-3 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu modul"
            className="absolute inset-0 cursor-default"
            onClick={() => setMenuOpen(false)}
          />
          <div className="glass relative max-h-[80dvh] w-full overflow-y-auto rounded-[26px] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Semua modul</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup"
                className="focus-ring grid size-7 place-items-center rounded-full bg-white/70 text-ink-soft"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {moduleGroups.map((group) => (
                <div key={group.group}>
                  <p className="px-1 pb-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                    {group.group}
                  </p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-xl px-1 py-1.5 text-[12.5px] text-ink-soft"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
