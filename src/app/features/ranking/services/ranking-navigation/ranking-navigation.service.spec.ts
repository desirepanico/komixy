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

  it('espone solo la rotta della classifica, sotto il percorso di Scopri', () => {
    expect(service.rankingLink).toEqual(['/', 'discover', 'ranking']);
  });

  it('va alla classifica', async () => {
    await service.goToRanking();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking']);
  });

  it("mette la vista scelta nell'indirizzo, senza aggiungere una voce alla cronologia", async () => {
    await service.goToView('cards');
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking'], {
      queryParams: { view: 'cards' },
      replaceUrl: true,
    });
    await service.goToView('list');
    expect(router.navigate).toHaveBeenLastCalledWith(['/', 'discover', 'ranking'], {
      queryParams: { view: 'list' },
      replaceUrl: true,
    });
  });
});
