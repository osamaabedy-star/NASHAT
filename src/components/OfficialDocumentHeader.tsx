import React from 'react';
import { SCHOOL_INFO } from '../data/scheduleData';
import { SchoolLogo } from './SchoolLogo';

interface OfficialDocumentHeaderProps {
  title: string;
  subTitle?: string;
  metadata?: React.ReactNode;
  leftContent?: React.ReactNode;
  approvalDate?: string;
}

export const OfficialDocumentHeader: React.FC<OfficialDocumentHeaderProps> = ({
  title,
  subTitle = `${SCHOOL_INFO.term} — ${SCHOOL_INFO.year}`,
  metadata,
  leftContent,
  approvalDate,
}) => {
  return (
    <div className="pb-3 mb-3 border-b-2 border-slate-800">
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
        {/* Right: Ministerial Information */}
        <div className="text-right space-y-0.5 text-[10.5px] sm:text-xs text-slate-800 font-bold leading-tight">
          <div>{SCHOOL_INFO.ministry}</div>
          <div>{SCHOOL_INFO.ministryOfEdu}</div>
          <div>{SCHOOL_INFO.directorate}</div>
          <div className="text-emerald-900 font-extrabold">{SCHOOL_INFO.name}</div>
          <div className="text-slate-600 font-semibold">{SCHOOL_INFO.stage}</div>
        </div>

        {/* Center: Logo & Official Title */}
        <div className="flex flex-col items-center text-center">
          <SchoolLogo size="md" className="mb-1" />
          <h2 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <div className="text-[11px] sm:text-xs font-bold text-slate-600 mt-0.5">
            {subTitle}
          </div>
          {metadata && <div className="mt-1">{metadata}</div>}
        </div>

        {/* Left: Official Approval Date & Left Content / Summary */}
        <div className="flex flex-col items-end text-left text-[11px] sm:text-xs text-slate-700 font-semibold space-y-1">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-right shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold ml-1.5">تاريخ الاعتماد:</span>
            <span className="font-extrabold text-slate-900 text-xs" dir="rtl">
              {approvalDate ||
                new Date().toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </span>
          </div>
          {leftContent && (
            <div className="flex justify-end mt-0.5">
              {leftContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
