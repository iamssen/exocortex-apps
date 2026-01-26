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
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import type { KospiPeChartData } from './data.ts';

export interface KospiPeChartProps extends Omit<
  CartesianChartProps,
  'children'
> {
  chart: KospiPeChartData;
}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function KospiPeChart({
  chart,
  ...props
}: KospiPeChartProps): ReactNode {
  const { data: financeIndicatorData } = useQuery(api('finance-indicator'));

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
      {chart.watches.map((data, i) => (
        <PriceLine
          key={`watch-${i}-${chart.axis.x.min}`}
          className={styles.priceLine}
          {...data}
          axis={chart.axis}
        />
      ))}
      <HistoryLine
        className={styles.historyLine}
        style={{ color: 'rgba(255, 255, 255, 0.2)' }}
        {...chart.historyAll}
        axis={chart.axis}
      />
      <HistoryLine
        className={styles.historyLine}
        style={{ color: 'rgba(255, 255, 255, 0.2)' }}
        {...chart.history100}
        axis={chart.axis}
      />
      <HistoryLine
        className={styles.historyLine}
        style={{ color: 'rgba(255, 255, 255, 0.2)' }}
        {...chart.history50}
        axis={chart.axis}
      />
      <HistoryLine
        className={styles.historyLine}
        style={{ color: 'rgba(255, 255, 255, 0.2)' }}
        {...chart.historyManufacturing}
        axis={chart.axis}
      />
      <HistoryLine
        className={styles.historyLine}
        {...chart.history200}
        axis={chart.axis}
      />
      {chart.price200 && (
        <PriceLine
          className={styles.priceLine}
          {...chart.price200}
          axis={chart.axis}
        />
      )}
    </CartesianChart>
  ) : null;
}
