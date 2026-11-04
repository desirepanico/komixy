import { describe, expect, it } from 'vitest';
import { LibraryPage } from '../pages/library-page/library-page';
import { LIBRARY_ROUTES } from './library.routes';

describe('LIBRARY_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = LIBRARY_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(LibraryPage);
  });
});
