import { expect, test } from 'vitest';
import { getFlag } from '../getFlag.ts';

test('should return flag emoji for given country code', () => {
  expect(getFlag('US')).toBe('🇺🇸');
  expect(getFlag('kr')).toBe('🇰🇷');
  expect(getFlag('JP')).toBe('🇯🇵');
});
