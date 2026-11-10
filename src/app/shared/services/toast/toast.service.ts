import { Injectable, signal } from '@angular/core';
import { TOAST_DURATION_MS, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastMessage, ToastSeverity } from '../../models/toast.model';

/** I messaggi sono chiavi Transloco: il testo lo traduce `app-toast`. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly state = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  public readonly toasts = this.state.asReadonly();

  public success(key: string, params?: ToastMessage['params']): void {
    this.show('success', key, params);
  }

  public info(key: string, params?: ToastMessage['params']): void {
    this.show('info', key, params);
  }

  public warn(key: string, params?: ToastMessage['params']): void {
    this.show('warn', key, params);
  }

  public error(key: string, params?: ToastMessage['params']): void {
    this.show('error', key, params);
  }

  public dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(severity: ToastSeverity, key: string, params?: ToastMessage['params']): void {
    const id = this.nextId++;
    this.state.update((toasts) => [...toasts, { id, severity, key, params }]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), TOAST_DURATION_MS[severity]),
    );
    // Oltre il limite sparisce il più vecchio
    const [oldest] = this.state();
    if (this.state().length > TOAST_MAX_VISIBLE) this.dismiss(oldest.id);
  }
}
