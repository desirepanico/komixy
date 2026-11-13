import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GUEST_ID_HEADER, IS_API_REQUEST } from '@shared/constants/api.const';
import { SessionService } from '@shared/services/session/session.service';

/**
 * Per un ospite (senza account, quindi senza token) manda `X-Guest-Id`: un identificativo anonimo che il
 * backend usa per riconoscerlo, per esempio per contare la sua apertura settimanale della busta.
 * Un iscritto si riconosce dal token (`bearerTokenInterceptor`) e non lo manda.
 */
export const guestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  if (!session.isGuest() || !req.context.get(IS_API_REQUEST)) return next(req);
  return next(req.clone({ setHeaders: { [GUEST_ID_HEADER]: session.guestId() } }));
};
