import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../models/app-routes.model';
import { MAIN_PAGES } from './navigation.const';

describe('MAIN_PAGES', () => {
  it('usa solo paths esistenti in AppRoutes, senza doppioni', () => {
    const paths = MAIN_PAGES.map((page) => page.route);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((p) => Object.values<string>(AppRoutes).includes(p))).toBe(true);
  });

  it('assegna a ogni pagina un ruolo almeno', () => {
    expect(MAIN_PAGES.every((page) => page.roles.length > 0)).toBe(true);
  });
});
