import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileNavigationService } from './profile-navigation.service';

describe('ProfileNavigationService', () => {
  let service: ProfileNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(ProfileNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('espone solo la rotta del profilo', () => {
    expect(service.profileLink).toEqual(['/', 'profile']);
  });

  it('va al profilo', async () => {
    await service.goToProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'profile']);
  });
});
