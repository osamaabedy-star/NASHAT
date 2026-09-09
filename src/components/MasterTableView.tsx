import React, { useState } from 'react';
import {
  WEEKS_LIST,
  CLASSES_LIST,
  SCHEDULE_DATA,
  SCHOOL_INFO,
} from '../data/scheduleData';
import { exportElementAsImage } from '../utils/exportImage';
import { OfficialDocumentHeader } from './OfficialDocumentHeader';
import { OfficialSignatures } from './OfficialSignatures';
import { ScoreBadge } from './ScoreBadge';
import { SessionEvaluationModal } from './SessionEvaluationModal';
import { ScheduleSession } from '../types';
import { Table, Search, Printer, Download, Loader2, Award, Edit3, CheckSquare, Square } from 'lucide-react';

interface MasterTableViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const MasterTableView: React.FC<MasterTableViewProps> = ({
  onSelectTeacher,
}) => {
  const [highlightTerm, setHighlightTerm] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showEvaluationRow, setShowEvaluationRow] = useState<boolean>(true);
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<ScheduleSession | null>(null);

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
            جدول مطابق للوثيقة الرسمية يوضح حصص النشاط لجميع الفصول والمعلمين عبر كل الأسابيع مع إمكانية الرصد المباشر.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Evaluation Row */}
          <button
            type="button"
            onClick={() => setShowEvaluationRow(!showEvaluationRow)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showEvaluationRow
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="إظهار أو إخفاء صف رصد الدرجات في الجدول العام"
          >
            {showEvaluationRow ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <Award className="w-3.5 h-3.5" />
            <span>خانة الرصد والدرجات</span>
          </button>

          <div className="relative w-full sm:w-48">
            <input
              type="text"
              value={highlightTerm}
              onChange={(e) => setHighlightTerm(e.target.value)}
              placeholder="تمييز معلم أو نشاط..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all pr-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
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

      {/* Main Table Container for Export and Display */}
      <div
        id="master-table-export-card"
        className="bg-white rounded-2xl border border-slate-300 p-4 sm:p-6 shadow-xs overflow-hidden"
      >
        {/* Official Ministerial Header */}
        <OfficialDocumentHeader
          title="الجدول العام الشامل لخطة النشاط الطلابي"
          subTitle={`${SCHOOL_INFO.term} — ${SCHOOL_INFO.year} (لجميع الفصول والمعلمين)`}
          metadata={
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
              <span>إجمالي الأسابيع: {WEEKS_LIST.length} أسابيع</span>
              <span>•</span>
              <span>الفصول الدراسية: {orderedClasses.length} فصلاً</span>
              {showEvaluationRow && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 font-extrabold">مُفعل به الرصد المباشر للتقييم</span>
                </>
              )}
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            {/* Header: Class Names */}
            <thead>
              <tr className="bg-slate-800 text-white font-extrabold border-b border-slate-300">
                <th
                  rowSpan={1}
                  className="py-3 px-3 border-l border-slate-700 w-24 bg-slate-900 sticky right-0 z-20 whitespace-nowrap"
                >
                  الأسبوع
                </th>
                <th
                  rowSpan={1}
                  className="py-3 px-2 border-l border-slate-700 w-24 bg-slate-900 whitespace-nowrap"
                >
                  البيان
                </th>
                {orderedClasses.map((cls) => (
                  <th
                    key={cls}
                    className="py-3 px-2 border-l border-slate-700 min-w-[95px] font-black whitespace-nowrap"
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
                const rowSpanCount = showEvaluationRow ? 3 : 2;

                return (
                  <React.Fragment key={weekNum}>
                    {/* Row 1: Program/Activity */}
                    <tr className={`border-t-2 border-slate-300 ${weekBg}`}>
                      {/* Week Number (rowSpan 2 or 3) */}
                      <td
                        rowSpan={rowSpanCount}
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
                            onClick={() => session && setSelectedSessionForModal(session)}
                            className={`py-2 px-1.5 border-l border-slate-200 font-extrabold text-[11px] leading-tight cursor-pointer ${
                              isMatch
                                ? 'bg-amber-100 text-amber-900 font-black ring-2 ring-amber-400'
                                : activity.includes('نافس')
                                ? 'text-emerald-800 bg-emerald-50/40 hover:bg-emerald-100/60'
                                : activity.includes('فنون') || activity.includes('الوطني')
                                ? 'text-purple-800 bg-purple-50/40 hover:bg-purple-100/60'
                                : 'text-slate-800 hover:bg-slate-100'
                            } transition-colors`}
                            title={session ? 'انقر لعرض الحصة وتدوين التقييم والملاحظات' : ''}
                          >
                            {activity}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 2: Teacher */}
                    <tr className={`border-b border-slate-200 ${weekBg}`}>
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

                    {/* Row 3: Evaluation / Scoring (Optional toggle) */}
                    {showEvaluationRow && (
                      <tr className={`border-b border-slate-300 ${weekBg}`}>
                        {/* Row Title: الرصد والدرجة */}
                        <td className="py-1.5 px-2 border-l border-slate-300 font-black text-emerald-900 bg-emerald-50/80 whitespace-nowrap text-[11px]">
                          الرصد والدرجة
                        </td>

                        {/* Cells for each class */}
                        {orderedClasses.map((cls) => {
                          const session = SCHEDULE_DATA.find(
                            (s) => s.week === weekNum && s.gradeClass === cls
                          );

                          if (!session) {
                            return (
                              <td
                                key={`eval-${weekNum}-${cls}`}
                                className="py-1 px-1 border-l border-slate-200 text-slate-300 text-center"
                              >
                                —
                              </td>
                            );
                          }

                          return (
                            <td
                              key={`eval-${weekNum}-${cls}`}
                              className="py-1 px-1 border-l border-slate-200 text-center align-middle"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <ScoreBadge session={session} size="sm" showLabel={false} />
                                <button
                                  type="button"
                                  onClick={() => setSelectedSessionForModal(session)}
                                  title="فتح تفاصيل الحصة ورصد الدرجة والملاحظات"
                                  className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
                                >
                                  <Edit3 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Signatures */}
        <OfficialSignatures />
      </div>

      {/* Session Evaluation Modal */}
      <SessionEvaluationModal
        session={selectedSessionForModal}
        isOpen={selectedSessionForModal !== null}
        onClose={() => setSelectedSessionForModal(null)}
      />
    </div>
  );
};

