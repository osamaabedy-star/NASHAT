import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  ALL_TEACHERS,
  SCHEDULE_DATA,
  SCHOOL_INFO,
  getActivityBadgeColor,
} from '../data/scheduleData';
import {
  getActivityReport,
  getAllTeachersEvaluation,
  loadAllScores,
  saveScore,
  resetScoresToDefault,
  getGradeLabel,
  ActivityRankingReport,
} from '../data/evaluationData';
import { exportElementAsImage } from '../utils/exportImage';
import { SchoolLogo } from './SchoolLogo';
import { OfficialSignatures } from './OfficialSignatures';
import { ScoreBadge } from './ScoreBadge';
import {
  Trophy,
  Medal,
  Award,
  BarChart3,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  School,
  User,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface EvaluationReportViewProps {
  onSelectTeacher?: (teacherName: string) => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  onSelectTeacher,
}) => {
  // Get unique list of activities
  const allActivities = useMemo(() => {
    const set = new Set<string>();
    SCHEDULE_DATA.forEach((s) => set.add(s.activity));
    return Array.from(set);
  }, []);

  const [selectedActivity, setSelectedActivity] = useState<string>(allActivities[0] || 'ريادة');
  const [viewScope, setViewScope] = useState<'by-activity' | 'all-teachers'>('by-activity');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [scoresVersion, setScoresVersion] = useState<number>(0);
  const [quickGradingOpen, setQuickGradingOpen] = useState<boolean>(false);

  // Listen to custom score updates
  useEffect(() => {
    const handleUpdate = () => setScoresVersion((v) => v + 1);
    window.addEventListener('scores-updated', handleUpdate);
    return () => window.removeEventListener('scores-updated', handleUpdate);
  }, []);

  // Force re-read scores on version change
  const currentActivityReport: ActivityRankingReport = useMemo(() => {
    // depend on scoresVersion
    void scoresVersion;
    return getActivityReport(selectedActivity);
  }, [selectedActivity, scoresVersion]);

  const allTeachersSummary = useMemo(() => {
    void scoresVersion;
    return getAllTeachersEvaluation();
  }, [scoresVersion]);

  // Chart data for current activity
  const activityChartData = useMemo(() => {
    return currentActivityReport.allSessions.map((s, idx) => ({
      name: s.teacher,
      gradeClass: s.gradeClass,
      score: s.score,
      rank: idx + 1,
    }));
  }, [currentActivityReport]);

  // Chart data for top teachers overall
  const topTeachersChartData = useMemo(() => {
    return allTeachersSummary.slice(0, 10).map((t) => ({
      name: t.teacher,
      score: t.averageScore,
    }));
  }, [allTeachersSummary]);

  // Export report as image
  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportElementAsImage(
        'evaluation-report-capture-area',
        `تقرير_تقييم_النشاط_${selectedActivity.replace(/\s+/g, '_')}_1448هـ`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetScores = () => {
    if (window.confirm('هل تريد إعادة تعيين كافة درجات التقييم إلى القيم الافتراضية؟')) {
      resetScoresToDefault();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden in print and image export) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs no-print no-image-export">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>نظام الرصد والمراكز الأولى من 100</span>
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {SCHOOL_INFO.year}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              تقرير تقييم برامج النشاط الطلابي ورصد درجات المعلمين
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setQuickGradingOpen(!quickGradingOpen)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>رصد سريع للدرجات</span>
            </button>

            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Download className="w-4 h-4 text-emerald-400" />
              )}
              <span>حفظ كصورة</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>طباعة التقرير</span>
            </button>

            <button
              onClick={handleResetScores}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-500 text-xs font-medium transition-colors cursor-pointer"
              title="إعادة تعيين الدرجات للافتراضي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filters and Activity Picker */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              عرض التقرير حسب:
            </span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewScope('by-activity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewScope === 'by-activity'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                برنامج نشاط محدد
              </button>
              <button
                onClick={() => setViewScope('all-teachers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  viewScope === 'all-teachers'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الترتيب العام لجميع المعلمين
              </button>
            </div>
          </div>

          {viewScope === 'by-activity' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                اختر البرنامج:
              </span>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {allActivities.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quick Grading Drawer / Section if opened */}
      {quickGradingOpen && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs no-print no-image-export">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black text-emerald-950">
                لوحة الرصد السريع لدرجات تقييم برنامج ({selectedActivity})
              </h3>
            </div>
            <button
              onClick={() => setQuickGradingOpen(false)}
              className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              إغلاق اللوحة
            </button>
          </div>
          <p className="text-xs text-emerald-800/80 mb-4 font-medium">
            قم بتعديل درجات المعلمين مباشرة وسيتحدث ترتيب المراكز الأولى والرسوم البيانية فورياً:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentActivityReport.allSessions.map((session, idx) => (
              <div
                key={`${session.week}-${session.gradeClass}-${idx}`}
                className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    الأستاذ / {session.teacher}
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    {session.gradeClass} — الأسبوع {session.week}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={session.score}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) saveScore(session, val);
                    }}
                    className="w-14 text-center font-black text-sm text-emerald-900 border border-slate-300 rounded-lg py-1 px-1 focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-400 font-bold">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capture Area for Image Export & Print */}
      <div
        id="evaluation-report-capture-area"
        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-xs"
      >
        {/* Document Official Header with School Logo */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <SchoolLogo size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  {SCHOOL_INFO.name}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {SCHOOL_INFO.term} ({SCHOOL_INFO.year})
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                {viewScope === 'by-activity'
                  ? `تقرير تقييم ومراكز برنامج: ${selectedActivity}`
                  : 'تقرير الترتيب العام وتقييم معلمي النشاط الطلابي'}
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                رصد التقييمات من 100 وتحديد المراكز المتقدمة طبقاً لمعايير التميز في النشاط
              </p>
            </div>
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs text-slate-400 font-bold">وزارة التعليم</div>
            <div className="text-xs text-slate-500 font-semibold">المملكة العربية السعودية</div>
            <div className="text-[11px] text-amber-700 font-bold mt-1">
              مدارس رياض الإبداع الأهلية
            </div>
          </div>
        </div>

        {/* Podium / Top Ranks Section */}
        {viewScope === 'by-activity' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-black text-slate-900">
                المراكز الثلاثة الأولى في برنامج ({selectedActivity})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Place */}
              {currentActivityReport.topRanks[0] ? (
                <div className="relative bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-2xl p-4 border-2 border-amber-400 shadow-sm flex flex-col justify-between order-1 md:order-2">
                  <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-100" />
                    <span>المركز الأول 🥇</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-amber-900 font-bold">المعلم المتصدر</div>
                    <div className="text-lg font-black text-slate-900 mt-1">
                      الأستاذ / {currentActivityReport.topRanks[0].teacher}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-0.5">
                      فصل {currentActivityReport.topRanks[0].gradeClass} — الأسبوع{' '}
                      {currentActivityReport.topRanks[0].week}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">درجة التقييم:</span>
                    <span className="text-2xl font-black text-amber-800">
                      {currentActivityReport.topRanks[0].score}{' '}
                      <span className="text-xs font-normal text-amber-700">/100</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-center text-xs text-slate-400 font-bold">
                  لا توجد بيانات للمركز الأول
                </div>
              )}

              {/* 2nd Place */}
              {currentActivityReport.topRanks[1] ? (
                <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-4 border-2 border-slate-300 shadow-sm flex flex-col justify-between order-2 md:order-1">
                  <div className="absolute -top-3 right-4 bg-slate-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Medal className="w-3 h-3 text-slate-200" />
                    <span>المركز الثاني 🥈</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-slate-600 font-bold">وصيف البرنامج</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      الأستاذ / {currentActivityReport.topRanks[1].teacher}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-0.5">
                      فصل {currentActivityReport.topRanks[1].gradeClass} — الأسبوع{' '}
                      {currentActivityReport.topRanks[1].week}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">درجة التقييم:</span>
                    <span className="text-xl font-black text-slate-800">
                      {currentActivityReport.topRanks[1].score}{' '}
                      <span className="text-xs font-normal text-slate-500">/100</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-center text-xs text-slate-400 font-bold">
                  لا توجد بيانات للمركز الثاني
                </div>
              )}

              {/* 3rd Place */}
              {currentActivityReport.topRanks[2] ? (
                <div className="relative bg-gradient-to-b from-amber-50/40 to-orange-100/30 rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex flex-col justify-between order-3">
                  <div className="absolute -top-3 right-4 bg-amber-700 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-200" />
                    <span>المركز الثالث 🥉</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-amber-900 font-bold">المركز الثالث</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      الأستاذ / {currentActivityReport.topRanks[2].teacher}
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-0.5">
                      فصل {currentActivityReport.topRanks[2].gradeClass} — الأسبوع{' '}
                      {currentActivityReport.topRanks[2].week}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">درجة التقييم:</span>
                    <span className="text-xl font-black text-amber-900">
                      {currentActivityReport.topRanks[2].score}{' '}
                      <span className="text-xs font-normal text-amber-700">/100</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-center text-xs text-slate-400 font-bold">
                  لا توجد بيانات للمركز الثالث
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual Charts Section */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black text-slate-900">
                {viewScope === 'by-activity'
                  ? `الرسم البياني لمقارنة درجات المعلمين في (${selectedActivity})`
                  : 'الرسم البياني لأعلى 10 معلمين في متوسط درجات النشاط'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              المقياس: من 0 إلى 100 درجة
            </span>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={viewScope === 'by-activity' ? activityChartData : topTeachersChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  domain={[70, 100]}
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(val: number | undefined) => [
                    `${val ?? 0} من 100`,
                    'الدرجة المستحقة',
                  ]}
                  labelFormatter={(label) => `الأستاذ / ${label}`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {(viewScope === 'by-activity'
                    ? activityChartData
                    : topTeachersChartData
                  ).map((entry, index) => {
                    let color = '#059669'; // Emerald
                    if (index === 0) color = '#D97706'; // Gold for 1st
                    else if (index === 1) color = '#475569'; // Silver for 2nd
                    else if (index === 2) color = '#B45309'; // Bronze for 3rd
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table (Bordered & strictly defined with close elements) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-slate-800 text-sm">
                {viewScope === 'by-activity'
                  ? `جدول رصد درجات المعلمين وترتيبهم في برنامج: ${selectedActivity}`
                  : 'جدول رصد متوسط درجات تقييم كافة المعلمين'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              انقر على أي درجة لتعديلها ورصدها مباشرة
            </span>
          </div>

          {/* Strictly bordered table with activity & category close together */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-300">
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-16">
                    الترتيب
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-44">اسم المعلم</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-28">الفصل الدراسي</th>
                  {viewScope === 'by-activity' && (
                    <th className="py-2.5 px-3 border-r border-slate-300 w-24">الأسبوع</th>
                  )}
                  <th className="py-2.5 px-3 border-r border-slate-300">
                    النشاط والتصنيف
                  </th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-36">
                    الدرجة (من 100)
                  </th>
                  <th className="py-2.5 px-3 text-center w-32">التقدير العام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {viewScope === 'by-activity' ? (
                  currentActivityReport.allSessions.map((session, idx) => {
                    const grade = getGradeLabel(session.score);
                    const isFirst = idx === 0;
                    const isSecond = idx === 1;
                    const isThird = idx === 2;
                    const style = getActivityBadgeColor(session.activity);

                    return (
                      <tr
                        key={`${session.week}-${session.gradeClass}-${idx}`}
                        className={`hover:bg-slate-50 transition-colors ${
                          isFirst ? 'bg-amber-50/40 font-bold' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-2.5 px-3 border-r border-slate-200 text-center font-black">
                          {isFirst && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs">
                              1🥇
                            </span>
                          )}
                          {isSecond && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-500 text-white text-xs">
                              2🥈
                            </span>
                          )}
                          {isThird && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs">
                              3🥉
                            </span>
                          )}
                          {!isFirst && !isSecond && !isThird && (
                            <span className="text-slate-500">{idx + 1}</span>
                          )}
                        </td>

                        {/* Teacher */}
                        <td className="py-2.5 px-3 border-r border-slate-200 font-extrabold text-slate-900 whitespace-nowrap">
                          {onSelectTeacher ? (
                            <button
                              onClick={() => onSelectTeacher(session.teacher)}
                              className="hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1.5"
                            >
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>الأستاذ / {session.teacher}</span>
                            </button>
                          ) : (
                            <span>الأستاذ / {session.teacher}</span>
                          )}
                        </td>

                        {/* Grade Class */}
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-700 whitespace-nowrap">
                          <span className="inline-block bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 text-xs">
                            {session.gradeClass}
                          </span>
                        </td>

                        {/* Week */}
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-700 whitespace-nowrap">
                          الأسبوع {session.week}
                        </td>

                        {/* Activity Name AND Category closely together in same cell */}
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {session.activity}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${style.bg}`}
                            >
                              {style.badge}
                            </span>
                          </div>
                        </td>

                        {/* Score out of 100 with Click-to-Grade */}
                        <td className="py-2.5 px-3 border-r border-slate-200 text-center whitespace-nowrap">
                          <ScoreBadge
                            session={session}
                            onScoreUpdated={() => setScoresVersion((v) => v + 1)}
                          />
                        </td>

                        {/* Grade Label */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${grade.badgeClass}`}
                          >
                            {grade.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  allTeachersSummary.map((t, idx) => {
                    const grade = getGradeLabel(t.averageScore);
                    const isFirst = idx === 0;
                    const isSecond = idx === 1;
                    const isThird = idx === 2;

                    return (
                      <tr
                        key={t.teacher}
                        className={`hover:bg-slate-50 transition-colors ${
                          isFirst ? 'bg-amber-50/40 font-bold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 border-r border-slate-200 text-center font-black">
                          {isFirst && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs">
                              1🥇
                            </span>
                          )}
                          {isSecond && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-500 text-white text-xs">
                              2🥈
                            </span>
                          )}
                          {isThird && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs">
                              3🥉
                            </span>
                          )}
                          {!isFirst && !isSecond && !isThird && (
                            <span className="text-slate-500">{idx + 1}</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-200 font-extrabold text-slate-900 whitespace-nowrap">
                          {onSelectTeacher ? (
                            <button
                              onClick={() => onSelectTeacher(t.teacher)}
                              className="hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1.5"
                            >
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>الأستاذ / {t.teacher}</span>
                            </button>
                          ) : (
                            <span>الأستاذ / {t.teacher}</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600 text-xs font-bold">
                          {t.totalSessions} حصص نشاط
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700 text-xs font-semibold">
                          متنوع البرامج (ريادة، نافس، مسابقات)
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-200 text-center font-black text-base text-slate-900">
                          <span className={grade.color}>{t.averageScore}</span>{' '}
                          <span className="text-xs text-slate-400 font-normal">/100</span>
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${grade.badgeClass}`}
                          >
                            {grade.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Signatures */}
        <OfficialSignatures />
      </div>
    </div>
  );
};
