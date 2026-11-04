import { describe, expect, it } from 'vitest';
import { AppRoutes } from '@shared/constants/app-routes/app-routes.const';
import { DiscoverPage } from '../pages/discover-page/discover-page';
import { RankingPage } from '@features/ranking/pages/ranking-page/ranking-page';
import { DISCOVER_ROUTES } from './discover.routes';

describe('DISCOVER_ROUTES', () => {
  const carica = (indice: number) =>
    (DISCOVER_ROUTES[indice].loadComponent as () => Promise<unknown>)();

  it('la radice mostra la pagina Scopri', async () => {
    expect(DISCOVER_ROUTES[0].path).toBe('');
    expect(await carica(0)).toBe(DiscoverPage);
  });

  it('discover/ranking mostra la classifica', async () => {
    expect(DISCOVER_ROUTES[1].path).toBe(AppRoutes.Ranking);
    expect(await carica(1)).toBe(RankingPage);
  });
});
