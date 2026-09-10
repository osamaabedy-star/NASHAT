import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminLogin, setAdminPin, getAdminPin } from '../services/scheduleService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = adminLogin(pin);
    if (success) {
      setPin('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError('رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 3) {
      setError('يجب أن يتكون الرمز الجديد من 3 أرقام على الأقل');
      return;
    }
    const ok = setAdminPin(newPin.trim());
    if (ok) {
      setPinSuccessMsg('تم تحديث رمز الإدارة بنجاح!');
      setIsChangingPin(false);
      setNewPin('');
      setTimeout(() => setPinSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">حساب إدارة النشاط الطلابي</h3>
              <p className="text-xs text-emerald-200/90 font-medium">
                الصلاحيات الإدارية لتعديل الجداول والبرامج والأسماء
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {pinSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pinSuccessMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isChangingPin ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رمز المرور الإداري (PIN):
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="أدخل رمز الإدارة..."
                    autoFocus
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-bold tracking-widest focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-center"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold mt-1.5 text-center">
                  رمز الدخول الافتراضي للإدارة: <span className="font-extrabold text-emerald-700">1448</span>
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تسجيل الدخول والتفعيل</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setIsChangingPin(true);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>تغيير رمز المرور الإداري</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الرمز السري الجديد للإدارة:
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="أدخل رمزاً جديداً..."
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm font-bold tracking-widest focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-center"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                >
                  حفظ الرمز الجديد
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setError(null);
                  }}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors"
                >
                  رجوع
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
