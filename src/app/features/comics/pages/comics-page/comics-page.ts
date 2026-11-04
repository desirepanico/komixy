import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-comics-page',
  imports: [TranslocoPipe],
  templateUrl: './comics-page.html',
})
export class ComicsPage {}
