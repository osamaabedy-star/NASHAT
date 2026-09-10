import { useState, useEffect } from 'react';
import { ScheduleSession } from '../types';
import { getCurrentSchedule, initScheduleFromServer } from '../services/scheduleService';

export function useScheduleData(): ScheduleSession[] {
  const [schedule, setSchedule] = useState<ScheduleSession[]>(() => getCurrentSchedule());

  useEffect(() => {
    initScheduleFromServer();

    const handleUpdate = () => {
      setSchedule(getCurrentSchedule());
    };

    window.addEventListener('schedule-data-updated', handleUpdate);
    return () => {
      window.removeEventListener('schedule-data-updated', handleUpdate);
    };
  }, []);

  return schedule;
}
