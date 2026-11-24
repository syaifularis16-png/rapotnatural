import React from 'react';
import {
  CustomRaporModule,
  SchoolProfile,
  SemesterPackage,
  StudentIdentity,
} from '../../types/rapor';
import { RaporFooter, RaporStudentHeader, SignatureBlock } from './DocumentShared';

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

      <h1 className="text-center text-[11.5pt] font-bold tracking-wide mt-5 mb-4 uppercase">
        {moduleData.judulDokumen}
      </h1>

      {moduleData.layout === 'tabel' ? (
        <table className="rapor-table text-[8.8pt] leading-[1.32]">
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
        <div className="border border-gray-600 p-4 text-[9.5pt] leading-[1.6] text-justify whitespace-pre-line min-h-[210px]">
          {moduleData.narasi || 'Isi keterangan modul belum ditulis.'}
        </div>
      )}

      {moduleData.catatan && (
        <div className="mt-5">
          <div className="text-[9.2pt] font-bold mb-1">Catatan</div>
          <div className="border border-gray-600 px-3 py-2.5 text-[9pt] italic min-h-[44px]">
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
