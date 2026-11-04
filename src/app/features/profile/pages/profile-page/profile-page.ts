import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-profile-page',
  imports: [TranslocoPipe],
  templateUrl: './profile-page.html',
})
export class ProfilePage {}
