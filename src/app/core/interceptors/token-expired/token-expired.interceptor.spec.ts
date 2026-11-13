import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { SessionService } from '@shared/services/session/session.service';
import { ApiErrorResponse } from '@shared/utils/api-error-response/api-error-response';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tokenExpiredInterceptor } from './token-expired.interceptor';

describe('tokenExpiredInterceptor', () => {
  const url = `${environment.apiUrl}/me`;
  let http: HttpClient;
  let controller: HttpTestingController;
  let logout: ReturnType<typeof vi.spyOn>;
  let session: SessionService;

  const failWith = (status: number, body: object | null = null): Promise<unknown> => {
    const result = new Promise<unknown>((resolve) => {
      http.get(url).subscribe({ error: resolve });
    });
    controller.expectOne(url).flush(body, { status, statusText: 'Error' });
    return result;
  };
  const codeOf = async (promise: Promise<unknown>) =>
    ApiErrorResponse.fromHttpError((await promise) as never).code;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([tokenExpiredInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
    logout = vi.spyOn(TestBed.inject(AuthService), 'logout').mockImplementation(() => undefined);
  });

  it('con un 401 a un iscritto esce e l’errore ha il codice SESSION_EXPIRED', async () => {
    session.setAuthenticated(true);
    expect(await codeOf(failWith(401))).toBe('SESSION_EXPIRED');
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('tiene il codice che il backend ha già mandato', async () => {
    session.setAuthenticated(true);
    const body = { error: { code: 'UNAUTHORIZED', message: 'x' }, result: null };
    expect(await codeOf(failWith(401, body))).toBe('UNAUTHORIZED');
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('un 401 a un ospite (come le credenziali sbagliate) non esce', async () => {
    await failWith(401);
    expect(logout).not.toHaveBeenCalled();
  });

  it('un errore diverso da 401 non esce', async () => {
    session.setAuthenticated(true);
    await failWith(500);
    expect(logout).not.toHaveBeenCalled();
  });

  it('lascia passare le risposte riuscite', () => {
    session.setAuthenticated(true);
    let received: unknown;
    http.get(url).subscribe((value) => (received = value));
    controller.expectOne(url).flush({ ok: true });
    expect(received).toEqual({ ok: true });
    expect(logout).not.toHaveBeenCalled();
    controller.verify();
  });
});
