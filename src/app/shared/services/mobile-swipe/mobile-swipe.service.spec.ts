import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileSwipeService } from './mobile-swipe.service';

describe('MobileSwipeService', () => {
  let service: MobileSwipeService;
  let router: Router;

  beforeEach(async () => {
    // Libreria e profilo non hanno ancora una rotta: lo swipe le deve saltare
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'discover', children: [] },
          { path: 'releases', children: [] },
          { path: 'altra', children: [] },
        ]),
      ],
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(MobileSwipeService);
  });

  const vaiA = async (url: string) => {
    await router.navigateByUrl(url);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  };

  it('va alla pagina successiva con lo swipe a sinistra', async () => {
    await vaiA('/discover');
    service.navigate('left');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/releases');
  });

  it('va alla pagina precedente con lo swipe a destra', async () => {
    await vaiA('/releases?x=1');
    service.navigate('right');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/discover');
  });

  it('non va prima della prima pagina', async () => {
    await vaiA('/discover');
    service.navigate('right');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it("non va oltre l'ultima pagina con una rotta", async () => {
    await vaiA('/releases'); // dopo releases non ci sono altre rotte configurate
    service.navigate('left');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('non fa nulla fuori dalle pagine principali', async () => {
    await vaiA('/altra');
    service.navigate('left');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
