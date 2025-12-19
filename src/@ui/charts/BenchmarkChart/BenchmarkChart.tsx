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
import type { BenchmarkChartParams } from './data.ts';
import { createBenchmarkChartData } from './data.ts';

export interface BenchmarkChartProps
  extends BenchmarkChartParams, Omit<CartesianChartProps, 'children'> {}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function BenchmarkChart({
  formatString,
  formatReplacer,
  data,
  watches,
  start,
  end,
  ...props
}: BenchmarkChartProps): ReactNode {
  const { data: financeIndicatorData } = useQuery(api('finance-indicator'));

  const chart = useMemo(
    () =>
      createBenchmarkChartData({
        formatString,
        formatReplacer,
        data,
        watches,
        start,
        end,
      }),
    [data, end, formatReplacer, formatString, start, watches],
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
      {chart.watches.map((lineData, i) => (
        <PriceLine
          key={`watch-${i}-${chart.axis.x.min}`}
          className={styles.priceLine}
          {...lineData}
          axis={chart.axis}
        />
      ))}
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
