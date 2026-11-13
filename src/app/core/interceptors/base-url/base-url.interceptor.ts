import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';
import { IS_API_REQUEST } from '@shared/constants/api.const';

/**
 * Completa gli indirizzi del backend: i servizi scrivono `/auth/login` e qui diventa
 * `<apiUrl dell'environment>/auth/login`, così lo stesso codice funziona in locale, in dev e in produzione.
 * Le barre in mezzo si normalizzano (`https://api.it/` + `/auth/login` = `https://api.it/auth/login`).
 * Resta com'è ciò che non inizia con `/` (indirizzi completi, `./i18n/it.json`) e le richieste del backend
 * si segnano con `IS_API_REQUEST`: gli altri interceptor non devono rifare questo controllo.
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiPath = req.url.startsWith('/') && !req.url.startsWith('//');
  if (!isApiPath) return next(req);
  const url = `${environment.apiUrl.replace(/\/+$/, '')}/${req.url.replace(/^\/+/, '')}`;
  return next(req.clone({ url, context: req.context.set(IS_API_REQUEST, true) }));
};
