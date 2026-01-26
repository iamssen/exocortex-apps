import { useSuspenseQuery } from '@tanstack/react-query';
import { SkinChart } from '@ui/charts';
import type { DateItem } from '@ui/components';
import { api } from '@ui/query';
import type { ReactNode } from 'react';

export interface SkinSectionProps {
  chartStartDate: DateItem;
}

export function SkinSection({ chartStartDate }: SkinSectionProps): ReactNode {
  const { data } = useSuspenseQuery(api('body', {}));

  if (data.daySkins.length === 0) {
    return null;
  }

  return (
    <figure aria-label="History of skin severity and pustules">
      <figcaption>
        Skin
        <sub aria-label="The date of the last collected data">
          {data.daySkins.at(-1)?.date}
        </sub>
      </figcaption>
      <SkinChart data={data.daySkins} start={chartStartDate.value} />
    </figure>
  );
}
