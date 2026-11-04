import { describe, expect, it } from 'vitest';
import { AppRoutes } from './app-routes.const';
import { MAIN_PAGES, mainPageIndex } from './main-pages.const';

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

describe('mainPageIndex', () => {
  it('trova la posizione di una pagina principale', () => {
    expect(mainPageIndex(`/${AppRoutes.Discover}`)).toBe(0);
    expect(mainPageIndex(`/${AppRoutes.Releases}`)).toBe(1);
  });

  it('ignora query string, fragment e slash iniziali', () => {
    expect(mainPageIndex(`//${AppRoutes.Releases}?x=1#top`)).toBe(1);
  });

  it('restituisce -1 per una pagina non principale', () => {
    expect(mainPageIndex('/discover/ranking')).toBe(-1);
    expect(mainPageIndex('/')).toBe(-1);
  });
});
