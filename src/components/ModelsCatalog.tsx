import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Award, 
  ChevronRight, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { PhoneModel, PhoneListing } from '../types';
import { getGsmArenaUrl } from '../utils/gsmarena';
import { useLanguage } from '../context/LanguageContext';

interface ModelsCatalogProps {
  models: PhoneModel[];
  listings: PhoneListing[];
  onSelectModelFilter: (modelId: string) => void;
  onAddListingForModel: (modelId: string) => void;
}

export const ModelsCatalog: React.FC<ModelsCatalogProps> = ({
  models,
  listings,
  onSelectModelFilter,
  onAddListingForModel,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useLanguage();

  const brandList = Array.from(new Set(models.map((m) => m.brand))).sort();

  const filteredModels = models.filter((m) => {
    if (selectedBrand !== 'ALL' && m.brand !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.brand} ${m.modelName} ${m.chipset} ${m.overview}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Count active listings per model
  const listingCountMap = new Map<string, number>();
  listings.forEach((l) => {
    if (l.status === 'AVAILABLE') {
      listingCountMap.set(l.modelId, (listingCountMap.get(l.modelId) || 0) + 1);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF2E93] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span>{t('masterCatalog')}</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            {t('phoneModelsTitle')} ({models.length} {t('modelsCountLabel')})
          </h2>
          <p className="text-sm text-[#C3B2D9] mt-1 max-w-3xl">
            {t('modelsSub')}
          </p>
        </div>
      </div>

      {/* Brand Selector Buttons Grid (BIG OPTIONS) */}
      <div className="glass-panel p-5 rounded-2xl border border-[#FF2E93]/30 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wide">
            <Smartphone className="w-4 h-4 text-[#FF2E93]" />
            <span>{t('selectBrand')} ({brandList.length} {t('brandsLabel')})</span>
          </label>
          {selectedBrand !== 'ALL' && (
            <button
              onClick={() => setSelectedBrand('ALL')}
              className="text-xs text-[#FF2E93] hover:underline font-bold cursor-pointer"
            >
              {t('showAllBrands')}
            </button>
          )}
        </div>

        {/* Big Brand Buttons */}
        <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-200 border cursor-pointer ${
              selectedBrand === 'ALL'
                ? 'bg-[#FF2E93] text-white border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)] scale-105'
                : 'bg-white/5 text-[#C3B2D9] border-white/10 hover:border-white/30 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('allBrands')} ({models.length})
          </button>

          {brandList.map((brand) => {
            const count = models.filter((m) => m.brand === brand).length;
            const isSelected = selectedBrand === brand;

            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF2E93] text-white border-[#FF2E93] shadow-[0_0_15px_rgba(255,46,147,0.5)] scale-105'
                    : 'bg-[#160B24] text-white border-white/15 hover:border-[#FF2E93]/50 hover:bg-[#FF2E93]/10'
                }`}
              >
                <span>{brand}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-[#C3B2D9]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        <div className="sm:col-span-8 relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C3B2D9]" />
          <input
            type="text"
            placeholder={t('searchModelsPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#160B24] text-white text-base rounded-xl pl-11 pr-4 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none placeholder-[#C3B2D9]/50"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-[#160B24] text-white text-base font-semibold rounded-xl px-4 py-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t('allBrands')} ({models.length} {t('modelsCountLabel')})</option>
            {brandList.map((b) => (
              <option key={b} value={b}>
                {b} ({models.filter((m) => m.brand === b).length})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModels.map((model) => {
          const stockCount = listingCountMap.get(model.id) || 0;

          return (
            <div
              key={model.id}
              className="glass-panel p-6 rounded-2xl border border-[#FF2E93]/20 glass-panel-hover flex flex-col justify-between space-y-5"
              id={`model-card-${model.id}`}
            >
              
              {/* Card Header: Brand, Model Name, Release Year, Stock pill */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {model.imageUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#160B24] border border-white/10 shrink-0">
                      <img src={model.imageUrl} alt={model.modelName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-[#FF2E93] uppercase tracking-wider">
                      {model.brand} • {model.releaseYear}
                    </span>
                    <h3 className="text-xl font-black text-white">
                      {model.modelName}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.colorVariants.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#C3B2D9] border border-white/10">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    stockCount > 0 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-white/5 text-[#C3B2D9] border-white/10'
                  }`}>
                    {stockCount > 0 ? `🟢 ${stockCount} ${t('inStock')}` : t('outOfStock')}
                  </span>
                </div>
              </div>

              {/* Admin Overview & Recommendation */}
              <div className="bg-[#160B24]/90 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-[#00F0FF] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{t('adminBuyingGuide')}</span>
                </div>
                <p className="text-xs text-[#C3B2D9] leading-relaxed line-clamp-3">
                  {model.overview}
                </p>
                <div className="text-[11px] text-white font-semibold pt-1 border-t border-white/5">
                  {t('recommendedFor')}: <span className="text-[#FF2E93] font-bold">{model.recommendedFor}</span>
                </div>
              </div>

              {/* Specs Summary Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-[#C3B2D9]">{t('storage')}</div>
                  <div className="font-bold text-white truncate">{model.storageOptions.join(', ')}</div>
                </div>

                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-[#C3B2D9]">{t('chipset')}</div>
                  <div className="font-bold text-white truncate">{model.chipset}</div>
                </div>

                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-[#C3B2D9]">{t('display')}</div>
                  <div className="font-bold text-white truncate">{model.displaySpecs}</div>
                </div>

                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className="text-[10px] text-[#C3B2D9]">{t('cameras')}</div>
                  <div className="font-bold text-white truncate">{model.cameraSpecs}</div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onSelectModelFilter(model.id)}
                  className="flex-1 bg-[#FF2E93]/20 hover:bg-[#FF2E93] text-white py-2.5 px-4 rounded-xl text-xs font-bold border border-[#FF2E93]/40 hover:border-[#FF2E93] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t('browseAvailableUnits')} ({stockCount})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={getGsmArenaUrl(model.brand, model.modelName, model.gsmarena_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black text-xs font-bold border border-[#00F0FF]/40 hover:border-[#00F0FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title={t('gsmarenaBtn')}
                >
                  <span>📱 {t('gsmarenaBtn')}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <button
                  onClick={() => onAddListingForModel(model.id)}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{t('listUnitBtn')}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
