import type { CartesianChartProps } from '@ui/cartesian-chart';
import {
  CartesianChart,
  DateLines,
  HistoryLine,
  HorizontalLine,
} from '@ui/cartesian-chart';
import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import type { YearlyTrendChartData } from './data.ts';

export interface YearlyTrendChartProps
  extends YearlyTrendChartData, Omit<CartesianChartProps, 'children'> {}

const dateLinesData = { timezone: 'Asia/Seoul' };
const thisYear = new Date().getFullYear();

export function YearlyTrendChart({
  histories,
  axis,
  ...props
}: YearlyTrendChartProps): ReactNode {
  const opacityScale = useMemo(() => {
    const scale = scaleLinear()
      .domain([thisYear - 10, thisYear])
      .range([0.4, 1]);
    scale.clamp(true);
    return scale;
  }, []);

  return (
    <CartesianChart {...props}>
      <DateLines className={styles.dateLines} {...dateLinesData} axis={axis} />
      <HorizontalLine className={styles.priceLine} axis={axis} value={0} />
      {histories.map(
        ({ formatString, formatReplacer, records, originYear }) => (
          <HistoryLine
            className={styles.historyLine}
            key={`history-${originYear}`}
            axis={axis}
            formatString={formatString}
            formatReplacer={formatReplacer}
            records={records}
            hideHighAndLow
            hideLast
            style={{
              color: getColor(originYear),
              opacity: opacityScale(originYear),
            }}
          />
        ),
      )}
    </CartesianChart>
  );
}

function getColor(originYear: number): string | undefined {
  const diff = thisYear - originYear;

  return diff === 0 ? undefined : diff < 5 ? '#866403' : '#0952a6';
}
