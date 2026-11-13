import {
  afterNextRender,
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
 * Gli elementi sono il contenuto e hanno `shrink-0 snap-start` e una larghezza. Con `bleed` (default)
 * la lista esce dal padding della pagina. Accetta pan orizzontale e verticale: con solo `touch-pan-x`
 * il dito sulle card bloccherebbe lo scroll della pagina.
 *   <app-horizontal-scroller [ariaLabel]="'titolo' | transloco"><div class="w-40 shrink-0 snap-start">...</div></app-horizontal-scroller>
 */
@Component({
  selector: 'app-horizontal-scroller',
  imports: [Button, NgIcon, TranslocoPipe],
  templateUrl: './horizontal-scroller.html',
  providers: [provideIcons({ matChevronLeftOutline, matChevronRightOutline })],
})
export class HorizontalScroller {
  private readonly _list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly _content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly _prev = viewChild.required('prev', { read: ElementRef<HTMLElement> });
  private readonly _next = viewChild.required('next', { read: ElementRef<HTMLElement> });

  /** Etichetta della lista per i lettori di schermo (già tradotta) */
  public readonly ariaLabel = input.required<string>();
  /** Esce dal padding della pagina fino al bordo dello schermo */
  public readonly bleed = input<boolean>(true);

  protected readonly listClasses = computed(() => {
    const base =
      'flex min-w-0 touch-pan-x touch-pan-y snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-3 pt-1 scrollbar-none';
    const bleed = '-mx-3 px-3 scroll-px-3 md:-mx-2 md:px-2 md:scroll-px-2';
    return this.bleed() ? `${base} ${bleed}` : base;
  });
  protected readonly canScrollLeft = signal<boolean>(false);
  protected readonly canScrollRight = signal<boolean>(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Ricalcola quando cambiano le dimensioni della lista o del suo contenuto
      const observer = new ResizeObserver(() => this.updateScrollState());
      observer.observe(this._list().nativeElement);
      observer.observe(this._content().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
      this.updateScrollState();
    });
  }

  /** Aggiorna lo stato delle frecce in base alla posizione di scroll */
  protected updateScrollState(): void {
    const el = this._list().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft < max - 1;
    this.canScrollLeft.set(left);
    this.canScrollRight.set(right);

    // Se la freccia che ha il focus sta per sparire (inizio/fine lista), il focus passa all'altra freccia
    const active = document.activeElement;
    if (!left && right && active === this._prev().nativeElement) this._next().nativeElement.focus();
    if (!right && left && active === this._next().nativeElement) this._prev().nativeElement.focus();
  }
  /** Scorre di una larghezza visibile: 1 = avanti, -1 = indietro */
  protected scroll(direction: 1 | -1): void {
    const el = this._list().nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: el.clientWidth * direction,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }
}
