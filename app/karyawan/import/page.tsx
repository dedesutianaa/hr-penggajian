'use client'

import { FileText, Plus, RefreshCw, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Panel, PanelHead } from '@/components/ui/panel'
import { Cell, Row, StatCard, StatusPill, Table } from '@/components/ui/bits'
import { formatNumber } from '@/lib/format'

const sampleCSV = `nik,npwp,bpjs,name,email,phone,role,department,entity,country,location,type,status,joinDate,manager,grade,salary,currency,bank,account,accountVerified,taxStatus,photoUrl,tone
1001,09.254.771.3-407.000,0001 2345 6789 0,Budi Santoso,budi.santoso@nexa.co.id,+62 811 2044 118,Software Engineer,Engineering,PT Nexa Digital Indonesia,Indonesia,Jakarta,TETAP,AKTIF,2024-01-15,Manager A,G4,15000000,IDR,BCA,1234567890,true,TK/0,,mint
1002,07.881.220.4-011.000,0001 9988 1122 3,Siti Rahayu,siti.rahayu@nexa.co.id,+62 812 8890 221,HR Specialist,People & Culture,PT Nexa Digital Indonesia,Indonesia,Bandung,KONTRAK,AKTIF,2024-03-01,Manager B,G5,18000000,IDR,Mandiri,0987654321,false,TK/0,,sky`

export default function ImportPage() {
  const [csvText, setCsvText] = useState(sampleCSV)
  const [result, setResult] = useState<{ total: number; imported: number; failed: number; results: any[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await fetch('/api/employees/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Gagal mengimpor')
        return
      }
      setResult(data)
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  const rows = csvText.split('\n').filter((line) => line.trim().length > 0)

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="size-1.5 rounded-full bg-lime-deep" aria-hidden />
            Core HR · Impor massal
          </>
        }
        title="Impor data karyawan"
        description="Impor data karyawan dari file CSV. Setiap baris akan divalidasi sebelum disimpan. Hasil impor dicatat dalam audit log."
        actions={
          <Link
            href="/karyawan"
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-xs font-medium text-ink-soft transition-colors hover:bg-white"
          >
            Kembali ke direktori
          </Link>
        }
      />

      <div className="grid items-start gap-3 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHead
            title="Template CSV"
            hint="Unduh contoh format · unggah file CSV"
            action={
              <button
                type="button"
                onClick={() => setCsvText(sampleCSV)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[10.5px] font-medium text-ink-soft transition-colors hover:bg-white"
              >
                <RefreshCw className="size-3" /> Reset contoh
              </button>
            }
          />
          <div className="mt-3">
            <textarea
              className="w-full min-h-[400px] rounded-xl border border-white/80 bg-white/70 p-3 text-[11px] font-mono text-ink-soft focus-visible:ring-2 focus-visible:ring-lime outline-none resize-y"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`Masukkan data CSV di sini...\n\nContoh header:\nnik,npwp,bpjs,name,email,phone,role,department,entity,country,location,type,status,joinDate,manager,grade,salary,currency,bank,account,accountVerified,taxStatus,photoUrl,tone`}
            />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleImport}
              disabled={loading}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Save className="size-3.5" /> Mengimpor...
                </>
              ) : (
                <>
                  <Upload className="size-3.5" /> Impor data karyawan
                </>
              )}
            </button>
            <span className="text-[10px] text-muted">{rows.length - 1} baris data</span>
          </div>
          {error && (
            <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-[11px] text-destructive">
              {error}
            </div>
          )}
        </Panel>

        <div className="space-y-3 lg:col-span-4">
          {result && (
            <Panel>
              <PanelHead title="Hasil impor" hint="Ringkasan hasil validasi & penyimpanan" />
              <div className="grid gap-3 sm:grid-cols-3 mt-3">
                <StatCard label="Total baris" value={formatNumber(result.total)} hint="Data yang diproses" icon={<FileText className="size-4" />} />
                <StatCard label="Berhasil" value={formatNumber(result.imported)} hint="Disimpan ke database" icon={<Plus className="size-4" />} />
                <StatCard label="Gagal" value={formatNumber(result.failed)} hint="Tidak lolos validasi" icon={<RefreshCw className="size-4" />} />
              </div>
              <div className="mt-3">
                <Table head={['Baris', 'Status', 'Keterangan']} minWidth="min-w-[320px]">
                  {result.results.slice(0, 20).map((item) => (
                    <Row key={`${item.row}-${item.success}`}>
                      <Cell className="text-[11px] font-medium text-ink">{item.row}</Cell>
                      <Cell>
                        <StatusPill status={item.success ? 'Berhasil' : 'Gagal'} />
                      </Cell>
                      <Cell className="text-[10px] text-ink-soft truncate">
                        {item.success ? 'Disimpan' : item.error ?? 'Error tidak diketahui'}
                      </Cell>
                    </Row>
                  ))}
                  {result.results.length > 20 && (
                    <Row>
                      <Cell colSpan={3} className="text-[10px] text-muted text-center">
                        Menampilkan 20 dari {result.results.length} baris
                      </Cell>
                    </Row>
                  )}
                </Table>
              </div>
            </Panel>
          )}

          <Panel>
            <PanelHead title="Panduan impor" hint="Format & aturan" />
            <ul className="mt-3 space-y-2 text-[10.5px] text-ink-soft leading-relaxed">
              <li className="flex gap-2">
                <span className="text-lime">1.</span>
                Kolom wajib: name, email, role, department, entity, country, location
              </li>
              <li className="flex gap-2">
                <span className="text-lime">2.</span>
                type: TETAP | KONTRAK | MAGANG | KONTRAKTOR
              </li>
              <li className="flex gap-2">
                <span className="text-lime">3.</span>
                status: AKTIF | CUTI | ONBOARDING | OFFBOARDING
              </li>
              <li className="flex gap-2">
                <span className="text-lime">4.</span>
                joinDate format: YYYY-MM-DD
              </li>
              <li className="flex gap-2">
                <span className="text-lime">5.</span>
                Saldo gaji dalam satuan penuh (contoh: 15000000)
              </li>
              <li className="flex gap-2">
                <span className="text-lime">6.</span>
                Setiap baris gagal tidak akan menyimpan data karyawan tersebut
              </li>
              <li className="flex gap-2">
                <span className="text-lime">7.</span>
                Semua impor dicatat dalam audit log untuk keperluan compliance
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
