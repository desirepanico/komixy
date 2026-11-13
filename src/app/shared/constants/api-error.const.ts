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

/** Quanti livelli di `error` si seguono per trovare il codice */
export const API_ERROR_MAX_DEPTH = 3;
