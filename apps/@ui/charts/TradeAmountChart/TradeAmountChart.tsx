import type { CartesianChartProps } from '@ui/cartesian-chart';
import { CartesianChart, DateLines, HistoryLine } from '@ui/cartesian-chart';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import { Bar } from './Bar.tsx';
import type { TradeAmountChartParams } from './data.ts';
import { createTradeAmountChartData } from './data.ts';

export interface TradeAmountChartProps
  extends TradeAmountChartParams, Omit<CartesianChartProps, 'children'> {}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function TradeAmountChart({
  trades,
  benchmarkHistory,
  start,
  end,
  currency,
  ...props
}: TradeAmountChartProps): ReactNode {
  const chart = useMemo(
    () =>
      createTradeAmountChartData({
        trades,
        start,
        end,
        currency,
        benchmarkHistory,
      }),
    [benchmarkHistory, currency, end, start, trades],
  );

  return chart ? (
    <CartesianChart {...props}>
      <DateLines
        key={`line:${chart.axis.x.min}`}
        className={styles.dateLines}
        {...dateLinesData}
        axis={chart.axis}
      />
      {chart.benchmarkHistory && chart.benchmarkAxis && (
        <HistoryLine
          className={styles.historyLine}
          {...chart.benchmarkHistory}
          axis={chart.benchmarkAxis}
          hideLast
          hideHighAndLow
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        />
      )}
      <Bar
        className={styles.multiHistoryBar}
        {...chart.history}
        axis={chart.axis}
      />
    </CartesianChart>
  ) : null;
}
