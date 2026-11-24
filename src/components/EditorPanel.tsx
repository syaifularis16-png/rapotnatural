import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { calculateAverage } from '../data/defaultData';
import {
  CustomModuleLayout,
  CustomRaporModule,
  HasilBelajarReport,
  P5Level,
  RaporModule,
  SemesterPackage,
  SignatureMode,
  StudentRecord,
} from '../types/rapor';

interface EditorPanelProps {
  activeModule: RaporModule | 'custom';
  activeCustomModuleId?: string | null;
  activeSemester: SemesterPackage;
  student: StudentRecord;
  onUpdateStudent: (updated: StudentRecord) => void;
}

const P5_LEVEL_OPTIONS: { value: P5Level; label: string }[] = [
  { value: 'MB', label: 'Mulai Berkembang' },
  { value: 'SB_SEDANG', label: 'Sedang Berkembang' },
  { value: 'BSH', label: 'Berkembang Sesuai Harapan' },
  { value: 'SB', label: 'Sangat Berkembang' },
];

export function EditorPanel({
  activeModule,
  activeCustomModuleId,
  activeSemester,
  student,
  onUpdateStudent,
}: EditorPanelProps) {
  const updateIdentitas = (patch: Partial<StudentRecord['identitas']>) => {
    onUpdateStudent({
      ...student,
      identitas: { ...student.identitas, ...patch },
    });
  };

  const updateSemester = (patch: Partial<SemesterPackage>) => {
    onUpdateStudent({
      ...student,
      semesters: student.semesters.map((sem) =>
        sem.id === activeSemester.id ? { ...sem, ...patch } : sem
      ),
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateIdentitas({ fotoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  if (activeModule === 'sampul' || activeModule === 'identitas') {
    const id = student.identitas;
    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Data Identitas Peserta Didik</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perubahan langsung memperbarui Sampul dan Halaman Identitas.
          </p>
        </div>

        {/* Photo upload */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
          <div className="w-14 h-[74px] bg-red-600 border border-slate-300 overflow-hidden shrink-0">
            <img
              src={id.fotoUrl}
              alt={id.namaLengkap}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-slate-700">Pas Foto 3 x 4</div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Ganti Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <FieldInput
            label="1. Nama Lengkap Peserta Didik"
            value={id.namaLengkap}
            onChange={(v) => updateIdentitas({ namaLengkap: v })}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <FieldInput
              label="2a. Nomor Induk (NIS)"
              value={id.nis}
              onChange={(v) => updateIdentitas({ nis: v })}
              mono
            />
            <FieldInput
              label="2b. NISN"
              value={id.nisn}
              onChange={(v) => updateIdentitas({ nisn: v })}
              mono
            />
          </div>
          <FieldInput
            label="3. Tempat, Tanggal Lahir"
            value={id.tempatTanggalLahir}
            onChange={(v) => updateIdentitas({ tempatTanggalLahir: v })}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <FieldSelect
              label="4. Jenis Kelamin"
              value={id.jenisKelamin}
              options={['Perempuan', 'Laki-laki']}
              onChange={(v) => updateIdentitas({ jenisKelamin: v })}
            />
            <FieldSelect
              label="5. Agama"
              value={id.agama}
              options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']}
              onChange={(v) => updateIdentitas({ agama: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FieldInput
              label="6. Status dalam Keluarga"
              value={id.statusDalamKeluarga}
              onChange={(v) => updateIdentitas({ statusDalamKeluarga: v })}
            />
            <FieldInput
              label="7. Anak ke"
              value={id.anakKe}
              onChange={(v) => updateIdentitas({ anakKe: v })}
              mono
            />
          </div>
          <FieldInput
            label="8. Alamat Peserta Didik"
            value={id.alamatPesertaDidik}
            onChange={(v) => updateIdentitas({ alamatPesertaDidik: v })}
          />
          <FieldInput
            label="9. Nomor Telepon Rumah"
            value={id.nomorTeleponRumah}
            onChange={(v) => updateIdentitas({ nomorTeleponRumah: v })}
            mono
          />
          <FieldInput
            label="10. Sekolah Asal"
            value={id.sekolahAsal}
            onChange={(v) => updateIdentitas({ sekolahAsal: v })}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <FieldInput
              label="12a. Diterima di Kelas"
              value={id.diterimaDiKelas}
              onChange={(v) => updateIdentitas({ diterimaDiKelas: v })}
            />
            <FieldInput
              label="12b. Pada Tanggal"
              value={id.diterimaPadaTanggal}
              onChange={(v) => updateIdentitas({ diterimaPadaTanggal: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FieldInput
              label="13a. Nama Ayah"
              value={id.namaAyah}
              onChange={(v) => updateIdentitas({ namaAyah: v })}
            />
            <FieldInput
              label="13b. Nama Ibu"
              value={id.namaIbu}
              onChange={(v) => updateIdentitas({ namaIbu: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FieldInput
              label="15a. Pekerjaan Ayah"
              value={id.pekerjaanAyah}
              onChange={(v) => updateIdentitas({ pekerjaanAyah: v })}
            />
            <FieldInput
              label="15b. Pekerjaan Ibu"
              value={id.pekerjaanIbu}
              onChange={(v) => updateIdentitas({ pekerjaanIbu: v })}
            />
          </div>
          <FieldInput
            label="16. Nama Wali Siswa"
            value={id.namaWali}
            onChange={(v) => updateIdentitas({ namaWali: v })}
          />
          <FieldInput
            label="Tanggal Tanda Tangan Identitas"
            value={id.tanggalIdentitas}
            onChange={(v) => updateIdentitas({ tanggalIdentitas: v })}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'sumatif') {
    const sumatif = activeSemester.sumatif;
    const updateSumatif = (patch: Partial<SemesterPackage['sumatif']>) => {
      updateSemester({
        sumatif: { ...sumatif, ...patch },
        ...(patch.kelas ? { kelas: patch.kelas } : {}),
        ...(patch.semester ? { semesterNumber: patch.semester } : {}),
      });
    };

    const updateScore = (subjectId: string, idx: number, value: number) => {
      const subjects = sumatif.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const nextRincian = sub.rincian.map((item, i) =>
          i === idx ? { ...item, nilai: Number.isNaN(value) ? 0 : value } : item
        );
        return { ...sub, rincian: nextRincian };
      });
      updateSumatif({ subjects });
    };

    const addScoreItem = (subjectId: string) => {
      const subjects = sumatif.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const nextIdx = sub.rincian.length + 1;
        return {
          ...sub,
          rincian: [...sub.rincian, { label: `Nilai ${nextIdx}`, nilai: 80 }],
        };
      });
      updateSumatif({ subjects });
    };

    const removeScoreItem = (subjectId: string, idx: number) => {
      const subjects = sumatif.subjects.map((sub) => {
        if (sub.id !== subjectId || sub.rincian.length <= 1) return sub;
        const nextRincian = sub.rincian
          .filter((_, i) => i !== idx)
          .map((item, i) => ({ ...item, label: `Nilai ${i + 1}` }));
        return { ...sub, rincian: nextRincian };
      });
      updateSumatif({ subjects });
    };

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Editor Penilaian Sumatif ({activeSemester.label})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rerata nilai dihitung otomatis dari seluruh rincian nilai sumatif.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FieldInput
            label="Kelas"
            value={sumatif.kelas}
            onChange={(v) => updateSumatif({ kelas: v })}
          />
          <FieldInput
            label="Semester"
            value={sumatif.semester}
            onChange={(v) => updateSumatif({ semester: v })}
          />
          <FieldInput
            label="Tahun Pelajaran"
            value={activeSemester.tahunPelajaran}
            onChange={(v) => updateSemester({ tahunPelajaran: v })}
            mono
          />
          <FieldInput
            label="Fase"
            value={activeSemester.fase}
            onChange={(v) => updateSemester({ fase: v })}
          />
          <FieldInput
            label="Tanggal Cetak"
            value={sumatif.tanggalCetak}
            onChange={(v) => updateSumatif({ tanggalCetak: v })}
          />
          <SignatureModeSelect
            value={sumatif.signatureMode}
            onChange={(v) => updateSumatif({ signatureMode: v })}
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-700">Daftar Nilai Mata Pelajaran</div>
          {sumatif.subjects.map((sub, sIdx) => {
            const avg = calculateAverage(sub.rincian);
            return (
              <div
                key={sub.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-800 leading-snug">
                    {sIdx + 1}. {sub.nama}
                  </div>
                  <div className="text-xs font-mono-tabular font-semibold text-sky-700 whitespace-nowrap shrink-0">
                    Rerata: {avg.toFixed(2)}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {sub.rincian.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-14 shrink-0">{item.label}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.nilai}
                        onChange={(e) => updateScore(sub.id, i, parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeScoreItem(sub.id, i)}
                        disabled={sub.rincian.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                        title="Hapus nilai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addScoreItem(sub.id)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Nilai</span>
                </button>
              </div>
            );
          })}
        </div>

        <AttendanceEditor
          ketidakhadiran={sumatif.ketidakhadiran}
          catatan={sumatif.catatanWaliKelas}
          onChangeAttendance={(k) => updateSumatif({ ketidakhadiran: k })}
          onChangeCatatan={(c) => updateSumatif({ catatanWaliKelas: c })}
        />
      </div>
    );
  }

  if (activeModule === 'hasil_belajar') {
    const report: HasilBelajarReport = activeSemester.hasilBelajar;

    const updateReport = (patch: Partial<HasilBelajarReport>) => {
      updateSemester({
        hasilBelajar: { ...report, ...patch },
        ...(patch.kelas ? { kelas: patch.kelas } : {}),
        ...(patch.semester ? { semesterNumber: patch.semester } : {}),
      });
    };

    const updateSubject = (
      subjectId: string,
      patch: Partial<HasilBelajarReport['subjects'][number]>
    ) => {
      updateReport({
        subjects: report.subjects.map((sub) =>
          sub.id === subjectId ? { ...sub, ...patch } : sub
        ),
      });
    };

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Editor Laporan Hasil Belajar ({activeSemester.label})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur nilai akhir, capaian kompetensi, ekstrakurikuler, dan catatan wali kelas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FieldInput
            label="Label Semester"
            value={activeSemester.label}
            onChange={(v) => updateSemester({ label: v })}
          />
          <FieldInput
            label="Nomor Semester"
            value={report.semester}
            onChange={(v) => updateReport({ semester: v })}
            mono
          />
          <FieldInput
            label="Kelas"
            value={report.kelas}
            onChange={(v) => updateReport({ kelas: v })}
          />
          <FieldInput
            label="Tahun Pelajaran"
            value={activeSemester.tahunPelajaran}
            onChange={(v) => updateSemester({ tahunPelajaran: v })}
            mono
          />
          <FieldInput
            label="Fase"
            value={activeSemester.fase}
            onChange={(v) => updateSemester({ fase: v })}
          />
          <FieldInput
            label="Tanggal Cetak"
            value={report.tanggalCetak}
            onChange={(v) => updateReport({ tanggalCetak: v })}
          />
          <div className="col-span-2">
            <SignatureModeSelect
              value={report.signatureMode}
              onChange={(v) => updateReport({ signatureMode: v })}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-700">Nilai Akhir & Capaian Kompetensi</div>
          {report.subjects.map((sub, idx) => (
            <div key={sub.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold text-slate-800">
                  {idx + 1}. {sub.nama}
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={sub.nilaiAkhir}
                  onChange={(e) =>
                    updateSubject(sub.id, { nilaiAkhir: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-16 px-2 py-1 text-xs text-center font-mono-tabular font-semibold bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <textarea
                rows={3}
                value={sub.capaianKompetensi}
                onChange={(e) => updateSubject(sub.id, { capaianKompetensi: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-700">Ekstrakurikuler &amp; Kenaikan</div>
          {report.ekstrakurikuler.map((eks, idx) => (
            <div key={eks.id} className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={`Kegiatan ${idx + 1}`}
                value={eks.kegiatan}
                onChange={(e) => {
                  const next = report.ekstrakurikuler.map((item) =>
                    item.id === eks.id ? { ...item, kegiatan: e.target.value } : item
                  );
                  updateReport({ ekstrakurikuler: next });
                }}
                className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Predikat"
                value={eks.predikat}
                onChange={(e) => {
                  const next = report.ekstrakurikuler.map((item) =>
                    item.id === eks.id ? { ...item, predikat: e.target.value } : item
                  );
                  updateReport({ ekstrakurikuler: next });
                }}
                className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Keterangan"
                value={eks.keterangan}
                onChange={(e) => {
                  const next = report.ekstrakurikuler.map((item) =>
                    item.id === eks.id ? { ...item, keterangan: e.target.value } : item
                  );
                  updateReport({ ekstrakurikuler: next });
                }}
                className="px-2 py-1.5 text-xs bg-white border border-slate-300 rounded"
              />
            </div>
          ))}
          <FieldInput
            label="Keterangan Kenaikan Kelas (opsional)"
            value={report.keteranganKenaikanKelas}
            onChange={(v) => updateReport({ keteranganKenaikanKelas: v })}
          />
        </div>

        <AttendanceEditor
          ketidakhadiran={report.ketidakhadiran}
          catatan={report.catatanWaliKelas}
          onChangeAttendance={(k) => updateReport({ ketidakhadiran: k })}
          onChangeCatatan={(c) => updateReport({ catatanWaliKelas: c })}
        />
      </div>
    );
  }

  if (activeModule === 'custom' && activeCustomModuleId) {
    const customList = activeSemester.customModules ?? [];
    const mod = customList.find((m) => m.id === activeCustomModuleId);
    if (!mod) {
      return (
        <div className="text-xs text-slate-500">
          Modul kustom tidak ditemukan pada semester ini.
        </div>
      );
    }

    const updateCustomMod = (patch: Partial<CustomRaporModule>) => {
      updateSemester({
        customModules: customList.map((m) => (m.id === mod.id ? { ...m, ...patch } : m)),
      });
    };

    const addRow = () => {
      const nextIdx = mod.rows.length + 1;
      updateCustomMod({
        rows: [
          ...mod.rows,
          {
            id: `row-${Date.now()}-${nextIdx}`,
            aspek: `Komponen ${nextIdx}`,
            nilai: '85',
            keterangan: 'Menunjukkan penguasaan yang baik.',
          },
        ],
      });
    };

    const removeRow = (rowId: string) => {
      updateCustomMod({
        rows: mod.rows.filter((r) => r.id !== rowId),
      });
    };

    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Editor Modul: {mod.menuLabel}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur judul dokumen, tata letak, baris data, dan pengesahan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="col-span-2">
            <FieldInput
              label="Nama Menu Sidebar"
              value={mod.menuLabel}
              onChange={(v) => updateCustomMod({ menuLabel: v })}
            />
          </div>
          <div className="col-span-2">
            <FieldInput
              label="Judul Resmi Dokumen (A4)"
              value={mod.judulDokumen}
              onChange={(v) => updateCustomMod({ judulDokumen: v })}
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Format Halaman
            </label>
            <select
              value={mod.layout}
              onChange={(e) =>
                updateCustomMod({ layout: e.target.value as CustomModuleLayout })
              }
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="tabel">Tabel Penilaian</option>
              <option value="narasi">Surat / Narasi</option>
            </select>
          </div>
          <FieldInput
            label="Tanggal Cetak"
            value={mod.tanggalCetak}
            onChange={(v) => updateCustomMod({ tanggalCetak: v })}
          />
          <div className="col-span-2">
            <SignatureModeSelect
              value={mod.signatureMode}
              onChange={(v) => updateCustomMod({ signatureMode: v })}
            />
          </div>
        </div>

        {mod.layout === 'tabel' ? (
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-700">Header Kolom Tabel</div>
            <div className="grid grid-cols-3 gap-2">
              <FieldInput
                label="Kolom 1"
                value={mod.kolomAspek}
                onChange={(v) => updateCustomMod({ kolomAspek: v })}
              />
              <FieldInput
                label="Kolom 2"
                value={mod.kolomNilai}
                onChange={(v) => updateCustomMod({ kolomNilai: v })}
              />
              <FieldInput
                label="Kolom 3"
                value={mod.kolomKeterangan}
                onChange={(v) => updateCustomMod({ kolomKeterangan: v })}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs font-semibold text-slate-700">Baris Data</div>
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#008bb8] hover:text-[#00a0d2] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris</span>
              </button>
            </div>

            {mod.rows.map((row, idx) => (
              <div
                key={row.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Baris #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <FieldInput
                      label={mod.kolomAspek}
                      value={row.aspek}
                      onChange={(v) =>
                        updateCustomMod({
                          rows: mod.rows.map((r) => (r.id === row.id ? { ...r, aspek: v } : r)),
                        })
                      }
                    />
                  </div>
                  <FieldInput
                    label={mod.kolomNilai}
                    value={row.nilai}
                    onChange={(v) =>
                      updateCustomMod({
                        rows: mod.rows.map((r) => (r.id === row.id ? { ...r, nilai: v } : r)),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    {mod.kolomKeterangan}
                  </label>
                  <textarea
                    rows={2}
                    value={row.keterangan}
                    onChange={(e) =>
                      updateCustomMod({
                        rows: mod.rows.map((r) =>
                          r.id === row.id ? { ...r, keterangan: e.target.value } : r
                        ),
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Isi Narasi / Keterangan Resmi
            </label>
            <textarea
              rows={7}
              value={mod.narasi}
              onChange={(e) => updateCustomMod({ narasi: e.target.value })}
              className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            />
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <label className="block text-[11px] font-medium text-slate-600 mb-1">
            Catatan Tambahan (opsional)
          </label>
          <textarea
            rows={2}
            value={mod.catatan}
            onChange={(e) => updateCustomMod({ catatan: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    );
  }

  // P5 Editor
  const p5 = activeSemester.p5;
  const updateP5 = (patch: Partial<SemesterPackage['p5']>) => {
    updateSemester({ p5: { ...p5, ...patch } });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Editor Rapor Projek P5 ({activeSemester.label})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Anda juga dapat mengklik langsung kolom centang (√) pada lembar Rapor P5.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <FieldInput
          label="Kelas Header"
          value={p5.kelasP5}
          onChange={(v) => updateP5({ kelasP5: v })}
        />
        <FieldInput
          label="Kelas Footer"
          value={p5.kelasFooter}
          onChange={(v) => updateP5({ kelasFooter: v })}
        />
        <FieldInput
          label="Tahun Pelajaran"
          value={p5.tahunPelajaran}
          onChange={(v) => updateP5({ tahunPelajaran: v })}
          mono
        />
        <FieldInput
          label="Tanggal Cetak"
          value={p5.tanggalCetak}
          onChange={(v) => updateP5({ tanggalCetak: v })}
        />
        <div className="col-span-2">
          <SignatureModeSelect
            value={p5.signatureMode}
            onChange={(v) => updateP5({ signatureMode: v })}
          />
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-200">
        {p5.projects.map((proj) => (
          <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <div className="text-xs font-bold text-slate-900">Projek {proj.nomor}</div>
            <FieldInput
              label="Judul Projek"
              value={proj.judul}
              onChange={(v) =>
                updateP5({
                  projects: p5.projects.map((p) => (p.id === proj.id ? { ...p, judul: v } : p)),
                })
              }
            />
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Deskripsi Projek (Halaman 1)
              </label>
              <textarea
                rows={4}
                value={proj.deskripsiRingkas}
                onChange={(e) =>
                  updateP5({
                    projects: p5.projects.map((p) =>
                      p.id === proj.id ? { ...p, deskripsiRingkas: e.target.value } : p
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-medium text-slate-600">Capaian Dimensi</div>
              {proj.indikator.map((ind) => (
                <div key={ind.id} className="p-2 bg-white border border-slate-200 rounded space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-700">{ind.dimensi}</div>
                  <select
                    value={ind.level ?? ''}
                    onChange={(e) => {
                      const val = (e.target.value || null) as P5Level | null;
                      updateP5({
                        projects: p5.projects.map((p) =>
                          p.id !== proj.id
                            ? p
                            : {
                                ...p,
                                indikator: p.indikator.map((item) =>
                                  item.id === ind.id ? { ...item, level: val } : item
                                ),
                              }
                        ),
                      });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">-- Belum Dinilai --</option>
                    {P5_LEVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Catatan Proses
              </label>
              <textarea
                rows={3}
                value={proj.catatanProses}
                onChange={(e) =>
                  updateP5({
                    projects: p5.projects.map((p) =>
                      p.id === proj.id ? { ...p, catatanProses: e.target.value } : p
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          mono ? 'font-mono-tabular' : ''
        }`}
      />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SignatureModeSelect({
  value,
  onChange,
}: {
  value: SignatureMode;
  onChange: (val: SignatureMode) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-600 mb-1">
        Pengesahan Tanda Tangan
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SignatureMode)}
        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <option value="qr">QR Code Digital</option>
        <option value="stamp">Tanda Tangan + Stempel Basah</option>
      </select>
    </div>
  );
}

function AttendanceEditor({
  ketidakhadiran,
  catatan,
  onChangeAttendance,
  onChangeCatatan,
}: {
  ketidakhadiran: { sakit: number; izin: number; tanpaKeterangan: number };
  catatan: string;
  onChangeAttendance: (k: { sakit: number; izin: number; tanpaKeterangan: number }) => void;
  onChangeCatatan: (c: string) => void;
}) {
  return (
    <div className="space-y-3 pt-2 border-t border-slate-200">
      <div className="text-xs font-semibold text-slate-700">Ketidakhadiran & Catatan</div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[11px] text-slate-600 mb-1">Sakit (hari)</label>
          <input
            type="number"
            min="0"
            value={ketidakhadiran.sakit}
            onChange={(e) =>
              onChangeAttendance({
                ...ketidakhadiran,
                sakit: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full px-2 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-600 mb-1">Izin (hari)</label>
          <input
            type="number"
            min="0"
            value={ketidakhadiran.izin}
            onChange={(e) =>
              onChangeAttendance({
                ...ketidakhadiran,
                izin: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full px-2 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-600 mb-1">Alpa (hari)</label>
          <input
            type="number"
            min="0"
            value={ketidakhadiran.tanpaKeterangan}
            onChange={(e) =>
              onChangeAttendance({
                ...ketidakhadiran,
                tanpaKeterangan: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full px-2 py-1.5 text-xs font-mono-tabular bg-white border border-slate-300 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-medium text-slate-600 mb-1">
          Catatan Wali Kelas
        </label>
        <textarea
          rows={2}
          value={catatan}
          onChange={(e) => onChangeCatatan(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}
