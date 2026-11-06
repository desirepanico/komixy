import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matAutoStoriesOutline,
  matBookmarkOutline,
  matCollectionsBookmarkOutline,
  matMenuBookOutline,
  matStarOutline,
} from '@ng-icons/material-symbols/outline';

/**
 * Pannello di marca della login: logo, titolo e volumi che fluttuano su bagliori viola. Da 1024px in
 * su è la colonna di sinistra, sotto diventa una fascia sopra al form con le stesse animazioni.
 * Le animazioni sono decorative (`aria-hidden`) e con `prefers-reduced-motion` si fermano.
 */
@Component({
  selector: 'app-login-hero',
  imports: [TranslocoPipe, NgIcon],
  templateUrl: './login-hero.html',
  providers: [
    provideIcons({
      matAutoStoriesOutline,
      matBookmarkOutline,
      matCollectionsBookmarkOutline,
      matMenuBookOutline,
      matStarOutline,
    }),
  ],
  host: { class: 'relative block overflow-x-clip' },
})
export class LoginHero {
  /** Ogni volume ha il suo colore, inclinazione, altezza e ritardo, così non si muovono all'unisono */
  protected readonly volumes = [
    {
      icon: 'matAutoStoriesOutline',
      colors: 'from-primary-400 to-primary-700',
      motion: '[--tilt:-10deg] [animation-delay:-1s]',
      offset: 'mb-6 lg:mb-10',
    },
    {
      icon: 'matBookmarkOutline',
      colors: 'from-primary-600 to-primary-900',
      motion: '[--tilt:-3deg] [animation-delay:-3s]',
      offset: 'mb-0',
    },
    {
      icon: 'matStarOutline',
      colors: 'from-primary-500 to-primary-800',
      motion: '[--tilt:4deg] [animation-delay:-5s]',
      offset: 'mb-8 lg:mb-14',
    },
    {
      icon: 'matCollectionsBookmarkOutline',
      colors: 'from-surface-600 to-surface-900',
      motion: '[--tilt:11deg] [animation-delay:-2s]',
      offset: 'mb-2 lg:mb-4',
    },
  ];
}
