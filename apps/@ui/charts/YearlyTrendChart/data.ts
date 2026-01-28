import type { Iso8601, QuoteHistory, QuoteInfo } from '@iamssen/exocortex';
import type { CartesianChartAxis, HistoryLineData } from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { bignumber } from 'mathjs';
import { chartAxis } from '../env.ts';
import { FAKE_YEAR } from './env.ts';

export interface YearlyTrendChartHistoryLineData extends HistoryLineData {
  originYear: number;
  startValue: number;
}

export interface YearlyTrendChartData {
  histories: YearlyTrendChartHistoryLineData[];

  axis: CartesianChartAxis;
}

export interface QuoteYearlyTrendChartParams {
  info: QuoteInfo;
  history: QuoteHistory;
}

export function createQuoteYearlyTrendChartData({
  history,
  info,
}: QuoteYearlyTrendChartParams): YearlyTrendChartData {
  const historyMap = new Map<number, YearlyTrendChartHistoryLineData>();

  let i: number = -1;
  const max: number = history.records.length;
  while (++i < max) {
    const { date, close } = history.records[i];
    const d = DateTime.fromISO(date);

    // ignore leap year
    if (d.month === 2 && d.day === 29) {
      continue;
    }

    if (!historyMap.has(d.year)) {
      historyMap.set(d.year, {
        records: [[]],
        originYear: d.year,
        formatString: info.currency,
        startValue: close,
      });
    }

    const h = historyMap.get(d.year)!;
    const fakeDate = `${FAKE_YEAR}-${d.toFormat('MM-dd')}`;

    h.records[0].push({
      date: fakeDate as Iso8601,
      timestamp: new Date(fakeDate).getTime(),
      value: bignumber(close).div(h.startValue).minus(bignumber(1)).toNumber(),
    });
  }

  const histories = [...historyMap.values()].toSorted(
    (a, b) => a.originYear - b.originYear,
  );
  const values = histories
    .flatMap(({ records }) => records[0])
    .map(({ value }) => value);

  const xmin = DateTime.fromISO(`${FAKE_YEAR}-01-01`)
    .startOf('year')
    .toMillis();
  const xmax = DateTime.fromISO(`${FAKE_YEAR}-01-01`).endOf('year').toMillis();
  const ymin = Math.min(...values, -0.1);
  const ymax = Math.max(...values, 0.1);

  return {
    histories,
    axis: {
      x: {
        min: xmin,
        max: xmax,
      },
      y: {
        min: ymin * chartAxis.YMIN,
        max: ymax * chartAxis.YMAX,
      },
    },
  };
}
