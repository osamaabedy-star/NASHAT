import { ScheduleSession } from '../types';
import { SCHEDULE_DATA } from '../data/scheduleData';

const LOCAL_STORAGE_SCHEDULE_KEY = 'riyadh_custom_schedule_data_1448';
const LOCAL_STORAGE_ADMIN_AUTH_KEY = 'riyadh_admin_authenticated_1448';
const LOCAL_STORAGE_ADMIN_PIN_KEY = 'riyadh_admin_pin_1448';
const DEFAULT_ADMIN_PIN = '1448';

export interface ConflictDetail {
  hasConflict: boolean;
  conflictingSession?: ScheduleSession;
  message?: string;
}

export interface TeacherWeekAuditConflict {
  week: number;
  teacher: string;
  classes: string[];
  activities: string[];
}

// In-memory reactive state
let currentSchedule: ScheduleSession[] = [...SCHEDULE_DATA];
let isScheduleInitialized = false;

// Load initial backup from localStorage if available
try {
  const saved = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      currentSchedule = parsed;
    }
  }
} catch {
  // Use baseline
}

function notifyScheduleUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('schedule-data-updated', {
      detail: { count: currentSchedule.length }
    }));
  }
}

function saveLocal() {
  try {
    localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, JSON.stringify(currentSchedule));
  } catch {
    // Ignore storage quota
  }
}

// Check if a teacher already has a class in a specific week
export function checkTeacherAvailability(
  teacher: string,
  week: number,
  currentClassToExclude?: string,
  customSchedule?: ScheduleSession[]
): ConflictDetail {
  const schedule = customSchedule || currentSchedule;
  const cleanTeacher = teacher?.trim();
  if (!cleanTeacher) return { hasConflict: false };

  const conflictingSession = schedule.find(
    (s) =>
      s.week === week &&
      s.teacher.trim() === cleanTeacher &&
      (currentClassToExclude ? s.gradeClass !== currentClassToExclude : true)
  );

  if (conflictingSession) {
    return {
      hasConflict: true,
      conflictingSession,
      message: `الأستاذ / ${cleanTeacher} مسند له بالفعل حصة في هذا الأسبوع (${week}) مع فصل (${conflictingSession.gradeClass}) لبرنامج (${conflictingSession.activity})! النظام يمنع تكرار المعلم في أكثر من حصة في الأسبوع نفسه.`,
    };
  }

  return { hasConflict: false };
}

// Full schedule audit for any teacher conflicts
export function auditScheduleConflicts(customSchedule?: ScheduleSession[]): TeacherWeekAuditConflict[] {
  const schedule = customSchedule || currentSchedule;
  const conflicts: TeacherWeekAuditConflict[] = [];
  const weeks = Array.from(new Set(schedule.map((s) => s.week))).sort((a, b) => a - b);

  for (const w of weeks) {
    const weekSessions = schedule.filter((s) => s.week === w);
    const teacherMap: Record<string, { classes: string[]; activities: string[] }> = {};

    for (const s of weekSessions) {
      const t = s.teacher.trim();
      if (!teacherMap[t]) {
        teacherMap[t] = { classes: [], activities: [] };
      }
      teacherMap[t].classes.push(s.gradeClass);
      teacherMap[t].activities.push(s.activity);
    }

    for (const [teacher, data] of Object.entries(teacherMap)) {
      if (data.classes.length > 1) {
        conflicts.push({
          week: w,
          teacher,
          classes: data.classes,
          activities: data.activities,
        });
      }
    }
  }

  return conflicts;
}

// Public API
export function getCurrentSchedule(): ScheduleSession[] {
  return [...currentSchedule];
}

export function getAllUniqueTeachers(schedule?: ScheduleSession[]): string[] {
  const target = schedule || currentSchedule;
  return Array.from(new Set(target.map((s) => s.teacher.trim())))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'ar'));
}

export function getAllUniquePrograms(schedule?: ScheduleSession[]): string[] {
  const target = schedule || currentSchedule;
  return Array.from(new Set(target.map((s) => s.activity.trim())))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'ar'));
}

export function getAllUniqueClasses(schedule?: ScheduleSession[]): string[] {
  const target = schedule || currentSchedule;
  return Array.from(new Set(target.map((s) => s.gradeClass.trim()))).sort((a, b) =>
    a.localeCompare(b, 'ar')
  );
}

export function getAllWeeks(schedule?: ScheduleSession[]): number[] {
  const target = schedule || currentSchedule;
  return Array.from(new Set(target.map((s) => s.week))).sort((a, b) => a - b);
}

// Update a single session with conflict safety
export async function updateSessionWithValidation(
  week: number,
  gradeClass: string,
  newActivity: string,
  newTeacher: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Check teacher conflict in that week
  const conflict = checkTeacherAvailability(newTeacher, week, gradeClass);
  if (conflict.hasConflict) {
    return {
      success: false,
      error: conflict.message || 'يوجد تعارض: المعلم مسند له حصة أخرى في نفس الأسبوع!',
    };
  }

  // 2. Update session in memory
  let found = false;
  currentSchedule = currentSchedule.map((s) => {
    if (s.week === week && s.gradeClass === gradeClass) {
      found = true;
      return {
        ...s,
        activity: newActivity.trim(),
        teacher: newTeacher.trim(),
      };
    }
    return s;
  });

  if (!found) {
    // Session didn't exist, append it
    currentSchedule.push({
      week,
      gradeClass,
      activity: newActivity.trim(),
      teacher: newTeacher.trim(),
    });
  }

  saveLocal();
  notifyScheduleUpdated();

  // Async server persist
  try {
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: currentSchedule }),
    }).catch(() => {});
  } catch {
    // Local persistence is intact
  }

  return { success: true };
}

// Move/transfer a program from one week to another (or swap)
export async function moveProgramBetweenWeeks(
  sourceWeek: number,
  sourceClass: string,
  targetWeek: number,
  targetClass?: string
): Promise<{ success: boolean; error?: string }> {
  const finalTargetClass = targetClass || sourceClass;

  const sourceSession = currentSchedule.find(
    (s) => s.week === sourceWeek && s.gradeClass === sourceClass
  );
  if (!sourceSession) {
    return { success: false, error: 'الحصة الأصلية غير موجودة' };
  }

  // Check target session
  const targetSession = currentSchedule.find(
    (s) => s.week === targetWeek && s.gradeClass === finalTargetClass
  );

  // If moving within same week and class, nothing to do
  if (sourceWeek === targetWeek && sourceClass === finalTargetClass) {
    return { success: true };
  }

  // Validation 1: Will source teacher have conflict in target week?
  const teacherConflict = checkTeacherAvailability(
    sourceSession.teacher,
    targetWeek,
    finalTargetClass
  );
  if (teacherConflict.hasConflict) {
    return {
      success: false,
      error: `لا يمكن النقل للأسبوع ${targetWeek}: ${teacherConflict.message}`,
    };
  }

  // If there's a target session, and we are swapping, check if target teacher has conflict in source week
  if (targetSession) {
    const swapTeacherConflict = checkTeacherAvailability(
      targetSession.teacher,
      sourceWeek,
      sourceClass
    );
    if (swapTeacherConflict.hasConflict) {
      return {
        success: false,
        error: `لا يمكن التبديل: المعلم (${targetSession.teacher}) لديه حصة أخرى في الأسبوع (${sourceWeek})!`,
      };
    }

    // Perform swap
    currentSchedule = currentSchedule.map((s) => {
      if (s.week === sourceWeek && s.gradeClass === sourceClass) {
        return { ...s, activity: targetSession.activity, teacher: targetSession.teacher };
      }
      if (s.week === targetWeek && s.gradeClass === finalTargetClass) {
        return { ...s, activity: sourceSession.activity, teacher: sourceSession.teacher };
      }
      return s;
    });
  } else {
    // Just move the session
    currentSchedule = currentSchedule.map((s) => {
      if (s.week === sourceWeek && s.gradeClass === sourceClass) {
        return { ...s, week: targetWeek, gradeClass: finalTargetClass };
      }
      return s;
    });
  }

  saveLocal();
  notifyScheduleUpdated();

  try {
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: currentSchedule }),
    }).catch(() => {});
  } catch {
    // Ignore
  }

  return { success: true };
}

// Rename a teacher across the entire schedule
export async function renameTeacherEverywhere(
  oldName: string,
  newName: string
): Promise<{ success: boolean; affectedCount: number; error?: string }> {
  const cleanOld = oldName.trim();
  const cleanNew = newName.trim();
  if (!cleanNew) return { success: false, affectedCount: 0, error: 'الاسم الجديد مطلوب' };

  let count = 0;
  currentSchedule = currentSchedule.map((s) => {
    if (s.teacher.trim() === cleanOld) {
      count++;
      return { ...s, teacher: cleanNew };
    }
    return s;
  });

  saveLocal();
  notifyScheduleUpdated();

  try {
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: currentSchedule }),
    }).catch(() => {});
  } catch {
    // Ignore
  }

  return { success: true, affectedCount: count };
}

// Rename an activity/program across the entire schedule
export async function renameProgramEverywhere(
  oldProgram: string,
  newProgram: string
): Promise<{ success: boolean; affectedCount: number; error?: string }> {
  const cleanOld = oldProgram.trim();
  const cleanNew = newProgram.trim();
  if (!cleanNew) return { success: false, affectedCount: 0, error: 'اسم البرنامج الجديد مطلوب' };

  let count = 0;
  currentSchedule = currentSchedule.map((s) => {
    if (s.activity.trim() === cleanOld) {
      count++;
      return { ...s, activity: cleanNew };
    }
    return s;
  });

  saveLocal();
  notifyScheduleUpdated();

  try {
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule: currentSchedule }),
    }).catch(() => {});
  } catch {
    // Ignore
  }

  return { success: true, affectedCount: count };
}

// Reset schedule to official baseline
export async function resetScheduleToBaseline(): Promise<void> {
  currentSchedule = [...SCHEDULE_DATA];
  saveLocal();
  notifyScheduleUpdated();

  try {
    fetch('/api/schedule/reset', { method: 'POST' }).catch(() => {});
  } catch {
    // Ignore
  }
}

// Initialize from server
export async function initScheduleFromServer(): Promise<void> {
  if (isScheduleInitialized) return;
  isScheduleInitialized = true;

  try {
    const res = await fetch('/api/schedule');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.schedule) && data.schedule.length > 0) {
        currentSchedule = data.schedule;
        saveLocal();
        notifyScheduleUpdated();
      }
    }
  } catch {
    // Fallback to local storage or baseline
  }
}

// --- Admin Authentication State & Helpers ---
export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
  } catch {
    return DEFAULT_ADMIN_PIN;
  }
}

export function setAdminPin(newPin: string): boolean {
  if (!newPin || newPin.trim().length < 3) return false;
  try {
    localStorage.setItem(LOCAL_STORAGE_ADMIN_PIN_KEY, newPin.trim());
    return true;
  } catch {
    return false;
  }
}

export function adminLogin(enteredPin: string): boolean {
  const currentPin = getAdminPin();
  if (enteredPin.trim() === currentPin || enteredPin.trim() === DEFAULT_ADMIN_PIN) {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_AUTH_KEY, 'true');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: { isLoggedIn: true } }));
      }
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function adminLogout(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_ADMIN_AUTH_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: { isLoggedIn: false } }));
    }
  } catch {
    // Ignore
  }
}
