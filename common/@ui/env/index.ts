import type { Iso8601 } from '@iamssen/exocortex';
import type { DurationLike } from 'luxon';
import { DateTime } from 'luxon';

export const SUPER_EXCESS_CALORIES = 2800;
export const EXCESS_CALORIES = 2300;
export const OPTIMAL_CALORIES = 1900;

interface DateConfig {
  duration: string;
  date: Iso8601 | DurationLike;
}

export const QUOTE_HISTORY_SUMMARY_CONFIG: DateConfig[] = [
  { duration: '1W', date: { week: 1 } },
  { duration: '2W', date: { week: 2 } },
  { duration: '1M', date: { month: 1 } },
  { duration: '2M', date: { month: 2 } },
  {
    duration: 'YTD',
    date: DateTime.now().startOf('year').toISODate() as Iso8601,
  },
  { duration: '1Y', date: { year: 1 } },
  { duration: '2Y', date: { year: 2 } },
  { duration: '3Y', date: { year: 3 } },
  { duration: '4Y', date: { year: 4 } },
  { duration: '5Y', date: { year: 5 } },
  { duration: '6Y', date: { year: 6 } },
  { duration: '7Y', date: { year: 7 } },
  { duration: '8Y', date: { year: 8 } },
  { duration: '9Y', date: { year: 9 } },
  { duration: '10Y', date: { year: 10 } },
];
