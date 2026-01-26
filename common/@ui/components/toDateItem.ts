import type { Iso8601 } from '@iamssen/exocortex';
import { DateTime } from 'luxon';
import type { DateItem, DurationItem } from './SingleDateSelect.tsx';

export function toDateItem(source: DateItem | DurationItem): DateItem {
  if ('value' in source) {
    return source;
  }

  return {
    label: source.label,
    value: DateTime.now().minus(source.duration).toISODate() as Iso8601,
  };
}
