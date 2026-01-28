import type { AnalyzedQuoteInfo } from '@iamssen/exocortex';
import { useMemo } from 'react';
import { usePreloadData } from './preload.context.ts';

export function useQuoteInfo(symbol: string): AnalyzedQuoteInfo {
  const { getQuoteInfo } = usePreloadData();
  return useMemo(() => getQuoteInfo(symbol), [getQuoteInfo, symbol]);
}
