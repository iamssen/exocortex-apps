import type { Iso8601 } from '@iamssen/exocortex';
import type { HistoryLineRecord } from '@ui/cartesian-chart';
import { describe, expect, test } from 'vitest';
import { createTrendRecords } from '../data.ts';

function r(date: string, value: number): HistoryLineRecord {
  return {
    date: date as Iso8601,
    timestamp: new Date(date).getTime(),
    value,
  };
}

describe('createTrendRecords()', () => {
  test('should create trend records', () => {
    const records: HistoryLineRecord[][] = createTrendRecords(
      [
        r('2023-07-18', 100),
        r('2023-07-19', 110),
        r('2023-07-20', 80),
        r('2023-07-21', 130),
      ],
      [new Date('2023-07-18').getTime()],
    );

    expect(records[0][0].value).toBe(0);
    expect(records[0][1].value).toBe(0.1);
    expect(records[0][2].value).toBe(-0.2);
    expect(records[0][3].value).toBe(0.3);
  });

  test('should create reseted trend records', () => {
    const records: HistoryLineRecord[][] = createTrendRecords(
      [
        r('2023-07-18', 100),
        r('2023-07-19', 110),
        r('2023-07-20', 80),
        r('2023-07-21', 130),
        r('2023-07-22', 260),
        r('2023-07-23', 100),
        r('2023-07-24', 170),
      ],
      [
        new Date('2023-07-18').getTime(),
        new Date('2023-07-21').getTime(),
        new Date('2023-07-23').getTime(),
      ],
    );

    expect(records[0][0].value).toBe(0);
    expect(records[0][1].value).toBe(0.1);
    expect(records[0][2].value).toBe(-0.2);
    expect(records[1][0].value).toBe(0);
    expect(records[1][1].value).toBe(1);
    expect(records[2][0].value).toBe(0);
    expect(records[2][1].value).toBe(0.7);
  });

  test('should records[0] be zeroResetTimes[0]', () => {
    const records: HistoryLineRecord[][] = createTrendRecords(
      [
        r('2023-07-16', 100),
        r('2023-07-19', 110),
        r('2023-07-20', 80),
        r('2023-07-21', 130),
      ],
      [new Date('2023-07-18').getTime()],
    );

    expect(records[0][0].date).toBe('2023-07-18');
    expect(records[0][0].value).toBe(0);
  });
});
