import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { PhoneListing, PhoneModel, Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ReserveRequestModalProps {
  listing: PhoneListing;
  model?: PhoneModel;
  currency: Currency;
  onClose: () => void;
}

export const ReserveRequestModal: React.FC<ReserveRequestModalProps> = ({
  listing,
  model,
  currency,
  onClose,
}) => {
  const { t, formatPrice } = useLanguage();
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('+9989');
  const [note, setNote] = useState('I would like to reserve this device and arrange live store inspection.');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.4)] my-auto">
        
        {/* Header */}
        <div className="bg-[#0D0714]/90 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF2E93]" />
            <h3 className="text-lg font-black text-white">
              {t('reserveModalTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-white">{t('reservationSent')}</h4>
            <p className="text-xs text-[#C3B2D9]">
              The seller <span className="text-white font-bold">{listing.sellerName}</span> has received your inquiry for <span className="text-[#FF2E93] font-bold">{model?.brand} {model?.modelName} ({listing.storage})</span>.
            </p>
            <div className="bg-[#160B24] p-3 rounded-xl border border-white/10 text-xs text-white">
              Direct seller contact: <span className="font-bold text-[#00F0FF]">{listing.sellerPhone}</span> (@{listing.sellerTelegram})
            </div>
            <button
              onClick={onClose}
              className="neon-btn-pink w-full py-3 rounded-xl font-bold text-xs cursor-pointer"
            >
              {t('backToMarketplace')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Listing Summary Box */}
            <div className="glass-panel p-3 rounded-xl border border-white/10 flex items-center gap-3">
              <img
                src={listing.photos[0] || model?.imageUrl}
                alt={model?.modelName}
                className="w-12 h-12 rounded-lg object-cover bg-[#160B24]"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-[10px] font-bold text-[#FF2E93] uppercase">
                  {model?.brand} • {listing.storage} ({listing.color})
                </div>
                <div className="text-sm font-bold text-white">{model?.modelName}</div>
                <div className="text-xs font-black text-[#00F0FF]">
                  {formatPrice(listing.priceUSD, currency)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('fullNameLabel')} *</label>
              <input
                type="text"
                placeholder="e.g. Alisher Karimov"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('phoneUzLabel')} *</label>
              <input
                type="text"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                required
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('noteToSeller')}</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
              />
            </div>

            <button
              type="submit"
              className="neon-btn-pink w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span>{t('confirmSendReservation')}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
