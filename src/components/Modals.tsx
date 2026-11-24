import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SchoolProfile } from '../types/rapor';

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
