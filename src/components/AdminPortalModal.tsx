import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { saveAdminSession } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@Mixmobile777') {
      saveAdminSession(true);
      setErrorMsg('');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg(t('accessDeniedError'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.35)] bg-[#0D0714]/95 p-6 sm:p-8 overflow-hidden">
        
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#FF2E93]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#00F0FF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#160B24] border border-[#FF2E93]/50 mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(255,46,147,0.4)]">
            <Lock className="w-8 h-8 text-[#FF2E93]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            MIX <span className="neon-text-pink">MOBILE</span> {t('adminPortalTitle')}
          </h2>
          <p className="text-xs text-[#C3B2D9] mt-1.5 leading-relaxed">
            {t('adminPortalDesc')}
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C3B2D9] mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{t('securityAccessKey')}</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={t('enterAdminKeyPlaceholder')}
                autoFocus
                className="w-full bg-[#160B24] text-white text-sm font-semibold rounded-2xl py-3.5 pl-4 pr-12 border border-white/15 focus:border-[#FF2E93] focus:outline-none focus:ring-1 focus:ring-[#FF2E93] transition-all placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C3B2D9] hover:text-white transition-colors cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full neon-btn-pink py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,46,147,0.5)] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('verifyUnlockBtn')}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#C3B2D9]/70">
            {t('protectedSystemFooter')}
          </p>
        </div>

      </div>
    </div>
  );
};
