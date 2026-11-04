import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComicsNavigationService } from './comics-navigation.service';

describe('ComicsNavigationService', () => {
  let service: ComicsNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(ComicsNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone percorsi assoluti per i link', () => {
    expect(service.comicsLink).toEqual(['/', 'comic']);
    expect(service.detailLink('42')).toEqual(['/', 'comic', '42']);
    expect(service.discoverLink).toEqual(['/', 'discover']);
  });

  it('va al dettaglio di un fumetto e torna a Scopri', async () => {
    await service.goToDetail('42');
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'comic', '42']);

    await service.goToDiscover();
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'discover']);
  });
});
