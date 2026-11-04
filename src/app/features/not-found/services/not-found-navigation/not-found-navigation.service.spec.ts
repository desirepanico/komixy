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

  it('espone il percorso verso Scopri per il link', () => {
    expect(service.homeLink).toEqual(['/', 'discover']);
  });

  it('torna a Scopri', async () => {
    await service.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });
});
