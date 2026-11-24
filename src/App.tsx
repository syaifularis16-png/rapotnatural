import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Award,
  BookOpen,
  Building2,
  CalendarPlus,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Download,
  Edit3,
  Eye,
  FilePlus2,
  FileStack,
  FileText,
  LayoutDashboard,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Square,
  Trash2,
  UserCheck,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  createBlankStudent,
  createCustomRaporModule,
  createNewSemesterPackage,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_STUDENTS,
  normalizeStudentRecord,
} from './data/defaultData';
import {
  CustomModuleLayout,
  P5Level,
  RaporModule,
  SchoolProfile,
  SemesterPackage,
  StudentRecord,
} from './types/rapor';
import { CoverPage } from './components/documents/CoverPage';
import { IdentitasPage } from './components/documents/IdentitasPage';
import { SumatifPage } from './components/documents/SumatifPage';
import { HasilBelajarPages } from './components/documents/HasilBelajarPages';
import { P5Pages } from './components/documents/P5Pages';
import { CustomModulePage } from './components/documents/CustomModulePage';
import { EditorPanel } from './components/EditorPanel';
import {
  AddModuleModal,
  AddSemesterModal,
  AddStudentModal,
  SchoolSettingsModal,
} from './components/Modals';
import { OverviewDashboard } from './components/OverviewDashboard';

const STORAGE_KEY = 'erapor_sman2_pasuruan_v1';

type ActiveView = 'overview' | RaporModule | 'custom';

const RAIL_ITEMS: {
  id: 'overview' | RaporModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'sampul', label: 'Sampul', icon: BookOpen },
  { id: 'identitas', label: 'Identitas', icon: UserCheck },
  { id: 'sumatif', label: 'Sumatif', icon: ClipboardCheck },
  { id: 'hasil_belajar', label: 'Rapor', icon: FileText },
  { id: 'p5', label: 'Projek P5', icon: Award },
];

export default function App() {
  const [school, setSchool] = useState<SchoolProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.school) return parsed.school;
      }
    } catch {
      // Ignore storage parse error
    }
    return DEFAULT_SCHOOL_PROFILE;
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.students) && parsed.students.length > 0) {
          return parsed.students.map(normalizeStudentRecord);
        }
      }
    } catch {
      // Ignore storage parse error
    }
    return DEFAULT_STUDENTS;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => students[0]?.id ?? '');
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [activeCustomModuleId, setActiveCustomModuleId] = useState<string | null>(null);
  const [activeSemesterId, setActiveSemesterId] = useState<string>(() => {
    const first = students[0];
    return first?.semesters[1]?.id ?? first?.semesters[0]?.id ?? 'sem-1';
  });
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0.78);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [printAllBundle, setPrintAllBundle] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [classTagFilter, setClassTagFilter] = useState<string>('');

  const [secSemestersOpen, setSecSemestersOpen] = useState<boolean>(true);
  const [secModulesOpen, setSecModulesOpen] = useState<boolean>(true);
  const [secStudentsOpen, setSecStudentsOpen] = useState<boolean>(true);
  const [secTagsOpen, setSecTagsOpen] = useState<boolean>(true);

  const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);
  const [addSemesterOpen, setAddSemesterOpen] = useState<boolean>(false);
  const [addModuleOpen, setAddModuleOpen] = useState<boolean>(false);
  const [schoolModalOpen, setSchoolModalOpen] = useState<boolean>(false);
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ school, students }));
    } catch {
      // Ignore quota errors
    }
  }, [school, students]);

  useEffect(() => {
    const onAfterPrint = () => {
      setPrintAllBundle(false);
    };
    window.addEventListener('afterprint', onAfterPrint);
    return () => window.removeEventListener('afterprint', onAfterPrint);
  }, []);

  const activeStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? students[0],
    [students, selectedStudentId]
  );

  const activeSemester: SemesterPackage = useMemo(() => {
    if (!activeStudent) {
      return DEFAULT_STUDENTS[0].semesters[1];
    }
    return (
      activeStudent.semesters.find((s) => s.id === activeSemesterId) ??
      activeStudent.semesters[activeStudent.semesters.length - 1] ??
      activeStudent.semesters[0]
    );
  }, [activeStudent, activeSemesterId]);

  const activeCustomModule = useMemo(() => {
    if (!activeCustomModuleId) return null;
    return (activeSemester.customModules ?? []).find((m) => m.id === activeCustomModuleId) ?? null;
  }, [activeSemester.customModules, activeCustomModuleId]);

  const availableClasses = useMemo(() => {
    const set = new Set(
      students
        .map((s) => s.semesters[s.semesters.length - 1]?.kelas || s.identitas.diterimaDiKelas)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const currentKelas =
        s.semesters[s.semesters.length - 1]?.kelas || s.identitas.diterimaDiKelas;
      const matchesSearch =
        !q ||
        s.identitas.namaLengkap.toLowerCase().includes(q) ||
        s.identitas.nis.toLowerCase().includes(q) ||
        s.identitas.nisn.toLowerCase().includes(q);
      const matchesClass = !classTagFilter || currentKelas === classTagFilter;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, classTagFilter]);

  const handleSelectStudent = (stu: StudentRecord) => {
    setSelectedStudentId(stu.id);
    const matchingSem =
      stu.semesters.find((s) => s.id === activeSemesterId) ??
      stu.semesters[stu.semesters.length - 1];
    if (matchingSem) {
      setActiveSemesterId(matchingSem.id);
    }
  };

  const handleUpdateStudent = (updated: StudentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (nama: string, nis: string, nisn: string, kelas: string) => {
    const created = createBlankStudent(nama, nis, nisn, kelas);
    setStudents((prev) => [...prev, created]);
    setSelectedStudentId(created.id);
    setActiveSemesterId(created.semesters[created.semesters.length - 1].id);
    setActiveView('identitas');
    setEditorOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (students.length <= 1) return;
    const remaining = students.filter((s) => s.id !== id);
    setStudents(remaining);
    if (selectedStudentId === id && remaining[0]) {
      handleSelectStudent(remaining[0]);
    }
  };

  const handleAddSemester = (payload: {
    semesterNumber: string;
    label: string;
    tahunPelajaran: string;
    kelas: string;
    fase: string;
    tanggalCetak: string;
    copyScores: boolean;
  }) => {
    if (!activeStudent) return;
    const lastSem = activeStudent.semesters[activeStudent.semesters.length - 1];
    const newSem = createNewSemesterPackage({
      ...payload,
      sourceSemester: lastSem,
    });
    const updatedStudent: StudentRecord = {
      ...activeStudent,
      semesters: [...activeStudent.semesters, newSem],
    };
    handleUpdateStudent(updatedStudent);
    setActiveSemesterId(newSem.id);
  };

  const handleDeleteSemester = (semId: string) => {
    if (!activeStudent || activeStudent.semesters.length <= 1) return;
    const nextSemesters = activeStudent.semesters.filter((s) => s.id !== semId);
    handleUpdateStudent({
      ...activeStudent,
      semesters: nextSemesters,
    });
    if (activeSemesterId === semId && nextSemesters[0]) {
      setActiveSemesterId(nextSemesters[nextSemesters.length - 1].id);
    }
  };

  const handleAddCustomModule = (payload: {
    menuLabel: string;
    judulDokumen: string;
    layout: CustomModuleLayout;
    preset: 'blank' | 'prestasi' | 'tahfidz' | 'konseling';
    tanggalCetak: string;
    applyToAllSemesters: boolean;
  }) => {
    if (!activeStudent) return;
    const baseMod = createCustomRaporModule(payload);
    const nextSemesters = activeStudent.semesters.map((sem) => {
      if (!payload.applyToAllSemesters && sem.id !== activeSemester.id) {
        return sem;
      }
      return {
        ...sem,
        customModules: [...(sem.customModules ?? []), structuredClone(baseMod)],
      };
    });

    handleUpdateStudent({
      ...activeStudent,
      semesters: nextSemesters,
    });
    setActiveCustomModuleId(baseMod.id);
    setActiveView('custom');
    setPrintAllBundle(false);
    setEditorOpen(true);
  };

  const handleDeleteCustomModule = (modId: string) => {
    if (!activeStudent) return;
    const nextSemesters = activeStudent.semesters.map((sem) =>
      sem.id === activeSemester.id
        ? {
            ...sem,
            customModules: (sem.customModules ?? []).filter((m) => m.id !== modId),
          }
        : sem
    );
    handleUpdateStudent({
      ...activeStudent,
      semesters: nextSemesters,
    });
    if (activeView === 'custom' && activeCustomModuleId === modId) {
      setActiveCustomModuleId(null);
      setActiveView('overview');
    }
  };

  const handleUpdateP5Level = (projectId: string, indicatorId: string, level: P5Level) => {
    if (!activeStudent) return;
    const nextProjects = activeSemester.p5.projects.map((proj) => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        indikator: proj.indikator.map((ind) =>
          ind.id === indicatorId ? { ...ind, level } : ind
        ),
      };
    });
    handleUpdateStudent({
      ...activeStudent,
      semesters: activeStudent.semesters.map((sem) =>
        sem.id === activeSemester.id
          ? { ...sem, p5: { ...sem.p5, projects: nextProjects } }
          : sem
      ),
    });
  };

  const handlePrintCurrent = () => {
    flushSync(() => {
      if (activeView === 'overview') {
        setPrintAllBundle(true);
      } else {
        setPrintAllBundle(false);
      }
    });
    window.print();
  };

  const handlePrintBundle = () => {
    flushSync(() => {
      setPrintAllBundle(true);
    });
    window.print();
  };

  const handleDownloadPrintableHtml = () => {
    flushSync(() => {
      if (activeView === 'overview') {
        setPrintAllBundle(true);
      }
    });
    const node = printAreaRef.current;
    if (!node) return;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');
    const studentTitle = activeStudent?.identitas.namaLengkap || 'Rapor';
    const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <base href="${window.location.origin}/" />
  <title>e-Rapor - ${studentTitle}</title>
  ${styles}
  <style>
    body { background: #ffffff !important; margin: 0; padding: 0; }
    .print-zoom-wrapper { zoom: 1 !important; transform: none !important; gap: 0 !important; }
    @media screen {
      body { background: #e2e8f0 !important; padding: 20px 0; }
      .rapor-sheet { margin: 0 auto 24px auto !important; }
    }
  </style>
</head>
<body>
  ${node.innerHTML}
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapor_${studentTitle.replace(/\s+/g, '_')}_${activeSemester.label.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (activeView === 'overview') {
      setPrintAllBundle(false);
    }
  };

  const handleResetDefaults = () => {
    setSchool(DEFAULT_SCHOOL_PROFILE);
    setStudents(DEFAULT_STUDENTS);
    setSelectedStudentId(DEFAULT_STUDENTS[0].id);
    setActiveSemesterId(DEFAULT_STUDENTS[0].semesters[1].id);
    setActiveView('overview');
    setActiveCustomModuleId(null);
    setSearchQuery('');
    setClassTagFilter('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setClassTagFilter('');
  };

  const activeModuleForEditor: RaporModule | 'custom' =
    activeView === 'overview' ? 'sumatif' : activeView;

  const customModules = activeSemester.customModules ?? [];

  const currentBreadcrumbLabel =
    activeView === 'custom'
      ? activeCustomModule?.menuLabel || 'Modul Tambahan'
      : RAIL_ITEMS.find((i) => i.id === activeView)?.label || '';

  return (
    <div className="min-h-screen h-screen flex flex-row bg-[#f1f4f7] text-slate-900 overflow-hidden print-layout-reset">
      {/* 1. LEFTMOST DARK ICON RAIL */}
      <aside className="w-[62px] bg-[#1e2328] text-slate-400 flex flex-col items-center py-2.5 justify-between shrink-0 border-r border-black/30 select-none no-print">
        <div className="flex flex-col items-center w-full gap-1.5">
          {/* Top '+' Add Student Circle Button */}
          <button
            type="button"
            onClick={() => setAddStudentOpen(true)}
            title="Tambah Peserta Didik"
            className="w-8 h-8 rounded-full bg-[#2c3238] hover:bg-[#3a4149] text-white flex items-center justify-center mb-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Rail Nav Items */}
          {RAIL_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id);
                  setActiveCustomModuleId(null);
                  setPrintAllBundle(false);
                }}
                className={`w-full py-1.5 flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                  active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                    active ? 'bg-[#00a0d2] text-white shadow-sm' : 'hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[10px] font-medium leading-none tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Quick Tambah Modul Rapor Icon on Rail */}
          <button
            type="button"
            onClick={() => setAddModuleOpen(true)}
            title="Tambah Modul Rapor"
            className="w-full py-1.5 mt-1 flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/5 border border-white/10">
              <FilePlus2 className="w-[17px] h-[17px] text-[#38bdf8]" />
            </div>
            <span className="text-[9.5px] font-medium leading-none tracking-tight whitespace-nowrap">
              + Modul
            </span>
          </button>

          {/* Quick Tambah Semester Icon on Rail */}
          <button
            type="button"
            onClick={() => setAddSemesterOpen(true)}
            title="Tambah Semester"
            className="w-full py-1.5 flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-md flex items-center justify-center hover:bg-white/5 border border-white/10">
              <CalendarPlus className="w-[17px] h-[17px] text-[#00a0d2]" />
            </div>
            <span className="text-[9.5px] font-medium leading-none tracking-tight whitespace-nowrap">
              + Sem
            </span>
          </button>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-2 w-full pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setSchoolModalOpen(true)}
            title="Pengaturan Sekolah"
            className="w-full py-1.5 flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/5">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-none">Sekolah</span>
          </button>

          {!filtersOpen && (
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              title="Tampilkan Panel Siswa"
              className="w-full py-1.5 flex flex-col items-center gap-1 text-[#00a0d2] hover:text-sky-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="text-[9px] leading-none">Panel</span>
            </button>
          )}
        </div>
      </aside>

      {/* 2. SECONDARY DARK FILTER, SEMESTER & STUDENT SIDEBAR */}
      {filtersOpen && (
        <aside className="hidden md:flex w-[232px] bg-[#2c3238] text-slate-300 flex-col shrink-0 border-r border-black/25 select-none no-print">
          {/* Top Search Input */}
          <div className="h-12 px-3 flex items-center border-b border-white/10">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari peserta didik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 text-xs bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5">
            {/* Clear Filters Button */}
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-1.5 px-3 text-xs font-medium text-slate-300 border border-slate-500/60 rounded hover:bg-white/5 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filter</span>
            </button>

            {/* Section: Daftar Semester + Tambah Semester Menu */}
            <div className="border-t border-white/10 pt-2.5">
              <button
                type="button"
                onClick={() => setSecSemestersOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 py-1 px-1 hover:text-white cursor-pointer"
              >
                <span>Semester ({activeStudent?.semesters.length ?? 0})</span>
                {secSemestersOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {secSemestersOpen && activeStudent && (
                <div className="mt-1.5 space-y-1">
                  {activeStudent.semesters.map((sem) => {
                    const isCurrent = sem.id === activeSemester.id;
                    return (
                      <div
                        key={sem.id}
                        onClick={() => setActiveSemesterId(sem.id)}
                        className={`group flex items-center justify-between gap-1.5 px-1.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                          isCurrent
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isCurrent ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#00a0d2] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-[11.5px]">{sem.label}</div>
                            <div className="text-[10px] text-slate-400 font-mono-tabular">
                              {sem.kelas} · {sem.tahunPelajaran}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {activeStudent.semesters.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSemester(sem.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-400 cursor-pointer"
                              title="Hapus semester"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-mono-tabular rounded-full ${
                              isCurrent
                                ? 'bg-[#00a0d2] text-white font-semibold'
                                : 'bg-[#1e2328] text-slate-400'
                            }`}
                          >
                            {sem.semesterNumber}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setAddSemesterOpen(true)}
                    className="w-full mt-1.5 py-1.5 px-2.5 text-xs font-medium text-[#38bdf8] bg-[#1e2328] hover:bg-[#232930] border border-[#00a0d2]/40 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Tambah Semester</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section: Modul Rapor + Tambah Modul Rapor Menu */}
            <div className="border-t border-white/10 pt-2.5">
              <button
                type="button"
                onClick={() => setSecModulesOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 py-1 px-1 hover:text-white cursor-pointer"
              >
                <span>Modul Rapor ({5 + customModules.length})</span>
                {secModulesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {secModulesOpen && (
                <div className="mt-1.5 space-y-0.5">
                  {[
                    { id: 'sampul' as RaporModule, name: 'Sampul Rapor', count: 1 },
                    { id: 'identitas' as RaporModule, name: 'Identitas Siswa', count: 18 },
                    {
                      id: 'sumatif' as RaporModule,
                      name: 'Nilai Sumatif',
                      count: activeSemester.sumatif.subjects.length,
                    },
                    {
                      id: 'hasil_belajar' as RaporModule,
                      name: 'Hasil Belajar',
                      count: activeSemester.hasilBelajar.subjects.length,
                    },
                    {
                      id: 'p5' as RaporModule,
                      name: 'Projek P5',
                      count: activeSemester.p5.projects.length,
                    },
                  ].map((mod) => {
                    const isCurrent = activeView === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          setActiveView(mod.id);
                          setActiveCustomModuleId(null);
                          setPrintAllBundle(false);
                        }}
                        className={`w-full flex items-center justify-between px-1.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          {isCurrent ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#00a0d2] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{mod.name}</span>
                        </span>
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-mono-tabular rounded-full shrink-0 ${
                            isCurrent
                              ? 'bg-[#00a0d2] text-white font-semibold'
                              : 'bg-[#1e2328] text-slate-400'
                          }`}
                        >
                          {mod.count}
                        </span>
                      </button>
                    );
                  })}

                  {/* Custom User Modules */}
                  {customModules.map((mod) => {
                    const isCurrent =
                      activeView === 'custom' && activeCustomModuleId === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          setActiveView('custom');
                          setActiveCustomModuleId(mod.id);
                          setPrintAllBundle(false);
                        }}
                        className={`group w-full flex items-center justify-between gap-1 px-1.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {isCurrent ? (
                            <CheckSquare className="w-3.5 h-3.5 text-[#00a0d2] shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{mod.menuLabel}</span>
                        </span>

                        <span className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomModule(mod.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-400 cursor-pointer"
                            title="Hapus modul"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-mono-tabular rounded-full ${
                              isCurrent
                                ? 'bg-[#00a0d2] text-white font-semibold'
                                : 'bg-[#1e2328] text-slate-400'
                            }`}
                          >
                            {mod.layout === 'tabel' ? mod.rows.length : 1}
                          </span>
                        </span>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setAddModuleOpen(true)}
                    className="w-full mt-1.5 py-1.5 px-2.5 text-xs font-medium text-[#38bdf8] bg-[#1e2328] hover:bg-[#232930] border border-[#00a0d2]/40 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    <span>Tambah Modul Rapor</span>
                  </button>
                </div>
              )}
            </div>

            {/* Section: Peserta Didik List */}
            <div className="border-t border-white/10 pt-2.5">
              <button
                type="button"
                onClick={() => setSecStudentsOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 py-1 px-1 hover:text-white cursor-pointer"
              >
                <span>Peserta Didik ({filteredStudents.length})</span>
                {secStudentsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {secStudentsOpen && (
                <div className="mt-1.5 space-y-1">
                  {filteredStudents.length === 0 ? (
                    <div className="text-[11px] text-slate-400 px-1.5 py-2">
                      Tidak ada siswa cocok.
                    </div>
                  ) : (
                    filteredStudents.map((stu) => {
                      const selected = stu.id === activeStudent?.id;
                      const latestKelas =
                        stu.semesters[stu.semesters.length - 1]?.kelas ||
                        stu.identitas.diterimaDiKelas;
                      return (
                        <div
                          key={stu.id}
                          onClick={() => handleSelectStudent(stu)}
                          className={`group flex items-center justify-between gap-1.5 px-1.5 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                            selected
                              ? 'bg-white/10 text-white'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {selected ? (
                              <CheckSquare className="w-3.5 h-3.5 text-[#00a0d2] shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <div className="truncate text-[11.5px] font-medium">
                                {stu.identitas.namaLengkap}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono-tabular">
                                {stu.identitas.nis} · {latestKelas}
                              </div>
                            </div>
                          </div>
                          {students.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStudent(stu.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                              title="Hapus siswa"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Section: Tags / Kelas */}
            <div className="border-t border-white/10 pt-2.5">
              <button
                type="button"
                onClick={() => setSecTagsOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 py-1 px-1 hover:text-white cursor-pointer"
              >
                <span>Kelas &amp; Label</span>
                {secTagsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {secTagsOpen && (
                <div className="mt-1.5 space-y-1">
                  {availableClasses.map((kelasName, idx) => {
                    const colors = [
                      'bg-emerald-500',
                      'bg-amber-500',
                      'bg-sky-500',
                      'bg-rose-500',
                    ];
                    const activeTag = classTagFilter === kelasName;
                    const countInClass = students.filter(
                      (s) =>
                        (s.semesters[s.semesters.length - 1]?.kelas ||
                          s.identitas.diterimaDiKelas) === kelasName
                    ).length;
                    return (
                      <button
                        key={kelasName}
                        type="button"
                        onClick={() =>
                          setClassTagFilter((prev) => (prev === kelasName ? '' : kelasName))
                        }
                        className={`w-full flex items-center justify-between px-1.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                          activeTag
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-xs ${colors[idx % colors.length]}`}
                          />
                          <span>Kelas {kelasName}</span>
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono-tabular bg-[#1e2328] text-slate-400 rounded-full">
                          {countInClass}
                        </span>
                      </button>
                    );
                  })}
                  <div className="flex items-center justify-between px-1.5 py-1 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-indigo-400" />
                      <span>Fase {activeSemester.fase}</span>
                    </span>
                    <span className="text-[10px] font-mono-tabular">
                      {activeSemester.tahunPelajaran}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="px-3 py-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 bg-[#252a30]">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sembunyikan</span>
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="hover:text-white transition-colors text-[11px] cursor-pointer"
              title="Kembalikan data contoh awal"
            >
              Reset Data
            </button>
          </div>
        </aside>
      )}

      {/* 3. RIGHT MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print-layout-reset">
        {/* DARK TOP BAR */}
        <header className="h-12 bg-[#1b2024] text-white px-5 flex items-center justify-between gap-4 shrink-0 border-b border-black/30 no-print">
          {/* Left: Context indicator */}
          <div className="flex items-center gap-2.5 text-xs text-slate-300 min-w-0">
            <span className="font-mono-tabular text-slate-400 hidden sm:inline">
              {activeSemester.tahunPelajaran}
            </span>
            <span className="hidden sm:inline text-slate-600">/</span>
            <span className="truncate font-medium text-slate-200">
              {activeStudent?.identitas.namaLengkap}
            </span>
          </div>

          {/* Center: Brand Logo & Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-6 h-6 rounded-full bg-[#00a0d2] flex items-center justify-center text-[11px] font-bold text-white">
              R
            </span>
            <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
              {school.namaSekolah}
            </span>
          </div>

          {/* Right: Functional Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAddModuleOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded border border-white/15 transition-colors whitespace-nowrap cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Tambah Modul</span>
            </button>

            <button
              type="button"
              onClick={() => setAddSemesterOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded border border-white/15 transition-colors whitespace-nowrap cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Tambah Semester</span>
            </button>

            <button
              type="button"
              onClick={() => setEditorOpen((prev) => !prev)}
              title={editorOpen ? 'Tutup Editor' : 'Edit Data Rapor'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                editorOpen
                  ? 'bg-[#00a0d2] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {editorOpen ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pratinjau</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Data</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrintCurrent}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#00a0d2] hover:bg-[#008bb8] rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak PDF</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT + OPTIONAL RIGHT EDITOR */}
        <div className="flex-1 flex min-h-0 overflow-hidden print-layout-reset">
          <main className="flex-1 flex flex-col min-w-0 bg-[#f1f4f7] overflow-hidden print-container">
            {/* Sub-Toolbar for Document Pages */}
            {activeView !== 'overview' && activeStudent && (
              <div className="bg-white border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveView('overview')}
                    className="text-[#008bb8] hover:underline font-medium cursor-pointer"
                  >
                    Overview
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-900">
                    {currentBreadcrumbLabel}
                  </span>

                  {(activeView === 'sumatif' ||
                    activeView === 'hasil_belajar' ||
                    activeView === 'p5' ||
                    activeView === 'custom') && (
                    <div className="flex flex-wrap items-center gap-1 p-0.5 bg-slate-100 rounded border border-slate-200 ml-1">
                      {activeStudent.semesters.map((sem) => (
                        <button
                          key={sem.id}
                          type="button"
                          onClick={() => setActiveSemesterId(sem.id)}
                          className={`px-2 py-0.5 text-[11px] font-medium rounded-sm whitespace-nowrap cursor-pointer ${
                            sem.id === activeSemester.id
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sem.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAddSemesterOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-[#008bb8] hover:bg-white rounded-sm whitespace-nowrap cursor-pointer"
                        title="Tambah Semester"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Semester</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded p-0.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.55, +(z - 0.1).toFixed(2)))}
                      className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                      title="Perkecil"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono-tabular font-medium text-slate-700 w-10 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(1.15, +(z + 0.1).toFixed(2)))}
                      className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                      title="Perbesar"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintCurrent}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-[#00a0d2] hover:bg-[#008bb8] rounded cursor-pointer"
                    title="Cetak modul aktif"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintBundle}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                  >
                    <FileStack className="w-3.5 h-3.5 text-[#00a0d2]" />
                    <span className="hidden sm:inline">Cetak Bundel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPrintableHtml}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                    title="Unduh file HTML siap cetak"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden md:inline">Unduh HTML</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCROLLABLE VIEWPORT */}
            <div className="flex-1 overflow-auto p-5 md:p-6 print-container">
              {activeStudent && activeView === 'overview' && !printAllBundle ? (
                <OverviewDashboard
                  student={activeStudent}
                  school={school}
                  activeSemester={activeSemester}
                  onNavigateModule={(mod) => {
                    setActiveView(mod);
                    setActiveCustomModuleId(null);
                    setPrintAllBundle(false);
                  }}
                  onNavigateCustomModule={(customId) => {
                    setActiveView('custom');
                    setActiveCustomModuleId(customId);
                    setPrintAllBundle(false);
                  }}
                  onOpenEditor={(mod) => {
                    setActiveView(mod);
                    setActiveCustomModuleId(null);
                    setEditorOpen(true);
                  }}
                  onPrintBundle={handlePrintBundle}
                  onSelectSemester={setActiveSemesterId}
                  onOpenAddSemester={() => setAddSemesterOpen(true)}
                  onOpenAddModule={() => setAddModuleOpen(true)}
                />
              ) : (
                activeStudent && (
                  <div ref={printAreaRef} className="flex justify-center items-start print-container">
                    <div
                      className="flex flex-col items-center gap-7 print-zoom-wrapper"
                      style={{ zoom }}
                    >
                      {printAllBundle ? (
                        <>
                          <CoverPage identitas={activeStudent.identitas} school={school} />
                          <IdentitasPage identitas={activeStudent.identitas} school={school} />
                          <SumatifPage
                            identitas={activeStudent.identitas}
                            school={school}
                            sumatif={activeSemester.sumatif}
                            fase={activeSemester.fase}
                            tahunPelajaran={activeSemester.tahunPelajaran}
                          />
                          <HasilBelajarPages
                            identitas={activeStudent.identitas}
                            school={school}
                            report={activeSemester.hasilBelajar}
                            fase={activeSemester.fase}
                            tahunPelajaran={activeSemester.tahunPelajaran}
                          />
                          <P5Pages
                            identitas={activeStudent.identitas}
                            school={school}
                            p5={activeSemester.p5}
                            interactive={editorOpen}
                            onUpdateLevel={handleUpdateP5Level}
                          />
                          {customModules.map((mod) => (
                            <CustomModulePage
                              key={mod.id}
                              identitas={activeStudent.identitas}
                              school={school}
                              semester={activeSemester}
                              moduleData={mod}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {activeView === 'sampul' && (
                            <CoverPage identitas={activeStudent.identitas} school={school} />
                          )}
                          {activeView === 'identitas' && (
                            <IdentitasPage identitas={activeStudent.identitas} school={school} />
                          )}
                          {activeView === 'sumatif' && (
                            <SumatifPage
                              identitas={activeStudent.identitas}
                              school={school}
                              sumatif={activeSemester.sumatif}
                              fase={activeSemester.fase}
                              tahunPelajaran={activeSemester.tahunPelajaran}
                            />
                          )}
                          {activeView === 'hasil_belajar' && (
                            <HasilBelajarPages
                              identitas={activeStudent.identitas}
                              school={school}
                              report={activeSemester.hasilBelajar}
                              fase={activeSemester.fase}
                              tahunPelajaran={activeSemester.tahunPelajaran}
                            />
                          )}
                          {activeView === 'p5' && (
                            <P5Pages
                              identitas={activeStudent.identitas}
                              school={school}
                              p5={activeSemester.p5}
                              interactive={editorOpen}
                              onUpdateLevel={handleUpdateP5Level}
                            />
                          )}
                          {activeView === 'custom' && activeCustomModule && (
                            <CustomModulePage
                              identitas={activeStudent.identitas}
                              school={school}
                              semester={activeSemester}
                              moduleData={activeCustomModule}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </main>

          {/* RIGHT EDITOR PANEL */}
          {editorOpen && activeStudent && (
            <aside className="w-full sm:w-[375px] bg-white border-l border-slate-200 overflow-y-auto p-5 shrink-0 no-print">
              <EditorPanel
                activeModule={activeModuleForEditor}
                activeCustomModuleId={activeCustomModuleId}
                activeSemester={activeSemester}
                student={activeStudent}
                onUpdateStudent={handleUpdateStudent}
              />
            </aside>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        open={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onCreate={handleAddStudent}
      />
      <AddSemesterModal
        open={addSemesterOpen}
        existingCount={activeStudent?.semesters.length ?? 2}
        defaultKelas={activeSemester.kelas}
        defaultTahun={activeSemester.tahunPelajaran}
        defaultFase={activeSemester.fase}
        onClose={() => setAddSemesterOpen(false)}
        onCreate={handleAddSemester}
      />
      <AddModuleModal
        open={addModuleOpen}
        defaultTanggalCetak={activeSemester.hasilBelajar.tanggalCetak}
        onClose={() => setAddModuleOpen(false)}
        onCreate={handleAddCustomModule}
      />
      <SchoolSettingsModal
        open={schoolModalOpen}
        school={school}
        onClose={() => setSchoolModalOpen(false)}
        onSave={setSchool}
      />
    </div>
  );
}
