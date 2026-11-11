import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matCheckCircleOutline,
  matErrorOutline,
  matInfoOutline,
  matWarningOutline,
} from '@ng-icons/material-symbols/outline';
import { MESSAGE_STYLES } from '../../constants/ui.const';
import { MessageSeverity } from '../../models/message.model';

/**
 * Messaggio fisso (non sparisce da solo, a differenza del toast) per info, successo, avvisi ed errori.
 * Input: `severity` (il tono), `label` (il testo, già tradotto) e `icon` (se si vuole un'icona diversa
 * da quella del tono: va registrata con `provideIcons` da chi lo usa). Se serve altro, per esempio un
 * link dopo il testo, si mette come contenuto. Errori e avvisi sono annunciati subito (`role="alert"`),
 * gli altri con calma (`role="status"`).
 *
 *   <app-message severity="warn" [label]="'form.warnText' | transloco" />
 *   <app-message severity="primary" icon="matLockOutline" [label]="testo">
 *     <a routerLink="/login">Iscriviti</a>
 *   </app-message>
 */
@Component({
  selector: 'app-message',
  imports: [NgIcon, TranslocoPipe],
  providers: [
    provideIcons({ matCheckCircleOutline, matErrorOutline, matInfoOutline, matWarningOutline }),
  ],
  templateUrl: './message.html',
  host: { class: 'block' },
})
export class Message {
  /** primary = tono del marchio (inviti), info, success, warn, error */
  public readonly severity = input<MessageSeverity>('info');
  /** Il testo del messaggio, già tradotto; il contenuto del componente viene dopo */
  public readonly label = input<string>();
  /** Nome di un'altra icona al posto di quella del tono */
  public readonly icon = input<string>();

  protected readonly styles = computed(() => MESSAGE_STYLES[this.severity()]);
  protected readonly iconName = computed(() => this.icon() ?? this.styles().icon);
  protected readonly role = computed(() =>
    this.severity() === 'warn' || this.severity() === 'error' ? 'alert' : 'status',
  );
  /** Il tono non si capisce solo dal colore e dall'icona: gli screen reader lo sentono dal testo nascosto */
  protected readonly toneKey = computed(() =>
    this.severity() === 'primary' ? null : `message.${this.severity()}`,
  );
}
