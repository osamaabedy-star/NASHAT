import React, { useState, useMemo } from 'react';
import {
  CLASSES_LIST,
  getClassSessions,
  getActivityBadgeColor,
  WEEKS_LIST,
  SCHOOL_INFO,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import {
  School,
  Calendar,
  User,
  Printer,
  Sparkles,
  BookOpen,
  Download,
  Loader2,
} from 'lucide-react';

interface ClassViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const ClassView: React.FC<ClassViewProps> = ({ onSelectTeacher }) => {
  const [selectedClass, setSelectedClass] = useState<string>(CLASSES_LIST[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const sessions = useMemo(() => {
    return getClassSessions(selectedClass);
  }, [selectedClass]);

  const distinctTeachers = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.teacher)));
  }, [sessions]);

  const distinctActivities = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.activity)));
  }, [sessions]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      const safeClassName = selectedClass.replace(/[\/\s]+/g, '_');
      await exportElementAsImage(
        'class-export-card',
        `جدول_حصص_نشاط_فصل_${safeClassName}`,
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
      {/* Class Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label
              htmlFor="class-select"
              className="block text-xs font-bold text-slate-600 mb-1.5"
            >
              اختر الفصل الدراسي لعرض خطة حصص نشاطه الكاملة:
            </label>
            <div className="relative">
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 border border-slate-300 hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl px-4 py-2.5 text-slate-800 font-bold text-base transition-all appearance-none cursor-pointer"
              >
                {CLASSES_LIST.map((cls) => (
                  <option key={cls} value={cls}>
                    فصل {cls}
                  </option>
                ))}
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <School className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-save-class-image"
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
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>
          </div>
        </div>

        {/* Quick Class Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
          {CLASSES_LIST.map((cls) => {
            const isSelected = cls === selectedClass;
            return (
              <button
                key={cls}
                id={`chip-class-${cls}`}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                فصل {cls}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exportable Class Schedule Card */}
      <div
        id="class-export-card"
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative"
      >
        {/* Official Header for Image & Print */}
        <div className="pb-5 mb-5 border-b-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                  {SCHOOL_INFO.name}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {SCHOOL_INFO.term} ({SCHOOL_INFO.year})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                جدول وخطة حصص النشاط الطلابي — فصل {selectedClass}
              </h2>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs text-slate-400 font-bold">وزارة التعليم</div>
            <div className="text-xs text-slate-500 font-semibold">المملكة العربية السعودية</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>إجمالي حصص النشاط</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {sessions.length}{' '}
              <span className="text-xs font-normal text-slate-500">حصة (حصة أسبوعياً)</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
            <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>المعلمون المشرفون</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {distinctTeachers.length}{' '}
              <span className="text-xs font-normal text-slate-500">معلماً مختلفاً</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>البرامج المنفذة</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {distinctActivities.length}{' '}
              <span className="text-xs font-normal text-slate-500">برنامجاً نشاطاً</span>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm">
              توزيع حصص النشاط الأسبوعية لفصل {selectedClass}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              إجمالي {WEEKS_LIST.length} أسبوعاً دراسياً
            </span>
          </div>

          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-black uppercase border-b border-slate-200">
                <th className="py-2.5 px-4 w-28">الأسبوع</th>
                <th className="py-2.5 px-4">اسم النشاط</th>
                <th className="py-2.5 px-4 w-36">التصنيف</th>
                <th className="py-2.5 px-4 w-44">المعلم المشرف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.week}-${idx}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الأسبوع {session.week}</span>
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

                    <td className="py-3 px-4 whitespace-nowrap">
                      {onSelectTeacher ? (
                        <button
                          onClick={() => onSelectTeacher(session.teacher)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
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

        {/* Official Footer Stamp */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{SCHOOL_INFO.name} — رائد النشاط الطلابي وإدارة المدرسة</span>
          <span>خطة النشاط الطلابي المعتمدة</span>
        </div>
      </div>
    </div>
  );
};

