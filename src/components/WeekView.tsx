import React, { useState, useMemo } from 'react';
import {
  WEEKS_LIST,
  CLASSES_LIST,
  getWeekSessions,
  getActivityBadgeColor,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import { OfficialDocumentHeader } from './OfficialDocumentHeader';
import { OfficialSignatures } from './OfficialSignatures';
import { ScoreBadge } from './ScoreBadge';
import { NotesCell } from './NotesCell';
import {
  Calendar,
  User,
  Printer,
  ChevronRight,
  ChevronLeft,
  Download,
  Loader2,
} from 'lucide-react';

interface WeekViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ onSelectTeacher }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(WEEKS_LIST[0]);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Sessions for current week
  const weekSessions = useMemo(() => {
    return getWeekSessions(selectedWeek);
  }, [selectedWeek]);

  // Filtered by class if selected
  const displayedSessions = useMemo(() => {
    if (filterClass === 'all') return weekSessions;
    return weekSessions.filter((s) => s.gradeClass === filterClass);
  }, [weekSessions, filterClass]);

  const currentIndex = WEEKS_LIST.indexOf(selectedWeek);

  const handlePrevWeek = () => {
    if (currentIndex > 0) {
      setSelectedWeek(WEEKS_LIST[currentIndex - 1]);
    }
  };

  const handleNextWeek = () => {
    if (currentIndex < WEEKS_LIST.length - 1) {
      setSelectedWeek(WEEKS_LIST[currentIndex + 1]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      await exportElementAsImage(
        'week-export-card',
        `جدول_حصص_النشاط_الأسبوع_${selectedWeek}`,
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
      {/* Week Selector Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="الأسبوع السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-900 font-bold text-sm">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>الأسبوع {selectedWeek}</span>
            </div>

            <button
              onClick={handleNextWeek}
              disabled={currentIndex === WEEKS_LIST.length - 1}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="الأسبوع القادم"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Week Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {WEEKS_LIST.map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  selectedWeek === week
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                أسبوع {week}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAsImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري التصدير...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير كصورة (PNG)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Table Document Card */}
      <div
        id="week-export-card"
        className="bg-white rounded-xl border border-slate-400 p-6 sm:p-8 shadow-xs relative print:shadow-none print:border-none print:p-0"
      >
        {/* Ministerial Header */}
        <OfficialDocumentHeader
          title={`جدول حصص النشاط الطلابي لجميع الفصول — الأسبوع ${selectedWeek}`}
          metadata={
            <div className="inline-flex items-center gap-4 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              <span>عدد الحصص المنفذة: <b className="text-slate-900">{weekSessions.length}</b> حصة</span>
              <span>•</span>
              <span>فصول المرحلة: <b className="text-slate-900">{CLASSES_LIST.length}</b> فصلاً</span>
            </div>
          }
        />

        {/* Filter class dropdown for viewing */}
        <div className="no-image-export flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200 no-print">
          <span className="text-xs font-bold text-slate-600">تصفية العرض لفصل محدد:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 cursor-pointer"
          >
            <option value="all">جميع الفصول (12 فصلاً)</option>
            {CLASSES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* The Table */}
        <div className="border border-slate-400 rounded-lg overflow-hidden">
          <table className="w-full text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-400">
                <th className="py-2 px-2.5 border-r border-slate-700 w-12 text-center whitespace-nowrap">م</th>
                <th className="py-2 px-3 border-r border-slate-700 w-28 text-center whitespace-nowrap">الفصل الدراسي</th>
                <th className="py-2 px-3 border-r border-slate-700 w-64 whitespace-nowrap">اسم النشاط والتصنيف</th>
                <th className="py-2 px-3 border-r border-slate-700 w-44 whitespace-nowrap">المعلم المشرف</th>
                <th className="py-2 px-3 border-r border-slate-700 w-40 text-center whitespace-nowrap">درجة التقييم (من 100)</th>
                <th className="py-2 px-3 whitespace-nowrap">الملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {displayedSessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.gradeClass}-${idx}`}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                  >
                    {/* Number */}
                    <td className="py-2.5 px-2.5 border-r border-slate-300 text-center font-bold text-slate-500 whitespace-nowrap">
                      {idx + 1}
                    </td>

                    {/* Class */}
                    <td className="py-2.5 px-3 border-r border-slate-300 font-bold text-slate-900 text-center whitespace-nowrap">
                      {session.gradeClass}
                    </td>

                    {/* Activity */}
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

                    {/* Teacher */}
                    <td className="py-2.5 px-3 border-r border-slate-300 whitespace-nowrap font-bold text-slate-900">
                      {onSelectTeacher ? (
                        <button
                          onClick={() => onSelectTeacher(session.teacher)}
                          className="hover:underline hover:text-emerald-800 cursor-pointer"
                          title="عرض جدول المعلم"
                        >
                          الأستاذ / {session.teacher}
                        </button>
                      ) : (
                        <span>الأستاذ / {session.teacher}</span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="py-2.5 px-3 border-r border-slate-300 text-center whitespace-nowrap">
                      <ScoreBadge session={session} showLabel={true} />
                    </td>

                    {/* Notes */}
                    <td className="py-2.5 px-3">
                      <NotesCell session={session} />
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
    </div>
  );
};
