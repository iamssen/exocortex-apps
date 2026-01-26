import type { Iso8601 } from '@iamssen/exocortex';
import { scaleLinear, scaleTime } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface HistoryBarRecord {
  timestamps: [number, number];
  range: [Iso8601, Iso8601];
  value: number;
}

export interface HistoryBarData {
  records: HistoryBarRecord[];
}

export interface HistoryBarProps extends HistoryBarData, SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
}

export function HistoryBar({
  records,
  axis,
  style,
  ...props
}: HistoryBarProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const yScale = useMemo(
    () => scaleLinear().range([height, 0]).domain([axis.y.min, axis.y.max]),
    [axis.y.max, axis.y.min, height],
  );

  const rects = useMemo(() => {
    return records.map(({ timestamps, value }) => {
      const x1 = xScale(timestamps[0]);
      const x2 = xScale(timestamps[1]);
      const y = yScale(value);

      const padding = (x2 - x1) * 0.12;

      return (
        <rect
          key={`${timestamps[0]}~${timestamps[1]}`}
          x={x1 + padding}
          y={y}
          width={x2 - x1 - padding * 2}
          height={height - y}
        />
      );
    });
  }, [height, records, xScale, yScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {rects}
    </g>
  );
}
