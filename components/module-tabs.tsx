'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ModuleTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Sub-navigasi modul" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'focus-ring rounded-full px-3.5 py-1.5 text-[11.5px] font-medium whitespace-nowrap transition-colors',
              active
                ? 'bg-white text-ink shadow-[0_1px_2px_rgba(20,30,20,0.08)]'
                : 'text-ink-soft/80 hover:bg-white/50 hover:text-ink',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
