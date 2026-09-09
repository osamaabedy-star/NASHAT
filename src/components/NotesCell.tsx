import React, { useState, useEffect } from 'react';
import { ScheduleSession } from '../types';
import { getNotesForSession, saveNotes } from '../services/evaluationService';
import { Check, Edit3 } from 'lucide-react';

interface NotesCellProps {
  session: ScheduleSession;
  className?: string;
}

export const NotesCell: React.FC<NotesCellProps> = ({ session, className = '' }) => {
  const [notes, setNotes] = useState<string>(() => getNotesForSession(session));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setNotes(getNotesForSession(session));
    };
    window.addEventListener('evaluations-updated', handleUpdate);
    return () => window.removeEventListener('evaluations-updated', handleUpdate);
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  const handleBlur = async () => {
    await saveNotes(session, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`relative flex items-center w-full min-w-[170px] ${className}`}>
      <input
        type="text"
        value={notes}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="أدخل ملاحظات..."
        className="w-full text-xs font-medium text-slate-800 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-md py-1 px-2 pr-7 transition-all focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-400"
      />
      <div className="absolute right-2 text-slate-400 pointer-events-none">
        {isSaved ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        ) : (
          <Edit3 className="w-3.5 h-3.5 opacity-50" />
        )}
      </div>
    </div>
  );
};
