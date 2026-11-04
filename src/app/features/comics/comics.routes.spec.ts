import { describe, expect, it } from 'vitest';
import { ComicsPage } from './pages/comics-page/comics-page';
import { COMICS_ROUTES } from './comics.routes';

describe('COMICS_ROUTES', () => {
  it('la radice mostra la pagina dei fumetti', async () => {
    const [radice] = COMICS_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(ComicsPage);
  });

  it('ha la rotta figlia :id per il dettaglio', async () => {
    const figlia = COMICS_ROUTES[0].children?.[0];
    expect(figlia?.path).toBe(':id');
    expect(await (figlia?.loadComponent as () => Promise<unknown>)()).toBe(ComicsPage);
  });
});
