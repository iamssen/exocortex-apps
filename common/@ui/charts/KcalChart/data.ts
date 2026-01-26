import type { AggregatedBody, ASC, Checked, Iso8601 } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryBarData,
  HistoryBarRecord,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env.ts';

export interface KcalChartData {
  historyBar: HistoryBarData;
  latest: AggregatedBody | undefined;

  axis: CartesianChartAxis;
}

export interface KcalChartParams {
  data: ASC<AggregatedBody>;

  start?: Iso8601;
  end?: Iso8601;
}

export function createKcalChartData({
  data: _data,
  start: _start,
  end,
}: KcalChartParams): KcalChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;
  const start = _start ?? data[0].range[0];

  const kcals = data.filter(
    (m): m is Checked<AggregatedBody, 'avgDayKcal'> =>
      typeof m.avgDayKcal === 'number',
  );

  const historyBarRecords = kcals.map<HistoryBarRecord>(
    ({ range, avgDayKcal }) => {
      return {
        range,
        timestamps: [
          new Date(range[0]).getTime(),
          new Date(range[1]).getTime(),
        ],
        value: avgDayKcal,
      };
    },
  );

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = 1500;
  const ymax = Math.max(...kcals.map(({ avgDayKcal }) => avgDayKcal));

  return {
    historyBar: {
      records: historyBarRecords,
    },
    latest: kcals.at(-1),
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

const findStart = findStartIndex<AggregatedBody>(({ range }) =>
  DateTime.fromISO(range[0]),
);
