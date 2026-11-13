import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { AUTH_HEADER } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { baseUrlInterceptor } from '../base-url/base-url.interceptor';
import { bearerTokenInterceptor } from './bearer-token.interceptor';

describe('bearerTokenInterceptor', () => {
  const url = `${environment.apiUrl}/me`;
  let http: HttpClient;
  let controller: HttpTestingController;
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([baseUrlInterceptor, bearerTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
  });

  it('con un token aggiunge Authorization: Bearer alle chiamate del backend', () => {
    session.setToken('abc');
    http.get('/me').subscribe();
    expect(controller.expectOne(url).request.headers.get(AUTH_HEADER)).toBe('Bearer abc');
    controller.verify();
  });

  it('senza token (ospite) non aggiunge nulla', () => {
    http.get('/me').subscribe();
    expect(controller.expectOne(url).request.headers.has(AUTH_HEADER)).toBe(false);
    controller.verify();
  });

  it('non manda il token a un altro sito', () => {
    session.setToken('abc');
    http.get('https://altro-sito.it/dati').subscribe();
    const request = controller.expectOne('https://altro-sito.it/dati');
    expect(request.request.headers.has(AUTH_HEADER)).toBe(false);
    controller.verify();
  });
});
