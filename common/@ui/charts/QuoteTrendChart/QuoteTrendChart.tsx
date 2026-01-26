import { useQuery } from '@tanstack/react-query';
import type { CartesianChartProps } from '@ui/cartesian-chart';
import {
  CartesianChart,
  DateLines,
  EventIndicator,
  HistoryLine,
  HorizontalLine,
  RecessionIndicator,
  VerticalLine,
} from '@ui/cartesian-chart';
import { api } from '@ui/query';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import styles from '../styles.module.css';
import type { QuoteTrendChartParams } from './data.ts';
import { createQuoteTrendChartData } from './data.ts';

export interface QuoteTrendChartProps
  extends QuoteTrendChartParams, Omit<CartesianChartProps, 'children'> {
  historyLineStyles: CSSProperties[];
}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function QuoteTrendChart({
  histories,
  zeroResetDates,
  start,
  end,
  historyLineStyles,
  ...props
}: QuoteTrendChartProps): ReactNode {
  const { data: financeIndicatorData } = useQuery(api('finance-indicator'));

  const chart = useMemo(() => {
    const s = new Date(start).getTime();
    return createQuoteTrendChartData({
      histories,
      zeroResetDates: zeroResetDates?.filter(
        (zd) => new Date(zd).getTime() > s,
      ),
      start,
    });
  }, [histories, start, zeroResetDates]);

  const verticalLines = useMemo(() => {
    return (
      zeroResetDates?.map((date) => (
        <VerticalLine
          className={styles.verticalLine}
          axis={chart.axis}
          value={new Date(date).getTime()}
        />
      )) ?? []
    );
  }, [chart.axis, zeroResetDates]);

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
      <HorizontalLine
        className={styles.horizontalLine}
        axis={chart.axis}
        value={0}
      />
      {...verticalLines}
      {chart.histories.map((history, i) => (
        <HistoryLine
          key={`history-${i}`}
          className={styles.historyLine}
          {...history}
          axis={chart.axis}
          hideHighAndLow
          hideLast
          style={historyLineStyles[i]}
        />
      ))}
    </CartesianChart>
  ) : null;
}
