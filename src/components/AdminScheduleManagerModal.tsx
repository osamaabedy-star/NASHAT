import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  UserCheck,
  Layers,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Search,
  UserPlus,
  BookOpen,
  LogOut,
  Save,
  Check,
  AlertCircle
} from 'lucide-react';
import { ScheduleSession } from '../types';
import {
  getCurrentSchedule,
  getAllUniqueTeachers,
  getAllUniquePrograms,
  getAllUniqueClasses,
  getAllWeeks,
  checkTeacherAvailability,
  auditScheduleConflicts,
  updateSessionWithValidation,
  moveProgramBetweenWeeks,
  renameTeacherEverywhere,
  renameProgramEverywhere,
  resetScheduleToBaseline,
} from '../services/scheduleService';
import { getActivityBadgeColor } from '../data/scheduleData';

interface AdminScheduleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabType = 'sessions' | 'move_week' | 'directory' | 'audit';

export const AdminScheduleManagerModal: React.FC<AdminScheduleManagerModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('sessions');

  // Filter state for Tab 1
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing session state
  const [editingSession, setEditingSession] = useState<{
    week: number;
    gradeClass: string;
    activity: string;
    teacher: string;
    originalTeacher: string;
  } | null>(null);
  const [sessionFormError, setSessionFormError] = useState<string | null>(null);
  const [sessionFormSuccess, setSessionFormSuccess] = useState<string | null>(null);

  // Tab 2: Move Program State
  const [moveSourceWeek, setMoveSourceWeek] = useState<number>(3);
  const [moveSourceClass, setMoveSourceClass] = useState<string>('ثاني / أ');
  const [moveTargetWeek, setMoveTargetWeek] = useState<number>(4);
  const [moveTargetClass, setMoveTargetClass] = useState<string>('ثاني / أ');
  const [moveMsg, setMoveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tab 3: Directory rename state
  const [teacherToRename, setTeacherToRename] = useState<string>('');
  const [newTeacherName, setNewTeacherName] = useState<string>('');
  const [programToRename, setProgramToRename] = useState<string>('');
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [dirMsg, setDirMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset modal confirm
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Re-read current schedule whenever tab or state changes
  const [scheduleVersion, setScheduleVersion] = useState(0);
  const refreshLocal = () => setScheduleVersion((v) => v + 1);

  const schedule = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    scheduleVersion;
    return getCurrentSchedule();
  }, [scheduleVersion]);

  const uniqueTeachers = useMemo(() => getAllUniqueTeachers(schedule), [schedule]);
  const uniquePrograms = useMemo(() => getAllUniquePrograms(schedule), [schedule]);
  const uniqueClasses = useMemo(() => getAllUniqueClasses(schedule), [schedule]);
  const weeks = useMemo(() => getAllWeeks(schedule), [schedule]);
  const auditConflicts = useMemo(() => auditScheduleConflicts(schedule), [schedule]);

  if (!isOpen) return null;

  // Filtered sessions for Tab 1
  const filteredSessions = schedule.filter((s) => {
    if (filterWeek !== 'all' && s.week !== filterWeek) return false;
    if (filterClass !== 'all' && s.gradeClass !== filterClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTeacher = s.teacher.toLowerCase().includes(q);
      const matchActivity = s.activity.toLowerCase().includes(q);
      const matchClass = s.gradeClass.toLowerCase().includes(q);
      return matchTeacher || matchActivity || matchClass;
    }
    return true;
  });

  // Check live availability for editing session
  const editConflictCheck = editingSession
    ? checkTeacherAvailability(
        editingSession.teacher,
        editingSession.week,
        editingSession.gradeClass,
        schedule
      )
    : { hasConflict: false };

  // Save session update
  const handleSaveSession = async () => {
    if (!editingSession) return;
    setSessionFormError(null);
    setSessionFormSuccess(null);

    const res = await updateSessionWithValidation(
      editingSession.week,
      editingSession.gradeClass,
      editingSession.activity,
      editingSession.teacher
    );

    if (res.success) {
      setSessionFormSuccess('تم حفظ التعديل بنجاح وبدون أي تعارض!');
      refreshLocal();
      setTimeout(() => {
        setEditingSession(null);
        setSessionFormSuccess(null);
      }, 1200);
    } else {
      setSessionFormError(res.error || 'حدث خطأ أثناء الحفظ');
    }
  };

  // Handle Move / Swap Program
  const handleExecuteMove = async () => {
    setMoveMsg(null);
    const res = await moveProgramBetweenWeeks(
      moveSourceWeek,
      moveSourceClass,
      moveTargetWeek,
      moveTargetClass
    );

    if (res.success) {
      setMoveMsg({
        type: 'success',
        text: `تم نقل/تبديل البرنامج بنجاح بين الأسبوع ${moveSourceWeek} والأسبوع ${moveTargetWeek} مع فحص وتأكيد عدم وجود تعارض!`,
      });
      refreshLocal();
    } else {
      setMoveMsg({
        type: 'error',
        text: res.error || 'فشلت عملية النقل لوجود تعارض في الحصص للمعلم!',
      });
    }
  };

  // Handle Rename Teacher
  const handleRenameTeacher = async () => {
    if (!teacherToRename || !newTeacherName.trim()) return;
    setDirMsg(null);
    const res = await renameTeacherEverywhere(teacherToRename, newTeacherName.trim());
    if (res.success) {
      setDirMsg({
        type: 'success',
        text: `تم تحديث اسم المعلم (${teacherToRename} ➔ ${newTeacherName.trim()}) في (${res.affectedCount}) حصة بنجاح!`,
      });
      setTeacherToRename('');
      setNewTeacherName('');
      refreshLocal();
    } else {
      setDirMsg({ type: 'error', text: res.error || 'حدث خطأ أثناء تعديل الاسم' });
    }
  };

  // Handle Rename Program
  const handleRenameProgram = async () => {
    if (!programToRename || !newProgramName.trim()) return;
    setDirMsg(null);
    const res = await renameProgramEverywhere(programToRename, newProgramName.trim());
    if (res.success) {
      setDirMsg({
        type: 'success',
        text: `تم تحديث اسم البرنامج (${programToRename} ➔ ${newProgramName.trim()}) في (${res.affectedCount}) حصة بنجاح!`,
      });
      setProgramToRename('');
      setNewProgramName('');
      refreshLocal();
    } else {
      setDirMsg({ type: 'error', text: res.error || 'حدث خطأ أثناء تعديل البرنامج' });
    }
  };

  // Handle Reset
  const handleResetBaseline = async () => {
    await resetScheduleToBaseline();
    setShowResetConfirm(false);
    refreshLocal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-[98vw] max-w-7xl h-[95vh] max-h-[95vh] flex flex-col overflow-hidden text-slate-800"
        dir="rtl"
      >
        {/* Top Bar - Compact */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-tight">
                لوحة إدارة وتعديل الجداول والأنشطة
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10.5px] font-bold">
                صلاحيات الإدارة مُفعلة
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="تسجيل خروج الإدارة"
              className="px-2.5 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 border border-red-700/50 text-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج الإدارة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Compact */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 py-1.5">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل الحصص وإسناد البرامج</span>
          </button>

          <button
            onClick={() => setActiveTab('move_week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'move_week'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>نقل برنامج بين الأسابيع</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>إدارة أسماء المعلمين والبرامج</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>تدقيق التعارضات</span>
            {auditConflicts.length === 0 ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
                {auditConflicts.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-50/50">
          {/* ================= TAB 1: EDIT SESSIONS ================= */}
          {activeTab === 'sessions' && (
            <div className="space-y-3.5">
              {/* Filters */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    تصفية بالأسبوع:
                  </label>
                  <select
                    value={filterWeek}
                    onChange={(e) =>
                      setFilterWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="all">جميع الأسابيع (الكامل)</option>
                    {weeks.map((w) => (
                      <option key={w} value={w}>
                        الأسبوع {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    تصفية بالفصل:
                  </label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="all">جميع الفصول الدراسية</option>
                    {uniqueClasses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    بحث باسم المعلم أو البرنامج:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث هنا..."
                      className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Sessions Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-800 text-white font-extrabold z-10">
                      <tr>
                        <th className="p-3 border-b border-slate-700 w-16 text-center">الأسبوع</th>
                        <th className="p-3 border-b border-slate-700 w-24">الفصل</th>
                        <th className="p-3 border-b border-slate-700">البرنامج / النشاط</th>
                        <th className="p-3 border-b border-slate-700">المعلم المسند إليه</th>
                        <th className="p-3 border-b border-slate-700 w-24 text-center">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredSessions.map((session, idx) => {
                        const isEditingThis =
                          editingSession &&
                          editingSession.week === session.week &&
                          editingSession.gradeClass === session.gradeClass;

                        const badge = getActivityBadgeColor(session.activity);

                        return (
                          <tr
                            key={`${session.week}-${session.gradeClass}`}
                            className={`hover:bg-emerald-50/40 transition-colors ${
                              isEditingThis ? 'bg-amber-50/80 ring-2 ring-amber-400' : ''
                            }`}
                          >
                            <td className="p-3 text-center font-extrabold text-slate-900 bg-slate-50/60">
                              {session.week}
                            </td>
                            <td className="p-3 font-bold text-slate-800">{session.gradeClass}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] border ${badge.bg} ${badge.border}`}
                              >
                                {session.activity}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{session.teacher}</span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setEditingSession({
                                    week: session.week,
                                    gradeClass: session.gradeClass,
                                    activity: session.activity,
                                    teacher: session.teacher,
                                    originalTeacher: session.teacher,
                                  });
                                  setSessionFormError(null);
                                  setSessionFormSuccess(null);
                                }}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 border border-emerald-300 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>تعديل</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-600 font-bold text-xs flex justify-between items-center">
                  <span>عدد الحصص المعروضة: {filteredSessions.length} حصة</span>
                  <span className="text-[11px] text-slate-500">
                    إجمالي الجدول الكامل: {schedule.length} حصة
                  </span>
                </div>
              </div>

              {/* Editing Modal / Drawer if a session is selected */}
              {editingSession && (
                <div className="p-4 bg-white border-2 border-emerald-600 rounded-2xl shadow-lg space-y-4 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                        {editingSession.week}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        تعديل الحصة: الأسبوع {editingSession.week} — فصل ({editingSession.gradeClass})
                      </h4>
                    </div>
                    <button
                      onClick={() => setEditingSession(null)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Conflict Alert Box if teacher is busy */}
                  {editConflictCheck.hasConflict && (
                    <div className="p-3.5 bg-red-50 border-2 border-red-400 rounded-xl text-red-900 flex items-start gap-2.5 text-xs font-bold">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-red-800">
                          ⚠️ تنبيه تعارض: لا يمكن إسناد المعلم!
                        </div>
                        <div className="mt-1 leading-relaxed">{editConflictCheck.message}</div>
                        <div className="text-[11px] text-red-700 mt-1 font-semibold">
                          اختر معلماً آخر متاحاً في هذا الأسبوع للحفظ.
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionFormSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{sessionFormSuccess}</span>
                    </div>
                  )}

                  {sessionFormError && (
                    <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{sessionFormError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        البرنامج / النشاط:
                      </label>
                      <input
                        type="text"
                        value={editingSession.activity}
                        onChange={(e) =>
                          setEditingSession({ ...editingSession, activity: e.target.value })
                        }
                        list="programs-list"
                        placeholder="اختر أو اكتب اسم البرنامج..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      />
                      <datalist id="programs-list">
                        {uniquePrograms.map((p) => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        المعلم المسند إليه (مع بيان التوفر في الأسبوع {editingSession.week}):
                      </label>
                      <select
                        value={editingSession.teacher}
                        onChange={(e) =>
                          setEditingSession({ ...editingSession, teacher: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                      >
                        {uniqueTeachers.map((t) => {
                          const teacherSessionsCount = schedule.filter((s) => s.teacher === t).length;
                          const isBusy = checkTeacherAvailability(
                            t,
                            editingSession.week,
                            editingSession.gradeClass,
                            schedule
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

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSaveSession}
                      disabled={editConflictCheck.hasConflict}
                      className={`py-2 px-5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all ${
                        editConflictCheck.hasConflict
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديل</span>
                    </button>
                    <button
                      onClick={() => setEditingSession(null)}
                      className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: MOVE PROGRAM BETWEEN WEEKS ================= */}
          {activeTab === 'move_week' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    نقل أو تبديل برنامج بين أسبوع وأسبوع
                  </h3>
                </div>

                {moveMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                      moveMsg.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border border-red-300 text-red-900'
                    }`}
                  >
                    {moveMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>{moveMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Source Session */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>1. الحصة المصدر (الحالية):</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الأسبوع المصدر:
                      </label>
                      <select
                        value={moveSourceWeek}
                        onChange={(e) => setMoveSourceWeek(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        {weeks.map((w) => (
                          <option key={w} value={w}>
                            الأسبوع {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الفصل الدراسي المصدر:
                      </label>
                      <select
                        value={moveSourceClass}
                        onChange={(e) => setMoveSourceClass(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        {uniqueClasses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preview source session details */}
                    {(() => {
                      const src = schedule.find(
                        (s) => s.week === moveSourceWeek && s.gradeClass === moveSourceClass
                      );
                      if (!src) return null;
                      return (
                        <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg text-[11px] space-y-1">
                          <div>
                            <span className="font-extrabold text-blue-900">البرنامج:</span>{' '}
                            {src.activity}
                          </div>
                          <div>
                            <span className="font-extrabold text-blue-900">المعلم:</span>{' '}
                            {src.teacher}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Target Session */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>2. الأسبوع والفصل المستهدف (الوجهة):</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الأسبوع الهدف:
                      </label>
                      <select
                        value={moveTargetWeek}
                        onChange={(e) => setMoveTargetWeek(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        {weeks.map((w) => (
                          <option key={w} value={w}>
                            الأسبوع {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        الفصل الدراسي الهدف:
                      </label>
                      <select
                        value={moveTargetClass}
                        onChange={(e) => setMoveTargetClass(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      >
                        {uniqueClasses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preview target session details */}
                    {(() => {
                      const tgt = schedule.find(
                        (s) => s.week === moveTargetWeek && s.gradeClass === moveTargetClass
                      );
                      if (!tgt) return null;
                      return (
                        <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-[11px] space-y-1">
                          <div>
                            <span className="font-extrabold text-emerald-900">البرنامج الحالي:</span>{' '}
                            {tgt.activity}
                          </div>
                          <div>
                            <span className="font-extrabold text-emerald-900">المعلم الحالي:</span>{' '}
                            {tgt.teacher}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleExecuteMove}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>تنفيذ عملية النقل / التبديل مع التحقق من عدم التعارض</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: DIRECTORY (RENAME TEACHERS / PROGRAMS) ================= */}
          {activeTab === 'directory' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              {dirMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-start gap-2 ${
                    dirMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border border-red-300 text-red-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{dirMsg.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Rename Teacher Card */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-emerald-700" />
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          تعديل اسم معلم في كامل الجدول
                        </h3>
                      </div>
                      {teacherToRename && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-black text-xs border border-emerald-300">
                          {schedule.filter((s) => s.teacher === teacherToRename).length} حصة مسندة
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اختر المعلم الحالي المراد تعديله:
                      </label>
                      <select
                        value={teacherToRename}
                        onChange={(e) => setTeacherToRename(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="">-- اختر المعلم --</option>
                        {uniqueTeachers.map((t) => {
                          const count = schedule.filter((s) => s.teacher === t).length;
                          return (
                            <option key={t} value={t}>
                              الأستاذ / {t} — ({count} حصة)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الاسم الجديد المعدل:
                      </label>
                      <input
                        type="text"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="اكتب الاسم الجديد..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                      >
                      </input>
                    </div>

                    {teacherToRename && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold flex items-center justify-between text-slate-700">
                        <span>المعلم المختار: <b className="text-slate-900">{teacherToRename}</b></span>
                        <span>عدد الحصص في الجدول: <b className="text-emerald-700">{schedule.filter((s) => s.teacher === teacherToRename).length} حصص</b></span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRenameTeacher}
                    disabled={!teacherToRename || !newTeacherName.trim()}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      !teacherToRename || !newTeacherName.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      تطبيق تعديل اسم المعلم في كامل الجدول{' '}
                      {teacherToRename ? `(${schedule.filter((s) => s.teacher === teacherToRename).length} حصة)` : ''}
                    </span>
                  </button>
                </div>

                {/* Rename Program Card */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-700" />
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          تعديل اسم برنامج / نشاط في كامل الجدول
                        </h3>
                      </div>
                      {programToRename && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-black text-xs border border-emerald-300">
                          {schedule.filter((s) => s.activity === programToRename).length} حصة في الجدول
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اختر البرنامج الحالي:
                      </label>
                      <select
                        value={programToRename}
                        onChange={(e) => setProgramToRename(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="">-- اختر البرنامج --</option>
                        {uniquePrograms.map((p) => {
                          const count = schedule.filter((s) => s.activity === p).length;
                          return (
                            <option key={p} value={p}>
                              {p} — ({count} حصة)
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الاسم الجديد للبرنامج:
                      </label>
                      <input
                        type="text"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                        placeholder="اكتب اسم البرنامج الجديد..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>

                    {programToRename && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold flex items-center justify-between text-slate-700">
                        <span>البرنامج المختار: <b className="text-slate-900">{programToRename}</b></span>
                        <span>عدد الحصص في الجدول: <b className="text-emerald-700">{schedule.filter((s) => s.activity === programToRename).length} حصص</b></span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRenameProgram}
                    disabled={!programToRename || !newProgramName.trim()}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      !programToRename || !newProgramName.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      تطبيق تعديل اسم البرنامج في كامل الجدول{' '}
                      {programToRename ? `(${schedule.filter((s) => s.activity === programToRename).length} حصة)` : ''}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CONFLICT AUDITOR ================= */}
          {activeTab === 'audit' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    نظام التدقيق الشامل والتحقق من عدم تكرار المعلمين
                  </h3>
                </div>

                {auditConflicts.length === 0 ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                      <Check className="w-7 h-7" />
                    </div>
                    <h4 className="font-black text-emerald-950 text-base">
                      الجدول معتمد ونظامي 100% — لا توجد أي تعارضات!
                    </h4>
                    <p className="text-xs font-bold text-emerald-800 max-w-lg mx-auto leading-relaxed">
                      تم فحص جميع الحصص الـ ({schedule.length}) عبر كافة الأسابيع الـ ({weeks.length})، وتم التأكد التام من عدم وجود أي معلم مسند له أكثر من حصة في الأسبوع الواحد.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-900 text-xs font-bold flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-red-950 text-sm">
                          تم رصد ({auditConflicts.length}) حالة تعارض تحتاج مراجعة:
                        </div>
                        <div className="mt-1 text-slate-700 font-medium">
                          المعلمون التاليون تم رصدهم في أكثر من فصل بنفس الأسبوع:
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {auditConflicts.map((c, i) => (
                        <div key={i} className="p-3.5 bg-white flex items-center justify-between">
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">
                              الأسبوع {c.week} — المعلم: <span className="text-red-700">{c.teacher}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              الفصول: {c.classes.join('، ')} | البرامج: {c.activities.join('، ')}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setFilterWeek(c.week);
                              setActiveTab('sessions');
                            }}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-700 hover:text-white text-red-800 border border-red-200 rounded-lg text-xs font-bold transition-colors"
                          >
                            تعديل في الجدول
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Danger Zone: Reset to baseline */}
              <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-red-950">
                      استعادة الجدول الرسمي الافتراضي
                    </h4>
                    <p className="text-[11px] text-red-800/80 font-semibold">
                      في حال الرغبة في التراجع عن كافة التعديلات والعودة للنسخة الرسمية الأصلية
                    </p>
                  </div>
                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-700 hover:text-white text-red-900 border border-red-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>استعادة الأصل</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetBaseline}
                        className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors"
                      >
                        نعم، تأكيد الاستعادة
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
