import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '@env/environment';
import { AUTH_HEADER, TIMEZONE_HEADER } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttp } from './http.provider';

describe('provideHttp', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttp(), provideHttpClientTesting(), provideRouter([])],
    });
  });

  it('completa l’indirizzo e aggiunge fuso e token a una chiamata del backend', () => {
    TestBed.inject(SessionService).setToken('abc');
    TestBed.inject(HttpClient).get('/comics').subscribe();
    const controller = TestBed.inject(HttpTestingController);
    const { request } = controller.expectOne(`${environment.apiUrl}/comics`);
    expect(request.headers.get(TIMEZONE_HEADER)).toBeTruthy();
    expect(request.headers.get(AUTH_HEADER)).toBe('Bearer abc');
    controller.verify();
  });

  it('lascia stare le traduzioni (indirizzo relativo, senza intestazioni)', () => {
    TestBed.inject(HttpClient).get('./i18n/it.json').subscribe();
    const controller = TestBed.inject(HttpTestingController);
    const { request } = controller.expectOne('./i18n/it.json');
    expect(request.headers.has(TIMEZONE_HEADER)).toBe(false);
    controller.verify();
  });
});
