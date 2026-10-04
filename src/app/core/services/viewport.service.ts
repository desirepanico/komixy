import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private readonly width = signal(window.innerWidth);

  readonly isDesktop = () => this.width() >= 1024;

  readonly isMobile = () => this.width() < 768;

  readonly isTablet = () => this.width() >= 768 && this.width() < 1024;

  readonly isMobileOrTablet = () => this.width() < 1024;

  constructor() {
    window.addEventListener('resize', () => {
      this.width.set(window.innerWidth);
    });
  }
}
