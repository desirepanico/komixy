import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCollectionsBookmarkOutline } from '@ng-icons/material-symbols/outline';

@Component({
  selector: 'app-library-page',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './library-page.html',
  providers: [provideIcons({ matCollectionsBookmarkOutline })],
})
export class LibraryPage {}
