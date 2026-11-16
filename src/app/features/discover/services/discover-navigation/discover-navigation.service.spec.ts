import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
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

  it('espone solo le rotte di Scopri, con percorso assoluto', () => {
    expect(service.discoverLink).toEqual(['/', 'discover']);
    expect(router.serializeUrl(service.discoverUrlTree())).toBe('/discover');
  });

  it('va a Scopri', async () => {
    await service.goToDiscover();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  describe('goToFilters', () => {
    const none: DiscoverFilters = {
      kind: 'manga',
      search: '',
      category: [],
      format: [],
      status: [],
      volumes: [],
      theme: [],
      yearFrom: 1960,
      yearTo: 2026,
      adult: false,
    };

    it('scrive sempre la sezione, anche senza filtri', async () => {
      await service.goToFilters(none);
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover'], {
        queryParams: { type: 'manga' },
        replaceUrl: true,
      });
    });

    it('scrive ricerca, valori, anni e adulti e non aggiunge una voce alla cronologia', async () => {
      await service.goToFilters({
        ...none,
        search: 'berserk',
        category: ['seinen'],
        theme: ['horror', 'fantasy'],
        yearFrom: 1980,
        yearTo: 1999,
        adult: true,
      });
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover'], {
        queryParams: {
          type: 'manga',
          q: 'berserk',
          category: ['seinen'],
          theme: ['horror', 'fantasy'],
          from: 1980,
          to: 1999,
          adult: '1',
        },
        replaceUrl: true,
      });
    });
  });
});
