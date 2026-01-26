import type { Iso8601 } from '@iamssen/exocortex';
import type { DateItem, DurationItem } from '@ui/components';

export const quoteStartDates: (DateItem | DurationItem)[] = [
  { label: '3W', duration: { week: 3 } },
  { label: '1M', duration: { month: 1 } },
  { label: '6M', duration: { month: 6 } },
  { label: '1Y', duration: { year: 1 } },
  { label: '2Y', duration: { year: 2 } },
  { label: 'CORONA', value: '2020-01-01' as Iso8601 },
  { label: 'Y2016', value: '2016-01-01' as Iso8601 },
  { label: 'Y2010', value: '2010-01-01' as Iso8601 },
  { label: 'SUB-PRIME', value: '2007-01-01' as Iso8601 },
  { label: 'Y2000', value: '2000-01-01' as Iso8601 },
];

export const benchmarkStartDates: DateItem[] = [
  { label: 'CORONA', value: '2020-01-01' as Iso8601 },
  { label: 'Y2016', value: '2016-01-01' as Iso8601 },
  { label: 'Y2010', value: '2010-01-01' as Iso8601 },
  { label: 'SUB-PRIME', value: '2007-01-01' as Iso8601 },
  { label: 'Y2000', value: '2000-01-01' as Iso8601 },
];

export const bodyChartStartDurations: (DateItem | DurationItem)[] = [
  { label: '3M', duration: { month: 3 } },
  { label: '6M', duration: { month: 6 } },
  { label: '1Y', duration: { year: 1 } },
  { label: '2Y', duration: { year: 2 } },
  { label: '3Y', duration: { year: 3 } },
  { label: '4Y', duration: { year: 4 } },
  { label: '5Y', duration: { year: 5 } },
];

export const moneybookChartStartDurations: (DateItem | DurationItem)[] = [
  { label: '1Y', duration: { year: 1 } },
  { label: '2Y', duration: { year: 2 } },
  { label: '광교', value: '2016-12-01' as Iso8601 },
];
