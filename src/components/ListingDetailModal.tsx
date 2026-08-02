import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  BatteryCharging, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  MessageCircle, 
  MapPin, 
  Check, 
  Cpu, 
  Monitor, 
  Camera, 
  Zap, 
  Award, 
  ThumbsUp, 
  ThumbsDown, 
  Info,
  Sparkles,
  Share2,
  Download,
  ExternalLink
} from 'lucide-react';
import { PhoneListing, PhoneModel, Currency } from '../types';
import { downloadImageFile } from '../utils/fileDownloader';
import { getGsmArenaUrl } from '../utils/gsmarena';
import { useLanguage } from '../context/LanguageContext';
import { translateColor, translateDefect, translateAccessory } from '../utils/translationsHelper';

interface ListingDetailModalProps {
  listing: PhoneListing;
  model?: PhoneModel;
  currency: Currency;
  onClose: () => void;
  onReserveClick: (listing: PhoneListing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  model,
  currency,
  onClose,
  onReserveClick,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { t, formatPrice, language } = useLanguage();

  const photos = listing.photos.length > 0 
    ? listing.photos 
    : [model?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'];

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'NEW':
        return { text: `🟢 ${t('brandNewCondition')}`, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
      case 'LIKE_NEW':
        return { text: `🟡 ${t('likeNewCondition')}`, color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' };
      case 'USED':
      default:
        return { text: `🟠 ${t('usedCondition')}`, color: 'text-orange-300 bg-orange-500/20 border-orange-500/40' };
    }
  };

  const cond = getConditionLabel(listing.condition);

  const shareListing = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-[#FF2E93]/30 shadow-[0_0_50px_rgba(255,46,147,0.3)] my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-[#0D0714]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40 uppercase">
              {model?.brand}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {model?.modelName || listing.title} <span className="text-[#FF2E93] font-bold">({listing.storage})</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareListing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C3B2D9] hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title={t('shareLink')}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? t('copied') : t('share')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
              id="close-listing-modal-btn"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Top Section: Photo Gallery & Unit Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Left Column */}
            <div className="lg:col-span-7 space-y-3">
              {/* Main Photo Display */}
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#160B24] border border-white/10 group">
                <img
                  src={photos[selectedPhotoIndex]}
                  alt="Phone physical photo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border backdrop-blur-md uppercase tracking-wider ${cond.color}`}>
                    {cond.text}
                  </span>
                </div>

                {/* Download Image File Button Overlay */}
                <button
                  onClick={() => downloadImageFile(photos[selectedPhotoIndex], `${model?.brand || 'Phone'}-${model?.modelName || 'listing'}-photo-${selectedPhotoIndex + 1}.jpg`)}
                  className="absolute bottom-4 right-4 bg-[#0D0714]/90 hover:bg-[#FF2E93] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 backdrop-blur-md shadow-lg transition-all cursor-pointer"
                  title={t('downloadImageFile')}
                >
                  <Download className="w-4 h-4 text-[#00F0FF]" />
                  <span>{t('downloadImageFile')}</span>
                </button>

                {listing.batteryHealth !== null && (
                  <div className="absolute bottom-4 left-4 bg-[#0D0714]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#00F0FF] border border-[#00F0FF]/40 flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-[#00F0FF]" />
                    <span>{t('batteryHealth')}: {listing.batteryHealth}%</span>
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {photos.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? 'border-[#FF2E93] shadow-[0_0_12px_#FF2E93]'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Primary Buying Info Right Column */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div>
                
                {/* Price Display Box */}
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#FF2E93] space-y-1 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C3B2D9]">{t('askingPrice')}</span>
                  <div className="text-3xl sm:text-4xl font-black neon-text-pink">
                    {formatPrice(listing.priceUSD, currency)}
                  </div>
                  <div className="text-xs text-[#C3B2D9]">
                    {t('equivalent')}: <span className="text-white font-semibold">{formatPrice(listing.priceUSD, currency === 'USD' ? 'UZS' : 'USD')}</span>
                  </div>
                </div>

                {/* Seller & Listing Meta */}
                <div className="space-y-2.5 text-xs text-[#C3B2D9] bg-[#160B24]/80 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span>{t('sellerStore')}:</span>
                    <span className="font-bold text-white">{listing.sellerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('location')}:</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF2E93]" />
                      {listing.sellerLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('dateListed')}:</span>
                    <span className="font-medium text-white">
                      {new Date(listing.dateListed).toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('views')}:</span>
                    <span className="font-medium text-[#00F0FF]">{listing.views} {t('views')}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3">
                <button
                  onClick={() => onReserveClick(listing)}
                  className="w-full neon-btn-pink py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer text-white shadow-lg"
                  id="detail-reserve-btn"
                >
                  <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                  <span>{t('reserveBuyBtn')}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://t.me/${listing.sellerTelegram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 hover:bg-[#0088cc] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#0088cc] group-hover:text-white" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={`https://wa.me/${listing.sellerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <a
                  href={`tel:${listing.sellerPhone}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#FF2E93]" />
                  <span>{t('callSeller')} ({listing.sellerPhone})</span>
                </a>

                {/* Prominent GSMArena Specs Button */}
                <a
                  href={getGsmArenaUrl(model?.brand, model?.modelName, listing.gsmarena_url || model?.gsmarena_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#00F0FF]/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border border-[#00F0FF]/40 hover:border-[#00F0FF] transition-all shadow-md cursor-pointer"
                >
                  <span>📱 {t('gsmarenaBtn')}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
              </div>

            </div>

          </div>

          {/* SECTION 1: PHYSICAL UNIT DETAILS */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <h4 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E93]" />
              <span>{t('section1Title')}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* IMEI Status Box */}
              <div className={`p-4 rounded-xl border ${
                listing.imeiStatus === 'REGISTERED'
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : 'bg-amber-500/10 border-amber-500/40'
              }`}>
                <div className="text-xs font-semibold text-[#C3B2D9] mb-1">{t('imeiStatusLabel')}</div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  {listing.imeiStatus === 'REGISTERED' ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300">{t('uzimeiRegistered')}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-300">{t('uzimeiNotRegistered')}</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#C3B2D9] mt-1.5">
                  {listing.imeiStatus === 'REGISTERED'
                    ? t('imeiRegSub')
                    : t('imeiNotRegSub')}
                </p>
              </div>

              {/* Physical Condition Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-semibold text-[#C3B2D9] mb-1">{t('physicalGrade')}</div>
                <div className="font-extrabold text-sm text-white">{cond.text}</div>
                <p className="text-[11px] text-[#C3B2D9] mt-1.5">
                  {t('color')}: <span className="text-white font-semibold">{translateColor(listing.color, language)}</span> | {t('storage')}: <span className="text-white font-semibold">{listing.storage} ({listing.ram} RAM)</span>
                </p>
              </div>

              {/* Battery Health Box */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-semibold text-[#C3B2D9] mb-1">{t('batteryHealth')}</div>
                <div className="font-extrabold text-sm text-[#00F0FF] flex items-center gap-1">
                  <BatteryCharging className="w-4 h-4 text-[#00F0FF]" />
                  <span>{listing.batteryHealth !== null ? `${listing.batteryHealth}%` : 'N/A'}</span>
                </div>
                <p className="text-[11px] text-[#C3B2D9] mt-1.5">
                  {listing.batteryHealth && listing.batteryHealth >= 90
                    ? t('batteryHealthExcel')
                    : listing.batteryHealth && listing.batteryHealth >= 80
                    ? t('batteryHealthNorm')
                    : t('batteryHealthOrig')}
                </p>
              </div>

              {/* Box Content & Included Accessories */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-semibold text-[#C3B2D9] mb-1">{t('includedAccessories')}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.includedItems.length > 0 ? (
                    listing.includedItems.map((inc, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                        ✓ {translateAccessory(inc, language)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#C3B2D9]">Standard</span>
                  )}
                </div>
              </div>

            </div>

            {/* Reported Defects & Missing Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#160B24] border border-white/5 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#FF2E93] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FF2E93]" />
                  <span>{t('reportedDefects')}</span>
                </h5>
                <ul className="space-y-1">
                  {listing.defects.length === 0 || listing.defects.includes('None') || listing.defects.includes('None / Clean device') ? (
                    <li className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('zeroDefects')}</span>
                    </li>
                  ) : (
                    listing.defects.map((def, idx) => (
                      <li key={idx} className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{translateDefect(def, language)}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#160B24] border border-white/5 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#00F0FF]" />
                  <span>{t('sellerNotes')}</span>
                </h5>
                <p className="text-xs text-[#C3B2D9] leading-relaxed">
                  {listing.notes || t('sellerNotesDefault')}
                </p>
              </div>
            </div>

          </div>

          {/* SECTION 2: MODEL KNOWLEDGE BASE (From Base Catalog) */}
          {model && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#00F0FF]" />
                  <span>{t('section2Title')}</span>
                </h4>
                <span className="text-xs text-[#C3B2D9]">{t('adminBuyingGuide')}</span>
              </div>

              {/* Editorial Overview */}
              <div className="bg-[#160B24]/90 p-5 rounded-2xl border border-white/5 space-y-3">
                <h5 className="text-sm font-bold text-[#FF2E93] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('whyBuy')} {model.brand} {model.modelName}?</span>
                </h5>
                <p className="text-xs sm:text-sm text-[#C3B2D9] leading-relaxed">
                  {model.overview}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="text-[#C3B2D9]">{t('recommendedFor')}:</span>
                  <span className="font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    {model.recommendedFor}
                  </span>
                </div>
              </div>

              {/* Pros & Cons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h6 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t('keyStrengths')}</span>
                  </h6>
                  <ul className="space-y-1 text-xs text-[#C3B2D9]">
                    {model.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                  <h6 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{t('tradeOffs')}</span>
                  </h6>
                  <ul className="space-y-1 text-xs text-[#C3B2D9]">
                    {model.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specs Breakdown Grid */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#C3B2D9] mb-3">
                  {t('techSpecsSummary')}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <Cpu className="w-4 h-4 text-[#FF2E93] mb-1" />
                    <div className="text-[10px] text-[#C3B2D9]">{t('processor')}</div>
                    <div className="font-bold text-white truncate">{model.chipset}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <Monitor className="w-4 h-4 text-[#00F0FF] mb-1" />
                    <div className="text-[10px] text-[#C3B2D9]">{t('display')}</div>
                    <div className="font-bold text-white truncate">{model.displaySpecs}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <Camera className="w-4 h-4 text-purple-400 mb-1" />
                    <div className="text-[10px] text-[#C3B2D9]">{t('cameraSetup')}</div>
                    <div className="font-bold text-white truncate">{model.cameraSpecs}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <Zap className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="text-[10px] text-[#C3B2D9]">{t('batterySpec')}</div>
                    <div className="font-bold text-white truncate">{model.batterySpecs}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
