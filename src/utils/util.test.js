import { describe, expect, it } from 'vitest';
import { get24H, get3Days, getInteger, getRandomNumber } from './util';

describe('utils', () => {
  it('returns 24 time slots from 00:00 to 23:00', () => {
    const hours = get24H();
    expect(hours).toHaveLength(24);
    expect(hours[0]).toBe('00:00');
    expect(hours[23]).toBe('23:00');
  });

  it('returns three consecutive day strings', () => {
    const days = get3Days();
    expect(days).toHaveLength(3);
    days.forEach((d) => expect(d).toMatch(/^\d{2}-\d{2}$/));
  });

  it('truncates decimal numbers', () => {
    expect(getInteger(10.99)).toBe(10);
    expect(getInteger(-3.5)).toBe(-3);
  });

  it('returns random number within min and max range', () => {
    const value = getRandomNumber(10, 20);
    expect(value).toBeGreaterThanOrEqual(10);
    expect(value).toBeLessThan(20);
  });
});
