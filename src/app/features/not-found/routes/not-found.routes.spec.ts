import { describe, expect, it } from 'vitest';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
import { NOT_FOUND_ROUTES } from './not-found.routes';

describe('NOT_FOUND_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = NOT_FOUND_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(NotFoundPage);
  });
});
