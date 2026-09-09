import React from 'react';
import { SCHOOL_INFO } from '../data/scheduleData';
import { SchoolLogo } from './SchoolLogo';

interface OfficialDocumentHeaderProps {
  title: string;
  subTitle?: string;
  metadata?: React.ReactNode;
}

export const OfficialDocumentHeader: React.FC<OfficialDocumentHeaderProps> = ({
  title,
  subTitle = `${SCHOOL_INFO.term} — ${SCHOOL_INFO.year}`,
  metadata,
}) => {
  return (
    <div className="pb-5 mb-5 border-b-2 border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        {/* Right: Ministerial Information */}
        <div className="text-right space-y-0.5 text-xs text-slate-800 font-bold">
          <div>{SCHOOL_INFO.ministry}</div>
          <div>{SCHOOL_INFO.ministryOfEdu}</div>
          <div>{SCHOOL_INFO.directorate}</div>
          <div className="text-emerald-900 font-extrabold">{SCHOOL_INFO.name}</div>
          <div className="text-slate-600 font-semibold">{SCHOOL_INFO.stage}</div>
        </div>

        {/* Center: Logo & Official Title */}
        <div className="flex flex-col items-center text-center">
          <SchoolLogo size="lg" className="mb-2" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
            {title}
          </h2>
          <div className="text-xs font-bold text-slate-600 mt-0.5">
            {subTitle}
          </div>
          {metadata && <div className="mt-2">{metadata}</div>}
        </div>

        {/* Left: Administrative Meta */}
        <div className="hidden sm:flex flex-col items-end text-left text-xs text-slate-700 font-bold space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">الرقم:</span>
            <span>....................</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">التاريخ:</span>
            <span>&rlm;1448 / &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; هـ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">المشفوعات:</span>
            <span>....................</span>
          </div>
        </div>
      </div>
    </div>
  );
};
