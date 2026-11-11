import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { matLockOutline } from '@ng-icons/material-symbols/outline';
import { SessionService } from '../../services/session/session.service';
import { Message } from '../message/message';

/**
 * Avviso per gli ospiti: dice cosa non possono fare e invita a iscriversi. È un `app-message` nel tono
 * del marchio (`primary`) con il lucchetto e il link alla registrazione.
 *   <app-guest-notice [message]="'guestNotice.list' | transloco" />
 */
@Component({
  selector: 'app-guest-notice',
  imports: [RouterLink, TranslocoPipe, Message],
  providers: [provideIcons({ matLockOutline })],
  templateUrl: './guest-notice.html',
  host: { class: 'block' },
})
export class GuestNotice {
  protected readonly session = inject(SessionService);

  /** Cosa non possono fare, già tradotto */
  public readonly message = input.required<string>();
}
