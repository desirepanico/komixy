import { inject, Injectable } from '@angular/core';
import { API_ERROR_MESSAGES } from '../../constants/ui.const';
import { ApiErrorFallback } from '../../models/api-response.model';
import { isApiError } from '../../utils/api-url/api-url';
import { ToastService } from '../toast/toast.service';

/** Quanti livelli di `error` si seguono per trovare il codice */
const MAX_DEPTH = 3;

/**
 * Da chiamare in ogni `catch` di una chiamata all'API: se l'errore ha un codice noto (`API_ERROR_MESSAGES`)
 * mostra il messaggio di quel codice, altrimenti quello di default passato dalla chiamata.
 */
@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  private readonly _toast = inject(ToastService);

  public handle(error: unknown, fallback: ApiErrorFallback): void {
    const prefix = this._messageKey(this._codeOf(error));
    if (prefix) this._toast.error(`${prefix}.summaryKo`, `${prefix}.detailKo`);
    else this._toast.error(fallback.summary, fallback.detail);
  }

  /**
   * Il codice è in `code` (un `ApiError`), in `error.code` (`HttpErrorResponse` con il corpo `ApiError`)
   * o in `error.error.code` (`HttpErrorResponse` con il corpo `ApiResponse`)
   */
  private _codeOf(error: unknown): string | null {
    let current: unknown = error;
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
      if (!current || typeof current !== 'object') return null;
      if (isApiError(current) && current.code) return current.code;
      current = 'error' in current ? current.error : null;
    }
    return null;
  }
  private _messageKey(code: string | null): string | null {
    return code !== null && Object.hasOwn(API_ERROR_MESSAGES, code)
      ? API_ERROR_MESSAGES[code]
      : null;
  }
}
