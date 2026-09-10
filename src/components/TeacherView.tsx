import React, { useState, useMemo } from 'react';
import {
  getActivityBadgeColor,
  WEEKS_LIST,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import { OfficialDocumentHeader } from './OfficialDocumentHeader';
import { OfficialSignatures } from './OfficialSignatures';
import { ScoreBadge } from './ScoreBadge';
import { NotesCell } from './NotesCell';
import { QuickEditSessionModal } from './QuickEditSessionModal';
import { useScheduleData } from '../hooks/useScheduleData';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getAllUniqueTeachers } from '../services/scheduleService';
import { ScheduleSession } from '../types';
import {
  User,
  Search,
  Printer,
  Download,
  Loader2,
  Edit3,
} from 'lucide-react';

interface TeacherViewProps {
  initialTeacher?: string;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  initialTeacher,
}) => {
  const schedule = useScheduleData();
  const { isAdmin } = useAdminAuth();

  const allTeachers = useMemo(() => getAllUniqueTeachers(schedule), [schedule]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>(
    initialTeacher || allTeachers[0] || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<ScheduleSession | null>(null);

  // Filter teachers list by search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return allTeachers;
    return allTeachers.filter((t) =>
      t.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [allTeachers, searchQuery]);

  // All sessions for the chosen teacher from dynamic schedule
  const allSessions = useMemo(() => {
    return schedule.filter((s) => s.teacher.trim() === selectedTeacher.trim());
  }, [schedule, selectedTeacher]);

  // Filtered sessions (by week if selected)
  const displayedSessions = useMemo(() => {
    if (selectedWeekFilter === 'all') return allSessions;
    return allSessions.filter((s) => s.week === selectedWeekFilter);
  }, [allSessions, selectedWeekFilter]);

  // Distinct classes taught by this teacher
  const distinctClasses = useMemo(() => {
    return Array.from(new Set(allSessions.map((s) => s.gradeClass)));
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
      {/* Teacher Selection & Action Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Select dropdown & search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="flex-1 min-w-[240px]">
              <label htmlFor="teacher-select" className="block text-xs font-bold text-slate-700 mb-1">
                اختر المعلم:
              </label>
              <div className="relative">
                <select
                  id="teacher-select"
                  value={selectedTeacher}
                  onChange={(e) => {
                    setSelectedTeacher(e.target.value);
                    setSelectedWeekFilter('all');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-800 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm transition-all appearance-none cursor-pointer pr-3 pl-9"
                >
                  {allTeachers.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      الأستاذ / {teacher}
                    </option>
                  ))}
                </select>
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64">
              <label htmlFor="search-teacher" className="block text-xs font-bold text-slate-700 mb-1">
                بحث بالاسم:
              </label>
              <div className="relative">
                <input
                  id="search-teacher"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن معلم..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 transition-all pr-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <button
              id="btn-save-teacher-image"
              onClick={handleSaveAsImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير كصورة (PNG)</span>
                </>
              )}
            </button>

            <button
              id="btn-print-teacher"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة الجدول</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Search Results (if searching) */}
        {searchQuery.trim() !== '' && (
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-1">
            {filteredTeachers.map((teacher) => (
              <button
                key={teacher}
                onClick={() => {
                  setSelectedTeacher(teacher);
                  setSelectedWeekFilter('all');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer"
              >
                {teacher}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Official Table Document Card */}
      <div
        id="teacher-export-card"
        className="bg-white rounded-xl border border-slate-400 p-6 sm:p-8 shadow-xs relative print:shadow-none print:border-none print:p-0"
      >
        {/* Ministerial Header */}
        <OfficialDocumentHeader
          title={`جدول حصص النشاط الطلابي — الأستاذ / ${selectedTeacher}`}
          leftContent={
            <div className="inline-flex items-center gap-2 text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
              <span>إجمالي الحصص: <b className="text-slate-900">{allSessions.length}</b></span>
              <span>•</span>
              <span>الفصول: <b className="text-slate-900">{distinctClasses.join('، ')}</b></span>
            </div>
          }
        />

        {/* Week Filter for on-screen viewing */}
        <div className="no-image-export flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 no-print">
          <span className="text-xs font-bold text-slate-600">تصفية العرض حسب الأسبوع:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedWeekFilter('all')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                selectedWeekFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              الكل ({allSessions.length})
            </button>
            {WEEKS_LIST.map((wk) => {
              const hasSession = activeWeeks.has(wk);
              const isSelected = selectedWeekFilter === wk;
              return (
                <button
                  key={wk}
                  onClick={() => setSelectedWeekFilter(wk)}
                  disabled={!hasSession}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white'
                      : hasSession
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-40'
                  }`}
                >
                  أسبوع {wk}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Professional Table */}
        <div className="border border-slate-400 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[850px] text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-400">
                <th className="py-2 px-2.5 border-r border-slate-700 w-12 text-center whitespace-nowrap">
                  م
                </th>
                <th className="py-2 px-3 border-r border-slate-700 w-24 text-center whitespace-nowrap">
                  الأسبوع
                </th>
                <th className="py-2 px-3 border-r border-slate-700 w-28 text-center whitespace-nowrap">
                  الفصل الدراسي
                </th>
                <th className="py-2 px-3 border-r border-slate-700 w-64 whitespace-nowrap">
                  اسم النشاط والتصنيف
                </th>
                <th className="py-2 px-3 border-r border-slate-700 w-40 text-center whitespace-nowrap">
                  درجة التقييم (من 100)
                </th>
                <th className="py-2 px-3 whitespace-nowrap">
                  الملاحظات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {displayedSessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.week}-${session.gradeClass}-${idx}`}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-2.5 border-r border-slate-300 text-center font-bold text-slate-500 whitespace-nowrap">
                      {idx + 1}
                    </td>

                    {/* Week */}
                    <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-slate-800 text-center whitespace-nowrap">
                      الأسبوع {session.week}
                    </td>

                    {/* Class */}
                    <td className="py-2.5 px-3 border-r border-slate-300 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-900">
                        {session.gradeClass}
                      </span>
                    </td>

                    {/* Activity and Category close together */}
                    <td className="py-2.5 px-3 border-r border-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {session.activity}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          [{style.badge}]
                        </span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-2.5 px-3 border-r border-slate-300 text-center whitespace-nowrap">
                      <ScoreBadge session={session} showLabel={true} />
                    </td>

                    {/* Notes */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-between gap-2">
                        <NotesCell session={session} />
                        {isAdmin && (
                          <button
                            onClick={() => setEditingSession(session)}
                            className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0 no-print cursor-pointer"
                            title="تعديل الحصة أو البرنامج أو نقلها"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>تعديل</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Signatures Block */}
        <OfficialSignatures />
      </div>

      {/* Quick Edit Session Modal */}
      <QuickEditSessionModal
        session={editingSession}
        isOpen={editingSession !== null}
        onClose={() => setEditingSession(null)}
      />
    </div>
  );
};
