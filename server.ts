import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function createAiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SCAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    detectedType: {
      type: Type.STRING,
      description:
        'Jenis dokumen rapor yang terdeteksi: salah satu dari "Sampul", "Identitas", "Sumatif", "Hasil Belajar", "Rapor P5", atau "Lainnya".',
    },
    confidenceSummary: {
      type: Type.STRING,
      description: 'Ringkasan singkat berbahasa Indonesia mengenai dokumen yang terbaca.',
    },
    school: {
      type: Type.OBJECT,
      properties: {
        namaSekolah: { type: Type.STRING },
        alamat: { type: Type.STRING },
        kota: { type: Type.STRING },
        provinsi: { type: Type.STRING },
        tahunPelajaran: { type: Type.STRING },
        fase: { type: Type.STRING },
        kepalaSekolah: { type: Type.STRING },
        nipKepalaSekolah: { type: Type.STRING },
        waliKelas: { type: Type.STRING },
        nipWaliKelas: { type: Type.STRING },
      },
    },
    identitas: {
      type: Type.OBJECT,
      properties: {
        namaLengkap: { type: Type.STRING },
        nis: { type: Type.STRING },
        nisn: { type: Type.STRING },
        tempatTanggalLahir: { type: Type.STRING },
        jenisKelamin: { type: Type.STRING },
        agama: { type: Type.STRING },
        statusDalamKeluarga: { type: Type.STRING },
        anakKe: { type: Type.STRING },
        alamatPesertaDidik: { type: Type.STRING },
        nomorTeleponRumah: { type: Type.STRING },
        sekolahAsal: { type: Type.STRING },
        diterimaDiSekolahIni: { type: Type.STRING },
        diterimaDiKelas: { type: Type.STRING },
        diterimaPadaTanggal: { type: Type.STRING },
        namaAyah: { type: Type.STRING },
        namaIbu: { type: Type.STRING },
        alamatOrangTua: { type: Type.STRING },
        teleponOrangTua: { type: Type.STRING },
        pekerjaanAyah: { type: Type.STRING },
        pekerjaanIbu: { type: Type.STRING },
        namaWali: { type: Type.STRING },
        alamatWali: { type: Type.STRING },
        teleponWali: { type: Type.STRING },
        pekerjaanWali: { type: Type.STRING },
        tanggalIdentitas: { type: Type.STRING },
      },
    },
    semesterMeta: {
      type: Type.OBJECT,
      properties: {
        semester: { type: Type.STRING },
        kelas: { type: Type.STRING },
        fase: { type: Type.STRING },
        tahunPelajaran: { type: Type.STRING },
        tanggalCetak: { type: Type.STRING },
      },
    },
    sumatifSubjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nama: { type: Type.STRING },
          rincian: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                nilai: { type: Type.NUMBER },
              },
              required: ['label', 'nilai'],
            },
          },
        },
        required: ['nama', 'rincian'],
      },
    },
    hasilBelajarSubjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nama: { type: Type.STRING },
          nilaiAkhir: { type: Type.NUMBER },
          capaianKompetensi: { type: Type.STRING },
        },
        required: ['nama', 'nilaiAkhir', 'capaianKompetensi'],
      },
    },
    ekstrakurikuler: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kegiatan: { type: Type.STRING },
          predikat: { type: Type.STRING },
          keterangan: { type: Type.STRING },
        },
      },
    },
    ketidakhadiran: {
      type: Type.OBJECT,
      properties: {
        sakit: { type: Type.INTEGER },
        izin: { type: Type.INTEGER },
        tanpaKeterangan: { type: Type.INTEGER },
      },
    },
    catatanWaliKelas: { type: Type.STRING },
    keteranganKenaikanKelas: { type: Type.STRING },
    p5Projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          nomor: { type: Type.INTEGER },
          judul: { type: Type.STRING },
          deskripsiRingkas: { type: Type.STRING },
          catatanProses: { type: Type.STRING },
          indikator: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dimensi: { type: Type.STRING },
                deskripsi: { type: Type.STRING },
                level: {
                  type: Type.STRING,
                  description:
                    'Salah satu dari MB, SB_SEDANG, BSH, SB, atau string kosong jika belum dicentang.',
                },
              },
            },
          },
        },
      },
    },
    dynamicDocument: {
      type: Type.OBJECT,
      description:
        'Representasi struktur, tata letak, kolom, baris, aturan/ketentuan, dan penandatangan persis sesuai gambar yang diunggah untuk membentuk tampilan Modul Rapor baru.',
      properties: {
        menuLabel: {
          type: Type.STRING,
          description:
            'Nama singkat menu di sidebar Modul Rapor (2-4 kata, misal "Kartu Poin", "Rapor Tahfidz", "Nilai Sumatif", "Catatan Konseling").',
        },
        judulDokumen: {
          type: Type.STRING,
          description: 'Judul utama dokumen persis seperti tertulis di gambar (huruf kapital).',
        },
        subJudul: {
          type: Type.STRING,
          description: 'Subjudul atau keterangan periode/unit di bawah judul utama jika ada.',
        },
        instansiHeader: {
          type: Type.STRING,
          description:
            'Teks kop surat / instansi paling atas jika tercantum di gambar (pisahkan baris dengan newline).',
        },
        formatStyle: {
          type: Type.STRING,
          description:
            'Format visual dokumen yang diunggah: "tabel", "narasi", "campuran", atau "identitas_grid".',
        },
        includeStudentHeader: {
          type: Type.BOOLEAN,
          description:
            'true jika dokumen memuat blok identitas siswa di bagian atas (Nama/NIS/Kelas/Sekolah), false jika hanya kop/judul langsung isi.',
        },
        metaPairs: {
          type: Type.ARRAY,
          description: 'Daftar pasangan label dan isi metadata atau poin ringkasan di luar tabel utama.',
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING },
            },
            required: ['label', 'value'],
          },
        },
        sections: {
          type: Type.ARRAY,
          description: 'Paragraf narasi, surat keterangan, atau butir ketentuan yang tercantum di dokumen.',
          items: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ['body'],
          },
        },
        tables: {
          type: Type.ARRAY,
          description:
            'FOKUS UTAMA OCR: semua tabel pada gambar (termasuk tabel utama nilai/poin/capaian, tabel ketidakhadiran, tabel ekstrakurikuler, maupun daftar bernomor identitas) dengan judul opsional, header kolom persis, dan baris data sejajar dengan kolom.',
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              columns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              rows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    cells: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['cells'],
                },
              },
            },
            required: ['columns', 'rows'],
          },
        },
        catatan: {
          type: Type.STRING,
          description: 'Catatan khusus, ketentuan, skor total, atau keterangan tambahan pada bagian bawah.',
        },
        tanggalCetak: { type: Type.STRING },
        signerLeftTitle: { type: Type.STRING },
        signerLeftName: { type: Type.STRING },
        signerRightTitle: { type: Type.STRING },
        signerRightName: { type: Type.STRING },
        signerRightNip: { type: Type.STRING },
      },
      required: ['menuLabel', 'judulDokumen', 'formatStyle', 'includeStudentHeader'],
    },
  },
  required: ['detectedType', 'confidenceSummary', 'dynamicDocument'],
};

async function parseScanWithRetry(
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  fileName?: string
) {
  const promptText = `Anda adalah sistem OCR presisi tinggi untuk aplikasi e-Rapor Sekolah Indonesia dengan FOKUS UTAMA pada ekstraksi TABEL OUTPUT yang akurat, rapi, dan sejajar kolom.
Tugas Anda: baca seluruh isi gambar yang diunggah${fileName ? ` (nama file: ${fileName})` : ''} secara persis apa adanya, lalu hasilkan JSON terstruktur agar aplikasi dapat menampilkan TABEL OUTPUT OCR dan membuat tampilan Modul Rapor yang sesuai.

Aturan PRIORITAS TABEL OUTPUT ("dynamicDocument.tables"):
1. Fokuskan ekstraksi utama pada setiap tabel yang terlihat pada gambar:
   - Salin header "columns" PERSIS seperti tertulis pada dokumen (misal ["No", "Mata Pelajaran", "Nilai Akhir", "Capaian Kompetensi"], ["No", "Mata Pelajaran", "Rerata Nilai", "Rincian Nilai Sumatif"], atau kolom kustom apa pun).
   - Untuk setiap baris pada tabel, panjang array "cells" HARUS SAMA PERSIS dengan jumlah "columns". JANGAN menggeser kolom atau menggabungkan dua sel berbeda menjadi satu.
   - Jika terdapat baris pengelompokan/subheader di dalam tabel (misalnya "A. Kelompok Mata Pelajaran Umum" atau "B. Kelompok Mata Pelajaran Pilihan"), masukkan ke "rows" dengan teks judul kelompok di sel pertama dan string kosong "" pada sisa sel (misal ["A. Kelompok Mata Pelajaran Umum", "", "", ""]), lalu lanjutkan baris data bernomor di bawahnya dengan kolom tetap sejajar.
   - Jika dalam satu gambar ada lebih dari satu tabel (misal tabel nilai utama + tabel Ketidakhadiran Sakit/Izin/Tanpa Keterangan + tabel Ekstrakurikuler), pisahkan menjadi objek tabel tersendiri di "dynamicDocument.tables" lengkap dengan "title" masing-masing.
   - Jika dokumen berbentuk daftar pasangan label:nilai tanpa garis tabel (misalnya halaman Identitas Siswa bernomor 1–17 atau biodata), selain mengisi "identitas" & "metaPairs", BUAT JUGA 1 tabel terstruktur di "dynamicDocument.tables" dengan columns ["No", "Uraian Data", "Isi"] agar selalu tersedia tabel output yang siap dibaca dan disalin.
2. Tentukan "detectedType":
   - "Sampul", "Identitas", "Sumatif", "Hasil Belajar", "Rapor P5", atau "Lainnya" (untuk dokumen jenis lain seperti Kartu Poin, Pelanggaran/Prestasi, Rapor Tahfidz, Transkrip, Sertifikat, Daftar Hadir, Catatan BK, dll.).
3. Lengkapi pula objek "dynamicDocument":
   - "menuLabel": nama singkat menu modul di sidebar (maks 3-4 kata).
   - "judulDokumen": judul utama persis seperti pada gambar.
   - "subJudul": subjudul/periode jika ada.
   - "instansiHeader": kop instansi/sekolah di bagian paling atas jika ada.
   - "formatStyle": pilih "tabel" jika ada tabel dominan, "campuran" jika gabungan narasi & tabel, "identitas_grid" jika kartu info tanpa tabel, atau "narasi" jika murni surat/uraian.
   - "includeStudentHeader": true bila memuat blok identitas siswa di bagian atas (Nama, NIS/NISN, Kelas, Sekolah), false bila tidak.
   - "metaPairs": semua pasangan "label" dan "value" di bagian atas atau ringkasan luar tabel.
   - "sections": blok teks/uraian paragraf jika ada.
   - "catatan": isi kotak catatan wali kelas, ketentuan, atau keterangan bawah jika ada.
   - "tanggalCetak", "signerLeftTitle", "signerLeftName", "signerRightTitle", "signerRightName", "signerRightNip": isi persis sesuai blok tanda tangan yang terlihat.
4. Tetap ekstrak data standar e-Rapor ("identitas", "school", "semesterMeta", "sumatifSubjects", "hasilBelajarSubjects", "ekstrakurikuler", "ketidakhadiran", "catatanWaliKelas", "keteranganKenaikanKelas", "p5Projects") bila sesuai dengan dokumen.
5. Untuk halaman Identitas, pisahkan NIS dan NISN jika tertulis beriringan (misal "13154 / 0097890979" -> nis: "13154", nisn: "0097890979").
6. Untuk Rapor P5, petakan tanda centang (√): "Mulai Berkembang" -> "MB", "Sedang Berkembang" -> "SB_SEDANG", "Berkembang Sesuai Harapan" -> "BSH", "Sangat Berkembang" -> "SB".
7. JANGAN mengarang teks/angka yang tidak terlihat di gambar. Pertahankan ejaan, angka, desimal, dan format asli dari unggahan.`;

  const candidates: { model: string; thinkingLevel: ThinkingLevel }[] = [
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW },
    { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  let lastError: unknown;
  let sawQuotaError = false;

  for (const candidate of candidates) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: candidate.model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              { text: promptText },
            ],
          },
          config: {
            thinkingConfig: { thinkingLevel: candidate.thinkingLevel },
            responseMimeType: 'application/json',
            responseSchema: SCAN_RESPONSE_SCHEMA,
          },
        });

        const rawText = (response.text ?? '{}').trim();
        return JSON.parse(rawText);
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);

        // If quota exhausted / rate-limited / model unavailable, try fallback model
        if (/429|RESOURCE_EXHAUSTED|quota|NOT_FOUND|404/i.test(msg)) {
          if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) {
            sawQuotaError = true;
          }
          break;
        }

        // Retry transient 5xx / high-demand errors with exponential backoff, then try fallback model
        const isTransient = /500|502|503|504|UNAVAILABLE|high demand|overloaded/i.test(msg);
        if (!isTransient) {
          throw err;
        }
        if (attempt === 3) {
          break;
        }
        await new Promise((r) => setTimeout(r, 700 * attempt));
      }
    }
  }

  if (lastError instanceof Error) {
    (lastError as Error & { sawQuotaError?: boolean }).sawQuotaError = sawQuotaError;
  }
  throw lastError;
}

function extractReadableErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw) as { error?: { message?: string } };
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // Keep raw message if not JSON
  }
  return raw;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/scan/parse', async (req, res) => {
    const ai = createAiClient();
    if (!ai) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY belum terkonfigurasi. Silakan periksa panel Settings > Secrets.',
      });
      return;
    }

    const body = req.body as {
      imageBase64?: string;
      mimeType?: string;
      fileName?: string;
    };

    if (!body?.imageBase64 || typeof body.imageBase64 !== 'string') {
      res.status(400).json({ error: 'Data gambar scan (imageBase64) wajib dikirim.' });
      return;
    }

    const cleanBase64 = body.imageBase64.includes(',')
      ? body.imageBase64.split(',')[1]
      : body.imageBase64;
    const mimeType = body.mimeType || 'image/jpeg';

    try {
      const parsed = await parseScanWithRetry(ai, cleanBase64, mimeType, body.fileName);

      // Normalize P5 indicator level values safely
      if (Array.isArray(parsed.p5Projects)) {
        const validLevels = new Set(['MB', 'SB_SEDANG', 'BSH', 'SB']);
        parsed.p5Projects = parsed.p5Projects.map((proj: Record<string, unknown>) => ({
          ...proj,
          indikator: Array.isArray(proj.indikator)
            ? proj.indikator.map((ind: Record<string, unknown>) => ({
                ...ind,
                level:
                  typeof ind.level === 'string' && validLevels.has(ind.level)
                    ? ind.level
                    : null,
              }))
            : [],
        }));
      }

      const validTypes = new Set([
        'Sampul',
        'Identitas',
        'Sumatif',
        'Hasil Belajar',
        'Rapor P5',
        'Lainnya',
      ]);
      if (!validTypes.has(parsed.detectedType)) {
        parsed.detectedType = 'Lainnya';
      }

      if (parsed.dynamicDocument && typeof parsed.dynamicDocument === 'object') {
        const dyn = parsed.dynamicDocument as Record<string, unknown>;
        const validStyles = new Set(['tabel', 'narasi', 'campuran', 'identitas_grid']);
        if (!validStyles.has(String(dyn.formatStyle))) {
          dyn.formatStyle =
            Array.isArray(dyn.tables) && dyn.tables.length > 0 ? 'tabel' : 'narasi';
        }
        if (Array.isArray(dyn.tables)) {
          dyn.tables = dyn.tables.map((tbl: Record<string, unknown>) => {
            const cols = Array.isArray(tbl.columns)
              ? tbl.columns.map((c) => String(c ?? '').trim())
              : [];
            const rawRows = Array.isArray(tbl.rows) ? tbl.rows : [];
            const normalizedRows: string[][] = rawRows.map((row: unknown) => {
              let rawCells: unknown[] = [];
              if (Array.isArray(row)) {
                rawCells = row;
              } else if (
                row &&
                typeof row === 'object' &&
                Array.isArray((row as { cells?: unknown[] }).cells)
              ) {
                rawCells = (row as { cells: unknown[] }).cells;
              }
              if (cols.length > 0) {
                return cols.map((_, idx) => String(rawCells[idx] ?? '').trim());
              }
              return rawCells.map((cell) => String(cell ?? '').trim());
            });
            return {
              title: typeof tbl.title === 'string' ? tbl.title.trim() || undefined : undefined,
              columns: cols,
              rows: normalizedRows,
            };
          });
        }
      }

      res.json({ parsed });
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : String(err);
      const readableMessage = extractReadableErrorMessage(err);
      const sawQuotaError = Boolean(
        err instanceof Error && (err as Error & { sawQuotaError?: boolean }).sawQuotaError
      );
      console.error('Error parsing scan JPG:', rawMessage);

      if (
        /PERMISSION_DENIED|API_KEY_INVALID|UNAUTHENTICATED|API key not valid|API_KEY_SERVICE_BLOCKED|401|403/i.test(
          rawMessage
        )
      ) {
        res.status(401).json({
          error:
            'Kunci API Gemini tidak valid atau ditolak. Pastikan kunci disalin utuh melalui tombol "Copy key" lalu ditempel ke Settings > Secrets sebagai GEMINI_API_KEY.',
        });
        return;
      }

      if (/429|RESOURCE_EXHAUSTED|quota/i.test(rawMessage)) {
        res.status(429).json({
          error:
            'Kuota harian Gemini API pada kunci saat ini sudah tercapai (rate limit / quota exceeded). Tunggu reset kuota atau gunakan kunci API berbayar di Settings > Secrets.',
        });
        return;
      }

      if (/503|UNAVAILABLE|high demand|overloaded/i.test(rawMessage)) {
        res.status(422).json({
          error: sawQuotaError
            ? 'Kuota harian model utama Gemini sedang habis dan model cadangan mengalami lonjakan permintaan sementara. Tunggu beberapa detik lalu klik "Baca OCR" lagi, atau gunakan kunci API berbayar di Settings > Secrets.'
            : 'Server AI Gemini sedang mengalami lonjakan permintaan sementara. Silakan tunggu beberapa detik lalu klik "Baca OCR" lagi.',
        });
        return;
      }

      if (/INVALID_ARGUMENT|Unable to process input image/i.test(rawMessage)) {
        res.status(400).json({
          error:
            'Gambar yang diunggah tidak dapat diproses. Pastikan format JPG/PNG utuh dan tidak rusak.',
        });
        return;
      }

      // Return 422 (never 502/503/504 which upstream proxies may intercept into an HTML page)
      res.status(422).json({
        error: `Gagal membaca dokumen scan: ${readableMessage}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`e-Rapor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
