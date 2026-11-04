import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscoverNavigationService } from './discover-navigation.service';

describe('DiscoverNavigationService', () => {
  let service: DiscoverNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(DiscoverNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone percorsi assoluti per i link', () => {
    expect(service.discoverLink).toEqual(['/', 'discover']);
    expect(service.rankingLink).toEqual(['/', 'discover', 'ranking']);
    expect(service.comicLink('7')).toEqual(['/', 'comic', '7']);
  });

  it('va alla classifica e alla pagina di un fumetto', async () => {
    await service.goToRanking();
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'discover', 'ranking']);

    await service.goToComic('7');
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'comic', '7']);
  });
});
