import { describe, expect, it } from 'vitest';
import { fanAngle } from './fan-layout';

describe('fanAngle', () => {
  it("la prima carta sta a destra e l'ultima a sinistra", () => {
    expect(fanAngle(1, 10, 90)).toBe(45);
    expect(fanAngle(10, 10, 90)).toBe(-45);
  });

  it('le carte di mezzo sono distribuite a passo costante', () => {
    const angles = Array.from({ length: 10 }, (_, i) => fanAngle(i + 1, 10, 90));
    const steps = angles.slice(1).map((a, i) => angles[i] - a);
    expect(new Set(steps.map((p) => p.toFixed(6))).size).toBe(1);
  });

  it('una carta sola sta dritta', () => {
    expect(fanAngle(1, 1, 90)).toBe(0);
  });
});
