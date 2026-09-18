import type { ReactNode } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tone } from '@/lib/data'

const toneBg: Record<Tone, string> = {
  mint: 'bg-mint',
  lilac: 'bg-lilac',
  peach: 'bg-peach',
  sky: 'bg-sky',
  lime: 'bg-lime',
}

const toneDot: Record<Tone, string> = {
  mint: 'bg-[#7fbf9a]',
  lilac: 'bg-[#a99ae0]',
  peach: 'bg-[#e8a97e]',
  sky: 'bg-[#8bb6dd]',
  lime: 'bg-lime-deep',
}

export function Pill({
  children,
  variant = 'light',
  className,
}: {
  children: ReactNode
  variant?: 'light' | 'dark' | 'lime' | 'outline' | 'muted'
  className?: string
}) {
  const variants = {
    light: 'bg-white/80 text-ink border border-white/90 shadow-[0_1px_2px_rgba(20,30,20,0.05)]',
    dark: 'bg-ink text-white',
    lime: 'bg-lime text-ink',
    outline: 'border border-line bg-white/40 text-ink-soft',
    muted: 'bg-white/50 text-muted',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

const statusStyles: Record<string, string> = {
  Aktif: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Hadir: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Disetujui: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Dibayar: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Selesai: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Terhubung: 'bg-[#e6f6d8] text-[#3f6b1e]',
  Menunggu: 'bg-[#fdf1d6] text-[#8a5a12]',
  'Review variansi': 'bg-[#fdf1d6] text-[#8a5a12]',
  Terlambat: 'bg-[#fdf1d6] text-[#8a5a12]',
  'Dalam proses': 'bg-[#e4edfa] text-[#2f5a8a]',
  'Uji coba': 'bg-[#fdf1d6] text-[#8a5a12]',
  Cuti: 'bg-[#e4edfa] text-[#2f5a8a]',
  WFH: 'bg-[#e4edfa] text-[#2f5a8a]',
  Onboarding: 'bg-[#ece8fa] text-[#5b4a9c]',
  'Menunggu persetujuan': 'bg-[#e4edfa] text-[#2f5a8a]',
  Draft: 'bg-white/70 text-ink-soft border border-line',
  Offboarding: 'bg-white/70 text-ink-soft border border-line',
  Terkunci: 'bg-ink text-white',
  Ditolak: 'bg-[#fbe3e0] text-[#9b3b2e]',
  Absen: 'bg-[#fbe3e0] text-[#9b3b2e]',
  Tinggi: 'bg-[#fbe3e0] text-[#9b3b2e]',
  Sedang: 'bg-[#fdf1d6] text-[#8a5a12]',
  Rendah: 'bg-white/70 text-ink-soft border border-line',
  Terbuka: 'bg-[#fbe3e0] text-[#9b3b2e]',
  'Segera kedaluwarsa': 'bg-[#fdf1d6] text-[#8a5a12]',
  Kedaluwarsa: 'bg-[#fbe3e0] text-[#9b3b2e]',
  Terverifikasi: 'bg-[#e6f6d8] text-[#3f6b1e]',
  'Belum diverifikasi': 'bg-[#fdf1d6] text-[#8a5a12]',
  Berlaku: 'bg-[#e6f6d8] text-[#3f6b1e]',
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        statusStyles[status] ?? 'bg-white/70 text-ink-soft border border-line',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-60" aria-hidden />
      {status}
    </span>
  )
}

export function Delta({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-lime/80 px-1.5 py-0.5 text-[10px] font-semibold text-ink',
        className,
      )}
    >
      {value}
    </span>
  )
}

export function Avatar({
  name,
  tone = 'mint',
  size = 'md',
  className,
}: {
  name: string
  tone?: Tone
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    xs: 'size-6 text-[9px]',
    sm: 'size-8 text-[10px]',
    md: 'size-10 text-xs',
    lg: 'size-14 text-sm',
    xl: 'size-20 text-lg',
  }
  const label = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold text-ink/70 ring-1 ring-white/80',
        toneBg[tone],
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  )
}

export function Progress({
  value,
  tone = 'ink',
  className,
}: {
  value: number
  tone?: 'ink' | 'lime' | 'mint' | 'sky'
  className?: string
}) {
  const tones = {
    ink: 'bg-ink',
    lime: 'bg-lime-deep',
    mint: 'bg-[#7fbf9a]',
    sky: 'bg-[#8bb6dd]',
  }
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink/8', className)}>
      <div
        className={cn('h-full rounded-full transition-all', tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function SegmentedBar({
  segments,
  className,
}: {
  segments: { value: number; tone: 'lime' | 'ink' | 'muted' | 'mint' | 'sky' }[]
  className?: string
}) {
  const tones = {
    lime: 'bg-lime',
    ink: 'bg-ink',
    muted: 'bg-ink/15',
    mint: 'bg-[#a9d8bd]',
    sky: 'bg-[#a9c8e6]',
  }
  return (
    <div className={cn('flex h-9 w-full gap-1 overflow-hidden rounded-full', className)}>
      {segments.map((segment, index) => (
        <div
          key={index}
          className={cn('h-full rounded-full', tones[segment.tone])}
          style={{ width: `${segment.value}%` }}
        />
      ))}
    </div>
  )
}

export function DotBars({
  values,
  className,
  rows = 8,
}: {
  values: number[]
  className?: string
  rows?: number
}) {
  return (
    <div className={cn('flex h-full items-end gap-[3px]', className)} aria-hidden>
      {values.map((value, index) => {
        const filled = Math.max(1, Math.round((value / 100) * rows))
        const highlight = index >= values.length - 5
        return (
          <div key={index} className="flex h-full flex-1 flex-col-reverse items-center gap-[4px]">
            {Array.from({ length: rows }).map((_, row) => (
              <span
                key={row}
                className={cn(
                  'size-[4px] shrink-0 rounded-full',
                  row < filled ? (highlight ? 'bg-ink/75' : 'bg-[#8fbfa6]') : 'bg-ink/10',
                )}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

