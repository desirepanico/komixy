import { describe, expect, it } from 'vitest';
import { ReleasesPage } from '../pages/releases-page/releases-page';
import { RELEASES_ROUTES } from './releases.routes';

describe('RELEASES_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = RELEASES_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(ReleasesPage);
  });
});
