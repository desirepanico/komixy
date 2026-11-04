import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { describe, expect, it, vi } from 'vitest';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('avvia con le traduzioni caricate e il router configurato', async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    TestBed.configureTestingModule({
      providers: [...appConfig.providers, provideHttpClient(), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    const init = TestBed.inject(ApplicationInitStatus);
    http.expectOne((r) => r.url.startsWith('./i18n/it.json')).flush({ saluto: 'Ciao' });
    await init.donePromise;

    expect(TestBed.inject(TranslocoService).translate('saluto')).toBe('Ciao');

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    expect(router.url).toBe('/discover');
    vi.unstubAllGlobals();
  });
});
