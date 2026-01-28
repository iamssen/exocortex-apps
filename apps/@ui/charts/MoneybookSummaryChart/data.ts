import type { PortfolioSummaries, PortfolioSummary } from '@iamssen/exocortex';
import type { Iso8601 } from '@iamssen/exocortex';
import type {
  CartesianChartAxis,
  StackedHistoryAreaData,
  StackedHistoryAreaRecord,
} from '@ui/cartesian-chart';
import type { CSSProperties } from 'react';
import { chartAxis } from '../env.ts';

export interface MoneybookSummaryChartData {
  history: StackedHistoryAreaData;

  latest: StackedHistoryAreaRecord | undefined;
  first: StackedHistoryAreaRecord | undefined;

  axis: CartesianChartAxis;
}

export interface MoneybookSummaryChartQuery {
  name: string;
  value: (d: PortfolioSummary) => number;
  style: CSSProperties;
}

export interface MoneybookSummaryChartParams {
  data: PortfolioSummaries;
  queries: MoneybookSummaryChartQuery[];

  start?: Iso8601;
  end?: Iso8601;
}

export function createMoneybookSummaryChart({
  data,
  queries,
  start,
  end,
}: MoneybookSummaryChartParams): MoneybookSummaryChartData {
  const historyDates = createDates(data, start).toSorted(
    (a, b) => a.timestamp - b.timestamp,
  );

  const historyRecords = historyDates.map<StackedHistoryAreaRecord>(
    ({ date, timestamp }) => {
      const values = queries.map((q) => q.value(data[date]));
      const stackedValues = values.reduce((stacked, v) => {
        stacked.push((stacked.at(-1) ?? 0) + v);
        return stacked;
      }, [] as number[]);

      return {
        date,
        timestamp,
        values,
        stackedValues,
      };
    },
  );

  const xmin = new Date(start ?? historyDates[0].date).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = 0;
  const ymax = Math.max(
    ...historyRecords.map(({ stackedValues }) => stackedValues.at(-1) ?? 0),
  );

  return {
    history: {
      records: historyRecords,
      styles: queries.map(({ style }) => style),
    },
    first: historyRecords[0],
    latest: historyRecords.at(-1),
    axis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: ymin * chartAxis.YMIN,
        max: ymax * (chartAxis.YMAX * 1.1),
      },
    },
  };
}

function createDates(data: PortfolioSummaries, start: Iso8601 | undefined) {
  const result = Object.keys(data).map(
    (date) =>
      ({
        date: date as Iso8601,
        timestamp: new Date(date).getTime(),
      }) as Pick<StackedHistoryAreaRecord, 'date' | 'timestamp'>,
  );

  if (start) {
    const startTimestamp = new Date(start).getTime();
    return result.filter(({ timestamp }) => timestamp >= startTimestamp);
  }

  return result;
}
