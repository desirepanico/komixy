import { DestroyRef, Directive, inject, input, output, signal } from '@angular/core';
import { IGNORED_TARGETS } from '../../constants/navigation.const';
import { detectSwipe } from './detect-swipe/detect-swipe';

/**
 * Swipe di pagina sui gesti touch e penna, non col mouse; `data-no-swipe` esclude una zona.
 *   <main appSwipe (swipeLeft)="next()" (swipeRight)="back()">
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

  private readonly _start = signal<{ x: number; y: number } | null>(null);
  private readonly _cleanup = signal<(() => void) | null>(null);

  constructor() {
    inject(DestroyRef).onDestroy(() => this._releaseClick());
  }

  protected onPointerDown(event: PointerEvent): void {
    this._releaseClick();
    const target = event.target;
    const ignored = target instanceof Element && !!target.closest(IGNORED_TARGETS);

    if (event.pointerType === 'mouse' || ignored) {
      this.reset();
      return;
    }

    this._start.set({ x: event.clientX, y: event.clientY });
  }
  protected onPointerUp(event: PointerEvent): void {
    const start = this._start();
    if (!start) return;

    const direction = detectSwipe(
      event.clientX - start.x,
      event.clientY - start.y,
      this.swipeThreshold(),
    );
    this.reset();

    if (!direction) return;

    this._suppressNextClick();
    if (direction === 'left') this.swipeLeft.emit();
    else this.swipeRight.emit();
  }
  /** Il browser genera un click se il dito finisce sul link da cui è partito: va annullato */
  private _suppressNextClick(): void {
    this._releaseClick();
    const block = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    document.addEventListener('click', block, { capture: true, once: true });
    const timer = setTimeout(() => this._releaseClick(), 400);
    this._cleanup.set(() => {
      clearTimeout(timer);
      document.removeEventListener('click', block, { capture: true });
    });
  }
  private _releaseClick(): void {
    this._cleanup()?.();
    this._cleanup.set(null);
  }
  protected reset(): void {
    this._start.set(null);
  }
}
