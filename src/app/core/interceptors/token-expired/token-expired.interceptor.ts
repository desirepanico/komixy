import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { AuthService } from '@features/auth/services/auth/auth.service';
import { SESSION_EXPIRED_CODE } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';
import { ApiErrorResponse } from '@shared/utils/api-error-response/api-error-response';
import { catchError, throwError } from 'rxjs';
import { isApiRequest } from '../is-api-request/is-api-request';

/**
 * Se il backend risponde 401 a un iscritto, il token è scaduto o non vale più: esce (token tolto, si torna al login)
 * e l'errore prosegue con il codice `SESSION_EXPIRED`, così chi ha fatto la chiamata mostra «Sessione scaduta».
 * Un 401 del login (credenziali sbagliate) non conta: lì l'utente non è ancora iscritto.
 * `AuthService` si prende solo al momento del 401: `AuthService` usa `HttpClient`, che usa questo interceptor.
 */
export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const injector = inject(Injector);
  return next(req).pipe(
    catchError((error) => {
      const expired =
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        session.isAuthenticated() &&
        isApiRequest(req.url);
      if (!expired) return throwError(() => error);
      injector.get(AuthService).logout();
      return throwError(() => withExpiredCode(error));
    }),
  );
};

/** Se il backend ha già mandato un codice lo si tiene, altrimenti si mette quello della sessione scaduta */
function withExpiredCode(error: HttpErrorResponse): HttpErrorResponse {
  if (ApiErrorResponse.fromHttpError(error).code) return error;
  return new HttpErrorResponse({
    error: { error: { code: SESSION_EXPIRED_CODE, message: error.message }, result: null },
    headers: error.headers,
    status: error.status,
    statusText: error.statusText,
    url: error.url ?? undefined,
  });
}
