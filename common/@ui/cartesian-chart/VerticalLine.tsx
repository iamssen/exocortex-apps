import { scaleTime } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface VerticalLineProps extends SVGProps<SVGGElement> {
  label?: string;
  axis: CartesianChartAxis;
  value: number;
}

export function VerticalLine({
  label,
  axis,
  value,
  style,
  ...props
}: VerticalLineProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const x = useMemo(() => xScale(value), [value, xScale]);

  const textElements = useMemo(() => {
    if (!label) {
      return null;
    }

    const textProps: SVGProps<SVGTextElement> = {
      x: x - 5,
      y: height - 5,
      children: label,
    };

    return (
      <>
        <text {...textProps} data-display="border" />
        <text {...textProps} />
      </>
    );
  }, [height, label, x]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      <line x1={x} y1={0} x2={x} y2={height} />
      {textElements}
    </g>
  );
}
