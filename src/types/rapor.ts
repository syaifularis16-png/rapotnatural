export type RaporModule = 'sampul' | 'identitas' | 'sumatif' | 'hasil_belajar' | 'p5' | 'scan_jpg';

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
  semester: string;
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

export type CustomModuleLayout = 'tabel' | 'narasi' | 'adaptif';

export interface CustomModuleRow {
  id: string;
  aspek: string;
  nilai: string;
  keterangan: string;
}

export interface DynamicDocumentTable {
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface DynamicDocumentSection {
  heading?: string;
  body: string;
}

export interface DynamicMetaPair {
  label: string;
  value: string;
}

export interface DynamicDocumentSpec {
  menuLabel: string;
  judulDokumen: string;
  subJudul?: string;
  instansiHeader?: string;
  formatStyle: 'tabel' | 'narasi' | 'campuran' | 'identitas_grid';
  includeStudentHeader: boolean;
  metaPairs: DynamicMetaPair[];
  sections?: DynamicDocumentSection[];
  tables?: DynamicDocumentTable[];
  catatan?: string;
  tanggalCetak?: string;
  signerLeftTitle?: string;
  signerLeftName?: string;
  signerRightTitle?: string;
  signerRightName?: string;
  signerRightNip?: string;
}

export interface CustomRaporModule {
  id: string;
  menuLabel: string;
  judulDokumen: string;
  layout: CustomModuleLayout;
  kolomAspek: string;
  kolomNilai: string;
  kolomKeterangan: string;
  rows: CustomModuleRow[];
  narasi: string;
  catatan: string;
  tanggalCetak: string;
  signatureMode: SignatureMode;
  adaptiveDoc?: DynamicDocumentSpec;
  sourceScanPageId?: string;
}

export interface SemesterPackage {
  id: string;
  label: string;
  semesterNumber: string;
  tahunPelajaran: string;
  kelas: string;
  fase: string;
  sumatif: SumatifReport;
  hasilBelajar: HasilBelajarReport;
  p5: P5Report;
  customModules?: CustomRaporModule[];
}

export interface ParsedScanResult {
  detectedType: 'Sampul' | 'Identitas' | 'Sumatif' | 'Hasil Belajar' | 'Rapor P5' | 'Lainnya';
  confidenceSummary: string;
  school?: Partial<SchoolProfile>;
  identitas?: Partial<StudentIdentity>;
  semesterMeta?: {
    semester?: string;
    kelas?: string;
    fase?: string;
    tahunPelajaran?: string;
    tanggalCetak?: string;
  };
  sumatifSubjects?: {
    nama: string;
    rincian: { label: string; nilai: number }[];
  }[];
  hasilBelajarSubjects?: {
    nama: string;
    nilaiAkhir: number;
    capaianKompetensi: string;
  }[];
  ekstrakurikuler?: {
    kegiatan: string;
    predikat: string;
    keterangan: string;
  }[];
  ketidakhadiran?: Partial<AttendanceRecord>;
  catatanWaliKelas?: string;
  keteranganKenaikanKelas?: string;
  p5Projects?: {
    nomor?: number;
    judul: string;
    deskripsiRingkas?: string;
    catatanProses?: string;
    indikator?: {
      dimensi: string;
      deskripsi: string;
      level: P5Level | null;
    }[];
  }[];
  dynamicDocument?: DynamicDocumentSpec;
}

export interface JpgScanPage {
  id: string;
  title: string;
  category: 'Sampul' | 'Identitas' | 'Sumatif' | 'Hasil Belajar' | 'Rapor P5' | 'Lainnya';
  imageUrl: string;
  scanStatus?: 'idle' | 'scanning' | 'done' | 'error';
  scanError?: string;
  parsedData?: ParsedScanResult;
}

export interface StudentRecord {
  id: string;
  identitas: StudentIdentity;
  semesters: SemesterPackage[];
  scanPages?: JpgScanPage[];
}
