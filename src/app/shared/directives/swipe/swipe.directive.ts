import { DestroyRef, Directive, inject, input, output } from '@angular/core';
import { IGNORED_TARGETS } from '../../constants/navigation.const';
import { detectSwipe } from './detect-swipe/detect-swipe';

/**
 * Emette `swipeLeft` e `swipeRight` sui gesti touch/penna (non col mouse).
 * Per escludere una zona (es. una lista che scorre) aggiungi `data-no-swipe`.
 *
 *   <main appSwipe (swipeLeft)="avanti()" (swipeRight)="indietro()">
 */
@Directive({
  selector: '[appSwipe]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'reset()',
  },
})
export class Swipe {
  /** Distanza minima in pixel per riconoscere lo swipe */
  public readonly swipeThreshold = input<number>(70);

  public readonly swipeLeft = output<void>();
  public readonly swipeRight = output<void>();

  private startX: number | null = null;
  private startY: number | null = null;

  protected onPointerDown(event: PointerEvent): void {
    this.releaseClick();
    const target = event.target;
    const ignored = target instanceof Element && !!target.closest(IGNORED_TARGETS);

    if (event.pointerType === 'mouse' || ignored) {
      this.reset();
      return;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.startX === null || this.startY === null) return;

    const direction = detectSwipe(
      event.clientX - this.startX,
      event.clientY - this.startY,
      this.swipeThreshold(),
    );
    this.reset();

    if (!direction) return;

    this.suppressNextClick();
    if (direction === 'left') this.swipeLeft.emit();
    else this.swipeRight.emit();
  }

  /** Se il dito finisce sullo stesso link da cui è partito, il browser genera un click: va annullato. */
  private suppressNextClick(): void {
    this.releaseClick();
    const block = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    document.addEventListener('click', block, { capture: true, once: true });
    const timer = setTimeout(() => this.releaseClick(), 400);
    this.releaseClick = () => {
      clearTimeout(timer);
      document.removeEventListener('click', block, { capture: true });
      this.releaseClick = () => undefined;
    };
  }

  private releaseClick: () => void = () => undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.releaseClick());
  }

  protected reset(): void {
    this.startX = null;
    this.startY = null;
  }
}
