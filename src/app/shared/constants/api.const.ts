import { HttpContextToken } from '@angular/common/http';

// ─── Errori delle chiamate ───

/** Codice di errore dell'API → gruppo di traduzioni (`<gruppo>.summaryKo` e `<gruppo>.detailKo`) */
export const API_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  INVALID_CREDENTIALS: 'apiError.invalidCredentials',
  UNAUTHORIZED: 'apiError.unauthorized',
  SESSION_EXPIRED: 'apiError.sessionExpired',
  FORBIDDEN: 'apiError.forbidden',
  NOT_FOUND: 'apiError.notFound',
  EMAIL_ALREADY_EXISTS: 'apiError.emailAlreadyExists',
  VALIDATION_ERROR: 'apiError.validationError',
  TOO_MANY_REQUESTS: 'apiError.tooManyRequests',
  SERVER_ERROR: 'apiError.serverError',
};

/** Codice con cui un 401 di un utente già iscritto diventa «sessione scaduta» (token-expired interceptor) */
export const SESSION_EXPIRED_CODE = 'SESSION_EXPIRED';

// ─── Interceptor ───

/** Il base-url interceptor la mette a `true` sulle richieste del backend: fuso, token e sessione scaduta guardano solo quelle */
export const IS_API_REQUEST = new HttpContextToken<boolean>(() => false);

// ─── Intestazioni delle chiamate ───

/** Fuso orario dell'utente (timezone interceptor) */
export const TIMEZONE_HEADER = 'X-Timezone';

export const AUTH_HEADER = 'Authorization';

export const BEARER_PREFIX = 'Bearer ';

/** Identificativo anonimo dell'ospite (guest-id interceptor) */
export const GUEST_ID_HEADER = 'X-Guest-Id';
