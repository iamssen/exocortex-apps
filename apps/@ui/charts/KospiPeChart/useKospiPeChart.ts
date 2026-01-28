import type { Iso8601 } from '@iamssen/exocortex';
import { useQuery } from '@tanstack/react-query';
import type { PriceLineData } from '@ui/cartesian-chart';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { KospiPeChartData } from './data.ts';
import { createKospiPeChartData } from './data.ts';

export function useKospiPeChart(
  watches: PriceLineData[],
  start: Iso8601,
  end?: Iso8601,
): KospiPeChartData | undefined {
  const { data } = useQuery(api('finance/kospi-pe'));

  return useMemo(() => {
    if (!data) {
      return undefined;
    }

    return createKospiPeChartData({
      data,
      watches,
      start,
      end,
    });
  }, [data, end, start, watches]);
}
