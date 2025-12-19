import type { Trade } from '@iamssen/exocortex';
import { useQuery } from '@tanstack/react-query';
import type { CartesianChartProps } from '@ui/cartesian-chart';
import {
  CartesianChart,
  DateLines,
  EventIndicator,
  HistoryLine,
  PriceLine,
  RecessionIndicator,
  TradePoints,
} from '@ui/cartesian-chart';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import type { QuoteChartParams } from './data.ts';
import { createQuoteChartData } from './data.ts';

export interface QuoteChartProps
  extends QuoteChartParams, Omit<CartesianChartProps, 'children'> {
  trades: Trade[] | undefined;
}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function QuoteChart({
  info,
  history,
  quote,
  watch,
  statistic,
  trades,
  start,
  ...props
}: QuoteChartProps): ReactNode {
  const { data: financeIndicatorData } = useQuery(api('finance-indicator'));

  const chart = useMemo(
    () =>
      createQuoteChartData({
        info,
        history,
        quote,
        watch,
        statistic,
        start,
      }),
    [start, history, info, quote, statistic, watch],
  );

  return chart ? (
    <CartesianChart {...props}>
      <RecessionIndicator
        axis={chart.axis}
        className={styles.recessionIndicator}
      />
      <DateLines
        key={`line:${start}`}
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
          key={`watch-${i}`}
          className={styles.priceLine}
          {...data}
          axis={chart.axis}
        />
      ))}
      <HistoryLine
        className={styles.historyLine}
        {...chart.history}
        axis={chart.axis}
      />
      {trades && (
        <TradePoints
          key={`points:${start}`}
          className={styles.tradePoints}
          trades={trades}
          axis={chart.axis}
        />
      )}
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
