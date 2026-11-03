import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matChevronLeftOutline, matChevronRightOutline } from '@ng-icons/material-symbols/outline';
import { Button } from '../button/button';

/**
 * Lista orizzontale con scroll nativo, snap e frecce (nascoste solo sui dispositivi touch, dove si scorre col dito; con il mouse restano visibili anche a finestra stretta).
 * Gli elementi si passano come contenuto e devono avere `shrink-0 snap-start` e una larghezza.
 * Con `bleed` (default) la lista esce dal padding della pagina (px-3, md:px-2) fino al bordo dello schermo.
 *
 *   <app-horizontal-scroller [ariaLabel]="'titolo' | transloco">
 *     <div class="w-40 shrink-0 snap-start">...</div>
 *   </app-horizontal-scroller>
 */
@Component({
  selector: 'app-horizontal-scroller',
  imports: [Button, NgIcon, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './horizontal-scroller.html',
  providers: [provideIcons({ matChevronLeftOutline, matChevronRightOutline })],
})
export class HorizontalScroller {
  /** Etichetta della lista per i lettori di schermo (già tradotta) */
  public ariaLabel = input.required<string>();
  /** Esce dal padding della pagina fino al bordo dello schermo */
  public bleed = input<boolean>(true);

  protected listClasses = computed(() => {
    const base =
      'flex min-w-0 touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-3 pt-1 outline-none scrollbar-none focus-visible:ring-2 focus-visible:ring-primary-400';
    const bleed = '-mx-3 px-3 scroll-px-3 md:-mx-2 md:px-2 md:scroll-px-2';
    return this.bleed() ? `${base} ${bleed}` : base;
  });

  protected canScrollLeft = signal<boolean>(false);
  protected canScrollRight = signal<boolean>(false);

  private list = viewChild.required<ElementRef<HTMLElement>>('list');
  private content = viewChild.required<ElementRef<HTMLElement>>('content');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Ricalcola quando cambiano le dimensioni della lista o del suo contenuto
      const observer = new ResizeObserver(() => this.updateScrollState());
      observer.observe(this.list().nativeElement);
      observer.observe(this.content().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
      this.updateScrollState();
    });
  }

  /** Aggiorna lo stato delle frecce in base alla posizione di scroll */
  protected updateScrollState(): void {
    const el = this.list().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.canScrollLeft.set(el.scrollLeft > 1);
    this.canScrollRight.set(el.scrollLeft < max - 1);
  }

  /** Scorre di una larghezza visibile: 1 = avanti, -1 = indietro */
  protected scroll(direction: 1 | -1): void {
    const el = this.list().nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: el.clientWidth * direction,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }
}
