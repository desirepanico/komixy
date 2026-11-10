import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TOAST_DURATION_MS, TOAST_MAX_VISIBLE } from '../../constants/ui.const';
import { ToastMessage, ToastSeverity } from '../../models/toast.model';

/** `summary` e `detail` sono chiavi Transloco: si traducono qui, quando il toast compare. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly translateService = inject(TranslocoService);
  private readonly state = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  public readonly toasts = this.state.asReadonly();

  public success(summary: string, detail: string): void {
    this.show('success', summary, detail);
  }

  public info(summary: string, detail: string): void {
    this.show('info', summary, detail);
  }

  public warn(summary: string, detail: string): void {
    this.show('warn', summary, detail);
  }

  public error(summary: string, detail: string): void {
    this.show('error', summary, detail);
  }

  // Toglie il messaggio e ferma il suo timer, così un messaggio chiuso a mano non fa partire una chiusura inutile
  public dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.state.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  // Aggiunge il messaggio, lo fa sparire da solo dopo la durata della sua severity e tiene al massimo TOAST_MAX_VISIBLE messaggi
  private show(severity: ToastSeverity, summary: string, detail: string): void {
    const id = this.nextId++;
    this.state.update((toasts) => [
      ...toasts,
      {
        id,
        severity,
        summary: this.translateService.translate(summary),
        detail: this.translateService.translate(detail),
      },
    ]);
    this.timers.set(
      id,
      setTimeout(() => this.dismiss(id), TOAST_DURATION_MS[severity]),
    );
    // Oltre il limite sparisce il più vecchio
    const [oldest] = this.state();
    if (this.state().length > TOAST_MAX_VISIBLE) this.dismiss(oldest.id);
  }
}
