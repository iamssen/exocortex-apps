import { scaleLinear, scaleTime } from 'd3-scale';
import type { ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

export interface PointProps extends SVGProps<SVGGElement> {
  label?: string;
  axis: CartesianChartAxis;
  xValue: number;
  yValue: number;
}

export function Point({
  label,
  axis,
  xValue,
  yValue,
  style,
  ...props
}: PointProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );
  const yScale = useMemo(
    () => scaleLinear().range([height, 0]).domain([axis.y.min, axis.y.max]),
    [axis.y.max, axis.y.min, height],
  );

  const x = useMemo(() => xScale(xValue), [xValue, xScale]);
  const y = useMemo(() => yScale(yValue), [yValue, yScale]);

  const textElements = useMemo(() => {
    if (!label) {
      return null;
    }

    const textProps: SVGProps<SVGTextElement> = {
      x: x + 7,
      y: y + 4,
      children: label,
    };

    return (
      <>
        <text {...textProps} data-display="border" />
        <text {...textProps} />
      </>
    );
  }, [label, x, y]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      <circle cx={x} cy={y} r={3} />
      {textElements}
    </g>
  );
}
