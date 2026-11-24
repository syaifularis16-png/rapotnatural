import { createBlankStudent } from '../data/defaultData';
import {
  CustomRaporModule,
  DynamicDocumentSpec,
  DynamicDocumentTable,
  ParsedScanResult,
  RaporModule,
  SchoolProfile,
  StudentIdentity,
  StudentRecord,
} from '../types/rapor';

async function optimizeImageDataUrl(dataUrl: string): Promise<{ base64: string; mimeType: string }> {
  const [header, rawData] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+);/);
  const origMime = mimeMatch?.[1] || 'image/jpeg';
  const origBase64 = rawData || '';

  // Only compress if larger than ~1.5 MB base64 or non-JPEG/PNG
  if (origBase64.length < 2_000_000 || typeof document === 'undefined') {
    return { base64: origBase64, mimeType: origMime };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ base64: origBase64, mimeType: origMime });
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.88);
        const [, nextData] = compressed.split(',');
        resolve({ base64: nextData || origBase64, mimeType: 'image/jpeg' });
      } catch {
        resolve({ base64: origBase64, mimeType: origMime });
      }
    };
    img.onerror = () => resolve({ base64: origBase64, mimeType: origMime });
    img.src = dataUrl;
  });
}

export async function imageUrlToBase64(
  imageUrl: string
): Promise<{ base64: string; mimeType: string }> {
  if (imageUrl.startsWith('data:')) {
    return optimizeImageDataUrl(imageUrl);
  }

  const resp = await fetch(imageUrl);
  if (!resp.ok) {
    throw new Error(`Gagal memuat gambar (${resp.status})`);
  }
  const blob = await resp.blob();

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Gagal mengonversi gambar ke base64.'));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca data gambar.'));
    reader.readAsDataURL(blob);
  });

  return optimizeImageDataUrl(dataUrl);
}

export async function parseScanImageViaApi(
  imageUrl: string,
  fileName?: string
): Promise<ParsedScanResult> {
  const { base64, mimeType } = await imageUrlToBase64(imageUrl);
  const response = await fetch('/api/scan/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: base64,
      mimeType,
      fileName,
    }),
  });

  const rawText = await response.text();
  let payload: { parsed?: ParsedScanResult; error?: string } = {};

  try {
    payload = JSON.parse(rawText) as { parsed?: ParsedScanResult; error?: string };
  } catch {
    if (response.status === 200 && /<html/i.test(rawText)) {
      throw new Error(
        'Server API OCR tidak merespons JSON (kemungkinan server sedang memulai ulang atau pratinjau statis). Muat ulang halaman lalu coba lagi.'
      );
    }
    throw new Error(
      `Respons server tidak valid (HTTP ${response.status}). Silakan coba lagi.`
    );
  }

  if (!response.ok || !payload.parsed) {
    throw new Error(
      payload.error || `Gagal membaca dokumen scan (HTTP ${response.status}).`
    );
  }

  return payload.parsed;
}

function cleanPartialStringObj<T extends object>(
  source: Partial<T> | undefined
): Partial<T> {
  if (!source) return {};
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(source)) {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed !== '' && trimmed !== '-' && trimmed !== 'null' && trimmed !== 'undefined') {
        result[key] = trimmed;
      }
    } else if (val !== undefined && val !== null) {
      result[key] = val;
    }
  }
  return result as Partial<T>;
}

export function getTargetModuleForScan(
  detectedType: ParsedScanResult['detectedType']
): RaporModule {
  switch (detectedType) {
    case 'Sampul':
      return 'sampul';
    case 'Identitas':
      return 'identitas';
    case 'Sumatif':
      return 'sumatif';
    case 'Hasil Belajar':
      return 'hasil_belajar';
    case 'Rapor P5':
      return 'p5';
    default:
      return 'identitas';
  }
}

const IDENTITY_FIELD_LABELS: Record<string, string> = {
  namaLengkap: 'Nama Lengkap Peserta Didik',
  nis: 'Nomor Induk (NIS)',
  nisn: 'NISN',
  tempatTanggalLahir: 'Tempat, Tanggal Lahir',
  jenisKelamin: 'Jenis Kelamin',
  agama: 'Agama',
  statusDalamKeluarga: 'Status dalam Keluarga',
  anakKe: 'Anak ke',
  alamatPesertaDidik: 'Alamat Peserta Didik',
  nomorTeleponRumah: 'Nomor Telepon Rumah',
  sekolahAsal: 'Sekolah Asal',
  diterimaDiSekolahIni: 'Diterima di Sekolah Ini',
  diterimaDiKelas: 'Diterima di Kelas',
  diterimaPadaTanggal: 'Diterima pada Tanggal',
  namaAyah: 'Nama Ayah',
  namaIbu: 'Nama Ibu',
  alamatOrangTua: 'Alamat Orang Tua',
  teleponOrangTua: 'Telepon Orang Tua',
  pekerjaanAyah: 'Pekerjaan Ayah',
  pekerjaanIbu: 'Pekerjaan Ibu',
  namaWali: 'Nama Wali',
  alamatWali: 'Alamat Wali',
  teleponWali: 'Telepon Wali',
  pekerjaanWali: 'Pekerjaan Wali',
  tanggalIdentitas: 'Tanggal Pengesahan',
};

export function isTableGroupHeaderRow(cells: string[]): boolean {
  const nonEmpty = cells
    .map((c, idx) => ({ idx, val: (c ?? '').trim() }))
    .filter((item) => item.val !== '');
  if (nonEmpty.length !== 1) return false;
  const text = nonEmpty[0].val;
  if (nonEmpty[0].idx <= 1 && (/^[A-Z]\.\s+/.test(text) || /^kelompok\b/i.test(text))) {
    return true;
  }
  return false;
}

export function getGroupHeaderText(cells: string[]): string {
  return cells.map((c) => (c ?? '').trim()).find((c) => c !== '') ?? '';
}

export function tableToTsv(table: DynamicDocumentTable): string {
  const header = table.columns.join('\t');
  const body = table.rows
    .map((row) =>
      table.columns
        .map((_, idx) => String(row[idx] ?? '').replace(/[\r\n\t]+/g, ' ').trim())
        .join('\t')
    )
    .join('\n');
  return body ? `${header}\n${body}` : header;
}

export function downloadTableCsv(table: DynamicDocumentTable, baseName = 'hasil-ocr') {
  const escapeCsv = (val: string) => {
    const clean = String(val ?? '').replace(/\r?\n/g, ' ');
    if (/[",;]/.test(clean)) {
      return `"${clean.replace(/"/g, '""')}"`;
    }
    return clean;
  };
  const lines = [
    table.columns.map(escapeCsv).join(','),
    ...table.rows.map((row) =>
      table.columns.map((_, idx) => escapeCsv(row[idx] ?? '')).join(',')
    ),
  ];
  const csvContent = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = (table.title || baseName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '');
  a.href = url;
  a.download = `${slug || 'tabel-ocr'}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function getOutputTablesFromParsedScan(
  parsed: ParsedScanResult
): DynamicDocumentTable[] {
  const rawTables: DynamicDocumentTable[] = (parsed.dynamicDocument?.tables ?? [])
    .filter((t) => t && Array.isArray(t.columns) && t.columns.length > 0)
    .map((t) => {
      const cols = t.columns.map((c) => String(c ?? '').trim()).filter(Boolean);
      const rows = (t.rows ?? []).map((row) => {
        const arr = Array.isArray(row) ? row : [];
        return cols.map((_, idx) => String(arr[idx] ?? '').trim());
      });
      return {
        title: t.title?.trim() || undefined,
        columns: cols,
        rows,
      };
    })
    .filter((t) => t.columns.length > 0);

  const tables: DynamicDocumentTable[] = [...rawTables];

  const hasTableMatching = (keyword: RegExp) =>
    tables.some(
      (t) =>
        keyword.test(t.title ?? '') ||
        t.columns.some((c) => keyword.test(c)) ||
        t.rows.some((r) => keyword.test(r[0] ?? ''))
    );

  // Synthesize main table if OCR didn't populate dynamicDocument.tables
  if (tables.length === 0) {
    if (parsed.sumatifSubjects && parsed.sumatifSubjects.length > 0) {
      tables.push({
        title: 'Tabel Nilai Sumatif',
        columns: ['No', 'Mata Pelajaran', 'Rerata Nilai', 'Rincian Nilai Sumatif'],
        rows: parsed.sumatifSubjects.map((sub, i) => {
          const vals = sub.rincian.map((r) => r.nilai);
          const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
          return [
            String(i + 1),
            sub.nama,
            avg.toFixed(2),
            sub.rincian
              .map((r, rIdx) => `${r.label || `Nilai ${rIdx + 1}`}: ${r.nilai}`)
              .join(', '),
          ];
        }),
      });
    } else if (parsed.hasilBelajarSubjects && parsed.hasilBelajarSubjects.length > 0) {
      tables.push({
        title: 'Tabel Hasil Belajar',
        columns: ['No', 'Mata Pelajaran', 'Nilai Akhir', 'Capaian Kompetensi'],
        rows: parsed.hasilBelajarSubjects.map((sub, i) => [
          String(i + 1),
          sub.nama,
          String(sub.nilaiAkhir),
          sub.capaianKompetensi,
        ]),
      });
    } else if (parsed.p5Projects && parsed.p5Projects.length > 0) {
      tables.push({
        title: 'Tabel Capaian Projek P5',
        columns: ['Projek', 'Dimensi', 'Deskripsi Capaian', 'Predikat'],
        rows: parsed.p5Projects.flatMap((proj) =>
          (proj.indikator ?? []).map((ind) => [
            proj.judul,
            ind.dimensi,
            ind.deskripsi,
            ind.level ?? '-',
          ])
        ),
      });
    }
  }

  // Ensure Ekstrakurikuler table is present if extracted separately
  if (
    parsed.ekstrakurikuler &&
    parsed.ekstrakurikuler.length > 0 &&
    !hasTableMatching(/ekstrakurikuler|kegiatan/i)
  ) {
    tables.push({
      title: 'Ekstrakurikuler',
      columns: ['No', 'Kegiatan Ekstrakurikuler', 'Predikat', 'Keterangan'],
      rows: parsed.ekstrakurikuler.map((eks, idx) => [
        String(idx + 1),
        eks.kegiatan || '-',
        eks.predikat || '-',
        eks.keterangan || '-',
      ]),
    });
  }

  // Ensure Ketidakhadiran table is present if extracted separately
  if (parsed.ketidakhadiran && !hasTableMatching(/ketidakhadiran|sakit|tanpa keterangan/i)) {
    const k = parsed.ketidakhadiran;
    if (
      k.sakit !== undefined ||
      k.izin !== undefined ||
      k.tanpaKeterangan !== undefined
    ) {
      tables.push({
        title: 'Ketidakhadiran',
        columns: ['Ketidakhadiran', 'Jumlah'],
        rows: [
          ['Sakit', `${k.sakit ?? 0} hari`],
          ['Izin', `${k.izin ?? 0} hari`],
          ['Tanpa Keterangan', `${k.tanpaKeterangan ?? 0} hari`],
        ],
      });
    }
  }

  // Fallback for Identity / Metadata-only documents so OCR always yields a structured output table
  if (tables.length === 0) {
    const idEntries = Object.entries(parsed.identitas ?? {}).filter(
      ([, v]) => typeof v === 'string' && v.trim() !== '' && v.trim() !== '-'
    );
    if (idEntries.length > 0) {
      tables.push({
        title: 'Tabel Data Identitas Peserta Didik',
        columns: ['No', 'Uraian Data', 'Isi'],
        rows: idEntries.map(([key, val], idx) => [
          String(idx + 1),
          IDENTITY_FIELD_LABELS[key] || key,
          String(val).trim(),
        ]),
      });
    } else if (
      parsed.dynamicDocument?.metaPairs &&
      parsed.dynamicDocument.metaPairs.length > 0
    ) {
      tables.push({
        title: 'Tabel Informasi Dokumen',
        columns: ['No', 'Komponen', 'Keterangan'],
        rows: parsed.dynamicDocument.metaPairs.map((pair, idx) => [
          String(idx + 1),
          pair.label,
          pair.value,
        ]),
      });
    }
  }

  return tables;
}

export function synthesizeDynamicDocument(
  parsed: ParsedScanResult,
  fallbackTitle?: string
): DynamicDocumentSpec {
  const raw = parsed.dynamicDocument;
  const normalizedTables = getOutputTablesFromParsedScan(parsed);

  const cleanMetaPairs = (raw?.metaPairs ?? [])
    .filter((m) => m && (m.label?.trim() || m.value?.trim()))
    .map((m) => ({ label: m.label.trim(), value: m.value.trim() }));

  const cleanSections = (raw?.sections ?? [])
    .filter((s) => s && s.body?.trim())
    .map((s) => ({
      heading: s.heading?.trim() || undefined,
      body: s.body.trim(),
    }));

  const defaultMenu =
    raw?.menuLabel?.trim() ||
    fallbackTitle?.trim() ||
    (parsed.detectedType === 'Lainnya' ? 'Dokumen Scan OCR' : `Scan ${parsed.detectedType}`);

  const defaultJudul =
    raw?.judulDokumen?.trim() ||
    fallbackTitle?.trim().toUpperCase() ||
    `LAPORAN ${parsed.detectedType.toUpperCase()}`;

  return {
    menuLabel: defaultMenu.slice(0, 34),
    judulDokumen: defaultJudul,
    subJudul: raw?.subJudul?.trim() || undefined,
    instansiHeader: raw?.instansiHeader?.trim() || undefined,
    formatStyle:
      raw?.formatStyle ||
      (normalizedTables.length > 0
        ? cleanSections.length > 0
          ? 'campuran'
          : 'tabel'
        : cleanMetaPairs.length > 3
          ? 'identitas_grid'
          : 'narasi'),
    includeStudentHeader: raw?.includeStudentHeader ?? true,
    metaPairs: cleanMetaPairs,
    sections: cleanSections,
    tables: normalizedTables,
    catatan: raw?.catatan?.trim() || parsed.catatanWaliKelas?.trim() || undefined,
    tanggalCetak:
      raw?.tanggalCetak?.trim() || parsed.semesterMeta?.tanggalCetak?.trim() || undefined,
    signerLeftTitle: raw?.signerLeftTitle?.trim() || undefined,
    signerLeftName: raw?.signerLeftName?.trim() || undefined,
    signerRightTitle: raw?.signerRightTitle?.trim() || undefined,
    signerRightName: raw?.signerRightName?.trim() || undefined,
    signerRightNip: raw?.signerRightNip?.trim() || undefined,
  };
}

export function createCustomModuleFromParsedScan(
  parsed: ParsedScanResult,
  defaultTanggalCetak: string,
  sourcePage?: { id: string; title: string },
  existingModuleId?: string
): CustomRaporModule {
  const dyn = synthesizeDynamicDocument(parsed, sourcePage?.title);
  const id =
    existingModuleId ||
    `mod-ocr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const firstTable = dyn.tables?.[0];
  const fallbackRows = (firstTable?.rows ?? []).map((cells, idx) => ({
    id: `${id}-r-${idx}`,
    aspek: cells[1] ?? cells[0] ?? `Baris ${idx + 1}`,
    nilai: cells[2] ?? cells[cells.length - 1] ?? '-',
    keterangan: cells.slice(3).join(' · ') || cells[0] || '',
  }));

  const fallbackNarasi =
    (dyn.sections ?? [])
      .map((s) => (s.heading ? `${s.heading}\n${s.body}` : s.body))
      .join('\n\n') || parsed.confidenceSummary;

  return {
    id,
    menuLabel: dyn.menuLabel,
    judulDokumen: dyn.judulDokumen,
    layout: 'adaptif',
    kolomAspek: firstTable?.columns?.[1] || firstTable?.columns?.[0] || 'Komponen',
    kolomNilai: firstTable?.columns?.[2] || 'Nilai',
    kolomKeterangan: firstTable?.columns?.[3] || 'Keterangan',
    rows: fallbackRows,
    narasi: fallbackNarasi,
    catatan: dyn.catatan || '',
    tanggalCetak: dyn.tanggalCetak || defaultTanggalCetak,
    signatureMode: 'qr',
    adaptiveDoc: dyn,
    sourceScanPageId: sourcePage?.id,
  };
}

export function upsertCustomModuleInStudent(
  student: StudentRecord,
  semesterId: string,
  parsed: ParsedScanResult,
  sourcePage?: { id: string; title: string }
): {
  updatedStudent: StudentRecord;
  createdModule: CustomRaporModule;
} {
  let createdOrUpdated: CustomRaporModule | null = null;

  const updatedSemesters = student.semesters.map((sem) => {
    if (sem.id !== semesterId) return sem;
    const existingList = sem.customModules ?? [];
    const existingMatch = sourcePage?.id
      ? existingList.find((m) => m.sourceScanPageId === sourcePage.id)
      : undefined;

    const moduleObj = createCustomModuleFromParsedScan(
      parsed,
      sem.hasilBelajar.tanggalCetak,
      sourcePage,
      existingMatch?.id
    );
    createdOrUpdated = moduleObj;

    const nextList = existingMatch
      ? existingList.map((m) => (m.id === existingMatch.id ? moduleObj : m))
      : [...existingList, moduleObj];

    return {
      ...sem,
      customModules: nextList,
    };
  });

  if (!createdOrUpdated) {
    createdOrUpdated = createCustomModuleFromParsedScan(
      parsed,
      student.semesters[0]?.hasilBelajar.tanggalCetak || '20 Desember 2024',
      sourcePage
    );
  }

  return {
    updatedStudent: {
      ...student,
      semesters: updatedSemesters,
    },
    createdModule: createdOrUpdated,
  };
}

export function applyParsedScanToStudent(
  student: StudentRecord,
  activeSemesterId: string,
  school: SchoolProfile,
  parsed: ParsedScanResult,
  sourcePage?: { id: string; title: string }
): {
  updatedStudent: StudentRecord;
  updatedSchool: SchoolProfile;
  targetModule: RaporModule;
  createdCustomModuleId: string;
  createdCustomModuleLabel: string;
  appliedLabels: string[];
} {
  const appliedLabels: string[] = [];

  // 1. Update school profile fields if present
  const cleanSchool = cleanPartialStringObj<SchoolProfile>(parsed.school);
  const updatedSchool: SchoolProfile = {
    ...school,
    ...cleanSchool,
  };
  if (Object.keys(cleanSchool).length > 0) {
    appliedLabels.push('Data Sekolah/Penandatangan');
  }

  // 2. Update student identity fields (preserve fotoUrl unless unchanged)
  const cleanIdentitas = cleanPartialStringObj<StudentIdentity>(parsed.identitas);
  const updatedIdentitas: StudentIdentity = {
    ...student.identitas,
    ...cleanIdentitas,
  };
  if (Object.keys(cleanIdentitas).length > 0) {
    appliedLabels.push(`${Object.keys(cleanIdentitas).length} field Identitas Siswa`);
  }

  // 3. Update active semester data (Sumatif, Hasil Belajar, P5)
  const meta = cleanPartialStringObj(parsed.semesterMeta);
  const updatedSemesters = student.semesters.map((sem) => {
    if (sem.id !== activeSemesterId) return sem;

    let nextSem = { ...sem };
    if (meta.kelas) nextSem.kelas = meta.kelas;
    if (meta.fase) nextSem.fase = meta.fase;
    if (meta.tahunPelajaran) nextSem.tahunPelajaran = meta.tahunPelajaran;
    if (meta.semester) {
      nextSem.semesterNumber = meta.semester;
      nextSem.label = `Semester ${meta.semester}`;
    }

    // Sumatif
    if (parsed.sumatifSubjects && parsed.sumatifSubjects.length > 0) {
      nextSem = {
        ...nextSem,
        sumatif: {
          ...nextSem.sumatif,
          ...(meta.kelas ? { kelas: meta.kelas } : {}),
          ...(meta.semester ? { semester: meta.semester } : {}),
          ...(meta.tanggalCetak ? { tanggalCetak: meta.tanggalCetak } : {}),
          ...(parsed.catatanWaliKelas ? { catatanWaliKelas: parsed.catatanWaliKelas } : {}),
          ...(parsed.ketidakhadiran
            ? {
                ketidakhadiran: {
                  sakit: parsed.ketidakhadiran.sakit ?? nextSem.sumatif.ketidakhadiran.sakit,
                  izin: parsed.ketidakhadiran.izin ?? nextSem.sumatif.ketidakhadiran.izin,
                  tanpaKeterangan:
                    parsed.ketidakhadiran.tanpaKeterangan ??
                    nextSem.sumatif.ketidakhadiran.tanpaKeterangan,
                },
              }
            : {}),
          subjects: parsed.sumatifSubjects.map((sub, i) => ({
            id: `sum-scan-${Date.now()}-${i}`,
            nama: sub.nama,
            rincian:
              sub.rincian && sub.rincian.length > 0
                ? sub.rincian.map((r, rIdx) => ({
                    label: r.label || `Nilai ${rIdx + 1}`,
                    nilai: Number(r.nilai) || 0,
                  }))
                : [{ label: 'Nilai 1', nilai: 0 }],
          })),
        },
      };
      appliedLabels.push(`${parsed.sumatifSubjects.length} mapel Nilai Sumatif`);
    }

    // Hasil Belajar
    const hasHbSubjects =
      parsed.hasilBelajarSubjects && parsed.hasilBelajarSubjects.length > 0;
    const hasHbExtras =
      (parsed.ekstrakurikuler && parsed.ekstrakurikuler.length > 0) ||
      !!parsed.ketidakhadiran ||
      !!parsed.catatanWaliKelas ||
      !!parsed.keteranganKenaikanKelas;

    if (hasHbSubjects || (parsed.detectedType === 'Hasil Belajar' && hasHbExtras)) {
      nextSem = {
        ...nextSem,
        hasilBelajar: {
          ...nextSem.hasilBelajar,
          ...(meta.kelas ? { kelas: meta.kelas } : {}),
          ...(meta.semester ? { semester: meta.semester } : {}),
          ...(meta.tanggalCetak ? { tanggalCetak: meta.tanggalCetak } : {}),
          ...(parsed.catatanWaliKelas
            ? { catatanWaliKelas: parsed.catatanWaliKelas }
            : {}),
          ...(parsed.keteranganKenaikanKelas
            ? { keteranganKenaikanKelas: parsed.keteranganKenaikanKelas }
            : {}),
          ...(parsed.ketidakhadiran
            ? {
                ketidakhadiran: {
                  sakit:
                    parsed.ketidakhadiran.sakit ??
                    nextSem.hasilBelajar.ketidakhadiran.sakit,
                  izin:
                    parsed.ketidakhadiran.izin ??
                    nextSem.hasilBelajar.ketidakhadiran.izin,
                  tanpaKeterangan:
                    parsed.ketidakhadiran.tanpaKeterangan ??
                    nextSem.hasilBelajar.ketidakhadiran.tanpaKeterangan,
                },
              }
            : {}),
          ...(parsed.ekstrakurikuler && parsed.ekstrakurikuler.length > 0
            ? {
                ekstrakurikuler: parsed.ekstrakurikuler.map((eks, i) => ({
                  id: `eks-scan-${Date.now()}-${i}`,
                  kegiatan: eks.kegiatan || '',
                  predikat: eks.predikat || '',
                  keterangan: eks.keterangan || '',
                })),
              }
            : {}),
          ...(hasHbSubjects
            ? {
                subjects: parsed.hasilBelajarSubjects!.map((sub, i) => ({
                  id: `hb-scan-${Date.now()}-${i}`,
                  nama: sub.nama,
                  nilaiAkhir: Number(sub.nilaiAkhir) || 0,
                  capaianKompetensi: sub.capaianKompetensi || '',
                })),
              }
            : {}),
        },
      };
      if (hasHbSubjects) {
        appliedLabels.push(`${parsed.hasilBelajarSubjects!.length} mapel Hasil Belajar`);
      } else {
        appliedLabels.push('Absensi / Catatan Hasil Belajar');
      }
    }

    // Rapor P5
    if (parsed.p5Projects && parsed.p5Projects.length > 0) {
      nextSem = {
        ...nextSem,
        p5: {
          ...nextSem.p5,
          ...(meta.kelas ? { kelasP5: meta.kelas, kelasFooter: meta.kelas } : {}),
          ...(meta.fase ? { fase: meta.fase } : {}),
          ...(meta.tahunPelajaran ? { tahunPelajaran: meta.tahunPelajaran } : {}),
          ...(meta.tanggalCetak ? { tanggalCetak: meta.tanggalCetak } : {}),
          projects: parsed.p5Projects.map((proj, pIdx) => ({
            id: `p5-scan-${Date.now()}-${pIdx}`,
            nomor: proj.nomor ?? pIdx + 1,
            judul: proj.judul,
            deskripsiRingkas: proj.deskripsiRingkas || '',
            catatanProses: proj.catatanProses || '',
            indikator: (proj.indikator ?? []).map((ind, iIdx) => ({
              id: `p5-ind-scan-${Date.now()}-${pIdx}-${iIdx}`,
              dimensi: ind.dimensi,
              deskripsi: ind.deskripsi,
              marker: 'bullet',
              level: ind.level ?? null,
            })),
          })),
        },
      };
      appliedLabels.push(`${parsed.p5Projects.length} projek P5`);
    }

    return nextSem;
  });

  // 4. Create/update tailored CustomRaporModule inside Modul Rapor matching the uploaded scan layout
  const studentWithStandard: StudentRecord = {
    ...student,
    identitas: updatedIdentitas,
    semesters: updatedSemesters,
  };

  const { updatedStudent, createdModule } = upsertCustomModuleInStudent(
    studentWithStandard,
    activeSemesterId,
    parsed,
    sourcePage
  );
  appliedLabels.push(`Modul Rapor Baru "${createdModule.menuLabel}"`);

  return {
    updatedStudent,
    updatedSchool,
    targetModule: getTargetModuleForScan(parsed.detectedType),
    createdCustomModuleId: createdModule.id,
    createdCustomModuleLabel: createdModule.menuLabel,
    appliedLabels,
  };
}

export function createStudentFromParsedScan(
  parsed: ParsedScanResult,
  school: SchoolProfile,
  sourceScanPage?: { id: string; title: string; imageUrl: string }
): {
  newStudent: StudentRecord;
  updatedSchool: SchoolProfile;
  targetModule: RaporModule;
  createdCustomModuleId: string;
  createdCustomModuleLabel: string;
} {
  const nama = parsed.identitas?.namaLengkap?.trim() || 'PESERTA DIDIK BARU';
  const nis = parsed.identitas?.nis?.trim() || '-';
  const nisn = parsed.identitas?.nisn?.trim() || '-';
  const kelas =
    parsed.semesterMeta?.kelas?.trim() ||
    parsed.identitas?.diterimaDiKelas?.trim() ||
    'X-1';

  const blank = createBlankStudent(nama, nis, nisn, kelas);
  const firstSemId = blank.semesters[0].id;
  if (sourceScanPage) {
    blank.scanPages = [
      {
        id: sourceScanPage.id,
        title: sourceScanPage.title,
        category: parsed.detectedType,
        imageUrl: sourceScanPage.imageUrl,
        scanStatus: 'done',
        parsedData: parsed,
      },
    ];
  } else {
    blank.scanPages = [];
  }

  const {
    updatedStudent,
    updatedSchool,
    targetModule,
    createdCustomModuleId,
    createdCustomModuleLabel,
  } = applyParsedScanToStudent(
    blank,
    firstSemId,
    school,
    parsed,
    sourceScanPage ? { id: sourceScanPage.id, title: sourceScanPage.title } : undefined
  );

  return {
    newStudent: updatedStudent,
    updatedSchool,
    targetModule,
    createdCustomModuleId,
    createdCustomModuleLabel,
  };
}

