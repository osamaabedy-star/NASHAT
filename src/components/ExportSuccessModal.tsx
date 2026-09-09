import React, { useState, useEffect } from 'react';
import { Download, Share2, X, CheckCircle2, Eye, Sparkles } from 'lucide-react';

interface ExportEventDetail {
  dataUrl: string;
  fileName: string;
  isMobile: boolean;
  shared: boolean;
}

export const ExportSuccessModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportData, setExportData] = useState<ExportEventDetail | null>(null);

  useEffect(() => {
    const handleExportCompleted = (e: Event) => {
      const customEvent = e as CustomEvent<ExportEventDetail>;
      if (customEvent.detail && customEvent.detail.dataUrl) {
        setExportData(customEvent.detail);
        // On mobile, show modal so user can tap & hold to save to Photos or share
        // On desktop, user gets a quick toast/modal option
        setIsOpen(true);
      }
    };

    window.addEventListener('export-completed', handleExportCompleted);
    return () => window.removeEventListener('export-completed', handleExportCompleted);
  }, []);

  if (!isOpen || !exportData) return null;

  const handleManualDownload = () => {
    const link = document.createElement('a');
    link.download = exportData.fileName;
    link.href = exportData.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      const res = await fetch(exportData.dataUrl);
      const blob = await res.blob();
      const file = new File([blob], exportData.fileName, { type: blob.type || 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: exportData.fileName.replace(/_/g, ' '),
        });
      } else {
        handleManualDownload();
      }
    } catch (err) {
      console.log('Share error:', err);
      handleManualDownload();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      dir="rtl"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-300 relative text-right flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>تم تجهيز الصورة الرسمية بالكامل</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500">
                الصورة جاهزة بجميع البيانات والأعمدة والترويسة المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Container */}
        <div className="my-4 flex-1 overflow-auto bg-slate-100 rounded-xl p-2 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[220px]">
          <img
            src={exportData.dataUrl}
            alt={exportData.fileName}
            className="max-w-full h-auto max-h-[50vh] object-contain rounded shadow-xs bg-white border border-slate-300"
          />
          <div className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة للوثيقة الكاملة بدقة عالية (تحتوي جميع الأعمدة والبيانات)</span>
          </div>
        </div>

        {/* Mobile Instruction Tip */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 mb-4 text-xs font-semibold text-amber-900">
          💡 <span className="font-bold">مستخدمي الجوال:</span> يمكنك أيضاً الضغط مطولاً بأصبعك على الصورة أعلاه واختيار <b className="text-amber-950">"حفظ في الصور" (Save to Photos)</b> لحفظها فوراً في ألبوم الكاميرا بجودتها الفائقة.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          {navigator.canShare && (
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة (واتساب / ألبوم الصور)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleManualDownload}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>تحميل الصورة على جهازك</span>
          </button>
        </div>
      </div>
    </div>
  );
};
