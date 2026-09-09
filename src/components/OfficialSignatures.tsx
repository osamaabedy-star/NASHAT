import React from 'react';
import { SCHOOL_INFO } from '../data/scheduleData';

interface OfficialSignaturesProps {
  className?: string;
}

export const OfficialSignatures: React.FC<OfficialSignaturesProps> = ({ className = '' }) => {
  return (
    <div className={`mt-8 pt-6 border-t-2 border-slate-300 ${className}`}>
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Activity Leader Signature */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 mb-1">رائد النشاط الطلابي</span>
          <span className="text-sm font-black text-slate-900">{SCHOOL_INFO.activityLeader}</span>
          <div className="mt-6 text-xs text-slate-400 font-medium">التوقيع: ............................</div>
        </div>

        {/* School Stamp Seal Placeholder */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 text-center leading-tight p-1 select-none">
            ختم المدرسة الرسمي
          </div>
        </div>

        {/* School Principal Signature */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 mb-1">مدير المدرسة</span>
          <span className="text-sm font-black text-slate-900">{SCHOOL_INFO.principal}</span>
          <div className="mt-6 text-xs text-slate-400 font-medium">التوقيع: ............................</div>
        </div>
      </div>
    </div>
  );
};
