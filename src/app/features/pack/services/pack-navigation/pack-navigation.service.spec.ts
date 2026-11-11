import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PackNavigationService } from './pack-navigation.service';

describe('PackNavigationService', () => {
  let service: PackNavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(PackNavigationService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it("espone solo la rotta dell'apertura, sotto il percorso di Scopri", () => {
    expect(service.packLink).toEqual(['/', 'discover', 'pack']);
  });

  it("va all'apertura della busta", async () => {
    await service.goToPack();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'pack']);
  });
});
