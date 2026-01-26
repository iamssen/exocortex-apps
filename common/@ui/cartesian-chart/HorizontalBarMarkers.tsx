import type { CartesianChartAxis } from './CartesianChart.tsx';
import { useCartesianChart } from './CartesianChart.context.ts';
import { scaleTime } from 'd3-scale';
import type { ReactElement, ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';

export interface BarMarker {
  value: number;
  label: string;
  element: ReactElement;
}

export interface HorizontalBarMarkersData {
  markers: BarMarker[];
}

export interface HorizontalBarMarkersProps
  extends
    HorizontalBarMarkersData,
    Omit<SVGProps<SVGGElement>, 'type' | 'values'> {
  axis: CartesianChartAxis;
  y: number;
}

export function HorizontalBarMarkers({
  markers: _markers,
  axis,
  style,
  y,
  ...props
}: HorizontalBarMarkersProps): ReactNode {
  const { width } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const markers = useMemo(() => {
    return _markers.map((v, i) => {
      const x = Math.min(Math.max(xScale(v.value), -5), width + 5);

      return (
        <g key={`${i}-${v.label}`} transform={`translate(${x} 0)`}>
          {v.element}
        </g>
      );
    });
  }, [_markers, width, xScale]);

  return (
    <g
      {...props}
      style={{ ...style, transform: `translate(10px, ${10 + y}px)` }}
    >
      {markers}
    </g>
  );
}
