import React, { useState, useEffect } from 'react';
import { ScheduleSession } from '../types';
import { getScoreForSession, saveScore, getGradeLabel } from '../services/evaluationService';
import { Check, X, Plus, RotateCcw } from 'lucide-react';

interface ScoreBadgeProps {
  session: ScheduleSession;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  onScoreUpdated?: () => void;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  session,
  showLabel = true,
  size = 'md',
  onScoreUpdated,
}) => {
  const [score, setScore] = useState<number | null>(() => getScoreForSession(session));
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(score !== null ? String(score) : '');

  useEffect(() => {
    const handleUpdate = () => {
      const current = getScoreForSession(session);
      setScore(current);
      if (!isEditing) {
        setInputValue(current !== null ? String(current) : '');
      }
    };
    window.addEventListener('evaluations-updated', handleUpdate);
    return () => window.removeEventListener('evaluations-updated', handleUpdate);
  }, [session, isEditing]);

  const handleSave = async (valToSave?: string) => {
    const raw = (valToSave !== undefined ? valToSave : inputValue).trim();
    let newScore: number | null = null;
    if (raw !== '') {
      const num = Number(raw);
      if (!isNaN(num)) {
        newScore = Math.min(100, Math.max(0, Math.round(num)));
      }
    }
    await saveScore(session, newScore);
    setScore(newScore);
    setIsEditing(false);
    if (onScoreUpdated) onScoreUpdated();
  };

  const handleCancel = () => {
    setInputValue(score !== null ? String(score) : '');
    setIsEditing(false);
  };

  const handleClearScore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await saveScore(session, null);
    setScore(null);
    setInputValue('');
    setIsEditing(false);
    if (onScoreUpdated) onScoreUpdated();
  };

  if (isEditing) {
    return (
      <div
        className={`inline-flex items-center gap-1 bg-white rounded-lg border-2 border-emerald-500 shadow-sm z-20 ${
          size === 'sm' ? 'p-0.5' : 'p-1'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="number"
          min="0"
          max="100"
          value={inputValue}
          placeholder="0-100"
          onChange={(e) => setInputValue(e.target.value)}
          className={`${
            size === 'sm' ? 'w-12 text-xs px-1 py-0.5' : 'w-16 text-sm px-1 py-0.5'
          } text-center font-black text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500`}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        {size !== 'sm' && <span className="text-xs text-slate-400 font-bold">/100</span>}

        <button
          type="button"
          onClick={() => handleSave()}
          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer transition-colors"
          title="حفظ الدرجة"
        >
          <Check className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
        </button>

        {score !== null && (
          <button
            type="button"
            onClick={handleClearScore}
            className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer transition-colors"
            title="إفراغ الدرجة"
          >
            <RotateCcw className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
          </button>
        )}

        <button
          type="button"
          onClick={handleCancel}
          className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
          title="إلغاء"
        >
          <X className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
        </button>
      </div>
    );
  }

  // If score is empty (null)
  if (score === null) {
    return (
      <button
        type="button"
        onClick={() => {
          setInputValue('');
          setIsEditing(true);
        }}
        title="التقييم فارغ — انقر للرصد"
        className={`inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/60 text-slate-400 hover:text-emerald-700 transition-all cursor-pointer group font-bold ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <Plus className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} group-hover:scale-110 transition-transform text-slate-400 group-hover:text-emerald-600`} />
        <span>{size === 'sm' ? 'رصد' : 'رصد الدرجة'}</span>
      </button>
    );
  }

  // If score is set
  const grade = getGradeLabel(score);

  return (
    <div
      onClick={() => {
        setInputValue(String(score));
        setIsEditing(true);
      }}
      title="انقر لتعديل أو إفراغ الدرجة"
      className={`inline-flex items-center gap-1 cursor-pointer group transition-all rounded-md border hover:shadow-xs ${
        size === 'sm' ? 'px-1.5 py-0.5' : 'px-2.5 py-1'
      } ${grade.badgeClass}`}
    >
      <div className="flex items-baseline gap-0.5">
        <span
          className={`font-black tracking-tight ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          } ${grade.color}`}
        >
          {score}
        </span>
        <span className={`${size === 'sm' ? 'text-[8px]' : 'text-[10px]'} text-slate-400 font-medium`}>/100</span>
      </div>

      {showLabel && (
        <span className="text-[11px] font-extrabold text-slate-600">
          ({grade.label})
        </span>
      )}
    </div>
  );
};
