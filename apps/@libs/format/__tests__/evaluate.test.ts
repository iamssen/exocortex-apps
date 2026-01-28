import { compile } from 'mathjs';
import { describe, expect, test } from 'vitest';

describe('evaluate()', () => {
  test('math.js evaluate() test', () => {
    const x = compile('marketValue + 30');
    expect(x.evaluate({ marketValue: 40 })).toBe(70);
  });
});
