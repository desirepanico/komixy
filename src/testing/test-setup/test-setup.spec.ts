import { describe, expect, it } from 'vitest';

describe('test-setup', () => {
  it('aggiunge a jsdom ResizeObserver, matchMedia e scrollBy', () => {
    expect(typeof ResizeObserver).toBe('function');
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
    expect(typeof document.createElement('div').scrollBy).toBe('function');
  });

  it('i finti osservatori non fanno nulla ma si possono usare', () => {
    const osservatore = new ResizeObserver(() => {});
    expect(() => {
      osservatore.observe(document.body);
      osservatore.disconnect();
    }).not.toThrow();
  });
});
