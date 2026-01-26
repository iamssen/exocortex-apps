import type { Iso8601 } from '@iamssen/exocortex';
import { scaleLinear, scaleTime } from 'd3-scale';
import { area, line } from 'd3-shape';
import type { CSSProperties, ReactNode, SVGProps } from 'react';
import { useMemo } from 'react';
import { useCartesianChart } from './CartesianChart.context.ts';
import type { CartesianChartAxis } from './CartesianChart.tsx';

interface Record {
  x: number;
  y0: number;
  y1: number;
}

export interface StackedHistoryAreaRecord {
  timestamp: number;
  date: Iso8601;
  values: number[];
  stackedValues: number[];
}

export interface StackedHistoryAreaData {
  records: StackedHistoryAreaRecord[];
  styles: CSSProperties[];
  drawLine?: boolean;
}

export interface StackedHistoryAreaProps
  extends StackedHistoryAreaData, SVGProps<SVGGElement> {
  axis: CartesianChartAxis;
}

export function StackedHistoryArea({
  records,
  styles,
  axis,
  style,
  drawLine = true,
  ...props
}: StackedHistoryAreaProps): ReactNode {
  const { width, height } = useCartesianChart();

  const xScale = useMemo(
    () => scaleTime().range([0, width]).domain([axis.x.min, axis.x.max]),
    [axis.x.max, axis.x.min, width],
  );

  const yScale = useMemo(
    () => scaleLinear().range([height, 0]).domain([axis.y.min, axis.y.max]),
    [axis.y.max, axis.y.min, height],
  );

  const drawRecords = useMemo(() => {
    const s = records[0].stackedValues.length;

    const r: Record[][] = Array.from({
      length: s,
    }).map(() => []);

    let i: number = -1;
    const max: number = records.length;
    while (++i < max) {
      const { timestamp, stackedValues } = records[i];

      let j: number = s;
      while (--j >= 0) {
        r[j].push({
          x: timestamp,
          y0: j > 0 ? stackedValues[j - 1] : 0,
          y1: stackedValues[j],
        });
      }
    }

    return r;
  }, [records]);

  const linePaths = useMemo(() => {
    const fn = line<Record>(
      ({ x }) => xScale(x),
      ({ y1 }) => yScale(y1),
    );

    return drawRecords.map((r) => fn(r));
  }, [drawRecords, xScale, yScale]);

  const areaPaths = useMemo(() => {
    const fn = area<Record>(
      ({ x }) => xScale(x),
      ({ y0 }) => yScale(y0),
      ({ y1 }) => yScale(y1),
    );

    return drawRecords.map((r) => fn(r));
  }, [drawRecords, xScale, yScale]);

  return (
    <g {...props} style={{ ...style, transform: 'translate(10px, 10px)' }}>
      {areaPaths
        ?.filter((d): d is string => !!d)
        .map((d, i) => (
          <path
            key={`areapath-${i}`}
            data-path="area"
            data-id={i}
            d={d}
            style={styles[i]}
          />
        ))}
      {drawLine &&
        linePaths
          ?.filter((d): d is string => !!d)
          .map((d, i) => (
            <path
              key={`linepath-${i}`}
              data-path="line"
              data-id={i}
              d={d}
              style={styles[i]}
            />
          ))}
    </g>
  );
}
