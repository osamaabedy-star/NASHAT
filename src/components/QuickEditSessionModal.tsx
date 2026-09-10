import React, { useState } from 'react';
import { X, Save, AlertTriangle, CheckCircle2, UserCheck, BookOpen } from 'lucide-react';
import { ScheduleSession } from '../types';
import {
  checkTeacherAvailability,
  updateSessionWithValidation,
  getAllUniqueTeachers,
  getAllUniquePrograms,
  getCurrentSchedule,
} from '../services/scheduleService';

interface QuickEditSessionModalProps {
  session: ScheduleSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const QuickEditSessionModal: React.FC<QuickEditSessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onSaved,
}) => {
  if (!isOpen || !session) return null;

  const currentSchedule = getCurrentSchedule();
  const uniqueTeachers = getAllUniqueTeachers(currentSchedule);
  const uniquePrograms = getAllUniquePrograms(currentSchedule);

  const [activity, setActivity] = useState(session.activity);
  const [teacher, setTeacher] = useState(session.teacher);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Live conflict check
  const conflictCheck = checkTeacherAvailability(
    teacher,
    session.week,
    session.gradeClass,
    currentSchedule
  );

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const res = await updateSessionWithValidation(
      session.week,
      session.gradeClass,
      activity,
      teacher
    );

    if (res.success) {
      setSuccess('تم حفظ التعديل بنجاح وبدون أي تعارض!');
      if (onSaved) onSaved();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(res.error || 'حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              {session.week}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                تعديل حصة: الأسبوع {session.week} — فصل ({session.gradeClass})
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                تعديل البرنامج أو إسناد المعلم مع الفحص الفوري للتعارض
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Conflict Alert if any */}
          {conflictCheck.hasConflict && (
            <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-900 flex items-start gap-2 text-xs font-bold">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-red-950">⚠️ تنبيه تعارض الحصص:</div>
                <div className="mt-0.5 leading-relaxed">{conflictCheck.message}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>البرنامج / النشاط:</span>
              </label>
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                list="quick-programs-list"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <datalist id="quick-programs-list">
                {uniquePrograms.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>المعلم المسند إليه في الأسبوع {session.week}:</span>
              </label>
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                {uniqueTeachers.map((t) => {
                  const teacherSessionsCount = currentSchedule.filter((s) => s.teacher === t).length;
                  const isBusy = checkTeacherAvailability(
                    t,
                    session.week,
                    session.gradeClass,
                    currentSchedule
                  ).hasConflict;

                  return (
                    <option
                      key={t}
                      value={t}
                      className={isBusy ? 'text-red-600 font-semibold' : 'text-emerald-800'}
                    >
                      {t} ({teacherSessionsCount} حصة) {isBusy ? '⚠️ [مشغول في هذا الأسبوع]' : '✅ [متاح]'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={conflictCheck.hasConflict}
              className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                conflictCheck.hasConflict
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديل الآن</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
