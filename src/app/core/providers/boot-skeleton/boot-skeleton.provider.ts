import { afterNextRender, inject, Injector, provideAppInitializer } from '@angular/core';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter, take } from 'rxjs';

/** Se la prima navigazione non finisce mai, lo skeleton non deve restare per sempre */
const BOOT_SKELETON_TIMEOUT_MS = 10_000;

/**
 * Toglie lo skeleton di avvio di `index.html` (`#skeleton`) quando la prima pagina è già disegnata.
 * Finché c'è, `app-root` è nascosto dal CSS di `index.html`: così non si vede lo sfondo vuoto
 * mentre il browser scarica i chunk lazy del layout e della pagina.
 * Un reindirizzamento (guard) annulla la prima navigazione ma ne avvia subito un'altra:
 * per questo si aspetta una navigazione finita o in errore, non una annullata.
 */
export function provideBootSkeleton() {
  return provideAppInitializer(() => {
    const router = inject(Router);
    const injector = inject(Injector);

    const remove = () => document.getElementById('skeleton')?.remove();
    const timer = setTimeout(remove, BOOT_SKELETON_TIMEOUT_MS);

    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd || event instanceof NavigationError),
        take(1),
      )
      .subscribe(() => {
        clearTimeout(timer);
        // Dopo il prossimo disegno, quando la pagina è già nel DOM
        afterNextRender(remove, { injector });
      });
  });
}
