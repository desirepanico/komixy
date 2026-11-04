import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-releases-page',
  imports: [TranslocoPipe],
  templateUrl: './releases-page.html',
})
export class ReleasesPage {}
