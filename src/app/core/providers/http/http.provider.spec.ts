import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { environment } from '@env/environment';
import { AUTH_HEADER, GUEST_ID_HEADER, TIMEZONE_HEADER } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';
import { firstValueFrom } from 'rxjs';
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

  it('un ospite manda l’identificativo e non il token', () => {
    const session = TestBed.inject(SessionService);
    TestBed.inject(HttpClient).get('/ranking').subscribe();
    const controller = TestBed.inject(HttpTestingController);
    const { request } = controller.expectOne(`${environment.apiUrl}/ranking`);
    expect(request.headers.get(GUEST_ID_HEADER)).toBe(session.guestId());
    expect(request.headers.has(AUTH_HEADER)).toBe(false);
    controller.verify();
  });

  it('dopo il login la chiamata successiva porta il token della risposta', async () => {
    const controller = TestBed.inject(HttpTestingController);
    const login = firstValueFrom(
      TestBed.inject(AuthService).authenticate({ email: 'a@b.it', password: 'password1' }),
    );
    const loginRequest = controller.expectOne(`${environment.apiUrl}/auth/login`);
    expect(loginRequest.request.headers.has(AUTH_HEADER)).toBe(false);
    loginRequest.flush({
      error: { code: '', message: '' },
      result: { id: '1', email: 'a@b.it', userRole: 'user', token: 'abc' },
    });
    await login;

    TestBed.inject(HttpClient).get('/me').subscribe();
    const { request } = controller.expectOne(`${environment.apiUrl}/me`);
    expect(request.headers.get(AUTH_HEADER)).toBe('Bearer abc');
    controller.verify();
  });

  it('se il login non risponde con `token` non c’è nulla da mandare', async () => {
    const controller = TestBed.inject(HttpTestingController);
    const login = firstValueFrom(
      TestBed.inject(AuthService).authenticate({ email: 'a@b.it', password: 'password1' }),
    );
    controller.expectOne(`${environment.apiUrl}/auth/login`).flush({
      error: { code: '', message: '' },
      result: { id: '1', email: 'a@b.it', userRole: 'user', accessToken: 'abc' },
    });
    await login;

    TestBed.inject(HttpClient).get('/me').subscribe();
    const { request } = controller.expectOne(`${environment.apiUrl}/me`);
    expect(request.headers.has(AUTH_HEADER)).toBe(false);
    controller.verify();
  });
});
