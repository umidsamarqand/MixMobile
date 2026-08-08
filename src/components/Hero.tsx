import React from 'react';
import { Search, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { FilterState, PhoneModel, Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../assets/images/mix_mobile_hero_1785309948618.jpg';

interface HeroProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  models: PhoneModel[];
  availableCount: number;
  registeredIMEICount: number;
  currency: Currency;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  filters,
  setFilters,
  models,
  availableCount,
  registeredIMEICount,
  currency,
  onExploreClick,
}) => {
  const { t } = useLanguage();
  const brands = Array.from(new Set(models.map((m) => m.brand)));

  return (
    <div className="relative overflow-hidden py-8 sm:py-12 mb-8">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF2E93]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#00F0FF]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#FF2E93]/40 text-xs font-bold uppercase tracking-widest text-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span>{t('heroPill')}</span>
          </div>
        </div>

        {/* Main Headline & Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-4">
              {t('heroTitle1')} <br className="hidden sm:inline" />
              <span className="neon-text-pink drop-shadow-[0_0_20px_rgba(255,46,147,0.6)]">
                {t('heroTitle2')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#C3B2D9] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed mb-6">
              {t('heroDesc')}
            </p>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="glass-panel p-3 rounded-xl text-center border-l-2 border-l-[#FF2E93]">
                <div className="text-xl sm:text-2xl font-black text-white">{availableCount}</div>
                <div className="text-[11px] font-semibold text-[#C3B2D9] uppercase tracking-wider">{t('activeUnits')}</div>
              </div>
              
              <div className="glass-panel p-3 rounded-xl text-center border-l-2 border-l-[#00F0FF]">
                <div className="text-xl sm:text-2xl font-black text-[#00F0FF] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{registeredIMEICount}</span>
                </div>
                <div className="text-[11px] font-semibold text-[#C3B2D9] uppercase tracking-wider">{t('uzimeiRegisteredCount')}</div>
              </div>

              <div className="glass-panel p-3 rounded-xl text-center border-l-2 border-l-purple-500">
                <div className="text-xl sm:text-2xl font-black text-white">{models.length}</div>
                <div className="text-[11px] font-semibold text-[#C3B2D9] uppercase tracking-wider">{t('baseModelsCount')}</div>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase Banner */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FF2E93] to-[#00F0FF] opacity-50 blur-xl group-hover:opacity-80 transition duration-500" />
              <div className="relative glass-panel rounded-2xl overflow-hidden border border-[#FF2E93]/40 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Mix Mobile Showcase"
                  className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#0D0714] via-[#0D0714]/80 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">{t('qualityInspected')}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FF2E93]/30 text-[#FF2E93] border border-[#FF2E93]/40">
                    {t('liveStock')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Instant Search Bar & Filter Panel */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-[#FF2E93]/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FF2E93] mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#00F0FF]" />
            <span>{t('instantFilter')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C3B2D9]" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-[#160B24] text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none focus:ring-1 focus:ring-[#FF2E93] placeholder-[#C3B2D9]/50 transition-all"
                id="hero-search-input"
              />
            </div>

            {/* Brand Filter Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="w-full bg-[#160B24] text-white text-sm rounded-xl px-3 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none transition-all cursor-pointer"
                id="hero-brand-select"
              >
                <option value="ALL">{t('allBrands')}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="lg:col-span-2">
              <select
                value={filters.condition}
                onChange={(e) => setFilters((prev) => ({ ...prev, condition: e.target.value }))}
                className="w-full bg-[#160B24] text-white text-sm rounded-xl px-3 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none transition-all cursor-pointer"
                id="hero-condition-select"
              >
                <option value="ALL">{t('allConditions')}</option>
                <option value="NEW">{t('condNew')}</option>
                <option value="LIKE_NEW">{t('condLikeNew')}</option>
                <option value="USED">{t('condUsed')}</option>
              </select>
            </div>

            {/* IMEI Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={filters.imeiStatus}
                onChange={(e) => setFilters((prev) => ({ ...prev, imeiStatus: e.target.value }))}
                className="w-full bg-[#160B24] text-white text-sm rounded-xl px-3 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none transition-all cursor-pointer"
                id="hero-imei-select"
              >
                <option value="ALL">{t('allImei')}</option>
                <option value="REGISTERED">{t('imeiYesOption')}</option>
                <option value="NOT_REGISTERED">{t('imeiNoOption')}</option>
              </select>
            </div>

            {/* Action Button */}
            <div className="lg:col-span-2">
              <button
                onClick={onExploreClick}
                className="w-full neon-btn-pink py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                id="hero-explore-btn"
              >
                <span>{t('viewListingsBtn')}</span>
              </button>
            </div>

          </div>

          {/* Quick Filter Tags Row */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[#C3B2D9] font-bold mr-1">{t('filterByBrand')}</span>
            
            {[
              { id: 'Apple', label: '🍎 Apple' },
              { id: 'Samsung', label: '📱 Samsung' },
              { id: 'Xiaomi', label: '⚡ Xiaomi' },
              { id: 'Redmi', label: '🔴 Redmi' },
              { id: 'OnePlus', label: '🚀 OnePlus' },
              { id: 'Google', label: '🔍 Google' },
              { id: 'OPPO', label: '💎 OPPO' },
              { id: 'vivo', label: '✨ vivo' },
              { id: 'Honor', label: '🎖️ Honor' },
              { id: 'Huawei', label: '🌐 Huawei' },
              { id: 'Realme', label: '🟡 Realme' },
              { id: 'POCO', label: '🔥 POCO' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setFilters((prev) => ({ ...prev, brand: b.id, searchQuery: '' }))}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  filters.brand === b.id
                    ? 'bg-[#FF2E93] border-[#FF2E93] text-white shadow-[0_0_12px_rgba(255,46,147,0.5)]'
                    : 'bg-[#160B24] border-white/15 text-[#C3B2D9] hover:text-white hover:border-white/30'
                }`}
              >
                {b.label}
              </button>
            ))}

            <button
              onClick={() => setFilters((prev) => ({ ...prev, imeiStatus: 'REGISTERED' }))}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                filters.imeiStatus === 'REGISTERED'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-[#C3B2D9] hover:text-white'
              }`}
            >
              {t('filterByImei')}
            </button>

            {(filters.searchQuery || filters.brand !== 'ALL' || filters.condition !== 'ALL' || filters.imeiStatus !== 'ALL') && (
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    brand: 'ALL',
                    modelId: 'ALL',
                    condition: 'ALL',
                    imeiStatus: 'ALL',
                    minPrice: 0,
                    maxPrice: 3000,
                    minBatteryHealth: 0,
                    storage: 'ALL',
                    sortBy: 'NEWEST',
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-all ml-auto cursor-pointer"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
