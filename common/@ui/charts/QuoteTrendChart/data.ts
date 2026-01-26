import type { Iso8601, QuoteHistory, QuoteRecord } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryLineData,
  HistoryLineRecord,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { bignumber } from 'mathjs';
import { chartAxis } from '../env.ts';

export interface QuoteTrendChartData {
  histories: HistoryLineData[];

  axis: CartesianChartAxis;
}

export interface QuoteTrendChartParams {
  histories: QuoteHistory[];

  zeroResetDates?: Iso8601[];

  start: Iso8601;
  end?: Iso8601;
}

export function createQuoteTrendChartData({
  histories: _histories,
  zeroResetDates,
  start,
  end,
}: QuoteTrendChartParams): QuoteTrendChartData {
  if (
    Array.isArray(zeroResetDates) &&
    new Date(zeroResetDates[0]).getTime() < new Date(start).getTime()
  ) {
    throw new Error(`zeroResetDates[0] can't less then start`);
  }

  const zeroResetTimes = [new Date(start).getTime()];

  if (zeroResetDates) {
    for (const z of zeroResetDates) {
      zeroResetTimes.push(new Date(z).getTime());
    }
  }

  const histories: HistoryLineData[] = _histories.map((h) => {
    const historyRecords = h.records
      .slice(findStart(h.records, start))
      .map<HistoryLineRecord>(({ date, close }) => {
        return {
          date,
          timestamp: new Date(date).getTime(),
          value: close,
        };
      });

    const trendRecords = createTrendRecords(historyRecords, zeroResetTimes);

    return {
      records: trendRecords,
      formatString: undefined,
    };
  });

  const recordValues = histories
    .flatMap((h) => h.records)
    .flat()
    .map((h) => h.value);

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = Math.min(...recordValues);
  const ymax = Math.max(...recordValues);
  const y = Math.max(Math.abs(ymin), Math.abs(ymax));

  return {
    histories,
    axis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: -y * chartAxis.YMIN,
        max: y * chartAxis.YMAX,
      },
    },
  };
}

export function createTrendRecords(
  records: HistoryLineRecord[],
  zeroResetTimes: number[],
): HistoryLineRecord[][] {
  let z = 0;
  let r: HistoryLineRecord[] = [];
  let baseRecord = records[0];

  const result: HistoryLineRecord[][] = [r];

  let i: number = -1;
  const max: number = records.length;
  while (++i < max) {
    const zeroResetTime = zeroResetTimes[z];
    const record = records[i];
    const timestamp = Math.max(zeroResetTime, record.timestamp);

    r.push({
      date: DateTime.fromMillis(timestamp).toISODate() as Iso8601,
      timestamp,
      value: bignumber(record.value)
        .div(baseRecord.value)
        .minus(bignumber(1))
        .toNumber(),
    });

    if (z + 1 < zeroResetTimes.length) {
      const nextRecord = records[i + 1];
      const nextZeroResetTime = zeroResetTimes[z + 1];

      if (nextRecord.timestamp >= nextZeroResetTime) {
        z = z + 1;
        r = [];
        baseRecord = nextRecord;

        result.push(r);
      }
    }
  }

  return result;
}

const findStart = findStartIndex<QuoteRecord>(({ date }) =>
  DateTime.fromISO(date),
);
