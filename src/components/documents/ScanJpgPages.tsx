import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileImage,
  FilePlus2,
  Loader2,
  ScanText,
  Sparkles,
  Table2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { JpgScanPage, ParsedScanResult, RaporModule } from '../../types/rapor';
import {
  downloadTableCsv,
  getGroupHeaderText,
  getOutputTablesFromParsedScan,
  getTargetModuleForScan,
  isTableGroupHeaderRow,
  tableToTsv,
} from '../../utils/scanParser';

interface ScanJpgPagesProps {
  pages: JpgScanPage[];
  onUploadFiles?: (files: FileList) => void;
  onParsePage?: (pageId: string) => void;
  onApplyParsedToActive?: (page: JpgScanPage) => void;
  onCreateCustomModule?: (page: JpgScanPage) => void;
  onCreateStudentFromParsed?: (page: JpgScanPage) => void;
  onOpenModule?: (module: RaporModule) => void;
}

const MODULE_LABEL: Record<RaporModule, string> = {
  sampul: 'Sampul Rapor',
  identitas: 'Identitas Siswa',
  sumatif: 'Nilai Sumatif',
  hasil_belajar: 'Hasil Belajar',
  p5: 'Rapor P5',
  scan_jpg: 'Versi JPG',
};

export function ScanJpgPages({
  pages,
  onUploadFiles,
  onParsePage,
  onApplyParsedToActive,
  onCreateCustomModule,
  onCreateStudentFromParsed,
  onOpenModule,
}: ScanJpgPagesProps) {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (pageId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [pageId]: prev[pageId] === undefined ? false : !prev[pageId],
    }));
  };

  if (pages.length === 0) {
    return (
      <div className="rapor-sheet items-center justify-center text-center">
        <div className="max-w-md space-y-3 no-print px-6">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <FileImage className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-slate-800">
            Belum ada halaman scan JPG pada filter ini
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Unggah foto atau hasil scan rapor (.jpg / .png). Sistem akan otomatis membaca
            dokumen dan menerjemahkannya ke data Identitas Siswa, Nilai Sumatif, Hasil Belajar,
            atau Rapor P5.
          </p>
          {onUploadFiles && (
            <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#00a0d2] hover:bg-[#008bb8] rounded cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload &amp; Baca JPG</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onUploadFiles(e.target.files);
                    e.target.value = '';
                  }
                }}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {pages.map((page, idx) => {
        const isScanning = page.scanStatus === 'scanning';
        const isDone = page.scanStatus === 'done' && !!page.parsedData;
        const isError = page.scanStatus === 'error';
        const showDetails = expandedDetails[page.id] ?? true;
        const targetMod = page.parsedData
          ? getTargetModuleForScan(page.parsedData.detectedType)
          : 'identitas';

        return (
          <div key={page.id} className="flex flex-col items-center gap-2.5 print-container print-sheet-group">
            {/* Screen-only OCR Status & Translated System Data Panel */}
            <div className="no-print w-[210mm] max-w-full bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono-tabular font-semibold text-slate-500">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {page.title}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-[#008bb8]">
                    {page.category}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {onParsePage && (
                    <button
                      type="button"
                      disabled={isScanning}
                      onClick={() => onParsePage(page.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                        isScanning
                          ? 'bg-sky-100 text-sky-700 cursor-wait'
                          : isDone
                            ? 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                            : 'bg-[#00a0d2] text-white hover:bg-[#008bb8]'
                      }`}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Membaca Scan...</span>
                        </>
                      ) : (
                        <>
                          <ScanText className="w-3.5 h-3.5" />
                          <span>
                            {isDone ? 'Baca Ulang' : 'Baca & Terjemahkan ke Sistem'}
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  {isDone && page.parsedData && onCreateCustomModule && (
                    <button
                      type="button"
                      onClick={() => onCreateCustomModule(page)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors cursor-pointer"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" />
                      <span>Buat &amp; Buka Modul Rapor</span>
                    </button>
                  )}

                  {isDone && page.parsedData && onApplyParsedToActive && (
                    <button
                      type="button"
                      onClick={() => onApplyParsedToActive(page)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terapkan ke Siswa Aktif</span>
                    </button>
                  )}

                  {isDone && page.parsedData && onCreateStudentFromParsed && (
                    <button
                      type="button"
                      onClick={() => onCreateStudentFromParsed(page)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-sky-600" />
                      <span>Buat Siswa Baru</span>
                    </button>
                  )}

                  {isDone && onOpenModule && (
                    <button
                      type="button"
                      onClick={() => onOpenModule(targetMod)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#008bb8] bg-[#00a0d2]/10 border border-[#00a0d2]/30 hover:bg-[#00a0d2]/15 rounded transition-colors cursor-pointer"
                    >
                      <span>Lihat {MODULE_LABEL[targetMod]}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {isDone && (
                    <button
                      type="button"
                      onClick={() => toggleDetails(page.id)}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded cursor-pointer"
                      title={showDetails ? 'Sembunyikan detail terjemahan' : 'Tampilkan detail'}
                    >
                      {showDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isScanning && (
                <div className="px-4 py-2.5 bg-sky-50/70 text-xs text-sky-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00a0d2] shrink-0 animate-pulse" />
                  <span>
                    Sistem sedang membaca teks, tabel nilai, dan identitas pada gambar scan JPG...
                  </span>
                </div>
              )}

              {isError && page.scanError && (
                <div className="px-4 py-2.5 bg-red-50 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{page.scanError}</span>
                </div>
              )}

              {isDone && page.parsedData && showDetails && (
                <ParsedPreviewBody parsed={page.parsedData} pageTitle={page.title} />
              )}
            </div>

            {/* A4 Printable Sheet */}
            <div className="rapor-sheet rapor-sheet-scan relative" style={{ padding: 0 }}>
              <img
                src={page.imageUrl}
                alt={page.title}
                className="w-full h-full object-contain bg-white block"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

function isShortNumericColumn(header: string, rows: string[][], colIdx: number): boolean {
  const h = header.trim().toLowerCase();
  if (
    h === 'no' ||
    h === 'no.' ||
    h === 'poin' ||
    h === 'skor' ||
    h === 'nilai' ||
    h === 'nilai akhir' ||
    h === 'rerata' ||
    h === 'rerata nilai' ||
    h === 'predikat' ||
    h === 'jumlah'
  ) {
    return true;
  }
  const sample = rows
    .filter((r) => !isTableGroupHeaderRow(r))
    .slice(0, 8)
    .map((r) => (r[colIdx] ?? '').trim())
    .filter(Boolean);
  if (sample.length === 0) return false;
  return sample.every((val) => val.length <= 10 && /^[0-9.,/%+\-\s]+$/.test(val));
}

function ParsedPreviewBody({
  parsed,
  pageTitle,
}: {
  parsed: ParsedScanResult;
  pageTitle: string;
}) {
  const [copiedTableIdx, setCopiedTableIdx] = useState<number | null>(null);
  const [showMetaDetails, setShowMetaDetails] = useState<boolean>(false);

  const outputTables = getOutputTablesFromParsedScan(parsed);

  const identitasEntries = Object.entries(parsed.identitas ?? {}).filter(
    ([, val]) => typeof val === 'string' && val.trim() !== '' && val.trim() !== '-'
  );
  const schoolEntries = Object.entries(parsed.school ?? {}).filter(
    ([, val]) => typeof val === 'string' && val.trim() !== '' && val.trim() !== '-'
  );

  const IDENTITY_LABELS: Record<string, string> = {
    namaLengkap: 'Nama Lengkap',
    nis: 'NIS',
    nisn: 'NISN',
    tempatTanggalLahir: 'Tempat, Tgl Lahir',
    jenisKelamin: 'Jenis Kelamin',
    agama: 'Agama',
    statusDalamKeluarga: 'Status Keluarga',
    anakKe: 'Anak ke',
    alamatPesertaDidik: 'Alamat Siswa',
    nomorTeleponRumah: 'Telepon Rumah',
    sekolahAsal: 'Sekolah Asal',
    diterimaDiSekolahIni: 'Diterima di Sekolah',
    diterimaDiKelas: 'Diterima di Kelas',
    diterimaPadaTanggal: 'Tanggal Diterima',
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

  const handleCopyTsv = async (tableIdx: number, tsv: string) => {
    try {
      await navigator.clipboard.writeText(tsv);
      setCopiedTableIdx(tableIdx);
      window.setTimeout(() => {
        setCopiedTableIdx((prev) => (prev === tableIdx ? null : prev));
      }, 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <div className="px-4 py-3 text-xs space-y-3 bg-white">
      {/* Compact Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-start gap-2 text-slate-700 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-semibold text-slate-900">
              Terbaca sebagai {parsed.detectedType}:{' '}
            </span>
            <span>{parsed.confidenceSummary}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-sky-50 text-[#008bb8] border border-sky-200 rounded shrink-0">
          <Table2 className="w-3.5 h-3.5" />
          <span>{outputTables.length} Tabel Output</span>
        </span>
      </div>

      {/* PRIMARY FOCUS: Full Rendered Output Tables */}
      {outputTables.length > 0 ? (
        <div className="space-y-3">
          {outputTables.map((tbl, tIdx) => {
            const isCopied = copiedTableIdx === tIdx;
            const dataRowCount = tbl.rows.filter((r) => !isTableGroupHeaderRow(r)).length;
            return (
              <div
                key={tIdx}
                className="border border-slate-300 rounded-md overflow-hidden bg-white shadow-2xs"
              >
                <div className="px-3 py-2 bg-slate-100 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Table2 className="w-3.5 h-3.5 text-[#008bb8] shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">
                      {tbl.title || `Tabel Output OCR #${tIdx + 1}`}
                    </span>
                    <span className="text-[10.5px] font-mono-tabular text-slate-500 shrink-0">
                      ({tbl.columns.length} kolom · {dataRowCount} baris)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleCopyTsv(tIdx, tableToTsv(tbl))}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded cursor-pointer"
                      title="Salin tabel agar siap ditempel ke Excel, Google Sheets, atau Word"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Salin Tabel</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadTableCsv(tbl, pageTitle)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded cursor-pointer"
                      title="Unduh tabel output dalam format CSV"
                    >
                      <Download className="w-3 h-3 text-emerald-600" />
                      <span>Unduh CSV</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-[420px] overflow-auto">
                  <table className="w-full border-collapse text-[11.5px] leading-[1.4]">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[inset_0_-1px_0_#cbd5e1]">
                      <tr>
                        {tbl.columns.map((col, cIdx) => {
                          const isNoCol = cIdx === 0 && col.trim().toLowerCase().startsWith('no');
                          const isNumCol = isShortNumericColumn(col, tbl.rows, cIdx);
                          return (
                            <th
                              key={cIdx}
                              className={`border-r last:border-r-0 border-slate-300 px-2.5 py-2 font-bold text-slate-800 whitespace-nowrap ${
                                isNoCol
                                  ? 'w-[42px] text-center'
                                  : isNumCol
                                    ? 'text-center'
                                    : 'text-left'
                              }`}
                            >
                              {col}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {tbl.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={tbl.columns.length}
                            className="px-3 py-4 text-center text-slate-400 italic"
                          >
                            Tidak ada baris data pada tabel ini.
                          </td>
                        </tr>
                      ) : (
                        tbl.rows.map((row, rIdx) => {
                          if (isTableGroupHeaderRow(row)) {
                            return (
                              <tr key={rIdx} className="bg-slate-100/90">
                                <td
                                  colSpan={tbl.columns.length}
                                  className="px-2.5 py-1.5 font-bold text-slate-900 text-left"
                                >
                                  {getGroupHeaderText(row)}
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr
                              key={rIdx}
                              className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                            >
                              {tbl.columns.map((col, cIdx) => {
                                const isNoCol =
                                  cIdx === 0 && col.trim().toLowerCase().startsWith('no');
                                const isNumCol = isShortNumericColumn(col, tbl.rows, cIdx);
                                return (
                                  <td
                                    key={cIdx}
                                    className={`border-r last:border-r-0 border-slate-200 px-2.5 py-1.5 align-top whitespace-pre-line text-slate-800 ${
                                      isNoCol || isNumCol
                                        ? 'text-center font-mono-tabular'
                                        : 'text-left'
                                    }`}
                                  >
                                    {row[cIdx] ?? ''}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3 rounded border border-slate-200 bg-slate-50 text-slate-600 text-[11.5px]">
          Dokumen ini berbentuk narasi tanpa tabel terstruktur. Klik{' '}
          <strong>Buat &amp; Buka Modul Rapor</strong> untuk melihat format lengkapnya.
        </div>
      )}

      {/* Secondary Collapsible Metadata / Notes */}
      {(identitasEntries.length > 0 ||
        schoolEntries.length > 0 ||
        parsed.catatanWaliKelas ||
        parsed.dynamicDocument?.catatan) && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowMetaDetails((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {showMetaDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            <span>
              {showMetaDetails ? 'Sembunyikan' : 'Lihat'} Detail Metadata &amp; Catatan (
              {identitasEntries.length + schoolEntries.length} item)
            </span>
          </button>

          {showMetaDetails && (
            <div className="mt-2 space-y-2">
              {identitasEntries.length > 0 && (
                <div className="border border-slate-200 rounded bg-slate-50/70 p-2.5">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                    Data Identitas Siswa Terjemahan ({identitasEntries.length} kolom)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {identitasEntries.map(([key, val]) => (
                      <div key={key} className="flex items-baseline gap-1.5 text-[11px] min-w-0">
                        <span className="text-slate-500 shrink-0">
                          {IDENTITY_LABELS[key] || key}:
                        </span>
                        <span className="font-medium text-slate-900 truncate">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {schoolEntries.length > 0 && (
                <div className="border border-slate-200 rounded bg-slate-50/70 p-2.5">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">
                    Info Sekolah &amp; Penandatangan
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {schoolEntries.map(([key, val]) => (
                      <div key={key} className="flex items-baseline gap-1.5 text-[11px] min-w-0">
                        <span className="text-slate-500 shrink-0">{key}:</span>
                        <span className="font-medium text-slate-900 truncate">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(parsed.catatanWaliKelas || parsed.dynamicDocument?.catatan) && (
                <div className="border border-slate-200 rounded bg-slate-50/70 p-2.5 text-[11px] text-slate-700">
                  <span className="font-semibold text-slate-800">Catatan: </span>
                  <span>{parsed.dynamicDocument?.catatan || parsed.catatanWaliKelas}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
