import React, { useState, useRef } from 'react';
import { 
  X, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  BatteryCharging, 
  Upload, 
  Download, 
  Trash2, 
  FileImage, 
  DollarSign,
  Sparkles 
} from 'lucide-react';
import { PhoneListing, PhoneModel, PhysicalCondition, IMEIStatus } from '../types';
import { downloadImageFile } from '../utils/fileDownloader';
import { useLanguage } from '../context/LanguageContext';

export interface UploadedImageFile {
  id: string;
  name: string;
  size: string;
  dataUrl: string;
}

interface AddListingModalProps {
  models: PhoneModel[];
  preSelectedModelId?: string;
  onSaveListing: (listing: PhoneListing) => void;
  onClose: () => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  models,
  preSelectedModelId,
  onSaveListing,
  onClose,
}) => {
  const { t, formatPrice } = useLanguage();
  const [selectedModelId, setSelectedModelId] = useState<string>(
    preSelectedModelId || (models[0] ? models[0].id : '')
  );

  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');

  const brandOptions = Array.from(new Set(models.map((m) => m.brand))).sort();

  const filteredModels = models.filter((m) => {
    const matchesBrand = selectedBrandFilter === 'ALL' || m.brand === selectedBrandFilter;
    const q = modelSearchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      m.modelName.toLowerCase().includes(q) || 
      m.brand.toLowerCase().includes(q) ||
      (m.chipset && m.chipset.toLowerCase().includes(q)) ||
      (m.releaseYear && m.releaseYear.toString().includes(q));
    return matchesBrand && matchesSearch;
  });

  const [priceUSD, setPriceUSD] = useState<number>(850);
  const selectedModel = models.find((m) => m.id === selectedModelId) || filteredModels[0] || models[0];
  const [color, setColor] = useState<string>(selectedModel?.colorVariants[0] || 'Black');
  const [storage, setStorage] = useState<string>(selectedModel?.storageOptions[0] || '128GB');
  const [ram, setRam] = useState<string>(selectedModel?.ramOptions[0] || '8GB');

  const [condition, setCondition] = useState<PhysicalCondition>('LIKE_NEW');
  const [batteryHealth, setBatteryHealth] = useState<number | null>(92);
  const [isBatteryNA, setIsBatteryNA] = useState<boolean>(false);

  // Defects checkboxes
  const defaultDefectOptions = [
    'None / Clean device',
    'Micro-scratches on display',
    'Body corner hairline scuff',
    'Face ID / Touch ID inactive',
    'Back glass replaced',
    'Screen replaced (Original)',
    'Camera glass mark'
  ];
  const [selectedDefects, setSelectedDefects] = useState<string[]>(['None / Clean device']);
  const [customDefect, setCustomDefect] = useState<string>('');

  // Included items checkboxes
  const defaultIncludedOptions = [
    'Original Box',
    'Original Fast Charger',
    'Original Cable',
    'Protective Case',
    'Glass Protector Applied'
  ];
  const [selectedIncluded, setSelectedIncluded] = useState<string[]>(['Original Box', 'Original Cable']);

  // IMEI Status
  const [imeiStatus, setImeiStatus] = useState<IMEIStatus>('REGISTERED');

  // Photo file upload & download state
  const [uploadedImageFiles, setUploadedImageFiles] = useState<UploadedImageFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo URL fallback
  const [photoUrlInput, setPhotoUrlInput] = useState<string>(selectedModel?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80');

  // Seller info & links
  const [customGsmArenaUrl, setCustomGsmArenaUrl] = useState<string>('');
  const [sellerName, setSellerName] = useState<string>('Mix Mobile Seller');
  const [sellerPhone, setSellerPhone] = useState<string>('+998901234567');
  const [sellerTelegram, setSellerTelegram] = useState<string>('mixmobile_tashkent');
  const [sellerLocation, setSellerLocation] = useState<string>('Tashkent, Malika Shop #14');
  const [notes, setNotes] = useState<string>('Verified unit in perfect working order. Clean iCloud / Google account sign out.');

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          setUploadedImageFiles((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              size: file.size / 1024 < 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              dataUrl,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeUploadedFile = (id: string) => {
    setUploadedImageFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const m = models.find((x) => x.id === modelId);
    if (m) {
      setColor(m.colorVariants[0] || 'Black');
      setStorage(m.storageOptions[0] || '128GB');
      setRam(m.ramOptions[0] || '8GB');
      if (m.imageUrl) setPhotoUrlInput(m.imageUrl);
    }
  };

  const toggleDefect = (def: string) => {
    if (def === 'None / Clean device') {
      setSelectedDefects(['None / Clean device']);
      return;
    }
    const filtered = selectedDefects.filter((d) => d !== 'None / Clean device');
    if (filtered.includes(def)) {
      const updated = filtered.filter((d) => d !== def);
      setSelectedDefects(updated.length === 0 ? ['None / Clean device'] : updated);
    } else {
      setSelectedDefects([...filtered, def]);
    }
  };

  const toggleIncluded = (inc: string) => {
    if (selectedIncluded.includes(inc)) {
      setSelectedIncluded(selectedIncluded.filter((i) => i !== inc));
    } else {
      setSelectedIncluded([...selectedIncluded, inc]);
    }
  };

  const addCustomDefect = () => {
    if (customDefect.trim()) {
      const filtered = selectedDefects.filter((d) => d !== 'None / Clean device');
      setSelectedDefects([...filtered, customDefect.trim()]);
      setCustomDefect('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert('Please select a valid phone model');
      return;
    }

    const finalPhotos = uploadedImageFiles.length > 0
      ? uploadedImageFiles.map((f) => f.dataUrl)
      : [photoUrlInput.trim() || selectedModel.imageUrl];

    const newListing: PhoneListing = {
      id: `l-${Date.now()}`,
      modelId: selectedModel.id,
      title: `${selectedModel.brand} ${selectedModel.modelName}`,
      priceUSD: Number(priceUSD),
      color,
      storage,
      ram,
      condition,
      batteryHealth: isBatteryNA || condition === 'NEW' ? null : Number(batteryHealth),
      defects: selectedDefects,
      missingItems: defaultIncludedOptions.filter((opt) => !selectedIncluded.includes(opt)),
      includedItems: selectedIncluded,
      imeiStatus,
      photos: finalPhotos,
      status: 'AVAILABLE',
      sellerName,
      sellerPhone,
      sellerTelegram,
      sellerLocation,
      notes,
      dateListed: new Date().toISOString(),
      views: 1,
      featured: false,
      gsmarena_url: customGsmArenaUrl.trim() || undefined,
    };

    onSaveListing(newListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.3)] my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#0D0714]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#FF2E93]" />
            <h3 className="text-xl font-black text-white">
              {t('postPhysicalListing')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
            id="close-add-listing-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Step 1: Model Selection & Price */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF2E93] flex items-center gap-1.5">
                <span>{t('step1Title')}</span>
              </h4>
              <span className="text-[11px] font-semibold text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded-full border border-[#00F0FF]/30">
                {filteredModels.length} {t('modelsCountLabel')}
              </span>
            </div>

            {/* Quick Brand Filter Chips */}
            <div>
              <label className="block text-[11px] font-bold text-[#C3B2D9] mb-1.5 uppercase tracking-wider">
                {t('selectBrand')}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-[#160B24]/60 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setSelectedBrandFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBrandFilter === 'ALL'
                      ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.5)]'
                      : 'bg-white/5 text-[#C3B2D9] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t('allBrands')} ({models.length})
                </button>
                {brandOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedBrandFilter === b
                        ? 'bg-[#FF2E93] text-white shadow-[0_0_10px_rgba(255,46,147,0.5)]'
                        : 'bg-white/5 text-[#C3B2D9] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {b} ({models.filter((m) => m.brand === b).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
              {/* Search Model Input */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1 uppercase tracking-wider">
                  {t('searchModelName')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 16 Pro Max, S25, ROG..."
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-sm font-semibold rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
                />
              </div>

              {/* Model Selector Dropdown */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1 uppercase tracking-wider">
                  {t('choosePhoneModel')} *
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-sm font-extrabold rounded-xl p-3 border border-[#FF2E93]/40 focus:border-[#FF2E93] focus:outline-none cursor-pointer"
                  id="add-listing-model-select"
                >
                  {filteredModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.brand} {m.modelName} ({m.releaseYear})
                    </option>
                  ))}
                  {filteredModels.length === 0 && (
                    <option value="" disabled>No models match search query</option>
                  )}
                </select>
              </div>

              {/* Asking Price Input */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1 uppercase tracking-wider">
                  {t('askingPriceUSD')} *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#FF2E93]" />
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(Number(e.target.value))}
                    required
                    className="w-full bg-[#160B24] text-white text-lg font-black rounded-xl pl-10 pr-3 py-2.5 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
                    id="add-listing-price-input"
                  />
                </div>
                <p className="text-[11px] text-[#00F0FF] mt-1 font-bold">
                  ≈ {formatPrice(priceUSD, 'UZS')}
                </p>
              </div>
            </div>

            {/* Selected Model Spec Preview Box */}
            {selectedModel && (
              <div className="bg-[#160B24]/80 p-3.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF2E93] font-bold text-sm">{selectedModel.brand} {selectedModel.modelName}</span>
                  <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] font-semibold">{selectedModel.releaseYear}</span>
                </div>
                <div className="text-[#C3B2D9] text-[11px] flex flex-wrap gap-3">
                  <span>⚙️ {selectedModel.chipset || 'High-performance CPU'}</span>
                  <span>📱 {selectedModel.displaySpecs || 'AMOLED Display'}</span>
                  <span>📷 {selectedModel.cameraSpecs || 'Advanced Camera'}</span>
                </div>
              </div>
            )}

            {/* Color, Storage, RAM selection */}
            {selectedModel && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#C3B2D9] mb-1">{t('colorVariant')}</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#160B24] text-white text-sm font-semibold rounded-xl p-3 border border-white/10 cursor-pointer"
                  >
                    {selectedModel.colorVariants.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C3B2D9] mb-1">{t('storageCapacity')}</label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full bg-[#160B24] text-white text-sm font-semibold rounded-xl p-3 border border-white/10 cursor-pointer"
                  >
                    {selectedModel.storageOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C3B2D9] mb-1">{t('ramMemory')}</label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full bg-[#160B24] text-white text-sm font-semibold rounded-xl p-3 border border-white/10 cursor-pointer"
                  >
                    {selectedModel.ramOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Physical Condition & Battery */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1.5">
              <span>{t('step2Title')}</span>
            </h4>

            {/* Condition Rating radio tabs */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-2">
                {t('conditionGrade')} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'NEW', label: `🟢 ${t('brandNewCondition')}`, desc: '100% Brand new factory seal' },
                  { id: 'LIKE_NEW', label: `🟡 ${t('likeNewCondition')}`, desc: 'Pristine, no scratch' },
                  { id: 'USED', label: `🟠 ${t('usedCondition')}`, desc: 'Normal light wear signs' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCondition(item.id as PhysicalCondition)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      condition === item.id
                        ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-white shadow-[0_0_12px_rgba(255,46,147,0.4)]'
                        : 'bg-white/5 border-white/10 text-[#C3B2D9] hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Health % Slider */}
            {condition !== 'NEW' && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#C3B2D9] flex items-center gap-1">
                    <BatteryCharging className="w-4 h-4 text-[#00F0FF]" />
                    <span>{t('batteryHealthPerc')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#C3B2D9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBatteryNA}
                      onChange={(e) => setIsBatteryNA(e.target.checked)}
                      className="accent-[#00F0FF]"
                    />
                    <span>N/A / Non-iOS</span>
                  </label>
                </div>

                {!isBatteryNA && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#00F0FF]">
                      <span>{batteryHealth}% Health</span>
                      <span>{batteryHealth && batteryHealth >= 90 ? 'Ideal' : 'Normal'}</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="100"
                      value={batteryHealth || 90}
                      onChange={(e) => setBatteryHealth(Number(e.target.value))}
                      className="w-full accent-[#00F0FF] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: IMEI Status & Defects */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <span>{t('step3Title')}</span>
            </h4>

            {/* IMEI Status selector */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-2">
                {t('imeiRegStatus')} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setImeiStatus('REGISTERED')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    imeiStatus === 'REGISTERED'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-[#C3B2D9]'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">✅ {t('officiallyRegistered')}</div>
                    <div className="text-[10px] text-emerald-400/80">UZIMEI pass verified</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setImeiStatus('NOT_REGISTERED')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    imeiStatus === 'NOT_REGISTERED'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-white/5 border-white/10 text-[#C3B2D9]'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">⚠️ {t('notRegistered')}</div>
                    <div className="text-[10px] text-amber-300/80">Passport duty open</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Defects Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-2">
                {t('defectsLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {defaultDefectOptions.map((def) => (
                  <button
                    key={def}
                    type="button"
                    onClick={() => toggleDefect(def)}
                    className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                      selectedDefects.includes(def)
                        ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-white'
                        : 'bg-white/5 border-white/10 text-[#C3B2D9]'
                    }`}
                  >
                    {selectedDefects.includes(def) ? '✓ ' : '+ '} {def}
                  </button>
                ))}
              </div>

              {/* Custom defect input */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add custom defect note..."
                  value={customDefect}
                  onChange={(e) => setCustomDefect(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-xs rounded-xl px-3 py-2 border border-white/10"
                />
                <button
                  type="button"
                  onClick={addCustomDefect}
                  className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Included Box Contents */}
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-2">
                {t('includedItemsLabel')}
              </label>
              <div className="flex flex-wrap gap-2">
                {defaultIncludedOptions.map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => toggleIncluded(inc)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedIncluded.includes(inc)
                        ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-white/5 border-white/10 text-[#C3B2D9]'
                    }`}
                  >
                    {selectedIncluded.includes(inc) ? '✓ ' : '+ '} {inc}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Step 4: Physical Device Photos (Upload & Download File) & Seller Details */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{t('step4Title')}</span>
              </h4>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct File Upload</span>
              </span>
            </div>

            {/* Direct Image File Drag & Drop Upload Zone */}
            <div>
              <label className="block text-xs font-bold text-[#C3B2D9] mb-1.5 uppercase tracking-wider">
                {t('uploadImageFiles')} *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#FF2E93] bg-[#FF2E93]/15 scale-[1.01]'
                    : 'border-white/20 bg-[#160B24]/80 hover:border-[#FF2E93]/60 hover:bg-[#160B24]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="phone-image-file-input"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2E93]/10 border border-[#FF2E93]/30 flex items-center justify-center text-[#FF2E93]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">
                      Click to Browse Image Files or Drag & Drop Here
                    </span>
                    <p className="text-xs text-[#C3B2D9] mt-0.5">
                      Upload photos directly from your computer or smartphone storage (no link required).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                    Select JPG, PNG or WEBP Files
                  </span>
                </div>
              </div>

              {/* Uploaded File Cards List */}
              {uploadedImageFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="block text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider">
                    Uploaded Photo Files ({uploadedImageFiles.length}):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uploadedImageFiles.map((file, idx) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2.5 bg-[#160B24] border border-white/10 rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={file.dataUrl}
                            alt={file.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/20"
                          />
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">{file.name}</div>
                            <div className="text-[10px] text-[#C3B2D9]">{file.size} • Photo #{idx + 1}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Download Image File Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImageFile(file.dataUrl, file.name);
                            }}
                            className="p-2 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                            title={t('downloadImageFile')}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </button>

                          {/* Delete/Remove Photo File */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUploadedFile(file.id);
                            }}
                            className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Web Image URL Fallback */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <details className="text-xs text-[#C3B2D9]">
                  <summary className="cursor-pointer font-semibold text-[#C3B2D9] hover:text-white">
                    Or paste external image web link / sample catalog photo
                  </summary>
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#160B24] text-white text-xs rounded-xl p-2.5 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
                    />
                    {selectedModel?.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrlInput(selectedModel.imageUrl)}
                        className="text-[11px] text-[#00F0FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>Use official sample catalog photo for {selectedModel.brand} {selectedModel.modelName}</span>
                      </button>
                    )}
                  </div>
                </details>
              </div>
            </div>

            {/* Seller Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('sellerStoreName')}</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('phoneNumber')}</label>
                <input
                  type="text"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">Telegram Username (@)</label>
                <input
                  type="text"
                  value={sellerTelegram}
                  onChange={(e) => setSellerTelegram(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('storeLocation')}</label>
                <input
                  type="text"
                  value={sellerLocation}
                  onChange={(e) => setSellerLocation(e.target.value)}
                  className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] mb-1">{t('additionalDesc')}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10"
              />
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#C3B2D9] hover:text-white text-xs font-semibold cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="neon-btn-pink px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              id="submit-listing-btn"
            >
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span>{t('publishListingBtn')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
