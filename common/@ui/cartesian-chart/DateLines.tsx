import { scaleLinear } from 'd3-scale';
import type { DurationLike } from 'luxon';
import { DateTime } from 'luxon';
import type { ReactNode, SVGProps } from 'react';
import { Fragment, useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface DateLinesData {
  timezone: string;
}

export interface DateLinesProps extends DateLinesData, SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
}

export function DateLines({
  timezone,
  axis,
  style,
  ...props
}: DateLinesProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleLinear().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const flags = useMemo(() => {
    let { date, duration, format } = getStartDate(
      timezone,
      axis.x.min,
      axis.x.max,
    );

    let dateFlags: DateFlag[] = [];

    while (date.toMillis() < axis.x.max) {
      dateFlags.push({
        label: format(date),
        timestamp: date.toMillis(),
        x: xScale(date.toMillis()),
      });

      date = date.plus(duration);
    }

    return dateFlags;
  }, [axis.x.max, axis.x.min, timezone, xScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {flags.map(({ timestamp, x, label }) => (
        <Fragment key={timestamp}>
          {x > 0 && x < axis.x.max && (
            <line data-timestamp={timestamp} x1={x} x2={x} y1={0} y2={height} />
          )}
          <text data-timestamp={timestamp} x={x + 5} y={15}>
            {label}
          </text>
        </Fragment>
      ))}
    </g>
  );
}

interface DateFlag {
  label: string;
  timestamp: number;
  x: number;
}

function getStartDate(
  timezone: string,
  min: number,
  max: number,
): { date: DateTime; duration: DurationLike; format: (d: DateTime) => string } {
  const minDate = DateTime.fromMillis(min, { zone: timezone });
  const maxDate = DateTime.fromMillis(max, { zone: timezone });

  if (maxDate.diff(minDate, 'year').years > 10) {
    const yearGap = minDate.year % 5;
    const startDate = DateTime.fromISO(`${minDate.year - yearGap}-01-01`, {
      zone: timezone,
    }).startOf('day');
    return {
      date: startDate,
      duration: { year: 5 },
      format: (d) => d.year.toString(),
    };
  } else if (maxDate.diff(minDate, 'year').years >= 2) {
    const startDate = minDate.startOf('year');
    return {
      date: startDate,
      duration: { year: 1 },
      format: (d) => d.year.toString(),
    };
  } else if (maxDate.diff(minDate, 'month').months >= 8) {
    const startDate = minDate.startOf('month');
    return {
      date: startDate,
      duration: { month: 1 },
      format: (d) => (d.month === 1 ? d.year.toString() : d.toFormat('MMM')),
    };
  } else if (maxDate.diff(minDate, 'month').months >= 3) {
    const startDate = minDate.startOf('month');
    return {
      date: startDate,
      duration: { month: 1 },
      format: (d) =>
        d.month === 1 ? d.year.toString() : d.toFormat('yyyy-MM'),
    };
  } else {
    const startDate = minDate.startOf('week');
    return {
      date: startDate,
      duration: { week: 1 },
      format: (d) => (d.month === 1 ? d.year.toString() : d.toFormat('MM-dd')),
    };
  }
}
