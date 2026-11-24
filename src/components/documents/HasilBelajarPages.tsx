import React from 'react';
import { HasilBelajarReport, SchoolProfile, StudentIdentity } from '../../types/rapor';
import { RaporFooter, RaporStudentHeader, SignatureBlock } from './DocumentShared';

export function HasilBelajarPages({
  identitas,
  school,
  report,
  fase,
  tahunPelajaran,
}: {
  identitas: StudentIdentity;
  school: SchoolProfile;
  report: HasilBelajarReport;
  fase?: string;
  tahunPelajaran?: string;
}) {
  const effectiveFase = fase || school.fase;
  const effectiveTahun = tahunPelajaran || school.tahunPelajaran;
  const isEvenSemester = Number(report.semester) % 2 === 0;

  return (
    <>
      {/* HALAMAN 1 */}
      <div className="rapor-sheet" style={{ padding: '12mm 14mm 10mm 14mm' }}>
        <RaporStudentHeader
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          nisn={identitas.nisn}
          school={school}
          kelas={report.kelas}
          fase={effectiveFase}
          semester={report.semester}
          tahunPelajaran={effectiveTahun}
        />

        <h1 className="text-center text-[11.5pt] font-bold tracking-wide mt-4 mb-3">
          LAPORAN HASIL BELAJAR
        </h1>

        <table className="rapor-table text-[8.6pt] leading-[1.26]">
          <thead>
            <tr>
              <th className="w-[30px]">No</th>
              <th className="w-[172px]">Mata Pelajaran</th>
              <th className="w-[62px]">Nilai Akhir</th>
              <th>Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="font-bold py-1.5">
                A. Kelompok Mata Pelajaran Umum
              </td>
            </tr>
            {report.subjects.map((subject, idx) => (
              <tr key={subject.id}>
                <td className="text-center tabular-nums">{idx + 1}</td>
                <td className="leading-[1.24]">{subject.nama}</td>
                <td className="text-center tabular-nums">{subject.nilaiAkhir}</td>
                <td className="whitespace-pre-line leading-[1.28] text-justify">
                  {renderFormattedCompetency(subject.capaianKompetensi)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <RaporFooter
          kelas={report.kelas}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={1}
        />
      </div>

      {/* HALAMAN 2 */}
      <div className="rapor-sheet" style={{ padding: '12mm 14mm 10mm 14mm' }}>
        <RaporStudentHeader
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          nisn={identitas.nisn}
          school={school}
          kelas={report.kelas}
          fase={effectiveFase}
          semester={report.semester}
          tahunPelajaran={effectiveTahun}
        />

        {/* Kegiatan Ekstrakurikuler (shown on even semesters or when items exist) */}
        {(isEvenSemester || report.ekstrakurikuler.some((e) => e.kegiatan)) && (
          <div className="mt-6">
            <table className="rapor-table text-[9pt]">
              <thead>
                <tr>
                  <th className="w-[32px]">No</th>
                  <th className="w-[215px]">Kegiatan Ekstrakurikuler</th>
                  <th className="w-[82px]">Predikat</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {report.ekstrakurikuler.map((eks, idx) => (
                  <tr key={eks.id}>
                    <td className="text-center tabular-nums py-[4px]">{idx + 1}</td>
                    <td className="py-[4px]">{eks.kegiatan}</td>
                    <td className="text-center py-[4px]">{eks.predikat}</td>
                    <td className="py-[4px]">{eks.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ketidakhadiran */}
        <div className="mt-6 w-[310px]">
          <table className="rapor-table text-[9pt]">
            <tbody>
              <tr>
                <td className="w-[155px] py-[4px]">Sakit</td>
                <td className="py-[4px] tabular-nums">
                  : &nbsp; {report.ketidakhadiran.sakit} hari
                </td>
              </tr>
              <tr>
                <td className="py-[4px]">Izin</td>
                <td className="py-[4px] tabular-nums">
                  : &nbsp; {report.ketidakhadiran.izin} hari
                </td>
              </tr>
              <tr>
                <td className="py-[4px]">Tanpa Keterangan</td>
                <td className="py-[4px] tabular-nums">
                  : &nbsp; {report.ketidakhadiran.tanpaKeterangan} hari
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Catatan Wali Kelas */}
        <div className="mt-6">
          <div className="text-[9.5pt] font-bold mb-1.5">Catatan Wali Kelas</div>
          <div className="border border-gray-600 px-3 py-3 text-[9.2pt] min-h-[58px]">
            {report.catatanWaliKelas}
          </div>
        </div>

        {/* Keterangan Kenaikan Kelas (Semester 2) */}
        {report.keteranganKenaikanKelas && (
          <div className="mt-5 border border-gray-600 px-3 py-2.5 text-center text-[9.5pt] font-bold">
            Keterangan Kenaikan Kelas &nbsp;: &nbsp; {report.keteranganKenaikanKelas}
          </div>
        )}

        <div className="mt-4">
          <SignatureBlock
            kota={school.kota}
            tanggalCetak={report.tanggalCetak}
            school={school}
            mode={report.signatureMode}
            studentName={identitas.namaLengkap}
            docLabel={`LAPORAN HASIL BELAJAR SEM ${report.semester}`}
          />
        </div>

        <RaporFooter
          kelas={report.kelas}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={2}
        />
      </div>
    </>
  );
}

function renderFormattedCompetency(text: string) {
  const parts = text.split(/(sangat baik|baik|Perlu peningkatan|Perlu penguatan|masyarakat modern)/gi);
  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    if (lower === 'baik' || lower === 'masyarakat modern') {
      return (
        <strong key={idx} className="font-bold">
          {part}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}
