import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Building2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Edit3,
  Eye,
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
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_STUDENTS,
} from './data/defaultData';
import { P5Level, RaporModule, SchoolProfile, StudentRecord } from './types/rapor';
import { CoverPage } from './components/documents/CoverPage';
import { IdentitasPage } from './components/documents/IdentitasPage';
import { SumatifPage } from './components/documents/SumatifPage';
import { HasilBelajarPages } from './components/documents/HasilBelajarPages';
import { P5Pages } from './components/documents/P5Pages';
import { EditorPanel } from './components/EditorPanel';
import { AddStudentModal, SchoolSettingsModal } from './components/Modals';
import { OverviewDashboard } from './components/OverviewDashboard';

const STORAGE_KEY = 'erapor_sman2_pasuruan_v1';

type ActiveView = 'overview' | RaporModule;

const RAIL_ITEMS: {
  id: ActiveView;
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
          return parsed.students;
        }
      }
    } catch {
      // Ignore storage parse error
    }
    return DEFAULT_STUDENTS;
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => students[0]?.id ?? '');
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [activeSemester, setActiveSemester] = useState<'1' | '2'>('2');
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0.78);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [printAllBundle, setPrintAllBundle] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [classTagFilter, setClassTagFilter] = useState<string>('');

  const [secModulesOpen, setSecModulesOpen] = useState<boolean>(true);
  const [secStudentsOpen, setSecStudentsOpen] = useState<boolean>(true);
  const [secTagsOpen, setSecTagsOpen] = useState<boolean>(true);

  const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);
  const [schoolModalOpen, setSchoolModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ school, students }));
    } catch {
      // Ignore quota errors
    }
  }, [school, students]);

  const activeStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? students[0],
    [students, selectedStudentId]
  );

  const availableClasses = useMemo(() => {
    const set = new Set(students.map((s) => s.sumatif.kelas).filter(Boolean));
    return Array.from(set);
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        !q ||
        s.identitas.namaLengkap.toLowerCase().includes(q) ||
        s.identitas.nis.toLowerCase().includes(q) ||
        s.identitas.nisn.toLowerCase().includes(q);
      const matchesClass = !classTagFilter || s.sumatif.kelas === classTagFilter;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, classTagFilter]);

  const handleUpdateStudent = (updated: StudentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (nama: string, nis: string, nisn: string, kelas: string) => {
    const created = createBlankStudent(nama, nis, nisn, kelas);
    setStudents((prev) => [...prev, created]);
    setSelectedStudentId(created.id);
    setActiveView('identitas');
    setEditorOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (students.length <= 1) return;
    const remaining = students.filter((s) => s.id !== id);
    setStudents(remaining);
    if (selectedStudentId === id && remaining[0]) {
      setSelectedStudentId(remaining[0].id);
    }
  };

  const handleUpdateP5Level = (projectId: string, indicatorId: string, level: P5Level) => {
    if (!activeStudent) return;
    const nextProjects = activeStudent.p5.projects.map((proj) => {
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
      p5: { ...activeStudent.p5, projects: nextProjects },
    });
  };

  const handlePrintCurrent = () => {
    if (activeView === 'overview') {
      setPrintAllBundle(true);
    } else {
      setPrintAllBundle(false);
    }
    setTimeout(() => {
      window.print();
    }, 80);
  };

  const handlePrintBundle = () => {
    setPrintAllBundle(true);
    setTimeout(() => {
      window.print();
    }, 80);
  };

  const handleResetDefaults = () => {
    setSchool(DEFAULT_SCHOOL_PROFILE);
    setStudents(DEFAULT_STUDENTS);
    setSelectedStudentId(DEFAULT_STUDENTS[0].id);
    setSearchQuery('');
    setClassTagFilter('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setClassTagFilter('');
  };

  const activeModuleForEditor: RaporModule =
    activeView === 'overview' ? 'sumatif' : activeView;

  const hasilSubjectsCount = activeStudent
    ? (activeSemester === '1'
        ? activeStudent.hasilBelajarSem1.subjects.length
        : activeStudent.hasilBelajarSem2.subjects.length)
    : 0;

  return (
    <div className="min-h-screen h-screen flex flex-row bg-[#f1f4f7] text-slate-900 overflow-hidden print:h-auto print:overflow-visible print:block">
      {/* 1. LEFTMOST DARK ICON RAIL (ManageWP style) */}
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

      {/* 2. SECONDARY DARK FILTER & STUDENT SIDEBAR */}
      {filtersOpen && (
        <aside className="hidden md:flex w-[224px] bg-[#2c3238] text-slate-300 flex-col shrink-0 border-r border-black/25 select-none no-print">
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

            {/* Section: Modul & Semester */}
            <div className="border-t border-white/10 pt-2.5">
              <button
                type="button"
                onClick={() => setSecModulesOpen((v) => !v)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-300 py-1 px-1 hover:text-white cursor-pointer"
              >
                <span>Modul Rapor</span>
                {secModulesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {secModulesOpen && (
                <div className="mt-2 space-y-2">
                  {/* Dark Segmented Control: Semester 1 | Semester 2 */}
                  <div className="grid grid-cols-2 bg-[#1e2328] p-0.5 rounded border border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveSemester('1')}
                      className={`py-1 text-[11px] font-medium rounded-sm transition-colors cursor-pointer ${
                        activeSemester === '1'
                          ? 'bg-[#3c434a] text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Semester 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSemester('2')}
                      className={`py-1 text-[11px] font-medium rounded-sm transition-colors cursor-pointer ${
                        activeSemester === '2'
                          ? 'bg-[#3c434a] text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Semester 2
                    </button>
                  </div>

                  {/* Module Rows with Dark/Blue Count Indicators */}
                  <div className="space-y-0.5">
                    {[
                      { id: 'sampul' as RaporModule, name: 'Sampul Rapor', count: 1 },
                      { id: 'identitas' as RaporModule, name: 'Identitas Siswa', count: 18 },
                      {
                        id: 'sumatif' as RaporModule,
                        name: 'Nilai Sumatif',
                        count: activeStudent?.sumatif.subjects.length ?? 0,
                      },
                      {
                        id: 'hasil_belajar' as RaporModule,
                        name: 'Hasil Belajar',
                        count: hasilSubjectsCount,
                      },
                      {
                        id: 'p5' as RaporModule,
                        name: 'Projek P5',
                        count: activeStudent?.p5.projects.length ?? 0,
                      },
                    ].map((mod) => {
                      const isCurrent = activeView === mod.id;
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => {
                            setActiveView(mod.id);
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
                  </div>
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
                      return (
                        <div
                          key={stu.id}
                          onClick={() => setSelectedStudentId(stu.id)}
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
                                {stu.identitas.nis} · {stu.sumatif.kelas}
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
                      (s) => s.sumatif.kelas === kelasName
                    ).length;
                    return (
                      <button
                        key={kelasName}
                        type="button"
                        onClick={() =>
                          setClassTagFilter((prev) =>
                            prev === kelasName ? '' : kelasName
                          )
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
                      <span>Fase {school.fase}</span>
                    </span>
                    <span className="text-[10px] font-mono-tabular">{school.tahunPelajaran}</span>
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

      {/* 3. RIGHT MAIN COLUMN: Dark Top Header + Light Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        {/* DARK TOP BAR (ManageWP style) */}
        <header className="h-12 bg-[#1b2024] text-white px-5 flex items-center justify-between gap-6 shrink-0 border-b border-black/30 no-print">
          {/* Left: Context indicator */}
          <div className="flex items-center gap-3 text-xs text-slate-300 min-w-0">
            <span className="font-mono-tabular text-slate-400 hidden sm:inline">
              {school.tahunPelajaran}
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
          <div className="flex items-center gap-3 shrink-0">
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
        <div className="flex-1 flex min-h-0 overflow-hidden print:overflow-visible">
          <main className="flex-1 flex flex-col min-w-0 bg-[#f1f4f7] overflow-hidden print-container">
            {/* Sub-Toolbar for Document Pages (hidden on Overview) */}
            {activeView !== 'overview' && (
              <div className="bg-white border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setActiveView('overview')}
                    className="text-[#008bb8] hover:underline font-medium cursor-pointer"
                  >
                    Overview
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-900">
                    {RAIL_ITEMS.find((i) => i.id === activeView)?.label}
                  </span>

                  {activeView === 'hasil_belajar' && (
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded border border-slate-200 ml-2">
                      <button
                        type="button"
                        onClick={() => setActiveSemester('1')}
                        className={`px-2 py-0.5 text-[11px] font-medium rounded-sm cursor-pointer ${
                          activeSemester === '1'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        Semester 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSemester('2')}
                        className={`px-2 py-0.5 text-[11px] font-medium rounded-sm cursor-pointer ${
                          activeSemester === '2'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600'
                        }`}
                      >
                        Semester 2
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
                    onClick={handlePrintBundle}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                  >
                    <FileStack className="w-3.5 h-3.5 text-[#00a0d2]" />
                    <span className="hidden sm:inline">Cetak Bundel</span>
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
                    setPrintAllBundle(false);
                  }}
                  onOpenEditor={(mod) => {
                    setActiveView(mod);
                    setEditorOpen(true);
                  }}
                  onPrintBundle={handlePrintBundle}
                  onChangeSemester={setActiveSemester}
                />
              ) : (
                activeStudent && (
                  <div className="flex justify-center items-start print-container">
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
                            sumatif={activeStudent.sumatif}
                          />
                          <HasilBelajarPages
                            identitas={activeStudent.identitas}
                            school={school}
                            report={
                              activeSemester === '1'
                                ? activeStudent.hasilBelajarSem1
                                : activeStudent.hasilBelajarSem2
                            }
                          />
                          <P5Pages
                            identitas={activeStudent.identitas}
                            school={school}
                            p5={activeStudent.p5}
                            interactive={editorOpen}
                            onUpdateLevel={handleUpdateP5Level}
                          />
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
                              sumatif={activeStudent.sumatif}
                            />
                          )}
                          {activeView === 'hasil_belajar' && (
                            <HasilBelajarPages
                              identitas={activeStudent.identitas}
                              school={school}
                              report={
                                activeSemester === '1'
                                  ? activeStudent.hasilBelajarSem1
                                  : activeStudent.hasilBelajarSem2
                              }
                            />
                          )}
                          {activeView === 'p5' && (
                            <P5Pages
                              identitas={activeStudent.identitas}
                              school={school}
                              p5={activeStudent.p5}
                              interactive={editorOpen}
                              onUpdateLevel={handleUpdateP5Level}
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
      <SchoolSettingsModal
        open={schoolModalOpen}
        school={school}
        onClose={() => setSchoolModalOpen(false)}
        onSave={setSchool}
      />
    </div>
  );
}
