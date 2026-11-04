import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '../../app.routes';
import { UserRole } from '@features/auth/models/auth.model';
import { AuthService } from '@features/auth/services/auth.service';
import { userRoleGuard } from './user-role.guard';

describe('userRoleGuard', () => {
  let auth: AuthService;
  let router: Router;

  const esegui = () =>
    TestBed.runInInjectionContext(() =>
      userRoleGuard(UserRole.Admin)(
        {} as ActivatedRouteSnapshot,
        { url: '/admin' } as RouterStateSnapshot,
      ),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('manda al login chi non è autenticato, ricordando la pagina richiesta', () => {
    const risultato = esegui() as UrlTree;
    expect(router.serializeUrl(risultato)).toBe(`/${AppRoutes.Login}?returnUrl=%2Fadmin`);
  });

  it('manda a discover chi non ha il ruolo richiesto', () => {
    auth.login({ id: '1', email: 'a@b.it', userRole: UserRole.User });
    const risultato = esegui() as UrlTree;
    expect(router.serializeUrl(risultato)).toBe(`/${AppRoutes.Discover}`);
  });

  it('lascia passare chi ha il ruolo richiesto', () => {
    auth.login({ id: '1', email: 'a@b.it', userRole: UserRole.Admin });
    expect(esegui()).toBe(true);
  });
});
