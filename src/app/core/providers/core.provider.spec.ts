import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { provideCore } from './core.provider';

describe('provideCore', () => {
  it('registra insieme traduzioni e direzione delle transizioni', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideCore(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'discover', children: [] },
          { path: 'releases', children: [] },
        ]),
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const init = TestBed.inject(ApplicationInitStatus);
    http.expectOne((r) => r.url.startsWith('./i18n/it.json')).flush({ saluto: 'Ciao' });
    await init.donePromise;

    expect(TestBed.inject(TranslocoService).translate('saluto')).toBe('Ciao');

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/discover');
    await router.navigateByUrl('/releases');
    expect(document.documentElement.dataset['navDirection']).toBe('forward');
    http.verify();
    delete document.documentElement.dataset['navDirection'];
  });
});
