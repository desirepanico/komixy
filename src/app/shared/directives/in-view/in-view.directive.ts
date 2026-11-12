import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Aggiunge `data-in-view` la prima volta che l'elemento entra nello schermo, per far partire le animazioni.
 *   <span appInView class="opacity-0 data-in-view:animate-xxx">
 */
@Directive({
  selector: '[appInView]',
  host: { '[attr.data-in-view]': 'inView() ? "" : null' },
})
export class InView {
  /** Quota dell'elemento che deve essere visibile (0-1) */
  public readonly inViewThreshold = input<number>(0.4);

  protected readonly inView = signal<boolean>(false);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Senza IntersectionObserver l'elemento viene mostrato subito
      if (typeof IntersectionObserver === 'undefined') {
        this.inView.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.inView.set(true);
            observer.disconnect();
          }
        },
        { threshold: this.inViewThreshold() },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
