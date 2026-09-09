import React, { useState } from 'react';
import {
  WEEKS_LIST,
  CLASSES_LIST,
  SCHEDULE_DATA,
  SCHOOL_INFO,
  getActivityBadgeColor,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import { Table, Search, Printer, Download, Loader2, Sparkles } from 'lucide-react';

interface MasterTableViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const MasterTableView: React.FC<MasterTableViewProps> = ({
  onSelectTeacher,
}) => {
  const [highlightTerm, setHighlightTerm] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Classes order matching the paper from right to left:
  // أول / أ, أول / ب, ثاني / أ, ثاني / ب, ثالث / أ, ثالث / ب, ثالث / ج, رابع / أ, رابع / ب, خامس / أ, خامس / ب, سادس / أ
  const orderedClasses = [...CLASSES_LIST];

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsImage = async () => {
    try {
      setIsExporting(true);
      await exportElementAsImage(
        'master-table-export-card',
        'جدول_النشاط_المدرسي_الشامل',
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
      {/* Top Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-600" />
            <span>الجدول العام الشامل لخطة النشاط الطلابي</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            جدول مطابق للوثيقة الرسمية يوضح حصص النشاط لجميع الفصول والمعلمين عبر كل الأسابيع.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={highlightTerm}
              onChange={(e) => setHighlightTerm(e.target.value)}
              placeholder="تمييز معلم أو نشاط..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all pr-9"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            id="btn-save-master-image"
            onClick={handleSaveAsImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
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
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div
        id="master-table-export-card"
        className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs overflow-hidden"
      >
        {/* Header for Image & Print */}
        <div className="pb-4 mb-4 border-b-2 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-800">{SCHOOL_INFO.name}</div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                الجدول العام الشامل لخطة النشاط الطلابي — {SCHOOL_INFO.term} ({SCHOOL_INFO.year})
              </h1>
            </div>
          </div>
          <div className="text-left text-xs text-slate-500 font-bold hidden sm:block">
            <div>المملكة العربية السعودية</div>
            <div>وزارة التعليم</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            {/* Header: Class Names */}
            <thead>
              <tr className="bg-slate-800 text-white font-extrabold border-b border-slate-300">
                <th
                  rowSpan={1}
                  className="py-3 px-3 border-l border-slate-700 w-24 bg-slate-900 sticky right-0 z-20"
                >
                  الأسبوع
                </th>
                <th
                  rowSpan={1}
                  className="py-3 px-2 border-l border-slate-700 w-20 bg-slate-900"
                >
                  البيان
                </th>
                {orderedClasses.map((cls) => (
                  <th
                    key={cls}
                    className="py-3 px-2 border-l border-slate-700 min-w-[90px] font-black"
                  >
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {WEEKS_LIST.map((weekNum, idx) => {
                const weekBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50';

                return (
                  <React.Fragment key={weekNum}>
                    {/* Row 1: Program/Activity */}
                    <tr className={`border-t-2 border-slate-300 ${weekBg}`}>
                      {/* Week Number (rowSpan 2) */}
                      <td
                        rowSpan={2}
                        className="py-2 px-3 border-l border-slate-300 font-black text-sm text-slate-900 bg-slate-100/90 sticky right-0 z-10 align-middle"
                      >
                        <div className="text-base font-black text-emerald-800">
                          {weekNum}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          أسبوع
                        </div>
                      </td>

                      {/* Row Title: البرنامج */}
                      <td className="py-2 px-2 border-l border-slate-300 font-black text-slate-700 bg-slate-100/60 whitespace-nowrap">
                        البرنامج
                      </td>

                      {/* Cells for each class */}
                      {orderedClasses.map((cls) => {
                        const session = SCHEDULE_DATA.find(
                          (s) => s.week === weekNum && s.gradeClass === cls
                        );
                        const activity = session ? session.activity : '—';
                        const isMatch =
                          highlightTerm.trim() !== '' &&
                          activity.toLowerCase().includes(highlightTerm.trim().toLowerCase());

                        return (
                          <td
                            key={`act-${weekNum}-${cls}`}
                            className={`py-2 px-1.5 border-l border-slate-200 font-extrabold text-[11px] leading-tight ${
                              isMatch
                                ? 'bg-amber-100 text-amber-900 font-black ring-2 ring-amber-400'
                                : activity.includes('نافس')
                                ? 'text-emerald-800 bg-emerald-50/40'
                                : activity.includes('فنون') || activity.includes('الوطني')
                                ? 'text-purple-800 bg-purple-50/40'
                                : 'text-slate-800'
                            }`}
                          >
                            {activity}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 2: Teacher */}
                    <tr className={`border-b border-slate-300 ${weekBg}`}>
                      {/* Row Title: المعلم */}
                      <td className="py-2 px-2 border-l border-slate-300 font-bold text-slate-600 bg-slate-50 whitespace-nowrap">
                        المعلم
                      </td>

                      {/* Cells for each class */}
                      {orderedClasses.map((cls) => {
                        const session = SCHEDULE_DATA.find(
                          (s) => s.week === weekNum && s.gradeClass === cls
                        );
                        const teacher = session ? session.teacher : '—';
                        const isMatch =
                          highlightTerm.trim() !== '' &&
                          teacher.toLowerCase().includes(highlightTerm.trim().toLowerCase());

                        return (
                          <td
                            key={`tch-${weekNum}-${cls}`}
                            className={`py-1.5 px-1.5 border-l border-slate-200 text-[11px] font-semibold ${
                              isMatch
                                ? 'bg-amber-200 text-amber-950 font-black ring-2 ring-amber-500'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                            } transition-colors`}
                          >
                            {onSelectTeacher && session ? (
                              <button
                                onClick={() => onSelectTeacher(teacher)}
                                className="w-full text-center hover:underline cursor-pointer"
                                title={`عرض جدول ${teacher}`}
                              >
                                {teacher}
                              </button>
                            ) : (
                              teacher
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer stamp */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>{SCHOOL_INFO.name} — رائد النشاط الطلابي وإدارة المدرسة</span>
          <span>الفصل الدراسي الأول 1448هـ</span>
        </div>
      </div>
    </div>
  );
};

