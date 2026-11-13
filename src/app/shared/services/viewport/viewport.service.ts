import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';

/** Larghezza della finestra e breakpoint (stessi valori di Tailwind: md = 768px, lg = 1024px). */
@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private readonly _window = inject(DOCUMENT).defaultView;

  private readonly _width = signal<number>(this._window?.innerWidth ?? 0);
  readonly isDesktop = computed(() => this._width() >= 1024);
  readonly isMobile = computed(() => this._width() < 768);
  readonly isTablet = computed(() => this._width() >= 768 && this._width() < 1024);
  readonly isMobileOrTablet = computed(() => this._width() < 1024);

  constructor() {
    // Il servizio è root: vive quanto l'app, quindi il listener non va rimosso
    this._window?.addEventListener('resize', () => this._width.set(this._window?.innerWidth ?? 0));
  }
}
