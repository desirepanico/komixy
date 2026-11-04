import { describe, expect, it } from 'vitest';
import { AppRoutes } from './app-routes.const';

describe('AppRoutes', () => {
  const percorsi = Object.values(AppRoutes);

  it('non ha percorsi duplicati', () => {
    expect(new Set(percorsi).size).toBe(percorsi.length);
  });

  it('ha percorsi relativi, senza slash iniziale', () => {
    expect(percorsi.every((percorso) => !percorso.startsWith('/'))).toBe(true);
  });
});
