import { NgOptimizedImage } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matMenuBookOutline,
  matPauseOutline,
  matPlayArrowOutline,
  matTouchAppOutline,
} from '@ng-icons/material-symbols/outline';
import { Tag } from '@shared/components/tag/tag';

/**
 * Pannello di marca della login: logo, titolo e copertine vere che fluttuano su bagliori viola.
 * Ogni copertina è un bottone che la gira come una carta e mostra titolo, autore e tipo; un secondo
 * clic la rigira (con il dito il primo tocco la porta in avanti, il secondo la gira). È solo una curiosità: non aggiunge nulla alla libreria. I bagliori sono decorativi
 * (`aria-hidden`). Con `prefers-reduced-motion` le copertine fanno solo uno spostamento minimo, sempre in loop;
 * in ogni caso un bottone mette in pausa e riprende il movimento (WCAG 2.2.2).
 */
@Component({
  selector: 'app-login-volumes',
  imports: [NgIcon, NgOptimizedImage, Tag, TranslocoPipe],
  templateUrl: './login-volumes.html',
  providers: [
    provideIcons({ matMenuBookOutline, matPauseOutline, matPlayArrowOutline, matTouchAppOutline }),
  ],
  host: { class: 'relative block max-lg:contents' },
})
export class LoginVolumes {
  /** Ogni copertina ha la sua inclinazione e altezza; il ritardo alterna 0 e metà ciclo, così quando una sale l'altra scende */
  protected readonly covers = [
    {
      id: 'one-piece',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      kind: 'manga',
      src: 'img/covers/one-piece.webp',
      motion: '[--tilt:-10deg] [animation-delay:0s]',
      offset: 'mb-4 lg:mb-10',
    },
    {
      id: 'v-for-vendetta',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      kind: 'comic',
      src: 'img/covers/v-for-vendetta.webp',
      motion: '[--tilt:-3deg] [animation-delay:-2s] motion-reduce:[animation-delay:-2s]',
      offset: 'mb-0',
    },
    {
      id: 'chainsaw-man',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      kind: 'manga',
      src: 'img/covers/chainsaw-man.webp',
      motion: '[--tilt:4deg] [animation-delay:0s]',
      offset: 'mb-5 lg:mb-14',
    },
    {
      id: 'watchmen',
      title: 'Watchmen',
      author: 'Alan Moore, Dave Gibbons',
      kind: 'comic',
      src: 'img/covers/watchmen.webp',
      motion: '[--tilt:11deg] [animation-delay:-2s] motion-reduce:[animation-delay:-2s]',
      offset: 'mb-1 lg:mb-4',
    },
  ];

  protected readonly flipped = signal<ReadonlySet<string>>(new Set());
  protected readonly selected = signal<string | null>(null);
  protected readonly paused = signal<boolean>(false);
  protected readonly playState = computed(() => (this.paused() ? 'paused' : 'running'));

  protected toggleAnimation(): void {
    this.paused.update((value) => !value);
  }

  /**
   * Con il dito il primo tocco porta il volume in avanti e solo il secondo lo gira, così si vede
   * cosa si sta per girare. Con mouse e tastiera il clic gira subito (il volume va in avanti già
   * con l'hover o il focus).
   */
  protected onCover(id: string, event: MouseEvent): void {
    const isTouch = (event as PointerEvent).pointerType === 'touch';
    if (isTouch && this.selected() !== id) {
      this.selected.set(id);
      return;
    }
    this.selected.set(id);
    this.toggle(id);
  }

  private toggle(id: string): void {
    this.flipped.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }
}
