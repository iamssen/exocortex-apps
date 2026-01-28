import { useCartesianChart } from '@ui/cartesian-chart';
import type { ReactNode, SVGProps } from 'react';

export interface BarProps extends SVGProps<SVGGElement> {
  y: number;
}

export function Bar({ y, style, ...props }: BarProps): ReactNode {
  const { width, height } = useCartesianChart();

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      <rect
        width={width}
        height={height}
        fill="rgba(255, 255, 255, 0.1)"
        rx={10}
      />
      <line x1={0} x2={width} y1={y} y2={y} strokeWidth={2} stroke="#666666" />
    </g>
  );
}
