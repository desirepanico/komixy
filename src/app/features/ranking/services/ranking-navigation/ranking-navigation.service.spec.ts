import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingNavigationService } from './ranking-navigation.service';

describe('RankingNavigationService', () => {
  let service: RankingNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(RankingNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone percorsi assoluti per i link', () => {
    expect(service.rankingLink).toEqual(['/', 'discover', 'ranking']);
    expect(service.discoverLink).toEqual(['/', 'discover']);
    expect(service.comicLink('w1')).toEqual(['/', 'comic', 'w1']);
  });

  it('torna a Scopri e va alla pagina di un fumetto', async () => {
    await service.goToDiscover();
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'discover']);

    await service.goToComic('w1');
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'comic', 'w1']);
  });
});
