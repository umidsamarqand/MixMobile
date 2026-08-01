export type PhysicalCondition = 'NEW' | 'LIKE_NEW' | 'USED';

export type IMEIStatus = 'REGISTERED' | 'NOT_REGISTERED';

export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export type Currency = 'USD' | 'UZS';

export type Language = 'uz' | 'ru' | 'en';

export interface PhoneModel {
  id: string;
  brand: string; // e.g., Apple, Samsung, Xiaomi, Google
  modelName: string; // e.g., iPhone 15 Pro Max
  colorVariants: string[];
  storageOptions: string[]; // e.g., ['128GB', '256GB', '512GB', '1TB']
  ramOptions: string[]; // e.g., ['8GB', '12GB', '16GB']
  displaySpecs: string; // e.g. "6.7 inch Super Retina XDR OLED 120Hz"
  chipset: string; // e.g. "Apple A17 Pro (3nm)"
  cameraSpecs: string; // e.g. "48MP Main + 12MP Telephoto 5x + 12MP UltraWide"
  batterySpecs: string; // e.g. "4422 mAh"
  releaseYear: number;
  overview: string; // General model overview & buying advice written by admin
  pros: string[];
  cons: string[];
  recommendedFor: string; // e.g. "Power users & Mobile Photography Enthusiasts"
  imageUrl?: string;
  gsmarena_url?: string;
}

export interface PhoneListing {
  id: string;
  modelId: string; // Linked to PhoneModel.id
  title?: string;
  priceUSD: number;
  priceUZS?: number; // Calculated or custom
  color: string;
  storage: string;
  ram: string;
  condition: PhysicalCondition;
  batteryHealth: number | null; // e.g. 98, or null if N/A / New
  defects: string[]; // e.g. ["Screen micro-scratches", "Face ID inactive", "None"]
  missingItems: string[]; // e.g. ["Adapter missing", "Original Cable missing"]
  includedItems: string[]; // e.g. ["Original Box", "Case", "Fast Charger"]
  imeiStatus: IMEIStatus;
  photos: string[];
  status: ListingStatus;
  sellerName: string;
  sellerPhone: string;
  sellerTelegram: string;
  sellerLocation: string; // e.g. "Tashkent, Chorsu Mobile Mall" / "Samarkand"
  notes?: string;
  dateListed: string; // ISO string
  views: number;
  featured?: boolean;
  gsmarena_url?: string;
}

export interface FilterState {
  searchQuery: string;
  brand: string;
  modelId: string;
  condition: string; // 'ALL' | PhysicalCondition
  imeiStatus: string; // 'ALL' | IMEIStatus
  minPrice: number;
  maxPrice: number;
  minBatteryHealth: number;
  storage: string;
  sortBy: 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'BATTERY_DESC' | 'VIEWS';
}
