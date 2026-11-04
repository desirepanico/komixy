import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundNavigationService } from './not-found-navigation.service';

describe('NotFoundNavigationService', () => {
  let service: NotFoundNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(NotFoundNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone solo la rotta della pagina 404', () => {
    expect(service.notFoundLink).toEqual(['/', 'not-found']);
  });

  it('mostra la pagina 404 senza cambiare l’indirizzo nella barra', async () => {
    await service.goToNotFound();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'not-found'], { skipLocationChange: true });
  });
});
