import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 p-0.5`}
      >
        <img
          src="/school_logo.png"
          alt="شعار مدارس رياض الإبداع"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to /school_logo.jpg
            const target = e.currentTarget;
            if (!target.src.endsWith('/school_logo.jpg')) {
              target.src = '/school_logo.jpg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold text-amber-700">مدارس</span>
          <span className="text-base font-black text-rose-950 tracking-tight leading-none">
            رياض الإبداع
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Riyadh Al Ebdaa Schools</span>
        </div>
      )}
    </div>
  );
};
