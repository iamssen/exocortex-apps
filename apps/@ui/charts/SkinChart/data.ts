import type { ASC, Checked, DaySkin, Iso8601 } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryLineData,
  HistoryLineRecord,
  StackedHistoryAreaData,
  StackedHistoryAreaRecord,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env';

export interface SkinChartData {
  severityHistory: StackedHistoryAreaData;
  pustulesHistory: HistoryLineData;

  lastSeverity: DaySkin | undefined;
  lastPustules: DaySkin | undefined;

  severityAxis: CartesianChartAxis;
  pustulesAxis: CartesianChartAxis;
}

export interface SkinChartParams {
  data: ASC<DaySkin>;

  start?: Iso8601;
  end?: Iso8601;
}

export function createSkinChartData({
  data: _data,
  start: _start,
  end,
}: SkinChartParams): SkinChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;
  const start = _start ?? data[0].date;

  const severities = data.filter(
    (m): m is Checked<DaySkin, 'severity'> => typeof m.severity === 'number',
  );

  const pustules = data.filter(
    (m): m is Checked<DaySkin, 'pustules'> => typeof m.pustules === 'number',
  );

  const severityHistoryRecords = severities.map<StackedHistoryAreaRecord>(
    (i) => {
      return {
        timestamp: i.timestamp,
        date: i.date,
        values: [i.severity],
        stackedValues: [i.severity],
      };
    },
  );

  const pustulesHistoryRecords = pustules.map<HistoryLineRecord>((i) => {
    return {
      timestamp: i.timestamp,
      date: i.date,
      value: i.pustules,
    };
  });

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const severityYmin = 0;
  const severityYmax = Math.max(...severities.map((i) => i.severity));
  const pustulesYmin = 0;
  // const pustulesYmax = Math.max(...pustules.map((i) => i.pustules));

  return {
    severityHistory: {
      records: severityHistoryRecords,
      styles: [{ color: 'rgba(61, 63, 157, 1)' }],
    },
    pustulesHistory: {
      formatString: 'POINT',
      records: [pustulesHistoryRecords],
    },
    lastSeverity: severities.at(-1),
    lastPustules: pustules.at(-1),
    severityAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: severityYmin * chartAxis.YMIN,
        max: severityYmax * chartAxis.YMAX,
      },
    },
    pustulesAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: pustulesYmin * chartAxis.YMIN,
        max: 10,
      },
    },
  };
}

const findStart = findStartIndex<DaySkin>(({ date }) => DateTime.fromISO(date));
