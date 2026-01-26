import { getHistoryLineLastRecord } from '@ui/cartesian-chart';
import type { KospiPeChartData } from '@ui/charts';
import { KospiPeChart } from '@ui/charts';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { MatchSymbol } from './helpers/MatchSymbol.tsx';
import { useSectionAttributes } from './helpers/useSectionAttributes.ts';
import styles from './styles.module.css';

export interface KospiPeSectionProps {
  chart: KospiPeChartData | undefined;
  children: ReactNode;
}

export function KospiPeSection({
  chart,
  children,
}: KospiPeSectionProps): ReactNode {
  const lastRecord = useMemo(() => {
    return chart
      ? getHistoryLineLastRecord(chart.history200.records)
      : undefined;
  }, [chart]);

  const matches = useMemo(() => {
    if (chart?.watches && chart.watches.length > 0 && lastRecord) {
      return {
        high:
          chart.watches.some(
            ({ price, watchFor }) =>
              watchFor === 'high' && lastRecord.value > price,
          ) || undefined,
        low:
          chart.watches.some(
            ({ price, watchFor }) =>
              watchFor === 'low' && lastRecord.value < price,
          ) || undefined,
      };
    }

    return {
      high: undefined,
      low: undefined,
    };
  }, [chart, lastRecord]);

  const attributes = useSectionAttributes(matches, lastRecord?.date);

  return (
    <figure className={styles.figure}>
      {chart && <KospiPeChart chart={chart} />}
      <figcaption {...attributes}>
        <h3>
          {children}
          <MatchSymbol {...matches} />
        </h3>
        {lastRecord && (
          <span>
            {lastRecord.value} <sub>({lastRecord.date})</sub>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
