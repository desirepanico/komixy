import { Injectable, signal } from '@angular/core';
import { TOAST_DURATION_MS, TOAST_KEY_SUFFIX, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastMessage, ToastSeverity } from '../../models/toast.model';

/**
 * `action` è il nome di ciò che si sta facendo (es. `login`): il toast mostra titolo e dettaglio di
 * `<action>.summaryOk` e `<action>.detailOk` (success), `...Ko` (error), `...Info` o `...Warn`.
 * `params` sono i valori da inserire nei testi (es. `{ title }` per «{{ title }}»).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly state = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  public readonly toasts = this.state.asReadonly();

  public success(action: string, params?: ToastMessage['params']): void {
    this.show('success', action, params);
  }

  public info(action: string, params?: ToastMessage['params']): void {
    this.show('info', action, params);
  }

  public warn(action: string, params?: ToastMessage['params']): void {
    this.show('warn', action, params);
  }

  public error(action: string, params?: ToastMessage['params']): void {
    this.show('error', action, params);
  }

  // Toglie il messaggio e ferma il suo timer, così un messaggio chiuso a mano non fa partire una chiusura inutile
  public dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  // Aggiunge il messaggio, lo fa sparire da solo dopo la durata della sua severity e tiene al massimo TOAST_MAX_VISIBLE messaggi
  private show(severity: ToastSeverity, action: string, params?: ToastMessage['params']): void {
    const id = this.nextId++;
    const suffix = TOAST_KEY_SUFFIX[severity];
    const summary = `${action}.summary${suffix}`;
    const detail = `${action}.detail${suffix}`;
    this.state.update((toasts) => [...toasts, { id, severity, summary, detail, params }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), TOAST_DURATION_MS[severity]),
    );
    // Oltre il limite sparisce il più vecchio
    const [oldest] = this.state();
    if (this.state().length > TOAST_MAX_VISIBLE) this.dismiss(oldest.id);
  }
}
