export type RaporModule = 'sampul' | 'identitas' | 'sumatif' | 'hasil_belajar' | 'p5';

export type SignatureMode = 'qr' | 'stamp';

export type P5Level = 'MB' | 'SB_SEDANG' | 'BSH' | 'SB';

export interface SchoolProfile {
  namaSekolah: string;
  alamat: string;
  kota: string;
  provinsi: string;
  tahunPelajaran: string;
  fase: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  waliKelas: string;
  nipWaliKelas: string;
}

export interface StudentIdentity {
  namaLengkap: string;
  nis: string;
  nisn: string;
  tempatTanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  statusDalamKeluarga: string;
  anakKe: string;
  alamatPesertaDidik: string;
  nomorTeleponRumah: string;
  sekolahAsal: string;
  diterimaDiSekolahIni: string;
  diterimaDiKelas: string;
  diterimaPadaTanggal: string;
  namaAyah: string;
  namaIbu: string;
  alamatOrangTua: string;
  teleponOrangTua: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  namaWali: string;
  alamatWali: string;
  teleponWali: string;
  pekerjaanWali: string;
  fotoUrl: string;
  tanggalIdentitas: string;
}

export interface SumatifScoreItem {
  label: string;
  nilai: number;
}

export interface SumatifSubject {
  id: string;
  nama: string;
  rincian: SumatifScoreItem[];
}

export interface AttendanceRecord {
  sakit: number;
  izin: number;
  tanpaKeterangan: number;
}

export interface SumatifReport {
  semester: string;
  kelas: string;
  tanggalCetak: string;
  signatureMode: SignatureMode;
  subjects: SumatifSubject[];
  ketidakhadiran: AttendanceRecord;
  catatanWaliKelas: string;
}

export interface HasilBelajarSubject {
  id: string;
  nama: string;
  nilaiAkhir: number;
  capaianKompetensi: string;
}

export interface EkstrakurikulerItem {
  id: string;
  kegiatan: string;
  predikat: string;
  keterangan: string;
}

export interface HasilBelajarReport {
  semester: '1' | '2';
  kelas: string;
  tanggalCetak: string;
  signatureMode: SignatureMode;
  subjects: HasilBelajarSubject[];
  ekstrakurikuler: EkstrakurikulerItem[];
  ketidakhadiran: AttendanceRecord;
  catatanWaliKelas: string;
  keteranganKenaikanKelas: string;
}

export interface P5Indicator {
  id: string;
  dimensi: string;
  deskripsi: string;
  marker?: 'bullet' | 'asterisk';
  level: P5Level | null;
}

export interface P5Project {
  id: string;
  nomor: number;
  judul: string;
  judulUpper?: boolean;
  deskripsiRingkas: string;
  indikator: P5Indicator[];
  catatanProses: string;
}

export interface P5Report {
  kelasP5: string;
  kelasFooter: string;
  fase: string;
  tahunPelajaran: string;
  tanggalCetak: string;
  signatureMode: SignatureMode;
  projects: P5Project[];
}

export interface StudentRecord {
  id: string;
  identitas: StudentIdentity;
  sumatif: SumatifReport;
  hasilBelajarSem1: HasilBelajarReport;
  hasilBelajarSem2: HasilBelajarReport;
  p5: P5Report;
}
