import React from 'react';
import { X, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { PhoneListing, PhoneModel, ListingStatus, Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SellerManagementModalProps {
  listings: PhoneListing[];
  models: PhoneModel[];
  currency: Currency;
  onUpdateStatus: (listingId: string, status: ListingStatus) => void;
  onDeleteListing: (listingId: string) => void;
  onResetSeedData: () => void;
  onClose: () => void;
}

export const SellerManagementModal: React.FC<SellerManagementModalProps> = ({
  listings,
  models,
  currency,
  onUpdateStatus,
  onDeleteListing,
  onResetSeedData,
  onClose,
}) => {
  const { t, formatPrice } = useLanguage();
  const modelMap = new Map<string, PhoneModel>();
  models.forEach((m) => modelMap.set(m.id, m));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-[#00F0FF]/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0D0714]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-xl font-black text-white">
              {t('sellerDashboard')}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetSeedData}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#FF2E93] border border-[#FF2E93]/40 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset inventory & models to initial seed state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('resetDemoData')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-[#C3B2D9]">
            {t('sellerDashDesc')}
          </p>

          <div className="space-y-3">
            {listings.map((item) => {
              const model = modelMap.get(item.modelId);

              return (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photos[0] || model?.imageUrl}
                      alt={model?.modelName}
                      className="w-14 h-14 rounded-xl object-cover bg-[#160B24] border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-[10px] font-bold text-[#FF2E93] uppercase">
                        {model?.brand} • {item.storage} ({item.color})
                      </div>
                      <h4 className="font-extrabold text-white text-sm">
                        {model?.modelName || item.title}
                      </h4>
                      <div className="text-xs font-bold text-[#00F0FF]">
                        {formatPrice(item.priceUSD, currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5 bg-[#160B24] p-1.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-[#C3B2D9] font-bold uppercase pl-1">{t('status')}:</span>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as ListingStatus)}
                        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                      >
                        <option value="AVAILABLE" className="bg-[#160B24] text-emerald-400">🟢 {t('available')}</option>
                        <option value="RESERVED" className="bg-[#160B24] text-amber-300">🟡 {t('reserved')}</option>
                        <option value="SOLD" className="bg-[#160B24] text-red-400">🔴 {t('sold')}</option>
                      </select>
                    </div>

                    <button
                      onClick={() => onDeleteListing(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all text-xs border border-red-500/30 cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
