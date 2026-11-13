import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';
import { joinUrl } from '../join-url/join-url';

/**
 * Completa gli indirizzi del backend: i servizi scrivono `/auth/login` e qui diventa
 * `<apiUrl dell'environment>/auth/login`, così lo stesso codice funziona in locale, in dev e in produzione.
 * Restano com'erano gli indirizzi completi (`https://...`) e quelli relativi (`./i18n/it.json`).
 */
export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiPath = req.url.startsWith('/') && !req.url.startsWith('//');
  return next(isApiPath ? req.clone({ url: joinUrl(environment.apiUrl, req.url) }) : req);
};
