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

### 7.6 Performance, Kompensasi, Benefit, Expense

| ID | Kebutuhan | P |
| --- | --- | --- |
| PF-01 | Tujuan/OKR, check-in, review berkala, umpan balik 360 | P1 |
| PF-02 | Kalibrasi, 9-box, performance improvement plan terdokumentasi | P1 |
| PF-03 | Suksesi, talent review, framework kompetensi | P2 |
| CP-01 | Grade, salary band, compa-ratio | P1 |
| CP-02 | Siklus merit/bonus: anggaran per manajer, rekomendasi, approval; hasil langsung masuk payroll | P1 |
| CP-03 | Total reward statement | P1 |
| CP-04 | Benchmark pasar dan analisis kesetaraan upah | P2 |
| BX-01 | Enrolment benefit (asuransi, pensiun), kelayakan, dependen, open enrolment; kontribusi dan potongan ke payroll | P1 |
| BX-02 | Klaim biaya dengan OCR struk, kebijakan per grade/negara, pembayaran via payroll atau AP | P1 |
| BX-03 | Perjalanan dinas, uang muka, benefit fleksibel | P2 |

### 7.7 Self-Service, Workflow, Helpdesk, Analitik

| ID | Kebutuhan | P |
| --- | --- | --- |
| SS-01 | Self-service karyawan: profil, slip, cuti, absensi, dokumen, permintaan surat; perubahan data sensitif lewat approval | P0 |
| SS-02 | Self-service manajer: inbox approval, data tim, transaksi untuk bawahan | P0 |
| SS-03 | Web responsif penuh; notifikasi email, push, Teams/Slack. Aplikasi native iOS/Android di P1 | P0 |
| SS-04 | Case management HR: tiket, SLA, knowledge base | P1 |
| SS-05 | Asisten AI untuk pertanyaan kebijakan; hanya dengan sumber dokumen yang dikutip, karena jawaban salah soal gaji atau hak kerja berisiko hukum | P2 |
| WF-01 | Engine workflow tanpa kode: kondisi, berjenjang, paralel, delegasi, SLA, eskalasi | P0 |
| WF-02 | Kebijakan berbeda per negara, entitas, dan grup karyawan | P0 |
| WF-03 | Perubahan konfigurasi (aturan payroll, workflow) lewat lingkungan uji dan approval sebelum produksi | P0 |
| WF-04 | Template surat dan kontrak dengan variabel; tanda tangan elektronik sesuai regulasi lokal | P1 |
| AN-01 | Dashboard headcount, biaya tenaga kerja, turnover, absensi, cuti, lembur | P0 |
| AN-02 | Row-level security: manajer hanya melihat timnya, HRBP hanya cakupannya | P0 |
| AN-03 | Report builder self-service; ekspor terjadwal; feed ke data warehouse | P1 |
| AN-04 | Workforce planning: anggaran headcount vs aktual | P1 |
| AN-05 | Prediksi attrition: butuh data bersih beberapa tahun, jangan dijanjikan sebelum itu | P2 |

## 8. Kebutuhan Non-Fungsional, Keamanan, Kepatuhan

**Keamanan**

- SSO (SAML/OIDC); MFA wajib untuk HR, Payroll, dan admin.
- RBAC plus atribut (entitas, negara, organisasi); field-level security untuk gaji, ID nasional, data kesehatan.
- Akses darurat (break-glass) hanya dengan persetujuan dan log.
- Enkripsi in transit dan at rest, kunci dikelola terpisah. Data produksi tidak boleh disalin ke lingkungan dev/test tanpa anonimisasi.
- Audit log immutable: siapa, apa, kapan, nilai sebelum dan sesudah, termasuk siapa yang melihat data gaji. Admin aplikasi tidak bisa mengubah atau menghapusnya.

**Privasi dan kepatuhan**

- UU PDP Indonesia (UU No. 27 Tahun 2022), GDPR jika ada karyawan di UE, dan hukum lokal tiap negara.
- Data residency harus didukung arsitektur sejak awal; menambahkannya belakangan sangat mahal.
- Hak subjek data (akses, koreksi, penghapusan), kebijakan retensi dan anonimisasi, DPIA sebelum go-live, DPO ditunjuk.
- Kontrol SOX jika perusahaan tercatat di bursa AS. Target sertifikasi ISO 27001 dan SOC 2 untuk platform dan vendor.

**Performa dan ketersediaan (hipotesis, validasi dengan Engineering)**

- Ketersediaan 99,9%, dan 99,95% pada jendela payroll. RPO maksimal 15 menit, RTO maksimal 4 jam, uji DR tahunan.
- Halaman p95 maksimal 2 detik. Payroll 20.000 karyawan selesai maksimal 60 menit. Skala sampai 50.000 karyawan.

**Lokalisasi, aksesibilitas, migrasi**

- Multi-bahasa, zona waktu, mata uang, format tanggal; WCAG 2.1 AA.
- Aturan negara baru ditambahkan lewat konfigurasi, bukan rilis kode, sejauh mungkin.
- Migrasi: alat impor dengan validasi dan rekonsiliasi per karyawan; minimal 3 siklus parallel run per negara sebelum cutover.

## 9. Integrasi

| Sistem | Tujuan | P |
| --- | --- | --- |
| Penyedia identitas | SSO, provisioning dan deprovisioning (SCIM) | P0 |
| ERP/GL | Jurnal payroll, cost center, entitas | P0 |
| Bank | File pembayaran gaji (P0), integrasi langsung/API (P1) | P0/P1 |
| Otoritas pajak dan jaminan sosial | File laporan (P0), e-filing langsung (P1) | P0/P1 |
| Provider payroll lokal | Kalkulasi negara non-inti (hybrid) | P1 (P0 di Fase 2) |
| Perangkat absensi, kalender/email, Teams/Slack | Kehadiran, penjadwalan, notifikasi | P1 |
| E-signature, penyedia asuransi/benefit, data warehouse | Kontrak, enrolment, analitik | P1 |
| LMS, job board, background check | Learning, rekrutmen | P2 |

## 10. User Stories Utama

1. Sebagai karyawan, saya ingin melihat slip gaji dan mengajukan cuti dari satu tempat agar tidak perlu menghubungi HR.
2. Sebagai karyawan, saya ingin mengubah rekening bank dengan verifikasi tambahan agar gaji tidak bisa dialihkan orang lain.
3. Sebagai manajer, saya ingin menyetujui cuti, lembur, dan promosi dari satu inbox agar tidak ada approval yang tercecer di email.
4. Sebagai payroll specialist, saya ingin melihat variansi dan anomali sebelum kunci periode agar kesalahan tertangkap sebelum uang keluar.
5. Sebagai payroll specialist, saya ingin menjalankan simulasi tanpa efek ke data produksi agar aturan baru teruji.
6. Sebagai Finance controller, saya ingin jurnal payroll otomatis per cost center agar close bulanan tidak butuh rekonsiliasi manual.
7. Sebagai HRBP, saya ingin melihat riwayat posisi dan gaji karyawan pada tanggal tertentu agar keputusan dan audit memakai data yang benar pada waktunya.
8. Sebagai HR Ops, saya ingin impor perubahan data massal dengan validasi agar kesalahan terdeteksi sebelum tersimpan.
9. Sebagai DPO, saya ingin memproses permintaan akses atau penghapusan data karyawan dengan jejak lengkap agar kepatuhan bisa dibuktikan.
10. Sebagai auditor, saya ingin akses read-only ke log perubahan data gaji agar pengujian kontrol tidak bergantung pada tim HR.
11. Sebagai IT admin, saya ingin akun dinonaktifkan otomatis saat karyawan keluar agar tidak ada akses tertinggal.
12. Sebagai karyawan baru, saya ingin menyelesaikan dokumen, data bank, dan data pajak sebelum hari pertama agar gaji pertama tidak terlambat.

## 11. Acceptance Criteria Kritis

1. **Maker-checker.** Given Payroll Specialist A mengubah komponen gaji seorang karyawan, when A mencoba menyetujui payroll periode itu, then sistem menolak dan meminta penyetuju lain.
2. **Kunci periode.** Given payroll Maret terkunci, when ada perubahan data yang memengaruhi Maret, then hasil Maret tidak berubah dan selisih dihitung sebagai retro di periode terbuka berikutnya.
3. **Effective dating.** Given kenaikan gaji berlaku 1 Februari tetapi diinput 15 Maret, when payroll Maret dijalankan, then selisih Februari muncul sebagai komponen retro dengan rincian yang bisa diaudit.
4. **Anomali.** Given hasil kalkulasi memuat net negatif atau lonjakan di atas ambang, when payroll direview, then item ditandai dan periode tidak bisa dikunci sebelum ada alasan penyelesaian tercatat.
5. **Akses data.** Given manajer membuka profil bawahan langsung, when halaman dimuat, then gaji pokok dan data kesehatan tidak tampil tanpa hak eksplisit; akses ke karyawan di luar timnya lewat URL atau API langsung juga ditolak.
6. **Offboarding.** Given tanggal akhir kerja 30 April, when tanggal itu berlalu, then akun nonaktif di semua sistem terhubung dalam maksimal 1 jam dan final pay terpicu.
7. **Saldo cuti.** Given saldo cuti 2 hari, when karyawan mengajukan 3 hari, then sistem menolak atau menawarkan sisa sebagai cuti tanpa gaji sesuai kebijakan entitas, lengkap dengan dampak ke gaji.
8. **Audit.** Given pengguna HR melihat atau mengubah gaji, when auditor menarik log, then identitas, waktu, nilai sebelum dan sesudah, serta alasan tampil, dan log tidak bisa diubah.

## 12. Success Metrics

| Metrik | Target (hipotesis) | Jenis | Evaluasi |
| --- | --- | --- | --- |
| Adopsi self-service aktif bulanan | 85% karyawan | Leading | 60 hari setelah go-live |
| Cuti diajukan lewat sistem | 95% | Leading | 30 hari |
| Approval manajer dalam 2 hari kerja | 90% | Leading | 30 hari |
| Selisih parallel run vs sistem lama setelah dijelaskan | maksimal 0,1% | Leading | Sebelum cutover |
| Record migrasi gagal validasi | di bawah 0,5% | Leading | Per gelombang migrasi |
| Akurasi payroll (slip tanpa koreksi) | minimal 99,8% | Lagging | 6 bulan |
| Durasi payroll close | turun 50% dari baseline | Lagging | 6 bulan |
| Tiket HR per 100 karyawan | turun 40% | Lagging | 12 bulan |
| Selisih headcount HR vs Finance | 0 | Lagging | Bulanan |
| Temuan audit mayor | 0 | Lagging | Audit pertama |
| Kepuasan pengguna (CSAT) | minimal 4 dari 5 | Lagging | 6 bulan |

## 13. Fase dan Timeline (hipotesis, wajib divalidasi estimasi Engineering)

| Fase | Periode | Isi |
| --- | --- | --- |
| 0 | Bulan 0 sampai 3 | Discovery, baseline, keputusan build/buy, standardisasi proses global, threat model dan DPIA, pilih negara pilot, sponsor dan anggaran |
| 1 | Bulan 3 sampai 12 | Platform keamanan, Core HR, organisasi, workflow, self-service, cuti, kehadiran, payroll Indonesia (3 siklus parallel run), integrasi SSO/GL/bank, analitik dasar |
| 2 | Bulan 12 sampai 20 | Payroll negara 2 sampai 4 (hybrid), onboarding/offboarding penuh, ATS, benefit, expense, helpdesk, analitik penuh |
| 3 | Bulan 20 sampai 30 | Performance, kompensasi, integrasi learning, workforce planning |
| 4 | Bulan 30+ | Global mobility, prediktif, asisten AI, benefit fleksibel |

**Batasan keras:** hindari go-live payroll pada Desember sampai Januari (penutupan tahun pajak, THR dan bonus, bukti potong). Jadwalkan cutover di awal kuartal setelah close bulanan. Setiap penambahan scope harus disertai pengurangan scope atau perpanjangan timeline.

## 14. Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Scope creep: semua fitur dituntut sekaligus | Timeline molor, kualitas turun | Fase tegas; tiap tambahan diimbangi pengurangan atau perpanjangan |
| Aturan pajak dan jaminan sosial berubah | Salah hitung, denda | Aturan berversi dan konfigurabel; konsultan pajak lokal meninjau tiap perubahan; provider lokal untuk negara non-inti |
| Data migrasi kotor | Salah bayar sejak siklus pertama | Pembersihan data di Fase 0 dan 1; 3 siklus parallel run; rekonsiliasi per karyawan |
| Kebocoran data gaji atau pribadi | Sanksi UU PDP/GDPR, reputasi, kepercayaan karyawan | Least privilege, field-level security, log akses, pentest sebelum go-live |
| Negara atau entitas menolak standardisasi | Sistem penuh pengecualian dan sulit dirawat | Sponsor eksekutif; kebijakan global dengan variasi lokal yang disetujui dan terdokumentasi |
| Adopsi manajer rendah | Approval macet, HR kembali ke email | Inbox approval cepat, SLA dan eskalasi, pelatihan, metrik adopsi per unit |
| Hukum ketenagakerjaan atau kewajiban konsultasi karyawan (mis. works council) | Peluncuran tertunda atau ditolak | Libatkan Legal dan perwakilan karyawan sejak Fase 0 |
| Salah konfigurasi oleh admin HR | Payroll salah secara massal | Lingkungan uji, approval perubahan konfigurasi, simulasi sebelum produksi |
| Ketergantungan pada satu vendor atau satu orang | Lock-in, bus factor | API terbuka, ekspor data penuh, dokumentasi, klausul exit |
| Kinerja buruk di jendela payroll | Gaji telat dibayar | Uji beban 2x skala, monitoring, prosedur fallback manual |

## 15. Open Questions

| # | Pertanyaan | Pemilik | Sifat |
| --- | --- | --- | --- |
| 1 | Build, buy, atau hybrid? Siapa sponsor eksekutif dan berapa anggarannya? | CHRO, CFO, CTO | Blocking |
| 2 | Daftar negara, entitas, dan jumlah karyawan per negara; mana yang masuk 12 bulan pertama? | HR, Finance | Blocking |
| 3 | Ada kewajiban data residency? Apakah perusahaan tercatat di bursa AS (SOX)? | Legal, Finance | Blocking |
| 4 | Sistem HR dan payroll yang ada sekarang: vendor per negara, kapan kontrak berakhir? | IT, Procurement | Blocking |
| 5 | Siapa pemilik tunggal proses payroll global dan kebijakan lintas negara? | CHRO, CFO | Blocking |
| 6 | Baseline: koreksi payroll, jam kerja HR Ops, jumlah tiket HR | HR Ops, Payroll | Blocking untuk finalisasi target |
| 7 | Aplikasi native atau web responsif sudah cukup? | Design, Engineering | Non-blocking |
| 8 | Perangkat absensi apa yang dipakai di lokasi shift? | IT, Fasilitas | Non-blocking |
| 9 | Kebijakan penggunaan AI pada data karyawan? | Legal, DPO | Non-blocking |
| 10 | Penyedia e-signature yang sah di tiap negara? | Legal | Non-blocking |
| 11 | Apakah kontraktor dan EOR masuk ruang lingkup di tahap lanjut? | HR, Legal | Non-blocking |
