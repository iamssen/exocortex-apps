import type { Quote } from '@iamssen/exocortex';
import { useQueries } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';

export function useQuotes(symbols: string[]): Map<string, Quote> {
  const queries = useMemo(() => {
    return symbols.map((symbol) => api(`finance/quote/${symbol}`));
  }, [symbols]);

  const quoteDatas = useQueries({ queries });

  return useMemo(() => {
    return quoteDatas.reduce((map, { data }) => {
      if (data) {
        map.set(data.symbol, data);
      }
      return map;
    }, new Map<string, Quote>());
  }, [quoteDatas]);
}
