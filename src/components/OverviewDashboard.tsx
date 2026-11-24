import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckSquare,
  ClipboardCheck,
  FileImage,
  FileText,
  Plus,
  Printer,
  ShieldCheck,
  Sparkles,
  Square,
  UserCheck,
} from 'lucide-react';
import { calculateAverage } from '../data/defaultData';
import { RaporModule, SchoolProfile, SemesterPackage, StudentRecord } from '../types/rapor';

interface OverviewDashboardProps {
  student: StudentRecord;
  school: SchoolProfile;
  activeSemester: SemesterPackage;
  onNavigateModule: (module: RaporModule) => void;
  onNavigateCustomModule: (customId: string) => void;
  onOpenEditor: (module: RaporModule) => void;
  onPrintBundle: () => void;
  onSelectSemester: (semId: string) => void;
  onOpenAddSemester: () => void;
  onOpenAddModule: () => void;
}

export function OverviewDashboard({
  student,
  school,
  activeSemester,
  onNavigateModule,
  onNavigateCustomModule,
  onOpenEditor,
  onPrintBundle,
  onSelectSemester,
  onOpenAddSemester,
  onOpenAddModule,
}: OverviewDashboardProps) {
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  const hasilReport = activeSemester.hasilBelajar;
  const sumatifReport = activeSemester.sumatif;
  const p5Report = activeSemester.p5;

  const sumatifStats = useMemo(() => {
    const items = sumatifReport.subjects.map((sub) => {
      const avg = calculateAverage(sub.rincian);
      return {
        id: sub.id,
        nama: sub.nama,
        count: sub.rincian.length,
        avg,
        needsAttention: avg < 75,
      };
    });
    const attentionCount = items.filter((i) => i.needsAttention).length;
    const overallAvg =
      items.length > 0
        ? items.reduce((acc, i) => acc + i.avg, 0) / items.length
        : 0;
    return { items, attentionCount, overallAvg };
  }, [sumatifReport.subjects]);

  const hasilAvg = useMemo(() => {
    if (!hasilReport.subjects.length) return 0;
    return (
      hasilReport.subjects.reduce((acc, s) => acc + s.nilaiAkhir, 0) /
      hasilReport.subjects.length
    );
  }, [hasilReport.subjects]);

  const p5IndicatorsTotal = useMemo(
    () => p5Report.projects.reduce((acc, p) => acc + p.indikator.length, 0),
    [p5Report.projects]
  );

  const p5CompletedCount = useMemo(
    () =>
      p5Report.projects.reduce(
        (acc, p) => acc + p.indikator.filter((i) => i.level !== null).length,
        0
      ),
    [p5Report.projects]
  );

  const allSelected =
    sumatifStats.items.length > 0 &&
    selectedSubjectIds.length === sumatifStats.items.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedSubjectIds([]);
    } else {
      setSelectedSubjectIds(sumatifStats.items.map((i) => i.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-[1160px] mx-auto space-y-4">
      {/* Semester Bar with Tambah Semester Menu */}
      <div className="bg-white border border-slate-200 rounded shadow-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1">Semester Aktif:</span>
          {student.semesters.map((sem) => {
            const isSelected = sem.id === activeSemester.id;
            return (
              <button
                key={sem.id}
                type="button"
                onClick={() => onSelectSemester(sem.id)}
                className={`px-3 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#00a0d2] text-white border-[#00a0d2]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sem.label} · {sem.kelas} ({sem.tahunPelajaran})
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenAddSemester}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#008bb8] bg-[#00a0d2]/10 border border-[#00a0d2]/40 rounded hover:bg-[#00a0d2]/15 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Semester</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono-tabular">
          Fase {activeSemester.fase} · TP {activeSemester.tahunPelajaran}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.22fr_1fr] gap-5 items-start">
        {/* LEFT COLUMN: Penilaian Sumatif & Kehadiran */}
        <div className="space-y-5">
          {/* Card 1: Rekap Penilaian */}
          <section className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <h2 className="text-[15px] font-semibold text-slate-800">
                Rekap Nilai &amp; Capaian ({activeSemester.label})
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{student.identitas.namaLengkap}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{activeSemester.kelas}</span>
              </div>
            </div>

            {/* KPI Strip + Primary Action Box */}
            <div className="px-5 py-4 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
              <button
                type="button"
                onClick={() => onNavigateModule('sumatif')}
                className="text-center py-1 border-b-2 border-[#00a0d2] cursor-pointer"
              >
                <div className="text-2xl font-semibold text-[#00a0d2] font-mono-tabular">
                  {sumatifReport.subjects.length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Mapel Sumatif</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateModule('hasil_belajar')}
                className="text-center py-1 hover:bg-slate-50 rounded transition-colors cursor-pointer"
              >
                <div className="text-2xl font-semibold text-slate-800 font-mono-tabular">
                  {hasilReport.subjects.length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Rapor Sem {activeSemester.semesterNumber}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateModule('p5')}
                className="text-center py-1 hover:bg-slate-50 rounded transition-colors cursor-pointer"
              >
                <div className="text-2xl font-semibold text-slate-800 font-mono-tabular">
                  {p5Report.projects.length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Projek P5</div>
              </button>

              <button
                type="button"
                onClick={onPrintBundle}
                className="flex flex-col items-center justify-center py-2.5 px-3 border border-[#00a0d2]/50 rounded bg-[#00a0d2]/[0.03] hover:bg-[#00a0d2]/10 transition-colors cursor-pointer"
              >
                <Printer className="w-5 h-5 text-[#00a0d2] mb-1" />
                <span className="text-xs font-medium text-[#008bb8] whitespace-nowrap">
                  Cetak Rapor
                </span>
              </button>
            </div>

            {/* Subject Rows Table */}
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {sumatifStats.items.map((item) => {
                const checked = selectedSubjectIds.includes(item.id);
                const matchingHb = hasilReport.subjects.find(
                  (hb) =>
                    hb.nama.toLowerCase().includes(item.nama.split(' ')[0].toLowerCase()) ||
                    item.nama.toLowerCase().includes(hb.nama.split(' ')[0].toLowerCase())
                );

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleRow(item.id)}
                    className={`px-5 py-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                      checked ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-400 shrink-0">
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-[#00a0d2]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </span>
                      <span className="inline-flex items-center justify-center w-6 h-5 rounded border border-slate-200 bg-slate-50 text-[11px] font-mono-tabular text-slate-600 shrink-0">
                        {item.count}
                      </span>
                      <span className="font-medium text-slate-800 truncate">{item.nama}</span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {item.needsAttention && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-amber-600"
                          title="Rerata di bawah 75"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="flex items-center gap-2 font-mono-tabular">
                        <span className="text-slate-600 w-12 text-right">
                          {item.avg.toFixed(2)}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-[#008bb8] w-8 text-right">
                          {matchingHb ? matchingHb.nilaiAkhir : Math.round(item.avg)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Table Action Footer */}
            <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {allSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#00a0d2]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Pilih semua ({sumatifStats.items.length})</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono-tabular mr-1">
                  {selectedSubjectIds.length} dipilih
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEditor('sumatif')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Edit Nilai
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateModule('sumatif')}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#00a0d2] rounded hover:bg-[#008bb8] transition-colors cursor-pointer"
                >
                  Buka Sumatif
                </button>
                <button
                  type="button"
                  onClick={onPrintBundle}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#16a34a] rounded hover:bg-[#15803d] transition-colors cursor-pointer"
                >
                  Cetak Bundel
                </button>
              </div>
            </div>
          </section>

          {/* Card 2: Ketidakhadiran & Ringkasan Akademik */}
          <section className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-slate-800">
                Ketidakhadiran ({activeSemester.label})
              </h2>
              <span className="text-xs text-slate-500 font-mono-tabular">
                TP {activeSemester.tahunPelajaran}
              </span>
            </div>

            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
              <div className="text-center py-1 border-b-2 border-[#00a0d2]">
                <div className="text-2xl font-semibold text-[#00a0d2] font-mono-tabular">
                  {hasilReport.ketidakhadiran.sakit}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Hari Sakit</div>
              </div>
              <div className="text-center py-1">
                <div className="text-2xl font-semibold text-slate-800 font-mono-tabular">
                  {hasilReport.ketidakhadiran.izin}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Hari Izin</div>
              </div>
              <div className="text-center py-1">
                <div className="text-2xl font-semibold text-slate-800 font-mono-tabular">
                  {hasilReport.ketidakhadiran.tanpaKeterangan}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Tanpa Ket.</div>
              </div>
              <button
                type="button"
                onClick={() => onOpenEditor('hasil_belajar')}
                className="flex flex-col items-center justify-center py-2.5 px-3 border border-[#00a0d2]/50 rounded bg-[#00a0d2]/[0.03] hover:bg-[#00a0d2]/10 transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-[#00a0d2] mb-1" />
                <span className="text-xs font-medium text-[#008bb8] whitespace-nowrap">
                  Ubah Absensi
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Modul Rapor & Status Dokumen */}
        <section className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-semibold text-slate-800">Modul Dokumen Rapor</h2>
            <button
              type="button"
              onClick={onOpenAddModule}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#008bb8] bg-[#00a0d2]/10 border border-[#00a0d2]/40 rounded hover:bg-[#00a0d2]/15 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Modul</span>
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            <ServiceRow
              icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
              iconBg="bg-emerald-50 border-emerald-200"
              title="Sampul Rapor SMA"
              statusText="Siap cetak · Format A4 resmi"
              statusTone="ok"
              description={`${student.identitas.namaLengkap} · NISN/NIS ${student.identitas.nisn} / ${student.identitas.nis}`}
              onClick={() => onNavigateModule('sampul')}
            />

            <ServiceRow
              icon={<UserCheck className="w-5 h-5 text-sky-600" />}
              iconBg="bg-sky-50 border-sky-200"
              title="Identitas Peserta Didik"
              statusText={
                student.identitas.alamatPesertaDidik
                  ? '18 baris data terisi lengkap'
                  : 'Alamat peserta didik masih kosong'
              }
              statusTone={student.identitas.alamatPesertaDidik ? 'ok' : 'warn'}
              description={`Sekolah asal: ${student.identitas.sekolahAsal || '-'} · Diterima ${student.identitas.diterimaPadaTanggal}`}
              onClick={() => onNavigateModule('identitas')}
            />

            <ServiceRow
              icon={<ClipboardCheck className="w-5 h-5 text-amber-600" />}
              iconBg="bg-amber-50 border-amber-200"
              title={`Penilaian Sumatif (${activeSemester.label})`}
              statusText={
                sumatifStats.attentionCount > 0
                  ? `${sumatifStats.attentionCount} mata pelajaran di bawah 75`
                  : 'Semua mata pelajaran tuntas'
              }
              statusTone={sumatifStats.attentionCount > 0 ? 'alert' : 'ok'}
              description={`Rerata keseluruhan ${sumatifStats.overallAvg.toFixed(2)} dari ${sumatifReport.subjects.length} mata pelajaran`}
              onClick={() => onNavigateModule('sumatif')}
            />

            <ServiceRow
              icon={<FileText className="w-5 h-5 text-indigo-600" />}
              iconBg="bg-indigo-50 border-indigo-200"
              title={`Laporan Hasil Belajar (${activeSemester.label})`}
              statusText={
                hasilReport.keteranganKenaikanKelas
                  ? `Keterangan: ${hasilReport.keteranganKenaikanKelas}`
                  : `Rerata Nilai Akhir: ${hasilAvg.toFixed(2)}`
              }
              statusTone="ok"
              description={`${hasilReport.subjects.length} mata pelajaran · Tanggal cetak ${hasilReport.tanggalCetak}`}
              onClick={() => onNavigateModule('hasil_belajar')}
            />

            <ServiceRow
              icon={<Award className="w-5 h-5 text-cyan-600" />}
              iconBg="bg-cyan-50 border-cyan-200"
              title={`Rapor Projek P5 (${activeSemester.label})`}
              statusText={`${p5CompletedCount} dari ${p5IndicatorsTotal} indikator dinilai`}
              statusTone={p5CompletedCount === p5IndicatorsTotal ? 'ok' : 'warn'}
              description={`${p5Report.projects.length} projek aktif · ${p5Report.projects.map((p) => p.judul).join(' · ')}`}
              onClick={() => onNavigateModule('p5')}
            />

            <ServiceRow
              icon={<FileImage className="w-5 h-5 text-rose-600" />}
              iconBg="bg-rose-50 border-rose-200"
              title="Rapor Versi Scan JPG (OCR)"
              statusText={`${(student.scanPages ?? []).length} halaman scan JPG siap cetak & OCR`}
              statusTone={(student.scanPages ?? []).length > 0 ? 'ok' : 'warn'}
              description="Arsip 11 lembar scan asli, unggah JPG/PNG, & baca OCR otomatis ke Identitas, Sumatif, Hasil Belajar, dan P5"
              onClick={() => onNavigateModule('scan_jpg')}
            />

            {(activeSemester.customModules ?? []).map((mod) => (
              <ServiceRow
                key={mod.id}
                icon={<FileText className="w-5 h-5 text-violet-600" />}
                iconBg="bg-violet-50 border-violet-200"
                title={mod.menuLabel}
                statusText={
                  mod.layout === 'adaptif'
                    ? `Format Adaptif OCR · ${mod.adaptiveDoc?.tables?.length ?? 0} tabel`
                    : mod.layout === 'tabel'
                      ? `${mod.rows.length} baris data · Modul Tambahan`
                      : 'Format Narasi · Modul Tambahan'
                }
                statusTone="ok"
                description={`${mod.judulDokumen} · Tanggal cetak ${mod.tanggalCetak}`}
                onClick={() => onNavigateCustomModule(mod.id)}
              />
            ))}

            <ServiceRow
              icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
              iconBg="bg-emerald-50 border-emerald-200"
              title="Pengesahan & Cetak Bundel"
              statusText={`Wali Kelas: ${school.waliKelas}`}
              statusTone="ok"
              description={`Kepala Sekolah: ${school.kepalaSekolah} · Cetak 8 halaman A4 sekaligus`}
              onClick={onPrintBundle}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ServiceRow({
  icon,
  iconBg,
  title,
  statusText,
  statusTone,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  statusText: string;
  statusTone: 'ok' | 'warn' | 'alert';
  description: string;
  onClick: () => void;
}) {
  const statusColor =
    statusTone === 'ok'
      ? 'text-[#16a34a]'
      : statusTone === 'warn'
        ? 'text-amber-600'
        : 'text-red-600';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <div
        className={`w-10 h-10 rounded border flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold text-slate-800">{title}</div>
        <div className={`text-xs font-medium mt-0.5 ${statusColor}`}>{statusText}</div>
        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{description}</div>
      </div>
    </button>
  );
}
