import { afterNextRender, DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

/**
 * Dice se l'elemento è nello schermo, ogni volta che cambia (a differenza di `appInView`, che scatta una volta sola).
 *   <div appViewportVisible (viewportVisibleChange)="barVisible.set($event)">
 */
@Directive({ selector: '[appViewportVisible]' })
export class ViewportVisible {
  public readonly viewportVisibleChange = output<boolean>();

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Senza IntersectionObserver l'elemento conta come visibile
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(([entry]) =>
        this.viewportVisibleChange.emit(entry.isIntersecting),
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
