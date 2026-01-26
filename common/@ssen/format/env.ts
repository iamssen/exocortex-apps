export type CurrencyType = 'USD' | 'KRW' | 'JPY' | 'KRW=X' | 'JPYKRW=X';

export const currencySymbols: Record<CurrencyType, string> = {
  'USD': '$ ',
  'KRW=X': '$ ',
  'KRW': '₩ ',
  'JPY': '¥ ',
  'JPYKRW=X': '¥ ',
};
