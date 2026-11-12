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
});
