import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TranslocoHttpLoader } from './transloco-http-loader.service';

describe('TranslocoHttpLoader', () => {
  let loader: TranslocoHttpLoader;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    loader = TestBed.inject(TranslocoHttpLoader);
    http = TestBed.inject(HttpTestingController);
  });

  it('legge il file JSON della lingua richiesta', () => {
    let result: unknown;
    loader.getTranslation('it').subscribe((t) => (result = t));

    const request = http.expectOne((r) => r.url.startsWith('./i18n/it.json'));
    request.flush({ menu: { main: 'Principale' } });

    expect(result).toEqual({ menu: { main: 'Principale' } });
    http.verify();
  });
});
