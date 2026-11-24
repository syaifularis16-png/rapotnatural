import React from 'react';
import {
  CustomRaporModule,
  DynamicDocumentSpec,
  SchoolProfile,
  SemesterPackage,
  SignatureMode,
  StudentIdentity,
} from '../../types/rapor';
import { SchoolStamp, SignatureInk, VerificationQR } from '../OfficialGraphics';
import { RaporFooter, RaporStudentHeader, SignatureBlock } from './DocumentShared';
import { getGroupHeaderText, isTableGroupHeaderRow } from '../../utils/scanParser';

function isNumericOrShortCol(header: string, rows: string[][], colIdx: number): boolean {
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
    h === 'jumlah' ||
    h === 'sakit' ||
    h === 'izin' ||
    h === 'alpa'
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

function getSmartAdaptiveColWidth(col: string, cIdx: number, totalCols: number): string | undefined {
  const h = col.trim().toLowerCase();
  if (cIdx === 0 && h.startsWith('no')) return '32px';
  if (h === 'nilai' || h === 'nilai akhir' || h === 'rerata' || h === 'rerata nilai' || h === 'poin' || h === 'skor') {
    return '76px';
  }
  if (totalCols === 4 && cIdx === 1 && /mata pelajaran|kegiatan|aspek|komponen/i.test(h)) {
    return '168px';
  }
  return undefined;
}

function AdaptiveSignatureBlock({
  dyn,
  kota,
  tanggalCetak,
  school,
  mode,
  studentName,
  docLabel,
}: {
  dyn: DynamicDocumentSpec;
  kota: string;
  tanggalCetak: string;
  school: SchoolProfile;
  mode: SignatureMode;
  studentName: string;
  docLabel: string;
}) {
  const hasCustomSigners =
    !!dyn.signerLeftTitle ||
    !!dyn.signerLeftName ||
    !!dyn.signerRightTitle ||
    !!dyn.signerRightName;

  if (!hasCustomSigners) {
    return (
      <SignatureBlock
        kota={kota}
        tanggalCetak={tanggalCetak}
        school={school}
        mode={mode}
        studentName={studentName}
        docLabel={docLabel}
      />
    );
  }

  const leftTitle = dyn.signerLeftTitle || 'Mengetahui,\nOrang Tua/Wali';
  const rightTitle = dyn.signerRightTitle || 'Wali Kelas,';
  const rightName = dyn.signerRightName || school.waliKelas;
  const rightNip = dyn.signerRightNip || school.nipWaliKelas;

  return (
    <div
      className="mt-4 leading-[1.38] text-gray-900"
      style={{ fontSize: 'calc(9.3pt * var(--doc-font-scale, 1))' }}
    >
      <div className="grid grid-cols-2 gap-8 items-start">
        <div className="pl-2">
          <div className="whitespace-pre-line">{leftTitle}</div>
          <div className="h-[60px] flex items-center pl-2">
            <SignatureInk variant="ortu" />
          </div>
          {dyn.signerLeftName ? (
            <div className="font-bold">{dyn.signerLeftName}</div>
          ) : (
            <div className="w-[150px] border-b border-dotted border-gray-700" />
          )}
        </div>

        <div className="pl-12">
          <div>
            {kota}, {tanggalCetak}
          </div>
          <div className="whitespace-pre-line">{rightTitle}</div>
          <div className="h-[60px] flex items-center pl-4 relative">
            {mode === 'qr' ? (
              <VerificationQR
                payload={`VALID|${rightTitle}|${rightName}|${studentName}|${docLabel}|${tanggalCetak}`}
                label={rightName}
              />
            ) : (
              <>
                <SignatureInk variant="wali" />
                <div className="absolute -left-16 -top-4 pointer-events-none">
                  <SchoolStamp className="w-[96px] h-[96px] -rotate-12" />
                </div>
              </>
            )}
          </div>
          <div className="font-bold">{rightName}</div>
          {rightNip && <div className="tabular-nums">NIP. {rightNip}</div>}
        </div>
      </div>
    </div>
  );
}

export function CustomModulePage({
  identitas,
  school,
  semester,
  moduleData,
}: {
  identitas: StudentIdentity;
  school: SchoolProfile;
  semester: SemesterPackage;
  moduleData: CustomRaporModule;
}) {
  if (moduleData.layout === 'adaptif' && moduleData.adaptiveDoc) {
    const dyn = moduleData.adaptiveDoc;
    const tables = dyn.tables ?? [];
    const sections = dyn.sections ?? [];
    const metaPairs = dyn.metaPairs ?? [];
    const noteText = dyn.catatan || moduleData.catatan;
    const effectiveTanggal = dyn.tanggalCetak || moduleData.tanggalCetak;

    return (
      <div className="rapor-sheet" style={{ padding: '12mm 14mm 10mm 14mm' }}>
        {/* Optional Institutional Kop Surat extracted from upload */}
        {dyn.instansiHeader && (
          <div className="text-center border-b-[2.5px] border-double border-gray-900 pb-2 mb-3.5">
            <div
              className="font-bold uppercase leading-[1.32] whitespace-pre-line text-gray-950"
              style={{ fontSize: 'calc(10.5pt * var(--doc-font-scale, 1))' }}
            >
              {dyn.instansiHeader}
            </div>
          </div>
        )}

        {/* Standard Student Header if applicable */}
        {dyn.includeStudentHeader && (
          <RaporStudentHeader
            nama={identitas.namaLengkap}
            nis={identitas.nis}
            nisn={identitas.nisn}
            school={school}
            kelas={semester.kelas}
            fase={semester.fase || school.fase}
            semester={semester.semesterNumber}
            tahunPelajaran={semester.tahunPelajaran || school.tahunPelajaran}
          />
        )}

        {/* Document Title & Subtitle */}
        <div className="text-center mt-4 mb-3.5">
          <h1
            className="font-bold tracking-wide uppercase text-gray-950"
            style={{ fontSize: 'calc(11.5pt * var(--doc-font-scale, 1))' }}
          >
            {moduleData.judulDokumen || dyn.judulDokumen}
          </h1>
          {dyn.subJudul && (
            <div
              className="font-medium text-gray-800 mt-0.5 whitespace-pre-line"
              style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
            >
              {dyn.subJudul}
            </div>
          )}
        </div>

        {/* Metadata Key-Value Grid */}
        {metaPairs.length > 0 && (
          <div
            className={`mb-3.5 leading-[1.45] text-gray-900 ${
              dyn.formatStyle === 'identitas_grid'
                ? 'border border-gray-500 p-3 grid grid-cols-1 gap-1'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5'
            }`}
            style={{ fontSize: 'calc(9.2pt * var(--doc-font-scale, 1))' }}
          >
            {metaPairs.map((pair, idx) => (
              <div
                key={`${pair.label}-${idx}`}
                className="grid grid-cols-[150px_10px_1fr] items-baseline"
              >
                <span className="font-medium text-gray-800">{pair.label}</span>
                <span>:</span>
                <span className="font-semibold text-gray-950">{pair.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Narrative / Rules Sections */}
        {sections.length > 0 && (
          <div className="space-y-2.5 mb-3.5">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="leading-[1.52] text-gray-900"
                style={{ fontSize: 'calc(9.3pt * var(--doc-font-scale, 1))' }}
              >
                {sec.heading && (
                  <div className="font-bold text-gray-950 mb-0.5">{sec.heading}</div>
                )}
                <div className="text-justify whitespace-pre-line">{sec.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Multi-Column Tables tailored to the uploaded JPG */}
        {tables.length > 0 && (
          <div className="space-y-4">
            {tables.map((tbl, tIdx) => {
              const cols = tbl.columns.length > 0 ? tbl.columns : ['Kolom 1'];
              const isCompactAttendance =
                cols.length === 2 &&
                /ketidakhadiran|absensi|kehadiran/i.test(`${tbl.title ?? ''} ${cols[0]}`);
              return (
                <div key={tIdx}>
                  {tbl.title && (
                    <div
                      className="font-bold text-gray-950 mb-1.5"
                      style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
                    >
                      {tbl.title}
                    </div>
                  )}
                  <table
                    className={`rapor-table leading-[1.32] ${
                      isCompactAttendance ? '!w-[320px]' : ''
                    }`}
                    style={{ fontSize: 'calc(8.6pt * var(--doc-font-scale, 1))' }}
                  >
                    <thead>
                      <tr>
                        {cols.map((col, cIdx) => {
                          const smartWidth = getSmartAdaptiveColWidth(col, cIdx, cols.length);
                          return (
                            <th
                              key={cIdx}
                              style={smartWidth ? { width: smartWidth } : undefined}
                              className={
                                cIdx === 0 && col.trim().toLowerCase().startsWith('no')
                                  ? 'text-center'
                                  : isNumericOrShortCol(col, tbl.rows, cIdx)
                                    ? 'text-center'
                                    : 'text-left'
                              }
                            >
                              {col}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={cols.length}
                            className="text-center py-3 text-gray-500 italic"
                          >
                            Belum ada data baris pada tabel ini.
                          </td>
                        </tr>
                      ) : (
                        tbl.rows.map((cells, rIdx) => {
                          if (isTableGroupHeaderRow(cells)) {
                            return (
                              <tr key={rIdx}>
                                <td
                                  colSpan={cols.length}
                                  className="py-1.5 font-bold text-left text-gray-950"
                                >
                                  {getGroupHeaderText(cells)}
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={rIdx}>
                              {cols.map((col, cIdx) => {
                                const cellValue = cells[cIdx] ?? '';
                                const numeric = isNumericOrShortCol(col, tbl.rows, cIdx);
                                return (
                                  <td
                                    key={cIdx}
                                    className={`py-1.5 align-top whitespace-pre-line ${
                                      numeric
                                        ? 'text-center tabular-nums'
                                        : 'text-left'
                                    }`}
                                  >
                                    {cellValue}
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
              );
            })}
          </div>
        )}

        {/* Fallback if both tables & sections are empty */}
        {tables.length === 0 && sections.length === 0 && metaPairs.length === 0 && (
          <div
            className="border border-gray-600 p-4 leading-[1.6] text-justify whitespace-pre-line min-h-[180px]"
            style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
          >
            {moduleData.narasi || 'Isi dokumen belum tersedia.'}
          </div>
        )}

        {/* Notes / Ketentuan */}
        {noteText && (
          <div className="mt-4">
            <div
              className="font-bold mb-1 text-gray-950"
              style={{ fontSize: 'calc(9pt * var(--doc-font-scale, 1))' }}
            >
              Catatan / Ketentuan
            </div>
            <div
              className="border border-gray-600 px-3 py-2 italic whitespace-pre-line min-h-[38px]"
              style={{ fontSize: 'calc(8.8pt * var(--doc-font-scale, 1))' }}
            >
              {noteText}
            </div>
          </div>
        )}

        {/* Adaptive Signature */}
        <AdaptiveSignatureBlock
          dyn={dyn}
          kota={school.kota}
          tanggalCetak={effectiveTanggal}
          school={school}
          mode={moduleData.signatureMode}
          studentName={identitas.namaLengkap}
          docLabel={moduleData.judulDokumen || dyn.judulDokumen}
        />

        <RaporFooter
          kelas={semester.kelas}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={1}
        />
      </div>
    );
  }

  return (
    <div className="rapor-sheet" style={{ padding: '12mm 14mm 10mm 14mm' }}>
      <RaporStudentHeader
        nama={identitas.namaLengkap}
        nis={identitas.nis}
        nisn={identitas.nisn}
        school={school}
        kelas={semester.kelas}
        fase={semester.fase || school.fase}
        semester={semester.semesterNumber}
        tahunPelajaran={semester.tahunPelajaran || school.tahunPelajaran}
      />

      <h1
        className="text-center font-bold tracking-wide mt-5 mb-4 uppercase"
        style={{ fontSize: 'calc(11.5pt * var(--doc-font-scale, 1))' }}
      >
        {moduleData.judulDokumen}
      </h1>

      {moduleData.layout === 'tabel' ? (
        <table
          className="rapor-table leading-[1.32]"
          style={{ fontSize: 'calc(8.8pt * var(--doc-font-scale, 1))' }}
        >
          <thead>
            <tr>
              <th className="w-[32px]">No</th>
              <th className="w-[195px]">{moduleData.kolomAspek || 'Komponen'}</th>
              <th className="w-[88px]">{moduleData.kolomNilai || 'Nilai'}</th>
              <th>{moduleData.kolomKeterangan || 'Keterangan'}</th>
            </tr>
          </thead>
          <tbody>
            {moduleData.rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                  Belum ada baris data pada modul ini.
                </td>
              </tr>
            ) : (
              moduleData.rows.map((row, idx) => (
                <tr key={row.id}>
                  <td className="text-center tabular-nums py-1.5">{idx + 1}</td>
                  <td className="py-1.5 font-medium">{row.aspek}</td>
                  <td className="text-center tabular-nums py-1.5">{row.nilai}</td>
                  <td className="py-1.5 text-justify whitespace-pre-line">{row.keterangan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div
          className="border border-gray-600 p-4 leading-[1.6] text-justify whitespace-pre-line min-h-[210px]"
          style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
        >
          {moduleData.narasi || 'Isi keterangan modul belum ditulis.'}
        </div>
      )}

      {moduleData.catatan && (
        <div className="mt-5">
          <div
            className="font-bold mb-1"
            style={{ fontSize: 'calc(9.2pt * var(--doc-font-scale, 1))' }}
          >
            Catatan
          </div>
          <div
            className="border border-gray-600 px-3 py-2.5 italic min-h-[44px]"
            style={{ fontSize: 'calc(9pt * var(--doc-font-scale, 1))' }}
          >
            {moduleData.catatan}
          </div>
        </div>
      )}

      <div className="mt-4">
        <SignatureBlock
          kota={school.kota}
          tanggalCetak={moduleData.tanggalCetak}
          school={school}
          mode={moduleData.signatureMode}
          studentName={identitas.namaLengkap}
          docLabel={moduleData.judulDokumen}
        />
      </div>

      <RaporFooter
        kelas={semester.kelas}
        nama={identitas.namaLengkap}
        nis={identitas.nis}
        halaman={1}
      />
    </div>
  );
}
