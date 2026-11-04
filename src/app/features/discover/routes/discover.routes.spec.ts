import { describe, expect, it } from 'vitest';
import { DiscoverPage } from '../pages/discover-page/discover-page';
import { DISCOVER_ROUTES } from './discover.routes';

describe('DISCOVER_ROUTES', () => {
  it('la radice mostra la pagina Scopri', async () => {
    const [radice] = DISCOVER_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(DiscoverPage);
  });
});
