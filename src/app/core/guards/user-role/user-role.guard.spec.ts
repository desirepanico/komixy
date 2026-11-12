import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '@shared/models/app-routes.model';
import { UserRole } from '@shared/models/user-role.model';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { userRoleGuard } from './user-role.guard';

describe('userRoleGuard', () => {
  let auth: AuthService;
  let router: Router;

  const run = () =>
    TestBed.runInInjectionContext(() =>
      userRoleGuard(UserRole.Admin)(
        {} as ActivatedRouteSnapshot,
        { url: '/admin' } as RouterStateSnapshot,
      ),
    );

  beforeEach(() => {
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('manda al login chi non è autenticato, ricordando la pagina richiesta', () => {
    const result = run() as UrlTree;
    expect(router.serializeUrl(result)).toBe(`/${AppRoutes.Login}?returnUrl=%2Fadmin`);
  });

  it('manda a discover chi non ha il ruolo richiesto', () => {
    auth.login({ id: '1', email: 'a@b.it', userRole: UserRole.User });
    const result = run() as UrlTree;
    expect(router.serializeUrl(result)).toBe(`/${AppRoutes.Discover}`);
  });

  it('lascia passare chi ha il ruolo richiesto', () => {
    auth.login({ id: '1', email: 'a@b.it', userRole: UserRole.Admin });
    expect(run()).toBe(true);
  });
});
