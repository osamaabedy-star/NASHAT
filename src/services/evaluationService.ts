import { ScheduleSession, EvaluationEntry } from '../types';
import { SCHEDULE_DATA } from '../data/scheduleData';

const LOCAL_STORAGE_BACKUP_KEY = 'riyadh_activity_evaluations_backup_1448';

// Deterministic key for any session
export function getSessionKey(
  week: number,
  gradeClass: string,
  teacher: string,
  activity: string
): string {
  return `${week}_${gradeClass}_${teacher}_${activity}`.replace(/\s+/g, '_');
}

export interface ActivityTopRank {
  rank: 1 | 2 | 3;
  teacher: string;
  gradeClass: string;
  week: number;
  score: number;
  notes: string;
  activity: string;
}

export interface ActivityRankingReport {
  activity: string;
  topRanks: ActivityTopRank[];
  allSessions: Array<ScheduleSession & { score: number | null; notes: string }>;
  evaluatedCount: number;
  averageScore: number;
  totalSessions: number;
}

export interface TeacherEvaluationSummary {
  teacher: string;
  averageScore: number;
  evaluatedCount: number;
  totalSessions: number;
  topRankCount: number;
  scores: Array<{ activity: string; week: number; gradeClass: string; score: number | null; notes: string }>;
}

// Global in-memory cache
let inMemoryCache: Record<string, EvaluationEntry> = {};
let isInitialized = false;
let isSaving = false;
let isServerOnline = true;

// Load initial backup from localStorage if available
try {
  const localBackup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
  if (localBackup) {
    inMemoryCache = JSON.parse(localBackup);
  }
} catch {
  // Ignore
}

// Broadcast event to notify UI
function notifyListeners() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('evaluations-updated', {
      detail: { isSaving, isServerOnline }
    }));
    window.dispatchEvent(new CustomEvent('scores-updated', {
      detail: { isSaving, isServerOnline }
    }));
  }
}

// Fetch all evaluations from server
export async function initializeEvaluations(): Promise<Record<string, EvaluationEntry>> {
  if (typeof window === 'undefined') return inMemoryCache;
  try {
    const res = await fetch('/api/evaluations');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        inMemoryCache = json.data;
        isServerOnline = true;
        // Keep local backup
        try {
          localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(inMemoryCache));
        } catch {
          // ignore
        }
        isInitialized = true;
        notifyListeners();
        return inMemoryCache;
      }
    }
  } catch (err) {
    console.warn('Server evaluations fetch failed, using local backup:', err);
    isServerOnline = false;
  }
  isInitialized = true;
  notifyListeners();
  return inMemoryCache;
}

// Auto-initialize immediately
if (typeof window !== 'undefined') {
  initializeEvaluations();
}

export function getAllEvaluations(): Record<string, EvaluationEntry> {
  return inMemoryCache;
}

export function getEvaluationForSession(session: ScheduleSession): EvaluationEntry {
  const key = getSessionKey(session.week, session.gradeClass, session.teacher, session.activity);
  return inMemoryCache[key] || { score: null, notes: '' };
}

export function getScoreForSession(session: ScheduleSession): number | null {
  const item = getEvaluationForSession(session);
  return item.score ?? null;
}

export function getNotesForSession(session: ScheduleSession): string {
  const item = getEvaluationForSession(session);
  return item.notes || '';
}

// Save score and/or notes to server
export async function saveEvaluation(
  session: ScheduleSession,
  score: number | null | undefined,
  notes?: string
): Promise<void> {
  const key = getSessionKey(session.week, session.gradeClass, session.teacher, session.activity);
  const current = inMemoryCache[key] || { score: null, notes: '' };

  const validScore =
    score !== undefined
      ? score === null || isNaN(score)
        ? null
        : Math.min(100, Math.max(0, Math.round(score)))
      : current.score;

  const validNotes = notes !== undefined ? notes : current.notes;

  const updatedEntry: EvaluationEntry = {
    score: validScore,
    notes: validNotes,
    updatedAt: new Date().toISOString(),
  };

  // Optimistic update
  inMemoryCache[key] = updatedEntry;
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(inMemoryCache));
  } catch {
    // ignore
  }

  isSaving = true;
  notifyListeners();

  try {
    const res = await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, score: validScore, notes: validNotes }),
    });

    if (res.ok) {
      isServerOnline = true;
    } else {
      isServerOnline = false;
    }
  } catch (err) {
    console.error('Failed to sync evaluation to server:', err);
    isServerOnline = false;
  } finally {
    isSaving = false;
    notifyListeners();
  }
}

export async function saveScore(session: ScheduleSession, score: number | null): Promise<void> {
  return saveEvaluation(session, score, undefined);
}

export async function saveNotes(session: ScheduleSession, notes: string): Promise<void> {
  return saveEvaluation(session, undefined, notes);
}

export async function resetAllEvaluations(): Promise<void> {
  inMemoryCache = {};
  try {
    localStorage.removeItem(LOCAL_STORAGE_BACKUP_KEY);
  } catch {
    // ignore
  }
  isSaving = true;
  notifyListeners();

  try {
    await fetch('/api/evaluations/reset', { method: 'POST' });
    isServerOnline = true;
  } catch (err) {
    console.error('Failed to reset evaluations on server:', err);
    isServerOnline = false;
  } finally {
    isSaving = false;
    notifyListeners();
  }
}

// Grade label formatter
export function getGradeLabel(score: number | null) {
  if (score === null || score === undefined) {
    return {
      label: 'غير مقيّم',
      text: 'غير مقيّم',
      color: 'text-slate-400',
      badgeClass: 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300',
      bgClass: 'bg-slate-100',
    };
  }

  if (score >= 95) {
    return {
      label: 'ممتاز مرتفع',
      text: 'ممتاز مرتفع',
      color: 'text-emerald-700',
      badgeClass: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-400',
      bgClass: 'bg-emerald-600',
    };
  }
  if (score >= 90) {
    return {
      label: 'ممتاز',
      text: 'ممتاز',
      color: 'text-emerald-700',
      badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-300',
      bgClass: 'bg-emerald-500',
    };
  }
  if (score >= 85) {
    return {
      label: 'جيد جداً مرتفع',
      text: 'جيد جداً مرتفع',
      color: 'text-blue-700',
      badgeClass: 'bg-blue-50 border-blue-300 text-blue-800 hover:border-blue-400',
      bgClass: 'bg-blue-600',
    };
  }
  if (score >= 80) {
    return {
      label: 'جيد جداً',
      text: 'جيد جداً',
      color: 'text-blue-700',
      badgeClass: 'bg-blue-50 border-blue-200 text-blue-800 hover:border-blue-300',
      bgClass: 'bg-blue-500',
    };
  }
  if (score >= 70) {
    return {
      label: 'جيد',
      text: 'جيد',
      color: 'text-amber-700',
      badgeClass: 'bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-400',
      bgClass: 'bg-amber-500',
    };
  }
  return {
    label: 'مقبول',
    text: 'مقبول',
    color: 'text-orange-700',
    badgeClass: 'bg-orange-50 border-orange-300 text-orange-800 hover:border-orange-400',
    bgClass: 'bg-orange-500',
  };
}

// Activity rankings based strictly on evaluated sessions
export function getActivityReport(activityName: string): ActivityRankingReport {
  const matchingSessions = SCHEDULE_DATA.filter((s) => s.activity === activityName);

  const evaluated = matchingSessions.map((s) => {
    const entry = getEvaluationForSession(s);
    return {
      ...s,
      score: entry.score,
      notes: entry.notes,
    };
  });

  const gradedOnly = evaluated.filter((item): item is typeof item & { score: number } => item.score !== null);
  gradedOnly.sort((a, b) => b.score - a.score);

  const topRanks: ActivityTopRank[] = [];
  gradedOnly.forEach((item, index) => {
    if (index < 3) {
      topRanks.push({
        rank: (index + 1) as 1 | 2 | 3,
        teacher: item.teacher,
        gradeClass: item.gradeClass,
        week: item.week,
        score: item.score,
        notes: item.notes,
        activity: item.activity,
      });
    }
  });

  const totalScore = gradedOnly.reduce((sum, s) => sum + s.score, 0);
  const averageScore = gradedOnly.length > 0 ? Math.round((totalScore / gradedOnly.length) * 10) / 10 : 0;

  return {
    activity: activityName,
    topRanks,
    allSessions: evaluated,
    evaluatedCount: gradedOnly.length,
    averageScore,
    totalSessions: matchingSessions.length,
  };
}

// Summary of all teachers
export function getTeachersSummary(): TeacherEvaluationSummary[] {
  const teacherNames = Array.from(new Set(SCHEDULE_DATA.map((s) => s.teacher)));

  return teacherNames.map((teacher) => {
    const sessions = SCHEDULE_DATA.filter((s) => s.teacher === teacher);
    const evaluated = sessions.map((s) => {
      const entry = getEvaluationForSession(s);
      return {
        activity: s.activity,
        week: s.week,
        gradeClass: s.gradeClass,
        score: entry.score,
        notes: entry.notes,
      };
    });

    const graded = evaluated.filter((s): s is typeof s & { score: number } => s.score !== null);
    const totalScore = graded.reduce((sum, s) => sum + s.score, 0);
    const avg = graded.length > 0 ? Math.round((totalScore / graded.length) * 10) / 10 : 0;

    return {
      teacher,
      averageScore: avg,
      evaluatedCount: graded.length,
      totalSessions: sessions.length,
      topRankCount: 0,
      scores: evaluated,
    };
  });
}

// Aliases for compatibility
export const getAllTeachersEvaluation = getTeachersSummary;
export const resetScoresToDefault = resetAllEvaluations;
export const loadAllScores = getAllEvaluations;

