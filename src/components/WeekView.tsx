import React, { useState, useMemo } from 'react';
import {
  WEEKS_LIST,
  CLASSES_LIST,
  getWeekSessions,
  getActivityBadgeColor,
  SCHOOL_INFO,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import {
  Calendar,
  School,
  User,
  Printer,
  ChevronRight,
  ChevronLeft,
  PieChart,
  Download,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface WeekViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ onSelectTeacher }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(WEEKS_LIST[0]);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const currentIndex = WEEKS_LIST.indexOf(selectedWeek);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedWeek(WEEKS_LIST[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < WEEKS_LIST.length - 1) {
      setSelectedWeek(WEEKS_LIST[currentIndex + 1]);
    }
  };

  // Sessions for this week
  const weekSessions = useMemo(() => {
    return getWeekSessions(selectedWeek);
  }, [selectedWeek]);

  // Filtered by class if selected
  const displayedSessions = useMemo(() => {
    if (filterClass === 'all') return weekSessions;
    return weekSessions.filter((s) => s.gradeClass === filterClass);
  }, [weekSessions, filterClass]);

  // Metrics for this week
  const totalClassesWithAvailablePeriods = weekSessions.length;
  const uniqueTeachers = Array.from(new Set(weekSessions.map((s) => s.teacher)));
  const uniqueActivities = Array.from(new Set(weekSessions.map((s) => s.activity)));

  // Activity breakdown counts
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    weekSessions.forEach((s) => {
      counts[s.activity] = (counts[s.activity] || 0) + 1;
    });
    return counts;
  }, [weekSessions]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      await exportElementAsImage(
        'week-export-card',
        `خطة_حصص_النشاط_الأسبوع_${selectedWeek}`,
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
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">
              اختر الأسبوع الدراسي لعرض خطة النشاط لكل فصل:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="الأسبوع السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="text-xl font-black text-slate-900 bg-emerald-50 text-emerald-900 px-4 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>الأسبوع {selectedWeek}</span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === WEEKS_LIST.length - 1}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="الأسبوع التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Week Chips */}
          <div className="flex flex-wrap items-center gap-1.5 max-w-xl">
            {WEEKS_LIST.map((wk) => {
              const isSelected = wk === selectedWeek;
              return (
                <button
                  key={wk}
                  id={`week-tab-${wk}`}
                  onClick={() => setSelectedWeek(wk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  أسبوع {wk}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              id="btn-save-week-image"
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
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exportable Card for Week */}
      <div
        id="week-export-card"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative"
      >
        {/* Official Header for Image & Print */}
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
                خطة حصص النشاط الطلابي لجميع الفصول — الأسبوع {selectedWeek}
              </h2>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs text-slate-400 font-bold">وزارة التعليم</div>
            <div className="text-xs text-slate-500 font-semibold">المملكة العربية السعودية</div>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
            <div className="text-xs text-slate-500 font-bold">إجمالي فصول المدرسة</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {totalClassesWithAvailablePeriods} فصلاً
            </div>
            <div className="text-[11px] text-slate-500">من الصف 1 إلى الصف 6</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
            <div className="text-xs text-slate-500 font-bold">المعلمون المنفذون</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {uniqueTeachers.length} معلماً
            </div>
            <div className="text-[11px] text-slate-500">مشرفون على الحصص</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500 font-bold">البرامج المنفذة</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {uniqueActivities.length} برنامجاً
            </div>
            <div className="text-[11px] text-slate-500">تنوع مهاري وثقافي</div>
          </div>
        </div>

        {/* Class Filter (hidden during image export) */}
        <div className="no-image-export flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 no-print">
          <span className="text-xs font-bold text-slate-600">
            تصفية العرض لفصل محدد:
          </span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">جميع الفصول (12 فصلاً)</option>
            {CLASSES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* The Classes Schedule Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span className="font-extrabold text-slate-800 text-sm">
                بيان حصص النشاط لجميع الفصول الدراسية في الأسبوع {selectedWeek}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              إجمالي {displayedSessions.length} فصلاً
            </span>
          </div>

          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-black uppercase border-b border-slate-200">
                <th className="py-2.5 px-4 w-32">الفصل الدراسي</th>
                <th className="py-2.5 px-4">اسم النشاط</th>
                <th className="py-2.5 px-4 w-44">المعلم المشرف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {displayedSessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.gradeClass}-${idx}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Class Name */}
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <span className="inline-block font-extrabold text-sm bg-blue-50 text-blue-900 px-3 py-1 rounded-md border border-blue-200">
                        {session.gradeClass}
                      </span>
                    </td>

                    {/* Activity Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {session.activity}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit ${style.bg}`}
                        >
                          {style.badge}
                        </span>
                      </div>
                    </td>

                    {/* Teacher */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {onSelectTeacher ? (
                        <button
                          onClick={() => onSelectTeacher(session.teacher)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          title="عرض جدول المعلم"
                        >
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          <span>الأستاذ / {session.teacher}</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>الأستاذ / {session.teacher}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Activities Summary Grid for Image */}
        <div className="pt-2">
          <div className="text-xs font-black text-slate-700 mb-2.5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>ملخص البرامج المنفذة في الأسبوع {selectedWeek}:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {(Object.entries(activityCounts) as [string, number][]).map(([actName, count]) => {
              const countNum = Number(count);
              return (
                <div
                  key={actName}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-right"
                >
                  <div className="text-xs font-extrabold text-slate-900 truncate" title={actName}>
                    {actName}
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-1">
                    {countNum} {countNum === 1 ? 'فصل مستفيد' : 'فصول مستفيدة'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Footer Stamp */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{SCHOOL_INFO.name} — رائد النشاط الطلابي</span>
          <span>خطة النشاط الأسبوعية المعتمدة</span>
        </div>
      </div>
    </div>
  );
};
