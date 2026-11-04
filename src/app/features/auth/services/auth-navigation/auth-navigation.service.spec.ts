import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthNavigationService } from './auth-navigation.service';

describe('AuthNavigationService', () => {
  let service: AuthNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  it('espone il percorso del login per i link', () => {
    expect(service.loginLink).toEqual(['/', 'login']);
  });

  it('per i guard costruisce il login con la pagina richiesta e il percorso di chi non ha il ruolo', () => {
    expect(router.serializeUrl(service.loginUrlTree('/admin'))).toBe('/login?returnUrl=%2Fadmin');
    expect(router.serializeUrl(service.forbiddenUrlTree())).toBe('/discover');
  });

  it('va al login', async () => {
    await service.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('dopo l’accesso torna alla pagina richiesta se è interna', async () => {
    await service.goAfterLogin('/releases?x=1');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases?x=1');
  });

  it('dopo l’accesso va a Scopri se manca la pagina richiesta o è esterna', async () => {
    await service.goAfterLogin(null);
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/discover');

    await service.goAfterLogin('https://sito.it');
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/discover');
  });
});
