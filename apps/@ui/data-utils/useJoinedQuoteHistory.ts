import type { JoinedQuoteHistory } from '@iamssen/exocortex';
import { joinQuoteHistoryAndQuote } from '@iamssen/exocortex/projector';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';

export function useJoinedQuoteHistory(
  symbol: string | undefined,
): JoinedQuoteHistory | undefined {
  const { data: quoteData } = useQuery(api(`finance/quote/${symbol}`));
  const { data: quoteHistoryData } = useQuery(
    api(`finance/quote-history/${symbol}`),
  );

  return useMemo(() => {
    if (!quoteHistoryData) {
      return undefined;
    }

    return joinQuoteHistoryAndQuote(quoteHistoryData, quoteData);
  }, [quoteData, quoteHistoryData]);
}
