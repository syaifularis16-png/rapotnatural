import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CustomModuleLayout, SchoolProfile } from '../types/rapor';

export function AddStudentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (nama: string, nis: string, nisn: string, kelas: string) => void;
}) {
  const [nama, setNama] = useState('');
  const [nis, setNis] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState('X-7');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onCreate(nama, nis, nisn, kelas);
    setNama('');
    setNis('');
    setNisn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 no-print">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Tambah Peserta Didik Baru</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Lengkap Peserta Didik
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: AHMAD FAUZAN HIDAYAT"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">NIS</label>
              <input
                type="text"
                placeholder="13155"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">NISN</label>
              <input
                type="text"
                placeholder="0098000001"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kelas</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-800 cursor-pointer"
            >
              Simpan Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SchoolSettingsModal({
  open,
  school,
  onClose,
  onSave,
}: {
  open: boolean;
  school: SchoolProfile;
  onClose: () => void;
  onSave: (updated: SchoolProfile) => void;
}) {
  const [form, setForm] = useState<SchoolProfile>(school);

  useEffect(() => {
    if (open) {
      setForm(school);
    }
  }, [open, school]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 no-print">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Pengaturan Sekolah & Pejabat</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={form.namaSekolah}
                onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Sekolah</label>
              <input
                type="text"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kota / Kab.</label>
              <input
                type="text"
                value={form.kota}
                onChange={(e) => setForm({ ...form, kota: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tahun Pelajaran
              </label>
              <input
                type="text"
                value={form.tahunPelajaran}
                onChange={(e) => setForm({ ...form, tahunPelajaran: e.target.value })}
                className="w-full px-3 py-1.5 text-sm font-mono-tabular border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kepala Sekolah</label>
              <input
                type="text"
                value={form.kepalaSekolah}
                onChange={(e) => setForm({ ...form, kepalaSekolah: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={form.nipKepalaSekolah}
                onChange={(e) => setForm({ ...form, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-1.5 text-sm font-mono-tabular border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Wali Kelas</label>
              <input
                type="text"
                value={form.waliKelas}
                onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">NIP Wali Kelas</label>
              <input
                type="text"
                value={form.nipWaliKelas}
                onChange={(e) => setForm({ ...form, nipWaliKelas: e.target.value })}
                className="w-full px-3 py-1.5 text-sm font-mono-tabular border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-sky-700 rounded-lg hover:bg-sky-800 cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddSemesterModal({
  open,
  existingCount,
  defaultKelas,
  defaultTahun,
  defaultFase,
  onClose,
  onCreate,
}: {
  open: boolean;
  existingCount: number;
  defaultKelas: string;
  defaultTahun: string;
  defaultFase: string;
  onClose: () => void;
  onCreate: (payload: {
    semesterNumber: string;
    label: string;
    tahunPelajaran: string;
    kelas: string;
    fase: string;
    tanggalCetak: string;
    copyScores: boolean;
  }) => void;
}) {
  const nextNum = String(existingCount + 1);
  const [semesterNumber, setSemesterNumber] = useState(nextNum);
  const [label, setLabel] = useState(`Semester ${nextNum}`);
  const [tahunPelajaran, setTahunPelajaran] = useState(defaultTahun);
  const [kelas, setKelas] = useState(defaultKelas);
  const [fase, setFase] = useState(defaultFase);
  const [tanggalCetak, setTanggalCetak] = useState('19 Desember 2025');
  const [copyScores, setCopyScores] = useState(false);

  useEffect(() => {
    if (open) {
      const n = String(existingCount + 1);
      setSemesterNumber(n);
      setLabel(`Semester ${n}`);
      setTahunPelajaran(defaultTahun);
      setKelas(defaultKelas);
      setFase(defaultFase);
    }
  }, [open, existingCount, defaultTahun, defaultKelas, defaultFase]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      semesterNumber,
      label,
      tahunPelajaran,
      kelas,
      fase,
      tanggalCetak,
      copyScores,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 no-print">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Tambah Semester Baru</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor Semester
              </label>
              <input
                type="text"
                required
                value={semesterNumber}
                onChange={(e) => {
                  setSemesterNumber(e.target.value);
                  setLabel(`Semester ${e.target.value}`);
                }}
                className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Label Menu
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tahun Pelajaran
              </label>
              <input
                type="text"
                required
                placeholder="2025/2026"
                value={tahunPelajaran}
                onChange={(e) => setTahunPelajaran(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fase</label>
              <select
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              >
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                required
                placeholder="XI-1"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Cetak
              </label>
              <input
                type="text"
                required
                value={tanggalCetak}
                onChange={(e) => setTanggalCetak(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={copyScores}
              onChange={(e) => setCopyScores(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#00a0d2] focus:ring-[#00a0d2]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Salin nilai dan capaian dari semester terakhir (jika tidak dicentang, daftar mapel tetap disalin dengan nilai awal 80).
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00a0d2] rounded-lg hover:bg-[#008bb8] cursor-pointer"
            >
              Buat Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddModuleModal({
  open,
  defaultTanggalCetak,
  onClose,
  onCreate,
}: {
  open: boolean;
  defaultTanggalCetak: string;
  onClose: () => void;
  onCreate: (payload: {
    menuLabel: string;
    judulDokumen: string;
    layout: CustomModuleLayout;
    preset: 'blank' | 'prestasi' | 'tahfidz' | 'konseling';
    tanggalCetak: string;
    applyToAllSemesters: boolean;
  }) => void;
}) {
  const [preset, setPreset] = useState<'blank' | 'prestasi' | 'tahfidz' | 'konseling'>('prestasi');
  const [menuLabel, setMenuLabel] = useState('Catatan Prestasi');
  const [judulDokumen, setJudulDokumen] = useState('LAPORAN PRESTASI PESERTA DIDIK');
  const [layout, setLayout] = useState<CustomModuleLayout>('tabel');
  const [tanggalCetak, setTanggalCetak] = useState(defaultTanggalCetak);
  const [applyToAllSemesters, setApplyToAllSemesters] = useState(true);

  useEffect(() => {
    if (open) {
      setTanggalCetak(defaultTanggalCetak);
    }
  }, [open, defaultTanggalCetak]);

  if (!open) return null;

  const handlePresetChange = (next: 'blank' | 'prestasi' | 'tahfidz' | 'konseling') => {
    setPreset(next);
    if (next === 'prestasi') {
      setMenuLabel('Catatan Prestasi');
      setJudulDokumen('LAPORAN PRESTASI PESERTA DIDIK');
      setLayout('tabel');
    } else if (next === 'tahfidz') {
      setMenuLabel('Rapor Tahfidz');
      setJudulDokumen('LAPORAN CAPAIAN TAHFIDZ & KEAGAMAAN');
      setLayout('tabel');
    } else if (next === 'konseling') {
      setMenuLabel('Catatan BK');
      setJudulDokumen('LAPORAN BIMBINGAN DAN KONSELING');
      setLayout('narasi');
    } else {
      setMenuLabel('Modul Tambahan');
      setJudulDokumen('LAPORAN PENILAIAN TAMBAHAN');
      setLayout('tabel');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuLabel.trim()) return;
    onCreate({
      menuLabel,
      judulDokumen,
      layout,
      preset,
      tanggalCetak,
      applyToAllSemesters,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 no-print">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Tambah Modul Rapor Baru</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Template Awal Modul
            </label>
            <select
              value={preset}
              onChange={(e) =>
                handlePresetChange(
                  e.target.value as 'blank' | 'prestasi' | 'tahfidz' | 'konseling'
                )
              }
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
            >
              <option value="prestasi">Laporan Prestasi &amp; Lomba</option>
              <option value="tahfidz">Rapor Tahfidz &amp; Keagamaan</option>
              <option value="konseling">Catatan Bimbingan Konseling (Narasi)</option>
              <option value="blank">Modul Kosong / Kustom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Menu Sidebar
            </label>
            <input
              type="text"
              required
              value={menuLabel}
              onChange={(e) => setMenuLabel(e.target.value)}
              placeholder="Contoh: Catatan Prestasi"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Judul Resmi Dokumen (A4)
            </label>
            <input
              type="text"
              required
              value={judulDokumen}
              onChange={(e) => setJudulDokumen(e.target.value)}
              placeholder="LAPORAN PRESTASI PESERTA DIDIK"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Format Halaman
              </label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as CustomModuleLayout)}
                className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              >
                <option value="tabel">Tabel Penilaian</option>
                <option value="narasi">Surat / Narasi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Cetak
              </label>
              <input
                type="text"
                required
                value={tanggalCetak}
                onChange={(e) => setTanggalCetak(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a0d2]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={applyToAllSemesters}
              onChange={(e) => setApplyToAllSemesters(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#00a0d2] focus:ring-[#00a0d2]"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Tambahkan modul ini ke seluruh semester milik peserta didik aktif.
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00a0d2] rounded-lg hover:bg-[#008bb8] cursor-pointer"
            >
              Tambah Modul
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


