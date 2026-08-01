import { PhoneModel, PhoneListing } from '../types';
import { INITIAL_MODELS, INITIAL_LISTINGS } from '../data/initialData';

const MODELS_KEY = 'mix_mobile_models_v1';
const LISTINGS_KEY = 'mix_mobile_listings_v1';

export function getStoredModels(): PhoneModel[] {
  try {
    const raw = localStorage.getItem(MODELS_KEY);
    if (!raw) {
      localStorage.setItem(MODELS_KEY, JSON.stringify(INITIAL_MODELS));
      return INITIAL_MODELS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MODELS;
  } catch (e) {
    console.error('Failed to load models from storage', e);
    return INITIAL_MODELS;
  }
}

export function saveModels(models: PhoneModel[]): void {
  try {
    localStorage.setItem(MODELS_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Failed to save models', e);
  }
}

export function getStoredListings(): PhoneListing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (!raw) {
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LISTINGS;
  } catch (e) {
    console.error('Failed to load listings from storage', e);
    return INITIAL_LISTINGS;
  }
}

export function saveListings(listings: PhoneListing[]): void {
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed to save listings', e);
  }
}

export function resetToSeedData(): { models: PhoneModel[]; listings: PhoneListing[] } {
  try {
    localStorage.setItem(MODELS_KEY, JSON.stringify(INITIAL_MODELS));
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
  } catch (e) {
    console.error('Error resetting seed data', e);
  }
  return { models: INITIAL_MODELS, listings: INITIAL_LISTINGS };
}
