import { describe, expect, it } from 'vitest';
import { AppRoutes } from './app-routes.model';

describe('AppRoutes', () => {
  const paths = Object.values(AppRoutes);

  it('non ha paths duplicati', () => {
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('ha paths relativi, senza slash iniziale', () => {
    expect(paths.every((path) => !path.startsWith('/'))).toBe(true);
  });
});
