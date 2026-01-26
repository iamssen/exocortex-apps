import type { QuoteStatistics } from '@iamssen/exocortex';
import { useQueries } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';

export function useQuoteStatistics(
  symbols: string[],
): Map<string, QuoteStatistics> {
  const queries = useMemo(() => {
    return symbols.map((symbol) => api(`finance/quote-statistics/${symbol}`));
  }, [symbols]);

  const quoteDatas = useQueries({ queries });

  return useMemo(() => {
    return quoteDatas.reduce((map, { data }) => {
      if (data) {
        map.set(data.symbol, data);
      }
      return map;
    }, new Map<string, QuoteStatistics>());
  }, [quoteDatas]);
}
