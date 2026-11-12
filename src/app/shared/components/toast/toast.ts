import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matCheckCircleOutline,
  matCloseOutline,
  matErrorOutline,
  matInfoOutline,
  matWarningOutline,
} from '@ng-icons/material-symbols/outline';
import { TOAST_STYLES } from '../../constants/ui.const';
import { ToastSeverity } from '../../models/toast.model';
import { ToastService } from '../../services/toast/toast.service';

/** Va montato una sola volta, in `app.html`: mostra i messaggi di `ToastService` in alto (a tutta larghezza su mobile, a destra da 768px). */
@Component({
  selector: 'app-toast',
  imports: [TranslocoPipe, NgIcon, NgTemplateOutlet],
  templateUrl: './toast.html',
  providers: [
    provideIcons({
      matCheckCircleOutline,
      matCloseOutline,
      matErrorOutline,
      matInfoOutline,
      matWarningOutline,
    }),
  ],
  host: {
    class:
      'pointer-events-none fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-50 flex flex-col md:inset-x-auto md:right-6 md:w-88',
  },
})
export class Toast {
  protected readonly toastService = inject(ToastService);

  // `let-toast` del template è senza tipo: qui la severity torna a essere tipizzata
  protected style(severity: ToastSeverity): (typeof TOAST_STYLES)[ToastSeverity] {
    return TOAST_STYLES[severity];
  }
}
