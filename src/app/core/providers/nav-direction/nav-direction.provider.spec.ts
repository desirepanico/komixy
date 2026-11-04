import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { provideNavDirection } from './nav-direction.provider';

describe('provideNavDirection', () => {
  let router: Router;
  const direzione = () => document.documentElement.dataset['navDirection'];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideNavDirection(),
        provideRouter([
          { path: 'discover', children: [] },
          { path: 'releases', children: [] },
          { path: 'altra', children: [] },
        ]),
      ],
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;
    router = TestBed.inject(Router);
  });

  afterEach(() => delete document.documentElement.dataset['navDirection']);

  it('imposta "forward" passando a una pagina principale successiva e "back" tornando', async () => {
    await router.navigateByUrl('/discover');
    await router.navigateByUrl('/releases');
    expect(direzione()).toBe('forward');

    await router.navigateByUrl('/discover');
    expect(direzione()).toBe('back');
  });

  it('toglie la direzione se la pagina di arrivo non è principale', async () => {
    await router.navigateByUrl('/discover');
    await router.navigateByUrl('/releases');
    await router.navigateByUrl('/altra');
    expect(direzione()).toBeUndefined();
  });
});
