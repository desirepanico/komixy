import { describe, expect, it } from 'vitest';

describe('test-setup', () => {
  it('aggiunge a jsdom ResizeObserver, matchMedia e scrollBy', () => {
    expect(typeof ResizeObserver).toBe('function');
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false);
    expect(typeof document.createElement('div').scrollBy).toBe('function');
  });

  it('i finti osservatori non fanno nulla ma si possono usare', () => {
    const observer = new ResizeObserver(() => {});
    expect(() => {
      observer.observe(document.body);
      observer.disconnect();
    }).not.toThrow();
  });

  it("svuota lo storage prima di ogni test: un test non lascia dati all'altro", () => {
    localStorage.setItem('chiave', 'valore');
  });

  it('lo storage è vuoto all’inizio del test successivo', () => {
    expect(localStorage.getItem('chiave')).toBeNull();
  });
});
