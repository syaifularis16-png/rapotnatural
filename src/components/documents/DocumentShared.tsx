import React from 'react';
import { SchoolProfile, SignatureMode } from '../../types/rapor';
import { SchoolStamp, SignatureInk, VerificationQR } from '../OfficialGraphics';

interface HeaderBlockProps {
  nama: string;
  nis: string;
  nisn: string;
  school: SchoolProfile;
  kelas: string;
  fase: string;
  semester?: string;
  tahunPelajaran: string;
}

export function RaporStudentHeader({
  nama,
  nis,
  nisn,
  school,
  kelas,
  fase,
  semester,
  tahunPelajaran,
}: HeaderBlockProps) {
  return (
    <div
      className="grid grid-cols-[1.35fr_0.9fr] gap-4 leading-[1.48] text-gray-900"
      style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
    >
      <div className="grid grid-cols-[105px_12px_1fr]">
        <span>Nama</span>
        <span>:</span>
        <span>{nama}</span>

        <span>NIS/NISN</span>
        <span>:</span>
        <span className="tabular-nums">
          {nis} / {nisn}
        </span>

        <span>Nama Sekolah</span>
        <span>:</span>
        <span>{school.namaSekolah}</span>

        <span>Alamat</span>
        <span>:</span>
        <span>{school.alamat}</span>
      </div>

      <div className="grid grid-cols-[108px_12px_1fr]">
        <span>Kelas</span>
        <span>:</span>
        <span>{kelas}</span>

        <span>Fase</span>
        <span>:</span>
        <span>{fase}</span>

        {semester !== undefined && (
          <>
            <span>Semester</span>
            <span>:</span>
            <span className="tabular-nums">{semester}</span>
          </>
        )}

        <span>Tahun Pelajaran</span>
        <span>:</span>
        <span className="tabular-nums">{tahunPelajaran}</span>
      </div>
    </div>
  );
}

export function RaporFooter({
  kelas,
  nama,
  nis,
  halaman,
}: {
  kelas: string;
  nama: string;
  nis: string;
  halaman: number;
}) {
  return (
    <div
      className="mt-auto pt-2 border-t border-gray-400 flex items-center justify-between text-gray-800 tracking-tight"
      style={{ fontSize: 'calc(7.5pt * var(--doc-font-scale, 1))' }}
    >
      <div className="font-bold uppercase">
        <span>{kelas}</span>
        <span className="mx-2 text-gray-400">|</span>
        <span>{nama}</span>
        <span className="mx-3 text-gray-400">|</span>
        <span className="tabular-nums">{nis}</span>
      </div>
      <div className="flex items-center gap-6">
        <span>Halaman</span>
        <span className="tabular-nums">: &nbsp; {halaman}</span>
      </div>
    </div>
  );
}

export function SignatureBlock({
  kota,
  tanggalCetak,
  school,
  mode,
  studentName,
  docLabel,
}: {
  kota: string;
  tanggalCetak: string;
  school: SchoolProfile;
  mode: SignatureMode;
  studentName: string;
  docLabel: string;
}) {
  return (
    <div
      className="mt-4 leading-[1.38] text-gray-900"
      style={{ fontSize: 'calc(9.5pt * var(--doc-font-scale, 1))' }}
    >
      <div className="grid grid-cols-2 gap-8 items-start">
        {/* Left: Orang Tua/Wali */}
        <div className="pl-2">
          <div>Mengetahui</div>
          <div>Orang Tua/Wali,</div>
          <div className="h-[64px] flex items-center pl-2">
            <SignatureInk variant="ortu" />
          </div>
          <div className="w-[140px] border-b border-dotted border-gray-700" />
        </div>

        {/* Right: Wali Kelas */}
        <div className="pl-14">
          <div>
            {kota}, {tanggalCetak}
          </div>
          <div>Wali Kelas,</div>
          <div className="h-[64px] flex items-center pl-4">
            {mode === 'qr' ? (
              <VerificationQR
                payload={`VALID|WALI_KELAS|${school.waliKelas}|NIP:${school.nipWaliKelas}|${studentName}|${docLabel}|${tanggalCetak}`}
                label={school.waliKelas}
              />
            ) : (
              <SignatureInk variant="wali" />
            )}
          </div>
          <div className="font-bold">{school.waliKelas}</div>
          <div className="tabular-nums">NIP. {school.nipWaliKelas}</div>
        </div>
      </div>

      {/* Bottom Center: Kepala Sekolah */}
      <div className="mt-3 flex flex-col items-center relative">
        <div className="text-center relative">
          <div>Mengetahui</div>
          <div>Kepala Sekolah</div>
          <div className="h-[64px] flex items-center justify-center relative">
            {mode === 'qr' ? (
              <VerificationQR
                payload={`VALID|KEPALA_SEKOLAH|${school.kepalaSekolah}|NIP:${school.nipKepalaSekolah}|${school.namaSekolah}|${docLabel}|${tanggalCetak}`}
                label={school.kepalaSekolah}
              />
            ) : (
              <>
                <SignatureInk variant="kepala" />
                <div className="absolute -left-24 -top-6 pointer-events-none">
                  <SchoolStamp className="w-[106px] h-[106px] -rotate-12" />
                </div>
              </>
            )}
          </div>
          <div className="font-bold">{school.kepalaSekolah}</div>
          <div className="tabular-nums">NIP. {school.nipKepalaSekolah}</div>
        </div>
      </div>
    </div>
  );
}
