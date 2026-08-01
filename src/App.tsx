import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ListingsCatalog } from './components/ListingsCatalog';
import { ModelsCatalog } from './components/ModelsCatalog';
import { ListingDetailModal } from './components/ListingDetailModal';
import { AddListingModal } from './components/AddListingModal';
import { SellerManagementModal } from './components/SellerManagementModal';
import { ContactFAQModal } from './components/ContactFAQModal';
import { ReserveRequestModal } from './components/ReserveRequestModal';
import { PhoneModel, PhoneListing, FilterState, Currency, ListingStatus } from './types';
import { getStoredModels, saveModels, getStoredListings, saveListings, resetToSeedData } from './utils/storage';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [listings, setListings] = useState<PhoneListing[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [activeTab, setActiveTab] = useState<'shop' | 'models' | 'add-listing' | 'faq' | 'seller-manage'>('shop');

  // Modals state
  const [selectedListing, setSelectedListing] = useState<PhoneListing | null>(null);
  const [reserveListing, setReserveListing] = useState<PhoneListing | null>(null);
  const [preSelectedModelForListing, setPreSelectedModelForListing] = useState<string | undefined>(undefined);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
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
  });

  // Load state on mount
  useEffect(() => {
    setModels(getStoredModels());
    setListings(getStoredListings());
  }, []);

  // Save changes to storage
  const handleSaveModel = (newModel: PhoneModel) => {
    const updated = [newModel, ...models];
    setModels(updated);
    saveModels(updated);
    setActiveTab('models');
  };

  const handleSaveListing = (newListing: PhoneListing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    saveListings(updated);
    setActiveTab('shop');
  };

  const handleUpdateStatus = (listingId: string, status: ListingStatus) => {
    const updated = listings.map((l) => (l.id === listingId ? { ...l, status } : l));
    setListings(updated);
    saveListings(updated);
  };

  const handleDeleteListing = (listingId: string) => {
    const updated = listings.filter((l) => l.id !== listingId);
    setListings(updated);
    saveListings(updated);
  };

  const handleResetData = () => {
    if (confirm(t('resetConfirmText'))) {
      const { models: m, listings: l } = resetToSeedData();
      setModels(m);
      setListings(l);
    }
  };

  const handleSelectListing = (listing: PhoneListing) => {
    // Increment view counter
    const updated = listings.map((item) =>
      item.id === listing.id ? { ...item, views: item.views + 1 } : item
    );
    setListings(updated);
    saveListings(updated);
    setSelectedListing({ ...listing, views: listing.views + 1 });
  };

  // Helper calculation for active counts
  const availableListings = listings.filter((l) => l.status === 'AVAILABLE');
  const registeredCount = availableListings.filter((l) => l.imeiStatus === 'REGISTERED').length;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FF2E93] selection:text-white">
      
      <div>
        {/* Header Navbar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          listingsCount={availableListings.length}
          modelsCount={models.length}
        />

        {/* Hero Section (Only shown on Shop tab or Home) */}
        {activeTab === 'shop' && (
          <Hero
            filters={filters}
            setFilters={setFilters}
            models={models}
            availableCount={availableListings.length}
            registeredIMEICount={registeredCount}
            currency={currency}
            onExploreClick={() => {
              const catalogElement = document.getElementById('shop-listings-section');
              catalogElement?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Main Content View Switcher */}
        <main id="shop-listings-section">
          {activeTab === 'shop' && (
            <ListingsCatalog
              listings={availableListings}
              models={models}
              filters={filters}
              setFilters={setFilters}
              currency={currency}
              onSelectListing={handleSelectListing}
              onOpenAddListing={() => {
                setPreSelectedModelForListing(undefined);
                setActiveTab('add-listing');
              }}
            />
          )}

          {activeTab === 'models' && (
            <ModelsCatalog
              models={models}
              listings={listings}
              onSelectModelFilter={(modelId) => {
                setFilters((prev) => ({ ...prev, modelId, brand: 'ALL' }));
                setActiveTab('shop');
              }}
              onAddListingForModel={(modelId) => {
                setPreSelectedModelForListing(modelId);
                setActiveTab('add-listing');
              }}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* Detailed Phone Listing View Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          model={models.find((m) => m.id === selectedListing.modelId)}
          currency={currency}
          onClose={() => setSelectedListing(null)}
          onReserveClick={(lst) => {
            setSelectedListing(null);
            setReserveListing(lst);
          }}
        />
      )}

      {/* Add Physical Listing Modal */}
      {activeTab === 'add-listing' && (
        <AddListingModal
          models={models}
          preSelectedModelId={preSelectedModelForListing}
          onSaveListing={handleSaveListing}
          onClose={() => setActiveTab('shop')}
        />
      )}

      {/* Seller Management Dashboard Modal */}
      {activeTab === 'seller-manage' && (
        <SellerManagementModal
          listings={listings}
          models={models}
          currency={currency}
          onUpdateStatus={handleUpdateStatus}
          onDeleteListing={handleDeleteListing}
          onResetSeedData={handleResetData}
          onClose={() => setActiveTab('shop')}
        />
      )}

      {/* Buyer FAQ Modal */}
      {activeTab === 'faq' && (
        <ContactFAQModal onClose={() => setActiveTab('shop')} />
      )}

      {/* Reserve Request Modal */}
      {reserveListing && (
        <ReserveRequestModal
          listing={reserveListing}
          model={models.find((m) => m.id === reserveListing.modelId)}
          currency={currency}
          onClose={() => setReserveListing(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-[#FF2E93]/20 glass-panel bg-[#0D0714]/90 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#FF2E93]/40">
              <img
                src="/src/assets/images/mix_mobile_logo_1785309932571.jpg"
                alt="Mix Mobile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white">
                MIX <span className="neon-text-pink">MOBILE</span>
              </div>
              <p className="text-[10px] text-[#C3B2D9] tracking-widest uppercase">
                {t('footerTagline')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#C3B2D9]">
            <button onClick={() => setActiveTab('shop')} className="hover:text-white transition-colors cursor-pointer">
              {t('physicalStock')}
            </button>
            <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors cursor-pointer">
              {t('modelKnowledge')}
            </button>
            <button onClick={() => setActiveTab('add-listing')} className="hover:text-white transition-colors cursor-pointer">
              {t('postPhoneFooter')}
            </button>
            <button onClick={() => setActiveTab('faq')} className="hover:text-white transition-colors cursor-pointer">
              {t('uzimeiFaqFooter')}
            </button>
          </div>

          <div className="text-xs text-[#C3B2D9] text-center md:text-right">
            <div>© {new Date().getFullYear()} Mix Mobile Marketplace. {t('rightsReserved')}</div>
            <div className="text-[11px] text-[#FF2E93] mt-0.5">{t('cities')}</div>
          </div>

        </div>
      </footer>

    </div>
  );
}
