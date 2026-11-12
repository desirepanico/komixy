import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matTouchAppOutline } from '@ng-icons/material-symbols/outline';

/** Il testo, già tradotto, è il contenuto: <app-hint>{{ 'common.tapCardHint' | transloco }}</app-hint> */
@Component({
  selector: 'app-hint',
  imports: [NgIcon],
  providers: [provideIcons({ matTouchAppOutline })],
  templateUrl: './hint.html',
  host: {
    class: 'inline-flex items-center justify-center gap-2 text-center text-sm text-surface-300',
  },
})
export class Hint {}
