import React, { useState, useMemo } from 'react';
import {
  ALL_TEACHERS,
  getTeacherSessions,
  getActivityBadgeColor,
  WEEKS_LIST,
  SCHOOL_INFO,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import {
  User,
  Search,
  BookOpen,
  School,
  Calendar,
  Award,
  Printer,
  Clock,
  SlidersHorizontal,
  Download,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface TeacherViewProps {
  initialTeacher?: string;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  initialTeacher = ALL_TEACHERS[0],
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>(initialTeacher);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filter teachers list by search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return ALL_TEACHERS;
    return ALL_TEACHERS.filter((t) =>
      t.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery]);

  // All sessions for the chosen teacher
  const allSessions = useMemo(() => {
    return getTeacherSessions(selectedTeacher);
  }, [selectedTeacher]);

  // Filtered sessions (by week if selected)
  const displayedSessions = useMemo(() => {
    if (selectedWeekFilter === 'all') return allSessions;
    return allSessions.filter((s) => s.week === selectedWeekFilter);
  }, [allSessions, selectedWeekFilter]);

  // Distinct classes taught by this teacher
  const distinctClasses = useMemo(() => {
    return Array.from(new Set(allSessions.map((s) => s.gradeClass)));
  }, [allSessions]);

  // Distinct activities taught by this teacher
  const distinctActivities = useMemo(() => {
    return Array.from(new Set(allSessions.map((s) => s.activity)));
  }, [allSessions]);

  // Weeks when the teacher has sessions
  const activeWeeks = useMemo(() => {
    return new Set(allSessions.map((s) => s.week));
  }, [allSessions]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      const safeTeacherName = selectedTeacher.replace(/\s+/g, '_');
      await exportElementAsImage(
        'teacher-export-card',
        `جدول_حصص_النشاط_المعلم_${safeTeacherName}`,
        'png'
      );
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Teacher Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs no-print">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex-1">
            <label
              htmlFor="teacher-select"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              اختر المعلم لعرض جدول حصص نشاطه المخصص:
            </label>
            <div className="relative">
              <select
                id="teacher-select"
                value={selectedTeacher}
                onChange={(e) => {
                  setSelectedTeacher(e.target.value);
                  setSelectedWeekFilter('all');
                }}
                className="w-full bg-slate-50 border border-slate-300 hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl px-4 py-2.5 text-slate-800 font-bold text-base transition-all appearance-none cursor-pointer"
              >
                {ALL_TEACHERS.map((teacher) => (
                  <option key={teacher} value={teacher}>
                    الأستاذ / {teacher}
                  </option>
                ))}
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Teacher Quick Filter Search */}
          <div className="w-full md:w-72">
            <label
              htmlFor="search-teacher"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              بحث سريع عن معلم:
            </label>
            <div className="relative">
              <input
                id="search-teacher"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="اكتب اسم المعلم..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all pr-10"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Quick Teacher Tags/Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            المعلمون المتاحون ({filteredTeachers.length}):
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => {
              const isSelected = teacher === selectedTeacher;
              return (
                <button
                  key={teacher}
                  id={`chip-teacher-${teacher}`}
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setSelectedWeekFilter('all');
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {teacher}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons: Save as Image / Print */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-xs text-slate-600 font-bold">
          يمكنك حفظ هذا الجدول كصورة عالية الدقة (PNG) لمشاركتها عبر واتساب أو طباعتها مباشرة:
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-save-teacher-image"
            onClick={handleSaveAsImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الصورة...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>حفظ كصورة (PNG)</span>
              </>
            )}
          </button>

          <button
            id="btn-print-teacher"
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Exportable & Printable Schedule Card */}
      <div
        id="teacher-export-card"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden"
      >
        {/* Official Header for Image Export & Print */}
        <div className="pb-5 mb-5 border-b-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  {SCHOOL_INFO.name}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {SCHOOL_INFO.term} ({SCHOOL_INFO.year})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                جدول حصص النشاط الطلابي — الأستاذ / {selectedTeacher}
              </h2>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs text-slate-400 font-bold">وزارة التعليم</div>
            <div className="text-xs text-slate-500 font-semibold">المملكة العربية السعودية</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>إجمالي الحصص</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {allSessions.length} <span className="text-xs font-normal text-slate-500">حصة</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <School className="w-4 h-4 text-blue-600" />
              <span>الفصول المسندة</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {distinctClasses.length} <span className="text-xs font-normal text-slate-500">فصلاً</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>الأنشطة المنفذة</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {distinctActivities.length} <span className="text-xs font-normal text-slate-500">برنامجاً</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <Award className="w-4 h-4 text-purple-600" />
              <span>الأسابيع النشطة</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {activeWeeks.size} / {WEEKS_LIST.length}{' '}
              <span className="text-xs font-normal text-slate-500">أسبوعاً</span>
            </div>
          </div>
        </div>

        {/* Filter by Week bar (hidden from image export) */}
        <div className="no-image-export flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>تصفية العرض حسب الأسبوع:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              id="filter-week-all"
              onClick={() => setSelectedWeekFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedWeekFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              جميع الأسابيع ({allSessions.length})
            </button>
            {WEEKS_LIST.map((wk) => {
              const hasSession = activeWeeks.has(wk);
              const isSelected = selectedWeekFilter === wk;
              return (
                <button
                  key={wk}
                  id={`filter-week-${wk}`}
                  onClick={() => setSelectedWeekFilter(wk)}
                  disabled={!hasSession}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : hasSession
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                  }`}
                  title={hasSession ? `الأسبوع ${wk}` : `لا توجد حصة نشاط في الأسبوع ${wk}`}
                >
                  أسبوع {wk}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teacher Schedule Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span className="font-extrabold text-slate-800 text-sm">
                تفاصيل حصص النشاط للأستاذ {selectedTeacher}
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full mr-2">
                {displayedSessions.length} حصة
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              حصة النشاط المدرسية المعتمدة
            </span>
          </div>

          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-black uppercase border-b border-slate-200">
                <th className="py-2.5 px-4 w-28">الأسبوع</th>
                <th className="py-2.5 px-4 w-36">الفصل الدراسي</th>
                <th className="py-2.5 px-4">اسم النشاط</th>
                <th className="py-2.5 px-4 w-36">التصنيف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayedSessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.week}-${session.gradeClass}-${idx}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الأسبوع {session.week}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block font-bold text-sm bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {session.gradeClass}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {session.activity}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${style.bg}`}
                      >
                        {style.badge}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual Timeline / Week Grid for this Teacher */}
        <div className="pt-2">
          <div className="text-xs font-black text-slate-700 mb-2.5">
            توزيع حصص المعلم على مدار أسابيع الفصل الدراسي:
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {WEEKS_LIST.map((wk) => {
              const session = allSessions.find((s) => s.week === wk);
              return (
                <div
                  key={wk}
                  className={`p-2.5 rounded-xl border text-center ${
                    session
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-500 mb-0.5">
                    الأسبوع {wk}
                  </div>
                  {session ? (
                    <>
                      <div
                        className="text-xs font-extrabold text-emerald-900 truncate"
                        title={session.activity}
                      >
                        {session.activity}
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 mt-1 bg-white py-0.5 rounded border border-emerald-200">
                        {session.gradeClass}
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-400 py-1">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Card Footer Stamp */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{SCHOOL_INFO.name} — رائد النشاط وإدارة المدرسة</span>
          <span>خطة الفصل الدراسي الأول 1448هـ</span>
        </div>
      </div>
    </div>
  );
};

