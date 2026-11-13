import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { beforeEach, describe, it } from 'vitest';
import { baseUrlInterceptor } from './base-url.interceptor';

describe('baseUrlInterceptor', () => {
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

  it('parte dall’indirizzo dell’environment per un percorso del backend', () => {
    http.get('/auth/login').subscribe();
    controller.expectOne(`${environment.apiUrl}/auth/login`);
    controller.verify();
  });

  it.each(['https://altro-sito.it/dati', './i18n/it.json', '//cdn.it/file.js'])(
    'non tocca %s',
    (url) => {
      http.get(url).subscribe();
      controller.expectOne(url);
      controller.verify();
    },
  );
});
