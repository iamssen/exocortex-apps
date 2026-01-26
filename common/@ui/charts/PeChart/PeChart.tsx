import { useQuery } from '@tanstack/react-query';
import type { CartesianChartProps } from '@ui/cartesian-chart';
import {
  CartesianChart,
  DateLines,
  EventIndicator,
  HistoryLine,
  PriceLine,
  RecessionIndicator,
} from '@ui/cartesian-chart';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import type { PeChartParams } from './data.ts';
import { createPeChartData } from './data.ts';

export interface PeChartProps
  extends PeChartParams, Omit<CartesianChartProps, 'children'> {}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function PeChart({
  data,
  benchmarkData,
  watches,
  start,
  end,
  ...props
}: PeChartProps): ReactNode {
  const { data: financeIndicatorData } = useQuery(api('finance-indicator'));

  const chart = useMemo(
    () => createPeChartData({ data, benchmarkData, watches, start, end }),
    [benchmarkData, data, end, start, watches],
  );

  return chart ? (
    <CartesianChart {...props}>
      <RecessionIndicator
        axis={chart.axis}
        className={styles.recessionIndicator}
      />
      <DateLines
        key={`line:${chart.axis.x.min}`}
        className={styles.dateLines}
        {...dateLinesData}
        axis={chart.axis}
      />
      {financeIndicatorData && (
        <EventIndicator
          data={financeIndicatorData}
          axis={chart.axis}
          className={styles.eventIndicator}
        />
      )}
      {chart.watches.map((watchData, i) => (
        <PriceLine
          key={`watch-${i}-${chart.axis.x.min}`}
          className={styles.priceLine}
          {...watchData}
          axis={chart.axis}
        />
      ))}
      {chart.historyBenchmark && (
        <HistoryLine
          className={styles.historyLine}
          style={{ color: 'rgba(255, 255, 255, 0.2)' }}
          {...chart.historyBenchmark}
          axis={chart.axis}
        />
      )}
      <HistoryLine
        className={styles.historyLine}
        {...chart.history}
        axis={chart.axis}
      />
      {chart.price && (
        <PriceLine
          className={styles.priceLine}
          {...chart.price}
          axis={chart.axis}
        />
      )}
    </CartesianChart>
  ) : null;
}
