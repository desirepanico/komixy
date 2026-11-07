import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../models/app-routes.model';
import { MAIN_PAGES } from './navigation.const';

describe('MAIN_PAGES', () => {
  it('usa solo percorsi esistenti in AppRoutes, senza doppioni', () => {
    const percorsi = MAIN_PAGES.map((pagina) => pagina.route);
    expect(new Set(percorsi).size).toBe(percorsi.length);
    expect(percorsi.every((p) => Object.values<string>(AppRoutes).includes(p))).toBe(true);
  });

  it('assegna a ogni pagina un ruolo almeno', () => {
    expect(MAIN_PAGES.every((pagina) => pagina.roles.length > 0)).toBe(true);
  });
});
