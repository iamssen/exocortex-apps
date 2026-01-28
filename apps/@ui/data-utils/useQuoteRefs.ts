import type { Link } from '@iamssen/exocortex';
import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import { useMemo } from 'react';

const matchFunction = (symbol: string) => (match: string) => {
  return match === '*' || match === symbol;
};

export function useQuoteRefs(symbol: string): Link[] {
  const { data } = useQuery(api('refs'));

  return useMemo(() => {
    const fn = matchFunction(symbol);
    return data?.filter((link) => link.matches?.some(fn)) ?? [];
  }, [data, symbol]);
}
