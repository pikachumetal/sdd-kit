import { describe, it, expect } from 'vitest';
import { formatMoney } from '../../src/session/format.ts';

describe('formatMoney', () => {
  it.each([
    [0.015, '0,02'],
    [1.005, '1,01'],
    [2.675, '2,68'],
    [0.045, '0,05'],
    [1.25, '1,25'],
  ])('redondea %s como el script, hacia fuera en el empate decimal', (amount, expected) => {
    expect(formatMoney(amount)).toBe(expected);
  });
});
