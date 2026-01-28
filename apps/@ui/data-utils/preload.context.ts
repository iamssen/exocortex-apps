import type { AnalyzedQuoteInfo, QuoteInfoIndex } from '@iamssen/exocortex';
import type { Context } from 'react';
import { createContext, useContext } from 'react';

export interface PreloadData {
  quotes: QuoteInfoIndex;
  getQuoteInfo: (symbol: string) => AnalyzedQuoteInfo;
}

export const PreloadDataContext: Context<PreloadData> =
  createContext<PreloadData>(null!);

export function usePreloadData(): PreloadData {
  return useContext(PreloadDataContext);
}
