import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MobileSwipeService } from '../services/mobile-swipe.service';
import { ViewportService } from '../services/viewport.service';
import { DesktopSidebar } from './components/desktop-sidebar/desktop-sidebar';
import { MobileBottomNav } from './components/mobile-bottom-nav/mobile-bottom-nav';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MobileBottomNav, DesktopSidebar],
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly viewport = inject(ViewportService);

  private readonly mobileSwipeService = inject(MobileSwipeService);
  private readonly viewportService = inject(ViewportService);

  private startX: number | null = null;
  private startY: number | null = null;
  private ignoreSwipe = false;

  // Distanza minima per riconoscere uno swipe.
  private readonly swipeThreshold = 70;

  onSwipePointerDown(event: PointerEvent): void {
    // Disattiva lo swipe con il mouse.
    if (event.pointerType === 'mouse') {
      this.resetSwipe();
      return;
    }

    // Lo swipe è disponibile solo su mobile e tablet.
    if (!this.viewportService.isMobileOrTablet()) {
      this.resetSwipe();
      return;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;

    // Non intercettare gesti iniziati su elementi interattivi.
    const target = event.target;

    this.ignoreSwipe =
      target instanceof Element &&
      !!target.closest(
        [
          'button',
          'a',
          'input',
          'textarea',
          'select',
          'label',
          '[role="button"]',
          '[role="slider"]',
          '[data-no-swipe]',
        ].join(','),
      );
  }

  onSwipePointerUp(event: PointerEvent): void {
    if (
      this.startX === null ||
      this.startY === null ||
      this.ignoreSwipe ||
      !this.viewportService.isMobileOrTablet() ||
      event.pointerType === 'mouse'
    ) {
      this.resetSwipe();
      return;
    }

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    // Deve essere un gesto orizzontale sufficientemente ampio.
    const isHorizontalSwipe =
      Math.abs(deltaX) >= this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

    if (isHorizontalSwipe) {
      this.mobileSwipeService.navigate(deltaX < 0 ? 'left' : 'right');
    }

    this.resetSwipe();
  }

  onSwipePointerCancel(): void {
    this.resetSwipe();
  }

  private resetSwipe(): void {
    this.startX = null;
    this.startY = null;
    this.ignoreSwipe = false;
  }
}
