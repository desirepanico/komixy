import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TOAST_DURATION_MS, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastMessage, ToastParams, ToastSeverity } from '../../models/toast.model';

/** `summary` e `detail` sono chiavi Transloco, tradotte quando il toast compare; `params` riempie i segnaposto */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _translateService = inject(TranslocoService);

  private readonly _timers = new Map<number, ToastTimer>();

  private readonly _state = signal<readonly ToastMessage[]>([]);
  private readonly _nextId = signal<number>(0);
  public readonly toasts = this._state.asReadonly();
  /** Messaggi annunciati con calma (success, info) e subito (warn, error) */
  public readonly polite = computed(() => this._state().filter((t) => !isAssertive(t.severity)));
  public readonly assertive = computed(() => this._state().filter((t) => isAssertive(t.severity)));

  public success(summary: string, detail: string, params?: ToastParams): void {
    this._show('success', summary, detail, params);
  }
  public info(summary: string, detail: string, params?: ToastParams): void {
    this._show('info', summary, detail, params);
  }
  public warn(summary: string, detail: string, params?: ToastParams): void {
    this._show('warn', summary, detail, params);
  }
  public error(summary: string, detail: string, params?: ToastParams): void {
    this._show('error', summary, detail, params);
  }
  /** Ferma la chiusura automatica (hover, focus). Ogni `pause` va chiusa da un `resume` */
  public pause(id: number): void {
    const timer = this._timers.get(id);
    if (!timer) return;
    if (timer.holds++ > 0) return;
    clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.startedAt;
  }
  /** Riprende la chiusura automatica col tempo rimasto, quando non resta nessuna pausa attiva */
  public resume(id: number): void {
    const timer = this._timers.get(id);
    if (!timer || timer.holds === 0) return;
    if (--timer.holds === 0) this._schedule(id, timer.remaining);
  }
  // Ferma anche il timer: un messaggio chiuso a mano non deve far partire un'altra chiusura
  public dismiss(id: number): void {
    clearTimeout(this._timers.get(id)?.handle);
    this._timers.delete(id);
    this._state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
  private _show(
    severity: ToastSeverity,
    summary: string,
    detail: string,
    params?: ToastParams,
  ): void {
    const id = this._nextId();
    this._nextId.update((n) => n + 1);
    this._state.update((toasts) => [
      ...toasts,
      {
        id,
        severity,
        summary: this._translateService.translate(summary, params),
        detail: this._translateService.translate(detail, params),
      },
    ]);
    this._schedule(id, TOAST_DURATION_MS[severity]);
    const [oldest] = this._state();
    if (this._state().length > TOAST_MAX_VISIBLE) this.dismiss(oldest.id);
  }
  private _schedule(id: number, remaining: number): void {
    const holds = this._timers.get(id)?.holds ?? 0;
    this._timers.set(id, {
      handle: setTimeout(() => this.dismiss(id), remaining),
      startedAt: Date.now(),
      remaining,
      holds,
    });
  }
}

interface ToastTimer {
  handle: ReturnType<typeof setTimeout>;
  startedAt: number;
  remaining: number;
  /** Quante pause sono attive (hover e focus contano separatamente) */
  holds: number;
}

function isAssertive(severity: ToastSeverity): boolean {
  return severity === 'warn' || severity === 'error';
}
