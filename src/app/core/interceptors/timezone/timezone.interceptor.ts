import { HttpInterceptorFn } from '@angular/common/http';
import { IS_API_REQUEST, TIMEZONE_HEADER } from '@shared/constants/api.const';

/**
 * Dice al backend in che fuso orario è l'utente (`X-Timezone: Europe/Rome`). Serve perché «oggi», l'inizio
 * della settimana (la busta) e le date delle uscite dipendono dal fuso e il server non lo può dedurre dalla richiesta.
 */
export const timezoneInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(IS_API_REQUEST)) return next(req);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return next(req.clone({ setHeaders: { [TIMEZONE_HEADER]: timeZone } }));
};
