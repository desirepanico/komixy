import { Injectable, inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { MAIN_PAGES } from '../../constants/navigation.const';

function collectPaths(routes: Routes, prefix = ''): string[] {
  return routes.flatMap((route) => {
    const full = [prefix, route.path].filter(Boolean).join('/');
    return [`/${full}`, ...collectPaths(route.children ?? [], full)];
  });
}

@Injectable({
  providedIn: 'root',
})
export class MobileSwipeService {
  private readonly router = inject(Router);

  /** Pagine principali che hanno una rotta configurata (le altre vengono saltate). */
  private readonly routes = (() => {
    const existing = new Set(collectPaths(this.router.config));
    return MAIN_PAGES.map((page) => `/${page.route}`).filter((path) => existing.has(path));
  })();

  navigate(direction: 'left' | 'right'): void {
    const currentUrl = this.router.url.split(/[?#]/)[0];

    const currentIndex = this.routes.indexOf(currentUrl);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= this.routes.length) {
      return;
    }

    void this.router.navigateByUrl(this.routes[nextIndex]);
  }
}
