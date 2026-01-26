import type { Iso8601, Ratio } from '@iamssen/exocortex';
import { useQuery } from '@tanstack/react-query';
import type { PriceLineData } from '@ui/cartesian-chart';
import { PeChart } from '@ui/charts';
import { api } from '@ui/query';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

export interface EquityValueHistorySectionProps {
  symbol: string;
  currentPe?: Ratio;
  start: Iso8601;
}

const EMPTY_WATCHES = [] as PriceLineData[];

export function EquityValueHistorySection({
  symbol,
  currentPe,
  start,
}: EquityValueHistorySectionProps): ReactNode {
  const { data: historyData } = useQuery(
    api(`finance/equity-value-history/${symbol}`),
  );

  const { data: dataBenchmark } = useQuery(api('finance/sp500-pe'));

  const { data: portfolio } = useQuery(api('portfolio'));

  const data = useMemo(() => {
    if (!historyData?.records || historyData.records.length === 0) {
      return undefined;
    }

    let draft = historyData.records.map(({ date, trailingPE }) => ({
      date,
      value: trailingPE,
    }));

    if (typeof currentPe === 'number') {
      const today = DateTime.now().toISODate() as Iso8601;

      draft = draft.filter(({ date }) => date !== today);

      draft.push({
        date: today,
        value: currentPe as Ratio,
      });
    }

    return draft;
  }, [currentPe, historyData]);

  const watches = useMemo(() => {
    const watch = portfolio?.watches[symbol];

    return watch
      ?.map<PriceLineData | undefined>((w) => {
        if ('high_pe' in w) {
          return {
            price: w.high_pe,
            watchFor: 'high',
          };
        } else if ('low_pe' in w) {
          return {
            price: w.low_pe,
            watchFor: 'low',
          };
        } else {
          return undefined;
        }
      })
      .filter((price) => !!price);
  }, [portfolio?.watches, symbol]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <PeChart
      data={data}
      benchmarkData={dataBenchmark}
      watches={watches ?? EMPTY_WATCHES}
      start={start}
      style={{
        marginTop: 10,
        width: '100%',
        height: 'max(20vh, 150px)',
      }}
    />
  );
}
