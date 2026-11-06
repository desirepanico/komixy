import { NgOptimizedImage } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCheckOutline, matMenuBookOutline } from '@ng-icons/material-symbols/outline';

/**
 * Pannello di marca della login: logo, titolo e copertine vere che fluttuano su bagliori viola.
 * Le copertine sono un gioco: ognuna è un bottone «ce l'ho» che la colora e la mette in evidenza,
 * un secondo clic la toglie (non salva nulla). I bagliori sono decorativi (`aria-hidden`) e con
 * `prefers-reduced-motion` le animazioni si fermano.
 */
@Component({
  selector: 'app-login-hero',
  imports: [NgIcon, NgOptimizedImage, TranslocoPipe],
  templateUrl: './login-hero.html',
  providers: [provideIcons({ matCheckOutline, matMenuBookOutline })],
  host: { class: 'relative block' },
})
export class LoginHero {
  /** Ogni copertina ha la sua inclinazione, altezza e ritardo, così non si muovono all'unisono */
  protected readonly covers = [
    {
      id: 'berserk',
      title: 'Berserk',
      src: 'img/covers/berserk.webp',
      motion: '[--tilt:-10deg] [animation-delay:-1s]',
      offset: 'mb-6 lg:mb-10',
    },
    {
      id: 'watchmen',
      title: 'Watchmen',
      src: 'img/covers/watchmen.webp',
      motion: '[--tilt:-3deg] [animation-delay:-3s]',
      offset: 'mb-0',
    },
    {
      id: 'akira',
      title: 'Akira',
      src: 'img/covers/akira.webp',
      motion: '[--tilt:4deg] [animation-delay:-5s]',
      offset: 'mb-8 lg:mb-14',
    },
    {
      id: 'saga',
      title: 'Saga',
      src: 'img/covers/saga.webp',
      motion: '[--tilt:11deg] [animation-delay:-2s]',
      offset: 'mb-2 lg:mb-4',
    },
  ];

  protected readonly owned = signal<ReadonlySet<string>>(new Set());
  protected readonly ownedCount = computed(() => this.owned().size);

  protected toggle(id: string): void {
    this.owned.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }
}
