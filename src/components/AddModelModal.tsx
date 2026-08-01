import React, { useState } from 'react';
import { X, Database, Award, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { PhoneModel } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AddModelModalProps {
  existingModels: PhoneModel[];
  onSaveModel: (model: PhoneModel) => void;
  onClose: () => void;
}

export const AddModelModal: React.FC<AddModelModalProps> = ({
  existingModels,
  onSaveModel,
  onClose,
}) => {
  const { t } = useLanguage();
  const existingBrands = Array.from(new Set(existingModels.map((m) => m.brand)));

  const [brand, setBrand] = useState(existingBrands[0] || 'Apple');
  const [customBrand, setCustomBrand] = useState('');
  const [useCustomBrand, setUseCustomBrand] = useState(false);

  const [modelName, setModelName] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(2024);
  const [colorVariants, setColorVariants] = useState('Black, Titanium Gray, Silver, Blue');
  const [storageOptions, setStorageOptions] = useState('128GB, 256GB, 512GB, 1TB');
  const [ramOptions, setRamOptions] = useState('8GB, 12GB');

  const [displaySpecs, setDisplaySpecs] = useState('6.7" OLED 120Hz LTPO');
  const [chipset, setChipset] = useState('Flagship Octa-core Processor');
  const [cameraSpecs, setCameraSpecs] = useState('50MP Main (OIS) + Telephoto + Ultrawide');
  const [batterySpecs, setBatterySpecs] = useState('5000 mAh (45W Fast Charge)');

  const [overview, setOverview] = useState('');
  const [prosText, setProsText] = useState('High resolution display, Exceptional build quality, Great battery life');
  const [consText, setConsText] = useState('High initial price tag, Heavy weight');
  const [recommendedFor, setRecommendedFor] = useState('Power users, gamers, and mobile photography enthusiasts');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  const [gsmarenaUrl, setGsmarenaUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = useCustomBrand ? customBrand.trim() : brand;
    if (!finalBrand || !modelName.trim()) {
      alert('Please fill in Brand and Model Name');
      return;
    }

    const newModel: PhoneModel = {
      id: `m-${Date.now()}`,
      brand: finalBrand,
      modelName: modelName.trim(),
      colorVariants: colorVariants.split(',').map((s) => s.trim()).filter(Boolean),
      storageOptions: storageOptions.split(',').map((s) => s.trim()).filter(Boolean),
      ramOptions: ramOptions.split(',').map((s) => s.trim()).filter(Boolean),
      displaySpecs,
      chipset,
      cameraSpecs,
      batterySpecs,
      releaseYear: Number(releaseYear),
      overview: overview || `Official catalog entry for ${finalBrand} ${modelName}. Premium build quality and reliable performance.`,
      pros: prosText.split(',').map((s) => s.trim()).filter(Boolean),
      cons: consText.split(',').map((s) => s.trim()).filter(Boolean),
      recommendedFor,
      imageUrl: imageUrl.trim() || undefined,
      gsmarena_url: gsmarenaUrl.trim() || undefined,
    };

    onSaveModel(newModel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-[#FF2E93]/40 shadow-[0_0_50px_rgba(255,46,147,0.3)] my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#0D0714]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#FF2E93]" />
            <h3 className="text-xl font-black text-white">
              {t('addModelModalTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-[#FF2E93] text-[#C3B2D9] hover:text-white transition-all cursor-pointer"
            id="close-add-model-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Brand & Model Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                {t('brand')}
              </label>
              {!useCustomBrand ? (
                <div className="flex items-center gap-2">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none cursor-pointer"
                    id="add-model-brand-select"
                  >
                    {existingBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setUseCustomBrand(true)}
                    className="px-3 py-3 rounded-xl bg-white/5 text-xs font-bold text-[#00F0FF] hover:bg-white/10 shrink-0 cursor-pointer"
                  >
                    + New
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Nothing, Asus, Vivo"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setUseCustomBrand(false)}
                    className="px-3 py-3 rounded-xl bg-white/5 text-xs font-bold text-[#C3B2D9] hover:bg-white/10 shrink-0 cursor-pointer"
                  >
                    List
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                {t('modelName')}
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone 16 Pro Max, Galaxy S25"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
                id="add-model-name-input"
              />
            </div>

          </div>

          {/* Variants Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                Storage Options (comma separated)
              </label>
              <input
                type="text"
                value={storageOptions}
                onChange={(e) => setStorageOptions(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                Color Variants (comma separated)
              </label>
              <input
                type="text"
                value={colorVariants}
                onChange={(e) => setColorVariants(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>
          </div>

          {/* Editorial Buying Guide Overview */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#FF2E93] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF2E93]" />
              <span>{t('overviewText')}</span>
            </label>
            <textarea
              rows={3}
              placeholder="Write a dedicated description explaining whether this model is recommended, key selling points, and market position..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none leading-relaxed"
              id="add-model-overview-input"
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t('prosText')}</span>
              </label>
              <input
                type="text"
                value={prosText}
                onChange={(e) => setProsText(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{t('consText')}</span>
              </label>
              <input
                type="text"
                value={consText}
                onChange={(e) => setConsText(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                {t('chipsetSpecs')}
              </label>
              <input
                type="text"
                value={chipset}
                onChange={(e) => setChipset(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
                {t('displaySpecs')}
              </label>
              <input
                type="text"
                value={displaySpecs}
                onChange={(e) => setDisplaySpecs(e.target.value)}
                className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-[#C3B2D9] uppercase tracking-wider mb-1">
              Model Photo URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#160B24] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-[#FF2E93] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
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
              id="submit-model-btn"
            >
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span>{t('saveModelBtn')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
