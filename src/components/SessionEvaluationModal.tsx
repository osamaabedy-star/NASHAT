import React, { useState, useEffect } from 'react';
import { ScheduleSession } from '../types';
import {
  getEvaluationForSession,
  saveEvaluation,
  getGradeLabel,
} from '../services/evaluationService';
import { getActivityBadgeColor } from '../data/scheduleData';
import { X, Check, RotateCcw, Award, FileText, User, School, Calendar } from 'lucide-react';

interface SessionEvaluationModalProps {
  session: ScheduleSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionEvaluationModal: React.FC<SessionEvaluationModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const [scoreInput, setScoreInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) {
      const current = getEvaluationForSession(session);
      setScoreInput(current.score !== null ? String(current.score) : '');
      setNotesInput(current.notes || '');
    }
  }, [session, isOpen]);

  if (!isOpen || !session) return null;

  const currentScoreNum = scoreInput.trim() !== '' ? Number(scoreInput) : null;
  const grade = currentScoreNum !== null && !isNaN(currentScoreNum) ? getGradeLabel(currentScoreNum) : null;
  const activityStyle = getActivityBadgeColor(session.activity);

  const handleSave = async () => {
    setIsSaving(true);
    let finalScore: number | null = null;
    if (scoreInput.trim() !== '') {
      const num = Number(scoreInput.trim());
      if (!isNaN(num)) {
        finalScore = Math.min(100, Math.max(0, Math.round(num)));
      }
    }
    await saveEvaluation(session, finalScore, notesInput.trim());
    setIsSaving(false);
    onClose();
  };

  const handleClearScore = async () => {
    setIsSaving(true);
    await saveEvaluation(session, null, notesInput.trim());
    setScoreInput('');
    setIsSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 relative text-right"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1">
              رصد تقييم الحصة والملاحظات
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {session.activity} — فصل {session.gradeClass}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session Meta Info */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>الأسبوع الدراسي: <b className="text-slate-900">الأسبوع {session.week}</b></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700">
            <School className="w-4 h-4 text-slate-500" />
            <span>الفصل: <b className="text-slate-900">{session.gradeClass}</b></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700">
            <User className="w-4 h-4 text-slate-500" />
            <span>المعلم المشرف: <b className="text-slate-900">{session.teacher}</b></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700">
            <Award className="w-4 h-4 text-slate-500" />
            <span>التصنيف: <b className="text-slate-900">{activityStyle.badge}</b></span>
          </div>
        </div>

        {/* Evaluation Score Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="score-input" className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>درجة التقييم (من 100):</span>
              </label>
              {grade && (
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${grade.badgeClass}`}>
                  التقدير: {grade.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="score-input"
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  placeholder="اتركه فارغاً إذا لم يتم التقييم بعد"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-4 py-2.5 text-base font-black text-slate-900 placeholder-slate-400 transition-all text-center"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  / 100
                </span>
              </div>

              {scoreInput.trim() !== '' && (
                <button
                  type="button"
                  onClick={handleClearScore}
                  className="flex items-center gap-1 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title="إفراغ الدرجة"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إفراغ</span>
                </button>
              )}
            </div>

            {/* Quick score buttons */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">درجات سريعة:</span>
              {[100, 95, 90, 85, 80, 75].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setScoreInput(String(num))}
                  className="px-2 py-0.5 text-xs font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 rounded-md transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label htmlFor="notes-input" className="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>الملاحظات والتوجيهات الإدارية:</span>
            </label>
            <textarea
              id="notes-input"
              rows={3}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="اكتب أي ملاحظة أو توجيه خاص بهذه الحصة..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-slate-800 focus:bg-white rounded-xl p-3 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الرصد والبيانات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
