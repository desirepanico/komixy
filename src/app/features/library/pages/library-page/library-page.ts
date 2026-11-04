import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-library-page',
  imports: [TranslocoPipe],
  templateUrl: './library-page.html',
})
export class LibraryPage {}
