import { inject, provideAppInitializer } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { mainPageIndex } from './main-page-index/main-page-index';

/**
 * Imposta `data-nav-direction` ("forward" | "back") su <html> e, solo mentre la pagina cambia, `data-navigating`:
 * il nome di transizione della pagina non resta sempre acceso perché rompe il blur (backdrop-filter) dei suoi figli.
 */
export function provideNavDirection() {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const root = document.documentElement;

    router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // L'animazione dura 200ms dopo la fine della navigazione
        setTimeout(() => delete root.dataset['navigating'], 500);
        return;
      }
      if (!(event instanceof NavigationStart)) return;

      const from = mainPageIndex(router.url);
      const to = mainPageIndex(event.url);

      if (from >= 0 && to >= 0 && from !== to) {
        root.dataset['navDirection'] = to > from ? 'forward' : 'back';
        root.dataset['navigating'] = '';
      } else {
        delete root.dataset['navDirection'];
      }
    });
  });
}
