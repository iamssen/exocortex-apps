import { useQuery } from '@tanstack/react-query';
import { api } from '@ui/query';
import { scaleTime } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface RecessionIndicatorProps extends SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
}

export function RecessionIndicator({
  axis,
  style,
  ...props
}: RecessionIndicatorProps): ReactNode {
  const { data: recessionData } = useQuery(api('finance/recession'));

  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const data = useMemo(() => {
    return recessionData?.map(({ from, to }) => ({
      from: new Date(from).getTime(),
      to: new Date(to).getTime(),
    }));
  }, [recessionData]);

  const rects = useMemo(() => {
    return data
      ?.filter(({ from, to }) => {
        return (
          (to > axis.x.min && to < axis.x.max) ||
          (from > axis.x.min && from < axis.x.max)
        );
      })
      .map(({ from, to }) => {
        const x = xScale(Math.max(from, axis.x.min));
        const w = xScale(Math.min(to, axis.x.max)) - x;

        return w > 0 ? (
          <rect
            key={`recession-${from}`}
            x={x}
            width={w}
            y={0}
            height={height}
          />
        ) : null;
      });
  }, [axis.x.max, axis.x.min, data, height, xScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {rects}
    </g>
  );
}
