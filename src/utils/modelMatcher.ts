import { PhoneModel } from '../types';
import { MASTER_PHONE_MODELS } from '../data/masterModels';

export interface MatchResult {
  exactMatch: PhoneModel | null;
  suggestions: PhoneModel[];
  normalizedInput: string;
}

/**
 * Normalizes a model string for fuzzy matching (removes symbols, extra spaces, lowercase).
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/apple|samsung|google|xiaomi|oneplus|oppo|vivo|honor|huawei|realme|redmi|poco|asus|motorola|sony|infinix|tecno|zte/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Finds exact or best matched phone model from the master dataset.
 */
export function findBestModelMatch(
  inputModelName: string,
  selectedBrand?: string
): MatchResult {
  if (!inputModelName.trim()) {
    return { exactMatch: null, suggestions: [], normalizedInput: '' };
  }

  const query = inputModelName.trim();
  const cleanQuery = normalizeString(query);

  let pool = MASTER_PHONE_MODELS;
  if (selectedBrand && selectedBrand.toLowerCase() !== 'all') {
    pool = pool.filter(
      (m) => m.brand.toLowerCase() === selectedBrand.toLowerCase()
    );
  }

  // 1. Direct case-insensitive match on full model name
  const exactDirect = pool.find(
    (m) => m.modelName.toLowerCase() === query.toLowerCase()
  );
  if (exactDirect) {
    return { exactMatch: exactDirect, suggestions: [exactDirect], normalizedInput: cleanQuery };
  }

  // 2. Direct normalized match
  const exactNormalized = pool.find(
    (m) => normalizeString(m.modelName) === cleanQuery
  );
  if (exactNormalized) {
    return { exactMatch: exactNormalized, suggestions: [exactNormalized], normalizedInput: cleanQuery };
  }

  // 3. Substring & fuzzy matches
  const suggestions = pool.filter((m) => {
    const full = `${m.brand} ${m.modelName}`.toLowerCase();
    const cleanFull = normalizeString(full);
    const cleanModel = normalizeString(m.modelName);

    return (
      full.includes(query.toLowerCase()) ||
      cleanFull.includes(cleanQuery) ||
      cleanModel.includes(cleanQuery) ||
      cleanQuery.includes(cleanModel)
    );
  });

  return {
    exactMatch: suggestions.length === 1 ? suggestions[0] : null,
    suggestions: suggestions.slice(0, 5),
    normalizedInput: cleanQuery,
  };
}

/**
 * Formats a post in the strict standardized format required by Marketplace rules:
 * - [Brand Name]
 * - [Official Model Name]
 * - [Storage / RAM Options]
 * - [Condition / Description]
 */
export function formatStandardizedListingPost(params: {
  brand: string;
  modelName: string;
  storage?: string;
  ram?: string;
  color?: string;
  condition: string;
  priceUSD: number;
  description?: string;
}): string {
  const lines = [
    `📱 BRAND: ${params.brand}`,
    `✨ MODEL: ${params.modelName}`,
    `💾 STORAGE / RAM: ${params.storage || 'Standard'} ${params.ram ? `/ ${params.ram}` : ''}`,
    `🎨 COLOR: ${params.color || 'Standard'}`,
    `⭐️ CONDITION: ${params.condition}`,
    `💵 PRICE: $${params.priceUSD}`,
  ];

  if (params.description) {
    lines.push(`📝 DESCRIPTION: ${params.description}`);
  }

  return lines.join('\n');
}
