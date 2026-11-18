import { computed, DOCUMENT, inject, Service, signal } from '@angular/core';

/** Larghezza della finestra e breakpoint (stessi valori di Tailwind: md = 768px, lg = 1024px). */
@Service()
export class ViewportService {
  private readonly _window = inject(DOCUMENT).defaultView;

  private readonly _width = signal<number>(this._window?.innerWidth ?? 0);
  public readonly isDesktop = computed(() => this._width() >= 1024);
  public readonly isMobile = computed(() => this._width() < 768);
  public readonly isTablet = computed(() => this._width() >= 768 && this._width() < 1024);
  public readonly isMobileOrTablet = computed(() => this._width() < 1024);

  public constructor() {
    // Il servizio è root: vive quanto l'app, quindi il listener non va rimosso
    this._window?.addEventListener('resize', () => this._width.set(this._window?.innerWidth ?? 0));
  }
}
