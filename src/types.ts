export interface ScheduleSession {
  week: number;
  gradeClass: string; // e.g., 'أول / أ'
  activity: string;   // e.g., 'ريادة', 'تدريب نافس رياضيات'
  teacher: string;    // e.g., 'سيد حمدي'
}

export interface TeacherSummary {
  name: string;
  totalSessions: number;
  classes: string[];
  activities: string[];
  sessions: ScheduleSession[];
}

export interface WeekSummary {
  week: number;
  totalSessions: number;
  classesCount: number;
  sessions: ScheduleSession[];
}

export interface ClassSummary {
  gradeClass: string;
  totalSessions: number;
  sessions: ScheduleSession[];
}
