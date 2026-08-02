import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  BatteryCharging, 
  CheckCircle, 
  MapPin, 
  Eye, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Grid, 
  List, 
  Package, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PhoneListing, PhoneModel, FilterState, Currency } from '../types';
import { getGsmArenaUrl } from '../utils/gsmarena';
import { useLanguage } from '../context/LanguageContext';
import { translateColor, translateDefect } from '../utils/translationsHelper';

interface ListingsCatalogProps {
  listings: PhoneListing[];
  models: PhoneModel[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  currency: Currency;
  onSelectListing: (listing: PhoneListing) => void;
  onOpenAddListing: () => void;
}

export const ListingsCatalog: React.FC<ListingsCatalogProps> = ({
  listings,
  models,
  filters,
  setFilters,
  currency,
  onSelectListing,
  onOpenAddListing,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const { t, formatPrice, language } = useLanguage();

  // Helper map for phone model specs
  const modelMap = new Map<string, PhoneModel>();
  models.forEach((m) => modelMap.set(m.id, m));

  // Filter logic
  const filteredListings = listings.filter((item) => {
    const model = modelMap.get(item.modelId);
    const fullText = `${model?.brand || ''} ${model?.modelName || ''} ${item.color} ${item.storage} ${item.sellerLocation} ${item.notes || ''}`.toLowerCase();
    
    // Search query
    if (filters.searchQuery && !fullText.includes(filters.searchQuery.toLowerCase())) {
      return false;
    }

    // Brand filter
    if (filters.brand !== 'ALL' && model?.brand !== filters.brand) {
      return false;
    }

    // Model filter
    if (filters.modelId !== 'ALL' && item.modelId !== filters.modelId) {
      return false;
    }

    // Condition filter
    if (filters.condition !== 'ALL' && item.condition !== filters.condition) {
      return false;
    }

    // IMEI Status filter
    if (filters.imeiStatus !== 'ALL' && item.imeiStatus !== filters.imeiStatus) {
      return false;
    }

    // Price range
    if (item.priceUSD < filters.minPrice || item.priceUSD > filters.maxPrice) {
      return false;
    }

    // Battery health filter
    if (filters.minBatteryHealth > 0) {
      if (item.batteryHealth === null || item.batteryHealth < filters.minBatteryHealth) {
        return false;
      }
    }

    // Storage filter
    if (filters.storage !== 'ALL' && item.storage !== filters.storage) {
      return false;
    }

    return true;
  });

  // Sorting logic
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (filters.sortBy === 'PRICE_ASC') return a.priceUSD - b.priceUSD;
    if (filters.sortBy === 'PRICE_DESC') return b.priceUSD - a.priceUSD;
    if (filters.sortBy === 'BATTERY_DESC') return (b.batteryHealth || 0) - (a.batteryHealth || 0);
    if (filters.sortBy === 'VIEWS') return b.views - a.views;
    // Default NEWEST
    return new Date(b.dateListed).getTime() - new Date(a.dateListed).getTime();
  });

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'NEW':
        return { label: t('condNew'), class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'LIKE_NEW':
        return { label: t('condLikeNew'), class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'USED':
      default:
        return { label: t('condUsed'), class: 'bg-orange-500/20 text-orange-300 border-orange-500/40' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Bar: Title, Count, Sort & View Mode controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>{t('catalogTitle')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40 font-bold">
              {sortedListings.length} {t('unitsCount')}
            </span>
          </h2>
          <p className="text-xs text-[#C3B2D9] mt-0.5">
            {t('catalogSub')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilterSidebar(!showFilterSidebar)}
            className="md:hidden px-3 py-2 rounded-xl glass-panel text-white text-xs font-semibold flex items-center gap-2 border border-[#FF2E93]/40"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF2E93]" />
            <span>{t('filtersLabel')} ({filters.brand !== 'ALL' || filters.condition !== 'ALL' ? t('filterActive') : t('allBrands')})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-[#C3B2D9] font-medium hidden sm:inline">{t('sortBy')}:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              id="catalog-sort-select"
            >
              <option value="NEWEST" className="bg-[#160B24]">{t('sortNewest')}</option>
              <option value="PRICE_ASC" className="bg-[#160B24]">{t('sortPriceLow')}</option>
              <option value="PRICE_DESC" className="bg-[#160B24]">{t('sortPriceHigh')}</option>
              <option value="BATTERY_DESC" className="bg-[#160B24]">{t('sortBattery')}</option>
              <option value="VIEWS" className="bg-[#160B24]">{t('sortViews')}</option>
            </select>
          </div>

          {/* Grid vs List View Toggle */}
          <div className="hidden sm:flex items-center bg-[#160B24] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#FF2E93] text-white shadow-[0_0_8px_#FF2E93]' : 'text-[#C3B2D9] hover:text-white'
              }`}
              title="Grid View"
              id="view-grid-btn"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#FF2E93] text-white shadow-[0_0_8px_#FF2E93]' : 'text-[#C3B2D9] hover:text-white'
              }`}
              title="List View"
              id="view-list-btn"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Post New Listing CTA */}
          <button
            onClick={onOpenAddListing}
            className="neon-btn-pink px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            id="catalog-post-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ {t('postPhone')}</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid (Filters Sidebar + Listings Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar Filters (Desktop + Mobile Drawer) */}
        <div className={`md:col-span-3 ${showFilterSidebar ? 'block' : 'hidden md:block'}`}>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF2E93]" />
                <span>{t('refineInventory')}</span>
              </h3>
              
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
                className="text-[11px] text-[#FF2E93] hover:underline font-semibold cursor-pointer"
              >
                {t('resetAll')}
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-[#C3B2D9] uppercase tracking-wider mb-2">
                {t('brandFilter')}
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="w-full bg-[#160B24] text-white text-sm font-bold rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none cursor-pointer"
              >
                <option value="ALL">{t('allBrands')} ({models.length} models)</option>
                {Array.from(new Set(models.map((m) => m.brand))).sort().map((b) => (
                  <option key={b} value={b}>
                    {b} ({models.filter((m) => m.brand === b).length} models)
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider Filter */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-[#C3B2D9] uppercase tracking-wider">{t('maxPrice')}</span>
                <span className="text-[#FF2E93] font-bold">{formatPrice(filters.maxPrice, currency)}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#FF2E93] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#C3B2D9] mt-1">
                <span>$100</span>
                <span>$3,000</span>
              </div>
            </div>

            {/* IMEI Registration Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-2">
                {t('imeiRegTitle')}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'ALL', label: t('allImei') },
                  { id: 'REGISTERED', label: t('imeiYesOption') },
                  { id: 'NOT_REGISTERED', label: t('imeiNoOption') },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilters((prev) => ({ ...prev, imeiStatus: option.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      filters.imeiStatus === option.id
                        ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/50'
                        : 'bg-white/5 text-[#C3B2D9] hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    <div>{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Rating Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-2">
                {t('conditionFilter')}
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'ALL', label: t('allConditions') },
                  { id: 'NEW', label: t('condNew') },
                  { id: 'LIKE_NEW', label: t('condLikeNew') },
                  { id: 'USED', label: t('condUsed') },
                ].map((cond) => (
                  <button
                    key={cond.id}
                    onClick={() => setFilters((prev) => ({ ...prev, condition: cond.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      filters.condition === cond.id
                        ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/50'
                        : 'bg-white/5 text-[#C3B2D9] hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Battery Health Filter */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-[#C3B2D9] uppercase tracking-wider">{t('minBattery')}</span>
                <span className="text-[#00F0FF] font-bold">
                  {filters.minBatteryHealth === 0 ? t('anyOption') : `${filters.minBatteryHealth}%+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minBatteryHealth}
                onChange={(e) => setFilters((prev) => ({ ...prev, minBatteryHealth: Number(e.target.value) }))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
            </div>

            {/* Storage Size Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-2">
                {t('storageCapacity')}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['ALL', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilters((prev) => ({ ...prev, storage: st }))}
                    className={`py-1.5 px-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filters.storage === st
                        ? 'bg-[#FF2E93] text-white shadow-[0_0_8px_#FF2E93]'
                        : 'bg-white/5 text-[#C3B2D9] hover:text-white border border-white/10'
                    }`}
                  >
                    {st === 'ALL' ? t('anyOption') : st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Listings Display Grid */}
        <div className="md:col-span-9">
          
          {sortedListings.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center border border-white/10 max-w-md mx-auto my-8">
              <Package className="w-12 h-12 text-[#FF2E93] mx-auto mb-3 opacity-60" />
              <h3 className="text-xl font-bold text-white mb-1">
                {listings.length === 0 ? 'No Smartphone Listings Yet' : t('noSmartphonesFound')}
              </h3>
              <p className="text-xs text-[#C3B2D9] mb-6">
                {listings.length === 0 
                  ? 'The catalog is a blank paper! Be the first to post a smartphone for sale.' 
                  : t('noSmartphonesSub')}
              </p>
              {listings.length === 0 ? (
                <button
                  onClick={onOpenAddListing}
                  className="neon-btn-pink px-6 py-3 rounded-xl font-extrabold text-sm cursor-pointer shadow-[0_0_15px_rgba(255,46,147,0.4)]"
                >
                  + {t('postPhone')}
                </button>
              ) : (
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
                  className="neon-btn-pink px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedListings.map((item) => {
                const model = modelMap.get(item.modelId);
                const condInfo = getConditionBadge(item.condition);
                const mainPhoto = item.photos[0] || model?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="glass-panel rounded-2xl overflow-hidden glass-panel-hover group cursor-pointer flex flex-col justify-between border border-[#FF2E93]/20 relative"
                    id={`listing-card-${item.id}`}
                  >
                    
                    {/* Top Image Container */}
                    <div className="relative h-56 overflow-hidden bg-[#160B24]">
                      <img
                        src={mainPhoto}
                        alt={`${model?.brand} ${model?.modelName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] via-transparent to-black/30" />

                      {/* Status Badges Overlay */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border backdrop-blur-md uppercase tracking-wider shadow-md ${condInfo.class}`}>
                          {condInfo.label}
                        </span>

                        {item.imeiStatus === 'REGISTERED' ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 backdrop-blur-md flex items-center gap-1 shadow-md">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t('uzimeiRegistered')}: {t('yes')}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/50 backdrop-blur-md flex items-center gap-1 shadow-md">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t('uzimeiRegistered')}: {t('no')}</span>
                          </span>
                        )}
                      </div>

                      {/* Battery Health % Pill */}
                      {item.batteryHealth !== null && (
                        <div className="absolute bottom-3 right-3 bg-[#0D0714]/90 backdrop-blur-md border border-[#00F0FF]/40 px-2 py-0.5 rounded-full text-[11px] font-extrabold text-[#00F0FF] flex items-center gap-1 shadow-md">
                          <BatteryCharging className="w-3.5 h-3.5 text-[#00F0FF]" />
                          <span>{item.batteryHealth}% {t('batteryHealthLabel')}</span>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-3 right-3 bg-[#FF2E93] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[0_0_10px_#FF2E93]">
                          {t('hotDeal')}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      
                      <div>
                        {/* Brand & Storage Header */}
                        <div className="text-[11px] font-bold text-[#FF2E93] uppercase tracking-wider mb-0.5">
                          {model?.brand || 'Smartphone'} • {item.storage} ({translateColor(item.color, language)})
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-extrabold text-white group-hover:text-[#FF2E93] transition-colors line-clamp-1">
                          {model?.modelName || 'Device'}
                        </h4>

                        {/* Price Tag */}
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl font-black neon-text-pink">
                            {formatPrice(item.priceUSD, currency)}
                          </span>
                          {currency === 'USD' && (
                            <span className="text-[11px] text-[#C3B2D9] font-medium">
                              ({formatPrice(item.priceUSD, 'UZS')})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Issues / Defects highlight */}
                      <div className="bg-[#160B24]/80 p-2.5 rounded-xl border border-white/5 text-xs">
                        {item.defects.length === 0 || item.defects.includes('None') || item.defects.includes('None / Clean device') ? (
                          <div className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('noDefects')}</span>
                          </div>
                        ) : (
                          <div className="text-amber-300 font-medium flex items-center gap-1.5 text-[11px] line-clamp-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{item.defects.map((d) => translateDefect(d, language)).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* External GSMArena Specs Button */}
                      <a
                        href={getGsmArenaUrl(model?.brand, model?.modelName, item.gsmarena_url || model?.gsmarena_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-[#160B24] hover:bg-[#00F0FF]/15 text-[#00F0FF] hover:text-white py-2 px-3 rounded-xl text-xs font-bold border border-[#00F0FF]/30 hover:border-[#00F0FF] transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                        title={t('gsmarenaBtn')}
                      >
                        <span>📱 {t('gsmarenaBtn')}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                      </a>

                      {/* Seller Location & Date */}
                      <div className="flex items-center justify-between text-[11px] text-[#C3B2D9] pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-[#FF2E93] shrink-0" />
                          <span className="truncate">{item.sellerLocation}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Eye className="w-3 h-3" />
                          <span>{item.views} {t('views')}</span>
                        </span>
                      </div>

                    </div>

                    {/* Card Footer Button */}
                    <div className="px-4 pb-4">
                      <button className="w-full bg-[#FF2E93]/15 hover:bg-[#FF2E93] text-white py-2 rounded-xl text-xs font-bold border border-[#FF2E93]/40 hover:border-[#FF2E93] transition-all duration-300 flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_15px_rgba(255,46,147,0.5)]">
                        <span>{t('viewDetails')}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            
            /* List View */
            <div className="space-y-4">
              {sortedListings.map((item) => {
                const model = modelMap.get(item.modelId);
                const condInfo = getConditionBadge(item.condition);
                const mainPhoto = item.photos[0] || model?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="glass-panel p-4 rounded-2xl glass-panel-hover group cursor-pointer border border-[#FF2E93]/20 flex flex-col sm:flex-row gap-4 items-center"
                    id={`listing-list-item-${item.id}`}
                  >
                    <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-[#160B24] shrink-0 relative">
                      <img
                        src={mainPhoto}
                        alt={`${model?.brand} ${model?.modelName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      {item.batteryHealth !== null && (
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-[#00F0FF] font-bold">
                          ⚡ {item.batteryHealth}% {t('batteryHealthLabel')}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${condInfo.class}`}>
                          {condInfo.label}
                        </span>
                        {item.imeiStatus === 'REGISTERED' ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {t('uzimeiRegistered')}: {t('yes')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {t('uzimeiRegistered')}: {t('no')}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-extrabold text-white group-hover:text-[#FF2E93]">
                        {model?.brand} {model?.modelName} ({item.storage})
                      </h4>

                      <p className="text-xs text-[#C3B2D9] line-clamp-1">
                        {item.notes || model?.overview}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#C3B2D9] pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF2E93]" />
                          {item.sellerLocation}
                        </span>
                        <span>{t('seller')}: {item.sellerName}</span>

                        <a
                          href={getGsmArenaUrl(model?.brand, model?.modelName, item.gsmarena_url || model?.gsmarena_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#160B24] hover:bg-[#00F0FF]/20 text-[#00F0FF] hover:text-white py-1 px-2.5 rounded-lg text-xs font-bold border border-[#00F0FF]/30 hover:border-[#00F0FF] transition-all flex items-center gap-1"
                        >
                          <span>📱 {t('gsmarenaBtn')}</span>
                          <ExternalLink className="w-3 h-3 text-[#00F0FF]" />
                        </a>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                      <div className="text-xl font-black neon-text-pink mb-2">
                        {formatPrice(item.priceUSD, currency)}
                      </div>
                      <button className="neon-btn-pink px-4 py-2 rounded-xl text-xs font-bold w-full sm:w-auto">
                        {t('viewDetails')}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
