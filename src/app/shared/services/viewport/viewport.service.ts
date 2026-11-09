import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';

/** Stessi breakpoint di Tailwind (md = 768px, lg = 1024px). */
@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly width = signal<number>(this.window?.innerWidth ?? 0);

  readonly isDesktop = computed(() => this.width() >= 1024);
  readonly isMobile = computed(() => this.width() < 768);
  readonly isTablet = computed(() => this.width() >= 768 && this.width() < 1024);
  readonly isMobileOrTablet = computed(() => this.width() < 1024);

  constructor() {
    // Il servizio è root: vive quanto l'app, quindi il listener non va rimosso
    this.window?.addEventListener('resize', () => this.width.set(this.window?.innerWidth ?? 0));
  }
}
