import type { Iso8601, KospiPeItem } from '@iamssen/exocortex';
import { findStartIndex } from '@iamssen/exocortex/date-utils';
import type {
  CartesianChartAxis,
  HistoryLineData,
  HistoryLineRecord,
  PriceLineData,
} from '@ui/cartesian-chart';
import { DateTime } from 'luxon';
import { chartAxis } from '../env.ts';

export interface KospiPeChartData {
  historyAll: HistoryLineData;
  history200: HistoryLineData;
  history100: HistoryLineData;
  history50: HistoryLineData;
  historyManufacturing: HistoryLineData;

  price200: PriceLineData | undefined;
  watches: PriceLineData[];

  axis: CartesianChartAxis;
}

export interface KospiPeChartParams {
  data: KospiPeItem[];
  watches: PriceLineData[];

  start: Iso8601;
  end?: Iso8601;
}

export function createKospiPeChartData({
  data,
  watches,
  start,
  end,
}: KospiPeChartParams): KospiPeChartData {
  const records = {
    'all': [] as HistoryLineRecord[],
    '200': [] as HistoryLineRecord[],
    '100': [] as HistoryLineRecord[],
    '50': [] as HistoryLineRecord[],
    'manufacturing': [] as HistoryLineRecord[],
  };
  const values: number[] = watches.map(({ price }) => price);

  const slicedData = data.slice(findStart(data, start));

  let i: number = -1;
  const max: number = slicedData.length;
  while (++i < max) {
    const o = slicedData[i];
    const d = {
      date: o.date,
      timestamp: new Date(o.date).getTime(),
    };
    records['all'].push({ ...d, value: o['all'] });
    records['200'].push({ ...d, value: o['200'] });
    records['100'].push({ ...d, value: o['100'] });
    records['50'].push({ ...d, value: o['50'] });
    records['manufacturing'].push({ ...d, value: o['manufacturing'] });
    values.push(o['all'], o['200'], o['100'], o['50'], o['manufacturing']);
  }

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const ymin = Math.min(...values);
  const ymax = Math.max(...values);

  return {
    historyAll: {
      formatString: undefined,
      records: [records['all']],
    },
    history200: {
      formatString: undefined,
      records: [records['200']],
    },
    history100: {
      formatString: undefined,
      records: [records['100']],
    },
    history50: {
      formatString: undefined,
      records: [records['50']],
    },
    historyManufacturing: {
      formatString: undefined,
      records: [records['manufacturing']],
    },
    price200: {
      formatString: undefined,
      price: records['200'].at(-1)?.value ?? 0,
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

const findStart = findStartIndex<KospiPeItem>(({ date }) =>
  DateTime.fromISO(date),
);
