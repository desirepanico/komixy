import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AUTH_HEADER, BEARER_PREFIX, IS_API_REQUEST } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';

/**
 * Manda il token dell'iscritto al backend (`Authorization: Bearer <token>`): così il server sa chi fa la
 * chiamata senza che il login si ripeta. Lo aggiunge solo alle chiamate del backend, mai a siti di terzi.
 */
export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionService).token();
  if (!token || !req.context.get(IS_API_REQUEST)) return next(req);
  return next(req.clone({ setHeaders: { [AUTH_HEADER]: `${BEARER_PREFIX}${token}` } }));
};
