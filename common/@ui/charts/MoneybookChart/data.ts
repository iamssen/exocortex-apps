import type { AggregatedMoneybook, ASC, Iso8601 } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  StackedHistoryBarData,
  StackedHistoryBarRecord,
  StackedHistoryBarValue,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import type { CSSProperties } from 'react';
import { chartAxis } from '../env.ts';

export interface MoneybookChartData {
  history: StackedHistoryBarData;
  latest: AggregatedMoneybook | undefined;

  axis: CartesianChartAxis;
}

export interface MoneybookChartQuery {
  name: string;
  match: (category: string) => boolean;
  style: CSSProperties;
}

export interface MoneybookChartParams {
  data: ASC<AggregatedMoneybook>;
  queries: MoneybookChartQuery[];

  start?: Iso8601;
  end?: Iso8601;
}

export function createMoneybookChart({
  data: _data,
  queries,
  start: _start,
  end,
}: MoneybookChartParams): MoneybookChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;
  const start = _start ?? data[0].range[0];

  const historyRecords = data.map<StackedHistoryBarRecord>(
    ({ range, categories: _categories }) => {
      const categories = Object.keys(_categories);

      const matchValues: Omit<StackedHistoryBarValue, 'ratio'>[] = queries.map(
        ({ name, style, match }) => {
          return {
            name,
            style,
            value: categories
              .filter((category) => match(category))
              .reduce((t, category) => t + _categories[category], 0),
          };
        },
      );

      const total = matchValues.reduce((t, { value }) => t + value, 0);

      const values = matchValues.map<StackedHistoryBarValue>((v) => ({
        ...v,
        ratio: v.value / total,
      }));

      return {
        range,
        timestamps: [
          new Date(range[0]).getTime(),
          new Date(range[1]).getTime(),
        ],
        value: total,
        values,
      };
    },
  );

  const values = historyRecords.map(({ value }) => value);

  const xmin = new Date(start).getTime();
  const xmax = end
    ? new Date(end).getTime()
    : 'month' in data[0]
      ? Date.now()
      : DateTime.now().endOf('year').toMillis();
  const ymin = 0;
  const ymax = Math.max(...values);

  return {
    history: {
      formatString: 'KRW',
      records: historyRecords,
    },
    latest: data.at(-1),
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

const findStart = findStartIndex<AggregatedMoneybook>(({ range }) =>
  DateTime.fromISO(range[0]),
);
