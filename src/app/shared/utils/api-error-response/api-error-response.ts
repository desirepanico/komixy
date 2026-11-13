import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../models/api-response.model';

/**
 * L'errore di una chiamata all'API, con lo stato HTTP e il `code` del backend (stringa vuota se non c'è).
 * I servizi convertono con `fromHttpError` in un `catchError`, così chi chiama riceve questo tipo.
 */
export class ApiErrorResponse extends Error {
  public constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }

  public static fromHttpError(response: HttpErrorResponse): ApiErrorResponse {
    const apiError = ApiErrorResponse._apiErrorOf(response.error);
    return new ApiErrorResponse(
      response.status,
      apiError?.code ?? '',
      apiError?.message ?? response.message,
    );
  }

  /** Il corpo è una busta `ApiResponse` (l'errore sta in `error`) o direttamente un `ApiError` */
  private static _apiErrorOf(body: unknown): ApiError | null {
    if (ApiErrorResponse._isApiError(body)) return body;
    if (typeof body === 'object' && body !== null && 'error' in body) {
      return ApiErrorResponse._isApiError(body.error) ? body.error : null;
    }
    return null;
  }
  private static _isApiError(value: unknown): value is ApiError {
    return (
      typeof value === 'object' &&
      value !== null &&
      'code' in value &&
      'message' in value &&
      typeof value.code === 'string' &&
      typeof value.message === 'string'
    );
  }
}
