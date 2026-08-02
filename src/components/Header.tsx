import React, { useState } from 'react';
import { PlusCircle, Layers, ShoppingBag, Info, Menu, X, Sparkles, Globe, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { Currency, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

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
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'shop', label: t('shopListings'), icon: ShoppingBag, badge: listingsCount },
    { id: 'models', label: t('phoneCatalog'), icon: Layers, badge: modelsCount },
    { id: 'add-listing', label: t('postPhone'), icon: PlusCircle, highlight: true },
    { id: 'faq', label: t('buyerGuide'), icon: Info },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-[#FF2E93]/20 bg-[#0D0714]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('shop')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="mix-mobile-logo-header"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#FF2E93]/40 group-hover:border-[#FF2E93] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,46,147,0.6)]">
                <img 
                  src="/src/assets/images/mix_mobile_logo_1785309932571.jpg" 
                  alt="Mix Mobile Logo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] border-2 border-[#0D0714]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-white">
                  MIX <span className="neon-text-pink">MOBILE</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40">
                  UZ
                </span>
              </div>
              <p className="text-[10px] tracking-widest font-semibold uppercase text-[#C3B2D9] group-hover:text-[#00F0FF] transition-colors">
                {t('logoTagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              const handleNavClick = () => {
                if ((item.id === 'add-listing' || item.id === 'seller-manage') && !isAdmin) {
                  onOpenAdminModal();
                } else {
                  setActiveTab(item.id as any);
                }
              };

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={handleNavClick}
                    className="neon-btn-pink px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ml-2"
                    id={`nav-btn-${item.id}`}
                  >
                    {!isAdmin ? <Lock className="w-4 h-4 text-white/80" /> : <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={handleNavClick}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/50 shadow-[0_0_12px_rgba(255,46,147,0.3)]'
                      : 'text-[#C3B2D9] hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                  }`}
                  id={`nav-btn-${item.id}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF2E93]' : 'text-[#C3B2D9]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#FF2E93] text-white' : 'bg-white/10 text-[#C3B2D9]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Currency Toggle, Language Switcher & Quick Admin Link */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#160B24] p-1 rounded-xl border border-white/10">
              <Globe className="w-3.5 h-3.5 text-[#00F0FF] ml-1 mr-0.5" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    language === lang.code
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'text-[#C3B2D9] hover:text-white'
                  }`}
                  title={lang.label}
                  id={`lang-btn-${lang.code}`}
                >
                  <span>{lang.flag}</span>
                  <span className="uppercase">{lang.code}</span>
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-[#160B24] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
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
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'UZS'
                    ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.5)]'
                    : 'text-[#C3B2D9] hover:text-white'
                }`}
                title="View prices in UZS"
              >
                UZS
              </button>
            </div>

            {/* Manage Stock Button or Admin Status / Logout */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('seller-manage')}
                  className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                    activeTab === 'seller-manage'
                      ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-[#00F0FF]'
                      : 'border-white/10 text-[#C3B2D9] hover:border-white/30 hover:text-white'
                  }`}
                  title={t('manageStock')}
                  id="nav-btn-seller-manage"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span className="hidden lg:inline">{t('manageStock')}</span>
                </button>

                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-extrabold flex items-center gap-1.5 hover:bg-red-500/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  title="Exit Admin Mode"
                  id="admin-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden lg:inline">Logout Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="p-2 rounded-xl border border-white/10 text-[#C3B2D9] hover:text-white hover:border-[#FF2E93]/40 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Admin Portal Login"
                id="admin-login-btn"
              >
                <Lock className="w-3.5 h-3.5 text-[#FF2E93]" />
                <span className="hidden xl:inline">Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button & Mobile Language Selector */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center bg-[#160B24] p-0.5 rounded-lg border border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    language === lang.code ? 'bg-[#00F0FF] text-black font-extrabold' : 'text-[#C3B2D9]'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrency(currency === 'USD' ? 'UZS' : 'USD')}
              className="px-2 py-1 text-xs font-bold rounded-lg bg-[#FF2E93]/20 text-[#FF2E93] border border-[#FF2E93]/40"
            >
              {currency}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#C3B2D9] hover:text-white hover:bg-white/5 focus:outline-none"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[#FF2E93]/30 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if ((item.id === 'add-listing' || item.id === 'seller-manage') && !isAdmin) {
                    onOpenAdminModal();
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl text-left font-semibold flex items-center justify-between transition-all ${
                  item.highlight
                    ? 'neon-btn-pink text-white'
                    : isActive
                    ? 'bg-[#FF2E93]/20 text-white border border-[#FF2E93]/40'
                    : 'text-[#C3B2D9] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {!isAdmin && (item.id === 'add-listing' || item.id === 'seller-manage') ? (
                    <Lock className="w-5 h-5 text-[#FF2E93]" />
                  ) : (
                    <Icon className="w-5 h-5 text-[#FF2E93]" />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          {isAdmin ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('seller-manage');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-left font-semibold flex items-center gap-3 text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30"
              >
                <Sparkles className="w-5 h-5 text-[#00F0FF]" />
                <span>{t('manageListings')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogoutAdmin();
                }}
                className="w-full px-4 py-3 rounded-xl text-left font-bold flex items-center gap-3 text-red-300 bg-red-500/15 border border-red-500/40"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span>Logout Admin Mode</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full px-4 py-3 rounded-xl text-left font-semibold flex items-center gap-3 text-[#FF2E93] bg-[#FF2E93]/10 border border-[#FF2E93]/30"
            >
              <Lock className="w-5 h-5 text-[#FF2E93]" />
              <span>Admin Portal Login</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
