import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMenuBookOutline, matTouchAppOutline } from '@ng-icons/material-symbols/outline';
import { Tag } from '@shared/components/tag/tag';

/**
 * Pannello di marca della login: logo, titolo e copertine vere che fluttuano su bagliori viola.
 * Ogni copertina è un bottone che la gira come una carta e mostra titolo, autore e tipo; un secondo
 * clic la rigira. È solo una curiosità: non aggiunge nulla alla libreria. I bagliori sono decorativi
 * (`aria-hidden`) e con `prefers-reduced-motion` le animazioni si fermano.
 */
@Component({
  selector: 'app-login-hero',
  imports: [NgIcon, NgOptimizedImage, Tag, TranslocoPipe],
  templateUrl: './login-hero.html',
  providers: [provideIcons({ matMenuBookOutline, matTouchAppOutline })],
  host: { class: 'relative block' },
})
export class LoginHero {
  /** Ogni copertina ha la sua inclinazione, altezza e ritardo, così non si muovono all'unisono */
  protected readonly covers = [
    {
      id: 'one-piece',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      kind: 'manga',
      src: 'img/covers/one-piece.webp',
      motion: '[--tilt:-10deg] [animation-delay:-1s]',
      offset: 'mb-4 lg:mb-10',
    },
    {
      id: 'v-for-vendetta',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      kind: 'comic',
      src: 'img/covers/v-for-vendetta.webp',
      motion: '[--tilt:-3deg] [animation-delay:-3s]',
      offset: 'mb-0',
    },
    {
      id: 'chainsaw-man',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      kind: 'manga',
      src: 'img/covers/chainsaw-man.webp',
      motion: '[--tilt:4deg] [animation-delay:-5s]',
      offset: 'mb-5 lg:mb-14',
    },
    {
      id: 'watchmen',
      title: 'Watchmen',
      author: 'Alan Moore, Dave Gibbons',
      kind: 'comic',
      src: 'img/covers/watchmen.webp',
      motion: '[--tilt:11deg] [animation-delay:-2s]',
      offset: 'mb-1 lg:mb-4',
    },
  ];

  protected readonly flipped = signal<ReadonlySet<string>>(new Set());

  protected toggle(id: string): void {
    this.flipped.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }
}
