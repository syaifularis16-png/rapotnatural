import React from 'react';
import { SchoolProfile, StudentIdentity } from '../../types/rapor';
import { SchoolStamp, SchoolWatermarkBackground, SignatureInk } from '../OfficialGraphics';

export function IdentitasPage({
  identitas,
  school,
}: {
  identitas: StudentIdentity;
  school: SchoolProfile;
}) {
  return (
    <div className="rapor-sheet" style={{ padding: '14mm 17mm 14mm 17mm' }}>
      <SchoolWatermarkBackground schoolName={school.namaSekolah} />

      <div className="relative z-10 flex-1 flex flex-col text-[10pt] leading-[1.68] text-gray-900">
        <h1 className="text-center text-[13pt] font-bold tracking-wide mb-5">
          IDENTITAS PESERTA DIDIK
        </h1>

        <div className="space-y-[2px]">
          <IdentityRow num="1." label="Nama Lengkap Peserta Didik" value={identitas.namaLengkap} />
          <IdentityRow
            num="2."
            label="Nomor Induk/NISN"
            value={`${identitas.nis} / ${identitas.nisn}`}
          />
          <IdentityRow num="3." label="Tempat ,Tanggal Lahir" value={identitas.tempatTanggalLahir} />
          <IdentityRow num="4." label="Jenis Kelamin" value={identitas.jenisKelamin} />
          <IdentityRow num="5." label="Agama" value={identitas.agama} />
          <IdentityRow num="6." label="Status dalam Keluarga" value={identitas.statusDalamKeluarga} />
          <IdentityRow num="7." label="Anak ke" value={identitas.anakKe} />
          <IdentityRow num="8." label="Alamat Peserta Didik" value={identitas.alamatPesertaDidik} />
          <IdentityRow num="9." label="Nomor Telepon Rumah" value={identitas.nomorTeleponRumah} />
          <IdentityRow num="10." label="Sekolah Asal" value={identitas.sekolahAsal} />
          <IdentityRow
            num="11."
            label="Diterima di sekolah ini"
            value={identitas.diterimaDiSekolahIni}
          />
          <IdentityRow num="12." label="Di kelas" value={identitas.diterimaDiKelas} />
          <IdentityRow num="" label="Pada tanggal" value={identitas.diterimaPadaTanggal} />
          <IdentityRow num="13." label="Nama Orang Tua" value="" />
          <IdentityRow num="" subLabel="a. Ayah" value={identitas.namaAyah} />
          <IdentityRow num="" subLabel="b. Ibu" value={identitas.namaIbu} />
          <IdentityRow num="14." label="Alamat Orang Tua" value={identitas.alamatOrangTua} />
          <IdentityRow num="" label="Nomor Telepon Rumah" value={identitas.teleponOrangTua} />
          <IdentityRow num="15." label="Pekerjaan Orang Tua :" value="" />
          <IdentityRow num="" subLabel="a. Ayah" value={identitas.pekerjaanAyah} />
          <IdentityRow num="" subLabel="b. Ibu" value={identitas.pekerjaanIbu} />
          <IdentityRow num="16." label="Nama Wali Siswa" value={identitas.namaWali} />
          <IdentityRow num="17." label="Alamat Wali Peserta Didik" value={identitas.alamatWali} />
          <IdentityRow num="" label="Nomor Telepon Rumah" value={identitas.teleponWali} />
          <IdentityRow num="18." label="Pekerjaan Wali Peserta Didik" value={identitas.pekerjaanWali} />
        </div>

        {/* Bottom Photo, Stamp & Principal Signature */}
        <div className="mt-auto pt-5 flex items-end justify-center gap-12 relative">
          {/* 3x4 Photo */}
          <div className="relative ml-6">
            <div className="w-[84px] h-[112px] border border-gray-400 bg-red-600 overflow-hidden">
              {identitas.fotoUrl ? (
                <img
                  src={identitas.fotoUrl}
                  alt={`Foto ${identitas.namaLengkap}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  3 x 4
                </div>
              )}
            </div>
            {/* Official Stamp overlapping right edge of photo & signature */}
            <div className="absolute -right-24 top-1 pointer-events-none z-20">
              <SchoolStamp className="w-[114px] h-[114px] -rotate-12" />
            </div>
          </div>

          {/* Signature */}
          <div className="text-[9.8pt] leading-[1.35] z-10">
            <div>
              {school.kota}, {identitas.tanggalIdentitas}
            </div>
            <div>Kepala Sekolah</div>
            <div className="h-[54px] flex items-center pl-2">
              <SignatureInk variant="kepala" />
            </div>
            <div className="font-bold">{school.kepalaSekolah}</div>
            <div className="tabular-nums">NIP. {school.nipKepalaSekolah}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityRow({
  num,
  label,
  subLabel,
  value,
}: {
  num: string;
  label?: string;
  subLabel?: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[28px_215px_14px_1fr] items-baseline">
      <span className="tabular-nums">{num}</span>
      <span className={subLabel ? 'pl-1' : ''}>{subLabel || label}</span>
      <span>{label || subLabel ? (label?.endsWith(':') ? '' : ':') : ''}</span>
      <span className="min-h-[1em]">{value}</span>
    </div>
  );
}
