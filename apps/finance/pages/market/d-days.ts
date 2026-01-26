import type { Iso8601 } from '@iamssen/exocortex';
import { DateTime } from 'luxon';

export interface DDay {
  name: string;
  day: Iso8601;
  link: string;
}

export interface DDayView extends DDay {
  dday: number;
}

function createDDay(name: string, day: Iso8601, link: string): DDayView {
  const dday = Math.floor(DateTime.fromISO(day).diffNow('days').days);

  return {
    name,
    day,
    dday,
    link,
  };
}

export const dDays: readonly DDayView[] = [
  createDDay(
    '미국 대선',
    '2024-11-05' as Iso8601,
    'https://namu.wiki/w/2024%EB%85%84%20%EB%AF%B8%EA%B5%AD%20%EB%8C%80%ED%86%B5%EB%A0%B9%20%EC%84%A0%EA%B1%B0',
  ),
  createDDay(
    '미국 중간선거',
    '2026-11-03' as Iso8601,
    'https://namu.wiki/w/2026%EB%85%84%20%EB%AF%B8%EA%B5%AD%20%EC%A4%91%EA%B0%84%EC%84%A0%EA%B1%B0',
  ),
];
