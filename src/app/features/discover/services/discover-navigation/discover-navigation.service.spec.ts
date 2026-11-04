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

  it('espone solo le rotte di Scopri, con percorso assoluto', () => {
    expect(service.discoverLink).toEqual(['/', 'discover']);
    expect(router.serializeUrl(service.discoverUrlTree())).toBe('/discover');
  });

  it('va a Scopri', async () => {
    await service.goToDiscover();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });
});
