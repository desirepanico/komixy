import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matPersonOutline } from '@ng-icons/material-symbols/outline';

@Component({
  selector: 'app-profile-page',
  imports: [NgIcon, TranslocoPipe],
  templateUrl: './profile-page.html',
  providers: [provideIcons({ matPersonOutline })],
})
export class ProfilePage {}
