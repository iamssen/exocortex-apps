import type {
  Iso8601,
  Quote,
  QuoteHistory,
  QuoteInfo,
  QuoteRecord,
  QuoteStatistics,
  Watch,
} from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryLineData,
  HistoryLineRecord,
  PriceLineData,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env.ts';

export interface QuoteChartData {
  history: HistoryLineData;
  price: PriceLineData | undefined;
  watches: PriceLineData[];

  axis: CartesianChartAxis;
}

export interface QuoteChartParams {
  info: QuoteInfo;
  history: QuoteHistory;

  quote: Quote | undefined;
  watch: Watch | undefined;
  statistic: QuoteStatistics | undefined;

  start: Iso8601;
  end?: Iso8601;
}

export function createQuoteChartData({
  info,
  history,
  quote,
  watch,
  statistic,
  start,
  end,
}: QuoteChartParams): QuoteChartData {
  const historyRecords = history.records
    .slice(findStart(history.records, start))
    .map<HistoryLineRecord>(({ date, high, low, close }) => {
      return {
        date,
        timestamp: new Date(date).getTime(),
        low,
        high,
        value: close,
      };
    });

  const watches = pickWatch(info.currency, watch, quote, statistic);

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = Math.min(
    ...historyRecords.map(({ low, value }) => low ?? value),
    ...pickQuote(quote),
    ...watches.map(({ price }) => price),
  );
  const ymax = Math.max(
    ...historyRecords.map(({ high, value }) => high ?? value),
    ...pickQuote(quote),
    ...watches.map(({ price }) => price),
  );

  return {
    history: {
      formatString: info.currency,
      records: [historyRecords],
    },
    price: quote
      ? {
          formatString: quote.currency,
          price: quote.price,
        }
      : undefined,
    watches,
    axis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: ymin * chartAxis.YMIN,
        max: ymax * chartAxis.YMAX,
      },
    },
  };
}

function pickQuote(quote: Quote | undefined): number[] {
  return quote ? [quote.price] : [];
}

function pickWatch(
  formatString: string,
  watch: Watch | undefined,
  _quote: Quote | undefined,
  statistic: QuoteStatistics | undefined,
): PriceLineData[] {
  const result: PriceLineData[] = [];

  if (!watch) {
    return result;
  }

  for (const w of watch) {
    if ('high_price' in w) {
      result.push({
        formatString: formatString,
        price: w.high_price,
        watchFor: 'high',
      });
    } else if ('low_price' in w) {
      result.push({
        formatString: formatString,
        price: w.low_price,
        watchFor: 'low',
      });
    } else if ('high_pe' in w) {
      if (
        typeof statistic?.epsTrailingTwelveMonths === 'number' &&
        statistic.epsTrailingTwelveMonths > 0
      ) {
        result.push({
          formatString: formatString,
          price: w.high_pe * statistic.epsTrailingTwelveMonths,
          watchFor: 'high',
        });
      }
    } else if ('low_pe' in w) {
      if (
        typeof statistic?.epsTrailingTwelveMonths === 'number' &&
        statistic.epsTrailingTwelveMonths > 0
      ) {
        result.push({
          formatString: formatString,
          price: w.low_pe * statistic.epsTrailingTwelveMonths,
          watchFor: 'low',
        });
      }
    } else if ('high_52week' in w) {
      if (statistic?.fiftyTwoWeekRange) {
        result.push({
          formatString: formatString,
          price: w.high_52week * statistic.fiftyTwoWeekRange.high,
          watchFor: 'high',
        });
      }
    } else if ('low_52week' in w) {
      if (statistic?.fiftyTwoWeekRange) {
        result.push({
          formatString: formatString,
          price: w.low_52week * statistic.fiftyTwoWeekRange.low,
          watchFor: 'low',
        });
      }
    }
  }

  return result;
}

const findStart = findStartIndex<QuoteRecord>(({ date }) =>
  DateTime.fromISO(date),
);
