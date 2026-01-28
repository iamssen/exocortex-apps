import type { WeeklyBody } from '@iamssen/exocortex';
import { Format } from '@libs/format';
import { column } from '@libs/react-data-grid';
import { EXCESS_CALORIES, SUPER_EXCESS_CALORIES } from '@ui/env';
import { DateTime } from 'luxon';
import type { Column } from 'react-data-grid';
import cellStyles from './cellStyles.module.css';

export interface Columns {
  week: Column<WeeklyBody>;
  mon: Column<WeeklyBody>;
  tue: Column<WeeklyBody>;
  wed: Column<WeeklyBody>;
  thu: Column<WeeklyBody>;
  fri: Column<WeeklyBody>;
  sat: Column<WeeklyBody>;
  sun: Column<WeeklyBody>;
}

function createDayColumn(name: string, columnIndex: number) {
  return column<WeeklyBody>({
    key: name.toLowerCase(),
    name,
    minWidth: 85,
    cellClass: ({ dayKcals }) => {
      const kcal = dayKcals[columnIndex]?.totalKcal ?? 0;
      return kcal > SUPER_EXCESS_CALORIES
        ? cellStyles.gridCellSuperDanger
        : kcal > EXCESS_CALORIES
          ? cellStyles.gridCellDanger
          : null;
    },
    select: ({ dayKcals }) => {
      const day = dayKcals[columnIndex];

      if (!day) {
        return null;
      }

      const date = DateTime.fromISO(day.date);

      return (
        <div className={cellStyles.gridCellDay}>
          <div>
            <time dateTime={day.date}>
              {columnIndex === 0 || date.day === 1
                ? date.toFormat('M월 d일')
                : date.toFormat('d일')}
            </time>
            {day.drinking && <span>🍺</span>}
          </div>
          <div>
            <Format format="INTEGER" n={dayKcals[columnIndex]?.totalKcal} />
            Kcal
          </div>
        </div>
      );
    },
  });
}

function createWeekColumn() {
  return column<WeeklyBody>({
    key: 'week',
    name: 'Week',
    frozen: true,
    minWidth: 75,
    cellClass: ({ avgDayKcal }) => {
      if (!avgDayKcal) {
        return null;
      }

      return avgDayKcal > SUPER_EXCESS_CALORIES
        ? cellStyles.gridCellSuperDanger
        : avgDayKcal > EXCESS_CALORIES
          ? cellStyles.gridCellDanger
          : null;
    },
    select: ({ week, avgDayKcal }) => {
      return (
        <div className={cellStyles.gridCellWeek}>
          <time dateTime={week}>{week}</time>
          <div>
            <Format format="INTEGER" n={avgDayKcal} />
            Kcal
          </div>
        </div>
      );
    },
  });
}

export function createColumns(): Columns {
  return {
    week: createWeekColumn(),
    mon: createDayColumn('Mon', 0),
    tue: createDayColumn('Tue', 1),
    wed: createDayColumn('Wed', 2),
    thu: createDayColumn('Thu', 3),
    fri: createDayColumn('Fri', 4),
    sat: createDayColumn('Sat', 5),
    sun: createDayColumn('Sun', 6),
  };
}
