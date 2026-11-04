import { Directive, input, output } from '@angular/core';
import { detectSwipe } from './detect-swipe/detect-swipe';

/** Elementi su cui un gesto non deve essere considerato uno swipe di pagina. */
const IGNORED_TARGETS = [
  'button',
  'a',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[role="slider"]',
  '[data-no-swipe]',
].join(',');

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

    if (direction === 'left') this.swipeLeft.emit();
    if (direction === 'right') this.swipeRight.emit();
  }

  protected reset(): void {
    this.startX = null;
    this.startY = null;
  }
}
