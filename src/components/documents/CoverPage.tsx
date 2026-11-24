import React from 'react';
import { SchoolProfile, StudentIdentity } from '../../types/rapor';
import { EastJavaEmblem, SchoolWatermarkBackground, Sman2Logo } from '../OfficialGraphics';

export function CoverPage({
  identitas,
  school,
}: {
  identitas: StudentIdentity;
  school: SchoolProfile;
}) {
  return (
    <div className="rapor-sheet rapor-sheet-cover">
      <SchoolWatermarkBackground schoolName={school.namaSekolah} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-between py-2 text-center">
        {/* Top Coat of Arms */}
        <div className="flex flex-col items-center mt-2">
          <EastJavaEmblem className="w-[126px] h-[150px]" />
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1
            className="font-bold tracking-wide text-gray-900 leading-tight"
            style={{ fontSize: 'calc(19pt * var(--doc-font-scale, 1))' }}
          >
            SEKOLAH MENENGAH ATAS
          </h1>
          <div
            className="font-bold tracking-wider text-gray-900 mt-1"
            style={{ fontSize: 'calc(18pt * var(--doc-font-scale, 1))' }}
          >
            ( SMA )
          </div>
        </div>

        {/* School Emblem */}
        <div className="my-5">
          <Sman2Logo className="w-[138px] h-[138px]" />
        </div>

        {/* Student Name & NISN/NIS Boxes */}
        <div className="w-full max-w-[430px] flex flex-col items-center space-y-6 my-2">
          <div className="w-full">
            <div
              className="font-bold text-gray-900 mb-2"
              style={{ fontSize: 'calc(11.5pt * var(--doc-font-scale, 1))' }}
            >
              Nama Peserta Didik
            </div>
            <div
              className="border border-gray-700 bg-white/80 py-2.5 px-4 font-bold tracking-wide text-gray-900 uppercase"
              style={{ fontSize: 'calc(13pt * var(--doc-font-scale, 1))' }}
            >
              {identitas.namaLengkap}
            </div>
          </div>

          <div className="w-full">
            <div
              className="font-bold text-gray-900 mb-2"
              style={{ fontSize: 'calc(11.5pt * var(--doc-font-scale, 1))' }}
            >
              NISN / NIS
            </div>
            <div
              className="border border-gray-700 bg-white/80 py-2.5 px-4 font-bold tracking-wider text-gray-900 tabular-nums"
              style={{ fontSize: 'calc(12.5pt * var(--doc-font-scale, 1))' }}
            >
              {identitas.nisn} / {identitas.nis}
            </div>
          </div>
        </div>

        {/* Bottom Ministry Title */}
        <div
          className="mt-6 mb-2 font-bold tracking-wide text-gray-900 leading-[1.45]"
          style={{ fontSize: 'calc(13.5pt * var(--doc-font-scale, 1))' }}
        >
          <div>KEMENTERIAN PENDIDIKAN, KEBUDAYAAN,</div>
          <div>RISET DAN TEKNOLOGI</div>
          <div className="mt-1">REPUBLIK INDONESIA</div>
        </div>
      </div>
    </div>
  );
}
