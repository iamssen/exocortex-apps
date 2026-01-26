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

export interface EnergyAndExerciseChartData {
  energyHistory: HistoryLineData;
  exerciseHistory: HistoryBarData;

  latestEnergy: AggregatedBody | undefined;
  latestExercise: AggregatedBody | undefined;

  energyAxis: CartesianChartAxis;
  exerciseAxis: CartesianChartAxis;
}

export interface EnergyAndExerciseChartParams {
  data: ASC<AggregatedBody>;

  start?: Iso8601;
  end?: Iso8601;
}

export function createEnergyAndExerciseChartData({
  data: _data,
  start: _start,
  end,
}: EnergyAndExerciseChartParams): EnergyAndExerciseChartData {
  const data = _start ? _data.slice(findStart(_data, _start)) : _data;
  const start = _start ?? data[0].range[0];

  const energies = data.filter(
    (m): m is Checked<AggregatedBody, 'avgDayEnergy'> =>
      typeof m.avgDayEnergy === 'number',
  );

  const exercises = data.filter(
    (m): m is Checked<AggregatedBody, 'totalExercise'> =>
      typeof m.totalExercise === 'number',
  );

  const exerciseHistoryRecords = exercises.map<HistoryBarRecord>(
    ({ range, totalExercise }) => {
      return {
        range,
        timestamps: [
          new Date(range[0]).getTime(),
          new Date(range[1]).getTime(),
        ],
        value: totalExercise,
      };
    },
  );

  const energyHistoryRecords = energies.map(({ range, avgDayEnergy }) => {
    return {
      date: range[0],
      timestamp: getMiddleTimestampOfMonth(range),
      value: avgDayEnergy,
    };
  });

  const xmin = new Date(start).getTime();
  const xmax = end ? new Date(end).getTime() : Date.now();
  const exerciseYmin = 0;
  const exerciseYmax = Math.max(
    ...exercises.map(({ totalExercise }) => totalExercise),
  );
  const energyYmin = 0;
  const energyYmax = Math.max(
    ...energies.map(({ avgDayEnergy }) => avgDayEnergy),
  );

  return {
    exerciseHistory: {
      records: exerciseHistoryRecords,
    },
    energyHistory: {
      formatString: 'KCAL',
      records: [energyHistoryRecords],
    },
    latestEnergy: energies.at(-1),
    latestExercise: exercises.at(-1),
    exerciseAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: exerciseYmin * chartAxis.YMIN,
        max: exerciseYmax * chartAxis.YMAX,
      },
    },
    energyAxis: {
      x: {
        min: xmin * chartAxis.XMIN,
        max: xmax * chartAxis.XMAX,
      },
      y: {
        min: energyYmin * chartAxis.YMIN,
        max: energyYmax * chartAxis.YMAX,
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
