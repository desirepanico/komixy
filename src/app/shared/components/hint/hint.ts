import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matTouchAppOutline } from '@ng-icons/material-symbols/outline';

/**
 * Suggerimento che fa capire che qualcosa è interattivo («Tocca una carta per vederla»): stessa icona,
 * stessa grandezza e stesso colore ovunque. Il testo si passa come contenuto, già tradotto.
 *   <app-hint>{{ 'common.tapCardHint' | transloco }}</app-hint>
 */
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
