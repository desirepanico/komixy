import { inject, Injectable } from '@angular/core';
import { API_ERROR_MESSAGES } from '../../constants/api-error.const';
import { ApiErrorFallback } from '../../models/api-response.model';
import { ApiErrorResponse } from '../../utils/api-error-response/api-error-response';
import { ToastService } from '../toast/toast.service';

/**
 * Da chiamare in ogni `catch` di una chiamata all'API: se l'errore è un `ApiErrorResponse` con un codice
 * noto (`API_ERROR_MESSAGES`) mostra il messaggio di quel codice, altrimenti quello di default della chiamata.
 * `null` è un errore che non viene dall'API (un bug): il chiamante lo riconosce con `instanceof`.
 */
@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  private readonly _toast = inject(ToastService);

  public handle(error: ApiErrorResponse | null, fallback: ApiErrorFallback): void {
    const code = error?.code ?? '';
    const prefix = Object.hasOwn(API_ERROR_MESSAGES, code) ? API_ERROR_MESSAGES[code] : null;
    if (prefix) this._toast.error(`${prefix}.summaryKo`, `${prefix}.detailKo`);
    else this._toast.error(fallback.summary, fallback.detail);
  }
}
