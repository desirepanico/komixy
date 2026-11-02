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
 * Aggiunge l'attributo `data-in-view` all'elemento la prima volta che entra nello schermo.
 * Serve a far partire le animazioni solo quando si vedono:
 *
 *   <span appInView class="opacity-0 data-in-view:animate-xxx">
 */
@Directive({
  selector: '[appInView]',
  host: { '[attr.data-in-view]': 'inView() ? "" : null' },
})
export class InView {
  /** Quota dell'elemento che deve essere visibile (0-1) */
  public inViewThreshold = input<number>(0.4);

  protected inView = signal<boolean>(false);

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
            observer.disconnect(); // una volta sola
          }
        },
        { threshold: this.inViewThreshold() },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
