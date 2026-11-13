export interface ApiResponse<T> {
  error: ApiError;
  result: T;
}

export interface ApiError {
  code: string;
  message: string;
}

/** Chiavi Transloco del messaggio da mostrare quando l'errore non ha un codice noto */
export interface ApiErrorFallback {
  summary: string;
  detail: string;
}
