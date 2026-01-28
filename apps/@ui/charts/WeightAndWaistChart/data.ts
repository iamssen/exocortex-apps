import type { AggregatedBody, ASC, Checked, Iso8601 } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryBarData,
  HistoryBarRecord,
  HistoryLineData,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env.ts';

export interface WeightAndWaistChartData {
  weightHistory: HistoryBarData;
  waistHistory: HistoryLineData;

  latestWeight: AggregatedBody;
  latestWaist: AggregatedBody;

  weightAxis: CartesianChartAxis;
  waistAxis: CartesianChartAxis;
}

export interface WeightAndWaistChartParams {
  data: ASC<AggregatedBody>;

  start?: Iso8601;
  end?: Iso8601;
}

export function createWeightAndWaistChartData({
  data: _data,
  start: _start,
  end,
}: WeightAndWaistChartParams): WeightAndWaistChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;

  const start = _start ?? data[0].range[0];

  const weights = data.filter(
    (m): m is Checked<AggregatedBody, 'avgDayWeight'> =>
      typeof m.avgDayWeight === 'number',
  );

  const waists = data.filter(
    (m): m is Checked<AggregatedBody, 'avgDayWaist'> =>
      typeof m.avgDayWaist === 'number',
  );

  const weightHistoryRecords = weights.map<HistoryBarRecord>(
    ({ range, avgDayWeight }) => {
      return {
        range,
        timestamps: [
          new Date(range[0]).getTime(),
          new Date(range[1]).getTime(),
        ],
        value: avgDayWeight,
      };
    },
  );

  const waistHistoryRecords = waists.map(({ range, avgDayWaist }) => {
    return {
      date: range[0],
      timestamp: getMiddleTimestampOfMonth(range),
      value: avgDayWaist,
    };
  });

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const weightYmin = 70;
  const weightYmax = Math.max(
    ...weights.map(({ avgDayWeight }) => avgDayWeight),
  );
  const waistYmin = 70;
  const waistYmax = Math.max(...waists.map(({ avgDayWaist }) => avgDayWaist));

  if (weights.length === 0 || waists.length === 0) {
    throw new Error(`weights or waists must not be empty`);
  }

  return {
    weightHistory: {
      records: weightHistoryRecords,
    },
    waistHistory: {
      formatString: 'CENTIMETER',
      records: [waistHistoryRecords],
    },
    latestWeight: weights.at(-1)!,
    latestWaist: waists.at(-1)!,
    weightAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: weightYmin * chartAxis.YMIN,
        max: weightYmax * chartAxis.YMAX,
      },
    },
    waistAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: waistYmin * chartAxis.YMIN,
        max: waistYmax * chartAxis.YMAX,
      },
    },
  };
}

function getMiddleTimestampOfMonth(range: [Iso8601, Iso8601]): number {
  const start = DateTime.fromISO(range[0]);
  const end = DateTime.fromISO(range[1]);

  return Math.floor(start.toMillis() + (end.toMillis() - start.toMillis()) / 2);
}

const findStart = findStartIndex<AggregatedBody>(({ range }) =>
  DateTime.fromISO(range[0]),
);
