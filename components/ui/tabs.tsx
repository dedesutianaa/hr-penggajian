'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type TabItem = {
  id: string
  label: string
  badge?: string
  content: ReactNode
}

export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id)
  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Bagian detail"
        className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
      >
        {items.map((item) => {
          const selected = item.id === current?.id
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => setActive(item.id)}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                selected
                  ? 'bg-ink text-white'
                  : 'border border-white/70 bg-white/50 text-ink-soft hover:bg-white/80',
              )}
            >
              {item.label}
              {item.badge ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    selected ? 'bg-white/20 text-white' : 'bg-ink/8 text-ink-soft',
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      {current ? (
        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-4"
        >
          {current.content}
        </div>
      ) : null}
    </div>
  )
}
