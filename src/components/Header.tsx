import React, { useState } from 'react';
import { Layers, ShoppingBag, Info, Menu, X, Sparkles, Globe, Lock, LogOut, ShieldCheck, PlusCircle, HelpCircle, Box } from 'lucide-react';
import { Currency, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import logoImage from '../assets/images/mix_mobile_logo_1785309932571.jpg';

interface HeaderProps {
  activeTab: 'shop' | 'models' | 'add-listing' | 'faq' | 'seller-manage';
  setActiveTab: (tab: 'shop' | 'models' | 'add-listing' | 'faq' | 'seller-manage') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  listingsCount: number;
  modelsCount: number;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  listingsCount,
  modelsCount,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[#FF2E93]/20 bg-[#0D0714]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between min-h-[4.25rem] py-2.5 gap-2 sm:gap-4">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('shop')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            id="mix-mobile-logo-header"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#FF2E93]/40 group-hover:border-[#FF2E93] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,46,147,0.6)]">
                <img 
                  src={logoImage} 
                  alt="Mix Mobile Logo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] border-2 border-[#0D0714]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  MIX <span className="neon-text-pink">MOBILE</span>
                </span>
                <span className="px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40">
                  UZ
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-widest font-semibold uppercase text-[#C3B2D9] group-hover:text-[#00F0FF] transition-colors hidden xs:block">
                {t('logoTagline')}
              </p>
            </div>
          </div>

          {/* Flexible Main Navigation - EXACTLY 3 TOP BUTTONS */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 flex-wrap">
            {/* Button 1: Shop Listings */}
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/60 shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                  : 'text-[#C3B2D9] hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
              }`}
              id="nav-btn-shop"
            >
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'shop' ? 'text-[#FF2E93]' : 'text-[#C3B2D9]'}`} />
              <span>{t('shopListings')}</span>
              <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'shop' ? 'bg-[#FF2E93] text-white' : 'bg-white/10 text-[#C3B2D9]'
              }`}>
                {listingsCount}
              </span>
            </button>

            {/* Button 2: Phone Models Catalog */}
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'models'
                  ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/60 shadow-[0_0_15px_rgba(255,46,147,0.4)]'
                  : 'text-[#C3B2D9] hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
              }`}
              id="nav-btn-models"
            >
              <Layers className={`w-4 h-4 ${activeTab === 'models' ? 'text-[#FF2E93]' : 'text-[#C3B2D9]'}`} />
              <span>{t('phoneCatalog')}</span>
              <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'models' ? 'bg-[#FF2E93] text-white' : 'bg-white/10 text-[#C3B2D9]'
              }`}>
                {modelsCount}
              </span>
            </button>

            {/* Button 3: Admin Loads & Storage Controls */}
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => {
                    if (activeTab === 'seller-manage') {
                      setActiveTab('add-listing');
                    } else {
                      setActiveTab('seller-manage');
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                    activeTab === 'seller-manage' || activeTab === 'add-listing'
                      ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF]/70 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                      : 'bg-[#00F0FF]/10 text-white border border-[#00F0FF]/40 hover:bg-[#00F0FF]/20'
                  }`}
                  id="nav-btn-admin-control"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                  <span>{t('manageStock')}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="neon-btn-pink px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,46,147,0.4)]"
                id="nav-btn-admin-portal"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{t('adminPortalLocked')}</span>
              </button>
            )}
          </nav>

          {/* Right Control Bar (Language, Currency, FAQ, Logout) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Guide / FAQ Icon Button */}
            <button
              onClick={() => setActiveTab('faq')}
              className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-[#FF2E93]'
                  : 'bg-[#160B24] border-white/10 text-[#C3B2D9] hover:text-white hover:border-white/30'
              }`}
              title={t('buyerGuide')}
              id="header-faq-btn"
            >
              <HelpCircle className="w-4 h-4 text-[#C3B2D9]" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#160B24] p-1 rounded-xl border border-white/10">
              <Globe className="w-3.5 h-3.5 text-[#00F0FF] ml-1 mr-1 hidden lg:inline" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 sm:px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    language === lang.code
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-[#C3B2D9] hover:text-white'
                  }`}
                  title={lang.label}
                  id={`lang-btn-${lang.code}`}
                >
                  <span className="text-xs">{lang.flag}</span>
                  <span className="uppercase text-[10px] sm:text-xs">{lang.code}</span>
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-[#160B24] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.5)]'
                    : 'text-[#C3B2D9] hover:text-white'
                }`}
                title="View prices in USD ($)"
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('UZS')}
                className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                  currency === 'UZS'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.5)]'
                    : 'text-[#C3B2D9] hover:text-white'
                }`}
                title="View prices in UZS"
              >
                UZS
              </button>
            </div>

            {/* Admin Logout Button if Admin mode is active */}
            {isAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="p-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all cursor-pointer"
                title="Logout Admin"
                id="admin-logout-icon"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button & Mobile Controls */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <div className="flex items-center bg-[#160B24] p-0.5 rounded-lg border border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                    language === lang.code ? 'bg-[#00F0FF] text-black font-extrabold' : 'text-[#C3B2D9]'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrency(currency === 'USD' ? 'UZS' : 'USD')}
              className="px-2 py-1 text-[10px] font-bold rounded-lg bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40"
            >
              {currency}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#C3B2D9] hover:text-white hover:bg-white/5 focus:outline-none cursor-pointer"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[#FF2E93]/30 px-4 pt-2 pb-6 space-y-2">
          {/* Button 1: Shop Listings */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('shop');
            }}
            className={`w-full px-4 py-3 rounded-xl text-left font-bold flex items-center justify-between transition-all ${
              activeTab === 'shop'
                ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/40'
                : 'text-[#C3B2D9] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#FF2E93]" />
              <span>{t('shopListings')}</span>
            </div>
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white">
              {listingsCount}
            </span>
          </button>

          {/* Button 2: Phone Catalog */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('models');
            }}
            className={`w-full px-4 py-3 rounded-xl text-left font-bold flex items-center justify-between transition-all ${
              activeTab === 'models'
                ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/40'
                : 'text-[#C3B2D9] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#FF2E93]" />
              <span>{t('phoneCatalog')}</span>
            </div>
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white">
              {modelsCount}
            </span>
          </button>

          {/* Button 3: Admin Loads & Storage */}
          {isAdmin ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('seller-manage');
                }}
                className="w-full px-4 py-3 rounded-xl text-left font-bold flex items-center gap-3 text-[#00F0FF] bg-[#00F0FF]/15 border border-[#00F0FF]/40"
              >
                <ShieldCheck className="w-5 h-5 text-[#00F0FF]" />
                <span>{t('manageStock')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('add-listing');
                }}
                className="w-full px-4 py-3 rounded-xl text-left font-bold flex items-center gap-3 text-white bg-[#FF2E93]/20 border border-[#FF2E93]/40"
              >
                <PlusCircle className="w-5 h-5 text-[#FF2E93]" />
                <span>{t('loadPhone')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogoutAdmin();
                }}
                className="w-full px-4 py-3 rounded-xl text-left font-bold flex items-center gap-3 text-red-300 bg-red-500/15 border border-red-500/40"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span>Exit Admin</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full px-4 py-3 rounded-xl text-left font-bold flex items-center gap-3 text-white neon-btn-pink"
            >
              <Lock className="w-5 h-5 text-white" />
              <span>{t('adminPortalLocked')}</span>
            </button>
          )}

          {/* Buyer Guide */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveTab('faq');
            }}
            className="w-full px-4 py-3 rounded-xl text-left font-semibold flex items-center gap-3 text-[#C3B2D9] hover:bg-white/5 hover:text-white"
          >
            <HelpCircle className="w-5 h-5 text-[#C3B2D9]" />
            <span>{t('buyerGuide')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
