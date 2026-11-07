import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@shared/models/app-routes.model';
import { mainPageIndex } from './main-page-index';

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
