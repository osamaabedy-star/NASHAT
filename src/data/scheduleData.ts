import { ScheduleSession } from '../types';

export const SCHOOL_INFO = {
  name: 'مدارس رياض الإبداع الأهلية',
  shortName: 'ابتدائية رياض الإبداع',
  stage: 'المرحلة الابتدائية',
  term: 'الفصل الدراسي الأول',
  year: 'العام الدراسي 1448هـ',
  title: 'جدول حصص النشاط الطلابي',
  activityLeader: 'الأستاذ / ناصر رمضان',
  principal: 'الأستاذ / صالح بن متعب الحمادي',
  ministry: 'المملكة العربية السعودية',
  ministryOfEdu: 'وزارة التعليم',
  directorate: 'الإدارة العامة للتعليم بمنطقة الرياض',
};

export const CLASSES_LIST: string[] = [
  'أول / أ',
  'أول / ب',
  'ثاني / أ',
  'ثاني / ب',
  'ثالث / أ',
  'ثالث / ب',
  'ثالث / ج',
  'رابع / أ',
  'رابع / ب',
  'خامس / أ',
  'خامس / ب',
  'سادس / أ',
];

export const WEEKS_LIST: number[] = [2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export const SCHEDULE_DATA: ScheduleSession[] = [
  // --- الأسبوع 2 ---
  { week: 2, gradeClass: 'أول / أ', activity: 'ريادة', teacher: 'سيد حمدي' },
  { week: 2, gradeClass: 'أول / ب', activity: 'ريادة', teacher: 'سعد بني خلف' },
  { week: 2, gradeClass: 'ثاني / أ', activity: 'ريادة', teacher: 'محمد عبدالتواب' },
  { week: 2, gradeClass: 'ثاني / ب', activity: 'ريادة', teacher: 'وليد عمر' },
  { week: 2, gradeClass: 'ثالث / أ', activity: 'ريادة', teacher: 'عمر دلوع' },
  { week: 2, gradeClass: 'ثالث / ب', activity: 'ريادة', teacher: 'هشام الشوني' },
  { week: 2, gradeClass: 'ثالث / ج', activity: 'ريادة', teacher: 'محمود عبدالتواب' },
  { week: 2, gradeClass: 'رابع / أ', activity: 'ريادة', teacher: 'حسن علي' },
  { week: 2, gradeClass: 'رابع / ب', activity: 'ريادة', teacher: 'محمود جمال' },
  { week: 2, gradeClass: 'خامس / أ', activity: 'ريادة', teacher: 'أحمد طه' },
  { week: 2, gradeClass: 'خامس / ب', activity: 'ريادة', teacher: 'أحمد خليفة' },
  { week: 2, gradeClass: 'سادس / أ', activity: 'ريادة', teacher: 'محمود عباس' },

  // --- الأسبوع 3 ---
  { week: 3, gradeClass: 'أول / أ', activity: 'رياضات إلكترونية', teacher: 'سيد حمدي' },
  { week: 3, gradeClass: 'أول / ب', activity: 'تحدي الإملاء', teacher: 'سعد بني خلف' },
  { week: 3, gradeClass: 'ثاني / أ', activity: 'برنامج نافس', teacher: 'محمد عبدالتواب' },
  { week: 3, gradeClass: 'ثاني / ب', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 3, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 3, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'هشام الشوني' },
  { week: 3, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 3, gradeClass: 'رابع / أ', activity: 'الذكاء الاصطناعي', teacher: 'محمود عباس' },
  { week: 3, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 3, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'أحمد خليفة' },
  { week: 3, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'أحمد طه' },
  { week: 3, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'عادل' },

  // --- الأسبوع 4 ---
  { week: 4, gradeClass: 'أول / أ', activity: 'تحدي الإملاء', teacher: 'سيد حمدي' },
  { week: 4, gradeClass: 'أول / ب', activity: 'رياضات إلكترونية', teacher: 'سعد بني خلف' },
  { week: 4, gradeClass: 'ثاني / أ', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 4, gradeClass: 'ثاني / ب', activity: 'برنامج نافس', teacher: 'محمد عبدالتواب' },
  { week: 4, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'هشام الشوني' },
  { week: 4, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 4, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 4, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 4, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'محمود جمال' },
  { week: 4, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'أحمد طه' },
  { week: 4, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'عادل' },
  { week: 4, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'محمود يوسف' },

  // --- الأسبوع 6 ---
  { week: 6, gradeClass: 'أول / أ', activity: 'اليوم الوطني', teacher: 'سيد حمدي' },
  { week: 6, gradeClass: 'أول / ب', activity: 'اليوم الوطني', teacher: 'سعد بني خلف' },
  { week: 6, gradeClass: 'ثاني / أ', activity: 'اليوم الوطني', teacher: 'محمد عبدالتواب' },
  { week: 6, gradeClass: 'ثاني / ب', activity: 'اليوم الوطني', teacher: 'وليد عمر' },
  { week: 6, gradeClass: 'ثالث / أ', activity: 'اليوم الوطني', teacher: 'عمر دلوع' },
  { week: 6, gradeClass: 'ثالث / ب', activity: 'اليوم الوطني', teacher: 'هشام الشوني' },
  { week: 6, gradeClass: 'ثالث / ج', activity: 'اليوم الوطني', teacher: 'محمود عبدالتواب' },
  { week: 6, gradeClass: 'رابع / أ', activity: 'اليوم الوطني', teacher: 'حسن علي' },
  { week: 6, gradeClass: 'رابع / ب', activity: 'اليوم الوطني', teacher: 'محمود جمال' },
  { week: 6, gradeClass: 'خامس / أ', activity: 'اليوم الوطني', teacher: 'أحمد طه' },
  { week: 6, gradeClass: 'خامس / ب', activity: 'اليوم الوطني', teacher: 'أحمد خليفة' },
  { week: 6, gradeClass: 'سادس / أ', activity: 'اليوم الوطني', teacher: 'محمود عباس' },

  // --- الأسبوع 7 ---
  { week: 7, gradeClass: 'أول / أ', activity: 'تحدي الإملاء', teacher: 'سيد حمدي' },
  { week: 7, gradeClass: 'أول / ب', activity: 'تحدي الإملاء', teacher: 'سعد بني خلف' },
  { week: 7, gradeClass: 'ثاني / أ', activity: 'رياضات إلكترونية', teacher: 'محمد الجبر' },
  { week: 7, gradeClass: 'ثاني / ب', activity: 'التطوع الطلابي', teacher: 'وليد عمر' },
  { week: 7, gradeClass: 'ثالث / أ', activity: 'رياضات إلكترونية', teacher: 'عمر دلوع' },
  { week: 7, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 7, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'هشام الشوني' },
  { week: 7, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'محمود جمال' },
  { week: 7, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 7, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'عادل' },
  { week: 7, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'أحمد خليفة' },
  { week: 7, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'محمود يوسف' },

  // --- الأسبوع 8 ---
  { week: 8, gradeClass: 'أول / أ', activity: 'فنون مسرحية', teacher: 'سيد حمدي' },
  { week: 8, gradeClass: 'أول / ب', activity: 'فنون مسرحية', teacher: 'سعد بني خلف' },
  { week: 8, gradeClass: 'ثاني / أ', activity: 'فنون مسرحية', teacher: 'محمد عبدالتواب' },
  { week: 8, gradeClass: 'ثاني / ب', activity: 'فنون مسرحية', teacher: 'وليد عمر' },
  { week: 8, gradeClass: 'ثالث / أ', activity: 'فنون مسرحية', teacher: 'عمر دلوع' },
  { week: 8, gradeClass: 'ثالث / ب', activity: 'فنون مسرحية', teacher: 'هشام الشوني' },
  { week: 8, gradeClass: 'ثالث / ج', activity: 'فنون مسرحية', teacher: 'محمود عبدالتواب' },
  { week: 8, gradeClass: 'رابع / أ', activity: 'فنون مسرحية', teacher: 'حسن علي' },
  { week: 8, gradeClass: 'رابع / ب', activity: 'فنون مسرحية', teacher: 'محمود جمال' },
  { week: 8, gradeClass: 'خامس / أ', activity: 'فنون مسرحية', teacher: 'أحمد طه' },
  { week: 8, gradeClass: 'خامس / ب', activity: 'فنون مسرحية', teacher: 'أحمد خليفة' },
  { week: 8, gradeClass: 'سادس / أ', activity: 'فنون مسرحية', teacher: 'محمود عباس' },

  // --- الأسبوع 9 ---
  { week: 9, gradeClass: 'أول / أ', activity: 'فنون مسرحية', teacher: 'سيد حمدي' },
  { week: 9, gradeClass: 'أول / ب', activity: 'فنون مسرحية', teacher: 'سعد بني خلف' },
  { week: 9, gradeClass: 'ثاني / أ', activity: 'فنون مسرحية', teacher: 'محمد عبدالتواب' },
  { week: 9, gradeClass: 'ثاني / ب', activity: 'فنون مسرحية', teacher: 'وليد عمر' },
  { week: 9, gradeClass: 'ثالث / أ', activity: 'فنون مسرحية', teacher: 'عمر دلوع' },
  { week: 9, gradeClass: 'ثالث / ب', activity: 'فنون مسرحية', teacher: 'هشام الشوني' },
  { week: 9, gradeClass: 'ثالث / ج', activity: 'فنون مسرحية', teacher: 'محمود عبدالتواب' },
  { week: 9, gradeClass: 'رابع / أ', activity: 'فنون مسرحية', teacher: 'حسن علي' },
  { week: 9, gradeClass: 'رابع / ب', activity: 'فنون مسرحية', teacher: 'محمود جمال' },
  { week: 9, gradeClass: 'خامس / أ', activity: 'فنون مسرحية', teacher: 'أحمد طه' },
  { week: 9, gradeClass: 'خامس / ب', activity: 'فنون مسرحية', teacher: 'أحمد خليفة' },
  { week: 9, gradeClass: 'سادس / أ', activity: 'فنون مسرحية', teacher: 'محمود عباس' },

  // --- الأسبوع 10 ---
  { week: 10, gradeClass: 'أول / أ', activity: 'فنون مسرحية', teacher: 'سيد حمدي' },
  { week: 10, gradeClass: 'أول / ب', activity: 'فنون مسرحية', teacher: 'سعد بني خلف' },
  { week: 10, gradeClass: 'ثاني / أ', activity: 'فنون مسرحية', teacher: 'محمد عبدالتواب' },
  { week: 10, gradeClass: 'ثاني / ب', activity: 'فنون مسرحية', teacher: 'وليد عمر' },
  { week: 10, gradeClass: 'ثالث / أ', activity: 'فنون مسرحية', teacher: 'عمر دلوع' },
  { week: 10, gradeClass: 'ثالث / ب', activity: 'فنون مسرحية', teacher: 'هشام الشوني' },
  { week: 10, gradeClass: 'ثالث / ج', activity: 'فنون مسرحية', teacher: 'محمود عبدالتواب' },
  { week: 10, gradeClass: 'رابع / أ', activity: 'فنون مسرحية', teacher: 'حسن علي' },
  { week: 10, gradeClass: 'رابع / ب', activity: 'فنون مسرحية', teacher: 'محمود جمال' },
  { week: 10, gradeClass: 'خامس / أ', activity: 'فنون مسرحية', teacher: 'أحمد طه' },
  { week: 10, gradeClass: 'خامس / ب', activity: 'فنون مسرحية', teacher: 'أحمد خليفة' },
  { week: 10, gradeClass: 'سادس / أ', activity: 'فنون مسرحية', teacher: 'محمود عباس' },

  // --- الأسبوع 11 ---
  { week: 11, gradeClass: 'أول / أ', activity: 'شغل مخك', teacher: 'أسامة إبراهيم' },
  { week: 11, gradeClass: 'أول / ب', activity: 'تحدي الإملاء', teacher: 'سعد بني خلف' },
  { week: 11, gradeClass: 'ثاني / أ', activity: 'رياضات إلكترونية', teacher: 'محمد عبدالتواب' },
  { week: 11, gradeClass: 'ثاني / ب', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 11, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 11, gradeClass: 'ثالث / ب', activity: 'رياضات إلكترونية', teacher: 'هشام الشوني' },
  { week: 11, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 11, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 11, gradeClass: 'رابع / ب', activity: 'الذكاء الاصطناعي', teacher: 'محمود جمال' },
  { week: 11, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'أحمد خليفة' },
  { week: 11, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'أحمد طه' },
  { week: 11, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'محمود عباس' },

  // --- الأسبوع 12 ---
  { week: 12, gradeClass: 'أول / أ', activity: 'تحدي الإملاء', teacher: 'سيد حمدي' },
  { week: 12, gradeClass: 'أول / ب', activity: 'شغل مخك', teacher: 'أسامة إبراهيم' },
  { week: 12, gradeClass: 'ثاني / أ', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 12, gradeClass: 'ثاني / ب', activity: 'التطوع الطلابي', teacher: 'محمد الجبر' },
  { week: 12, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'هشام الشوني' },
  { week: 12, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 12, gradeClass: 'ثالث / ج', activity: 'رياضات إلكترونية', teacher: 'محمود عبدالتواب' },
  { week: 12, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 12, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'محمود جمال' },
  { week: 12, gradeClass: 'خامس / أ', activity: 'مدن المستقبل', teacher: 'أحمد طه' },
  { week: 12, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'عادل' },
  { week: 12, gradeClass: 'سادس / أ', activity: 'رياضات إلكترونية', teacher: 'محمود عباس' },

  // --- الأسبوع 13 ---
  { week: 13, gradeClass: 'أول / أ', activity: 'شغل مخك', teacher: 'أسامة إبراهيم' },
  { week: 13, gradeClass: 'أول / ب', activity: 'تحدي الإملاء', teacher: 'سعد بني خلف' },
  { week: 13, gradeClass: 'ثاني / أ', activity: 'التطوع الطلابي', teacher: 'محمد الجبر' },
  { week: 13, gradeClass: 'ثاني / ب', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 13, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 13, gradeClass: 'ثالث / ب', activity: 'تطبيقات STEAM', teacher: 'هشام الشوني' },
  { week: 13, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 13, gradeClass: 'رابع / أ', activity: 'رياضات إلكترونية', teacher: 'حسن علي' },
  { week: 13, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'محمود جمال' },
  { week: 13, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'أحمد طه' },
  { week: 13, gradeClass: 'خامس / ب', activity: 'برنامج نافس', teacher: 'أحمد خليفة' },
  { week: 13, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'عادل' },

  // --- الأسبوع 14 ---
  { week: 14, gradeClass: 'أول / أ', activity: 'تحدي الإملاء', teacher: 'سيد حمدي' },
  { week: 14, gradeClass: 'أول / ب', activity: 'شغل مخك', teacher: 'أسامة إبراهيم' },
  { week: 14, gradeClass: 'ثاني / أ', activity: 'برنامج نافس', teacher: 'محمد عبدالتواب' },
  { week: 14, gradeClass: 'ثاني / ب', activity: 'التطوع الطلابي', teacher: 'محمد الجبر' },
  { week: 14, gradeClass: 'ثالث / أ', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 14, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 14, gradeClass: 'ثالث / ج', activity: 'تطبيقات STEAM', teacher: 'هشام الشوني' },
  { week: 14, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 14, gradeClass: 'رابع / ب', activity: 'رياضات إلكترونية', teacher: 'محمود جمال' },
  { week: 14, gradeClass: 'خامس / أ', activity: 'برنامج نافس', teacher: 'عادل' },
  { week: 14, gradeClass: 'خامس / ب', activity: 'مدن المستقبل', teacher: 'أحمد خليفة' },
  { week: 14, gradeClass: 'سادس / أ', activity: 'برنامج نافس', teacher: 'محمود يوسف' },

  // --- الأسبوع 15 ---
  { week: 15, gradeClass: 'أول / أ', activity: 'تحدي الإملاء', teacher: 'سيد حمدي' },
  { week: 15, gradeClass: 'أول / ب', activity: 'تحدي الإملاء', teacher: 'سعد بني خلف' },
  { week: 15, gradeClass: 'ثاني / أ', activity: 'برنامج نافس', teacher: 'وليد عمر' },
  { week: 15, gradeClass: 'ثاني / ب', activity: 'برنامج نافس', teacher: 'محمد عبدالتواب' },
  { week: 15, gradeClass: 'ثالث / أ', activity: 'تطبيقات STEAM', teacher: 'هشام الشوني' },
  { week: 15, gradeClass: 'ثالث / ب', activity: 'برنامج نافس', teacher: 'عمر دلوع' },
  { week: 15, gradeClass: 'ثالث / ج', activity: 'برنامج نافس', teacher: 'محمود عبدالتواب' },
  { week: 15, gradeClass: 'رابع / أ', activity: 'برنامج نافس', teacher: 'حسن علي' },
  { week: 15, gradeClass: 'رابع / ب', activity: 'برنامج نافس', teacher: 'محمود جمال' },
  { week: 15, gradeClass: 'خامس / أ', activity: 'رياضات إلكترونية', teacher: 'أحمد طه' },
  { week: 15, gradeClass: 'خامس / ب', activity: 'رياضات إلكترونية', teacher: 'أحمد خليفة' },
  { week: 15, gradeClass: 'سادس / أ', activity: 'رواد الفضاء', teacher: 'محمود عباس' },
];

// Extract distinct teachers
export const ALL_TEACHERS: string[] = Array.from(
  new Set(SCHEDULE_DATA.map((s) => s.teacher))
).sort((a, b) => a.localeCompare(b, 'ar'));

// Helper to get sessions by teacher
export function getTeacherSessions(teacherName: string): ScheduleSession[] {
  return SCHEDULE_DATA.filter((s) => s.teacher === teacherName).sort(
    (a, b) => a.week - b.week
  );
}

// Helper to get sessions by week
export function getWeekSessions(weekNumber: number): ScheduleSession[] {
  return SCHEDULE_DATA.filter((s) => s.week === weekNumber);
}

// Helper to get sessions by class
export function getClassSessions(className: string): ScheduleSession[] {
  return SCHEDULE_DATA.filter((s) => s.gradeClass === className).sort(
    (a, b) => a.week - b.week
  );
}

// Activity category color styling helper
export function getActivityBadgeColor(activity: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (activity.includes('نافس')) {
    return {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      badge: 'برنامج نافس',
    };
  }
  if (
    activity.includes('إلكترونية') ||
    activity.includes('STEAM') ||
    activity.includes('الذكاء الاصطناعي') ||
    activity.includes('المستقبل') ||
    activity.includes('رواد الفضاء')
  ) {
    return {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      text: 'text-blue-700',
      border: 'border-blue-300',
      badge: 'تقنية وابتكار',
    };
  }
  if (activity.includes('إملاء') || activity.includes('مخك')) {
    return {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-700',
      border: 'border-amber-300',
      badge: 'مهارات وتفكير',
    };
  }
  if (activity.includes('مسرحية') || activity.includes('الوطني')) {
    return {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      text: 'text-purple-700',
      border: 'border-purple-300',
      badge: 'فنون ومناسبات',
    };
  }
  if (activity.includes('تطوع') || activity.includes('ريادة')) {
    return {
      bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      text: 'text-cyan-700',
      border: 'border-cyan-300',
      badge: 'ريادة وقيم',
    };
  }
  return {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    text: 'text-slate-700',
    border: 'border-slate-300',
    badge: 'نشاط طلابي',
  };
}
