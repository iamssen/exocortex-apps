import type { CartesianChartProps } from '@ui/cartesian-chart';
import { CartesianChart, HorizontalBarMarkers } from '@ui/cartesian-chart';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Bar } from './Bar.tsx';
import type { PositionBarParams } from './data.tsx';
import { createPositionBarData } from './data.tsx';

export interface PositionBarProps
  extends PositionBarParams, Omit<CartesianChartProps, 'children'> {
  height?: number;
  baseline?: number;
}

export function PositionBar({
  trade,
  current,
  targets,
  currency,
  children,
  height = 70,
  baseline = 30,
  style,
  ...props
}: PositionBarProps): ReactNode {
  const chart = useMemo(
    () =>
      createPositionBarData({
        trade,
        current,
        targets,
        currency,
        children,
      }),
    [children, currency, current, targets, trade],
  );

  return chart ? (
    <CartesianChart {...props} style={{ ...style, height }}>
      <Bar y={baseline} />
      <HorizontalBarMarkers axis={chart.axis} {...chart.markers} y={baseline} />
    </CartesianChart>
  ) : null;
}
