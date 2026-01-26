import type { DV, Iso8601 } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryLineData,
  HistoryLineRecord,
  PriceLineData,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env.ts';

export interface BenchmarkChartData {
  history: HistoryLineData;
  price: PriceLineData | undefined;
  watches: PriceLineData[];

  axis: CartesianChartAxis;
}

export interface BenchmarkChartParams {
  formatString: string | undefined;
  formatReplacer?: string;

  data: DV<number>[];
  watches: PriceLineData[];

  start: Iso8601;
  end?: Iso8601;
}

export function createBenchmarkChartData({
  formatString,
  formatReplacer,
  data,
  watches,
  start,
  end,
}: BenchmarkChartParams): BenchmarkChartData {
  const historyRecords = data
    .slice(findStart(data, start))
    .map<HistoryLineRecord>(({ date, value }) => {
      return {
        date,
        timestamp: new Date(date).getTime(),
        value,
      };
    });

  const values = [
    ...historyRecords.map(({ value }) => value),
    ...watches.map(({ price }) => price),
  ];

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = Math.min(...values);
  const ymax = Math.max(...values);

  const lastRecord = historyRecords.at(-1);

  if (!lastRecord) {
    throw new Error('historyRecords must not be empty');
  }

  return {
    history: {
      formatString,
      formatReplacer,
      records: [historyRecords],
    },
    price: {
      formatString,
      formatReplacer,
      price: lastRecord.value,
    },
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

const findStart = findStartIndex<DV<number>>(({ date }) =>
  DateTime.fromISO(date),
);
