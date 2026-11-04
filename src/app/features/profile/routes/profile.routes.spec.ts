import { describe, expect, it } from 'vitest';
import { ProfilePage } from '../pages/profile-page/profile-page';
import { PROFILE_ROUTES } from './profile.routes';

describe('PROFILE_ROUTES', () => {
  it('la radice mostra la pagina della feature', async () => {
    const [radice] = PROFILE_ROUTES;
    expect(radice.path).toBe('');
    expect(await (radice.loadComponent as () => Promise<unknown>)()).toBe(ProfilePage);
  });
});
