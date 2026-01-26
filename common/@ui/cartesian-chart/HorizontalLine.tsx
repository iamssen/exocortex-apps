import { scaleLinear } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface HorizontalLineProps extends SVGProps<SVGGElement> {
  label?: string;
  axis: CartesianChartAxis;
  value: number;
}

export function HorizontalLine({
  label,
  axis,
  value,
  style,
  ...props
}: HorizontalLineProps): ReactNode {
  const { width, height } = useCartesianChart();

  const yScale = useMemo(
    () => scaleLinear().range([height, 0]).domain([axis.y.min, axis.y.max]),
    [axis.y.max, axis.y.min, height],
  );

  const y = useMemo(() => yScale(value), [value, yScale]);

  const textElements = useMemo(() => {
    if (!label) {
      return null;
    }

    const textProps: SVGProps<SVGTextElement> = {
      x: width - 5,
      y: y - 5,
      children: label,
    };

    return (
      <>
        <text {...textProps} data-display="border" />
        <text {...textProps} />
      </>
    );
  }, [label, width, y]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      <line x1={0} y1={y} x2={width} y2={y} />
      {textElements}
    </g>
  );
}
