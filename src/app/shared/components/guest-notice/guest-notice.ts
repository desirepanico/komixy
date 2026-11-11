import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLockOutline } from '@ng-icons/material-symbols/outline';
import { SessionService } from '../../services/session/session.service';

/**
 * Avviso per gli ospiti: dice cosa non possono fare e invita a iscriversi.
 *   <app-guest-notice [message]="'guestNotice.list' | transloco" />
 */
@Component({
  selector: 'app-guest-notice',
  imports: [RouterLink, TranslocoPipe, NgIcon],
  providers: [provideIcons({ matLockOutline })],
  templateUrl: './guest-notice.html',
  host: { class: 'block' },
})
export class GuestNotice {
  protected readonly session = inject(SessionService);

  /** Cosa non possono fare, già tradotto */
  public readonly message = input.required<string>();
}
