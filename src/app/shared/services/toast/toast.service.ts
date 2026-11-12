import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TOAST_DURATION_MS, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastMessage, ToastParams, ToastSeverity } from '../../models/toast.model';

/** `summary` e `detail` sono chiavi Transloco, tradotte quando il toast compare; `params` riempie i segnaposto */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly translateService = inject(TranslocoService);

  private readonly timers = new Map<number, ToastTimer>();

  private readonly state = signal<readonly ToastMessage[]>([]);
  private readonly nextId = signal<number>(0);
  public readonly toasts = this.state.asReadonly();
  /** Messaggi annunciati con calma (success, info) e subito (warn, error) */
  public readonly polite = computed(() => this.state().filter((t) => !isAssertive(t.severity)));
  public readonly assertive = computed(() => this.state().filter((t) => isAssertive(t.severity)));

  public success(summary: string, detail: string, params?: ToastParams): void {
    this.show('success', summary, detail, params);
  }
  public info(summary: string, detail: string, params?: ToastParams): void {
    this.show('info', summary, detail, params);
  }
  public warn(summary: string, detail: string, params?: ToastParams): void {
    this.show('warn', summary, detail, params);
  }
  public error(summary: string, detail: string, params?: ToastParams): void {
    this.show('error', summary, detail, params);
  }
  /** Ferma la chiusura automatica (hover, focus). Ogni `pause` va chiusa da un `resume` */
  public pause(id: number): void {
    const timer = this.timers.get(id);
    if (!timer) return;
    if (timer.holds++ > 0) return;
    clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.startedAt;
  }
  /** Riprende la chiusura automatica col tempo rimasto, quando non resta nessuna pausa attiva */
  public resume(id: number): void {
    const timer = this.timers.get(id);
    if (!timer || timer.holds === 0) return;
    if (--timer.holds === 0) this.schedule(id, timer.remaining);
  }
  // Ferma anche il timer: un messaggio chiuso a mano non deve far partire un'altra chiusura
  public dismiss(id: number): void {
    clearTimeout(this.timers.get(id)?.handle);
    this.timers.delete(id);
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
  private show(
    severity: ToastSeverity,
    summary: string,
    detail: string,
    params?: ToastParams,
  ): void {
    const id = this.nextId();
    this.nextId.update((n) => n + 1);
    this.state.update((toasts) => [
      ...toasts,
      {
        id,
        severity,
        summary: this.translateService.translate(summary, params),
        detail: this.translateService.translate(detail, params),
      },
    ]);
    this.schedule(id, TOAST_DURATION_MS[severity]);
    const [oldest] = this.state();
    if (this.state().length > TOAST_MAX_VISIBLE) this.dismiss(oldest.id);
  }
  private schedule(id: number, remaining: number): void {
    const holds = this.timers.get(id)?.holds ?? 0;
    this.timers.set(id, {
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
