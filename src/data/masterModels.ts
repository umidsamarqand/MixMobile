import { PhoneModel } from '../types';
import { APPLE_MODELS } from './models/apple';
import { SAMSUNG_MODELS } from './models/samsung';
import { GOOGLE_MODELS } from './models/google';
import { XIAOMI_MODELS } from './models/xiaomi';
import { ONEPLUS_MODELS } from './models/oneplus';
import { OPPO_MODELS } from './models/oppo';
import { VIVO_MODELS } from './models/vivo';
import { HONOR_MODELS } from './models/honor';
import { HUAWEI_MODELS } from './models/huawei';
import { REALME_MODELS } from './models/realme';
import { REDMI_MODELS } from './models/redmi';
import { POCO_MODELS } from './models/poco';
import { OTHER_BRANDS_MODELS } from './models/otherBrands';

export const MASTER_PHONE_MODELS: PhoneModel[] = [
  ...APPLE_MODELS,
  ...SAMSUNG_MODELS,
  ...GOOGLE_MODELS,
  ...XIAOMI_MODELS,
  ...ONEPLUS_MODELS,
  ...OPPO_MODELS,
  ...VIVO_MODELS,
  ...HONOR_MODELS,
  ...HUAWEI_MODELS,
  ...REALME_MODELS,
  ...REDMI_MODELS,
  ...POCO_MODELS,
  ...OTHER_BRANDS_MODELS,
];

// Helper functions for brand & model queries
export const getAvailableBrands = (): string[] => {
  const brands = Array.from(new Set(MASTER_PHONE_MODELS.map((m) => m.brand)));
  return brands.sort((a, b) => a.localeCompare(b));
};

export const getModelsByBrand = (brand: string): PhoneModel[] => {
  if (!brand || brand.toLowerCase() === 'all') return MASTER_PHONE_MODELS;
  return MASTER_PHONE_MODELS.filter(
    (m) => m.brand.toLowerCase() === brand.toLowerCase()
  );
};
