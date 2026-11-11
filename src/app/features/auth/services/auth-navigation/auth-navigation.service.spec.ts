import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DiscoverNavigationService } from '@features/discover/services/discover-navigation/discover-navigation.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthNavigationService } from './auth-navigation.service';

describe('AuthNavigationService', () => {
  let service: AuthNavigationService;
  let router: Router;
  let discover: DiscoverNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(AuthNavigationService);
    router = TestBed.inject(Router);
    discover = TestBed.inject(DiscoverNavigationService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    vi.spyOn(discover, 'goToDiscover').mockResolvedValue(true);
  });

  it('espone solo le rotte del login', () => {
    expect(service.loginLink).toEqual(['/', 'login']);
    expect(router.serializeUrl(service.loginUrlTree('/admin'))).toBe('/login?returnUrl=%2Fadmin');
  });

  it('va al login', async () => {
    await service.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'login']);
  });

  it('dopo l’accesso torna alla pagina richiesta se è interna', async () => {
    await service.goAfterLogin('/releases?x=1');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases?x=1');
    expect(discover.goToDiscover).not.toHaveBeenCalled();
  });

  it('dopo l’accesso usa il servizio di Scopri se la pagina manca o è esterna', async () => {
    await service.goAfterLogin(null);
    await service.goAfterLogin('https://sito.it');
    expect(discover.goToDiscover).toHaveBeenCalledTimes(2);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
