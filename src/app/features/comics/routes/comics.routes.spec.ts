import { describe, expect, it } from 'vitest';
import { ComicDetailPage } from '../pages/comic-detail-page/comic-detail-page';
import { ComicsPage } from '../pages/comics-page/comics-page';
import { COMICS_ROUTES } from './comics.routes';

describe('COMICS_ROUTES', () => {
  it('la radice mostra la pagina dei fumetti', async () => {
    const [radice] = COMICS_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(ComicsPage);
  });

  it('la rotta :id mostra il dettaglio del fumetto', async () => {
    const dettaglio = COMICS_ROUTES[1];
    expect(dettaglio.path).toBe(':id');
    expect(await (dettaglio.loadComponent as () => Promise<unknown>)()).toBe(ComicDetailPage);
  });
});
