import type { EventIndicator as Indicator } from '@iamssen/exocortex';
import { scaleTime } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { Fragment, useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface EventIndicatorProps extends SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
  data: Indicator[];
  baseY?: number;
}

export function EventIndicator({
  axis,
  style,
  data,
  baseY = 20,
  ...props
}: EventIndicatorProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const spotEvents = useMemo(() => {
    return data
      .filter((item) => 'date' in item)
      .map(({ name, date }) => ({
        name,
        date: new Date(date).getTime(),
      }))
      .filter(({ date }) => {
        return date > axis.x.min && date < axis.x.max;
      })
      .map(({ name, date }) => {
        const x = xScale(date);
        const y = baseY;

        return (
          <Fragment key={`spot-${date}`}>
            <line x1={x} x2={x} y1={y} y2={height} />
            <circle cx={x} cy={y} r={3} />
            <text x={x - 5} y={y + 4}>
              {name}
            </text>
          </Fragment>
        );
      });
  }, [axis.x.max, axis.x.min, baseY, data, height, xScale]);

  const rangedEvents = useMemo(() => {
    return data
      .filter((item) => 'from' in item)
      .map(({ name, from, to }) => ({
        name,
        from: new Date(from).getTime(),
        to: new Date(to).getTime(),
      }))
      .filter(({ from, to }) => {
        return (
          (to > axis.x.min && to < axis.x.max) ||
          (from > axis.x.min && from < axis.x.max)
        );
      })
      .map(({ name, from, to }, i) => {
        const x = xScale(Math.max(from, axis.x.min));
        const y = i % 2 === 0 ? baseY + 20 : baseY;
        const w = xScale(Math.min(to, axis.x.max)) - x;

        return w > 0 ? (
          <Fragment key={`range-${from}`}>
            <line x1={x} x2={x + w} y1={y} y2={y} strokeWidth={1} />
            <circle cx={x} cy={y} r={3} />
            <rect x={x + w} y={y - 3} width={3} height={6} />
            <text x={x + w} y={y + 12}>
              {name}
            </text>
          </Fragment>
        ) : null;
      });
  }, [axis.x.max, axis.x.min, baseY, data, xScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {rangedEvents}
      {spotEvents}
    </g>
  );
}
