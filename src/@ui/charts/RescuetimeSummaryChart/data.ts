import type {
  AggregatedRescuetimeHistory,
  ASC,
  RescuetimeHistoryTimes,
} from '@iamssen/exocortex';
import type { Iso8601 } from '@iamssen/exocortex';
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

export interface RescuetimeSummaryChartData {
  history: StackedHistoryBarData;

  axis: CartesianChartAxis;
}

export interface RescuetimeSummaryChartQuery {
  name: string;
  value: (d: RescuetimeHistoryTimes) => number;
  style: CSSProperties;
}

export interface RescuetimeSummaryChartParams {
  data: ASC<AggregatedRescuetimeHistory>;
  queries: RescuetimeSummaryChartQuery[];

  start?: Iso8601;
  end?: Iso8601;
}

export function createRescuetimeSummaryChart({
  data: _data,
  queries,
  start: _start,
  end,
}: RescuetimeSummaryChartParams): RescuetimeSummaryChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;
  const start = _start ?? data[0].range[0];

  const historyRecords = data.map<StackedHistoryBarRecord>(
    ({ range, children, ...childrenValues }) => {
      const matchValues: Omit<StackedHistoryBarValue, 'ratio'>[] = queries.map(
        ({ name, value, style }) => {
          return {
            name,
            style,
            value: value(childrenValues),
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
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = 0;
  const ymax = Math.max(...values);

  return {
    history: {
      formatString: undefined,
      records: historyRecords,
    },
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

const findStart = findStartIndex<AggregatedRescuetimeHistory>(({ range }) =>
  DateTime.fromISO(range[0]),
);
