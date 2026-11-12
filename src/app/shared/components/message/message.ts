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
 * Messaggio fisso (a differenza del toast non sparisce). Il contenuto viene dopo il testo, es. un link;
 * un `icon` diverso va registrato con `provideIcons` da chi lo usa.
 *   <app-message severity="primary" icon="matLockOutline" [label]="text"><a routerLink="/login">Iscriviti</a></app-message>
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
  /** Il tono è anche testo nascosto: non si capisce solo da colore e icona */
  protected readonly toneKey = computed(() =>
    this.severity() === 'primary' ? null : `message.${this.severity()}`,
  );
}
