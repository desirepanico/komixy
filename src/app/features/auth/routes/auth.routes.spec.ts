import { describe, expect, it } from 'vitest';
import { LoginPage } from '../pages/login-page/login-page';
import { AUTH_ROUTES } from './auth.routes';

describe('AUTH_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = AUTH_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(LoginPage);
  });
});
