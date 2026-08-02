import { PhoneModel, PhoneListing } from '../types';
import { MASTER_PHONE_MODELS } from './masterModels';

// Export the complete consolidated dataset of all phone models across all brands
export const INITIAL_MODELS: PhoneModel[] = MASTER_PHONE_MODELS;

// Export zero listings by default as requested (blank canvas for posting new listings)
export const INITIAL_LISTINGS: PhoneListing[] = [];
