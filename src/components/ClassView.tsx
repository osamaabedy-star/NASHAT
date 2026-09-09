import React, { useState, useMemo } from 'react';
import {
  CLASSES_LIST,
  getClassSessions,
  getActivityBadgeColor,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import { OfficialDocumentHeader } from './OfficialDocumentHeader';
import { OfficialSignatures } from './OfficialSignatures';
import { ScoreBadge } from './ScoreBadge';
import { NotesCell } from './NotesCell';
import {
  School,
  Printer,
  Download,
  Loader2,
} from 'lucide-react';

interface ClassViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const ClassView: React.FC<ClassViewProps> = ({ onSelectTeacher }) => {
  const [selectedClass, setSelectedClass] = useState<string>(CLASSES_LIST[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Sessions for this class
  const sessions = useMemo(() => {
    return getClassSessions(selectedClass);
  }, [selectedClass]);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      const safeClassName = selectedClass.replace(/\s+/g, '_').replace('/', '-');
      await exportElementAsImage(
        'class-export-card',
        `جدول_حصص_النشاط_فصل_${safeClassName}`,
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
      {/* Top Class Selection Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-300 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="class-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
              اختر الفصل:
            </label>
            <div className="relative flex-1 sm:w-60">
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-slate-800 rounded-lg px-3 py-2 text-slate-900 font-bold text-sm transition-all appearance-none cursor-pointer pr-3 pl-9"
              >
                {CLASSES_LIST.map((cls) => (
                  <option key={cls} value={cls}>
                    فصل {cls}
                  </option>
                ))}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <School className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
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
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة الجدول</span>
            </button>
          </div>
        </div>

        {/* Quick Class Chips */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-1">
          {CLASSES_LIST.map((cls) => {
            const isSelected = cls === selectedClass;
            return (
              <button
                key={cls}
                id={`chip-class-${cls}`}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                فصل {cls}
              </button>
            );
          })}
        </div>
      </div>

      {/* Official Class Schedule Card */}
      <div
        id="class-export-card"
        className="bg-white rounded-xl border border-slate-400 p-6 sm:p-8 shadow-xs relative print:shadow-none print:border-none print:p-0"
      >
        {/* Ministerial Header */}
        <OfficialDocumentHeader
          title={`جدول حصص النشاط الطلابي — فصل ${selectedClass}`}
          metadata={
            <div className="inline-flex items-center gap-4 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              <span>إجمالي حصص النشاط: <b className="text-slate-900">{sessions.length}</b> حصة</span>
              <span>•</span>
              <span>المعدل الأسبوعي: <b className="text-slate-900">حصة أسبوعياً</b></span>
            </div>
          }
        />

        {/* Sessions Table */}
        <div className="border border-slate-400 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[850px] text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-400">
                <th className="py-2 px-2.5 border-r border-slate-700 w-12 text-center whitespace-nowrap">م</th>
                <th className="py-2 px-3 border-r border-slate-700 w-28 text-center whitespace-nowrap">الأسبوع</th>
                <th className="py-2 px-3 border-r border-slate-700 w-64 whitespace-nowrap">اسم النشاط والتصنيف</th>
                <th className="py-2 px-3 border-r border-slate-700 w-44 whitespace-nowrap">المعلم المشرف</th>
                <th className="py-2 px-3 border-r border-slate-700 w-40 text-center whitespace-nowrap">درجة التقييم (من 100)</th>
                <th className="py-2 px-3 whitespace-nowrap">الملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {sessions.map((session, idx) => {
                const style = getActivityBadgeColor(session.activity);
                return (
                  <tr
                    key={`${session.week}-${idx}`}
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

        {/* Official Signatures */}
        <OfficialSignatures />
      </div>
    </div>
  );
};
