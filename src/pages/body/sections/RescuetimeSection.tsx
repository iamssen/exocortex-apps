import type {
  AggregatedRescuetimeHistory,
  ASC,
  ExpiryData,
  Rescuetime,
  RescuetimeHistory,
} from '@iamssen/exocortex';
import { useSuspenseQuery } from '@tanstack/react-query';
import { RescuetimeSummaryChart } from '@ui/charts';
import type { DateItem } from '@ui/components';
import { api } from '@ui/query';
import type { ReactNode } from 'react';
import { rescuetimeSummaryQuery } from '../env.ts';

export interface RescuetimeSectionProps {
  dataKey: 'weeks' | 'months';
  chartStartDate: DateItem;
}

function selectData(
  { data }: ExpiryData<Rescuetime>,
  dataKey: 'weeks' | 'months',
) {
  const chartData = data[
    dataKey === 'weeks' ? 'weekly' : 'monthly'
  ] as ASC<AggregatedRescuetimeHistory>;

  const lastRecord = chartData
    .at(-1)
    ?.children.findLast((item): item is RescuetimeHistory => !!item);

  return {
    chartData,
    lastRecord,
  };
}

export function RescuetimeSection({
  dataKey,
  chartStartDate,
}: RescuetimeSectionProps): ReactNode {
  const {
    data: { chartData, lastRecord },
  } = useSuspenseQuery(
    api('rescuetime', {}, { select: (d) => selectData(d, dataKey) }),
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <figure aria-label="RescueTime activity history">
      <figcaption>
        Rescue Time
        <sub aria-label="The date of the last collected data">
          {lastRecord?.date.slice(0, 10)}
        </sub>
      </figcaption>
      <RescuetimeSummaryChart
        data={chartData}
        queries={rescuetimeSummaryQuery}
        start={chartStartDate.value}
      />
    </figure>
  );
}
