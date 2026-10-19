# PRD: Sistem Internal HR & Penggajian Global

Versi 1.0 (draft untuk review) · 22 November 2026 · Penulis: Product Manager · Status: menunggu validasi asumsi di Bagian 2

## 1. Ringkasan dan Peringatan Keras

**Ringkasan.** Satu platform internal untuk seluruh siklus karyawan (rekrut sampai keluar) dan penggajian multi-negara, dengan satu sumber data karyawan yang bisa diaudit. Fungsinya setara suite kelas Workday atau SAP SuccessFactors.

**Hal yang harus diterima sebelum membaca sisanya:**

1. **Cakupan ini sangat besar.** Dibangun penuh dari nol, ini program multi-tahun dengan tim lintas disiplin besar. Rilis tunggal tidak realistis, jadi dokumen ini membaginya dalam fase dan sengaja menurunkan banyak fitur ke P1/P2.
2. **Payroll multi-negara adalah risiko terbesar.** Aturan pajak, jaminan sosial, dan hukum kerja berubah terus di tiap negara. Satu kesalahan berarti gaji salah bayar, denda, dan hilangnya kepercayaan karyawan. Rekomendasi: mesin kalkulasi sendiri hanya untuk negara inti (Indonesia); negara lain lewat provider payroll lokal yang diorkestrasi dari platform (pola hybrid).
3. **Keputusan build vs buy belum diambil dan harus diambil lebih dulu.** Tanpa alasan kuat (data residency, integrasi unik, skala), membeli suite yang ada hampir pasti lebih cepat dan lebih murah. Jika keputusannya buy, dokumen ini menjadi dasar kriteria seleksi vendor.
4. **Data gaji dan data pribadi adalah target kebocoran paling bernilai.** Keamanan adalah syarat go-live, bukan fitur tambahan.
5. **Software tidak memperbaiki proses yang kacau.** Jika HR dan Finance belum sepakat soal cut-off, level persetujuan, dan kebijakan lintas negara, sistem hanya mengotomatiskan kekacauan.
6. **Belum ada data baseline.** Semua target di dokumen ini adalah hipotesis sampai kondisi saat ini diukur di Fase 0.

## 2. Asumsi (validasi sebelum kick-off)

- 5.000 sampai 20.000 karyawan, 10 sampai 30 negara, 15+ entitas hukum.
- Negara pertama Indonesia, disusul 2 sampai 3 negara ASEAN.
- Sudah ada ERP/GL, penyedia identitas untuk SSO, dan bank mitra di tiap negara.
- Populasi campuran: pekerja kantor dan sebagian pekerja shift.
- Bahasa awal Indonesia dan Inggris. Semua pengguna adalah internal perusahaan.

## 3. Problem Statement

Data karyawan tersebar di spreadsheet dan sistem lokal tiap negara. Payroll dikerjakan semi-manual dengan cut-off dan format berbeda. Persetujuan lewat email, jejak audit lemah, dan angka headcount HR sering tidak sama dengan Finance. Dampaknya: gaji salah bayar, risiko kepatuhan, tim HR Ops tenggelam di tugas administratif, dan keputusan tenaga kerja memakai data yang terlambat atau salah. Jika dibiarkan, biaya dan risiko naik seiring bertambahnya negara dan karyawan. Bukti kuantitatif belum ada dan harus dikumpulkan di Fase 0: jumlah koreksi payroll per siklus, jam kerja HR Ops per proses, jumlah tiket HR per bulan.

## 4. Goals dan Non-Goals

**Goals (angka adalah hipotesis awal)**

1. **Akurasi payroll:** minimal 99,8% slip gaji tanpa koreksi, dalam 6 bulan setelah go-live tiap negara.
2. **Kecepatan:** durasi payroll close turun 50% dari baseline.
3. **Self-service:** 90% transaksi HR rutin (cuti, data diri, surat keterangan, slip) selesai tanpa tiket HR dalam 12 bulan.
4. **Satu sumber data:** selisih headcount HR vs Finance nol pada rekonsiliasi bulanan.
5. **Kontrol:** 100% perubahan data sensitif tercatat di audit trail; nol temuan mayor pada audit pertama setelah go-live.

**Non-Goals**

1. Mesin pajak untuk semua negara di v1: terlalu mahal dan berisiko; gunakan provider lokal.
2. ERP atau akuntansi penuh: platform hanya mengirim jurnal ke GL.
3. LMS buatan sendiri: cukup integrasi dengan LMS yang ada.
4. Intranet, chat, atau kolaborasi: di luar domain HR.
5. Screening kandidat otomatis berbasis AI: risiko bias dan hukum, ditunda ke P2.
6. Pengelolaan klaim asuransi: hanya integrasi dengan penyedia.

## 5. Persona

| Persona | Kebutuhan utama |
| --- | --- |
| Karyawan | Lihat slip, ajukan cuti, ubah data, minta surat tanpa email ke HR |
| Manajer | Setujui permintaan, kelola tim, promosi/transfer/merit tanpa spreadsheet |
| HR Business Partner | Data tim akurat, laporan talent, penanganan kasus |
| HR Ops dan Payroll Specialist | Proses massal, kontrol kualitas data, siklus payroll yang bisa direview dan diaudit |
| Finance/Controller | Biaya tenaga kerja akurat, jurnal ke GL, pemisahan tugas |
| Rekruter dan Hiring Manager | Pipeline dan offer terstruktur |
| Legal, Compliance, DPO | Retensi data, hak subjek data, laporan statutory |
| IT Admin dan Auditor | SSO, provisioning, integrasi; bukti kontrol dan log (read-only) |
| Eksekutif/CHRO | Dashboard headcount, biaya, turnover |

## 6. Peta Modul dan Prioritas

**P0** = wajib untuk go-live fase terkait. **P1** = fast follow. **P2** = tidak dibangun sekarang, tetapi arsitektur tidak boleh menghalanginya.

| Modul | Fase | Prioritas |
| --- | --- | --- |
| Platform: keamanan, audit, workflow, integrasi, lokalisasi | 1 | P0 |
| Core HR dan Organisasi | 1 | P0 |
| Payroll (Indonesia dulu; negara lain hybrid) | 1, 2+ | P0 |
| Waktu dan Kehadiran, Cuti | 1 | P0 |
| Self-service karyawan dan manajer | 1 | P0 |
| Onboarding dan Offboarding | 1 dasar, 2 penuh | P0/P1 |
| Analitik dan Pelaporan | 1 dasar, 2 penuh | P0/P1 |
| Rekrutmen (ATS), Benefit, Expense, Helpdesk HR | 2 | P1 |
| Performance, Kompensasi | 3 | P1 |
| Learning (integrasi), Mobility, prediktif, AI | 3 sampai 4 | P2 |

## 7. Kebutuhan Fungsional

### 7.1 Core HR dan Organisasi

| ID | Kebutuhan | P |
| --- | --- | --- |
| CH-01 | Profil karyawan tunggal: data pribadi, kontak darurat, dependen, pendidikan, rekening bank, dokumen | P0 |
| CH-02 | Semua data effective-dated: riwayat lengkap, perubahan backdated dan future-dated | P0 |
| CH-03 | Struktur organisasi: entitas hukum, departemen, cost center, lokasi, posisi, garis pelaporan, dotted line | P0 |
| CH-04 | Transaksi siklus kerja (hire, transfer, promosi, perubahan gaji/kontrak, rehire, terminasi) dengan alasan dan workflow | P0 |
| CH-05 | Tipe pekerja: tetap, kontrak (PKWT/PKWTT), magang, paruh waktu, kontraktor | P0 |
| CH-06 | Field dan aturan lokal per negara dikonfigurasi tanpa ubah kode (mis. NPWP, NIK, nomor BPJS) | P0 |
| CH-07 | Dokumen berversi dengan pengingat kedaluwarsa (kontrak, izin kerja, visa) | P0 |
| CH-08 | Org chart interaktif dan simulasi reorganisasi | P1 |
| CH-09 | Penugasan internasional (expat, shadow payroll, tax equalization) | P2 |

### 7.2 Payroll

| ID | Kebutuhan | P |
| --- | --- | --- |
| PY-01 | Struktur gaji: komponen penghasilan, potongan, tunjangan, status kena pajak, formula; per entitas dan negara | P0 |
| PY-02 | Siklus payroll: input, kalkulasi, review variansi, persetujuan berjenjang, kunci periode, pembayaran, pelaporan | P0 |
| PY-03 | Gross-to-net dengan pajak dan jaminan sosial per negara; tarif, batas, dan aturan berversi dan effective-dated, bukan hardcode | P0 |
| PY-04 | Indonesia: PPh 21 (mekanisme tarif efektif bulanan dan penghitungan akhir tahun), BPJS Kesehatan dan Ketenagakerjaan, THR, kalkulator pesangon, bukti potong. Wajib divalidasi konsultan pajak | P0 |
| PY-05 | Multi-currency: kontrak dalam satu mata uang, dibayar dalam mata uang lain, kurs tercatat dan bisa diaudit | P0 |
| PY-06 | Input variabel (lembur, bonus, komisi, potongan, koreksi) dari modul lain dan impor massal | P0 |
| PY-07 | Retro pay: perubahan efektif mundur menghasilkan selisih otomatis | P0 |
| PY-08 | Pemeriksaan pra-payroll: net negatif, kenaikan tak wajar, rekening kosong atau ganda, data pajak hilang | P0 |
| PY-09 | Mode simulasi dan parallel run terhadap sistem lama sebelum go-live | P0 |
| PY-10 | File pembayaran per bank dan format negara, rekonsiliasi pembayaran gagal; integrasi bank langsung di P1 | P0 |
| PY-11 | Slip gaji digital multi-bahasa, hanya diakses lewat self-service, dengan histori | P0 |
| PY-12 | Jurnal ke GL per cost center dan entitas; rekonsiliasi payroll ke GL | P0 |
| PY-13 | Laporan statutory dan file untuk otoritas, per negara fase terkait | P0 |
| PY-14 | Off-cycle payroll, final pay, pencairan sisa cuti, pesangon | P0 |
| PY-15 | Maker-checker: pengubah data gaji tidak boleh menjadi penyetuju payroll | P0 |
| PY-16 | Pinjaman dan uang muka gaji | P1 |
| PY-17 | Dampak equity/RSU pada payroll; earned wage access | P2 |

### 7.3 Waktu, Kehadiran, dan Cuti

| ID | Kebutuhan | P |
| --- | --- | --- |
| TA-01 | Pencatatan kehadiran via web, mobile, dan perangkat absensi; geofence opsional (data lokasi adalah data pribadi, butuh dasar hukum yang jelas) | P0 |
| TA-02 | Jadwal kerja, shift, roster, hari libur nasional/regional per lokasi | P0 |
| TA-03 | Lembur sesuai aturan negara dengan persetujuan; mengalir ke payroll | P0 |
| TA-04 | Koreksi absen dan penanganan anomali (lupa clock-out) dengan approval | P0 |
| TA-05 | Timesheet per proyek atau cost center; peringatan batas jam kerja; pelacakan kerja hybrid | P1 |
| LV-01 | Jenis cuti per negara/entitas (tahunan, sakit, melahirkan, ayah, duka, keagamaan, tanpa gaji) | P0 |
| LV-02 | Akrual, proration, carry-over, kedaluwarsa dengan aturan konfigurabel | P0 |
| LV-03 | Pengajuan, approval, delegasi approver, kalender tim, deteksi bentrok | P0 |
| LV-04 | Lampiran dokumen (mis. surat dokter) dengan akses terbatas | P0 |
| LV-05 | Integrasi ke payroll: cuti tanpa gaji, pencairan sisa cuti | P0 |
| LV-06 | Laporan liabilitas cuti untuk Finance | P1 |

### 7.4 Onboarding dan Offboarding

| ID | Kebutuhan | P |
| --- | --- | --- |
| OB-01 | Checklist per peran, negara, entitas dengan tugas lintas tim (HR, IT, Finance, Fasilitas), tenggat, eskalasi | P0 |
| OB-02 | Offboarding: clearance, pengembalian aset, exit interview, pemicu final pay | P0 |
| OB-03 | Penonaktifan akses otomatis pada hari terakhir kerja via SSO/SCIM | P0 |
| OB-04 | Surat keterangan kerja dan paklaring otomatis dari template | P0 |
| OB-05 | Portal pre-boarding: dokumen, e-sign, data bank dan pajak | P1 |

### 7.5 Rekrutmen (ATS)

| ID | Kebutuhan | P |
| --- | --- | --- |
| RC-01 | Requisition terhubung ke posisi dan anggaran headcount, dengan approval | P1 |
| RC-02 | Career page, posting multi-kanal, pipeline kandidat | P1 |
| RC-03 | Scorecard wawancara terstruktur; penjadwalan terintegrasi kalender | P1 |
| RC-04 | Offer dari template, approval, e-sign; data kandidat menjadi data karyawan saat hire tanpa input ulang | P1 |
| RC-05 | Retensi dan penghapusan data kandidat sesuai UU PDP | P1 |
| RC-06 | Referral dan mobilitas internal | P2 |

