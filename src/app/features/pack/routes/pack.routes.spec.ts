import { describe, expect, it } from 'vitest';
import { PackOpeningPage } from '../pages/pack-opening-page/pack-opening-page';
import { PACK_ROUTES } from './pack.routes';

describe('PACK_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = PACK_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(PackOpeningPage);
  });
});
