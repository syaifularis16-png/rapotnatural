import React from 'react';
import { calculateAverage } from '../../data/defaultData';
import { SchoolProfile, StudentIdentity, SumatifReport } from '../../types/rapor';
import { RaporFooter, RaporStudentHeader, SignatureBlock } from './DocumentShared';

export function SumatifPage({
  identitas,
  school,
  sumatif,
}: {
  identitas: StudentIdentity;
  school: SchoolProfile;
  sumatif: SumatifReport;
}) {
  return (
    <div className="rapor-sheet" style={{ padding: '11mm 14mm 10mm 14mm' }}>
      <RaporStudentHeader
        nama={identitas.namaLengkap}
        nis={identitas.nis}
        nisn={identitas.nisn}
        school={school}
        kelas={sumatif.kelas}
        fase={school.fase}
        semester={sumatif.semester}
        tahunPelajaran={school.tahunPelajaran}
      />

      <h1 className="text-center text-[11pt] font-bold tracking-wide mt-3.5 mb-2.5">
        LAPORAN HASIL PENILAIAN SUMATIF SISWA
      </h1>

      <table className="rapor-table text-[8.7pt] leading-[1.28]">
        <thead>
          <tr>
            <th className="w-[30px]">No</th>
            <th className="w-[180px]">Mata Pelajaran</th>
            <th className="w-[74px]">Rerata Nilai</th>
            <th>Rincian Nilai Sumatif</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="font-bold py-1">
              A. Kelompok Mata Pelajaran Umum
            </td>
          </tr>
          {sumatif.subjects.map((subject, idx) => {
            const avg = calculateAverage(subject.rincian);
            const rincianText = subject.rincian
              .map((item) => `${item.label}: ${item.nilai.toFixed(2)}`)
              .join(', ');

            return (
              <tr key={subject.id}>
                <td className="text-center tabular-nums py-[3px]">{idx + 1}</td>
                <td className="py-[3px] leading-[1.22]">{subject.nama}</td>
                <td className="text-center tabular-nums py-[3px]">{avg.toFixed(2)}</td>
                <td className="py-[3px] tabular-nums">{rincianText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Ketidakhadiran */}
      <div className="mt-3.5 w-[275px]">
        <table className="rapor-table text-[8.8pt]">
          <tbody>
            <tr>
              <td className="w-[140px] py-[2.5px]">Sakit</td>
              <td className="py-[2.5px] tabular-nums">
                : &nbsp; {sumatif.ketidakhadiran.sakit} hari
              </td>
            </tr>
            <tr>
              <td className="py-[2.5px]">Izin</td>
              <td className="py-[2.5px] tabular-nums">
                : &nbsp; {sumatif.ketidakhadiran.izin} hari
              </td>
            </tr>
            <tr>
              <td className="py-[2.5px]">Tanpa Keterangan</td>
              <td className="py-[2.5px] tabular-nums">
                : &nbsp; {sumatif.ketidakhadiran.tanpaKeterangan} hari
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Catatan Wali Kelas */}
      <div className="mt-3">
        <div className="text-[9pt] font-bold mb-1">Catatan Wali Kelas</div>
        <div className="border border-gray-600 px-2.5 py-2 text-[9pt] italic font-bold min-h-[34px]">
          {sumatif.catatanWaliKelas}
        </div>
      </div>

      {/* Signatures */}
      <SignatureBlock
        kota={school.kota}
        tanggalCetak={sumatif.tanggalCetak}
        school={school}
        mode={sumatif.signatureMode}
        studentName={identitas.namaLengkap}
        docLabel={`PENILAIAN SUMATIF SEM ${sumatif.semester}`}
      />

      <RaporFooter
        kelas={sumatif.kelas}
        nama={identitas.namaLengkap}
        nis={identitas.nis}
        halaman={1}
      />
    </div>
  );
}
