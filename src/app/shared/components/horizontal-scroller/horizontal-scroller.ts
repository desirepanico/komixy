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
 * Accetta il pan orizzontale e quello verticale (touch-pan-x e touch-pan-y): con solo touch-pan-x il dito
 * sulle card bloccherebbe lo scroll della pagina. Gli elementi hanno `shrink-0 snap-start` e una larghezza.
 * Da tastiera la lista non prende il focus: si va con Tab tra gli elementi; ← → scorrono.
 */
@Component({
  selector: 'app-horizontal-scroller',
  imports: [Button, NgIcon, TranslocoPipe],
  templateUrl: './horizontal-scroller.html',
  providers: [provideIcons({ matChevronLeftOutline, matChevronRightOutline })],
})
export class HorizontalScroller {
  public readonly ariaLabel = input.required<string>();
  public readonly bleed = input<boolean>(true);

  protected readonly listClasses = computed(() => {
    const base =
      'flex min-w-0 touch-pan-x touch-pan-y snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-3 pt-1 scrollbar-none';
    const bleed = '-mx-3 px-3 scroll-px-3 md:-mx-2 md:px-2 md:scroll-px-2';
    return this.bleed() ? `${base} ${bleed}` : base;
  });

  protected readonly canScrollLeft = signal<boolean>(false);
  protected readonly canScrollRight = signal<boolean>(false);

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly prev = viewChild.required('prev', { read: ElementRef<HTMLElement> });
  private readonly next = viewChild.required('next', { read: ElementRef<HTMLElement> });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.updateScrollState());
      observer.observe(this.list().nativeElement);
      observer.observe(this.content().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
      this.updateScrollState();
    });
  }

  protected updateScrollState(): void {
    const el = this.list().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft < max - 1;
    this.canScrollLeft.set(left);
    this.canScrollRight.set(right);

    // Se la freccia che ha il focus sta per sparire (inizio/fine lista), il focus passa all'altra freccia
    const active = document.activeElement;
    if (!left && right && active === this.prev().nativeElement) this.next().nativeElement.focus();
    if (!right && left && active === this.next().nativeElement) this.prev().nativeElement.focus();
  }

  protected scroll(direction: 1 | -1): void {
    const el = this.list().nativeElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: el.clientWidth * direction,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }
}
