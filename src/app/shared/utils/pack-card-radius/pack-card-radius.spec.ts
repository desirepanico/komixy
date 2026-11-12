import { describe, expect, it } from 'vitest';
import { packCardRadius } from './pack-card-radius';

describe('packCardRadius', () => {
  it('scala il raggio del tema con la scala della carta', () => {
    expect(packCardRadius(0.5)).toBe('calc(var(--radius-xl) * 0.5)');
  });

  it('con la carta intera il raggio è quello del tema', () => {
    expect(packCardRadius(1)).toBe('calc(var(--radius-xl) * 1)');
  });
});
