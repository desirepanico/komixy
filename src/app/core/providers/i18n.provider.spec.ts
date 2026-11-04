import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { describe, expect, it } from 'vitest';
import { provideI18n } from './i18n.provider';

describe('provideI18n', () => {
  it("carica le traduzioni italiane prima che l'app sia pronta", async () => {
    TestBed.configureTestingModule({
      providers: [provideI18n(), provideHttpClient(), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);
    const init = TestBed.inject(ApplicationInitStatus);

    http.expectOne((r) => r.url.startsWith('./i18n/it.json')).flush({ saluto: 'Ciao' });
    await init.donePromise;

    const transloco = TestBed.inject(TranslocoService);
    expect(transloco.getActiveLang()).toBe('it');
    expect(transloco.translate('saluto')).toBe('Ciao');
    http.verify();
  });
});
