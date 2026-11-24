import {
  CustomModuleLayout,
  CustomRaporModule,
  HasilBelajarReport,
  P5Report,
  SchoolProfile,
  SemesterPackage,
  StudentRecord,
  SumatifReport,
} from '../types/rapor';

export const DEFAULT_STUDENT_PHOTO = '/src/assets/images/pas_foto_sma_putri_1795488153637.jpg';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'SMA NEGERI 2 PASURUAN',
  alamat: 'JL. PANGLIMA SUDIRMAN 163',
  kota: 'Pasuruan',
  provinsi: 'JAWA TIMUR',
  tahunPelajaran: '2024/2025',
  fase: 'E',
  kepalaSekolah: 'Drs. Abdul Rokhim, M.Si',
  nipKepalaSekolah: '196606101990031017',
  waliKelas: 'Ika Hardiana, S.Pd',
  nipWaliKelas: '198606182022212050',
};

const BASE_SUMATIF_SEM2: SumatifReport = {
  semester: '2',
  kelas: 'X-7',
  tanggalCetak: '17 April 2025',
  signatureMode: 'qr',
  subjects: [
    {
      id: 'sum-1',
      nama: 'Pendidikan Agama Islam dan Budi Pekerti',
      rincian: [
        { label: 'Nilai 1', nilai: 82 },
        { label: 'Nilai 2', nilai: 85 },
        { label: 'Nilai 3', nilai: 85 },
      ],
    },
    {
      id: 'sum-2',
      nama: 'Pendidikan Pancasila',
      rincian: [
        { label: 'Nilai 1', nilai: 79 },
        { label: 'Nilai 2', nilai: 86 },
      ],
    },
    {
      id: 'sum-3',
      nama: 'Bahasa Indonesia',
      rincian: [
        { label: 'Nilai 1', nilai: 82 },
        { label: 'Nilai 2', nilai: 60 },
      ],
    },
    {
      id: 'sum-4',
      nama: 'Bahasa Inggris',
      rincian: [
        { label: 'Nilai 1', nilai: 82 },
        { label: 'Nilai 2', nilai: 84 },
      ],
    },
    {
      id: 'sum-5',
      nama: 'Matematika',
      rincian: [
        { label: 'Nilai 1', nilai: 80 },
        { label: 'Nilai 2', nilai: 70 },
      ],
    },
    {
      id: 'sum-6',
      nama: 'Biologi',
      rincian: [
        { label: 'Nilai 1', nilai: 75 },
        { label: 'Nilai 2', nilai: 65 },
      ],
    },
    {
      id: 'sum-7',
      nama: 'Fisika',
      rincian: [
        { label: 'Nilai 1', nilai: 88 },
        { label: 'Nilai 2', nilai: 53 },
        { label: 'Nilai 3', nilai: 20 },
      ],
    },
    {
      id: 'sum-8',
      nama: 'Kimia',
      rincian: [
        { label: 'Nilai 1', nilai: 36.67 },
        { label: 'Nilai 2', nilai: 86.67 },
      ],
    },
    {
      id: 'sum-9',
      nama: 'Geografi',
      rincian: [
        { label: 'Nilai 1', nilai: 78 },
        { label: 'Nilai 2', nilai: 70 },
        { label: 'Nilai 3', nilai: 78 },
        { label: 'Nilai 4', nilai: 70 },
      ],
    },
    {
      id: 'sum-10',
      nama: 'Sejarah',
      rincian: [
        { label: 'Nilai 1', nilai: 65 },
        { label: 'Nilai 2', nilai: 5 },
      ],
    },
    {
      id: 'sum-11',
      nama: 'Sosiologi',
      rincian: [
        { label: 'Nilai 1', nilai: 70 },
        { label: 'Nilai 2', nilai: 70 },
      ],
    },
    {
      id: 'sum-12',
      nama: 'Ekonomi',
      rincian: [
        { label: 'Nilai 1', nilai: 84 },
        { label: 'Nilai 2', nilai: 84 },
      ],
    },
    {
      id: 'sum-13',
      nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      rincian: [
        { label: 'Nilai 1', nilai: 83 },
        { label: 'Nilai 2', nilai: 87 },
      ],
    },
    {
      id: 'sum-14',
      nama: 'Prakarya dan Kewirausahaan',
      rincian: [
        { label: 'Nilai 1', nilai: 75 },
        { label: 'Nilai 2', nilai: 75 },
      ],
    },
    {
      id: 'sum-15',
      nama: 'Informatika',
      rincian: [{ label: 'Nilai 1', nilai: 75 }],
    },
    {
      id: 'sum-16',
      nama: 'Muatan Lokal Bahasa Daerah',
      rincian: [
        { label: 'Nilai 1', nilai: 80 },
        { label: 'Nilai 2', nilai: 85 },
        { label: 'Nilai 3', nilai: 85 },
        { label: 'Nilai 4', nilai: 95 },
      ],
    },
  ],
  ketidakhadiran: {
    sakit: 8,
    izin: 0,
    tanpaKeterangan: 0,
  },
  catatanWaliKelas: 'Tetap semangat dalam belajar dan terus tingkatkan prestasimu!',
};

const BASE_HASIL_SEM1: HasilBelajarReport = {
  semester: '1',
  kelas: 'X-7',
  tanggalCetak: '20 Desember 2024',
  signatureMode: 'qr',
  subjects: [
    {
      id: 'hb1-1',
      nama: 'Pendidikan Agama Islam dan Budi Pekerti',
      nilaiAkhir: 84,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menganalisis ayat dan hadits kompetensi dalam kebaikan dan etos kerja, serta sangat baik dalam hal Mampu menerapkan kompetensi dalam kebaikan dan etos kerja dalam kehidupan sehari-hari',
    },
    {
      id: 'hb1-2',
      nama: 'Pendidikan Pancasila',
      nilaiAkhir: 84,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Menganalisis cara pandang para pendiri negara tentang rumusan Pancasila sebagai dasar negara serta baik dalam hal Menganalisis fungsi, kedudukan Pancasila sebagai dasar negara dan ideologi negara',
    },
    {
      id: 'hb1-3',
      nama: 'Bahasa Indonesia',
      nilaiAkhir: 82,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal mengidentifikasi, menginterpretasi, mengonstruksi teks LHO, serta baik dalam hal mengidentifikasi, menginterpretasi, menganalisis, mengonstruksi teks anekdot.',
    },
    {
      id: 'hb1-4',
      nama: 'Bahasa Inggris',
      nilaiAkhir: 83,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Mengidentifikasi, menyusun, dan menyajikan teks deskriptif kepada publik melalui berbagai saluran, serta baik dalam hal Menganalisis dan mengemukakan pendapat kritis dalam teks transaksional.',
    },
    {
      id: 'hb1-5',
      nama: 'Matematika',
      nilaiAkhir: 77,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal menggenaralisasi sifat-sifat bilangan berpangkat dan logaritma serta baik dalam hal menerapkan barisan dan deret aritmatika dan geometri dalam permasalahan sehari-hari',
    },
    {
      id: 'hb1-6',
      nama: 'Ilmu Pengetahuan Alam (IPA)',
      nilaiAkhir: 76,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal mendeskripsikan dan mengimplementasikan konsep Kimia sesuai dengan Metode Ilmiah serta baik dalam hal mendeskripsikan Hakikat dan Peran Ilmu Kimia\nPerlu peningkatan dalam hal mendeskripsikan Hakikat dan Peran Ilmu Kimia',
    },
    {
      id: 'hb1-7',
      nama: 'Ilmu Pengetahuan Sosial (IPS)',
      nilaiAkhir: 80,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menginterpretasi citra dan menganalisis keruangan SIG\nPerlu penguatan dalam hal menjelaskan fenomena kelangkaan berdasarkan pengalaman dan perlu penguatan dalam Memahami fungsi sosiologi dan ragam gejala sosial, menjelaskan tindakan sosial dan hubungan sosial',
    },
    {
      id: 'hb1-8',
      nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      nilaiAkhir: 87,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Mengevaluasi dan mempraktekan passing bawah secara berkelompok dalam aktivitas bulutangkis, Baseball serta baik dalam hal menunjukkan kemampuan mempraktikkan hasil gerak serta evaluasi pada aktivitas atletik',
    },
    {
      id: 'hb1-9',
      nama: 'Prakarya dan Kewirausahaan',
      nilaiAkhir: 79,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Menganalisis pengolahan pangan higienis Nusantara dari bahan nabati, penyajian dan kemasan, serta baik dalam hal Menganalisis pengolahan pangan higienis Nusantara dari bahan nabati, penyajian dan kemasan.',
    },
    {
      id: 'hb1-10',
      nama: 'Informatika',
      nilaiAkhir: 83,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal mampu menjelaskan dan menerapkan algoritma standar serta baik dalam hal mampu mengintegrasi konten antar aplikasi perkantoran',
    },
  ],
  ekstrakurikuler: [
    { id: 'eks1-1', kegiatan: '', predikat: '', keterangan: '' },
    { id: 'eks1-2', kegiatan: '', predikat: '', keterangan: '' },
  ],
  ketidakhadiran: {
    sakit: 4,
    izin: 0,
    tanpaKeterangan: 0,
  },
  catatanWaliKelas: 'Tetap semangat dalam belajar dan terus tingkatkan prestasimu!',
  keteranganKenaikanKelas: '',
};

const BASE_HASIL_SEM2: HasilBelajarReport = {
  semester: '2',
  kelas: 'X-7',
  tanggalCetak: '21 Juni 2025',
  signatureMode: 'stamp',
  subjects: [
    {
      id: 'hb2-1',
      nama: 'Pendidikan Agama Islam dan Budi Pekerti',
      nilaiAkhir: 86,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menerapkan alkulliyatu al khomsah, serta sangat baik dalam hal Menganalisis peran Walisongo di Indonesia',
    },
    {
      id: 'hb2-2',
      nama: 'Pendidikan Pancasila',
      nilaiAkhir: 88,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menganalisis semangat kebangsaan dan tantangan yang akan dihadapi oleh rakyat Indonesia, serta sangat baik dalam hal Menyimpulkan, mendukung mekanisme perumusan regulasi yang berlaku di Indonesia',
    },
    {
      id: 'hb2-3',
      nama: 'Bahasa Indonesia',
      nilaiAkhir: 83,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Memahami dan menemukan nilai-nilai yang terkandung dalam hikayat serta baik dalam hal mengevaluasi, menganalisis, mengonstruksikan teks negosiasi',
    },
    {
      id: 'hb2-4',
      nama: 'Bahasa Inggris',
      nilaiAkhir: 83,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal mengidentifikasi, menyimpulkan, menyusun teks procedure dengan rinci',
    },
    {
      id: 'hb2-5',
      nama: 'Matematika',
      nilaiAkhir: 78,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal menyelesaikan persamaan dan fungsi kuadrat',
    },
    {
      id: 'hb2-6',
      nama: 'Ilmu Pengetahuan Alam (IPA)',
      nilaiAkhir: 80,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menganalisis konsep usaha dan energi serta hukum kekekalan energi dalam kehidupan sehari-hari, serta sangat baik dalam hal menganalisis struktur atom dan penerapannya dalam bidang kehidupan\nPerlu peningkatan dalam hal Menganalisis konsep usaha dan energi serta hukum kekekalan energi dalam kehidupan sehari-hari dan perlu peningkatan dalam hal Menganalisis masalah sumber energi dan dampaknya dalam kehidupan masyarakat modern',
    },
    {
      id: 'hb2-7',
      nama: 'Ilmu Pengetahuan Sosial (IPS)',
      nilaiAkhir: 84,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal Mendeskripsikan lithosfer dan proses perubahan bentuk muka bumi serta baik dalam hal Mendeskripsikan pedosfer dan horizon tanah\nPerlu peningkatan dalam hal Menganalisa kerajaan Hindu-Budha',
    },
    {
      id: 'hb2-8',
      nama: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      nilaiAkhir: 86,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal Menganalisis dan Mempraktikkan ketrampilan rangkaian senam mengikuti irama aktivitas gerak berirama, serta sangat baik dalam hal Memahami dan Mempresentasikan prinsip pergaulan sehat antar remaja di lingkungan sekolah',
    },
    {
      id: 'hb2-9',
      nama: 'Prakarya dan Kewirausahaan',
      nilaiAkhir: 81,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal mengembangkan desain produk, desain kemasan olahan nonpangan hewani untuk dipasarkan',
    },
    {
      id: 'hb2-10',
      nama: 'Informatika',
      nilaiAkhir: 85,
      capaianKompetensi:
        'Menunjukkan penguasaan yang baik dalam hal mampu memahami sejarah perkembangan komputer, bidang study dan profesi pada bidang informatika serta baik dalam hal mampu berkolaborasi, mendefinisikan persoalan yang didukung sistem komputasi\nPerlu penguatan dalam hal mampu menggunakan alat bantu untuk menulis, menjalankan, dan mengembangkan program pada analisi data',
    },
    {
      id: 'hb2-11',
      nama: 'Muatan Lokal Bahasa Daerah',
      nilaiAkhir: 87,
      capaianKompetensi:
        'Menunjukkan penguasaan yang sangat baik dalam hal memahami dan mengidentifikasi ciri drama tradisional serta ragam bahasa dalam komunikasi sehari-hari, serta sangat baik dalam hal menulis dan membaca teks beraksara jawa dari teks visual',
    },
  ],
  ekstrakurikuler: [
    { id: 'eks2-1', kegiatan: '', predikat: '', keterangan: '' },
    { id: 'eks2-2', kegiatan: '', predikat: '', keterangan: '' },
  ],
  ketidakhadiran: {
    sakit: 9,
    izin: 0,
    tanpaKeterangan: 0,
  },
  catatanWaliKelas: 'Tetap semangat dalam belajar dan terus tingkatkan prestasimu!',
  keteranganKenaikanKelas: 'Naik ke kelas XI',
};

const BASE_P5: P5Report = {
  kelasP5: '10',
  kelasFooter: 'X-7',
  fase: 'E',
  tahunPelajaran: '2024/2025',
  tanggalCetak: '19 Mei 2025',
  signatureMode: 'stamp',
  projects: [
    {
      id: 'p5-1',
      nomor: 1,
      judul: 'SEKOLAHKU NYAMAN TANPA PERUNDUNGAN',
      judulUpper: true,
      deskripsiRingkas:
        'Projek "Sekolahku Nyaman Tanpa Perundungan" yang mengangkat tema Bangunlah Jiwa dan Raganya bertujuan menciptakan kesempatan belajar murid untuk membentuk diri sesuai Profil Pelajar Pancasila. Projek ini juga bertujuan melatih kesehatan fisik dan mental secara berkelanjutan. projek dengan metode pembelajaran yang aktif dan berpusat pada murid ini diharapkan menjadi perangkat yang menawarkan titik temu kolaborasi dan mengidentifikasi pihak terkait untuk penyelesaian permasalahan perundungan di sekitar mereka.\nMelalui projek ini, peserta didik pada akhirnya diharapkan telah mengembangkan secara spesifik tiga dimensi Profil Pelajar Pancasila, yakni Bertakwa kepada Tuhan Yang Maha Esa, dan berakhlak mulia, gotong royong, dan mandiri.',
      indikator: [
        {
          id: 'p5-1-1',
          dimensi: 'Beriman, Bertakwa Kepada Tuhan Yang Maha Esa, dan Berakhlak Mulia',
          deskripsi:
            'Mengutamakan persamaan dengan orang lain dan menghargai perbedaan. Mengidentifikasi hal yang menjadi permasalahan bersama, memberikan alternatif solusi untuk menjembatani perbedaan dengan mengutamakan kemanusiaan.',
          marker: 'bullet',
          level: 'SB',
        },
        {
          id: 'p5-1-2',
          dimensi: 'Bergotong royong',
          deskripsi:
            'Tanggap terhadap lingkungan Sosial. Tanggap terhadap lingkungan sosial sesuai dengan tuntutan peran sosialnya dan berkontribusi sesuai dengan kebutuhan masyarakat untuk menghasilkan keadaan yang lebih baik.',
          marker: 'bullet',
          level: 'SB',
        },
        {
          id: 'p5-1-3',
          dimensi: 'Mandiri',
          deskripsi:
            'Regulasi emosi. Mengendalikan dan menyesuaikan emosi yang dirasakannya secara tepat ketika menghadapi situasi yang menantang dan menekan pada konteks belajar, relasi, dan pekerjaan',
          marker: 'bullet',
          level: 'SB',
        },
      ],
      catatanProses:
        'Dalam mengerjakan projek ini, FLOREAN FEBIOLA ARISANDI memiliki kemampuan yang sangat baik terutama Mengidentifikasi hal yang menjadi permasalahan bersama, memberikan alternatif solusi untuk menjembatani perbedaan dengan mengutamakan kemanusiaan., serta Tanggap terhadap lingkungan sosial sesuai dengan tuntutan peran sosialnya dan berkontribusi sesuai dengan kebutuhan masyarakat untuk menghasilkan keadaan yang lebih baik',
    },
    {
      id: 'p5-2',
      nomor: 2,
      judul: 'Sekolah Bersih, Hijau, dan Sehat',
      judulUpper: false,
      deskripsiRingkas:
        'Menekankan pentingnya mewujudkan rasa syukur melalui kesadaran terhadap lingkungan alam. Hal ini dilakukan dengan menciptakan dan mengimplementasikan solusi untuk permasalahan lingkungan yang ada. Proses ini melibatkan klarifikasi dan analisis kritis terhadap gagasan serta informasi kompleks dari berbagai sumber. Selanjutnya, individu diharapkan dapat memprioritaskan gagasan yang paling relevan dari hasil analisis tersebut. Selain itu, mereka juga diharapkan untuk menghasilkan gagasan yang beragam sebagai bentuk ekspresi pikiran dan perasaan, serta menilai gagasan tersebut dengan mempertimbangkan risiko dan berbagai perspektif, termasuk etika dan nilai kemanusiaan, saat merealisasikannya',
      indikator: [
        {
          id: 'p5-2-1',
          dimensi: 'Beriman, Bertakwa Kepada Tuhan Yang Maha Esa, dan Berakhlak Mulia',
          deskripsi:
            'Menjaga Lingkungan Alam Sekitar. Mewujudkan rasa syukur dengan membangun kesadaran peduli lingkungan alam dengan menciptakan dan mengimplementasikan solusi dari permasalahan lingkungan yang ada.',
          marker: 'bullet',
          level: 'SB',
        },
        {
          id: 'p5-2-2',
          dimensi: 'Bernalar kritis',
          deskripsi:
            'Mengidentifikasi, mengklarifikasi, dan mengolah informasi dan gagasan. Secara kritis mengklarifikasi serta menganalisis gagasan dan informasi yang kompleks dan abstrak dari berbagai sumber. Memprioritaskan suatu gagasan yang paling relevan dari hasil klarifikasi dan analisis.',
          marker: 'bullet',
          level: 'SB',
        },
        {
          id: 'p5-2-3',
          dimensi: 'Kreatif',
          deskripsi:
            'Menghasilkan karya dan tindakan yang orisinal. Menghasilkan kreatifitas siswa dalam berbaris indah dan menghasilkan karya orisinal dalam upaya peningkatan bela negara',
          marker: 'asterisk',
          level: 'SB',
        },
      ],
      catatanProses:
        'Dalam mengerjakan projek ini, FLOREAN FEBIOLA ARISANDI memiliki kemampuan yang sangat baik terutama Mewujudkan rasa syukur dengan membangun kesadaran peduli lingkungan alam dengan menciptakan dan mengimplementasikan solusi dari permasalahan lingkungan yang ada., serta Secara kritis mengklarifikasi serta menganalisis gagasan dan informasi yang kompleks dan abstrak dari berbagai sumber. Memprioritaskan suatu gagasan yang paling relevan dari hasil klarifikasi dan analisis.',
    },
    {
      id: 'p5-3',
      nomor: 3,
      judul: 'Pasuruan dalam Jejak Sejarah',
      judulUpper: false,
      deskripsiRingkas:
        'Projek yang bertema Kearifan Lokal dengan topik "Pasuruan dalam Jejak Sejarah" ini memberi kesempatan pada peserta didik untuk menggali warisan kearifan yang dimiliki oleh komunitas/masyarakat di daerah sekitar tempat tinggalnya. Peserta didik diajak untuk mendalami beragam budaya dan identitas budaya lokal untuk kemudian dengan penuh tanggungjawab merefleksikan pengalamannya terhadap kebinekaan tersebut.',
      indikator: [
        {
          id: 'p5-3-1',
          dimensi: 'Berkebinekaan global',
          deskripsi:
            'Mengeksplorasi dan membandingkan pengetahuan budaya, kepercayaan, serta praktiknya. Menganalisis dinamika budaya yang mencakup pemahaman, kepercayaan, dan praktik keseharian dalam rentang waktu yang panjang dan konteks yang luas.',
          marker: 'bullet',
          level: 'SB',
        },
        {
          id: 'p5-3-2',
          dimensi: 'Berkebinekaan global',
          deskripsi:
            'Menghilangkan stereotip dan prasangka. Mengkritik dan menolak stereotip serta prasangka tentang gambaran identitas kelompok dan suku bangsa serta berinisiatif mengajak orang lain untuk menolak stereotip dan prasangka.',
          marker: 'bullet',
          level: 'BSH',
        },
        {
          id: 'p5-3-3',
          dimensi: 'Bergotong royong',
          deskripsi:
            'Kerja sama. Membangun tim dan mengelola kerjasama untuk mencapai tujuan bersama sesuai dengan target yang sudah ditentukan.',
          marker: 'asterisk',
          level: 'SB',
        },
      ],
      catatanProses:
        'Dalam mengerjakan projek ini, FLOREAN FEBIOLA ARISANDI memiliki kemampuan yang sangat baik terutama menganalisis dinamika budaya yang mencakup pemahaman, kepercayaan, dan praktik keseharian dalam rentang waktu yang panjang dan konteks yang luas., serta membangun tim dan mengelola kerjasama untuk mencapai tujuan bersama sesuai dengan target yang sudah ditentukan.',
    },
  ],
};

export const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'student-florean',
    identitas: {
      namaLengkap: 'FLOREAN FEBYOLA ARISANDI',
      nis: '13154',
      nisn: '0097890979',
      tempatTanggalLahir: 'PASURUAN, 12 Februari 2009',
      jenisKelamin: 'Perempuan',
      agama: 'Islam',
      statusDalamKeluarga: 'Anak Kandung',
      anakKe: '2',
      alamatPesertaDidik: '',
      nomorTeleponRumah: '083848842259',
      sekolahAsal: 'UPT SMP NEGERI 3 PASURUAN',
      diterimaDiSekolahIni: '',
      diterimaDiKelas: 'X-7',
      diterimaPadaTanggal: '15 Juli 2024',
      namaAyah: 'SUPANDI',
      namaIbu: 'NUNUK NDARI ARIYANTI',
      alamatOrangTua: '',
      teleponOrangTua: '',
      pekerjaanAyah: 'Karyawan Swasta',
      pekerjaanIbu: 'Wiraswasta',
      namaWali: '',
      alamatWali: '',
      teleponWali: '',
      pekerjaanWali: '',
      fotoUrl: DEFAULT_STUDENT_PHOTO,
      tanggalIdentitas: '15 Juli 2024',
    },
    semesters: [
      {
        id: 'sem-1',
        label: 'Semester 1',
        semesterNumber: '1',
        tahunPelajaran: '2024/2025',
        kelas: 'X-7',
        fase: 'E',
        sumatif: {
          ...structuredClone(BASE_SUMATIF_SEM2),
          semester: '1',
          tanggalCetak: '18 Oktober 2024',
        },
        hasilBelajar: structuredClone(BASE_HASIL_SEM1),
        p5: structuredClone(BASE_P5),
      },
      {
        id: 'sem-2',
        label: 'Semester 2',
        semesterNumber: '2',
        tahunPelajaran: '2024/2025',
        kelas: 'X-7',
        fase: 'E',
        sumatif: structuredClone(BASE_SUMATIF_SEM2),
        hasilBelajar: structuredClone(BASE_HASIL_SEM2),
        p5: structuredClone(BASE_P5),
      },
    ],
  },
];

/**
 * Migrate any legacy localStorage record shape (with hasilBelajarSem1/2)
 * cleanly into the dynamic semesters[] array shape.
 */
export function normalizeStudentRecord(raw: unknown): StudentRecord {
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.semesters) && obj.semesters.length > 0) {
    return obj as unknown as StudentRecord;
  }
  const legacySumatif = (obj.sumatif as SumatifReport | undefined) ?? structuredClone(BASE_SUMATIF_SEM2);
  const legacyHb1 = (obj.hasilBelajarSem1 as HasilBelajarReport | undefined) ?? structuredClone(BASE_HASIL_SEM1);
  const legacyHb2 = (obj.hasilBelajarSem2 as HasilBelajarReport | undefined) ?? structuredClone(BASE_HASIL_SEM2);
  const legacyP5 = (obj.p5 as P5Report | undefined) ?? structuredClone(BASE_P5);

  return {
    id: (obj.id as string) || `student-${Date.now()}`,
    identitas: obj.identitas as StudentRecord['identitas'],
    semesters: [
      {
        id: 'sem-1',
        label: 'Semester 1',
        semesterNumber: '1',
        tahunPelajaran: legacyP5.tahunPelajaran || '2024/2025',
        kelas: legacyHb1.kelas || 'X-7',
        fase: legacyP5.fase || 'E',
        sumatif: { ...structuredClone(legacySumatif), semester: '1' },
        hasilBelajar: legacyHb1,
        p5: structuredClone(legacyP5),
      },
      {
        id: 'sem-2',
        label: 'Semester 2',
        semesterNumber: '2',
        tahunPelajaran: legacyP5.tahunPelajaran || '2024/2025',
        kelas: legacyHb2.kelas || 'X-7',
        fase: legacyP5.fase || 'E',
        sumatif: legacySumatif,
        hasilBelajar: legacyHb2,
        p5: legacyP5,
      },
    ],
  };
}

export function createBlankStudent(
  namaLengkap: string,
  nis: string,
  nisn: string,
  kelas: string
): StudentRecord {
  const template = structuredClone(DEFAULT_STUDENTS[0]);
  const upperName = namaLengkap.trim().toUpperCase() || 'PESERTA DIDIK BARU';
  const cleanKelas = kelas.trim() || 'X-7';
  template.id = `student-${Date.now()}`;
  template.identitas = {
    ...template.identitas,
    namaLengkap: upperName,
    nis: nis.trim() || '13155',
    nisn: nisn.trim() || '0098000001',
    tempatTanggalLahir: 'PASURUAN, 01 Januari 2009',
    alamatPesertaDidik: '',
    nomorTeleponRumah: '',
    diterimaDiKelas: cleanKelas,
    namaAyah: '',
    namaIbu: '',
    pekerjaanAyah: '',
    pekerjaanIbu: '',
    fotoUrl: DEFAULT_STUDENT_PHOTO,
  };
  template.semesters = template.semesters.map((sem) => ({
    ...sem,
    kelas: cleanKelas,
    sumatif: { ...sem.sumatif, kelas: cleanKelas },
    hasilBelajar: { ...sem.hasilBelajar, kelas: cleanKelas },
    p5: {
      ...sem.p5,
      kelasFooter: cleanKelas,
      projects: sem.p5.projects.map((proj) => ({
        ...proj,
        catatanProses: proj.catatanProses.replace(/FLOREAN FEBIOLA ARISANDI/g, upperName),
      })),
    },
  }));
  return template;
}

export function createNewSemesterPackage(options: {
  semesterNumber: string;
  label: string;
  tahunPelajaran: string;
  kelas: string;
  fase: string;
  tanggalCetak: string;
  sourceSemester?: SemesterPackage;
  copyScores: boolean;
}): SemesterPackage {
  const base = options.sourceSemester
    ? structuredClone(options.sourceSemester)
    : structuredClone(DEFAULT_STUDENTS[0].semesters[1]);

  const semNum = options.semesterNumber.trim() || '3';
  const cleanKelas = options.kelas.trim() || base.kelas;
  const cleanFase = options.fase.trim() || base.fase;
  const cleanTahun = options.tahunPelajaran.trim() || base.tahunPelajaran;
  const cleanTanggal = options.tanggalCetak.trim() || '19 Desember 2025';
  const isEven = Number(semNum) % 2 === 0;

  return {
    id: `sem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: options.label.trim() || `Semester ${semNum}`,
    semesterNumber: semNum,
    tahunPelajaran: cleanTahun,
    kelas: cleanKelas,
    fase: cleanFase,
    sumatif: {
      ...base.sumatif,
      semester: semNum,
      kelas: cleanKelas,
      tanggalCetak: cleanTanggal,
      ketidakhadiran: options.copyScores
        ? base.sumatif.ketidakhadiran
        : { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      subjects: base.sumatif.subjects.map((sub, idx) => ({
        ...sub,
        id: `sum-${Date.now()}-${idx}`,
        rincian: options.copyScores
          ? sub.rincian
          : [{ label: 'Nilai 1', nilai: 80 }],
      })),
    },
    hasilBelajar: {
      ...base.hasilBelajar,
      semester: semNum,
      kelas: cleanKelas,
      tanggalCetak: cleanTanggal,
      ketidakhadiran: options.copyScores
        ? base.hasilBelajar.ketidakhadiran
        : { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      keteranganKenaikanKelas: isEven ? base.hasilBelajar.keteranganKenaikanKelas : '',
      subjects: base.hasilBelajar.subjects.map((sub, idx) => ({
        ...sub,
        id: `hb-${Date.now()}-${idx}`,
        nilaiAkhir: options.copyScores ? sub.nilaiAkhir : 80,
      })),
    },
    p5: {
      ...base.p5,
      kelasP5: cleanKelas.replace(/[^0-9]/g, '') || base.p5.kelasP5,
      kelasFooter: cleanKelas,
      fase: cleanFase,
      tahunPelajaran: cleanTahun,
      tanggalCetak: cleanTanggal,
    },
    customModules: (base.customModules ?? []).map((mod) => ({
      ...structuredClone(mod),
      tanggalCetak: cleanTanggal,
    })),
  };
}

export function createCustomRaporModule(options: {
  menuLabel: string;
  judulDokumen: string;
  layout: CustomModuleLayout;
  preset: 'blank' | 'prestasi' | 'tahfidz' | 'konseling';
  tanggalCetak: string;
}): CustomRaporModule {
  const id = `mod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const menuLabel = options.menuLabel.trim() || 'Modul Baru';
  const judulDokumen =
    options.judulDokumen.trim().toUpperCase() || menuLabel.toUpperCase();

  if (options.preset === 'prestasi') {
    return {
      id,
      menuLabel,
      judulDokumen,
      layout: 'tabel',
      kolomAspek: 'Nama Prestasi / Lomba',
      kolomNilai: 'Tingkat / Peringkat',
      kolomKeterangan: 'Penyelenggara & Keterangan',
      rows: [
        {
          id: `${id}-r1`,
          aspek: 'Olimpiade Sains Nasional (OSN) Bidang Informatika',
          nilai: 'Juara 2 Kota',
          keterangan: 'Diselenggarakan oleh Dinas Pendidikan Provinsi Jawa Timur.',
        },
        {
          id: `${id}-r2`,
          aspek: 'Lomba Karya Tulis Ilmiah Remaja',
          nilai: 'Finalis',
          keterangan: 'Berpartisipasi aktif dan menghasilkan karya ilmiah terpuji.',
        },
      ],
      narasi: '',
      catatan: 'Terus kembangkan bakat dan prestasi akademik maupun non-akademik.',
      tanggalCetak: options.tanggalCetak,
      signatureMode: 'stamp',
    };
  }

  if (options.preset === 'tahfidz') {
    return {
      id,
      menuLabel,
      judulDokumen,
      layout: 'tabel',
      kolomAspek: 'Materi / Surah / Hafalan',
      kolomNilai: 'Nilai / Predikat',
      kolomKeterangan: 'Capaian & Catatan Pembimbing',
      rows: [
        {
          id: `${id}-r1`,
          aspek: 'Juz 30 (An-Naba s.d. An-Nas)',
          nilai: '90 (Sangat Baik)',
          keterangan: 'Hafalan lancar dengan makhraj dan tajwid yang baik.',
        },
        {
          id: `${id}-r2`,
          aspek: 'Adab & Praktik Ibadah Harian',
          nilai: 'A',
          keterangan: 'Konsisten melaksanakan shalat berjamaah dan tilawah pagi.',
        },
      ],
      narasi: '',
      catatan: 'Pertahankan hafalan dan amalkan nilai Al-Quran dalam keseharian.',
      tanggalCetak: options.tanggalCetak,
      signatureMode: 'qr',
    };
  }

  if (options.preset === 'konseling') {
    return {
      id,
      menuLabel,
      judulDokumen,
      layout: 'narasi',
      kolomAspek: 'Aspek Pengamatan',
      kolomNilai: 'Predikat',
      kolomKeterangan: 'Uraian',
      rows: [],
      narasi:
        'Peserta didik menunjukkan perkembangan sikap disiplin, tanggung jawab, serta kemampuan komunikasi interpersonal yang positif di lingkungan sekolah.\n\nBerdasarkan pemantauan bimbingan konseling dan wali kelas selama semester berjalan, peserta didik mampu mengelola waktu belajar dengan baik dan aktif berpartisipasi dalam kegiatan kelas.',
      catatan: 'Rekomendasi: Dukung terus minat belajar di bidang sains dan literasi.',
      tanggalCetak: options.tanggalCetak,
      signatureMode: 'qr',
    };
  }

  return {
    id,
    menuLabel,
    judulDokumen,
    layout: options.layout,
    kolomAspek: 'Komponen / Aspek Penilaian',
    kolomNilai: 'Nilai',
    kolomKeterangan: 'Keterangan / Capaian',
    rows: [
      {
        id: `${id}-r1`,
        aspek: 'Komponen 1',
        nilai: '85',
        keterangan: 'Menunjukkan penguasaan yang baik pada aspek yang dinilai.',
      },
      {
        id: `${id}-r2`,
        aspek: 'Komponen 2',
        nilai: '88',
        keterangan: 'Aktif berpartisipasi dan menyelesaikan tugas dengan sangat baik.',
      },
    ],
    narasi:
      'Dengan ini menerangkan bahwa peserta didik yang tercantum di atas telah mengikuti dan menyelesaikan seluruh rangkaian kegiatan pembelajaran dengan baik.',
    catatan: 'Tetap semangat dalam belajar dan terus tingkatkan prestasimu!',
    tanggalCetak: options.tanggalCetak,
    signatureMode: 'qr',
  };
}

export function calculateAverage(rincian: { nilai: number }[]): number {
  if (!rincian.length) return 0;
  const sum = rincian.reduce((acc, item) => acc + (Number.isFinite(item.nilai) ? item.nilai : 0), 0);
  return sum / rincian.length;
}
