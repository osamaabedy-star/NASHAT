import { useState } from 'react';
import { Navbar, ViewMode } from './components/Navbar';
import { TeacherView } from './components/TeacherView';
import { WeekView } from './components/WeekView';
import { ClassView } from './components/ClassView';
import { MasterTableView } from './components/MasterTableView';
import { EvaluationReportView } from './components/EvaluationReportView';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import { ALL_TEACHERS, SCHOOL_INFO } from './data/scheduleData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('teacher');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(ALL_TEACHERS[0]);

  const handleSelectTeacherFromAnywhere = (teacherName: string) => {
    setSelectedTeacher(teacherName);
    setCurrentView('teacher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {currentView === 'teacher' && (
            <motion.div
              key="teacher"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <TeacherView initialTeacher={selectedTeacher} />
            </motion.div>
          )}

          {currentView === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <WeekView
                onSelectTeacher={handleSelectTeacherFromAnywhere}
              />
            </motion.div>
          )}

          {currentView === 'class' && (
            <motion.div
              key="class"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ClassView
                onSelectTeacher={handleSelectTeacherFromAnywhere}
              />
            </motion.div>
          )}

          {currentView === 'evaluation' && (
            <motion.div
              key="evaluation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <EvaluationReportView
                onSelectTeacher={handleSelectTeacherFromAnywhere}
              />
            </motion.div>
          )}

          {currentView === 'master' && (
            <motion.div
              key="master"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <MasterTableView
                onSelectTeacher={handleSelectTeacherFromAnywhere}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean, Minimal Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">{SCHOOL_INFO.name}</span>{' '}
            — {SCHOOL_INFO.title} ({SCHOOL_INFO.term} {SCHOOL_INFO.year})
          </div>
          <div className="text-slate-400">
            تم استخراج البيانات والجدولة بدقة وفق الوثيقة المعتمدة
          </div>
        </div>
      </footer>

      {/* Global Image Export Success & Mobile Share Modal */}
      <ExportSuccessModal />
    </div>
  );
}
