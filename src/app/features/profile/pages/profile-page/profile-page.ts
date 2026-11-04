import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { matPersonOutline } from '@ng-icons/material-symbols/outline';
import { EmptyState } from '@shared/components/empty-state/empty-state';

@Component({
  selector: 'app-profile-page',
  imports: [EmptyState, TranslocoPipe],
  templateUrl: './profile-page.html',
  providers: [provideIcons({ matPersonOutline })],
})
export class ProfilePage {}
