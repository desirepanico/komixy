import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { IS_API_REQUEST } from '@shared/constants/api.const';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { baseUrlInterceptor } from './base-url.interceptor';

describe('baseUrlInterceptor', () => {
  const apiUrl = environment.apiUrl;
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  // `environment` è un oggetto semplice: i test che ne cambiano l'indirizzo lo rimettono com'era
  afterEach(() => {
    environment.apiUrl = apiUrl;
  });

  it('parte dall’indirizzo dell’environment per un percorso del backend', () => {
    http.get('/auth/login').subscribe();
    controller.expectOne(`${apiUrl}/auth/login`);
    controller.verify();
  });

  it('segna come richiesta del backend ciò che completa', () => {
    http.get('/auth/login').subscribe();
    expect(controller.expectOne(`${apiUrl}/auth/login`).request.context.get(IS_API_REQUEST)).toBe(
      true,
    );
    controller.verify();
  });

  it.each([
    ['https://api.it', '/auth/login'],
    ['https://api.it/', '/auth/login'],
    ['https://api.it//', '/auth/login'],
    ['https://api.it/v1/', '/auth/login'],
  ])('con apiUrl %s e il percorso %s mette una sola barra in mezzo', (base, path) => {
    environment.apiUrl = base;
    http.get(path).subscribe();
    controller.expectOne(`${base.replace(/\/+$/, '')}/auth/login`);
    controller.verify();
  });

  it.each(['https://altro-sito.it/dati', './i18n/it.json', '//cdn.it/file.js'])(
    'non tocca e non segna %s',
    (url) => {
      http.get(url).subscribe();
      expect(controller.expectOne(url).request.context.get(IS_API_REQUEST)).toBe(false);
      controller.verify();
    },
  );
});
