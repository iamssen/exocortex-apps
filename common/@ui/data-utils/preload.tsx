import type { AnalyzedQuoteInfo } from '@iamssen/exocortex';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { PreloadDataContext } from './preload.context.ts';

export interface PreloadDataProviderProps {
  children: ReactNode;
}

const cache = new Map<string, AnalyzedQuoteInfo>();

export function PreloadDataProvider({
  children,
}: PreloadDataProviderProps): ReactNode {
  const { data: quotes } = useQuery(api('finance/quotes'));

  const getQuoteInfo = useCallback(
    (symbol: string) => {
      if (!quotes) {
        throw new Error(`Do not call this function before load quotes data`);
      }

      const i = quotes.yahooSymbols[symbol];

      if (typeof i !== 'number') {
        throw new Error(`Can't find QuoteInfo of "${symbol}"`);
      }

      const result = { ...quotes.quotes[i]!, portfolio: quotes.trades[symbol] };

      cache.set(symbol, result);

      return result;
    },
    [quotes],
  );

  if (!quotes) {
    return null;
  }

  return (
    <PreloadDataContext.Provider value={{ quotes, getQuoteInfo }}>
      {children}
    </PreloadDataContext.Provider>
  );
}
