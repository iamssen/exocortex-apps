import type { Balances, KRW } from '@iamssen/exocortex';
import { useMemo } from 'react';
import { useQuotes } from './useQuotes.ts';

export type OtherCurrencyBalances = Balances & {
  symbol: string;
  krwAmount: KRW;
};

export function useOtherCurrenciesBalances(
  others: Record<string, Balances> = {},
): OtherCurrencyBalances[] {
  const symbols = useMemo(() => {
    return Object.keys(others);
  }, [others]);

  const quotes = useQuotes(symbols);

  return useMemo<OtherCurrencyBalances[]>(() => {
    return symbols
      .filter((symbol) => quotes.has(symbol))
      .map<OtherCurrencyBalances>((symbol) => {
        const balances = others[symbol];
        const krwAmount = (balances.totalAmount *
          quotes.get(symbol)!.price) as KRW;
        return {
          ...balances,
          krwAmount,
          symbol,
        };
      });
  }, [others, quotes, symbols]);
}
