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
  public readonly severity = input<MessageSeverity>('info');
  public readonly label = input<string>();
  public readonly icon = input<string>();

  protected readonly styles = computed(() => MESSAGE_STYLES[this.severity()]);
  protected readonly iconName = computed(() => this.icon() ?? this.styles().icon);
  protected readonly role = computed(() =>
    this.severity() === 'warn' || this.severity() === 'error' ? 'alert' : 'status',
  );
  protected readonly toneKey = computed(() =>
    this.severity() === 'primary' ? null : `message.${this.severity()}`,
  );
}
