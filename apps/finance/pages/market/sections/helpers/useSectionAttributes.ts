import type { Iso8601 } from '@iamssen/exocortex';
import { DateTime } from 'luxon';
import type { MatchHighLow } from './MatchSymbol.tsx';

interface UseSelectionAttributesResult {
  'data-match-high': boolean | undefined;
  'data-match-low': boolean | undefined;
  'data-staled-level': number | undefined;
}

export function useSectionAttributes(
  matches: MatchHighLow,
  date?: Iso8601,
  durationInDays?: number,
): UseSelectionAttributesResult {
  const result: UseSelectionAttributesResult = {
    'data-match-high': matches.high,
    'data-match-low': matches.low,
    'data-staled-level': undefined,
  };

  if (date) {
    const baseDate =
      typeof durationInDays === 'number'
        ? DateTime.fromISO(date).plus({ days: durationInDays })
        : DateTime.fromISO(date);

    return {
      ...result,
      'data-staled-level': Math.min(
        Math.floor(baseDate.diffNow('days').days / -30),
        5,
      ),
    };
  }

  return result;
}
