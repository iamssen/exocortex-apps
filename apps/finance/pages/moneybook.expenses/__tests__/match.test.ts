import { buildMinimistArgv } from '@ui/data-utils';
import { minimatch } from 'minimatch';
import minimist from 'minimist';
import { describe, expect, test } from 'vitest';

describe('search text match test', () => {
  test('should match texts', () => {
    expect(minimatch('a/b/c', 'a/b/c')).toBeTruthy();
    expect(minimatch('a/b/c', 'a/*/c')).toBeTruthy();
    expect(minimatch('a/b/c', 'a/**')).toBeTruthy();
    expect(minimatch('a/b/c', '*/b/*')).toBeTruthy();
    expect(minimatch('a/b/c', '**/c')).toBeTruthy();
    expect(minimatch('a/b/c', 'a/**/c')).toBeTruthy();
    expect(minimatch('a/b/c', 'a/{a,b,d}/c')).toBeTruthy();

    expect(minimatch('a/b', '{a/*,c}')).toBeTruthy();
    expect(minimatch('a/b', '{a/{b,d},c}')).toBeTruthy();
    expect(minimatch('a/c', '{a/{b,d},c}')).toBeFalsy();
    expect(minimatch('c', '{a/*,c}')).toBeTruthy();

    expect(minimatch('a', 'a{,/{c,d}}')).toBeTruthy();
    expect(minimatch('a/c', 'a{,/{c,d}}')).toBeTruthy();
    expect(minimatch('a/e', 'a{,/{c,d}}')).toBeFalsy();
    expect(minimatch('a', 'a{,/*}')).toBeTruthy();
    expect(minimatch('a/c', 'a{,/*}')).toBeTruthy();
    expect(minimatch('a/e', 'a{,/*}')).toBeTruthy();

    expect(minimatch('교통/자동차 보험', '교통/*')).toBeTruthy();
    expect(minimatch('교통/자동차 보험', '교통/자동차 *')).toBeTruthy();
    expect(
      minimatch('교통/자동차 보험', '교통/{자동차 보험,하이패스}'),
    ).toBeTruthy();
    expect(
      minimatch('교통/하이패스', '교통/{자동차 보험,하이패스}'),
    ).toBeTruthy();
  });

  test('should match argv', () => {
    expect(
      minimist(buildMinimistArgv('--category "교통/자동차 보험"')),
    ).toMatchObject({ category: '교통/자동차 보험' });

    expect(
      minimist(buildMinimistArgv('--category "교통/{자동차 보험,하이패스}"')),
    ).toMatchObject({ category: '교통/{자동차 보험,하이패스}' });
  });
});
