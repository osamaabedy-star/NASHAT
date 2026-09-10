import React from 'react';
import {
  Calendar,
  UserCheck,
  School,
  Table,
  Printer,
  Trophy,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/scheduleData';
import { SchoolLogo } from './SchoolLogo';

export type ViewMode = 'teacher' | 'week' | 'class' | 'master' | 'evaluation';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <SchoolLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {SCHOOL_INFO.year}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {SCHOOL_INFO.term}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {SCHOOL_INFO.name} — {SCHOOL_INFO.title}
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              id="tab-teacher"
              onClick={() => onSelectView('teacher')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>جدول المعلم</span>
            </button>

            <button
              id="tab-week"
              onClick={() => onSelectView('week')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'week'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>حصص الأسبوع</span>
            </button>

            <button
              id="tab-class"
              onClick={() => onSelectView('class')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'class'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <School className="w-4 h-4" />
              <span>جدول الفصل</span>
            </button>

            <button
              id="tab-evaluation"
              onClick={() => onSelectView('evaluation')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'evaluation'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500 group-hover:text-amber-600" />
              <span>التقييم والمراكز الأولى</span>
            </button>

            <button
              id="tab-master"
              onClick={() => onSelectView('master')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === 'master'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>الخطة الكاملة</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Admin Management Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded-xl p-0.5">
                <button
                  onClick={onOpenAdminModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-black shadow-2xs transition-all cursor-pointer"
                  title="فتح لوحة إدارة الجداول والبرامج"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span>لوحة الإدارة</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="px-2 py-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-[11px] font-bold transition-colors"
                  title="تسجيل خروج الإدارة"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                title="تسجيل دخول حساب الإدارة لتعديل الجداول"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>حساب الإدارة</span>
              </button>
            )}

            <button
              id="btn-print"
              onClick={handlePrint}
              title="طباعة الجدول الحالي"
              className="flex items-center gap-1.5 px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">طباعة</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
