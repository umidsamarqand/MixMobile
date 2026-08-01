import React from 'react';
import { X, ShieldCheck, MapPin, Send, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactFAQModalProps {
  onClose: () => void;
}

export const ContactFAQModal: React.FC<ContactFAQModalProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.3)] my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0D0714]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FF2E93]" />
            <h3 className="text-xl font-black text-white">
              {t('faqModalTitle')}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
            id="close-faq-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* UZIMEI Guide Banner */}
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-400 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{t('uzimeiNoticeTitle')}</span>
            </h4>
            <p className="text-xs text-[#C3B2D9] leading-relaxed">
              {t('uzimeiNoticeText')}
            </p>
          </div>

          {/* FAQ Accordion Items */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF2E93]">
              {t('faqTitle')}
            </h4>

            <div className="bg-[#160B24] p-4 rounded-xl border border-white/5 space-y-1">
              <h5 className="text-xs font-bold text-white">{t('q1')}</h5>
              <p className="text-xs text-[#C3B2D9]">
                {t('a1')}
              </p>
            </div>

            <div className="bg-[#160B24] p-4 rounded-xl border border-white/5 space-y-1">
              <h5 className="text-xs font-bold text-white">{t('q2')}</h5>
              <p className="text-xs text-[#C3B2D9]">
                {t('a2')}
              </p>
            </div>

            <div className="bg-[#160B24] p-4 rounded-xl border border-white/5 space-y-1">
              <h5 className="text-xs font-bold text-white">{t('q3')}</h5>
              <p className="text-xs text-[#C3B2D9]">
                {t('a3')}
              </p>
            </div>
          </div>

          {/* Store Contact & Location */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#FF2E93] uppercase">{t('showroomTitle')}</div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#FF2E93]" />
                <span>{t('showroomAddress')}</span>
              </div>
              <div className="text-xs text-[#C3B2D9] mt-1">
                {t('directHotline')} <span className="text-white font-semibold">+998 (90) 123-45-67</span>
              </div>
            </div>

            <a
              href="https://t.me/mixmobile_tashkent"
              target="_blank"
              rel="noreferrer"
              className="neon-btn-pink px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Telegram @mixmobile_tashkent</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
