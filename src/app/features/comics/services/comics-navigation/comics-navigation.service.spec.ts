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

  it('espone solo le rotte dei fumetti, con percorsi assoluti', () => {
    expect(service.comicsLink).toEqual(['/', 'comic']);
    expect(service.detailLink('42')).toEqual(['/', 'comic', '42']);
  });

  it('va alla pagina di un fumetto', async () => {
    await service.goToDetail('42');
    expect(router.navigate).toHaveBeenCalledWith(['/', 'comic', '42']);
  });
});
