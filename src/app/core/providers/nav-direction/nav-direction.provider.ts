import { inject, provideAppInitializer } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { mainPageIndex } from '@shared/constants/navigation.const';

/**
 * Imposta `data-nav-direction` ("forward" | "back") su <html> quando si passa da una pagina
 * principale a un'altra. Il CSS in public/theme/page-transition.css lo usa per far scorrere la pagina.
 */
export function provideNavDirection() {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const root = document.documentElement;

    router.events.subscribe((event) => {
      if (!(event instanceof NavigationStart)) return;

      const from = mainPageIndex(router.url);
      const to = mainPageIndex(event.url);

      if (from >= 0 && to >= 0 && from !== to) {
        root.dataset['navDirection'] = to > from ? 'forward' : 'back';
      } else {
        delete root.dataset['navDirection'];
      }
    });
  });
}
