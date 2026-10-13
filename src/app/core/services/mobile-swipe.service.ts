import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
//Servizio
export class MobileSwipeService {
  private readonly router = inject(Router);

  /**
   * Ordine delle pagine nella navigazione mobile.
   * Deve corrispondere alle route configurate in app.routes.ts.
   */
  private readonly routes = ['/discover', '/releases', '/scan', '/library', '/profile'];

  navigate(direction: 'left' | 'right'): void {
    // Rimuove query string e fragment dall'URL corrente.
    const currentUrl = this.router.url.split(/[?#]/)[0];

    // Lo swipe funziona solo sulle route principali elencate.
    const currentIndex = this.routes.indexOf(currentUrl);

    if (currentIndex === -1) {
      return;
    }

    // Sinistra: pagina successiva.
    // Destra: pagina precedente.
    const nextIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;

    // Non uscire dai limiti della navigazione.
    if (nextIndex < 0 || nextIndex >= this.routes.length) {
      return;
    }

    void this.router.navigateByUrl(this.routes[nextIndex]);
  }
}
