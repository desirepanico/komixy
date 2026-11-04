import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { matMenuBookOutline } from '@ng-icons/material-symbols/outline';
import { EmptyState } from '@shared/components/empty-state/empty-state';

@Component({
  selector: 'app-comics-page',
  imports: [EmptyState, TranslocoPipe],
  templateUrl: './comics-page.html',
  providers: [provideIcons({ matMenuBookOutline })],
})
export class ComicsPage {}
