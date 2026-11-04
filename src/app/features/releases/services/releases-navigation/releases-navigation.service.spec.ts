import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReleasesNavigationService } from './releases-navigation.service';

describe('ReleasesNavigationService', () => {
  let service: ReleasesNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(ReleasesNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone solo la rotta delle uscite', () => {
    expect(service.releasesLink).toEqual(['/', 'releases']);
  });

  it('va alle uscite', async () => {
    await service.goToReleases();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'releases']);
  });
});
