import { NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matPauseOutline,
  matPlayArrowOutline,
  matTouchAppOutline,
} from '@ng-icons/material-symbols/outline';
import { Tag } from '@shared/components/tag/tag';

/**
 * Il movimento è sempre in loop e un bottone lo mette in pausa (WCAG 2.2.2); con `prefers-reduced-motion`
 * le copertine fanno solo uno spostamento minimo. I bagliori sono decorativi (`aria-hidden`).
 */
@Component({
  selector: 'app-login-volumes',
  imports: [NgIcon, NgOptimizedImage, Tag, TranslocoPipe],
  templateUrl: './login-volumes.html',
  styleUrl: './login-volumes.css',
  encapsulation: ViewEncapsulation.None,
  providers: [provideIcons({ matPauseOutline, matPlayArrowOutline, matTouchAppOutline })],
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
      motion: '[--tilt:-10deg] [--delay:0s]',
      offset: 'mb-4 lg:mb-10',
    },
    {
      id: 'v-for-vendetta',
      title: 'V for Vendetta',
      author: 'Alan Moore, David Lloyd',
      kind: 'comic',
      src: 'img/covers/v-for-vendetta.webp',
      motion: '[--tilt:-3deg] [--delay:-1.5s]',
      offset: 'mb-0',
    },
    {
      id: 'chainsaw-man',
      title: 'Chainsaw Man',
      author: 'Tatsuki Fujimoto',
      kind: 'manga',
      src: 'img/covers/chainsaw-man.webp',
      motion: '[--tilt:4deg] [--delay:0s]',
      offset: 'mb-5 lg:mb-14',
    },
    {
      id: 'watchmen',
      title: 'Watchmen',
      author: 'Alan Moore, Dave Gibbons',
      kind: 'comic',
      src: 'img/covers/watchmen.webp',
      motion: '[--tilt:11deg] [--delay:-1.5s]',
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
   * Con il dito il primo tocco porta il volume in avanti e solo il secondo lo gira; con mouse e
   * tastiera il clic gira subito (il volume è già avanti con hover o focus).
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
