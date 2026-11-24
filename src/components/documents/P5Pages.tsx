import React from 'react';
import { P5Level, P5Project, P5Report, SchoolProfile, StudentIdentity } from '../../types/rapor';
import { RaporFooter, RaporStudentHeader, SignatureBlock } from './DocumentShared';

interface P5PagesProps {
  identitas: StudentIdentity;
  school: SchoolProfile;
  p5: P5Report;
  interactive?: boolean;
  onUpdateLevel?: (projectId: string, indicatorId: string, level: P5Level) => void;
}

const LEVELS: { key: P5Level; line1: string; line2: string; line3?: string }[] = [
  { key: 'MB', line1: 'Mulai', line2: 'Berkembang' },
  { key: 'SB_SEDANG', line1: 'Sedang', line2: 'Berkembang' },
  { key: 'BSH', line1: 'Berkembang', line2: 'Sesuai', line3: 'Harapan' },
  { key: 'SB', line1: 'Sangat', line2: 'Berkembang' },
];

export function P5Pages({
  identitas,
  school,
  p5,
  interactive = false,
  onUpdateLevel,
}: P5PagesProps) {
  const proj1 = p5.projects[0];
  const proj2 = p5.projects[1];
  const proj3 = p5.projects[2];

  return (
    <>
      {/* HALAMAN 1: Deskripsi Projek P5 */}
      <div className="rapor-sheet" style={{ padding: '14mm 15mm 10mm 15mm' }}>
        <h1 className="text-center text-[12pt] font-bold tracking-wide mb-5">
          RAPOR PROJEK PENGUATAN PROFIL PELAJAR PANCASILA
        </h1>

        <div className="pb-3 border-b border-gray-400">
          <RaporStudentHeader
            nama={identitas.namaLengkap}
            nis={identitas.nis}
            nisn={identitas.nisn}
            school={school}
            kelas={p5.kelasP5}
            fase={p5.fase}
            tahunPelajaran={p5.tahunPelajaran}
          />
        </div>

        <div className="mt-4 space-y-5 text-[9.3pt] leading-[1.48] text-gray-900">
          {p5.projects.map((proj) => (
            <div key={proj.id}>
              <div className="font-bold mb-1">
                <span>Projek {proj.nomor} &nbsp;|&nbsp; </span>
                <span className={proj.judulUpper ? 'uppercase' : ''}>{proj.judul}</span>
              </div>
              <p className="whitespace-pre-line text-justify">{proj.deskripsiRingkas}</p>
            </div>
          ))}
        </div>

        <RaporFooter
          kelas={p5.kelasFooter}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={1}
        />
      </div>

      {/* HALAMAN 2: Rubrik Projek 1 & Projek 2 */}
      <div className="rapor-sheet" style={{ padding: '12mm 14mm 10mm 14mm' }}>
        <RaporStudentHeader
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          nisn={identitas.nisn}
          school={school}
          kelas={p5.kelasP5}
          fase={p5.fase}
          tahunPelajaran={p5.tahunPelajaran}
        />

        {proj1 && (
          <div className="mt-4">
            <P5RubricTable
              project={proj1}
              interactive={interactive}
              onUpdateLevel={onUpdateLevel}
            />
            <div className="mt-2.5">
              <div className="text-[9.5pt] font-bold">Catatan Proses</div>
              <p className="rapor-catatan-proses text-[9.2pt] leading-[1.42] mt-1 text-justify">
                {proj1.catatanProses}
              </p>
            </div>
          </div>
        )}

        {proj2 && (
          <div className="mt-5">
            <P5RubricTable
              project={proj2}
              interactive={interactive}
              onUpdateLevel={onUpdateLevel}
            />
          </div>
        )}

        <RaporFooter
          kelas={p5.kelasFooter}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={2}
        />
      </div>

      {/* HALAMAN 3: Catatan Proses Projek 2, Rubrik & Catatan Projek 3, Tanda Tangan */}
      <div className="rapor-sheet" style={{ padding: '13mm 14mm 10mm 14mm' }}>
        {proj2 && (
          <div>
            <div className="text-[9.5pt] font-bold">Catatan Proses</div>
            <p className="rapor-catatan-proses text-[9.2pt] leading-[1.42] mt-1 text-justify">
              {proj2.catatanProses}
            </p>
          </div>
        )}

        {proj3 && (
          <div className="mt-4">
            <P5RubricTable
              project={proj3}
              interactive={interactive}
              onUpdateLevel={onUpdateLevel}
            />
            <div className="mt-2.5">
              <div className="text-[9.5pt] font-bold">Catatan Proses</div>
              <p className="rapor-catatan-proses text-[9.2pt] leading-[1.42] mt-1 text-justify">
                {proj3.catatanProses}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <SignatureBlock
            kota={school.kota}
            tanggalCetak={p5.tanggalCetak}
            school={school}
            mode={p5.signatureMode}
            studentName={identitas.namaLengkap}
            docLabel="RAPOR P5"
          />
        </div>

        <RaporFooter
          kelas={p5.kelasFooter}
          nama={identitas.namaLengkap}
          nis={identitas.nis}
          halaman={3}
        />
      </div>
    </>
  );
}

function P5RubricTable({
  project,
  interactive,
  onUpdateLevel,
}: {
  project: P5Project;
  interactive: boolean;
  onUpdateLevel?: (projectId: string, indicatorId: string, level: P5Level) => void;
}) {
  // Group consecutive indicators by dimensi so dimension headers render cleanly as in the scan
  const rows: { type: 'dimensi' | 'item'; dimensi: string; indicator?: P5Project['indikator'][number] }[] = [];
  let lastDim = '';
  for (const ind of project.indikator) {
    if (ind.dimensi !== lastDim) {
      rows.push({ type: 'dimensi', dimensi: ind.dimensi });
      lastDim = ind.dimensi;
    }
    rows.push({ type: 'item', dimensi: ind.dimensi, indicator: ind });
  }

  return (
    <table className="rapor-table text-[8.5pt] leading-[1.3]">
      <thead>
        <tr>
          <th className="w-[335px] text-left font-bold italic py-1.5">
            <div className="flex items-start gap-3">
              <span className="not-italic font-bold tabular-nums">{project.nomor}</span>
              <span className={project.judulUpper ? 'uppercase' : ''}>{project.judul}</span>
            </div>
          </th>
          {LEVELS.map((lvl) => (
            <th key={lvl.key} className="w-[74px] italic font-bold leading-tight py-1">
              <div>{lvl.line1}</div>
              <div>{lvl.line2}</div>
              {lvl.line3 && <div>{lvl.line3}</div>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          if (row.type === 'dimensi') {
            return (
              <tr key={`dim-${idx}`}>
                <td colSpan={5} className="font-bold py-1 pl-3 font-serif text-[9pt]">
                  {row.dimensi}
                </td>
              </tr>
            );
          }
          const ind = row.indicator!;
          return (
            <tr key={ind.id}>
              <td className="py-1.5 pl-2 pr-2 align-top">
                <div className="flex items-start gap-2">
                  <span className="text-[9pt] leading-[1.3] select-none">
                    {ind.marker === 'asterisk' ? '*' : '•'}
                  </span>
                  <span className="text-justify">{ind.deskripsi}</span>
                </div>
              </td>
              {LEVELS.map((lvl) => {
                const checked = ind.level === lvl.key;
                return (
                  <td
                    key={lvl.key}
                    onClick={() => {
                      if (interactive && onUpdateLevel) {
                        onUpdateLevel(project.id, ind.id, lvl.key);
                      }
                    }}
                    className={`text-center font-bold text-[10pt] transition-colors ${
                      interactive
                        ? 'cursor-pointer hover:bg-sky-50'
                        : ''
                    }`}
                    title={interactive ? `Klik untuk pilih ${lvl.line1} ${lvl.line2}` : undefined}
                  >
                    {checked ? '√' : ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
