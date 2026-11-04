import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { matCalendarTodayOutline } from '@ng-icons/material-symbols/outline';
import { EmptyState } from '@shared/components/empty-state/empty-state';

@Component({
  selector: 'app-releases-page',
  imports: [EmptyState, TranslocoPipe],
  templateUrl: './releases-page.html',
  providers: [provideIcons({ matCalendarTodayOutline })],
})
export class ReleasesPage {}
