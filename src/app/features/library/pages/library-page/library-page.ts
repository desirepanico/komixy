import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { matCollectionsBookmarkOutline } from '@ng-icons/material-symbols/outline';
import { EmptyState } from '@shared/components/empty-state/empty-state';

@Component({
  selector: 'app-library-page',
  imports: [EmptyState, TranslocoPipe],
  templateUrl: './library-page.html',
  providers: [provideIcons({ matCollectionsBookmarkOutline })],
})
export class LibraryPage {}
