import Link from 'next/link'
import { Download, Plus, ShieldCheck, UserCheck, UserPlus, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ModuleTabs } from '@/components/module-tabs'
import { EmployeeDirectory } from '@/components/employee-directory'
import { StatCard } from '@/components/ui/bits'
import { getEmployees } from '@/lib/server-data'

export const metadata = {
  title: 'Direktori karyawan — NEXA HR',
}

export default async function EmployeesPage() {
  const { data: employees, total } = await getEmployees({ page: 1, limit: 100 })

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Core HR · Satu sumber data karyawan
          </>
        }
        title="Direktori karyawan"
        description="Profil tunggal dengan data effective-dated, riwayat lengkap, dan kontrol akses per field untuk gaji serta data pribadi."
        actions={
          <>
            <Link
              href="/organisasi"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <Users className="size-3.5" /> Lihat organisasi
            </Link>
            <Link
              href="/karyawan/import"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
            >
              <Download className="size-3.5" /> Impor data
            </Link>
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90"
            >
              <Plus className="size-3.5" /> Tambah karyawan
            </button>
          </>
        }
      />

      <ModuleTabs
        items={[
          { href: '/karyawan', label: 'Direktori' },
          { href: '/organisasi', label: 'Organisasi & entitas' },
          { href: '/onboarding', label: 'Onboarding' },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Karyawan aktif" value="1.284" delta="+2%" hint="12 negara · 15 entitas hukum" icon={<Users className="size-4" />} />
        <StatCard label="Kontrak & PKWT" value="186" delta="+8" hint="14,5% dari total headcount" icon={<UserCheck className="size-4" />} />
        <StatCard label="Onboarding berjalan" value="12" hint="3 melewati tenggat dokumen" icon={<UserPlus className="size-4" />} />
        <StatCard label="Turnover 12 bulan" value="4,2%" delta="-0,3%" hint="Target di bawah 6%" icon={<ShieldCheck className="size-4" />} />
      </div>

      <EmployeeDirectory employees={employees} total={total} />
    </div>
  )
}
