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
 * Il testo è il contenuto, già tradotto; `label` è un titolo facoltativo in grassetto. L'icona dipende
 * dal tono, ma si può cambiare con `icon`: in quel caso va registrata con `provideIcons` da chi lo usa.
 * Errori e avvisi sono annunciati subito (`role="alert"`), gli altri con calma (`role="status"`).
 *
 *   <app-message severity="warn" [label]="'form.warnTitle' | transloco">
 *     {{ 'form.warnText' | transloco }}
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
  /** Titolo in grassetto sopra il testo, già tradotto */
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
