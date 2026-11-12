import { Location } from '@angular/common';
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

  describe('goBack', () => {
    let location: Location;

    beforeEach(() => {
      location = TestBed.inject(Location);
      vi.spyOn(location, 'back').mockImplementation(() => undefined);
    });

    it("torna alla pagina precedente se c'è una pagina dell'app", () => {
      vi.spyOn(location, 'getState').mockReturnValue({ navigationId: 3 });
      service.goBack();
      expect(location.back).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('va a Scopri se il dettaglio è la prima pagina aperta', () => {
      vi.spyOn(location, 'getState').mockReturnValue({ navigationId: 1 });
      service.goBack();
      expect(location.back).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
    });

    it("va a Scopri se non c'è uno stato di cronologia", () => {
      vi.spyOn(location, 'getState').mockReturnValue(null);
      service.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
    });
  });
});
