import type { Iso8601 } from '@iamssen/exocortex';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

export interface ImpendCountProps {
  date: Iso8601;
  impendDays?: number;
}

export function ImpendCount({
  date,
  impendDays = 60,
}: ImpendCountProps): ReactNode {
  const diff = useMemo(() => {
    return Math.ceil(DateTime.fromISO(date).diffNow('days').days);
  }, [date]);

  return diff > 0 && diff <= impendDays ? <sub> (d-{diff})</sub> : null;
}
