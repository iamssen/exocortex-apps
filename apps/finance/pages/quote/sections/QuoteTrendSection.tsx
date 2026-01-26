import type { Iso8601, QuoteHistory } from '@iamssen/exocortex';
import { useQueries } from '@tanstack/react-query';
import type { QuoteTrendChartProps } from '@ui/charts';
import { QuoteTrendChart } from '@ui/charts';
import { api } from '@ui/query';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';

export interface TrendComparingQuote {
  symbol: string;
  style: CSSProperties;
}

export interface QuoteTrendSectionProps {
  historyData: QuoteHistory | undefined;

  comparingQuotes?: TrendComparingQuote[];

  zeroResetDates?: Iso8601[];
  start: Iso8601;
}

export function QuoteTrendSection({
  historyData,
  comparingQuotes = [],
  zeroResetDates,
  start,
}: QuoteTrendSectionProps): ReactNode {
  const comparingQuoteHistoryDatas = useQueries({
    queries: comparingQuotes.map(({ symbol }) =>
      api(`finance/quote-history/${symbol}`),
    ),
  });

  const chartProps = useMemo<
    Pick<QuoteTrendChartProps, 'histories' | 'historyLineStyles'> | undefined
  >(() => {
    if (!historyData) {
      return undefined;
    }

    const histories: QuoteHistory[] = [];
    const historyLineStyles: CSSProperties[] = [];

    let i: number = -1;
    const max: number = comparingQuotes.length;
    while (++i < max) {
      const { style } = comparingQuotes[i];
      const { data } = comparingQuoteHistoryDatas[i];

      if (data) {
        histories.push(data);
        historyLineStyles.push(style);
      }
    }

    histories.push(historyData);
    historyLineStyles.push({});

    return { histories, historyLineStyles };
  }, [comparingQuoteHistoryDatas, comparingQuotes, historyData]);

  if (!chartProps) {
    return null;
  }

  return (
    <QuoteTrendChart
      {...chartProps}
      zeroResetDates={zeroResetDates}
      start={start}
      style={{
        marginTop: 10,
        width: '100%',
        height: 'max(20vh, 250px)',
      }}
    />
  );
}
