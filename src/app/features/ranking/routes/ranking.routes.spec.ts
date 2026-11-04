import { describe, expect, it } from 'vitest';
import { RankingPage } from '../pages/ranking-page/ranking-page';
import { RANKING_ROUTES } from './ranking.routes';

describe('RANKING_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = RANKING_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(RankingPage);
  });
});
