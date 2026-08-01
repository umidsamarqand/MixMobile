import { Currency } from '../types';

export const USD_TO_UZS_RATE = 12800;

export function usdToUzs(usdAmount: number, rate = USD_TO_UZS_RATE): number {
  return Math.round(usdAmount * rate);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUZS(usdAmount: number, rate = USD_TO_UZS_RATE): string {
  const uzs = usdToUzs(usdAmount, rate);
  return new Intl.NumberFormat('ru-RU').format(uzs) + " so'm";
}

export function formatPrice(usdAmount: number, currency: Currency, rate = USD_TO_UZS_RATE): string {
  if (currency === 'UZS') {
    return formatUZS(usdAmount, rate);
  }
  return formatUSD(usdAmount);
}
