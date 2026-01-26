import { useQuery } from '@tanstack/react-query';
import type { CartesianChartProps } from '@ui/cartesian-chart';
import {
  CartesianChart,
  DateLines,
  EventIndicator,
  StackedHistoryBar,
} from '@ui/cartesian-chart';
import { api } from '@ui/query';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import styles from '../styles.module.css';
import type { RescuetimeSummaryChartParams } from './data.ts';
import { createRescuetimeSummaryChart } from './data.ts';

export interface RescuetimeSummaryChartProps
  extends RescuetimeSummaryChartParams, Omit<CartesianChartProps, 'children'> {}

const dateLinesData = { timezone: 'Asia/Seoul' };

export function RescuetimeSummaryChart({
  data,
  queries,
  start,
  end,
  ...props
}: RescuetimeSummaryChartProps): ReactNode {
  const { data: lifeIndicatorData } = useQuery(api('life-indicator'));

  const chart = useMemo(
    () =>
      createRescuetimeSummaryChart({
        data,
        queries,
        start,
        end,
      }),
    [data, end, queries, start],
  );

  return chart ? (
    <CartesianChart {...props}>
      <DateLines
        key={`line:${chart.axis.x.min}`}
        className={styles.dateLines}
        {...dateLinesData}
        axis={chart.axis}
      />
      {lifeIndicatorData && (
        <EventIndicator
          data={lifeIndicatorData}
          axis={chart.axis}
          className={styles.eventIndicator}
        />
      )}
      <StackedHistoryBar
        className={styles.stackedHistoryBar}
        {...chart.history}
        axis={chart.axis}
        hideValues
      />
    </CartesianChart>
  ) : null;
}
